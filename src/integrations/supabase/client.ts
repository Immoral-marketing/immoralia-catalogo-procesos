/**
 * Re-export de compatibilidad — SPEC-06.
 *
 * La fuente de verdad del cliente Supabase está ahora en:
 *   src/lib/supabase/client.ts  (usa @supabase/ssr, SSR-safe, sin guards manuales)
 *
 * Este fichero se mantiene para no romper los imports existentes en:
 *   src/components/  (Chatbot, ContactForm, SectorChatbot, etc.)
 *   src/views/       (AdminPage, AfiliadoPage, etc.)
 *
 * Import recomendado para código nuevo:
 *   import { supabase } from "@/lib/supabase/client"
 */
export { supabase, createClient } from '@/lib/supabase/client'
