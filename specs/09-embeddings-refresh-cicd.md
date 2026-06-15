# SPEC-09: Automatizar refresh de embeddings en CI/CD

**Versión:** 1.0
**Estado:** aprobada
**Tipo de proyecto:** web-app
**Última actualización:** 2026-06-15
**Owner:** David Navarrete

---

## Descripción

Añadir un step automático al workflow `.github/workflows/supabase-sync.yml` que regenere los embeddings del chatbot en producción tras el deploy de migraciones y edge functions. Actualmente, cuando se mergea un PR a `main` con cambios en `processes.ts` o en la knowledge base, el RAG de producción queda desactualizado hasta que alguien regenera los embeddings manualmente con el script `scripts/generate_embeddings.mjs`.

---

## Actores

- **Developer:** hace merge de staging a main. El refresh de embeddings se ejecuta automáticamente, sin intervención manual.
- **GitHub Actions:** orquesta el workflow completo (migraciones → edge functions → embeddings).
- **Script `generate_embeddings.mjs`:** llama a OpenAI para vectorizar los documentos de la knowledge base y los inserta en `chatbot_knowledge` de producción.
- **Equipo técnico:** recibe notificación si el step de embeddings falla (sin bloquear el deploy).

---

## Flujos principales

### Flujo 1: Deploy completo con regeneración de embeddings

1. PR `staging → main` se mergea.
2. El workflow `supabase-sync.yml` corre.
3. Step 1: `supabase db push` aplica migraciones a producción ✅ (existente).
4. Step 2: `supabase functions deploy` aplica edge functions a producción ✅ (existente).
5. **Step 3 (nuevo):** ejecutar `node scripts/generate_embeddings.mjs` apuntando a producción para regenerar los embeddings de todos los sectores.
6. El step 3 loguea cuántos documentos se han indexado por sector.
7. Si el step 3 falla, el workflow lo registra como `continue-on-error: true` (el deploy no queda bloqueado) y la notificación de fallo queda en el log de GitHub Actions.

### Flujo 2: Deploy sin cambios en knowledge base

1. PR `staging → main` se mergea (solo cambios de UI, por ejemplo).
2. Los steps 1 y 2 corren como siempre.
3. El step 3 también corre y regenera embeddings de todos los sectores — el coste es asumible (~$0.01-0.05 con `text-embedding-3-small` para ~150 procesos) y la regeneración es idempotente (si el texto no cambió, el vector es prácticamente idéntico y el upsert no tiene impacto funcional).
4. **Decisión:** regenerar siempre todos, sin lógica de detección de cambios. Si el catálogo crece a miles de procesos y el coste se vuelve relevante, se añade detección inteligente en una versión futura.

---

## Flujos alternativos / Edge cases

- **Fallo de OpenAI API (timeout, rate limit, outage):** el step de embeddings falla. El deploy de migraciones y edge functions ya completó, por lo que producción funciona. El RAG queda desactualizado hasta el próximo merge o intervención manual. El fallo queda visible en el log de GitHub Actions.
- **Variables de entorno de producción no configuradas como secrets:** el step falla con error claro ("variable no definida"). El resto del workflow no se ve afectado.
- **Script `generate_embeddings.mjs` no soporta apuntar a producción:** el agente de implementación debe leer el script y, si no soporta apuntar a prod (mediante parámetro `--target=prod` u otro mecanismo), lo modifica como parte de esta spec. No es un bloqueante externo.
- **PR con documentos muy numerosos (>500):** el step puede tardar varios minutos. Si el runner de GitHub Actions tiene un timeout de 10 minutos, puede fallar. {{PENDIENTE — verificar tiempos reales antes de definir estrategia de timeout}}.

---

## Criterios de aceptación

- [ ] CA-01: El workflow `supabase-sync.yml` incluye un step nuevo que ejecuta el script de regeneración de embeddings después del deploy de edge functions.
- [ ] CA-02: El step usa secrets de GitHub ya configurados para acceder a la BBDD de producción y a la API de OpenAI (`PROD_SUPABASE_URL`, `PROD_SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY` o equivalentes).
- [ ] CA-03: Si el step de embeddings falla (fallo de OpenAI, error de red, timeout), el workflow completa con estado de warning pero NO bloquea el deploy — los steps 1 y 2 (migraciones y edge functions) se consideran el deploy principal.
- [ ] CA-04: El log del step muestra cuántos documentos se indexaron (o el error si falló), visible en la pestaña Actions de GitHub.
- [ ] CA-05: El step instala correctamente las dependencias Node necesarias para ejecutar el script antes de correrlo.
- [ ] CA-06: El step regenera embeddings de todos los sectores en cada merge, sin lógica de detección de cambios (siempre completo).
- [ ] CA-07: En un merge real a main que incluya cambios en `processes.ts`, se verifica en la tabla `chatbot_knowledge` de producción que los embeddings se actualizaron (timestamp `updated_at` posterior al merge).
- [ ] CA-08: Los secrets de producción usados en el step NO aparecen en los logs del workflow (GitHub Actions oculta secrets automáticamente, verificar que el script no los imprime por error).

---

## Modelo de datos

Sin cambios. El step lee `chatbot_knowledge` de producción vía el cliente Supabase y lo sobreescribe con los embeddings regenerados. La estructura de la tabla no cambia.

---

## CI/CD — Cambios en el workflow

### Archivo modificado

`.github/workflows/supabase-sync.yml`

### Step nuevo (conceptual)

```yaml
- name: Regenerate chatbot embeddings (production)
  continue-on-error: true
  env:
    PROD_SUPABASE_URL: ${{ secrets.PROD_SUPABASE_URL }}
    PROD_SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.PROD_SUPABASE_SERVICE_ROLE_KEY }}
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
  run: |
    node --version
    npm ci
    node scripts/generate_embeddings.mjs --target=prod --apply
```

> **Nota:** el nombre exacto de los secrets y de los parámetros del script se confirman en la fase de implementación tras inspeccionar el script actual. Esta es la forma conceptual.

### Secrets requeridos en GitHub

Los siguientes secrets deben existir en el repositorio de GitHub:

| Secret | Origen | Ya existe? |
|---|---|---|
| `PROD_SUPABASE_URL` | Panel Supabase producción | {{PENDIENTE — verificar}} |
| `PROD_SUPABASE_SERVICE_ROLE_KEY` | Panel Supabase producción | {{PENDIENTE — verificar}} |
| `OPENAI_API_KEY` | OpenAI Dashboard | {{PENDIENTE — verificar}} |
| `SUPABASE_ACCESS_TOKEN` | Ya usado en el workflow | ✅ |

---

## Notas de seguridad

- **Secrets en logs:** el script no debe imprimir las claves por stdout. GitHub Actions oculta los secrets automáticamente, pero si el script logea variables de entorno completas, puede exponer prefijos. El agente de implementación debe verificar que el script no hace `console.log(process.env)`.
- **Service role key de producción en CI:** la service role key tiene permisos completos sobre la BBDD. Scope mínimo: el script solo necesita INSERT/UPDATE en `chatbot_knowledge` y SELECT en `processes`. {{PENDIENTE — evaluar si conviene crear un rol restringido o reutilizar la service role}}.
- **Rate limiting OpenAI:** el script llama a la API de embeddings por cada documento. Un merge grande puede disparar muchas peticiones en poco tiempo. El script debe manejar rate limit (429) con reintentos exponenciales o el step fallará silenciosamente en el edge case de mucho volumen.

---

## Plan de implementación

### Agentes

- **02-BACKEND-AGENT (o el agente de CI/CD):** modificar `.github/workflows/supabase-sync.yml` para añadir el step de embeddings.
- **El agente debe leer el script `scripts/generate_embeddings.mjs` antes de implementar para confirmar:** qué parámetros acepta, si soporta `--target=prod`, qué variables de entorno necesita, cuánto tarda en la práctica con el volumen actual de documentos.

### Desglose de tareas

1. Leer `scripts/generate_embeddings.mjs` y documentar los parámetros y variables de entorno que necesita.
2. Confirmar qué secrets ya están configurados en GitHub y cuáles faltan.
3. Añadir el step al workflow con `continue-on-error: true`.
4. Verificar que el step instala dependencias correctamente (el runner parte de un checkout limpio).
5. Hacer un merge de prueba a staging (no a main) para validar el step en un entorno controlado, o simular el workflow manualmente con `workflow_dispatch`.
6. Verificar en el log de GitHub Actions que los secrets no se imprimen.
7. Hacer el merge real a main y comprobar `chatbot_knowledge` de producción.

### Dependencias

- No requiere otras specs activas.
- Requiere que los secrets de producción estén configurados en GitHub antes del primer deploy con este step.

---

## Tests requeridos

### Verificación manual en CI

- Ejecutar el workflow en un entorno controlado (workflow_dispatch o merge a una rama de prueba que simule el trigger) y verificar:
  - El log muestra documentos indexados.
  - Los secrets no aparecen en el log.
  - Si se simula un fallo de OpenAI, el workflow continúa con warning.

---

## Out of scope (explícito)

- Regenerar embeddings solo para los sectores modificados en el PR (detección de diff selectiva) — la regeneración es siempre completa en esta versión.
- Notificaciones adicionales de Slack o ClickUp cuando falla el step de embeddings (el log de GitHub Actions es suficiente en v1).
- Crear un rol Supabase con permisos mínimos para el script de embeddings (puede ser mejora futura).
- Modificar el script `generate_embeddings.mjs` para soportar nuevos parámetros si actualmente no los soporta — si hay que modificar el script, ese trabajo es parte de esta spec.

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-06-15 | Versión inicial en modo creación | David Navarrete |
| 1.1 | 2026-06-15 | Decisión: regenerar todos siempre + scope incluye modificar el script si es necesario. Spec aprobada para implementación | David Navarrete |
