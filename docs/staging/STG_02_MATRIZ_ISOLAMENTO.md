# STG-02: MATRIZ DE ISOLAMENTO

| Componente | Produção | Staging Proposto | Compartilhado? | Justificativa | Risco de Cruzamento | Controle Preventivo | Controle Detectivo | Rollback |
|---|---|---|---|---|---|---|---|---|
| Frontend | Vercel Main | Vercel Preview | Sim (Repositório) | Feature Branching | Baixo | `.env` lock | GitHub Checks | Git Revert |
| Domínio | `fluxaidigital.com.br` | `stg.fluxaidigital...` | Não | Isolamento DNS | Zero | Vercel Domain Alias | Vercel Logs | N/A |
| Supabase | Project A | Project B | Não | Segurança Auth/RLS | Alto (Se errar URL) | Variável `SUPABASE_URL` | Supabase Logs | Destruir B |
| Banco/RLS | Schema Prod | Schema Stg | Não | 18 policies ativas | Alto | Migrations exclusivas | PgAdmin Audit | Destruir B |
| Proxy | Edge Function | Edge Function (Preview) | Sim (Código) | Serverless | Baixo | `api/make-proxy` lê ENV preview | Vercel Logs | Git Revert |
| Make | FluxAI OS (Folder) | STAGING (Folder) | Sim (Organization) | Limite da conta | Alto | URLs webhook exclusivas | Make History | Excluir Folder |
| Webhooks | `hook.us2.../abc` | `hook.us2.../xyz` | Não | Isolamento Inbound | Alto (Se vazar PROD) | Chave Privada Header | Make Logs | Regenerate URL |
| Sheets | Planilha Mestra | Planilha Mestra STG | Não | Risco de corrupção | Alto | IDs Hardcoded revisados | Google Audit | Deletar File |
| Drive | Arquivos Master | Arquivos STG | Não | Risco de vazamento | Baixo | Share settings off | Drive Logs | Deletar Folder |
| Credenciais| Service Account A| Service Account A | Sim | Limite conta Google | Baixo | IAM Role restrita | IAM Logs | Revogar Chave |
