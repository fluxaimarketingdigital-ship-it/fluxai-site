-- MIGRATION: 20260626000001_tenant_structure.sql
-- FASE A: Estruturação do Tenant
-- Descrição: Adiciona vínculo forte de identidade (client_id) em profiles e centraliza funções RBAC.

-- 1. Injetar a coluna client_id (Tenant ID) na identidade central
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS client_id text;

-- 2. Função SECURITY DEFINER: Resolve o client_id primário do usuário
CREATE OR REPLACE FUNCTION public.current_user_client_id(user_id uuid)
RETURNS text AS $$
DECLARE
  v_client text;
BEGIN
  SELECT client_id INTO v_client FROM public.profiles WHERE id = user_id;
  RETURN v_client;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Função SECURITY DEFINER: Lógica unificada de autorização multi-tenant
CREATE OR REPLACE FUNCTION public.can_access_client(target_client_id text)
RETURNS boolean AS $$
DECLARE
  v_role text;
  v_client text;
BEGIN
  -- Rejeição imediata se não houver alvo válido na tabela (fail-safe)
  IF target_client_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Resgata as propriedades absolutas da identidade
  SELECT role, client_id INTO v_role, v_client 
  FROM public.profiles 
  WHERE id = auth.uid();

  -- Se não existir profile, nega (por precaução, caso não seja pego antes)
  IF v_role IS NULL THEN
    RETURN FALSE;
  END IF;

  -- ADMIN (FluxAI) possui acesso global de visibilidade
  IF v_role = 'ADMIN' THEN
    RETURN TRUE;
  END IF;

  -- CLIENT possui acesso restrito exclusivamente se bater criptograficamente com seu tenant
  IF v_client = target_client_id THEN
    RETURN TRUE;
  END IF;

  -- Default deny (Nenhum outro caso deve vazar)
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
