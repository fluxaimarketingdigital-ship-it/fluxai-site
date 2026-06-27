-- Tabela de Contas Bancárias (Master)
CREATE TABLE IF NOT EXISTS public.fluxai_bank_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bank_name TEXT NOT NULL,
    agency TEXT,
    account_number TEXT,
    pix_key TEXT,
    owner_name TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.fluxai_bank_accounts ENABLE ROW LEVEL SECURITY;

-- Politica temporária para permitir leitura e escrita 
CREATE POLICY "Enable all for authenticated users on bank accounts" 
ON public.fluxai_bank_accounts
FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Adicionando colunas de detalhamento na Baixa do Pagamento
ALTER TABLE public.payments_ledger
ADD COLUMN IF NOT EXISTS receiving_account_id UUID REFERENCES public.fluxai_bank_accounts(id),
ADD COLUMN IF NOT EXISTS payment_method_real TEXT,
ADD COLUMN IF NOT EXISTS reference_month_year TEXT,
ADD COLUMN IF NOT EXISTS receipt_url TEXT;

-- Atualizar trigger de permissões se necessário (ou deixar aberto temporariamente para o painel Master)
