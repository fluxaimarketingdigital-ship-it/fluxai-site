-- Habilita RLS nas tabelas operacionais
ALTER TABLE public."SERVICOS_EXTRAS_CLIENTES" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."FINANCEIRO_CLIENTES" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."DEMANDAS_CLIENTES" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."COMUNICACOES_CLIENTE" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."IA_CREDITOS_CLIENTE" ENABLE ROW LEVEL SECURITY;

-- Cria as policies temporárias de leitura (Homologação) restritas a usuários autenticados
-- Nota: Será refinado posteriormente usando a tabela de governance_users para filtrar roles específicos
CREATE POLICY "Homologacao: Permitir SELECT authenticated" ON public."SERVICOS_EXTRAS_CLIENTES" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Homologacao: Permitir SELECT authenticated" ON public."FINANCEIRO_CLIENTES" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Homologacao: Permitir SELECT authenticated" ON public."DEMANDAS_CLIENTES" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Homologacao: Permitir SELECT authenticated" ON public."COMUNICACOES_CLIENTE" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Homologacao: Permitir SELECT authenticated" ON public."IA_CREDITOS_CLIENTE" FOR SELECT TO authenticated USING (true);
