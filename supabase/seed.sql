-- STG-04: Seeds sintéticos
INSERT INTO public.profiles (id, role) 
VALUES ('00000000-0000-0000-0000-000000000001', 'ADMIN') 
ON CONFLICT DO NOTHING;

INSERT INTO public.crm_leads (nome_lead, status) 
VALUES ('STG_LEAD_FICTICIO', 'novo') 
ON CONFLICT DO NOTHING;
