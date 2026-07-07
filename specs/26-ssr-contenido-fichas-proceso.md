# SPEC-26: SSR del contenido en fichas de proceso

**Versión:** 1.1
**Estado:** aprobada
**Tipo de proyecto:** web-app
**Última actualización:** 2026-07-06
**Owner:** David Navarrete

---

## Descripción

Las ~160 fichas de proceso (`/catalogo/procesos/<slug>`) sirven HTML sin contenido visible: sin H1, sin descripción, sin pasos, sin FAQs. Todo se renderiza únicamente con JavaScript en el navegador. Los rastreadores de IA (GPTBot, ClaudeBot, PerplexityBot) no ejecutan JavaScript, por lo que toda la prosa citable y las FAQs de SPEC-22 les resultan invisibles — anulando el objetivo GEO. Google indexa estas páginas con retraso y despriorizadas (render en segunda oleada). Esta spec hace que el contenido SEO-crítico de las fichas se sirva en el HTML del servidor.

**Causa raíz identificada:** la vista de detalle lee los parámetros de la URL (`?sector=`) con un hook de cliente que, en rutas generadas estáticamente, fuerza el renderizado exclusivamente en cliente de todo el árbol de componentes. El parámetro solo se usa para aplicar variantes de copy por sector.

---

## Actores

- **Rastreadores de búsqueda e IA:** deben poder leer el contenido completo de la ficha en el HTML inicial, sin ejecutar JavaScript.
- **Visitante:** no debe percibir ningún cambio funcional — la ficha se ve y funciona exactamente igual, incluidas las variantes por sector cuando llega con `?sector=`.

---

## Flujos principales

### Flujo 1: Rastreador solicita una ficha

1. El rastreador hace GET a `/catalogo/procesos/<slug>` sin ejecutar JavaScript.
2. El HTML devuelto contiene: H1 con el nombre del proceso, descripción/prosa citable, pasos de funcionamiento, FAQs visibles, beneficios y CTA.
3. El contenido visible coincide con lo declarado en los schemas JSON-LD (requisito de Google para rich results de FAQPage).

### Flujo 2: Visitante llega con variante de sector

1. El visitante llega a la ficha con `?sector=<slug>` (desde una landing de sector).
2. El servidor entrega el contenido base; el cliente aplica la variante de sector al hidratar (mejora progresiva).
3. El visitante ve la ficha personalizada como hasta ahora.

### Flujo 3: Visitante navega e interactúa

1. Selección de procesos, modal de reserva, compartir, onboarding — todo funciona exactamente igual que antes.

---

## Flujos alternativos / Edge cases

- **Ficha inexistente:** mantiene el comportamiento actual (404/fallback).
- **Proceso solo en BBDD (no en el archivo estático):** mantiene el fallback cliente actual — estas fichas no están en el sitemap y no son SEO-críticas.
- **Bloque "procesos relacionados" (datos de BBDD):** puede seguir siendo render cliente — no es contenido citable crítico.
- **Hidratación con `?sector=`:** el cambio de copy base→variante tras hidratar es aceptable; sin errores de hidratación en consola.

---

## Criterios de aceptación

- [ ] CA-01: `curl` a una ficha de proceso devuelve HTML que contiene exactamente un `<h1>` con el nombre del proceso.
- [ ] CA-02: El HTML del servidor contiene la descripción/prosa citable, los pasos y las FAQs del proceso como texto visible (no solo en JSON-LD).
- [ ] CA-03: Verificado en al menos 3 fichas de sectores distintos (salud, industrial, gestorías).
- [ ] CA-04: Las variantes por sector (`?sector=`) siguen aplicándose en el navegador — verificación manual del flujo landing → ficha.
- [ ] CA-05: Sin errores de hidratación en la consola del navegador al cargar una ficha con y sin `?sector=`.
- [ ] CA-06: La selección de procesos, el modal de reserva y el compartir selección siguen funcionando (smoke test manual).
- [ ] CA-07: `npm run build` genera las fichas estáticamente (sin degradar a render dinámico).
- [ ] CA-08: Los schemas JSON-LD siguen presentes y su contenido coincide con el texto visible.

---

## Modelo de datos

No aplica.

---

## UI / Páginas afectadas

### Páginas modificadas

- Detalle de proceso (`/catalogo/procesos/<slug>`) — mismo diseño, mismo comportamiento; solo cambia dónde se renderiza el contenido.

### Breakpoints obligatorios

Sin cambios visuales — no aplica re-verificación de diseño más allá del smoke test.

---

## API / Endpoints

No aplica.

---

## Notas de seguridad

Sin superficie nueva. El parámetro `?sector=` ya se valida contra la lista de sectores conocidos.

---

## Plan de implementación

### Arquitectura propuesta

**FRONTEND-AGENT** (único agente):

**Decisión (06/07/2026): enfoque de mínimo riesgo.** Eliminar el hook de parámetros de URL que fuerza el render en cliente y sustituirlo por lectura de los parámetros en el navegador tras el montaje (mejora progresiva). El contenido base se prerenderiza completo en build; la variante de sector se aplica al hidratar solo cuando el parámetro está presente. El refactor server-first completo queda descartado para esta spec (mismo resultado SEO, mucho más riesgo).

### Desglose de tareas

1. Sustituir la lectura de parámetros de URL por mecanismo que no fuerce render en cliente.
2. Verificar prerender completo con build local + curl.
3. Smoke test del flujo landing → ficha con variante de sector.
4. Verificación de los 8 CAs.

### Dependencias con otras specs

- SPEC-17 (SSG) — esta spec completa lo que SPEC-17 pretendía: las fichas ya se generaban estáticamente, pero vacías.
- SPEC-22 (prosa citable) — esta spec hace visible para las IAs el contenido que SPEC-22 creó.

### Lecciones activas de LESSONS-LEARned

- LL-003: distinguir estados definitivos de transitorios al tocar lógica de carga.
- Nueva lección a registrar: verificar el HTML del servidor con curl (no solo el navegador) tras cualquier cambio en páginas SEO-críticas — el navegador siempre ejecuta JS y enmascara este tipo de regresión.

---

## Tests requeridos

### Tests E2E

Smoke test manual: golden path ficha (con y sin `?sector=`), selección, reserva. Verificación curl de CA-01/02/03.

---

## Out of scope (explícito)

- Refactor arquitectónico completo de la vista de detalle (988 líneas) a componentes servidor — solo si se decide en AMBIGÜEDAD 1.
- El bloque "procesos relacionados" alimentado por BBDD (puede seguir en cliente).
- Cambios visuales o funcionales de cualquier tipo.

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-07-06 | Versión inicial — hallazgo crítico de la auditoría SEO del 06/07 | David Navarrete + Claude |
| 1.1 | 2026-07-06 | Enfoque mínimo decidido; spec aprobada para implementación (arranque pendiente de orden de David) | David Navarrete |
