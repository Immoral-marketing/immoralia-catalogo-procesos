-- Create chat_conversations table for logging and analysis
create table if not exists public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  first_question text,
  conversation_text text,
  company_name text,
  company_sector text,
  company_size_hint text,
  location_hint text,
  user_messages_count integer default 0,
  assistant_messages_count integer default 0,
  total_turns integer default 0,
  human_intervention_required boolean default false,
  form_opened boolean default false,
  form_submitted boolean default false,
  resolved boolean,
  user_feedback text,
  feedback_comment text,
  ended_reason text check (ended_reason in ('resolved', 'human', 'abandoned', 'unknown'))
);

-- Enable RLS
alter table public.chat_conversations enable row level security;

-- Only allow service role to insert/select for now (analytics)
create policy "Allow internal service role access"
  on public.chat_conversations
  for all
  using (auth.role() = 'service_role');
