-- Migration SQL para adicionar campos de conciliação bancária (Dar Baixa)
-- Data: 2026-06-27

-- 1. Na tabela moderna payments_ledger
ALTER TABLE public."payments_ledger" 
ADD COLUMN IF NOT EXISTS receiving_account text,
ADD COLUMN IF NOT EXISTS payment_method_ref text,
ADD COLUMN IF NOT EXISTS reference_period text;

-- 2. Na tabela legado/mock SERVICOS_EXTRAS_CLIENTES (para os extras atuais)
ALTER TABLE public."SERVICOS_EXTRAS_CLIENTES" 
ADD COLUMN IF NOT EXISTS receiving_account text,
ADD COLUMN IF NOT EXISTS payment_method_ref text,
ADD COLUMN IF NOT EXISTS reference_period text,
ADD COLUMN IF NOT EXISTS receipt_url text;

-- 3. Na tabela projects (para travar conta no portal)
ALTER TABLE public."projects"
ADD COLUMN IF NOT EXISTS financial_block boolean DEFAULT false;
