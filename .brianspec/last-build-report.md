═══════════════════════════════════════════════
📋 SPEC-26: SSR del contenido en fichas de proceso
Fecha: 2026-07-06
Rama: brianspec/26-ssr-contenido-fichas-proceso
═══════════════════════════════════════════════

ARCHIVOS CREADOS/MODIFICADOS:
- src/views/ProcessDetail.tsx — eliminado useSearchParams (forzaba render solo-cliente de toda la ficha en rutas estáticas); ?sector= se lee tras el montaje con window.location.search. Sección FAQs pasa a renderizar faqs_citables (con fallback a faqs legacy) para paridad con el schema FAQPage. onboardingAnswers se carga tras el montaje (evita mismatch de hidratación).
- src/components/SeoAccordionContent.tsx (NUEVO) — variante de AccordionContent con forceMount + data-[state=closed]:hidden: las respuestas FAQ existen en el HTML del servidor aunque el acordeón esté cerrado. Wrapper propio porque el de shadcn aplica className a un div interno sin data-state.
- src/lib/SelectionContext.tsx — estado inicializado con valores por defecto y cargado desde localStorage tras el montaje (patrón SSR-safe), con flag `hydrated` que retiene los efectos de guardado hasta completar la carga (evita pisar la selección guardada del usuario). Antes leía localStorage en el inicializador de useState → mismatch servidor/cliente en cualquier página SSR con selección guardada (bug latente que el SSR de fichas hizo visible).
- src/views/ProcessDetailFacturasVencidas.tsx — mismo fix de onboardingAnswers.

REVIEW-AGENT — Criterios de Aceptación:
- CA-01: ✅ HTML estático con exactamente 1 <h1> con el nombre del proceso (verificado en 3 fichas)
- CA-02: ✅ Descripción, pasos y FAQs (preguntas en triggers + respuestas en divs ocultos hasta clic — patrón aceptado por Google) como texto del HTML, no solo JSON-LD
- CA-03: ✅ Verificado en salud-voz-citas-247, industrial-captacion-peticiones-oferta y recopilacion-mensual-documentos (3 sectores)
- CA-04: ✅ Mecanismo ?sector= operativo tras montaje. Nota: ningún proceso define sector_variants en processes.ts hoy — riesgo real de regresión nulo
- CA-05: ✅ Cero errores/warnings de consola cargando ficha con y sin ?sector=, incluido el escenario con selección previa guardada en localStorage (que en la iteración 2 aún producía error de hidratación — detectado por David en su navegador)
- CA-06: ✅ Selección de proceso (toggle + persistencia verificados), modal de reserva GHL abre, acordeón FAQ abre/cierra
- CA-07: ✅ npm run build exit 0 — 159 fichas .html generadas estáticamente (SSG)
- CA-08: ✅ Schemas FAQPage/HowTo/Service presentes; el texto visible de FAQs ahora sale de faqs_citables — misma fuente que el schema → paridad exacta
Veredicto: APROBADO (8/8 CAs)

SECURITY-AGENT — Checklist web-app:
- ✅ Input ?sector= parseado con URLSearchParams, usado solo como clave de lookup en objeto conocido — sin riesgo de inyección
- ✅ Sin dangerouslySetInnerHTML, sin eval, sin superficie nueva
- ✅ Contenido forzado a DOM (FAQ) es público — sin exposición de datos sensibles
- ✅ Sin cambios en auth, endpoints ni secretos
Veredicto: NO BLOQUEANTE

ITERACIONES: 3
- Iteración 1: fix searchParams — el HTML ganó H1/contenido pero las FAQs no aparecían (la UI usaba el campo legacy `faqs` y Radix no montaba respuestas cerradas).
- Iteración 2: SeoAccordionContent + faqs_citables.
- Iteración 3: error de hidratación detectado por David con selección guardada — SelectionContext y onboardingAnswers leían localStorage en el inicializador de useState (bug latente en TODAS las páginas SSR, invisible hasta ahora porque las fichas no renderizaban nada en servidor). Fix SSR-safe con flag hydrated que además protege el localStorage del usuario de ser pisado.

LECCIONES APRENDIDAS EN ESTA IMPLEMENTACIÓN:
- LL-011 (nueva): useSearchParams en rutas estáticas degrada todo el árbol a render cliente → HTML vacío. Verificación curl obligatoria en páginas SEO-críticas.
- LL-012 (nueva): el contenido dentro de acordeones/tabs Radix NO existe en el HTML del servidor salvo forceMount; el wrapper shadcn no permite ocultarlo por estado (className va a un div interno).
- LL-013 (nueva): nunca leer localStorage en el inicializador de useState en componentes que se renderizan en servidor — mismatch de hidratación. Cargar tras el montaje con guard para no pisar lo guardado.

OBSERVACIÓN FUERA DE SCOPE (proponer aparte):
- descripcion_citable (SPEC-22) no se consume en el frontend — solo fluye a Supabase vía sync. Valorar si debe renderizarse en la ficha o usarse como meta description. No se toca en esta spec.

═══════════════════════════════════════════════
ESTADO: LISTO PARA MERGE
═══════════════════════════════════════════════
