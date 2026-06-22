# Changelog

Todos los cambios notables del catálogo de procesos de Immoralia se documentan aquí.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) de manera ligera, y el proyecto sigue versionado interno por hitos (no semver estricto).

---

## [Sin publicar]

### Added
- Adopción de **BrianSpec v1.1** sobre proyecto ya existente (rama `fix/redefinir-chatbot-v3`).
  - `BRIANSPEC-CONSTITUTION.md` — principios globales del sistema.
  - `PROJECT-CONSTITUTION.md` — contexto específico del catálogo, stack, integraciones, REGLAS OBLIGATORIAS y restricciones.
  - `.brianspec/` — agentes universales (SPEC, REVIEW, SECURITY), checklists de seguridad, lecciones aprendidas, templates de spec.
  - `/agents/` — 4 agentes de construcción específicos: FRONTEND, BACKEND, DATA, CONTENT.
  - `/specs/` y `/specs/archive/` — estructura para iterar specs.
  - `docs/BRIANSPEC-CHEATSHEET.md` — guía rápida del ciclo de vida.
  - `.agents/skills/` con las 5 skills de BrianSpec instaladas + `skills-lock.json`.
- `.gitignore` actualizado para excluir settings locales de Claude Code sin afectar a las skills commiteadas.

### Pending
- Validar agentes de construcción propuestos en `/agents/`.
- Confirmar `clickup_space` y `clickup_list` en `PROJECT-CONSTITUTION.md` (sección 3).
- Definir política de tests (sección 6 y 10).
- Primera spec con BrianSpec: rediseño del chatbot v3 (`brianspec-spec` en `/specs/`).

---

*Antes de la adopción de BrianSpec, el catálogo evolucionó a través de PRs documentados en GitHub. A partir de este punto cada cambio relevante pasa por una spec antes de implementarse.*
