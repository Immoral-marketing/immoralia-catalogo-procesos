-- Migración: Unificación de categorías y simplificación de nombres de procesos
--
-- Cambios aplicados:
--   - "Facturas y Gastos" (A) + "Finanzas y Tesorería" (C) → "Facturación y Finanzas"
--   - "Reducción de ausencias a citas (confirmación + recordatorios)" → "Reducción de citas perdidas"
--   - "Auditoría tecnológica (IA + Automatización)" → "Diagnóstico de automatización"
--   - "Alta automatizada de nuevos clientes (Gestoría)" → "Alta de nuevos clientes"

-- 1. Actualizar tabla categories: renombrar A y C al nombre unificado
UPDATE public.categories
SET name = 'Facturación y Finanzas', emoji = '💳'
WHERE id IN ('A', 'C');

-- 2. Actualizar categoria_nombre en todos los procesos afectados
UPDATE public.processes
SET categoria_nombre = 'Facturación y Finanzas'
WHERE categoria_nombre IN ('Facturas y Gastos', 'Finanzas y Tesorería');

-- 3. Actualizar nombres de procesos simplificados
UPDATE public.processes
SET nombre = 'Reducción de citas perdidas'
WHERE nombre ILIKE '%Reducción de ausencias a citas%';

UPDATE public.processes
SET nombre = 'Diagnóstico de automatización'
WHERE nombre ILIKE '%Auditoría tecnológica (IA + Automatización)%';

UPDATE public.processes
SET nombre = 'Alta de nuevos clientes'
WHERE nombre ILIKE '%Alta automatizada de nuevos clientes%';

-- 4. Limpiar entradas del chatbot (chatbot_knowledge) que referencien
--    categorías o nombres de procesos obsoletos para forzar su re-indexación.
--    Las entradas se regenerarán la próxima vez que se ejecute el seeding de embeddings.
DELETE FROM public.chatbot_knowledge
WHERE content ILIKE '%Facturas y Gastos%'
   OR content ILIKE '%Finanzas y Tesorería%'
   OR content ILIKE '%Reducción de ausencias a citas%'
   OR content ILIKE '%Auditoría tecnológica (IA + Automatización)%'
   OR content ILIKE '%Alta automatizada de nuevos clientes%';
