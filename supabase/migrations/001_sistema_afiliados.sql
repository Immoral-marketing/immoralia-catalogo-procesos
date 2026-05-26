-- ============================================================
-- Sistema de Afiliados v1 · Immoral Group · Abril 2026
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- ------------------------------------------------------------
-- TABLA: partners
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.partners (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  nombre      text NOT NULL,
  email       text UNIQUE NOT NULL,
  slug        text UNIQUE NOT NULL,  -- usado en ?ref=slug
  activo      boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- TABLA: referral_clicks
-- Escritura pública (visitantes anónimos), lectura solo autenticados
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.referral_clicks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id  uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  ip_hash     text,  -- hash de IP (opcional, se puede rellenar desde Edge Function)
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- TABLA: solicitudes
-- Insert público (visitantes que envían formulario), lectura solo propia
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.solicitudes (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id        uuid REFERENCES public.partners(id) ON DELETE SET NULL,
  datos_formulario  jsonb NOT NULL DEFAULT '{}',
  estado            text NOT NULL DEFAULT 'pendiente',
    -- pendiente | en_proceso | aprobada | cerrada | pagada
  importe_cobrado   numeric,
  override_manual   boolean NOT NULL DEFAULT false,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS solicitudes_updated_at ON public.solicitudes;
CREATE TRIGGER solicitudes_updated_at
  BEFORE UPDATE ON public.solicitudes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------
-- TABLA: comisiones
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comisiones (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitud_id     uuid NOT NULL REFERENCES public.solicitudes(id) ON DELETE CASCADE,
  partner_id       uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  porcentaje       numeric NOT NULL DEFAULT 15,
  importe_base     numeric NOT NULL,      -- importe_cobrado de la solicitud
  importe_comision numeric NOT NULL,      -- importe_base * 0.15
  estado           text NOT NULL DEFAULT 'pendiente',
    -- pendiente | confirmada | pagada
  created_at       timestamptz NOT NULL DEFAULT now(),
  pagada_at        timestamptz
);

-- ------------------------------------------------------------
-- FUNCIÓN: get_partner_id_by_slug
-- SECURITY DEFINER permite que usuarios anónimos consulten
-- el partner_id sin acceso directo a la tabla partners
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_partner_id_by_slug(p_slug text)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT id FROM public.partners
  WHERE slug = p_slug AND activo = true
  LIMIT 1;
$$;

-- Permitir ejecución a todos (anon + authenticated)
GRANT EXECUTE ON FUNCTION public.get_partner_id_by_slug(text) TO anon, authenticated;

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------

-- PARTNERS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Partner puede leer su propio registro (vinculado por user_id de Supabase Auth)
CREATE POLICY "partner_read_own" ON public.partners
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- REFERRAL_CLICKS
ALTER TABLE public.referral_clicks ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede insertar (visitantes anónimos)
CREATE POLICY "clicks_insert_public" ON public.referral_clicks
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Partner puede contar sus propios clicks
CREATE POLICY "clicks_read_own" ON public.referral_clicks
  FOR SELECT TO authenticated
  USING (
    partner_id = (SELECT id FROM public.partners WHERE user_id = auth.uid())
  );

-- SOLICITUDES
ALTER TABLE public.solicitudes ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede insertar (visitantes anónimos que envían el formulario)
CREATE POLICY "solicitudes_insert_public" ON public.solicitudes
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Partner puede leer sus propias solicitudes (sin ver datos_formulario del cliente)
CREATE POLICY "solicitudes_read_own" ON public.solicitudes
  FOR SELECT TO authenticated
  USING (
    partner_id = (SELECT id FROM public.partners WHERE user_id = auth.uid())
  );

-- COMISIONES
ALTER TABLE public.comisiones ENABLE ROW LEVEL SECURITY;

-- Partner puede leer sus propias comisiones
CREATE POLICY "comisiones_read_own" ON public.comisiones
  FOR SELECT TO authenticated
  USING (
    partner_id = (SELECT id FROM public.partners WHERE user_id = auth.uid())
  );

-- ------------------------------------------------------------
-- ÍNDICES para rendimiento
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_referral_clicks_partner_id ON public.referral_clicks(partner_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_partner_id ON public.solicitudes(partner_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON public.solicitudes(estado);
CREATE INDEX IF NOT EXISTS idx_comisiones_partner_id ON public.comisiones(partner_id);
CREATE INDEX IF NOT EXISTS idx_comisiones_solicitud_id ON public.comisiones(solicitud_id);

-- ------------------------------------------------------------
-- NOTAS DE USO
-- ------------------------------------------------------------
-- 1. Para crear un partner desde el admin, el Super Admin debe:
--    a) Crear el usuario en Supabase Auth (Dashboard > Authentication > Users)
--    b) Anotar el UUID del usuario creado
--    c) Insertar en public.partners:
--       INSERT INTO public.partners (user_id, nombre, email, slug)
--       VALUES ('<uuid>', 'Maggie', 'maggie@ejemplo.com', 'maggie');
--
-- 2. Las operaciones de admin (cambiar estado, registrar cobro, crear comisión)
--    se hacen desde admin.immoralia.es usando la service_role key (bypassa RLS).
--
-- 3. La comisión se crea manualmente desde admin cuando estado pasa a "aprobada":
--    INSERT INTO public.comisiones (solicitud_id, partner_id, importe_base, importe_comision)
--    VALUES ('<sol_id>', '<partner_id>', <importe>, <importe * 0.15>);
-- ------------------------------------------------------------
