-- ============================================================
-- Migración: Reasignación de procesos a sectores
-- Fecha: 2026-04-28
-- ============================================================
-- 1. Añade columna `hidden` para ocultar procesos de la UI
-- 2. Rellena columna `sectores` con la asignación correcta
-- 3. Marca como hidden los procesos marcados "Fuera"
-- NOTA: No se elimina ningún registro.
-- ============================================================

-- 1. Añadir columna hidden si no existe
ALTER TABLE processes
  ADD COLUMN IF NOT EXISTS hidden boolean DEFAULT false;

-- ============================================================
-- 2. Marcar procesos "Fuera" como hidden
-- ============================================================
UPDATE processes SET hidden = true
WHERE id IN (
  'AC27','AG1','CN13','CN3','D14','E19','E20','E23',
  'GS1','GS11','GS13','GS16','GS2','GS3','GS6','GS7',
  'OA12','OA14','RO26'
);

-- El resto explícitamente no hidden
UPDATE processes SET hidden = false
WHERE id NOT IN (
  'AC27','AG1','CN13','CN3','D14','E19','E20','E23',
  'GS1','GS11','GS13','GS16','GS2','GS3','GS6','GS7',
  'OA12','OA14','RO26'
);

-- ============================================================
-- 3. Actualizar columna sectores
-- Mapeo: 1=Centros Deportivos, 2=Gestoria,
--        3=Clínicas/Salud/Dental/Veterinaria, 4=Construcción & Reformas,
--        5=Academias/Formación, 6=Restauración, 7=E-commerce,
--        8=Inmobiliaria, 9=Agencia/marketing
-- ============================================================

-- ALL (sectores 1-9)
UPDATE processes SET sectores = ARRAY[
  'Centros Deportivos','Gestoria','Clínicas / Salud / Dental / Veterinaria',
  'Construcción & Reformas','Academias / Formación','Restauración',
  'E-commerce','Inmobiliaria','Agencia/marketing'
]
WHERE id IN (
  'A1','A2','A5','AC20','AC22','AG2','B6','B7','B8',
  'C9','C10','C11','C12','CM1','E22','E24','F25',
  'GS9','GS10','GS12','GS14','OA17'
);

-- A3: sectores 2,3,4,7,8,9
UPDATE processes SET sectores = ARRAY[
  'Gestoria','Clínicas / Salud / Dental / Veterinaria',
  'Construcción & Reformas','E-commerce','Inmobiliaria','Agencia/marketing'
] WHERE id = 'A3';

-- A4: sectores 2,3,4,7,8
UPDATE processes SET sectores = ARRAY[
  'Gestoria','Clínicas / Salud / Dental / Veterinaria',
  'Construcción & Reformas','E-commerce','Inmobiliaria'
] WHERE id = 'A4';

-- sectores 1,5
UPDATE processes SET sectores = ARRAY['Centros Deportivos','Academias / Formación']
WHERE id IN (
  'AC21','AC24','AC25','AC26','CM3','GV4','GV5','GV6','GV7',
  'GS15','OA18','OA19','OE29','RO25'
);

-- AC23: sectores 1,7
UPDATE processes SET sectores = ARRAY['Centros Deportivos','E-commerce']
WHERE id = 'AC23';

-- CM2: sectores 1,3,4,5,6,7
UPDATE processes SET sectores = ARRAY[
  'Centros Deportivos','Clínicas / Salud / Dental / Veterinaria',
  'Construcción & Reformas','Academias / Formación','Restauración','E-commerce'
] WHERE id = 'CM2';

-- CN1: sectores 4,7,8
UPDATE processes SET sectores = ARRAY['Construcción & Reformas','E-commerce','Inmobiliaria']
WHERE id = 'CN1';

-- sectores 4,8
UPDATE processes SET sectores = ARRAY['Construcción & Reformas','Inmobiliaria']
WHERE id IN ('CN2','CN4','CN5','CN6','CN9','CN10','CN11','CN14','CN15');

-- CN7: sectores 2,4,8,9
UPDATE processes SET sectores = ARRAY[
  'Gestoria','Construcción & Reformas','Inmobiliaria','Agencia/marketing'
] WHERE id = 'CN7';

-- sectores 2,4,8
UPDATE processes SET sectores = ARRAY['Gestoria','Construcción & Reformas','Inmobiliaria']
WHERE id IN ('CN8','CN12');

-- D13: sectores 2,4,6,8
UPDATE processes SET sectores = ARRAY[
  'Gestoria','Construcción & Reformas','Restauración','Inmobiliaria'
] WHERE id = 'D13';

-- D15, D16, GS4: sector 9
UPDATE processes SET sectores = ARRAY['Agencia/marketing']
WHERE id IN ('D15','D16','GS4');

-- E18: sectores 1,2,3,4,5,6,8,9
UPDATE processes SET sectores = ARRAY[
  'Centros Deportivos','Gestoria','Clínicas / Salud / Dental / Veterinaria',
  'Construcción & Reformas','Academias / Formación','Restauración',
  'Inmobiliaria','Agencia/marketing'
] WHERE id = 'E18';

-- E21: sectores 1,5,6,7
UPDATE processes SET sectores = ARRAY[
  'Centros Deportivos','Academias / Formación','Restauración','E-commerce'
] WHERE id = 'E21';

-- FF27, FF28: sectores 1,5,7
UPDATE processes SET sectores = ARRAY['Centros Deportivos','Academias / Formación','E-commerce']
WHERE id IN ('FF27','FF28');

-- GS5: sectores 1,2,5,7
UPDATE processes SET sectores = ARRAY['Centros Deportivos','Gestoria','Academias / Formación','E-commerce']
WHERE id = 'GS5';

-- GS8: sector 2
UPDATE processes SET sectores = ARRAY['Gestoria']
WHERE id = 'GS8';

-- GV8, GV9, OA10, OA11, OA13, OA15, OA16: sector 1
UPDATE processes SET sectores = ARRAY['Centros Deportivos']
WHERE id IN ('GV8','GV9','OA10','OA11','OA13','OA15','OA16');
