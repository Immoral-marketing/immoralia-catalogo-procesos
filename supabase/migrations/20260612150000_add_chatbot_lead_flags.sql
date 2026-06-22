-- SPEC-03: Captura de leads y handover en el chatbot v3.
-- Amplía chatbot_conversations con los flags de negocio y el vínculo al lead.

alter table public.chatbot_conversations
  add column if not exists human_requested boolean not null default false,
  add column if not exists lead_form_dismissed boolean not null default false,
  add column if not exists lead_form_offered boolean not null default false,
  add column if not exists lead_id uuid;

comment on column public.chatbot_conversations.human_requested is
  'El visitante pidió contacto humano (handover) — lead prioritario, compromiso 24h.';
comment on column public.chatbot_conversations.lead_form_dismissed is
  'El visitante cerró el formulario con la X — el límite duro queda consumido; solo reaparece por trigger semántico.';
comment on column public.chatbot_conversations.lead_form_offered is
  'El formulario ya se ofreció por límite duro en esta conversación (se ofrece una sola vez por esa vía).';
comment on column public.chatbot_conversations.lead_id is
  'Vínculo al lead de contact_submissions capturado en esta conversación (un lead por conversación).';

create index if not exists idx_chatbot_conversations_lead_id
  on public.chatbot_conversations (lead_id)
  where lead_id is not null;
