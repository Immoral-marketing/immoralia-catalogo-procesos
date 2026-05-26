-- Tabla para las solicitudes detalladas
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    empresa TEXT NOT NULL,
    comentario TEXT,
    selected_processes JSONB,
    onboarding_answers JSONB,
    ip_address TEXT
);

-- Tabla para el log de control de spam
CREATE TABLE IF NOT EXISTS public.contact_requests_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    ip_address TEXT,
    email TEXT,
    status TEXT
);
