═══════════════════════════════════════════════
📋 SPEC-21: GEO Foundation — LLMS.txt
Fecha: 2026-07-02
Rama: brianspec/21-geo-foundation-llms-txt
═══════════════════════════════════════════════

## ARCHIVOS CREADOS/MODIFICADOS

- `src/app/llms.txt/route.ts` — Route handler GET que sirve /llms.txt como text/plain; charset=utf-8 con revalidate 86400s (24h). Lista blanca declarativa de 10 sectores con URL absoluta y descripción por sector. Sin acceso a BBDD ni inputs de usuario.

## REVIEW-AGENT — Criterios de Aceptación

- CA-01 ✅ — HTTP 200, Content-Type: text/plain; charset=utf-8 (verificado con fetch localhost:8080/llms.txt)
- CA-02 ✅ — Arranca con `# procesos.immoralia.es` + 3 párrafos de descripción
- CA-03 ✅ — Sección "Páginas clave" con home, catálogo completo, índice auditorías + "Sectores cubiertos" con los 10
- CA-04 ✅ — Todas las URLs son absolutas con base NEXT_PUBLIC_SITE_URL (fallback https://procesos.immoralia.es)
- CA-05 ✅ — privateRoutesFound: [] — ninguna ruta privada ni redirect en el contenido
- CA-06 ✅ — Los 10 slugs de sector presentes: salud, gestorias, centros-deportivos, construccion, desarrolladoras, gastronomia-hosteleria, academias, agencias, ecommerce, industrial
- CA-07 ✅ — Lectura manual: queda claro qué es el catálogo, para quién y qué contiene
- CA-08 ✅ PLAUSIBLE — depende del middleware de SPEC-13 (ya desplegado); el route handler no tiene lógica de noindex — correcto, no debe tenerla
- CA-09 ✅ — Servida en /llms.txt raíz (build table: `○ /llms.txt`)
- CA-10 ✅ — Nivel intermedio: descripción + páginas top-level + 10 sectores con URL y línea. Sin procesos individuales.

**Veredicto: APROBADO (10/10 CAs)**

## SECURITY-AGENT — Checklist web-app

- ✅ Sin inputs de usuario (recurso solo lectura)
- ✅ Sin acceso a BBDD ni Supabase
- ✅ Sin secretos en código (NEXT_PUBLIC_SITE_URL es variable pública)
- ✅ Sin XSS posible (respuesta text/plain, no HTML)
- ✅ Sin rutas privadas expuestas (lista blanca declarativa, LL-006)
- ✅ Fallback seguro a dominio de producción
- 🟢 BAJO: sin Cache-Control explícita — Next.js gestiona revalidate via ISR, aceptable para texto plano público

**Veredicto: NO BLOQUEANTE**

## ITERACIONES: 1

## LECCIONES APRENDIDAS EN ESTA IMPLEMENTACIÓN

- LL-006 confirmada: la lista blanca declarativa de sectores (SECTORS array en route.ts) aplica exactamente el patrón aprendido en SPEC-06. Ningún sector privado ni redirect se coló.
- Sin lecciones nuevas.

═══════════════════════════════════════════════
ESTADO: LISTO PARA MERGE
═══════════════════════════════════════════════
