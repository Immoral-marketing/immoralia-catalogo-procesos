import { NextResponse } from 'next/server'

export const revalidate = 86400

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://procesos.immoralia.es').replace(/\/$/, '')

// Lista blanca declarativa — LL-006: nunca escanear filesystem
const SECTORS = [
  {
    slug: 'salud',
    name: 'Centros de Salud',
    description:
      'Automatizaciones para clínicas, consultas médicas y centros de fisioterapia: gestión de citas, comunicación con pacientes y administración clínica.',
  },
  {
    slug: 'gestorias',
    name: 'Gestorías y Asesorías',
    description:
      'Automatizaciones para gestorías fiscales, laborales y contables: captación de clientes, tramitación de documentos y seguimiento de obligaciones.',
  },
  {
    slug: 'centros-deportivos',
    name: 'Centros Deportivos',
    description:
      'Automatizaciones para gimnasios, clubes y academias deportivas: alta de socios, reservas de clases y fidelización.',
  },
  {
    slug: 'construccion',
    name: 'Construcción e Inmobiliaria',
    description:
      'Automatizaciones para constructoras y promotoras: gestión de presupuestos, seguimiento de obra y comunicación con clientes.',
  },
  {
    slug: 'desarrolladoras',
    name: 'Desarrolladoras Inmobiliarias',
    description:
      'Automatizaciones específicas para promotoras y desarrolladoras: captación de compradores, gestión de reservas y postventa.',
  },
  {
    slug: 'gastronomia-hosteleria',
    name: 'Gastronomía y Hostelería',
    description:
      'Automatizaciones para restaurantes, bares y hoteles: reservas, gestión de personal y comunicación con clientes.',
  },
  {
    slug: 'academias',
    name: 'Academias y Formación',
    description:
      'Automatizaciones para centros de formación y academias: captación de alumnos, matrícula, seguimiento y certificación.',
  },
  {
    slug: 'agencias',
    name: 'Agencias de Marketing',
    description:
      'Automatizaciones para agencias: onboarding de clientes, entrega de informes, gestión de campañas y facturación recurrente.',
  },
  {
    slug: 'ecommerce',
    name: 'E-commerce',
    description:
      'Automatizaciones para tiendas online: recuperación de carritos, atención al cliente, logística y fidelización.',
  },
  {
    slug: 'industrial',
    name: 'Industrial y Manufactura',
    description:
      'Automatizaciones para empresas industriales: gestión de pedidos, comunicación con proveedores y mantenimiento preventivo.',
  },
]

function buildContent(): string {
  const sectorLines = SECTORS.map(
    s => `- [${s.name}](${BASE}/sector/${s.slug}) — ${s.description}`
  ).join('\n')

  return `# procesos.immoralia.es

> Catálogo de automatizaciones de negocio para pymes españolas. Índice para rastreadores de IA (ChatGPT, Claude, Perplexity, Gemini).

## Descripción

procesos.immoralia.es es el catálogo de referencia de Immoralia para la automatización de procesos empresariales en pymes españolas. Recoge más de 150 automatizaciones organizadas en 10 sectores (salud, gestorías, centros deportivos, construcción, desarrolladoras, gastronomía y hostelería, academias, agencias, e-commerce e industrial) y las clasifica en seis bloques de negocio: captación, administración, operaciones, comunicación, fidelización y dirección.

Cada proceso del catálogo describe un problema concreto del día a día del negocio y la automatización que lo resuelve, con pasos detallados, herramientas implicadas y criterios de personalización. El catálogo está pensado para que un directivo o responsable de operaciones identifique de un vistazo qué puede automatizar en su empresa sin necesidad de conocimientos técnicos.

El catálogo también incluye auditorías de madurez digital por sector: cuestionarios interactivos que generan un informe PDF con el diagnóstico de automatización de la empresa y una hoja de ruta priorizada.

## Páginas clave

- [Inicio — Selector de sector](${BASE}/)
- [Catálogo completo](${BASE}/catalogo/completo)
- [Índice de auditorías de madurez](${BASE}/auditorias)

## Sectores cubiertos

${sectorLines}
`
}

export function GET() {
  const content = buildContent()
  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
