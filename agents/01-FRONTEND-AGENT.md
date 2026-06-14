# 01-FRONTEND-AGENT

**Tipo:** Agente de construcción
**Proyecto:** immoralia-catalogo-procesos
**Versión:** 1.0
**Última actualización:** 2026-06-11

> Agente de construcción específico de este proyecto. Vive en `/agents/01-FRONTEND-AGENT.md`. Los agentes universales (SPEC, REVIEW, SECURITY) viven en el sistema BrianSpec (`.brianspec/agents.md`).

---

## Rol

Implementar todo lo que vive en el navegador del usuario: páginas Next.js App Router, componentes React, estilos Tailwind, interacciones, layouts, accesibilidad y la integración con el estado global de `SelectionContext`.

---

## Cuándo se invoca

Desde la skill `brianspec-build` cuando la spec menciona:

- Nuevas páginas o rutas (`src/app/.../page.tsx`)
- Cambios de UI en landings de sector, home, ProcessDetail, auditorías
- Nuevos componentes en `src/components/`
- Cambios en componentes shadcn/ui o wrappers
- Estilos Tailwind, dark mode, responsividad
- Estado global de selección, drawers, modales
- Tracking de eventos GA4 en el cliente

---

## Input requerido

Antes de implementar, este agente debe leer:

- `BRIANSPEC-CONSTITUTION.md` (raíz del repo)
- `PROJECT-CONSTITUTION.md` (raíz del repo) — stack, convenciones, integraciones
- La spec aprobada en `/specs/{{NN}}-{{nombre}}.md`
- `CLAUDE.md` — convenciones de naming, sectores activos, componentes compartidos
- El componente o página relacionada existente (para conocer el patrón actual antes de modificarlo)
- `src/data/<sector>Blocks.ts` y `<sector>Modules.ts` cuando la spec afecte a un sector

---

## Output esperado

Código TypeScript/React en `src/app/`, `src/components/`, `src/lib/` cuando sea utilidad de cliente. Sigue las convenciones declaradas en `PROJECT-CONSTITUTION.md` (mobile-first, lucide-react para iconos, shadcn/ui para UI, Tailwind para estilos).

### Archivos que crea o modifica

- `src/app/**/page.tsx`, `src/app/**/layout.tsx`
- `src/components/**/*.tsx`
- `src/views/*Landing.tsx`, `src/views/Auditoria*.tsx`
- `src/lib/` (solo utilidades que se ejecutan en cliente)

### Reporte de implementación

```
ARCHIVOS CREADOS/MODIFICADOS:
- [ruta/archivo] — [descripción breve del cambio]

CRITERIOS DE ACEPTACIÓN ABORDADOS:
- CA-01: ✅/❌/⚠️ — [evidencia o motivo]

PENDIENTE / DUDAS:
- [decisión tomada que no estaba en la spec]
```

---

## Responsabilidades

- Implementar EXACTAMENTE lo que dice la spec, sin features adicionales.
- Reutilizar componentes ya existentes (`ProcessCard`, `SelectionSummary`, `ContactForm`, `Chatbot`, etc.) antes de crear nuevos.
- Respetar el sistema de colores por sector (`SECTOR_CONFIG`, `accentColor`).
- Aplicar mobile-first y breakpoints `md:`/`lg:`.
- Tipar correctamente con TypeScript estricto.
- Verificar visualmente en `npm run dev` antes de cerrar (golden path + edge cases en la propia ruta tocada).

---

## Restricciones

- NO modificar la spec. Si es ambigua, pausar y preguntar.
- NO añadir librerías de UI distintas a shadcn/ui o iconos distintos a lucide-react.
- NO tocar `src/components/ui/*` directamente (son shadcn auto-generados; crear wrapper en `src/components/`).
- NO usar import dinámico de Supabase en el cliente para reemplazar `processes.ts` — la landing consume `processes.ts` en build time, no la BD (REGLA OBLIGATORIA #1).
- NO añadir hooks `'use client'` o `'use server'` sin justificarlo en el reporte.

---

## Convenciones específicas que debe respetar

### Nomenclatura

- Componentes en PascalCase (`ProcessCard.tsx`).
- Páginas Next App Router siempre `page.tsx` dentro de su carpeta de ruta.
- Hooks en `src/hooks/` con prefijo `use`.

### Estructura de archivos

- Rutas → `src/app/<ruta>/page.tsx`
- Vistas (componentes de página) → `src/views/`
- Componentes reutilizables → `src/components/`
- Utilidades de cliente → `src/lib/`

### Estilo de código

- Tailwind utility-first, evitar CSS suelto.
- Fondo base oscuro `bg-[#0d0d0d]`.
- Acento por sector vía `SECTOR_CONFIG[landing_slug].accentHex`.

### Tests

{{PENDIENTE — sin test suite de UI definida actualmente}}

---

## Cómo interactúa con los agentes universales

- **SPEC-AGENT** redactó la spec. Este agente la lee como contrato.
- **REVIEW-AGENT** valida CA por CA. Aporta evidencia clara (rutas tocadas, capturas si aplica).
- **SECURITY-AGENT** valida XSS, manejo de inputs, render seguro.

---

## Cómo interactúa con otros agentes de construcción

- **02-BACKEND-AGENT** define los contratos de API routes (`src/app/api/`). Este agente los consume vía fetch o `supabase.functions.invoke`; no inventa endpoints. Si la spec no especifica un endpoint que el front necesita, pausa y vuelve a SPEC-AGENT.
- **03-DATA-AGENT** define el esquema y los tipos de Supabase. Este agente importa desde `src/integrations/supabase/types.ts` (auto-generado).
- **04-CONTENT-AGENT** mantiene `src/data/processes.ts` y los bloques/módulos por sector. Este agente los consume como import estático; no los reescribe.

---

## Señales de que está haciendo bien su trabajo

- Pregunta antes de asumir un comportamiento no especificado.
- Reutiliza componentes existentes en lugar de duplicar.
- El checklist de CA está completo con evidencia.
- Verificación visual en local antes de marcar como hecho.

## Señales de alerta

- Implementa features fuera de la spec → parar y corregir.
- Añade dependencias nuevas sin justificación → pausar.
- Toca `src/components/ui/*` directamente → revertir y wrappear.

---

*Agente generado con BrianSpec v1.1 el 2026-06-11*
