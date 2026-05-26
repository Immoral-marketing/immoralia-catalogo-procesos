-- Actualización de Sectores y Reasignación de Procesos - 01/04/2026

-- 1. Actualizar el nombre del sector Salud (Clínica/Clínicas -> Clínicas / Salud / Dental / Veterinaria)
UPDATE public.processes
SET sectores = array_replace(sectores, 'Clínicas', 'Clínicas / Salud / Dental / Veterinaria')
WHERE 'Clínicas' = ANY(sectores);

UPDATE public.processes
SET sectores = array_replace(sectores, 'Clínica', 'Clínicas / Salud / Dental / Veterinaria')
WHERE 'Clínica' = ANY(sectores);

-- 2. Añadir sector 'Academias / Formación' a procesos de alumnos y educación
UPDATE public.processes
SET sectores = array_append(sectores, 'Academias / Formación')
WHERE id IN (
    'OA15', 'OA16', 'OA18', 'OA19', -- Gestión alumnos/padres
    'CM3', 'GV5', 'GV6', 'GV7', 'GV8', 'GV9', -- Retención/Reactivación
    'RO25', 'F25' -- Onboarding y Auditoría
);

-- 3. Añadir sector 'Construcción & Reformas' a procesos globales relevantes
UPDATE public.processes
SET sectores = array_append(sectores, 'Construcción & Reformas')
WHERE id IN ('F25'); -- Auditoría tecnológica e IA (esencial para este sector)

-- Nota: No se elimina la pertenencia a sectores anteriores para mantener la visibilidad en Centros Deportivos u otros sectores originales.
