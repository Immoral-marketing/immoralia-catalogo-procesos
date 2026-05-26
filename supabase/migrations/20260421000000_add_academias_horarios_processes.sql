-- Add 3 new Academias-specific "Horarios y Proyectos" processes
-- Replaces the generic centros-deportivos processes that were incorrectly showing in Academias

INSERT INTO processes (id, codigo, categoria, categoria_nombre, nombre, tagline, recomendado, descripcion_detallada, pasos, personalizacion, landing_slug, integration_domains)
VALUES
(
  'AC25',
  'AC25',
  'B',
  'Horarios y Proyectos',
  'Aviso automático a alumnos cuando se cancela o cambia una clase',
  'Cero sorpresas. Tus alumnos siempre informados al instante.',
  true,
  'Cuando un profesor cancela o reprograma una clase, el sistema notifica automáticamente a todos los alumnos matriculados en ese grupo con el motivo y, si aplica, la nueva fecha. Sin WhatsApps manuales, sin correos uno a uno.',
  '["Detectamos cancelación o cambio en el calendario de clases", "Obtenemos la lista de alumnos del grupo afectado", "Enviamos notificación personalizada a cada alumno"]',
  'Elige el canal, el tono del mensaje y si quieres incluir propuesta de nueva fecha.',
  'academias',
  '{OTHER}'
),
(
  'AC26',
  'AC26',
  'B',
  'Horarios y Proyectos',
  'Control automático de asistencia con alertas cuando un alumno acumula faltas',
  'Detecta el absentismo antes de que sea un problema.',
  true,
  'El sistema registra la asistencia de cada alumno. Si acumula X faltas consecutivas o supera un porcentaje de ausencias, se genera alerta interna para el coordinador y se envía un mensaje automático al alumno (o a su tutor si es menor). Imprescindible en academias con requisitos de asistencia mínima para certificación.',
  '["Leemos el registro de asistencia de cada sesión", "Calculamos faltas acumuladas y porcentaje de ausencias", "Enviamos alerta al coordinador y mensaje al alumno o tutor"]',
  'Define el umbral de faltas, a quién avisar y el tono del mensaje (recordatorio amable o formal).',
  'academias',
  '{OTHER}'
),
(
  'AC27',
  'AC27',
  'B',
  'Horarios y Proyectos',
  'Matrícula automática y asignación al grupo según nivel del alumno',
  'Del formulario al grupo correcto, sin intervención manual.',
  true,
  'Cuando un nuevo alumno completa el formulario de inscripción o la prueba de nivel, el sistema lo asigna automáticamente al grupo adecuado, le envía el horario y la documentación de bienvenida, y notifica al profesor del grupo. Aplica a academias de idiomas, música, autoescuelas, formación profesional y cualquier formación por niveles.',
  '["Recibimos los datos de inscripción o resultado de prueba de nivel", "Asignamos al alumno al grupo disponible más adecuado", "Enviamos bienvenida al alumno y aviso al profesor del grupo"]',
  'Personaliza el criterio de asignación, el contenido del kit de bienvenida y los avisos al equipo docente.',
  'academias',
  '{OTHER}'
)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  tagline = EXCLUDED.tagline,
  recomendado = EXCLUDED.recomendado,
  descripcion_detallada = EXCLUDED.descripcion_detallada,
  pasos = EXCLUDED.pasos,
  personalizacion = EXCLUDED.personalizacion,
  landing_slug = EXCLUDED.landing_slug,
  categoria_nombre = EXCLUDED.categoria_nombre;
