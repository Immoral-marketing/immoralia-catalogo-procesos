-- Tabla para capturar leads directamente desde el onboarding
CREATE TABLE IF NOT EXISTS public.onboarding_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT,
    answers JSONB NOT NULL,
    ip_address TEXT
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_onboarding_leads_email ON public.onboarding_leads(email);
CREATE INDEX IF NOT EXISTS idx_onboarding_leads_created ON public.onboarding_leads(created_at);

-- Habilitar RLS
ALTER TABLE public.onboarding_leads ENABLE ROW LEVEL SECURITY;

-- Permitir que la función de servicio gestione los leads
CREATE POLICY "Service role can do everything on onboarding_leads" ON "public"."onboarding_leads"
AS PERMISSIVE FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
