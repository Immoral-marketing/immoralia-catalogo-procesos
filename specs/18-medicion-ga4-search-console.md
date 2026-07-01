# SPEC-18: Medición SEO — Google Analytics 4 + Search Console

**Versión:** 1.3
**Estado:** aprobada
**Tipo de proyecto:** web-app
**Última actualización:** 2026-06-30
**Owner:** David Navarrete

---

## Descripción

Instalar Google Analytics 4 en el catálogo y vincularlo a Google Search Console (verificación pendiente en SPEC-14) para empezar a recoger métricas de tráfico, comportamiento y rendimiento orgánico. Sin esta SPEC, todas las demás del plan SEO se ejecutan a ciegas: no podríamos medir el impacto real de cada cambio, ni alimentar SPEC-23 (análisis continuo automatizado) cuando llegue. La propiedad GA4 ya existe (`properties/532197748` en la cuenta Immoral Online Assets); esta SPEC se ocupa de la instrumentación del frontend y del cumplimiento RGPD.

---

## Actores

- **Visitante anónimo:** carga la web. Si da consentimiento, su comportamiento se trackea en GA4. Si lo rechaza, no se envía nada a GA.
- **Administrador del catálogo (David):** consulta GA4 directamente para entender qué páginas funcionan, qué sectores reciben tráfico, qué orígenes traen visitas. Vincula GA4 ↔ GSC para enriquecer las dimensiones de adquisición orgánica.
- **Skill futura SPEC-23 (operacional):** consume datos agregados de GSC (vía MCP custom de SPEC-24) y, opcionalmente, datos de GA4 vía la API. No es actor en esta SPEC, pero condiciona el diseño: la instrumentación debe ser consistente para que las queries de SPEC-23 tengan sentido.

---

## Flujos principales

### Flujo 1: Carga inicial del catálogo con consentimiento RGPD pendiente

1. El visitante abre cualquier URL del catálogo en `procesos.immoralia.es`.
2. El servidor renderiza el HTML. Incluye el script de GA4 con **Consent Mode v2 en estado "default denied"**: GA4 carga pero NO envía datos personales hasta que el visitante consienta.
3. Mientras tanto, GA4 puede enviar "consent signals" anónimos (ping) para no perder modelado.
4. Si la cookie de consent ya existe (visita repetida), se restablece el estado guardado.

### Flujo 2: Visitante da consentimiento

1. El visitante interactúa con el banner de cookies y acepta tracking.
2. Se ejecuta `gtag('consent', 'update', { analytics_storage: 'granted' })`.
3. A partir de ese momento, GA4 envía datos completos (page_view, scroll, eventos custom).
4. La preferencia queda guardada en cookie/localStorage.

### Flujo 3: Visitante rechaza consentimiento

1. El visitante rechaza el banner.
2. `analytics_storage` queda en `denied`.
3. GA4 sigue cargado pero NO envía datos identificables. Solo conserva pings agregados anónimos (Consent Mode modelado).

### Flujo 4: Carga en host no oficial (staging o vercel.app)

1. Una petición llega a `staging.immoralia.es` o `immoralia-hub.vercel.app`.
2. La lógica condicional detecta que el host NO es el oficial y NO carga GA4.
3. No se trackean impactos de tráfico interno o de previews.

### Flujo 5: Administrador conecta GA4 con Search Console

1. David accede a GA4 → Admin → Search Console links.
2. Selecciona la propiedad `procesos.immoralia.es` ya verificada en GSC (resultado de SPEC-14).
3. Vincula data streams.
4. A partir de ahí, los informes "Queries" y "Google Organic Search" aparecen en GA4 con datos enriquecidos de GSC.

### Flujo 6: Visitante realiza una acción "conversión" relevante para SEO

1. Visitante hace click en uno de los CTAs configurados como conversión: agendar llamada (GHL), enviar formulario de contacto, descargar PDF de auditoría, compartir selección de procesos.
2. Si tiene consent dado, se envía un evento custom (ej. `lead_form_submitted`, `audit_pdf_downloaded`).
3. GA4 cuenta la conversión y la atribuye al canal/origen.

---

## Flujos alternativos / Edge cases

- **Visitante con bloqueador de anuncios / GA bloqueado:** el script no carga. La web sigue funcionando — GA4 es opcional, su ausencia no degrada nada.
- **Variable `NEXT_PUBLIC_GA_MEASUREMENT_ID` vacía o no definida:** el script de GA4 no se inyecta. Comportamiento equivalente a "no hay tracking", sin errores en consola.
- **Visitante en `localhost` (desarrollo):** no se carga GA4 (la lógica condicional excluye hosts no oficiales).
- **Refresh durante la sesión:** la preferencia de consent persiste vía cookie/localStorage.
- **Cambio de mente del visitante:** se debe poder revocar consent (banner reabrible o link en footer). Out of scope de esta SPEC — se asume que el banner ya ofrece esto o se trata en SPEC futura.
- **Datos personales en URLs:** si una URL contiene query strings con datos personales (caso poco probable en catálogo), GA4 los anonimiza por configuración por defecto (IP anonymization activa).
- **Eventos enviados antes de que el script GA4 cargue:** quedan en cola interna de gtag.js y se envían al cargar.

---

## Criterios de aceptación

- [ ] CA-01: La home `https://procesos.immoralia.es/` carga el script de GA4 (`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`). Verificable inspeccionando Network en DevTools o con `curl + grep`.
- [ ] CA-02: Cualquier URL pública del catálogo (sectores, fichas, auditorías, catálogo completo) también carga el script de GA4.
- [ ] CA-03: `https://staging.immoralia.es/` NO carga el script de GA4. Verificable con DevTools.
- [ ] CA-04: `https://immoralia-hub.vercel.app/` NO carga el script de GA4.
- [ ] CA-05: `http://localhost:8080/` (dev) NO carga el script de GA4.
- [ ] CA-06: El script GA4 se inicializa con `consent_mode v2` en estado `default denied`. Verificable con DebugView de GA4 o inspeccionando el `dataLayer`.
- [ ] CA-07: En GA4 DebugView, una visita desde un navegador con consent denegado muestra eventos con `consent_state = denied` y datos no identificables.
- [ ] CA-08: En GA4 DebugView, una visita desde un navegador con consent aceptado muestra eventos completos (`page_view`, `scroll`, etc.) en tiempo real.
- [ ] CA-09: Existe variable `NEXT_PUBLIC_GA_MEASUREMENT_ID` en Vercel Production con valor real (`G-XXXXXXXXXX`) extraído del data stream creado en la propiedad GA4 `532197748`. En Preview y Development, la variable o bien no existe o está vacía.
- [ ] CA-10: La propiedad GA4 `532197748` aparece **vinculada con la propiedad GSC** `procesos.immoralia.es` (verificable en GA4 → Admin → Search Console Links → Manage links).
- [ ] CA-11: Tras la vinculación, en GA4 → Reports → Acquisition → Search Console aparecen al menos los siguientes informes con datos: "Queries", "Google organic search traffic".
- [ ] CA-12: Si el visitante tiene un bloqueador de tracking (uBlock, Brave shields), la web sigue funcionando sin errores en consola (verificable manualmente con Brave/uBlock activos).
- [ ] CA-13: La instalación de GA4 no degrada Core Web Vitals — LCP de la home sigue siendo igual o mejor que antes (verificable con Lighthouse antes/después).
- [ ] CA-14: En la primera visita anónima a `procesos.immoralia.es/`, se muestra el banner de consent en la esquina inferior con texto en español y dos botones (Aceptar / Rechazar). El banner NO bloquea el resto de la página.
- [ ] CA-15: Tras pulsar "Aceptar", se guarda la cookie `immoralia_consent=granted` (6 meses) y el banner desaparece. En la siguiente recarga el banner NO vuelve a aparecer.
- [ ] CA-16: Tras pulsar "Rechazar", se guarda la cookie `immoralia_consent=denied` (6 meses) y el banner desaparece. GA4 sigue cargado pero con eventos en estado `denied`.
- [ ] CA-17: El footer incluye un link "Configurar cookies" que reabre el banner sobre la página actual.

---

## Modelo de datos

### Entidades nuevas o modificadas

No aplica. Esta SPEC no toca BBDD del catálogo. Los datos se almacenan en GA4 (servicio externo).

### Relaciones

No aplica.

### Migraciones necesarias

No aplica.

---

## UI / Páginas afectadas

### Páginas nuevas

Ninguna.

### Páginas modificadas

- **Root layout** — se añade la carga condicional del script GA4 y la inicialización del Consent Mode v2.
- **Componente de cookie consent nuevo** — banner overlay con 2 botones (Aceptar / Rechazar), persistencia en cookie `immoralia_consent`, reabrible desde footer (decidido en ambigüedad 2).
- **Footer del sitio** — añadir el link "Configurar cookies" que reabre el banner.

### Componentes reutilizables

Helper compartido para inicializar GA4 con Consent Mode, reutilizable si en el futuro se añade otro tag (Meta Pixel, etc.).

### Breakpoints obligatorios

Si se introduce banner de cookies: 375px, 768px, 1280px. El banner debe ser legible y no tapar contenido crítico en móvil.

### Estándar de calidad visual

Si se introduce banner: aplicar el criterio de las skills de diseño del proyecto (impeccable / frontend-design). Debe respetar la paleta del catálogo (fondo `bg-[#0d0d0d]`).

---

## API / Endpoints

### Endpoints nuevos

Ninguno (GA4 se invoca desde el cliente directamente contra los servidores de Google).

### Endpoints modificados

Ninguno.

### Contratos de request/response

No aplica internamente.

---

## Notas de seguridad

### Datos sensibles involucrados

GA4 trackea:
- IP del visitante (anonimizada por defecto desde GA4 — Google la trunca en EU regions).
- User-Agent.
- Páginas visitadas.
- Eventos custom (clicks en CTAs).

NO se envían: datos personales identificables (nombres, emails, contenidos de formularios). El RGPD aplica → consentimiento previo obligatorio.

### Validaciones server-side requeridas

Ninguna — GA4 es 100% client-side.

### Autenticación y autorización

No aplica para el visitante.
Para administradores: el acceso a la propiedad GA4 lo gestiona Google con las cuentas Workspace de Immoral Group.

### Otros riesgos identificados

- **RGPD — uso sin consentimiento:** mitigado por Consent Mode v2 + banner de aceptación.
- **Fuga de PII en URLs:** mitigado al deshabilitar `allow_google_signals` y `allow_ad_personalization_signals` por defecto si se determina que no aporta valor.
- **Sobrecoste / cuota GA4:** GA4 tiene plan free con cuota generosa. El tráfico previsto está muy por debajo de los límites. No riesgo a corto plazo.

*(SECURITY-AGENT aplicará el checklist de `.brianspec/security-checklists.md` sección "Tipo: web-app" durante la revisión. Esta SPEC introduce un tracker externo que recoge datos de comportamiento del visitante — el riesgo principal es RGPD, mitigado por Consent Mode.)*

---

## Plan de implementación

### Arquitectura propuesta

Tres piezas:

1. **Instalación de GA4 vía `@next/third-parties/google`** — librería oficial mantenida por el equipo de Next.js. Patrón estándar para Next 15 App Router. Se monta en el root layout con `<GoogleAnalytics gaId={MEASUREMENT_ID} />`. La librería gestiona internamente el `<Script>` con estrategia óptima (`afterInteractive`) y no degrada Core Web Vitals.

2. **Consent Mode v2** — inicialización antes de que se cargue GA4. Establece defaults a `denied`. Se respeta la decisión del visitante guardada en cookie/localStorage.

3. **Carga condicional por host** — el componente que envuelve a `<GoogleAnalytics>` comprueba si `window.location.hostname` coincide con el host extraído de `NEXT_PUBLIC_SITE_URL` (introducida en SPEC-13). Solo en ese caso renderiza el componente. Resultado: no se trackea staging, previews ni dev.

> **Banner de consent (decidido en ambigüedad 2):** se incluye en esta SPEC un banner custom mínimo con 2 botones (Aceptar / Rechazar), texto legal sintético en español y persistencia en cookie de primera parte. Se renderiza como overlay no intrusivo (ej. esquina inferior). Respeta la paleta del catálogo (fondo oscuro). Reabrible desde footer si el visitante quiere cambiar de opinión.

### Desglose de tareas

1. **DATA-AGENT — Confirmar/crear Data Stream en GA4 (tarea humana de David):**
   - Acceder a GA4 → propiedad `procesos.immoralia.es` (`532197748`).
   - Verificar que existe un data stream web. Si no, crearlo con URL `https://procesos.immoralia.es`.
   - Copiar el Measurement ID (formato `G-XXXXXXXXXX`).
   - Añadirlo en Vercel Production como `NEXT_PUBLIC_GA_MEASUREMENT_ID`.

2. **FRONTEND-AGENT — Instalación `@next/third-parties`:** añadir la dependencia, montar `<GoogleAnalytics>` en el root layout con `gaId` extraído de la variable de entorno.

3. **FRONTEND-AGENT — Consent Mode v2:** añadir el bloque de inicialización Consent Mode con defaults denied antes de `<GoogleAnalytics>`. Persistir el estado en cookie de primera parte.

4. **FRONTEND-AGENT — Carga condicional por host:** envolver `<GoogleAnalytics>` en un wrapper client component que comprueba el host antes de renderizar. Si el host NO es `procesos.immoralia.es`, no se renderiza.

5. **FRONTEND-AGENT — Banner de consent custom:** implementar el banner mínimo:
   - **Posición:** overlay esquina inferior (no modal, no bloqueante de la página).
   - **Texto:** mensaje breve en español ("Usamos cookies para entender cómo se usa el catálogo. Puedes aceptar, rechazar o cambiar de opinión más adelante.") + link a `/privacidad` para más detalles.
   - **Botones:** "Aceptar" (granted) y "Rechazar" (denied).
   - **Persistencia:** cookie de primera parte (`immoralia_consent`) con valor `granted` / `denied`. Duración: 6 meses.
   - **Mecanismo de cambio:** link en el footer ("Configurar cookies") que reabre el banner.
   - **Estilo:** paleta del catálogo (`bg-[#0d0d0d]`, accent cyan). Componentes shadcn/ui ya existentes.
   - **Responsive:** funcional en 375px, 768px, 1280px.

6. **DATA-AGENT — Vinculación GA4 ↔ GSC (tarea humana, post-merge a producción):**
   - Esperar a que SPEC-14 esté completada y `procesos.immoralia.es` verificado en GSC.
   - En GA4 → Admin → Search Console links → Manage links → vincular.
   - Cumple CA-10 y CA-11.

7. **CONTENT-AGENT — Revisión de la política de privacidad (tarea humana):** revisar el texto actual de `/privacidad` y verificar que menciona:
   - Uso de Google Analytics 4 como herramienta de medición.
   - Tipos de cookies utilizadas (analíticas).
   - Mecanismo de revocación del consentimiento (link "Configurar cookies" en footer).
   Si falta, añadir un párrafo. Esta tarea no bloquea el merge técnico pero es prerrequisito de cumplimiento RGPD pleno.

8. **VERIFICACIÓN POST-DEPLOY:**
   - Ejecutar CA-01 a CA-05 inspeccionando Network/DevTools en navegador.
   - Validar CA-06 a CA-08 con GA4 DebugView en tiempo real.
   - Validar CA-13 con Lighthouse antes/después.

### Dependencias con otras specs

- **Bloqueada por:** SPEC-13 (necesita `NEXT_PUBLIC_SITE_URL` para la carga condicional por host).
- **Vinculación GA4↔GSC bloqueada por:** SPEC-14 (necesita dominio verificado en GSC).
- **Bloquea a:** SPEC-22 piloto (el piloto se elige por procesos más visitados según GA4 — sin datos, se va con sector salud por defecto).
- **Pre-requisito de:** SPEC-23 (análisis continuo necesita GA4 + GSC activos).

### Lecciones aplicables (LESSONS-LEARNED.md)

- **LL-006 (whitelist explícita):** no se trackea por defecto en todos los hosts — se declara explícitamente el host autorizado.
- **LL-001 (tipos auto-generados Supabase):** no aplica.

---

## Tests requeridos

### Tests unitarios

Ninguno requerido.

### Tests de integración

CA-01 a CA-13 validados manualmente con DevTools, GA4 DebugView, Brave/uBlock y Lighthouse.

### Tests E2E

No aplica.

*(P9 — Tests donde aportan valor. La validación con GA4 DebugView es el equivalente más fiable de un test de integración para tracking.)*

---

## Out of scope (explícito)

- Configuración del dashboard de KPIs SEO en GA4 (impresiones, clics, posición media por sector). Es trabajo de configuración dentro de GA4 (Explorations o Looker Studio), no de código. Se hace tras la vinculación GA4↔GSC, una vez haya datos. Posible SPEC operacional aparte.
- Eventos custom de conversión (lead_form_submitted, audit_pdf_downloaded, etc.). Las conversiones base ya están cubiertas por `page_view` + Enhanced Measurement de GA4 (scroll, outbound clicks, file_download automáticos). Custom events más finos se añaden en SPEC futura cuando se identifique necesidad real.
- Server-side tracking / Google Tag Manager. La instalación cliente vía `@next/third-parties` cubre el caso del catálogo (web pública sin lógica de personalización por usuario). GTM solo se justifica si en algún momento se quieren orquestar múltiples tags (Meta Pixel, LinkedIn Insight Tag, etc.).
- Migración a Plausible u otra herramienta privacy-first. Decidido en D1 que vamos con GA4.
- Auditoría legal RGPD/LOPDGDD completa (política de cookies, registro de tratamientos). Cubre lo mínimo técnico (banner + Consent Mode); la documentación legal queda fuera.

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-06-30 | Versión inicial — modo creación a partir del plan SEO + GEO (ClickUp knvz4-239675). | David Navarrete |
| 1.1 | 2026-06-30 | Resuelta ambigüedad 1: GA4 se instala vía `@next/third-parties/google` (Opción A, librería oficial de Next). Se monta en el root layout con `<GoogleAnalytics gaId={MEASUREMENT_ID} />`. | David Navarrete |
| 1.2 | 2026-06-30 | Resuelta ambigüedad 2: banner custom mínimo dentro de esta SPEC (Opción A). 2 botones (Aceptar/Rechazar), persistencia 6 meses, reabrible desde footer. Añadidos CA-14 a CA-17 para el banner. | David Navarrete |
| 1.3 | 2026-06-30 | Spec aprobada para implementación. | David Navarrete |
