# SPEC-24: MCP custom de Google Search Console

**Versión:** 1.4
**Estado:** aprobada
**Tipo de proyecto:** web-app (infraestructura interna)
**Última actualización:** 2026-06-30
**Owner:** David Navarrete

---

## Descripción

Construir un servidor MCP (Model Context Protocol) custom que exponga las capacidades relevantes de Google Search Console a Claude Code y otros clientes MCP. Google Search Console NO tiene MCP oficial en el catálogo Brian de Immoralia. Sin este conector, SPEC-23 (análisis continuo automatizado del rendimiento SEO) no es viable — solo análisis manual desde la UI web de GSC. Esta SPEC crea la pieza de infraestructura que faltaba para cerrar el bucle "recogida de datos → análisis con IA → acción" del plan SEO.

---

## Actores

- **Claude Code (David en el editor):** cliente MCP local. Se conecta al servidor MCP para consultar métricas de GSC durante conversaciones (skills como "análisis semanal SEO", "qué páginas están perdiendo posición", etc.).
- **Servidor MCP custom (nuevo):** proceso Node.js que expone un conjunto de herramientas contra la API de Google Search Console. Autenticado con Service Account de Google Cloud con permisos de lectura sobre la propiedad `procesos.immoralia.es`.
- **API de Google Search Console:** servicio externo consumido por el servidor MCP. Requiere autenticación OAuth 2.0 vía Service Account.
- **Administrador (David):** configura Google Cloud (habilita la API, crea Service Account, comparte propiedad GSC con el email del Service Account) y arranca el servidor MCP.
- **Skill futura SPEC-23 (operacional):** consumidora principal. Consulta las herramientas del MCP para generar reportes semanales y detectar oportunidades.

---

## Flujos principales

### Flujo 1: Setup inicial del MCP (una vez)

1. David crea un proyecto en Google Cloud Console (o reutiliza uno de Immoralia).
2. Habilita la Google Search Console API en ese proyecto.
3. Crea un Service Account con rol mínimo (`Viewer` o similar).
4. Genera una clave JSON del Service Account.
5. En Google Search Console, comparte la propiedad `procesos.immoralia.es` con el email del Service Account como "Restricted" (solo lectura).
6. Configura las variables de entorno del servidor MCP con el contenido del JSON.
7. Instala/arranca el servidor MCP local.
8. Registra el servidor en la configuración MCP de Claude Code.

### Flujo 2: Claude Code consulta top queries

1. En una conversación de Claude Code, se invoca la herramienta `gsc_top_queries` con parámetros `site: 'procesos.immoralia.es', days: 28, limit: 20`.
2. El servidor MCP recibe la llamada por el transport configurado.
3. Autentica con Google usando el Service Account.
4. Llama a la Search Analytics API con la fecha y filtros pedidos.
5. Devuelve el JSON con las top queries a Claude Code.
6. Claude Code procesa los datos y los presenta al usuario.

### Flujo 3: Claude Code consulta el estado de indexación de una URL concreta

1. Invocación: `gsc_url_inspection(url: 'https://procesos.immoralia.es/sector/salud')`.
2. Servidor MCP llama a la URL Inspection API.
3. Devuelve estado de indexación, última fecha de rastreo, canonical detectado, verdicts de indexabilidad.

### Flujo 4: Claude Code solicita reindexación de una URL

1. Invocación: `gsc_submit_url(url: '.../salud')`.
2. Servidor MCP llama al método de solicitud de indexación de la Google Indexing API.
3. Devuelve confirmación.

### Flujo 5: Error de autenticación

1. La clave del Service Account está mal formada o ha caducado.
2. El servidor MCP intenta autenticar y falla.
3. Devuelve un error estructurado al cliente MCP.
4. El cliente muestra un mensaje claro que apunta al problema de configuración.

---

## Flujos alternativos / Edge cases

- **Propiedad GSC no compartida con el Service Account:** cualquier llamada devuelve un 403. El servidor MCP debe traducirlo a un error entendible ("Falta compartir la propiedad con el Service Account en Search Console").
- **Cuota de la API de GSC excedida:** GSC limita las llamadas por día. Si se alcanza el límite, el servidor devuelve el error del API con un mensaje que lo explique.
- **Query sin datos:** cuando se pide top queries de un rango de fechas sin tráfico, la respuesta es una lista vacía. No es un error.
- **URL fuera del sitio verificado:** si se pide `url_inspection` de un dominio que no está compartido con el Service Account, el API devuelve 403.
- **El servidor MCP no arranca:** el cliente MCP no encuentra el servidor. El cliente muestra el mensaje estándar de "MCP no disponible".
- **Cambio de Service Account:** el token debe rotar sin cambios de código. La variable de entorno lee el JSON actual en cada arranque del servidor.

---

## Criterios de aceptación

- [ ] CA-01: El código vive en la subcarpeta `gsc/` del monorepo `Immoral-marketing/MCP-Brian-Conectors` en GitHub. Es un proyecto TypeScript que usa `@modelcontextprotocol/sdk`.
- [ ] CA-02: El servidor MCP se puede instalar y arrancar con un solo comando documentado (`npm install && npm start` o equivalente).
- [ ] CA-03: El servidor expone las siguientes herramientas (decididas en ambigüedad 3):
  - **Lectura:** `gsc_top_queries`, `gsc_pages_with_low_ctr`, `gsc_url_inspection`, `gsc_indexed_count`.
  - **Escritura:** `gsc_submit_sitemap`, `gsc_list_sitemaps`, `gsc_delete_sitemap`, `gsc_submit_url`.
- [ ] CA-04: Cada herramienta MCP declara su schema de entrada con Zod (o equivalente), y valida los parámetros antes de llamar a la API de GSC.
- [ ] CA-05: La autenticación usa Service Account JSON leído de una variable de entorno (`GSC_SERVICE_ACCOUNT_KEY`). El JSON se parsea y se pasa al cliente oficial de Google APIs.
- [ ] CA-06: Los errores de la API de GSC (401, 403, 429, 500) se traducen a errores estructurados con mensaje humano legible que apunte a la causa probable.
- [ ] CA-07: El código NO tiene la clave del Service Account hardcoded ni ningún otro secreto.
- [ ] CA-08: El servidor MCP está registrado en la configuración MCP de Claude Code de David, de forma que las herramientas aparecen disponibles al invocar.
- [ ] CA-09: Una llamada real a `gsc_top_queries` con parámetros válidos devuelve datos reales de la propiedad `procesos.immoralia.es` (asumiendo que ya tiene datos — post-SPEC-14).
- [ ] CA-10: Existe un README en el repo/carpeta del MCP con: propósito, requisitos, setup de GCP paso a paso, configuración de env vars, comando de arranque, y cómo registrar el servidor en Claude Code.
- [ ] CA-11: Si el Service Account no tiene acceso a la propiedad, cualquier herramienta devuelve un error con mensaje que indique cómo compartir la propiedad en GSC.
- [ ] CA-12: El código pasa TypeScript strict sin errores.

---

## Modelo de datos

### Entidades nuevas o modificadas

No aplica. El MCP es un proxy stateless sobre la API de GSC — no persiste datos propios.

### Relaciones

No aplica.

### Migraciones necesarias

No aplica.

---

## UI / Páginas afectadas

### Páginas nuevas

Ninguna — el MCP no tiene UI.

### Páginas modificadas

Ninguna.

### Componentes reutilizables

No aplica.

### Breakpoints obligatorios

No aplica.

### Estándar de calidad visual

No aplica.

---

## API / Endpoints

### Endpoints nuevos

El servidor MCP expone herramientas vía MCP protocol (no HTTP REST tradicional). Cada herramienta actúa como un "endpoint" en la jerga del protocolo:

**Herramientas de lectura:**

| Nombre | Descripción | Parámetros | Auth |
|---|---|---|---|
| `gsc_top_queries` | Top queries orgánicas por rango de fechas | `site, days, limit` | Service Account |
| `gsc_pages_with_low_ctr` | Páginas con muchas impresiones y CTR bajo (oportunidad) | `site, days, ctr_threshold, min_impressions` | Service Account |
| `gsc_url_inspection` | Estado de indexación de una URL concreta | `url` | Service Account |
| `gsc_indexed_count` | Número total de URLs indexadas por el sitio | `site` | Service Account |

**Herramientas de escritura (para automatizar setup y reindexación):**

| Nombre | Descripción | Parámetros | Auth |
|---|---|---|---|
| `gsc_submit_sitemap` | Registra un sitemap en GSC (equivalente a "Sitemaps → añadir nuevo" en UI) | `site, sitemap_url` | Service Account |
| `gsc_list_sitemaps` | Lista los sitemaps registrados en la propiedad | `site` | Service Account |
| `gsc_delete_sitemap` | Elimina un sitemap registrado | `site, sitemap_url` | Service Account |
| `gsc_submit_url` | Solicita reindexación de una URL concreta | `url` | Service Account |

**Nota sobre permisos:** el Service Account necesita permiso `Full` (no `Restricted`) para las operaciones de escritura. La whitelist `GSC_ALLOWED_SITES` acota qué sitios pueden operarse desde el MCP.

### Endpoints modificados

Ninguno.

### Contratos de request/response

Definidos por el MCP protocol + Zod schemas. Cada tool devuelve JSON con la estructura documentada en el README.

---

## Notas de seguridad

### Datos sensibles involucrados

- **Clave del Service Account (JSON de Google Cloud):** contiene una `private_key` RSA. Es un secreto crítico. Debe vivir SOLO en variables de entorno o en un gestor de secretos, nunca en código versionado.
- **Datos de tráfico de GSC:** técnicamente son datos de negocio (queries, impresiones, clics). No son datos personales pero son sensibles competitivamente.

### Validaciones server-side requeridas

- Todas las entradas de las herramientas MCP se validan con Zod antes de pasarlas al cliente de Google APIs.
- El parámetro `site` debe coincidir con un sitio autorizado (por seguridad, hardcoded o env var `GSC_ALLOWED_SITES` con lista blanca). Un cliente MCP mal configurado no puede intentar consultar sitios ajenos.

### Autenticación y autorización

- El servidor MCP no valida autenticación del cliente (asume que quien tiene acceso al servidor local es el owner).
- La autenticación contra GSC va con Service Account, permisos mínimos (Restricted en la propiedad).

### Otros riesgos identificados

- **Filtrado accidental del Service Account:** mitigado por CA-07 + `.gitignore` del JSON local. El repositorio del MCP debe tener un `.env.example` sin credenciales reales.
- **Uso indebido de `gsc_submit_url` (spam a Google):** GSC tiene rate limits propios. Si se abusa, Google descarta las solicitudes. Riesgo bajo.
- **Cuota de la API compartida:** si otras herramientas de Immoralia consumen la misma API con el mismo proyecto GCP, hay riesgo de rate limit. Mitigado creando un proyecto GCP dedicado al MCP.

*(SECURITY-AGENT aplicará el checklist de `.brianspec/security-checklists.md`. Sección "Tipo: web-app" no aplica del todo — este es un servidor interno sin usuarios finales. Los ítems relevantes son "Secretos y configuración" y "Endpoints sensibles".)*

---

## Plan de implementación

### Arquitectura propuesta

Servidor MCP standalone en TypeScript, desplegado en un VPS de Immoral Group. Dependencias principales:

- `@modelcontextprotocol/sdk` — SDK oficial de MCP.
- `googleapis` — cliente oficial de Google APIs (incluye Search Console API).
- `zod` — validación de schemas de entrada.

**Ubicación del código:** repositorio `Immoral-marketing/MCP-Brian-Conectors` en GitHub. Es un monorepo (nombre en plural: "Conectors") pensado para alojar futuros MCPs custom de Immoralia. Este MCP vive como subcarpeta dedicada dentro del repo.

**Despliegue:** en el VPS de Hostinger de Immoral Group, **siguiendo el mismo patrón que los MCPs custom existentes del equipo** (contenedor Docker, mismo transport HTTP, mismo flujo de despliegue). El código se versiona en GitHub. El detalle exacto del transport (Streamable HTTP vs HTTP+SSE) se hereda del patrón vigente en los otros MCPs — no se decide aquí para evitar divergencia.

Estructura tentativa del proyecto (dentro del monorepo):

```
MCP-Brian-Conectors/
├── gsc/                          # este MCP
│   ├── src/
│   │   ├── index.ts              # entry point del servidor MCP
│   │   ├── auth.ts               # setup del Service Account
│   │   ├── tools/                # una herramienta por archivo
│   │   │   ├── top-queries.ts
│   │   │   ├── pages-low-ctr.ts
│   │   │   ├── url-inspection.ts
│   │   │   └── indexed-count.ts
│   │   └── utils/errors.ts       # traducción de errores API → mensajes humanos
│   ├── .env.example              # sin secretos
│   ├── README.md                 # setup completo
│   ├── package.json
│   └── tsconfig.json
├── (futuros MCPs aquí)
└── README.md                     # root del monorepo
```

Transport HTTP hereda del patrón existente de los MCPs del equipo (Docker + VPS Hostinger), no se decide en esta spec.

### Desglose de tareas

1. **DATA-AGENT — Setup de Google Cloud (tarea humana previa a implementar):**
   - Crear/reutilizar proyecto GCP.
   - Habilitar Search Console API + Web Search Indexing API.
   - Crear Service Account con rol mínimo.
   - Generar y descargar la clave JSON.
   - En GSC, compartir la propiedad `procesos.immoralia.es` con el email del Service Account (permisos `Restricted`).
   - Documentar el email del Service Account para el registro en `.env.example`.

2. **BACKEND-AGENT — Servidor MCP:**
   - Inicializar proyecto TypeScript con las dependencias listadas.
   - Implementar el bootstrap del servidor MCP con el transport HTTP heredado del patrón existente de los MCPs del equipo (Docker + VPS Hostinger).
   - Implementar la capa de autenticación (`auth.ts`) leyendo el JSON de la env var y creando el cliente `googleapis`.
   - Implementar cada herramienta como archivo separado con su Zod schema.
   - Implementar traducción de errores.

3. **BACKEND-AGENT — README completo:** documentar setup GCP, configuración de env vars, arranque local, y registro en la configuración MCP de Claude Code.

4. **DATA-AGENT — Registro en Claude Code (tarea humana):**
   - Añadir el servidor MCP a la configuración local de Claude Code (`claude_desktop_config.json` u similar según cliente).
   - Verificar que las herramientas aparecen disponibles.

5. **VERIFICACIÓN:**
   - Ejecutar cada herramienta contra datos reales de la propiedad GSC.
   - Comprobar CA-01 a CA-12.
   - Simular error de auth (borrar temporalmente permisos GSC) y verificar mensaje.

### Dependencias con otras specs

- **No bloqueada por:** ninguna spec del plan. Se puede arrancar en paralelo con Fase 1 y Fase 2.
- **Bloquea a:** SPEC-23 (análisis continuo automatizado necesita este MCP).
- **Debería precederse por:** SPEC-14 en producción, para que la propiedad GSC tenga datos que consultar. Sin datos, el MCP funciona pero devuelve listas vacías.

### Lecciones aplicables (LESSONS-LEARNED.md)

- **LL-006 (whitelist explícita):** validar sitios permitidos con env var `GSC_ALLOWED_SITES`. No aceptar cualquier valor del cliente.
- **LL-001 (tipos generados):** no aplica — no hay tipos de Supabase.

---

## Tests requeridos

### Tests unitarios

Ninguno estrictamente necesario. El MCP es un proxy delgado sobre la API de GSC.

### Tests de integración

CA-09 (llamada real con datos reales) como test manual de humo tras el setup.

### Tests E2E

No aplica.

*(P9 — Tests donde aportan valor. La complejidad real está en la configuración GCP, no en el código.)*

---

## Out of scope (explícito)

- Interfaz web para el MCP. No hay UI — se consume vía Claude Code / clientes MCP.
- Persistencia de las respuestas de GSC (cache local, base de datos). Cada llamada consulta la API en directo. Si en el futuro se quiere cache, se añade en SPEC futura.
- Autenticación multi-tenant. El MCP sirve solo la propiedad `procesos.immoralia.es` (o el listado del `GSC_ALLOWED_SITES`). Si algún día se quiere usar para otras propiedades de Immoral Group, se amplía.
- Publicación en el registry oficial de MCPs. Es infraestructura interna, no producto público.
- Integración con Bing Webmaster Tools u otros buscadores. Solo GSC.
- Escritura destructiva más allá de gestionar sitemaps (`delete_sitemap` sí incluido, pero no operaciones más peligrosas como bloquear rangos de URLs del índice masivamente).
- Verificación inicial de propiedad GSC. La API no lo soporta — sigue siendo tarea humana con DNS TXT (SPEC-14).

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-06-30 | Versión inicial — modo creación a partir del plan SEO + GEO (ClickUp knvz4-239675). | David Navarrete |
| 1.1 | 2026-06-30 | Resuelta ambigüedad 1: el código vive en el monorepo `Immoral-marketing/MCP-Brian-Conectors` (repo ya creado en GitHub, pensado para múltiples MCPs custom futuros). Este MCP ocupa la subcarpeta `gsc/`. Despliegue en VPS de Immoral Group. | David Navarrete |
| 1.2 | 2026-06-30 | Resuelta ambigüedad 2: despliegue en VPS Hostinger dentro de contenedor Docker, siguiendo el mismo patrón (incluido el transport HTTP) que los MCPs custom ya operativos del equipo. Consistencia = un solo patrón, un flujo de despliegue, un stack. | David Navarrete |
| 1.3 | 2026-06-30 | Resuelta ambigüedad 3: alcance = lectura + gestión de sitemaps + reindexación. 8 herramientas totales (4 de lectura, 4 de escritura). Service Account con permisos Full, acotado por whitelist `GSC_ALLOWED_SITES`. Automatiza todo lo que la API de GSC permite; la verificación inicial de propiedad sigue siendo manual (DNS TXT en SPEC-14). | David Navarrete |
| 1.4 | 2026-06-30 | Spec aprobada para implementación. | David Navarrete |
