-- Create vault_secrets table
CREATE TABLE IF NOT EXISTS public.vault_secrets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.vault_secrets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role full access
CREATE POLICY "Service role can manage all secrets" ON public.vault_secrets
    FOR ALL
    TO service_role
    USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vault_secrets_updated_at 
    BEFORE UPDATE ON public.vault_secrets 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add index on name for faster lookups
CREATE INDEX idx_vault_secrets_name ON public.vault_secrets(name);
