/**
 * POST /api/partners
 * Portado de supabase/functions/create-partner/index.ts
 *
 * Crea un nuevo partner (afiliado) enviando invitación por email.
 * Requiere Authorization header con JWT de un super_admin.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createCallerClient } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  try {
    // Verificar que el llamante está autenticado
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar identidad del llamante con su propio JWT
    const callerClient = createCallerClient(authHeader)
    const { data: { user }, error: userError } = await callerClient.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const adminClient = createAdminClient()

    // Verificar que el llamante es super_admin
    const { data: isSA } = await adminClient
      .from('super_admins')
      .select('user_id')
      .eq('user_id', user.id)
      .single()

    if (!isSA) {
      return NextResponse.json({ error: 'Acceso denegado: no eres super_admin' }, { status: 403 })
    }

    const { nombre, email, slug } = await req.json()

    if (!nombre || !email || !slug) {
      return NextResponse.json({ error: 'Faltan campos requeridos: nombre, email, slug' }, { status: 400 })
    }

    // Verificar que el slug no esté en uso
    const { data: existingSlug } = await adminClient
      .from('partners')
      .select('id')
      .eq('slug', slug.toLowerCase().trim())
      .single()

    if (existingSlug) {
      return NextResponse.json({ error: `El slug "${slug}" ya está en uso` }, { status: 409 })
    }

    const siteUrl = process.env.SITE_URL ?? 'https://immoralia.es/procesos'

    // Invitar usuario — Supabase envía email con enlace para establecer contraseña
    const { data: newUser, error: createError } = await adminClient.auth.admin.inviteUserByEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${siteUrl}/afiliado`,
        data: { nombre: nombre.trim(), slug: slug.toLowerCase().trim() },
      }
    )

    if (createError || !newUser.user) {
      return NextResponse.json({ error: createError?.message ?? 'Error al enviar la invitación' }, { status: 400 })
    }

    // Insertar en tabla partners
    const { data: partner, error: partnerError } = await adminClient
      .from('partners')
      .insert({
        user_id: newUser.user.id,
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        slug: slug.toLowerCase().trim(),
        activo: true,
      })
      .select()
      .single()

    if (partnerError) {
      // Rollback: eliminar el usuario Auth recién creado
      await adminClient.auth.admin.deleteUser(newUser.user.id)
      return NextResponse.json({ error: partnerError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, partner })
  } catch (err: any) {
    console.error('Error en /api/partners:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
