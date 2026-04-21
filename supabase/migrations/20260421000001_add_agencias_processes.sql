-- Add 2 new Agencias-specific processes: AG1 and AG2
-- AG1: Recordatorio automático de horas no registradas (Facturación y Finanzas)
-- AG2: Panel unificado de solicitudes multicanal (Atención y Ventas)

INSERT INTO processes (id, codigo, categoria, categoria_nombre, nombre, tagline, recomendado, descripcion_detallada, pasos, personalizacion, landing_slug, integration_domains)
VALUES
(
  'AG1',
  'AG1',
  'A',
  'Facturación y Finanzas',
  'Recordatorio automático al equipo cuando hay horas sin registrar',
  'Si tu equipo factura por horas, cada hora sin registrar es dinero perdido.',
  true,
  'Al final de cada jornada, el sistema revisa qué miembros del equipo no han registrado horas en su herramienta de tracking (Glassy, Timely, Harvest...). Los que no han imputado nada reciben un recordatorio automático y personalizado por Slack o email. Si el patrón se repite varios días seguidos, el responsable recibe un aviso consolidado para actuar.',
  '["Consultamos a diario las imputaciones de cada miembro del equipo en la herramienta de tracking", "Cruzamos con el calendario de ausencias para filtrar días no laborables", "Enviamos recordatorio personalizado a quienes no han registrado horas", "Generamos informe semanal para el manager con el histórico de lagunas"]',
  'Elige la herramienta de tracking, el canal del aviso, la hora del disparo diario y el umbral de horas mínimas.',
  'agencias',
  '{OTHER}'
),
(
  'AG2',
  'AG2',
  'E',
  'Atención y Ventas',
  'Panel unificado de todas las solicitudes entrantes de cualquier canal',
  'Formulario, Instagram, WhatsApp... todo en un único sitio, sin que nada se pierda.',
  true,
  'Cada vez que llega una solicitud nueva — por el formulario de la web, un DM de Instagram o un WhatsApp — el sistema la captura, extrae los datos relevantes (nombre, contacto, canal de origen, mensaje) y crea automáticamente una ficha unificada en Notion, Airtable o el CRM que uses. El responsable recibe aviso inmediato y ya dispone de toda la información en un solo lugar, sin tener que revisar tres aplicaciones distintas.',
  '["Capturamos el mensaje en tiempo real desde el canal de origen (web, Instagram DM o WhatsApp)", "Normalizamos los datos al mismo formato (nombre, contacto, canal, mensaje, timestamp)", "Creamos la ficha automáticamente en Notion, Airtable o el CRM elegido", "Notificamos al responsable con el resumen y enlace directo al registro"]',
  'Elige qué canales conectar, dónde centralizar las fichas y las reglas de asignación por tipo de solicitud.',
  'agencias',
  '{CRM,COMMS}'
)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  tagline = EXCLUDED.tagline,
  recomendado = EXCLUDED.recomendado,
  descripcion_detallada = EXCLUDED.descripcion_detallada,
  pasos = EXCLUDED.pasos,
  personalizacion = EXCLUDED.personalizacion,
  landing_slug = EXCLUDED.landing_slug,
  categoria = EXCLUDED.categoria,
  categoria_nombre = EXCLUDED.categoria_nombre;
