-- Migración: Actualización de nombres de procesos a lenguaje más claro y accesible
-- Elimina jerga técnica, anglicismos y términos oscuros para usuarios no técnicos.
-- Cubre los 44 cambios de las ramas fix/copies-procesos-centros-deportivos,
-- fix/copies-procesos-constructoras y fix/copies-procesos-generales.

UPDATE public.processes SET nombre = 'Creación automática de presupuestos sin errores' WHERE id = 'A3';
UPDATE public.processes SET nombre = 'Respuestas automáticas en WhatsApp a las preguntas más habituales' WHERE id = 'AC20';
UPDATE public.processes SET nombre = 'Encuesta rápida automática a tus alumnos justo después de cada clase' WHERE id = 'AC21';
UPDATE public.processes SET nombre = 'Gestión automática de quejas con confirmación inmediata y seguimiento' WHERE id = 'AC22';
UPDATE public.processes SET nombre = 'Mensaje automático de cumpleaños a cada socio con un regalo o descuento' WHERE id = 'AC23';
UPDATE public.processes SET nombre = 'Aviso automático cuando un socio lleva días sin aparecer por el centro' WHERE id = 'AC24';
UPDATE public.processes SET nombre = 'Captación automática de interesados desde tu web y redes sociales' WHERE id = 'CM1';
UPDATE public.processes SET nombre = 'Seguimiento automático de personas que preguntaron pero no se apuntaron' WHERE id = 'CM2';
UPDATE public.processes SET nombre = 'Mensajes automáticos para recuperar socios que se dieron de baja' WHERE id = 'CM3';
UPDATE public.processes SET nombre = 'Selección automática de los clientes con más probabilidad de comprar' WHERE id = 'CN1';
UPDATE public.processes SET nombre = 'Gestión automática de visitas con recordatorios incluidos' WHERE id = 'CN10';
UPDATE public.processes SET nombre = 'Seguimiento automático tras cada visita a tu obra o piso piloto' WHERE id = 'CN11';
UPDATE public.processes SET nombre = 'Contratos generados y enviados a firmar desde el móvil' WHERE id = 'CN12';
UPDATE public.processes SET nombre = 'Todo lo pendiente tras una reserva, gestionado automáticamente' WHERE id = 'CN13';
UPDATE public.processes SET nombre = 'Espacio para que los propietarios reporten problemas tras la entrega' WHERE id = 'CN14';
UPDATE public.processes SET nombre = 'Detectar automáticamente las viviendas que no se venden y por qué' WHERE id = 'CN15';
UPDATE public.processes SET nombre = 'Aviso automático cuando un cliente empieza a enfriarse' WHERE id = 'CN2';
UPDATE public.processes SET nombre = 'Estado de todas tus ventas en un solo vistazo' WHERE id = 'CN3';
UPDATE public.processes SET nombre = 'Asistente en tu web que atiende a los interesados en tu obra' WHERE id = 'CN4';
UPDATE public.processes SET nombre = 'Presentación comercial adaptada automáticamente a cada cliente' WHERE id = 'CN5';
UPDATE public.processes SET nombre = 'Ficha de vivienda generada automáticamente en segundos' WHERE id = 'CN6';
UPDATE public.processes SET nombre = 'Resumen automático de cada llamada con el cliente' WHERE id = 'CN7';
UPDATE public.processes SET nombre = 'Seguimiento automático a los interesados mientras dura la obra' WHERE id = 'CN9';
UPDATE public.processes SET nombre = 'Cobros automáticos mensuales y avisos cuando un pago falla' WHERE id = 'FF27';
UPDATE public.processes SET nombre = 'Aviso semanal de facturas de proveedores pendientes de pagar' WHERE id = 'FF28';
UPDATE public.processes SET nombre = 'Aviso automático cuando la cuota de un socio está a punto de caducar' WHERE id = 'GV4';
UPDATE public.processes SET nombre = 'Recordatorio automático para quienes vinieron a probar y no volvieron' WHERE id = 'GV5';
UPDATE public.processes SET nombre = 'Sistema automático para que tus alumnos traigan amigos a cambio de un premio' WHERE id = 'GV6';
UPDATE public.processes SET nombre = 'Aviso automático cuando un alumno lleva días sin venir al centro' WHERE id = 'GV7';
UPDATE public.processes SET nombre = 'Recomendación automática de material deportivo según el nivel del alumno' WHERE id = 'GV8';
UPDATE public.processes SET nombre = 'Control automático de bonos de clases con avisos cuando quedan pocas sesiones' WHERE id = 'GV9';
UPDATE public.processes SET nombre = 'Registro automático de nuevos socios con acceso y bienvenida incluidos' WHERE id = 'OA10';
UPDATE public.processes SET nombre = 'Gestión automática de reservas, cancelaciones y lista de espera' WHERE id = 'OA11';
UPDATE public.processes SET nombre = 'Aviso automático cuando una clase está casi llena o se llena del todo' WHERE id = 'OA12';
UPDATE public.processes SET nombre = 'Resumen semanal automático del estado de tu centro' WHERE id = 'OA13';
UPDATE public.processes SET nombre = 'Registro automático de averías con seguimiento hasta que estén reparadas' WHERE id = 'OA14';
UPDATE public.processes SET nombre = 'Organización automática de exámenes o pruebas de nivel para tus alumnos' WHERE id = 'OA15';
UPDATE public.processes SET nombre = 'Seguimiento automático de alumnos lesionados hasta que se recuperan' WHERE id = 'OA16';
UPDATE public.processes SET nombre = 'Firma y archivo automático de contratos sin papel ni desplazamientos' WHERE id = 'OA17';
UPDATE public.processes SET nombre = 'Avisos automáticos a padres sobre asistencia, pagos y eventos de sus hijos' WHERE id = 'OA18';
UPDATE public.processes SET nombre = 'Resumen mensual automático del progreso de cada alumno' WHERE id = 'OA19';
UPDATE public.processes SET nombre = 'Aviso automático a tus socios cuando se cancela o cambia una clase' WHERE id = 'OE29';
UPDATE public.processes SET nombre = 'Lista de tareas automática al incorporar a alguien nuevo al centro' WHERE id = 'RO25';
UPDATE public.processes SET nombre = 'Organización automática de turnos e instructores para cubrir todas las clases' WHERE id = 'RO26';
