-- ============================================================
-- Super Admins · Sistema de Afiliados v1 · Abril 2026
-- Ejecutar DESPUÉS de 001_sistema_afiliados.sql
-- ============================================================

-- ------------------------------------------------------------
-- TABLA: super_admins
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.super_admins (
  user_id    uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre     text NOT NULL,
  email      text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.super_admins ENABLE ROW LEVEL SECURITY;

-- Super admin puede leer su propio registro (para verificar acceso)
CREATE POLICY "super_admins_read_own" ON public.super_admins
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ------------------------------------------------------------
-- FUNCIÓN HELPER: is_super_admin()
-- Usada en todas las políticas RLS de admin
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.super_admins WHERE user_id = auth.uid()
  );
$$;

-- ------------------------------------------------------------
-- POLÍTICAS RLS ADICIONALES PARA SUPER ADMINS
-- Se añaden sobre las tablas creadas en la migración 001
-- (Supabase usa OR entre políticas: si alguna pasa, se permite)
-- ------------------------------------------------------------

-- partners: super_admin tiene acceso total
CREATE POLICY "super_admin_all_partners" ON public.partners
  FOR ALL TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- referral_clicks: super_admin puede leer todo
CREATE POLICY "super_admin_read_clicks" ON public.referral_clicks
  FOR SELECT TO authenticated
  USING (public.is_super_admin());

-- solicitudes: super_admin tiene acceso total
CREATE POLICY "super_admin_all_solicitudes" ON public.solicitudes
  FOR ALL TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- comisiones: super_admin tiene acceso total
CREATE POLICY "super_admin_all_comisiones" ON public.comisiones
  FOR ALL TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- ------------------------------------------------------------
-- SEED: insertar los 3 Super Admins
-- Proceso:
--   1. Crear usuario en Supabase Auth (Dashboard > Authentication > Users)
--   2. Copiar el UUID
--   3. Descomentar y ejecutar el INSERT correspondiente
-- ------------------------------------------------------------

-- INSERT INTO public.super_admins (user_id, nombre, email)
-- VALUES ('UUID-DAVID',  'David Navarrete', 'david@immoral.com');

-- INSERT INTO public.super_admins (user_id, nombre, email)
-- VALUES ('UUID-MARCO',  'Marco Sapiña', 'marco@immoral.com');

-- INSERT INTO public.super_admins (user_id, nombre, email)
-- VALUES ('UUID-MANEL',  'Manel', 'manel@immoral.com');

-- ------------------------------------------------------------
-- GRANT para la Edge Function create-partner (service_role)
-- La service_role bypassa RLS por defecto, no necesita grants
-- extra. Este comentario es solo informativo.
-- ------------------------------------------------------------
