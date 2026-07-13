/**
 * Custom loader para <Image> — arregla el bug de basePath.
 *
 * next.config define basePath: '/procesos'. Next añade el basePath a la URL
 * pública que ve el navegador (`/procesos/_next/image?url=...`), PERO no lo
 * añade al parámetro `url=` que el optimizer usa internamente para localizar
 * la imagen. Como los ficheros se sirven bajo /procesos/... el optimizer
 * devuelve 404 y todas las imágenes locales quedan rotas.
 *
 * Referencia: vercel/next.js#48282.
 *
 * Este loader prefija manualmente el basePath para imágenes LOCALES
 * (`src` que empieza por `/`). Las URLs absolutas (Supabase, etc.) se
 * pasan tal cual — el optimizer las fetchea por HTTP y no dependen del
 * basePath.
 */
import { BASE_PATH } from './base-path'

interface LoaderProps {
  src: string
  width: number
  quality?: number
}

export default function catalogImageLoader({ src, width, quality }: LoaderProps): string {
  const isAbsolute = /^https?:\/\//i.test(src)
  const needsPrefix = !isAbsolute && src.startsWith('/') && BASE_PATH && !src.startsWith(`${BASE_PATH}/`)
  const resolvedSrc = needsPrefix ? `${BASE_PATH}${src}` : src
  const q = quality ?? 75
  return `${BASE_PATH}/_next/image?url=${encodeURIComponent(resolvedSrc)}&w=${width}&q=${q}`
}
