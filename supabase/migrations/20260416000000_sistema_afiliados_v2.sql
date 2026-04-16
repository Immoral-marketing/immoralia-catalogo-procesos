-- ============================================================
-- Sistema de Afiliados v2 · Immoral Group · Abril 2026
-- Generación automática de comisiones por trigger SQL
-- ============================================================

-- 1. Cambiar porcentaje por defecto a 10 (era 15 en v1)
ALTER TABLE public.comisiones
  ALTER COLUMN porcentaje SET DEFAULT 10;

-- 2. Función del trigger
--    Dispara cuando una solicitud pasa a estado 'cerrada' con
--    partner_id no nulo e importe_cobrado > 0.
--    También gestiona re-apertura y cambio de importe.
CREATE OR REPLACE FUNCTION public.fn_comision_por_cierre()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN

  -- ── CASO 1: solicitud se cierra con condiciones cumplidas ──────────────────
  IF NEW.estado = 'cerrada'
     AND NEW.partner_id IS NOT NULL
     AND NEW.importe_cobrado IS NOT NULL
     AND NEW.importe_cobrado > 0
  THEN
    IF EXISTS (
      SELECT 1 FROM public.comisiones WHERE solicitud_id = NEW.id
    ) THEN
      -- Actualizar comisión existente si el importe cambió y no está pagada
      UPDATE public.comisiones
      SET
        importe_base     = NEW.importe_cobrado,
        importe_comision = ROUND((NEW.importe_cobrado * 0.10)::numeric, 2),
        partner_id       = NEW.partner_id
      WHERE solicitud_id = NEW.id
        AND estado != 'pagada';
    ELSE
      -- Crear nueva comisión
      INSERT INTO public.comisiones
        (solicitud_id, partner_id, porcentaje, importe_base, importe_comision, estado)
      VALUES (
        NEW.id,
        NEW.partner_id,
        10,
        NEW.importe_cobrado,
        ROUND((NEW.importe_cobrado * 0.10)::numeric, 2),
        'pendiente'
      );
    END IF;

  -- ── CASO 2: solicitud deja de estar cerrada (re-apertura) ─────────────────
  ELSIF OLD.estado = 'cerrada' AND NEW.estado != 'cerrada' THEN
    -- Mantener historial pero revertir a pendiente (nunca eliminar)
    UPDATE public.comisiones
    SET estado = 'pendiente'
    WHERE solicitud_id = NEW.id
      AND estado != 'pagada';
  END IF;

  RETURN NEW;
END;
$$;

-- 3. Trigger en solicitudes — se dispara en cambio de estado o importe
DROP TRIGGER IF EXISTS trg_comision_por_cierre ON public.solicitudes;
CREATE TRIGGER trg_comision_por_cierre
  AFTER UPDATE ON public.solicitudes
  FOR EACH ROW
  WHEN (
    OLD.estado IS DISTINCT FROM NEW.estado
    OR OLD.importe_cobrado IS DISTINCT FROM NEW.importe_cobrado
    OR OLD.partner_id IS DISTINCT FROM NEW.partner_id
  )
  EXECUTE FUNCTION public.fn_comision_por_cierre();

-- 4. Índice adicional para acelerar búsquedas por estado en comisiones
CREATE INDEX IF NOT EXISTS idx_comisiones_estado ON public.comisiones(estado);
