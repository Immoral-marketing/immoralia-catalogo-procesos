-- SPEC-05: Registro de envíos transaccionales vía Resend.
-- Auditoría de qué email se envió, a quién, cuándo y resultado.

create table if not exists public.email_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Identificación del email
  kind text not null,           -- 'chatbot_lead_captured', 'contact_internal', 'partners_reset', etc.
  recipient text not null,      -- destinatario (puede ser team@immoralia.es para internos)
  subject text,

  -- Vínculos opcionales
  conversation_id uuid,         -- chatbot_conversations.id si aplica
  lead_id uuid,                 -- contact_submissions.id si aplica

  -- Resultado
  status text not null check (status in ('sent', 'failed')),
  error_message text,
  resend_id text,               -- id de Resend para trazabilidad

  -- Metadatos opcionales
  metadata jsonb default '{}'::jsonb
);

comment on table public.email_logs is
  'Registro de envíos transaccionales vía Resend. Auditoría de qué email se mandó, a quién, cuándo y con qué resultado.';

create index if not exists idx_email_logs_recipient on public.email_logs (recipient, created_at desc);
create index if not exists idx_email_logs_kind on public.email_logs (kind, created_at desc);
create index if not exists idx_email_logs_status_recent on public.email_logs (created_at desc) where status = 'failed';

alter table public.email_logs enable row level security;

create policy "service_role_only" on public.email_logs
  for all using (auth.role() = 'service_role');
