-- Add landing_slug column to processes table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='processes' AND column_name='landing_slug') THEN
        ALTER TABLE public.processes ADD COLUMN landing_slug TEXT;
    END IF;
END $$;

-- Update existing processes if needed (optional)
-- UPDATE public.processes SET landing_slug = 'all' WHERE landing_slug IS NULL;
