/**
 * SPEC-03 — Política de privacidad del catálogo.
 * Texto base RGPD pendiente de validación legal por el equipo.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { BASE_URL } from '@/lib/schema-org'

export const metadata: Metadata = {
  title: 'Política de privacidad — Immoralia',
  description: 'Política de privacidad del catálogo de procesos de Immoralia.',
  alternates: { canonical: `${BASE_URL}/privacidad` },
  openGraph: {
    type: 'website',
    siteName: 'Immoralia',
    locale: 'es_ES',
    title: 'Política de privacidad — Immoralia',
    description: 'Política de privacidad del catálogo de procesos de Immoralia.',
    url: `${BASE_URL}/privacidad`,
  },
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          ← Volver al catálogo
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mt-6 mb-2">Política de privacidad</h1>
        <p className="text-sm text-gray-500 mb-10">Última actualización: junio de 2026</p>

        <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Responsable del tratamiento</h2>
            <p>
              El responsable del tratamiento de los datos personales recogidos a través de este sitio es{' '}
              <strong>Immoral Group</strong> (en adelante, «Immoralia»). Puedes contactar con nosotros en{' '}
              <a href="mailto:team@immoralia.es" className="underline underline-offset-2 text-cyan-300">team@immoralia.es</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. Qué datos recogemos</h2>
            <p>
              A través de los formularios del catálogo y del asistente conversacional podemos recoger: nombre,
              dirección de correo electrónico, teléfono (si lo facilitas), información sobre tu empresa y el
              contenido de las conversaciones que mantengas con el asistente.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Finalidad del tratamiento</h2>
            <p>
              Utilizamos tus datos para: responder a tus consultas y solicitudes de contacto, preparar propuestas
              de automatización personalizadas, agendar llamadas que tú solicites y mejorar la calidad del
              asistente y del catálogo.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Legitimación</h2>
            <p>
              La base legal del tratamiento es tu <strong>consentimiento expreso</strong>, que prestas al marcar la
              casilla de aceptación antes de enviar tus datos, y nuestro interés legítimo en atender las
              solicitudes que nos diriges.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">5. Destinatarios</h2>
            <p>
              Tus datos se almacenan en proveedores que actúan como encargados del tratamiento (alojamiento de
              base de datos, herramientas de gestión comercial y de comunicación interna del equipo). No vendemos
              ni cedemos tus datos a terceros con fines comerciales.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">6. Conservación</h2>
            <p>
              Conservamos tus datos mientras dure la relación comercial o hasta que solicites su supresión. Las
              conversaciones con el asistente se conservan para análisis de calidad del servicio.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">7. Cookies funcionales del asistente</h2>
            <p>
              El asistente conversacional del catálogo utiliza una <strong>cookie funcional estrictamente necesaria</strong>{' '}
              para mantener el hilo de la conversación entre visitas:
            </p>
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li><strong>Nombre:</strong> <code className="text-cyan-300 text-xs">imm_vid</code></li>
              <li><strong>Finalidad:</strong> identificar al visitante entre sesiones para que el asistente pueda retomar el contexto de conversaciones anteriores sin necesidad de que te identifiques.</li>
              <li><strong>Duración:</strong> 90 días desde la última actividad.</li>
              <li><strong>Tipo:</strong> cookie de primera parte, HttpOnly (no accesible desde JavaScript), solo enviada por HTTPS.</li>
            </ul>
            <p className="mt-2">
              Esta cookie es funcional/necesaria para el correcto funcionamiento del asistente y no requiere consentimiento previo
              según el criterio de la AEPD (Agencia Española de Protección de Datos). No se utiliza con fines publicitarios ni
              de seguimiento entre sitios web. No se instala cookie banner para ella.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">8. Tus derechos</h2>
            <p>
              Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión, oposición,
              limitación del tratamiento y portabilidad escribiendo a{' '}
              <a href="mailto:team@immoralia.es" className="underline underline-offset-2 text-cyan-300">team@immoralia.es</a>.
              También tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos
              (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-cyan-300">aepd.es</a>).
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
