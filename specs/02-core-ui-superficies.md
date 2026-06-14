# SPEC-02: Core de UI conversacional y las 3 superficies

**Versión:** 1.2
**Estado:** aprobada
**Tipo de proyecto:** web-app
**Última actualización:** 2026-06-12
**Owner:** David Navarrete

---

## Descripción

Unificar las tres piezas actuales del chatbot (burbuja flotante, chat inline de la home y chat de sector) en un único componente conversacional con tres presentaciones visuales. La conversación es una sola y sigue al visitante por todo el sitio: lo que empieza en la home continúa en el sector o en la burbuja sin perder el hilo. Las respuestas se pintan en streaming y cada superficie arranca con sugerencias adaptadas a su contexto.

---

## Actores

- **Visitante anónimo:** conversa desde cualquiera de las tres superficies, en escritorio o móvil.
- **Equipo Immoralia:** se beneficia de mantener una sola lógica (un cambio se aplica a las tres superficies).

---

## Flujos principales

### Flujo 1: Conversación continua entre superficies

1. El visitante escribe en el chat de la home.
2. Navega a una landing de sector y abre el chat de sector (o la burbuja en cualquier ruta).
3. La conversación aparece con todo su historial: misma conversación, mismo hilo.
4. El identificador de conversación persiste en el navegador 7 días con renovación en cada uso (alineado con SPEC-01).

### Flujo 2: Inicio en una superficie de sector

1. El visitante abre el chat en una landing de sector sin conversación previa.
2. Ve un mensaje de bienvenida contextualizado al sector y chips de sugerencia con dolores típicos de ese sector.
3. Al pulsar una chip o escribir, arranca la conversación con el sector como contexto.

### Flujo 3: Respuesta en streaming

1. El visitante envía un mensaje.
2. Aparece el indicador de actividad y, en cuanto llega el primer fragmento, el texto se va escribiendo en vivo.
3. Al completarse, se renderizan los enlaces a procesos como chips clicables y el formato (negritas, listas) queda aplicado.
4. La vista NO hace scroll automático en ningún caso: el usuario controla siempre la posición de lectura (decisión owner, v1.4 — el autoscroll interfería al valorar mensajes anteriores).

### Flujo 4: Valorar una respuesta

1. Al pasar el ratón sobre una respuesta del bot (en móvil, iconos siempre visibles en tamaño reducido), aparecen dos iconos discretos (útil / no útil).
2. Al pulsar uno, se registra la valoración (SPEC-01) y el icono queda marcado.
3. El visitante puede cambiar su valoración.

### Flujo 5: Colapsar y retomar

1. En las superficies inline, el visitante puede colapsar la conversación y el estado se conserva.
2. La burbuja flotante se abre/cierra sin perder el hilo.
3. Al recargar la página, el historial se rehidrata desde el backend con el identificador guardado.
4. Al volver a la home (o a una landing) con conversación previa vigente, el chat inline aparece **colapsado con un acceso discreto** («Conversación guardada · N mensajes») que al pulsarlo expande el historial completo. No invade la página a quien solo viene a mirar.

---

## Flujos alternativos / Edge cases

- **Conversación caducada (>7 días):** el cliente detecta el identificador inválido, limpia el almacenamiento local y arranca conversación nueva sin mostrar error.
- **Streaming interrumpido (pérdida de red):** se muestra aviso discreto con opción de reintentar; al recargar, el historial completo viene del backend.
- **Visitante con JavaScript parcial / lector de pantalla:** la conversación es navegable por teclado y los mensajes tienen semántica accesible.
- **Dos superficies visibles a la vez (inline + burbuja):** en rutas con chat inline (home y landings de sector) la burbuja NO se renderiza. La burbuja vive en el resto de rutas públicas de visitante (catálogo completo, detalle de proceso, auditorías, etc.) y queda excluida de las zonas internas (admin y panel de afiliados).
- **Mensaje muy largo del bot:** el contenedor escalable mantiene el scroll utilizable; los enlaces a procesos no se rompen.
- **Ruta sin sector (página genérica):** la burbuja funciona con contexto global, chips genéricas.

---

## Criterios de aceptación

- [ ] CA-01: Una conversación iniciada en la home continúa con el mismo historial al abrir la burbuja flotante en otra ruta y al abrir el chat de una landing de sector.
- [ ] CA-02: Las tres superficies consumen el mismo componente conversacional (un único punto de mantenimiento para lógica de mensajes, streaming, enlaces y valoración).
- [ ] CA-03: Las respuestas se pintan en streaming: el texto aparece progresivamente antes de completarse.
- [ ] CA-04: El chat NUNCA hace scroll automático — ni al llegar mensajes nuevos, ni durante el streaming, ni al valorar. El scroll es siempre del usuario.
- [ ] CA-05: Los enlaces a procesos del catálogo se renderizan como chips clicables que navegan a la página del proceso; los enlaces a sectores navegan a su landing.
- [ ] CA-06: Cada superficie muestra chips iniciales propias: genéricas en home y burbuja sin sector; específicas del sector en las landings de sector.
- [ ] CA-07: Los iconos de valoración aparecen al hover en escritorio y son visibles en móvil; al pulsar, el estado queda marcado y persiste al recargar.
- [ ] CA-08: Al recargar cualquier página con conversación vigente, el historial completo se rehidrata desde el backend.
- [ ] CA-09: Con conversación caducada, se arranca una nueva sin errores visibles.
- [ ] CA-10: En rutas con chat inline (home y landings de sector) la burbuja no se renderiza; en el resto de rutas públicas de visitante sí aparece; en admin y panel de afiliados no aparece nunca.
- [ ] CA-11: Las tres superficies son usables en 375px, 768px y 1280px sin desbordamientos ni elementos inaccesibles.
- [ ] CA-12: La estética sigue el sistema visual del catálogo (fondo oscuro, acento cian en home/global y acento del sector en cada landing).
- [ ] CA-13: Con conversación previa vigente, las superficies inline aparecen colapsadas con el acceso «Conversación guardada · N mensajes» y se expanden con el historial completo al pulsarlo.
- [ ] CA-14: Un enlace del bot a un proceso INEXISTENTE en el catálogo se renderiza como texto plano, nunca como enlace clicable — es imposible llegar a un 404 desde el chat.
- [ ] CA-15: Al pulsar una chip de proceso, la vista real del proceso se abre embebida en un panel lateral derecho sin abandonar la conversación; el panel ofrece abrir la página completa y se cierra recuperando la vista del chat intacta.

---

## Modelo de datos

No aplica — consume el modelo de SPEC-01. El cliente solo almacena localmente el identificador de conversación y su fecha de última actividad.

---

## UI / Páginas afectadas

### Páginas nuevas

Ninguna.

### Páginas modificadas

- Home (selector de sectores): el chat inline pasa a usar el core unificado.
- Landings de sector (las 7 activas): el chat de sector pasa a usar el core unificado con contexto de sector.
- Todas las rutas: la burbuja flotante pasa a usar el core unificado.

### Componentes reutilizables

- Un componente conversacional core (mensajes, input, streaming, enlaces, valoración, estados de carga/error).
- Tres envoltorios de presentación: flotante, inline home, inline sector.
- Las piezas de chatbot anteriores quedan retiradas al completar la migración.

### Breakpoints obligatorios

375px, 768px, 1280px.

### Estándar de calidad visual

Aplicar el criterio de las skills de diseño del proyecto. Requisitos específicos: estados de carga (indicador de actividad + streaming), estado de error con reintento, estado vacío con bienvenida y chips, transiciones suaves al abrir/cerrar/colapsar, coherencia con el acento de color por sector.

---

## API / Endpoints

Consume los endpoints de SPEC-01 (chat en streaming, valoración, recuperación de historial). No define endpoints propios.

---

## Notas de seguridad

### Datos sensibles involucrados

- Identificador de conversación en almacenamiento local del navegador.

### Validaciones server-side requeridas

- Cubiertas por SPEC-01.

### Autenticación y autorización

- No aplica más allá del identificador de conversación.

### Otros riesgos identificados

- **XSS en renderizado de respuestas:** el contenido del bot se renderiza con formato; la conversión de markdown a HTML debe sanitizarse (sin HTML arbitrario del modelo, lista blanca de elementos permitidos).

---

## Plan de implementación

### Arquitectura propuesta

- **01-FRONTEND-AGENT:** componente core conversacional, tres envoltorios, integración del streaming, chips por superficie, valoración, persistencia local del identificador, retirada de las piezas antiguas.
- **02-BACKEND-AGENT:** soporte en el contrato de los endpoints si la integración del streaming requiere ajustes.

### Desglose de tareas

1. Construir el componente core conversacional contra los endpoints de SPEC-01.
2. Implementar el renderizado en streaming con scroll al inicio de la respuesta.
3. Implementar el renderizado de enlaces a procesos/sectores como chips clicables, con sanitización.
4. Implementar la valoración al hover con persistencia.
5. Implementar la persistencia local del identificador y la rehidratación del historial.
6. Crear el envoltorio inline de home con sus chips genéricas.
7. Crear el envoltorio inline de sector con chips por sector (la redacción de las ~28 chips la propone la implementación basándose en los dolores reales del catálogo; el owner las valida visualmente en local).
8. Crear el envoltorio flotante con regla de no-duplicidad en rutas con inline.
9. Retirar las tres piezas anteriores y verificar que ninguna ruta las referencia.
10. Revisión visual responsive en los tres breakpoints.

### Dependencias con otras specs

- Requiere SPEC-01 implementada (o sus contratos congelados). SPEC-03 inserta su formulario dentro del core que define esta spec.

---

## Tests requeridos

### Tests unitarios

- Conversión segura de markdown a HTML (sanitización).
- Lógica de persistencia local (vigente/caducada).

### Tests de integración

- Continuidad de conversación entre superficies.
- Rehidratación tras recarga.

### Tests E2E

- Recorrido completo: home → conversación → navegar a sector → continuar conversación → valorar respuesta.

---

## Out of scope (explícito)

- Formulario de lead, handover y agendamiento (SPEC-03).
- Cambios en el motor o el modelo de datos (SPEC-01).
- Contenido de la base de conocimiento (SPEC-04).
- Rediseño de las landings más allá de la zona del chat.

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-06-12 | Versión inicial generada desde entrevista de spec | David Navarrete |
| 1.1 | 2026-06-12 | Iteración: burbuja oculta en rutas con inline y excluida de admin/afiliados, inline colapsado con resumen al retomar, chips redactadas por implementación. +1 CA (13) | David Navarrete |
| 1.2 | 2026-06-12 | Spec aprobada para implementación | David Navarrete |
| 1.3 | 2026-06-12 | Iteración post-implementación (feedback owner): garantía anti-404 en enlaces de proceso (CA-14) y consulta de proceso en panel lateral embebido sin perder la conversación (CA-15) | David Navarrete |
| 1.4 | 2026-06-12 | Feedback owner: eliminado todo scroll automático del chat (CA-04 redefinido) — el autoscroll se disparaba también al valorar mensajes anteriores | David Navarrete |
