-- ============================================================
-- Facturas de afiliados · Immoral Group · Abril 2026
-- ============================================================

-- 1. Columna factura_url en comisiones
ALTER TABLE public.comisiones
  ADD COLUMN IF NOT EXISTS factura_url text;

-- 2. Bucket de almacenamiento (privado, 10 MB, PDF e imágenes)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'facturas-afiliados',
  'facturas-afiliados',
  false,
  10485760,
  ARRAY['application/pdf','image/jpeg','image/png','image/jpg','image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 3. RLS en storage.objects
-- Partner: subir y leer sus propios archivos
CREATE POLICY "partner_insert_facturas" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'facturas-afiliados'
    AND (storage.foldername(name))[1] = (
      SELECT id::text FROM public.partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "partner_update_facturas" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'facturas-afiliados'
    AND (storage.foldername(name))[1] = (
      SELECT id::text FROM public.partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "partner_read_facturas" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'facturas-afiliados'
    AND (storage.foldername(name))[1] = (
      SELECT id::text FROM public.partners WHERE user_id = auth.uid()
    )
  );

-- Super admin: leer y borrar todos los archivos
CREATE POLICY "super_admin_read_facturas" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'facturas-afiliados'
    AND public.is_super_admin()
  );

CREATE POLICY "super_admin_delete_facturas" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'facturas-afiliados'
    AND public.is_super_admin()
  );

-- 4. Función RPC segura para que el partner actualice solo su factura_url
--    (evita exponer UPDATE general sobre la tabla comisiones)
CREATE OR REPLACE FUNCTION public.set_comision_factura_url(
  p_comision_id uuid,
  p_factura_url text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_partner_id uuid;
BEGIN
  SELECT id INTO v_partner_id
  FROM public.partners
  WHERE user_id = auth.uid();

  IF v_partner_id IS NULL THEN
    RAISE EXCEPTION 'No partner account found for this user';
  END IF;

  UPDATE public.comisiones
  SET factura_url = p_factura_url
  WHERE id = p_comision_id
    AND partner_id = v_partner_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_comision_factura_url(uuid, text) TO authenticated;
