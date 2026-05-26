-- Migración ROBUSTA para sincronizar categorías, procesos y metadatos

-- 1. Asegurar tabla de categorías y su estructura
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Asegurar columna 'emoji' en categories si no existe
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='categories' AND column_name='emoji') THEN
        ALTER TABLE public.categories ADD COLUMN emoji TEXT;
    END IF;
END $$;

-- Sincronizar categorías (A, B, C, D, E)
INSERT INTO public.categories (id, name, emoji) VALUES 
('A', 'Facturas y Gastos', '🧾'),
('B', 'Horarios y Proyectos', '📅'),
('C', 'Finanzas y Tesorería', '💰'),
('D', 'Internos Agencias', '🏢'),
('E', 'Atención y Captura', '💬')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    emoji = EXCLUDED.emoji;

-- 2. Asegurar tabla de procesos y su estructura
CREATE TABLE IF NOT EXISTS public.processes (
    id TEXT PRIMARY KEY,
    codigo TEXT NOT NULL,
    categoria TEXT NOT NULL REFERENCES public.categories(id),
    categoria_nombre TEXT NOT NULL,
    nombre TEXT NOT NULL,
    tagline TEXT,
    recomendado BOOLEAN DEFAULT false,
    descripcion_detallada TEXT,
    pasos JSONB,
    personalizacion TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Asegurar columnas de recomendación en processes
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='processes' AND column_name='sectores') THEN
        ALTER TABLE public.processes ADD COLUMN sectores TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='processes' AND column_name='herramientas') THEN
        ALTER TABLE public.processes ADD COLUMN herramientas TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='processes' AND column_name='dolores') THEN
        ALTER TABLE public.processes ADD COLUMN dolores TEXT[] DEFAULT '{}';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='processes' AND column_name='canales') THEN
        ALTER TABLE public.processes ADD COLUMN canales TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Habilitar RLS si no estaba habilitado
ALTER TABLE public.processes ENABLE ROW LEVEL SECURITY;

-- Política de lectura para todos
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'processes' 
        AND policyname = 'Allow public read access to processes'
    ) THEN
        CREATE POLICY "Allow public read access to processes" ON public.processes
            FOR SELECT USING (true);
    END IF;
END $$;

-- 3. Limpiar y re-poblar con los 24 procesos actuales (UPSERT)
INSERT INTO public.processes (
    id, codigo, categoria, categoria_nombre, nombre, tagline, recomendado, 
    descripcion_detallada, pasos, personalizacion, sectores, herramientas, dolores
) VALUES 
('A1', 'A1', 'A', 'Facturas y Gastos', 'Facturas automatizadas', 'No pierdas más tiempo calculando fees fijos y variables sobre la inversión.', true, 'Desde tu hoja de Servicios → Generamos todas tus facturas automáticamente...', '["Leemos fees por cliente", "Creamos la factura borrador en Holded", "Enviamos notificación"]', 'Elige la vía de comunicación...', ARRAY['Agencia/marketing', 'Servicios profesionales', 'E-commerce'], ARRAY['Holded', 'Google Sheets', 'Excel'], ARRAY['Quiero automatizar presupuestos y respuestas', 'Necesito centralizar la información de clientes']),
('A2', 'A2', 'A', 'Facturas y Gastos', 'Informe semanal de facturas vencidas', 'Controla cada semana cómo van los impagos.', true, 'Cada lunes → recibes un informe con un desglose de las facturas vencidas...', '["Revisamos todas las facturas", "Calculamos antigüedad", "Generamos un informe"]', 'Decide cuándo recibes el informe...', ARRAY['Agencia/marketing', 'Servicios profesionales', 'Retail'], ARRAY['Holded', 'Slack', 'Email'], ARRAY['Necesito centralizar la información de clientes']),
('A3', 'A3', 'A', 'Facturas y Gastos', 'Presupuestos automáticos', 'Vuela enviando presupuestos.', false, 'Desde un Sheets o cualquier fuente → Creamos presupuestos completos en Holded.', '["Leemos tarifas", "Creamos el presupuesto", "Notificamos al responsable"]', 'Decide si el presupuesto se envía automáticamente...', ARRAY['Servicios profesionales', 'Agencia/marketing', 'Inmobiliaria'], ARRAY['Holded', 'Google Sheets', 'Excel'], ARRAY['Quiero automatizar presupuestos y respuestas', 'Tardamos en responder y perdemos clientes']),
('A4', 'A4', 'A', 'Facturas y Gastos', 'Seguimiento de presupuestos enviados', 'Controla todos los presupuestos enviados.', false, 'Si pasan X días sin respuesta → Aviso a responsables por cualquier vía.', '["Revisamos el estado", "Detectamos inactividad", "Disparamos alerta"]', 'Elige el canal del aviso...', ARRAY['Agencia/marketing', 'Inmobiliaria', 'Retail', 'Servicios profesionales'], ARRAY['Holded', 'WhatsApp', 'Email', 'Pipedrive', 'HubSpot'], ARRAY['Tardamos en responder y perdemos clientes', 'No hago seguimiento a las personas interesadas']),
('A5', 'A5', 'A', 'Facturas y Gastos', 'Envío de recordatorios de pagos a clientes', 'Automatiza el ir detrás de quien no ha pagado.', true, 'Envía recordatorios de pago a los clientes que tienen facturas vencidas...', '["Identificación de facturas", "Generación del mensaje", "Envío automático"]', 'Elige tono del mensaje...', ARRAY['Retail', 'E-commerce', 'Servicios profesionales', 'Agencia/marketing'], ARRAY['Holded', 'WhatsApp', 'Email'], ARRAY['Tardamos en responder y perdemos clientes', 'No hago seguimiento a las personas interesadas']),
('B6', 'B6', 'B', 'Horarios y Proyectos', 'Informe de análisis e incidencias en horarios', 'Ahorra tiempo analizando los datos para controlar a tus equipos.', true, 'Cada semana → Recibes un reporte con fichajes incompletos...', '["Leemos los registros", "Detectamos anomalías", "Generamos alerta"]', 'Elige qué tipo de alertas...', ARRAY['Servicios profesionales', 'Agencia/marketing', 'Clínica', 'Peluquería/estética'], ARRAY['Clockify', 'Toggl', 'ClickUp', 'Factorial'], ARRAY['Quiero ordenar tareas y que se asignen solas', 'Me escriben mucho y no doy abasto', 'Necesito centralizar la información de clientes']),
('B7', 'B7', 'B', 'Horarios y Proyectos', 'Informe mensual de horas vs estimadas por proyecto', 'Controla los desvíos de horas de cada proyecto.', true, 'Recibe un informe mensual el primer día de cada mes...', '["Cruzamos datos", "Calculamos desviaciones", "Generamos un informe"]', 'Elige formato del informe...', ARRAY['Agencia/marketing', 'Servicios profesionales', 'Inmobiliaria'], ARRAY['ClickUp', 'Asana', 'Excel', 'Monday'], ARRAY['Quiero ordenar tareas y que se asignen solas', 'Necesito centralizar la información de clientes']),
('B8', 'B8', 'B', 'Horarios y Proyectos', 'Alertas por exceso de horas en proyectos', 'Recibe avisos cuando algún proyecto se dispara en horas.', true, 'Si un proyecto supera el umbral (ej. +15%) → Aviso automático...', '["Calculamos desviación", "Detectamos el umbral", "Enviamos notificaciones"]', 'Define el porcentaje de exceso...', ARRAY['Agencia/marketing', 'Servicios profesionales', 'E-commerce'], ARRAY['ClickUp', 'Notion', 'Slack', 'Teams'], ARRAY['Me escriben mucho y no doy abasto', 'Quiero ordenar tareas y que se asignen solas']),
('C9', 'C9', 'C', 'Finanzas y Tesorería', 'Alertas de facturas de compra próximas a vencer', 'Entérate de cuándo van a ir llegando los gastos previstos.', true, 'Detectamos facturas a X días de vencimiento...', '["Leemos facturas", "Calculamos los días restantes", "Enviamos alertas"]', 'Decide días de anticipación...', ARRAY['Retail', 'E-commerce', 'Restauración'], ARRAY['Holded', 'Email', 'WhatsApp'], ARRAY['Tardamos en responder y perdemos clientes']),
('C10', 'C10', 'C', 'Finanzas y Tesorería', 'Informes financieros para dirección', 'Claridad financiera directa en tu inbox, cada mes.', true, 'Cierre mensual → Informe con facturación, margen, costes.', '["Consolidamos datos", "Calculamos KPIs", "Enviamos informe"]', 'Elige tu fecha de cierre...', ARRAY['E-commerce', 'Retail', 'Agencia/marketing'], ARRAY['Holded', 'Excel', 'Google Sheets'], ARRAY['Necesito centralizar la información de clientes', 'Quiero automatizar presupuestos y respuestas']),
('C11', 'C11', 'C', 'Finanzas y Tesorería', 'Proyección automática de ingresos', 'Recibe una previsión de ingresos según tu histórico y visión.', false, 'Cierre mensual → Informe forecast con proyección de ingresos...', '["Analizamos patrones", "Calculamos escenarios", "Generamos un forecast"]', 'Elige entre visión moderada...', ARRAY['E-commerce', 'Retail', 'Agencia/marketing', 'Servicios profesionales'], ARRAY['Excel', 'Google Sheets', 'Holded'], ARRAY['Necesito centralizar la información de clientes', 'Quiero ordenar tareas y que se asignen solas']),
('C12', 'C12', 'C', 'Finanzas y Tesorería', 'Traspasos automáticos de IVA', 'Retira los impuestos a medida que llegan...', false, 'Cada factura recibida → Generamos desglose de IVA...', '["Calculamos base", "Generamos documento", "Notificamos"]', 'Elige cuándo se notifica...', ARRAY['Agencia/marketing', 'Servicios profesionales', 'Retail', 'E-commerce'], ARRAY['Holded', 'Excel', 'Drive', 'OneDrive'], ARRAY['Quiero automatizar presupuestos y respuestas', 'Necesito centralizar la información de clientes']),
('D13', 'D13', 'D', 'Internos Agencias', 'Registro automático de gastos', 'Agiliza la gestión de facturas de gasto al máximo.', true, 'Vuelcas factura en carpeta de Drive → Generamos la factura de gasto...', '["Detección automática", "Envío al Inbox", "Creación automática"]', 'Elige la carpeta de Drive...', ARRAY['Agencia/marketing', 'Retail', 'E-commerce'], ARRAY['Holded', 'Drive', 'OneDrive'], ARRAY['Me escriben mucho y no doy abasto', 'Pierdo solicitudes entre WhatsApp/Instagram/email']),
('D14', 'D14', 'D', 'Internos Agencias', 'Creación de metas en ClickUp', 'Saca todo el partido a las metas de ClickUp...', true, 'Desde un documento con objetivos mensuales → Creamos metas en ClickUp...', '["Leemos los objetivos", "Creamos metas dinámicas", "Configuramos seguimiento"]', 'Elige colores por cliente/equipo.', ARRAY['Agencia/marketing', 'Servicios profesionales'], ARRAY['ClickUp', 'Notion'], ARRAY['Quiero ordenar tareas y que se asignen solas']),
('D15', 'D15', 'B', 'Horarios y Proyectos', 'Facturación automática basada en horas (freelance)', '¿Trabajas con distintos freelance a distintos precios por hora?', false, 'Te imputa sus horas un freelance → Se crea la factura de gasto...', '["Leemos horas", "Multiplicamos por tarifa", "Creamos factura"]', 'Define tarifas por freelance...', ARRAY['Agencia/marketing', 'Servicios profesionales', 'E-commerce'], ARRAY['Holded', 'Toggl', 'Clockify', 'Factorial'], ARRAY['Quiero automatizar presupuestos y respuestas', 'Me escriben mucho y no doy abasto']),
('D16', 'D16', 'B', 'Horarios y Proyectos', 'Gestión automática de retenciones (freelance)', 'Retira las retenciones a medida que llegan...', false, 'Cuando entra una factura de proveedor → Calculamos retención...', '["Detectamos facturas", "Calculamos el %", "Creamos asiento"]', 'Elige periodicidad del cálculo...', ARRAY['Agencia/marketing', 'Servicios profesionales', 'Retail'], ARRAY['Holded', 'Excel', 'Sheets'], ARRAY['Quiero automatizar presupuestos y respuestas', 'Tardamos en responder y perdemos clientes']),
('E17', 'E17', 'E', 'Atención y Captura', 'Atención automática por WhatsApp', 'Responde al instante a dudas frecuentes.', true, 'Automatizamos la atención inicial por WhatsApp...', '["Detectamos el tipo de consulta", "Respondemos con mensajes", "Derivamos a un responsable"]', 'Define el tono, las preguntas frecuentes...', ARRAY['Agencia/marketing', 'Servicios profesionales', 'Retail', 'Inmobiliaria', 'Restauración'], ARRAY['WhatsApp', 'Make', 'Zapier'], ARRAY['Me escriben mucho y no doy abasto', 'Tardamos en responder y perdemos clientes', 'Tengo muchas preguntas repetidas']),
('E18', 'E18', 'E', 'Atención y Captura', 'Asistente de reservas y recordatorios', 'Gestiona reservas de forma ágil.', true, 'Facilitamos que los clientes reserven sin esperas...', '["Pedimos los datos", "Confirmamos la solicitud", "Enviamos recordatorios"]', 'Define qué datos pedir...', ARRAY['Peluquería/estética', 'Gimnasio/yoga', 'Clínica', 'Restauración', 'Servicios profesionales'], ARRAY['Calendly', 'Booksy', 'WhatsApp', 'Google Sheets'], ARRAY['Se olvidan de la cita', 'Necesito más reservas']),
('E19', 'E19', 'E', 'Atención y Captura', 'Captura y organización automática de solicitudes', 'Recoge solicitudes desde distintos canales.', true, 'Cuando llegan solicitudes desde formularios o mensajes...', '["Recibimos solicitudes", "Extraemos la información", "Guardamos en listado"]', 'Define qué información quieres capturar...', ARRAY['Agencia/marketing', 'Inmobiliaria', 'Servicios profesionales'], ARRAY['Formulario web', 'WhatsApp', 'Instagram DM', 'ClickUp'], ARRAY['Pierdo solicitudes entre WhatsApp/Instagram/email', 'Necesito centralizar la información de clientes']),
('E20', 'E20', 'E', 'Atención y Captura', 'Seguimiento automático de solicitudes', 'Automatiza el seguimiento para que nadie se quede sin respuesta.', true, 'Creamos un flujo de seguimiento para retomar conversaciones...', '["Detectamos solicitudes sin respuesta", "Enviamos mensaje de seguimiento", "Actualizamos el estado"]', 'Define estados, tiempos de espera...', ARRAY['Agencia/marketing', 'Inmobiliaria', 'E-commerce', 'Servicios profesionales'], ARRAY['WhatsApp', 'Email', 'Pipedrive', 'HubSpot'], ARRAY['No hago seguimiento a las personas interesadas', 'Tardamos en responder y perdemos clientes']),
('E21', 'E21', 'E', 'Atención y Captura', 'Solicitud automática de reseñas', 'Pide reseñas tras el servicio para aumentar valoraciones.', true, 'Automatizamos el envío de mensajes para pedir una reseña...', '["Tras finalizar el servicio", "Enviamos mensaje", "Enviamos recordatorio"]', 'Define cuándo se envía, el texto...', ARRAY['Restauración', 'Peluquería/estética', 'Retail', 'Clínica'], ARRAY['WhatsApp', 'Email', 'Google Business Messages'], ARRAY['Quiero pedir reseñas de forma automática']),
('E22', 'E22', 'E', 'Atención y Captura', 'Atención automática por Instagram', 'Responde dudas frecuentes en Instagram.', false, 'Automatizamos respuestas a mensajes de Instagram...', '["Detectamos el motivo", "Respondemos con mensajes", "Derivamos a una persona"]', 'Define preguntas frecuentes, tono...', ARRAY['Agencia/marketing', 'Retail', 'E-commerce', 'Restauración', 'Inmobiliaria'], ARRAY['Instagram DM', 'Make', 'ManyChat', 'Zapier'], ARRAY['Me escriben mucho y no doy abasto', 'Tengo muchas preguntas repetidas (horarios, precios, ubicación…)', 'Tardamos en responder y perdemos clientes']),
('E23', 'E23', 'E', 'Atención y Captura', 'Reducción de ausencias a citas', 'Confirma citas y recuerda automáticamente.', false, 'Creamos un flujo de confirmación y recordatorios...', '["Enviamos mensaje de confirmación", "Enviamos recordatorios", "Guiamos para reprogramar"]', 'Define cuándo enviar confirmaciones...', ARRAY['Peluquería/estética', 'Clínica', 'Gimnasio/yoga', 'Servicios profesionales'], ARRAY['WhatsApp', 'Google Calendar', 'Calendly'], ARRAY['Se olvidan de la cita']),
('E24', 'E24', 'E', 'Atención y Captura', 'Alta automática de clientes y solicitudes', 'Crea una ficha con los datos clave sin hacerlo a mano.', false, 'Cada vez que entra una consulta o una reserva...', '["Capturamos datos básicos", "Creamos una ficha", "Guardamos un resumen"]', 'Define qué datos guardar, estados...', ARRAY['Agencia/marketing', 'Inmobiliaria', 'E-commerce', 'Servicios profesionales', 'Retail'], ARRAY['Holded', 'HubSpot', 'Pipedrive', 'Notion', 'ClickUp'], ARRAY['Necesito centralizar la información de clientes', 'Quiero ordenar tareas y que se asignen solas', 'Pierdo solicitudes entre WhatsApp/Instagram/email'])

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
    dolores = EXCLUDED.dolores;
