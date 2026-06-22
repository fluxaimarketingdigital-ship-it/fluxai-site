-- Funções de Autorização RBAC para FluxAI OS
-- STG-06 Gate 4

CREATE OR REPLACE FUNCTION public.is_active_user(user_id uuid)
RETURNS boolean AS $$
BEGIN
  -- Na ausência de tabela complexa de governança no mock, assume-se active se profile existir
  RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.current_user_role(user_id uuid)
RETURNS text AS $$
DECLARE
  v_role text;
BEGIN
  SELECT role INTO v_role FROM public.profiles WHERE id = user_id;
  RETURN v_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Restrição de execução (GATE 4E)
REVOKE EXECUTE ON FUNCTION public.is_active_user(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_active_user(uuid) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.current_user_role(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_user_role(uuid) TO authenticated, service_role;
