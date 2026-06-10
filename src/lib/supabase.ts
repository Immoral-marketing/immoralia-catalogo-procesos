/**
 * Re-export de compatibilidad — SPEC-06.
 *
 * La fuente de verdad del cliente Supabase está ahora en:
 *   src/lib/supabase/client.ts
 *
 * Este fichero se mantiene para no romper el import en:
 *   src/views/ProcessDetail.tsx
 *
 * Import recomendado para código nuevo:
 *   import { supabase } from "@/lib/supabase/client"
 */
export { supabase, createClient } from '@/lib/supabase/client'
