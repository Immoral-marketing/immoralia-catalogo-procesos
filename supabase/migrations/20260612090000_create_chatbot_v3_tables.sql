-- SPEC-01: Motor conversacional v3 — tablas nuevas
-- Las tablas legadas (chat_conversations) quedan intactas como histórico.

-- ============================================================
-- Conversaciones
-- ============================================================
create table if not exists public.chatbot_conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),

  -- Contexto de origen
  surface text check (surface in ('bubble', 'home', 'sector')),
  initial_sector text,
  initial_route text,

  -- Memoria acumulada (resumen de lo hablado fuera de la ventana de turnos)
  summary text,
  summary_message_count integer not null default 0,

  -- Contadores
  user_message_count integer not null default 0,
  assistant_message_count integer not null default 0,

  -- Flags de negocio (los rellena SPEC-03)
  lead_captured boolean not null default false,
  call_scheduled boolean not null default false,

  status text not null default 'active' check (status in ('active', 'expired'))
);

comment on table public.chatbot_conversations is
  'Conversaciones del chatbot v3. Una conversación es un registro vivo: se amplía al retomarla (caducidad rolling de 7 días sobre last_activity_at).';

create index if not exists idx_chatbot_conversations_last_activity
  on public.chatbot_conversations (last_activity_at desc);

-- ============================================================
-- Mensajes
-- ============================================================
create table if not exists public.chatbot_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chatbot_conversations(id) on delete cascade,
  created_at timestamptz not null default now(),

  role text not null check (role in ('user', 'assistant')),
  content text not null,

  -- Metadatos del turno
  route text,
  sector text,
  recommended_slugs text[] not null default '{}',
  is_error boolean not null default false,

  -- Hash de IP (solo mensajes de usuario) para rate limiting. Nunca la IP en claro.
  ip_hash text
);

comment on table public.chatbot_messages is
  'Mensajes del chatbot v3. recommended_slugs guarda los procesos enlazados en cada respuesta del bot (anti-redundancia y análisis).';

create index if not exists idx_chatbot_messages_conversation
  on public.chatbot_messages (conversation_id, created_at);

create index if not exists idx_chatbot_messages_ip_hash
  on public.chatbot_messages (ip_hash, created_at)
  where ip_hash is not null;

-- ============================================================
-- Valoraciones (una por mensaje del bot, actualizable)
-- ============================================================
create table if not exists public.chatbot_message_ratings (
  message_id uuid primary key references public.chatbot_messages(id) on delete cascade,
  conversation_id uuid not null references public.chatbot_conversations(id) on delete cascade,
  rating text not null check (rating in ('useful', 'not_useful')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.chatbot_message_ratings is
  'Valoración útil/no útil de respuestas del bot. PK sobre message_id garantiza una valoración por mensaje (upsert para cambiarla).';

-- ============================================================
-- RLS: acceso solo con clave de servicio (las API routes de Next).
-- El visitante anónimo nunca toca estas tablas directamente.
-- ============================================================
alter table public.chatbot_conversations enable row level security;
alter table public.chatbot_messages enable row level security;
alter table public.chatbot_message_ratings enable row level security;

create policy "service_role_only" on public.chatbot_conversations
  for all using (auth.role() = 'service_role');

create policy "service_role_only" on public.chatbot_messages
  for all using (auth.role() = 'service_role');

create policy "service_role_only" on public.chatbot_message_ratings
  for all using (auth.role() = 'service_role');
