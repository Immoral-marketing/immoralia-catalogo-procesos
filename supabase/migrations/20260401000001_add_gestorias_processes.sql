-- Migración para añadir y actualizar procesos del sector Gestorías
-- Sincroniza los 22 procesos solicitados con el catálogo general e incluye esquema de integración

-- 1. Asegurar esquema de columnas
DO $$ 
BEGIN 
    -- Asegurar columna 'landing_slug' si no existe (por si acaso no se aplicó la migración previa)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='processes' AND column_name='landing_slug') THEN
        ALTER TABLE public.processes ADD COLUMN landing_slug TEXT;
    END IF;

    -- Añadir columna 'integration_domains' para categorizar tipos de integración
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='processes' AND column_name='integration_domains') THEN
        ALTER TABLE public.processes ADD COLUMN integration_domains TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- 2. Asegurar categoría F (Auditoría tecnológica)
INSERT INTO public.categories (id, name, emoji) VALUES 
('F', 'Auditoría tecnológica', '🔍')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, emoji = EXCLUDED.emoji;

-- 3. Actualizar procesos reutilizables (Sectores)
-- NOTA: Utilizamos ANY y array_append para evitar duplicados si se lanza varias veces
UPDATE public.processes 
SET sectores = array_append(sectores, 'Gestoria')
WHERE id IN ('A1', 'A2', 'A5', 'E17', 'E18', 'E20', 'AC21', 'E21', 'E24')
AND NOT ('Gestoria' = ANY(sectores));

-- 4. Sincronizar los 22 procesos específicos para el sector Gestorías
INSERT INTO public.processes (
    id, codigo, categoria, categoria_nombre, nombre, tagline, recomendado, 
    descripcion_detallada, pasos, personalizacion, sectores, herramientas, dolores, landing_slug, integration_domains
) VALUES 
('GS1', 'GS1', 'F', 'Auditoría tecnológica', 'Recopilación automática de documentos', 'Solicita y centraliza la documentación de tus clientes cada mes sin perseguir a nadie.', true, 'Olvídate de perseguir facturas cada mes...', '["Configuramos el calendario", "Lanzamos solicitudes", "Monitorizamos la recepción", "Centralizamos los archivos"]', 'Define los días de aviso...', ARRAY['Gestoria', 'Servicios profesionales'], ARRAY['Email', 'Google Drive/Dropbox', 'Make/Zapier'], ARRAY['Pierdo mucho tiempo pidiendo facturas', 'Los clientes se retrasan en el envío de docs'], 'gestorias', ARRAY['DOCS']),

('GS2', 'GS2', 'C', 'Finanzas y Tesorería', 'Alertas de vencimientos fiscales y laborales', 'Evita sanciones y recargos con un calendario de impuestos automatizado.', true, 'Mantén bajo control todas las obligaciones fiscales...', '["Definimos el perfil tributario", "Programamos la secuencia", "Asignamos responsables", "Activamos el canal"]', 'Ajusta los días de antelación...', ARRAY['Gestoria', 'Servicios profesionales'], ARRAY['Google Calendar', 'Make', 'Email/WhatsApp'], ARRAY['Me da miedo que se pase un plazo de impuestos', 'El cliente siempre envía todo el último día'], 'gestorias', ARRAY['ERP']),

('GS3', 'GS3', 'B', 'Horarios y Proyectos', 'Seguimiento del estado de cada expediente', 'Tu cliente sabe en qué punto está su gestión sin tener que llamarte.', true, 'Cada vez que entra un nuevo encargo...', '["Estandarizamos las fases", "Conectamos tu gestor de tareas", "Configuramos los disparadores", "Activamos el repositorio"]', 'Elige qué fases son visibles...', ARRAY['Gestoria', 'Servicios profesionales', 'Inmobiliaria'], ARRAY['ClickUp/Monday', 'Make', 'Airtable'], ARRAY['Los clientes llaman constantemente para preguntar cómo va lo suyo', 'No tengo claro el volumen de trámites pendientes'], 'gestorias', ARRAY['CRM']),

('GS4', 'GS4', 'C', 'Finanzas y Tesorería', 'Informes mensuales automáticos para el cliente', 'Entrega valor cada mes con un resumen automático de la situación de tu cliente.', false, 'Al cierre de cada mes o trimestre...', '["Definimos la estructura", "Mapeamos los campos", "Programamos el envío", "Configuramos alertas"]', 'Elige los KPIs...', ARRAY['Gestoria', 'Servicios profesionales'], ARRAY['ERP contable', 'Make', 'Hojas de cálculo'], ARRAY['El cliente solo tiene noticias mías para pedir papeles o pagar impuestos', 'Tardo mucho en preparar informes para los clientes VIP'], 'gestorias', ARRAY['ERP', 'DOCS']),

('GS5', 'GS5', 'C', 'Finanzas y Tesorería', 'Conciliación de extractos bancarios', 'Cruza cobros y pagos con tus facturas registradas de forma automática.', true, 'Automatiza la tarea más tediosa de la contabilidad...', '["Configuramos la pasarela", "Definimos las reglas", "Activamos el panel", "Sincronizamos los estados"]', 'Define el umbral de tolerancia...', ARRAY['Gestoria', 'Servicios profesionales', 'E-commerce'], ARRAY['Pasarela bancaria', 'ERP', 'Make'], ARRAY['Dedico demasiadas horas a puntear el banco con las facturas', 'No sé quién me debe dinero hasta que no reviso el banco a mano'], 'gestorias', ARRAY['ERP']),

('GS6', 'GS6', 'D', 'Internos Agencias', 'Alta de nuevos empleados de clientes', 'Recopila datos y genera el checklist de contratación al instante.', true, 'Simplifica el proceso de contratación para tus clientes...', '["Diseñamos el formulario", "Configuramos la automatización", "Establecemos el flujo", "Damos acceso al cliente"]', 'Personaliza los documentos solicitados...', ARRAY['Gestoria', 'Servicios profesionales'], ARRAY['Typeform/Tally', 'Make', 'Google Drive'], ARRAY['Me envían los datos de los nuevos empleados por WhatsApp y a trozos', 'Pierdo mucho tiempo reclamando el DNI o el número de la SS'], 'gestorias', ARRAY['DOCS']),

('GS7', 'GS7', 'B', 'Horarios y Proyectos', 'Control de vencimientos de contratos temporales', 'Controla renovaciones y extinciones antes de que se pase el plazo legal.', true, 'No permitas que un contrato temporal se convierta en indefinido...', '["Sincronizamos tu base de datos", "Definimos los umbrales", "Configuramos los mensajes", "Integramos los avisos"]', 'Define quién recibe cada alerta...', ARRAY['Gestoria', 'Servicios profesionales'], ARRAY['Airtable/Google Sheets', 'Make', 'Email/Slack'], ARRAY['Se nos pasan las fechas de fin de contrato y hay líos legales', 'El cliente nos avisa tarde de que quiere despedir a alguien'], 'gestorias', ARRAY['ERP']),

('GS8', 'GS8', 'D', 'Internos Agencias', 'Envío automático de nóminas a empleados', 'Distribuye todos los recibos de salarios en un clic sin envíos manuales.', false, 'Elimina el tedioso proceso de enviar las nóminas una a una...', '["Configuramos el sistema", "Vinculamos los DNI", "Establecemos el protocolo", "Activamos el registro"]', 'Elige si quieres proteger el PDF...', ARRAY['Gestoria', 'Servicios profesionales'], ARRAY['PDF.co', 'Make', 'SendGrid/Gmail'], ARRAY['Tardo una mañana entera en enviar las nóminas de mis clientes', 'A veces nos equivocamos y enviamos la nómina de uno a otro por error'], 'gestorias', ARRAY['DOCS']),

('GS9', 'GS9', 'D', 'Internos Agencias', 'Gestión de incidencias de personal', 'Recibe bajas, altas, vacaciones e incidencias de forma ordenada y procesable.', true, 'Tus clientes ya no te enviarán las variables del mes de forma desordenada...', '["Creamos el catálogo", "Implementos el formulario", "Conectamos la entrada", "Configuramos el repositorio"]', 'Define qué tipos de incidencias...', ARRAY['Gestoria', 'Servicios profesionales'], ARRAY['Tally/JotForm', 'Make', 'Notion/ClickUp'], ARRAY['Me llegan las bajas médicas por fotos borrosas de WhatsApp', 'A final de mes siempre falta algún variable que el cliente olvidó decirme'], 'gestorias', ARRAY['OTHER']),

('GS10', 'GS10', 'E', 'Atención y Ventas', 'Comunicaciones estacionales por calendario fiscal', 'Mantén a tus clientes informados y tranquilos con avisos automáticos útiles.', false, 'No esperes a que el cliente te pregunte...', '["Redactamos las plantillas", "Segmentamos tu base de datos", "Configuramos los disparadores", "Integramos el link"]', 'Elige el tono de la comunicación...', ARRAY['Gestoria', 'Servicios profesionales'], ARRAY['Mailchimp/ActiveCampaign', 'Make', 'Calendly'], ARRAY['Los clientes me colapsan a llamadas cuando empieza la campaña de Renta', ' Siento que no aporto valor más allá de meter facturas'], 'gestorias', ARRAY['CRM']),

('GS11', 'GS11', 'F', 'Auditoría tecnológica', 'Alertas de documentos próximos a caducar', 'No permitas que un certificado o poder caducado frene una gestión vital.', true, 'Poderes notariales, certificados digitales...', '["Catalogamos los documentos", "Configuramos los campos", "Programamos la secuencia", "Creamos la tarea"]', 'Define el margen de antelación...', ARRAY['Gestoria', 'Servicios profesionales'], ARRAY['Airtable/Google Sheets', 'Make', 'Google Drive'], ARRAY['Nos damos cuenta de que un poder ha caducado cuando estamos en la notaría', 'Los certificados digitales siempre caducan en el peor momento'], 'gestorias', ARRAY['DOCS']),

('GS14', 'GS14', 'F', 'Auditoría tecnológica', 'Clasificación y archivo automático de documentos', 'Deja que la tecnología lea, clasifique y guarde los documentos por ti.', true, 'Tu buzón de entrada ya no será un cementerio de adjuntos...', '["Entrenamos a la IA", "Conectamos tus bandejas", "Configuramos las reglas", "Activamos un canal"]', 'Define qué tipos de documentos...', ARRAY['Gestoria', 'Servicios profesionales', 'Real Estate'], ARRAY['OpenAI/OCR', 'Make', 'Gestores de archivos'], ARRAY['Recibo cientos de documentos al día y pierdo horas clasificándolos', 'Muchas veces archivamos mal los documentos y luego no aparecen'], 'gestorias', ARRAY['DOCS']),

('GS15', 'GS15', 'E', 'Atención y Ventas', 'Reactivación de clientes inactivos', 'Recupera el contacto con clientes recurrentes que han perdido actividad.', false, 'No dejes que un cliente se vaya en silencio...', '["Segmentamos tus clientes", "Definimos los umbrales", "Redactamos los guiones", "Configuramos la automatización"]', 'Define el tiempo de espera...', ARRAY['Gestoria', 'Servicios profesionales'], ARRAY['ActiveCampaign/Brevo', 'Make', 'CRM'], ARRAY['Solo hablo con mis clientes cuando hay problemas o toca pagar', 'Se me olvidan clientes que solían traerme trámites y ya no vienen'], 'gestorias', ARRAY['CRM']),

('GS16', 'GS16', 'D', 'Internos Agencias', 'Alta automatizada de nuevos clientes (Gestoría)', 'Recopila datos, documentos y genera el contrato de servicios al instante.', true, 'Cada vez que entra un nuevo cliente, se activa una secuencia automática...', '["Activamos el formulario", "Configuramos la generación", "Integramos la pasarela", "Sincronizamos los datos"]', 'Define el contenido de tu kit de bienvenida...', ARRAY['Gestoria', 'Servicios profesionales'], ARRAY['SignNow/Docusign', 'Make', 'Formularios Cloud'], ARRAY['El proceso de alta de un cliente me quita demasiado tiempo', 'A veces empezamos a trabajar sin tener el contrato firmado'], 'gestorias', ARRAY['CRM'])

ON CONFLICT (id) DO UPDATE SET 
    codigo = EXCLUDED.codigo,
    categoria = EXCLUDED.categoria,
    categoria_nombre = EXCLUDED.categoria_nombre,
    nombre = EXCLUDED.nombre,
    tagline = EXCLUDED.tagline,
    recomendado = EXCLUDED.recomendado,
    descripcion_detallada = EXCLUDED.descripcion_detallada,
    pasos = EXCLUDED.pasos,
    personalizacion = EXCLUDED.personalizacion,
    sectores = EXCLUDED.sectores,
    herramientas = EXCLUDED.herramientas,
    dolores = EXCLUDED.dolores,
    landing_slug = EXCLUDED.landing_slug,
    integration_domains = EXCLUDED.integration_domains;
