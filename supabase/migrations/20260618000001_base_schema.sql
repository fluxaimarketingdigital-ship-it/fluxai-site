-- STG-04: Schema estrutural base de Staging
CREATE SCHEMA IF NOT EXISTS public;
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    role TEXT NOT NULL DEFAULT 'CLIENT'
);
CREATE TABLE IF NOT EXISTS public.crm_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_lead TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'novo'
);
