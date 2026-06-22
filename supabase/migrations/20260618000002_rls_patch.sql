-- STG-04: Patch RLS fail-closed
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;

-- Block by default: No USING(true)
CREATE POLICY "Strict access to profiles" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
