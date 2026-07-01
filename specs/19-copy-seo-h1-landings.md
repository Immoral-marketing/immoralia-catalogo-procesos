# SPEC-19: Copy SEO de landings — H1 con keywords primarias

**Versión:** 1.4
**Estado:** aprobada
**Tipo de proyecto:** web-app
**Última actualización:** 2026-06-30
**Owner:** David Navarrete

---

## Descripción

Reescribir los H1 (y subheaders directamente relacionados) de las 10 landings de sector para incluir la keyword primaria de cada sector. Hoy los H1 son emocionales y de branding pero no contienen la palabra que el potencial cliente busca en Google (ej. `/sector/salud` tiene *"De gestionar agenda a mano, a liderar un negocio escalable"* — sin "centro de salud" ni "fisioterapia"). Esta SPEC alinea el H1 con la intención de búsqueda real, usando los datos de GSC generados por SPEC-14 y analizados por SPEC-23. Sin tocar diseño ni estructura HTML — solo texto.

---

## Actores

- **Rastreador de buscador (Googlebot, Bingbot):** al indexar cada landing, encuentra un H1 alineado con la keyword primaria. La landing empieza a posicionar para esa consulta.
- **Visitante que llega desde SERP:** confirma en el primer vistazo que la página trata sobre lo que buscó. Aumenta la coherencia expectativa → contenido → menor bounce rate.
- **Administrador (David):** revisa los borradores de copy que Claude genera antes de commitear. Puede ajustar tono, longitud, énfasis.
- **Skill SPEC-23 (análisis GSC):** proveedora de datos de keywords reales. Su output alimenta las decisiones de esta SPEC.

---

## Flujos principales

### Flujo 1: Producción del nuevo copy asistida por Claude

1. Claude consulta la fuente de keywords (según decisión de ambigüedad 2): datos de GSC (vía SPEC-23) o investigación de intención de búsqueda propia si GSC aún no tiene volumen.
2. Para cada landing de sector del alcance, Claude propone:
   - **H1 nuevo** que incluya la keyword primaria.
   - **Subheader H2 o eyebrow** que preserve el matiz emocional actual (según ambigüedad 4).
   - **Notas** sobre por qué la elección (qué keyword ataca, qué CTR esperado, etc.).
3. David revisa cada borrador antes de commitear (misma política que SPEC-22).
4. Se actualiza el archivo correspondiente del sector (`src/pages/{Sector}Landing.tsx` o donde viva el H1).

### Flujo 2: Un usuario busca en Google la keyword primaria de un sector

1. El usuario busca en Google *"automatización centros de salud"*.
2. Google devuelve `/sector/salud` con:
   - `<title>` específico (SPEC-15).
   - Rich snippet enriquecido (SPEC-16 + SPEC-22).
3. El usuario hace click.
4. La landing carga con el nuevo H1 (post-esta-SPEC) que contiene la keyword. Confirmación instantánea: "he llegado al sitio correcto".
5. Continúa leyendo. Bounce rate baja.

### Flujo 3: Medición del impacto

1. Antes de la SPEC: David guarda métricas base de cada landing (posición promedio, CTR, impresiones) desde GSC.
2. Se implementa la SPEC y se despliega.
3. Después de 2–4 semanas, David consulta las mismas métricas.
4. Si mejoran: éxito. Si algunas no mejoran, se itera sobre ese sector concreto.

---

## Flujos alternativos / Edge cases

- **Sector sin datos suficientes en GSC:** durante las primeras semanas o para sectores con poco tráfico, no habrá datos reales. Se recurre a investigación de Claude (según ambigüedad 2). Los H1 se marcan como "provisionales, revisar cuando haya datos GSC".
- **H1 propuesto que rompe la longitud recomendada (>70 caracteres):** el pipeline valida y reajusta.
- **Sector con keyword muy competida (ej. "gestoría"):** puede que competir de frente sea inviable. Claude sugiere long-tail más específica (ej. "automatización gestoría clientes").
- **Múltiples H1 detectados en una landing:** hoy hay un solo H1 por landing (auditoría inicial confirmada). Si aparece uno duplicado, se corrige simultáneamente.
- **Copy que rompe el diseño visual:** el H1 puede ser más largo/corto que el actual. Verificar en 375px/768px/1280px que el layout no se descuadra.
- **Landing "universal" (sin sector propio) como `/catalogo/completo`:** no está en el alcance de esta SPEC. Se trata en spec futura si aplica.

---

## Criterios de aceptación

- [ ] CA-01: Cada una de las 10 landings de sector afectadas por la SPEC (`/sector/*`) tiene un `<h1>` que contiene la keyword primaria decidida para ese sector. Verificable con `curl` + parseo del HTML.
- [ ] CA-02: Ninguna landing tiene más de un `<h1>`. Verificable con `grep -c "<h1" HTML`.
- [ ] CA-03: Cada `<h1>` NO supera 70 caracteres visibles (sin contar HTML tags).
- [ ] CA-04: El subheader inmediatamente relacionado (H2 o párrafo eyebrow según ambigüedad 4) preserva el matiz emocional/marca del copy anterior o lo evoluciona coherentemente.
- [ ] CA-05: Los cambios NO afectan a la estructura HTML/CSS de la landing — solo al texto. Verificable con captura visual antes/después: la disposición, colores, tamaños son iguales.
- [ ] CA-06: El resto de la landing (bloques de proceso, CTAs, secciones inferiores, chatbot, formularios, banner consent) sigue funcionando idénticamente.
- [ ] CA-07: Existe un registro de los borradores generados y los aprobados, guardado como documentación en `docs/seo-copy-h1-YYYY-MM-DD.md` o similar. Trazabilidad de qué keyword se eligió para cada sector y por qué.
- [ ] CA-08: Si la fuente de keywords fue GSC (ambigüedad 2 opción A), cada sector tiene al menos una keyword real de GSC como justificación de la elección. Si fue investigación de Claude (opción B), las hipótesis quedan documentadas para reevaluar cuando GSC tenga volumen.
- [ ] CA-09: Post-deploy 2–4 semanas, se registra la variación de CTR y posición promedio de cada landing en el registro de la SPEC (`docs/seo-copy-h1-YYYY-MM-DD-follow-up.md`).
- [ ] CA-10: Ninguna palabra clave interna prohibida ("KPI", "SLA", "TPM", etc. — ver PROJECT-CONSTITUTION.md restricción 7) aparece en el nuevo H1 o subheader.

---

## Modelo de datos

### Entidades nuevas o modificadas

No aplica en BBDD.

Modificaciones en código: los ficheros de las landings de sector — presumiblemente en `src/pages/{Sector}Landing.tsx` — donde vive el H1. No requieren cambios de esquema.

### Relaciones

No aplica.

### Migraciones necesarias

No aplica.

---

## UI / Páginas afectadas

### Páginas nuevas

Ninguna.

### Páginas modificadas

- **Las 10 landings de sector:** `/sector/salud`, `/sector/gestorias`, `/sector/centros-deportivos`, `/sector/construccion`, `/sector/desarrolladoras`, `/sector/gastronomia-hosteleria`, `/sector/academias`, `/sector/agencias`, `/sector/ecommerce`, `/sector/industrial`.

### Componentes reutilizables

Ninguno nuevo. Se reutiliza la estructura de H1 existente en cada landing.

### Breakpoints obligatorios

375 px, 768 px, 1280 px. Verificar que el nuevo H1 no rompe el layout en móvil (donde es más restrictivo).

### Estándar de calidad visual

Aplicar el criterio de las skills de diseño del proyecto. El nuevo copy no puede:
- Salirse del contenedor del H1.
- Cambiar el peso tipográfico o el tamaño de fuente.
- Alterar el ratio hero.

---

## API / Endpoints

### Endpoints nuevos

Ninguno.

### Endpoints modificados

Ninguno.

### Contratos de request/response

No aplica.

---

## Notas de seguridad

### Datos sensibles involucrados

Ninguno.

### Validaciones server-side requeridas

Ninguna (cambio de copy estático).

### Autenticación y autorización

No aplica.

### Otros riesgos identificados

- **Pérdida temporal de tráfico si el copy nuevo no funciona:** riesgo aceptable; se mide y se itera.
- **Copy que rompe la coherencia con el resto del site:** mitigado por revisión humana obligatoria de cada landing antes de commitear.
- **SEO negativo por cannibalización con el catálogo completo:** las 10 landings compiten con `/catalogo/completo`. Si los H1 son demasiado similares, Google podría no distinguirlas. Cada landing debe ATACAR una keyword distinta y específica del sector.

*(SECURITY-AGENT aplicará el checklist. Esta SPEC no toca autenticación, BBDD ni endpoints.)*

---

## Plan de implementación

### Arquitectura propuesta

Tres piezas:

1. **Investigación de keywords por sector** — Claude, alimentado por la fuente decidida en ambigüedad 2 (GSC + SPEC-23, o investigación propia si GSC vacío), produce para cada sector:
   - Keyword primaria (la que va en el H1).
   - Keywords secundarias / long-tail relacionadas.
   - Justificación (volumen esperado, intent).

2. **Redacción asistida de nuevo copy** — para cada landing, Claude propone H1 + subheader, David revisa, se aprueba y commitea.

3. **Actualización de las landings** — modificación puntual del texto en cada archivo de landing. Sin tocar CSS ni estructura.

### Desglose de tareas

1. **CONTENT-AGENT — Investigación de keywords:**
   - Consultar SPEC-23 (si operativa con datos) para keywords reales de GSC por sector.
   - Complementar con investigación de intent de búsqueda si es necesario.
   - Producir tabla `sector → keyword primaria + secundarias + volumen estimado + justificación`.
   - David valida la tabla antes de proceder a redacción.

2. **CONTENT-AGENT — Redacción de nuevos H1 y subheaders:**
   - Para cada uno de los 10 sectores, generar borrador de H1 + subheader.
   - Ajustar longitud (H1 ≤70 caracteres).
   - Preservar el tono / matiz emocional según decisión de ambigüedad 4.
   - David revisa cada landing antes de commitear.

3. **FRONTEND-AGENT — Aplicación del nuevo copy:**
   - Modificar el archivo de cada landing (`src/pages/{Sector}Landing.tsx` o donde viva el H1) sustituyendo el texto.
   - No tocar estructura HTML ni clases CSS.

4. **VERIFICACIÓN LOCAL:**
   - Ver cada landing en `npm run dev` en 375px/768px/1280px.
   - Confirmar que layout no se rompe con el nuevo copy.
   - Chequeo visual de coherencia con el resto del site.

5. **VERIFICACIÓN POST-DEPLOY:**
   - Ejecutar CA-01 a CA-08.
   - Guardar snapshot de métricas base de GSC/GA4 pre-deploy.

6. **SEGUIMIENTO 2–4 SEMANAS:**
   - Consultar variación de CTR, posición y clics por landing.
   - Documentar en follow-up (CA-09).
   - Iterar sobre landings que no mejoren.

### Dependencias con otras specs

- **Bloqueada idealmente por:** SPEC-23 (datos GSC procesados). Si SPEC-23 no está operativa, la SPEC se puede ejecutar con investigación de Claude como fuente (opción B en ambigüedad 2), con la advertencia de que los H1 son "provisionales, revisar con datos reales cuando lleguen".
- **Sinergia con:** SPEC-15 (metadata) — el título de la landing en SERP y el H1 deberían ser coherentes en keyword.
- **Alimenta a:** eventual rollout SEO en el resto del sitio (fichas de proceso, auditorías) si se ve que funciona.

### Lecciones aplicables (LESSONS-LEARNED.md)

- **LL-005 (dolores como campo con más impacto en matching semántico):** las keywords primarias suelen coincidir con verbalizaciones del cliente en primera persona (misma familia semántica que los `dolores`). Aprovecharlo.
- **LL-006 (whitelist explícita):** documentar cada sector con su keyword decidida — no dejarlo a memoria.

---

## Tests requeridos

### Tests unitarios

Ninguno directo.

### Tests de integración

CA-01 a CA-08 con `curl` + parseo del HTML.

### Tests E2E

Smoke test visual manual en 3 breakpoints por landing.

*(P9 — Tests donde aportan valor. El impacto real se mide con GSC/GA4 post-deploy.)*

---

## Out of scope (explícito)

- Reescribir copy de fichas de proceso (cubierto en SPEC-22).
- Reescribir metadata (cubierto en SPEC-15).
- Cambios de diseño en las landings (fuera de scope; solo texto).
- Traducción a otros idiomas.
- Landings distintas de sector (home, catálogo completo, auditorías, privacidad).
- A/B testing formal del copy nuevo vs viejo. Se hace deploy directo — si algo no funciona, se itera.
- Reescritura del resto de secciones inferiores de la landing (bloques de proceso, CTAs, etc.) — solo H1 y subheader inmediato.

---

## Política iterativa — por qué esta SPEC se limita al H1 + subheader

**Contexto de decisión (2026-06-30):**

El impacto marginal SEO en una landing tiene una distribución aproximada:

- **~70% del peso SEO** viene de: H1 + subheader inmediato + `<title>` + meta description + structured data.
- **~20% del peso SEO** viene de: copy secundario (bloques "qué puedes automatizar", "cómo funciona", CTAs, secciones destacadas).
- **~10% del peso SEO** viene del resto (footer, navegación, breadcrumbs visibles).

Como el 70% pesado ya lo cubren esta SPEC (H1 + subheader) + SPEC-15 (metadata) + SPEC-16 (structured data), atacar el 20% restante en un solo golpe tiene riesgos:

1. Rompe el tono comercial actual que ya convierte.
2. Al mover varias cosas a la vez, es difícil aislar qué mejora o empeora las métricas.
3. Puede no ser necesario: si con el 70% ya se alcanzan los objetivos, no hace falta más.

**Enfoque acordado con David:**

1. **Esta SPEC** cubre H1 + subheader (el 70%).
2. Se despliega y se mide con SPEC-23 durante 2–4 semanas.
3. Si las landings no mejoran lo suficiente en posición/CTR/clics: se abre una **SPEC futura (candidato: SPEC-25)** para ampliar la reescritura al copy secundario con datos GSC concretos que orienten qué secciones necesitan reforzarse y con qué keywords.
4. Si mejoran lo suficiente: se cierra aquí; el copy secundario sigue como está.

**Trigger de la SPEC-25 candidata:** tras 4 semanas post-deploy de esta SPEC, si el CTR o la posición promedio de al menos 3 de las 10 landings no ha mejorado ≥15%, se plantea la ampliación al copy secundario.

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-06-30 | Versión inicial — modo creación a partir del plan SEO + GEO (ClickUp knvz4-239675). | David Navarrete |
| 1.1 | 2026-06-30 | Resuelta ambigüedad 1: alcance limitado a H1 + subheader inmediato (Opción A). Documentada la política iterativa en sección propia: si tras 4 semanas post-deploy no se ve suficiente mejora, se abre SPEC-25 (candidato) para ampliar a copy secundario con datos GSC concretos. | David Navarrete |
| 1.2 | 2026-06-30 | Resuelta ambigüedad 2: fuente de keywords = datos reales de GSC vía SPEC-23 (Opción A). Esta SPEC queda BLOQUEADA hasta que SPEC-23 esté operativa con 2-4 semanas de datos. Sin datos reales, no se ejecuta — evita reiteración por hipótesis fallidas. | David Navarrete |
| 1.3 | 2026-06-30 | Resuelta ambigüedad 3: patrón H1 = keyword primaria explicativa + subheader = matiz emocional/marca (Opción A). Combinación clásica que preserva el gancho comercial actual sin sacrificar SEO. | David Navarrete |
| 1.4 | 2026-06-30 | Spec aprobada para implementación. | David Navarrete |
