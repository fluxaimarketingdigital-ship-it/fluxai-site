-- Implementação de Policies RBAC
-- STG-06 Gate 6

-- Proteção da Tabela profiles (Governança)
DROP POLICY IF EXISTS "Strict access to profiles" ON public.profiles;

CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles" ON public.profiles
    FOR SELECT USING (public.current_user_role(auth.uid()) = 'ADMIN');

-- Nenhum UPDATE em profiles permitido pelo frontend, exceto por Admin
CREATE POLICY "Admins can update profiles" ON public.profiles
    FOR UPDATE USING (public.current_user_role(auth.uid()) = 'ADMIN');

-- Proteção da Tabela crm_leads
CREATE POLICY "Leads readable by Admins" ON public.crm_leads
    FOR SELECT USING (public.current_user_role(auth.uid()) = 'ADMIN');

-- Bloqueio genérico (Default Deny permanece para outros)
