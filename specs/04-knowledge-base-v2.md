# SPEC-04: Knowledge base v2 — contenido y embeddings

**Versión:** 1.2
**Estado:** aprobada
**Tipo de proyecto:** web-app
**Última actualización:** 2026-06-12
**Owner:** David Navarrete

---

## Descripción

Elevar la calidad de la fuente de conocimiento del chatbot: rediseñar cómo se construye cada documento embebido (qué información lleva, cómo se redacta, qué metadatos lo acompañan), revisar editorialmente el contenido de los ~145 procesos del catálogo y regenerar todos los embeddings. Es el cimiento de la calidad de respuesta: con una base pobre, ningún modelo ni prompt responde bien.

---

## Actores

- **Chatbot (motor de SPEC-01):** consume la base de conocimiento mejorada vía búsqueda semántica.
- **Equipo Immoralia:** revisa y aprueba el contenido editorial; valida con la batería de tests.
- **Visitante anónimo:** beneficiario final — recibe recomendaciones más precisas.

---

## Flujos principales

### Flujo 1: Rediseño de la estructura del documento embebido

1. Se analiza qué campos de cada proceso forman hoy el documento embebido y qué señales le faltan a la búsqueda (vocabulario del cliente, sinónimos de dolores, casos de uso).
2. Se define la nueva plantilla de documento: qué campos entran, en qué orden, con qué redacción y qué metadatos (sector, bloque, código de módulo, slug) acompañan a cada documento.
3. **Granularidad decidida: un documento por proceso** (decisión owner v1.1). Concatena nombre, descripción, dolores, casos de uso, herramientas y metadatos. Mantiene el patrón actual y minimiza el coste de embeddings.
4. La decisión queda documentada y el proceso de extracción se actualiza.

### Flujo 2: Revisión editorial completa de los procesos

1. Se define una guía editorial breve: cómo redactar dolores (vocabulario literal del cliente), descripciones y casos de uso para que la búsqueda semántica los encuentre.
2. **Redacción asistida por IA** (decisión owner v1.1): para cada proceso, propongo dolores reescritos en vocabulario cliente, descripción más clara y casos de uso. El owner valida visualmente en local antes de sincronizar a BBDD.
3. Se revisan los ~145 procesos por sectores, priorizando los sectores con más tráfico.
4. Cada cambio de contenido se hace en la fuente de verdad de contenido y se sincroniza a la BBDD respetando la REGLA OBLIGATORIA #1 del proyecto (nunca editar la tabla directamente; los campos de assets no se tocan).
5. El equipo valida por lotes (sector a sector).

### Flujo 3: Regeneración y validación

1. Con la estructura nueva y el contenido revisado, se regeneran los embeddings de todo el catálogo más los documentos generales (FAQs). El script muestra coste estimado y pide **confirmación explícita** antes de disparar (decisión owner v1.1).
2. Se ejecuta la batería de tests de calidad: ~70 preguntas (8-12 por sector) propuestas por IA y validadas por el owner. Cada pregunta declara el proceso esperado. Cubren formulaciones coloquiales y casos sin solución en el catálogo.
3. Los fallos se analizan: o se ajusta contenido, o estructura, o parámetros de búsqueda (umbrales, número de resultados).
4. Validado en staging, se replica en producción.

---

## Flujos alternativos / Edge cases

- **Pregunta sin proceso aplicable:** el bot debe reconocer que no hay solución construida y ofrecerla como desarrollo a medida (sin inventar procesos). La base debe incluir documentos generales que cubran este caso.
- **Pregunta ambigua entre dos sectores:** los metadatos de sector deben permitir priorizar el sector activo sin ocultar alternativas claras de otros sectores.
- **Proceso oculto del catálogo:** los procesos no activos no deben aparecer en recomendaciones.
- **Vocabulario coloquial o con erratas:** la redacción de dolores debe incluir las formas reales en que el cliente describe su problema (validado con las preguntas de la batería).
- **Desincronización TS↔BBDD durante la revisión:** el flujo por lotes incluye verificación de sincronía antes de regenerar embeddings de cada lote.

---

## Criterios de aceptación

- [ ] CA-01: Existe una plantilla documentada de documento embebido (campos, orden, redacción, metadatos) y el proceso de extracción la aplica.
- [ ] CA-02: Existe una guía editorial breve para dolores, descripciones y casos de uso, aplicada en la revisión.
- [ ] CA-03: Los ~145 procesos han pasado revisión editorial y los cambios están en la fuente de verdad de contenido, sincronizados a BBDD según la REGLA OBLIGATORIA #1.
- [ ] CA-04: Todos los embeddings (procesos + documentos generales) están regenerados con la nueva estructura en staging y producción.
- [ ] CA-05: La batería de tests por sector (8-12 preguntas por sector, ~70 en total, incluyendo formulaciones coloquiales y casos sin solución) recomienda el proceso esperado en al menos el 90% de los casos.
- [ ] CA-06: Ninguna respuesta de la batería contiene enlaces a procesos inexistentes (cero slugs inventados).
- [ ] CA-07: Ante una pregunta sin proceso aplicable (incluida en la batería), el bot lo reconoce y ofrece desarrollo a medida en lugar de forzar una recomendación.
- [ ] CA-08: Los procesos ocultos no aparecen en ninguna respuesta de la batería.
- [ ] CA-09: El número de documentos en la tabla de conocimiento cuadra 1:1 con los procesos activos + documentos generales (verificación por consulta).
- [ ] CA-10: La batería de tests queda versionada en el repo y es re-ejecutable contra staging y producción.
- [ ] CA-11: El script de regeneración de embeddings nunca ejecuta sin confirmación explícita del operador (muestra coste estimado primero).

---

## Modelo de datos

### Entidades nuevas o modificadas

- **Tabla de conocimiento del chatbot:** puede ampliar metadatos (p. ej. tipo de documento, versión de plantilla). Sin cambios estructurales mayores previstos.
- **Procesos:** solo cambios de contenido en los campos de la whitelist de sincronización; los campos de assets no se tocan.

### Relaciones

Sin cambios.

### Migraciones necesarias

- Solo si se amplían metadatos de la tabla de conocimiento. La regeneración de embeddings no requiere migración.

---

## UI / Páginas afectadas

Indirectamente, las páginas del catálogo que muestran los textos revisados (descripciones, dolores) — la mejora editorial es visible también en las landings. Sin cambios de estructura de UI.

---

## API / Endpoints

Sin endpoints nuevos. Posible ajuste de parámetros de la búsqueda semántica (umbrales, número de resultados, capas) dentro del motor de SPEC-01.

---

## Notas de seguridad

### Datos sensibles involucrados

Ninguno — contenido editorial público.

### Validaciones server-side requeridas

No aplica.

### Autenticación y autorización

Los scripts de extracción/regeneración usan claves de servicio desde variables de entorno (nunca en código).

### Otros riesgos identificados

- **Coste de regeneración:** regenerar todos los embeddings tiene coste de API contenido (~150-300 documentos); ejecutar por lotes y no en bucles sin control.
- **Pisar producción con contenido a medias:** la regeneración en producción solo tras validar la batería completa en staging.

---

## Plan de implementación

### Arquitectura propuesta

- **04-CONTENT-AGENT:** guía editorial, revisión de los 145 procesos por lotes/sector, sincronización TS→BBDD.
- **03-DATA-AGENT:** plantilla de documento embebido, proceso de extracción, regeneración de embeddings, ajuste de parámetros de búsqueda, verificación de sincronía.
- **02-BACKEND-AGENT:** ajustes del motor si cambian las capas/umbrales de búsqueda.

### Desglose de tareas

1. Auditar la estructura actual del documento embebido y los fallos conocidos de matching.
2. Definir la plantilla nueva de documento y la granularidad.
3. Redactar la guía editorial de dolores/descripciones/casos de uso.
4. Actualizar el proceso de extracción a la plantilla nueva.
5. Revisión editorial por lotes (7 sectores + universales), con sync por lote.
6. Ampliar la batería de tests a guiones por sector con formulaciones coloquiales y casos sin solución.
7. Regenerar embeddings en staging y ejecutar la batería completa.
8. Iterar contenido/estructura/parámetros hasta superar el umbral del 90%.
9. Regenerar embeddings en producción y re-ejecutar la batería.

### Dependencias con otras specs

- Independiente en su mayor parte; puede avanzar en paralelo a SPEC-01/02/03. La validación final de calidad conversacional usa el motor de SPEC-01.

---

## Tests requeridos

### Tests unitarios

- No aplica (P9): el valor está en la batería semántica.

### Tests de integración

- Verificación de sincronía TS↔BBDD por lote.
- Conteo 1:1 de documentos vs procesos activos.

### Tests E2E

- Batería de calidad por sector re-ejecutable (es el corazón de esta spec).

---

## Out of scope (explícito)

- Cambios en el motor conversacional (SPEC-01) más allá de parámetros de búsqueda.
- Crear procesos nuevos en el catálogo o cambiar su estructura de campos.
- Cambio de modelo de embeddings (se mantiene el actual).
- Contenido multiidioma.

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-06-12 | Versión inicial generada desde entrevista de spec | David Navarrete |
| 1.1 | 2026-06-12 | Iteración: un doc por proceso (sin dividir), redacción editorial asistida por IA + validación owner, batería de ~70 preguntas propuestas por IA, regeneración con confirmación explícita. +1 CA (11) | David Navarrete |
| 1.2 | 2026-06-12 | Spec aprobada para implementación | David Navarrete |
