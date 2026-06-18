# STG-02: PLANO DE IMPLEMENTAÇÃO FUTURA

1. **Preservar Backups:** Garantir snapshot do schema atual do Supabase PROD.
2. **Validar Integridade:** Verificar se arquivos SQL estão sem falhas de sintaxe.
3. **Criar Recursos-Base:** Instanciar Projeto Supabase "FluxAI_OS_Staging" e Branch Vercel "staging".
4. **Configurar Credenciais:** Inserir ENV vars `.env.preview` no Vercel (chaves do Supabase B e webhooks STG).
5. **Reproduzir Schema:** Executar `20260607_rls_homologacao.sql` no Supabase Staging.
6. **Carregar Dados Sintéticos:** Sincronizar os 6 perfis definidos no Documento STG_02_DADOS_TESTE.
7. **Configurar RLS Inicial:** Substituir o `USING (true)` provisório das 18 policies pelo filtro atrelado a `governance_users` via JWT claim ou função definer.
8. **Configurar Frontend:** Commitar as URLs dinâmicas para forçar uso do proxy Vercel.
9. **Configurar Proxy:** Inserir validação JWT no `api/make-proxy.js` da branch `staging`.
10. **Configurar Rotas:** Criar registry de allowlist amarrada por Role.
11. **Configurar Make:** Clonar os 24 cenários para a pasta STAGING e alterar as URLs dos webhooks receptors.
12. **Configurar Sheets e Drive:** Criar os arquivos limpos e atualizar os módulos Google no Make STG.
13. **Configurar Logs Mínimos:** Instanciar a tabela `audit_logs` no Supabase B.
14. **Testar Isolamento:** Tentar injetar ID de Produção no frontend STG (deve falhar isolado).
15. **Testar Fail-closed:** Remover Auth do proxy STG e garantir que Make STG não processa a chamada.
16. **Testar Rollback:** Efetuar clear/re-run do banco B.
17. **Registrar Checkpoint:** Documentar STAGING FUNCIONAL.
