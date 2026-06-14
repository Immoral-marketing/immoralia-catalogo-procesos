/**
 * SPEC-02 — Chips de sugerencia por superficie.
 * Genéricas para home/burbuja; por sector para las landings,
 * redactadas desde los dolores reales del catálogo.
 */

export const GENERIC_SUGGESTIONS = [
  '¿Por dónde debería empezar?',
  'Pierdo leads que llegan de redes sociales',
  'Quiero automatizar el envío de facturas',
  '¿Qué hacéis exactamente?',
]

export const SECTOR_SUGGESTIONS: Record<string, string[]> = {
  construccion: [
    'Pierdo leads de portales inmobiliarios',
    'Mis agentes improvisan el discurso',
    'Los partes de obra llegan tarde y en papel',
    '¿Cómo genero un dossier al momento?',
  ],
  salud: [
    'Tengo llamadas perdidas fuera de horario',
    '¿Cómo reduzco los no-shows?',
    'Necesito reactivar pacientes inactivos',
    'Quiero conseguir más reseñas de pacientes',
  ],
  gestorias: [
    'Los clientes no mandan documentación a tiempo',
    '¿Cómo envío nóminas automáticamente?',
    'Se me olvidan vencimientos fiscales',
    'Pierdo horas respondiendo las mismas dudas',
  ],
  'centros-deportivos': [
    'Detecto tarde cuando un socio se va a dar de baja',
    '¿Cómo gestiono reservas y listas de espera?',
    'Quiero automatizar el cobro mensual',
    'Pierdo altas por no responder al instante',
  ],
  academias: [
    'Los alumnos se dan de baja sin avisar',
    '¿Cómo hago las matrículas sin papeleo?',
    'Necesito reactivar exalumnos',
    'Respondo lo mismo a cada familia interesada',
  ],
  'gastronomia-hosteleria': [
    'Tengo muchos no-shows que me cuestan dinero',
    '¿Cómo consigo más reseñas en Google?',
    'Quiero controlar el stock automáticamente',
    'El teléfono no para durante el servicio',
  ],
  industrial: [
    'Tardo demasiado en preparar presupuestos',
    '¿Cómo doy visibilidad del pedido al cliente?',
    'Necesito trazabilidad de lote sin Excel',
    'Los partes de producción se rellenan en papel',
  ],
}
