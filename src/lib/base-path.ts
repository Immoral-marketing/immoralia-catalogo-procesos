// SPEC-20: el catálogo vive bajo immoralia.es/procesos (basePath de Next).
// next/link, next/router y next/image aplican el basePath automáticamente,
// pero fetch(), <video src> y cualquier URL construida a mano NO — deben
// pasar por este helper. El valor llega de next.config.ts vía env pública.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export const withBasePath = (path: string): string => `${BASE_PATH}${path}`
