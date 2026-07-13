/**
 * Custom loader para <Image> — arregla el bug de basePath.
 *
 * next.config define basePath: '/procesos'. Con el loader por defecto de
 * Next, las imágenes se sirven vía `/procesos/_next/image?url=...&w=...&q=...`
 * (el endpoint de optimización de Vercel). Ese endpoint devuelve 404 en este
 * proyecto incluso con el parámetro `url=` correctamente prefijado con el
 * basePath — es un fallo de la infraestructura de optimización de Vercel
 * con basePath (vercel/next.js#48282), no de la URL generada.
 *
 * `images.unoptimized: true` tampoco sirve: en ese modo Next.js NO antepone
 * el basePath al `src` de la imagen (otro comportamiento no documentado),
 * así que el <img> apunta a la raíz del dominio en vez de a /procesos/... .
 *
 * Este loader evita el optimizer por completo: devuelve directamente la URL
 * del fichero estático con el basePath prefijado a mano. Sin conversión
 * automática a webp/avif ni resize server-side, pero las imágenes SE VEN,
 * que es lo que importa. La mayoría ya están pre-optimizadas como .webp.
 */
import { BASE_PATH } from './base-path'

interface LoaderProps {
  src: string
  width: number
  quality?: number
}

export default function catalogImageLoader({ src }: LoaderProps): string {
  const isAbsolute = /^https?:\/\//i.test(src)
  if (isAbsolute) return src

  const needsPrefix = src.startsWith('/') && BASE_PATH && !src.startsWith(`${BASE_PATH}/`)
  return needsPrefix ? `${BASE_PATH}${src}` : src
}
