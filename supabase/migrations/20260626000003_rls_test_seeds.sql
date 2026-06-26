-- MIGRATION: 20260626000003_rls_test_seeds.sql
-- FASE C: Preparação de Seeds e Testes
-- Descrição: Popula identidades controladas e dados operacionais para atestar a blindagem matemática.

-- 1. Perfis Sintéticos (Identidades)
INSERT INTO public.profiles (id, role, client_id) VALUES
  ('11111111-1111-1111-1111-111111111111', 'ADMIN', NULL),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'CLIENT', 'CLIENTE_A'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'CLIENT', 'CLIENTE_B'),
  ('00000000-0000-0000-0000-000000000000', 'CLIENT', NULL)
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, client_id = EXCLUDED.client_id;

-- 2. Massa de Dados (Financeiro)
INSERT INTO public."FINANCEIRO_CLIENTES" 
  (financeiro_id, client_id, client_name, tipo_lancamento, valor) 
VALUES
  ('fin_a_1', 'CLIENTE_A', 'Empresa Alfa', 'MENSALIDADE', 1500.00),
  ('fin_a_2', 'CLIENTE_A', 'Empresa Alfa', 'SERVICO_EXTRA', 300.00),
  ('fin_b_1', 'CLIENTE_B', 'Empresa Beta', 'MENSALIDADE', 2500.00)
ON CONFLICT (financeiro_id) DO NOTHING;

-- 3. Massa de Dados (Demandas)
INSERT INTO public."DEMANDAS_CLIENTES" 
  (demanda_id, client_id, client_name, titulo_demanda, status_demanda) 
VALUES
  ('dem_a_1', 'CLIENTE_A', 'Empresa Alfa', 'Post de Lançamento', 'em_andamento'),
  ('dem_b_1', 'CLIENTE_B', 'Empresa Beta', 'Campanha Black Friday', 'pendente')
ON CONFLICT (demanda_id) DO NOTHING;
