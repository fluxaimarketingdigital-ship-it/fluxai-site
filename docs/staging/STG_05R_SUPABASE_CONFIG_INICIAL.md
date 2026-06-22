# STG-05R: BLOCO A — GATE 3 — CONFIGURAÇÃO INICIAL SEGURA SUPABASE

Antes do upload de tabelas via SQL (Migrations), o painel estrutural do novo projeto Supabase sofreu as travas de fundação:
* **Auth Público:** Bloqueado o cadastro automático e genérico (desabilitado "Enable Email Signup" aberto).
* **SMTP:** Deixado o nativo descartável do Supabase (sem a injeção do SendGrid de produção).
* **Redirects URLs:** Habilitados apenas os wildcards base para `*-preview.vercel.app`.
* **Edge Functions:** Zero. Nenhuma implantação clonada de Produção.
* **Webhooks (Database):** Vazios. Nenhum trigger remoto em operação na hora 0.
