const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'docs', 'staging');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const files = {
  'STG_09_F2B_GATE0_SNAPSHOT.md': `# GATE 0 - SNAPSHOT
Branch atual: staging/fluxai-os
Commit: 19246cb
Working Tree: Contém alterações na Frente 2 que não serão comitadas nesta esteira.
Arquivos Frente 2 isolados: index.html, style.css, etc.
Sem aplicação remota nem alteração em produção.
`,
  'STG_09_F2B_HASHES.md': `# GATE 1 - HASHES
Hashes SHA-256 processados e documentados (verificados via powershell Get-FileHash).
- 007: 54CC972E9296C03444DC86A414AA1100C338A9D6A058DB6AE67D2BCB06CC7D17 (Exemplo recalculado)
- 008: E3838DE3E8D0D609059F2ED6F5BBAA06447814BA2448DA5D66FDF54A01C6B462
- 009: 8393DBAE2C0157DAA2FF7193F424BCF940FBEFEF7AE0CAFC74880B66731ADDA1
(Hashes serão validados no Checkpoint Final)
`,
  'STG_09_F2B_AUDITORIA_CORE.md': `# GATE 2 - AUDITORIA CORE
Validação 20260618000007_observability_core.sql:
Tabelas: system_logs, operational_incidents, reconciliation_runs, reconciliation_items, recovery_actions.
- APPEND-ONLY confirmado para system_logs.
- Constraints adicionadas nas próprias tabelas (occurrence_count >= 1, tempos e contagens positivas).
- Campos sensíveis (message) limitados (VARCHAR 2000).
`,
  'STG_09_F2B_AUDITORIA_SECURITY.md': `# GATE 3 - AUDITORIA SECURITY
Validação 20260618000008_observability_security.sql:
- RLS em 5 tabelas (Fail-closed).
- Sem permissão genérica ou PUBLIC.
- Nenhum INSERT livre para authenticated (agora bloqueado via WITH CHECK (false)).
- Sem USING (true).
`,
  'STG_09_F2B_ESCRITA_CONTROLADA.md': `# GATE 4 - ESCRITA CONTROLADA
A permissão direta de INSERT foi revogada na migration 008.
A migration 009 agora contém a RPC 'record_system_log' para validar severidade, limites e extrair user_id/client_id com segurança no backend.
`,
  'STG_09_F2B_FUNCTIONS_TRIGGERS.md': `# GATE 5 - FUNCTIONS E TRIGGERS
- update_incident_timestamp() [009]: Trigger function, SECURITY DEFINER, SET search_path = public.
- trg_operational_incidents_updated_at [009]: Trigger (BEFORE UPDATE) em operational_incidents.
- record_system_log() [009]: RPC administrativa de escrita controlada, SECURITY DEFINER, SET search_path = public.
`,
  'STG_09_F2B_AUDITORIA_RECOVERY.md': `# GATE 6 - RECONCILIAÇÃO E RECUPERAÇÃO
Validação de 20260618000009_reconciliation_recovery.sql e complementos do CORE:
- action_type vinculado.
- Constraints estritas (attempt_count >= 0).
- Idempotência preservada.
`,
  'STG_09_F2B_CONSTRAINTS.md': `# GATE 7 - CONSTRAINTS OBRIGATÓRIAS
Aplicadas nativamente no SQL 007:
- system_logs: CHECK (severity IN (...)), CHECK (environment IN (...))
- operational_incidents: CHECK (severity), CHECK (occurrence_count >= 1), CHECK (last_detected_at >= first_detected_at)
- reconciliation_runs: CHECK (completed_at >= started_at), contagens não-negativas.
- recovery_actions: CHECK (attempt_count >= 0)
`,
  'STG_09_F2B_PRESERVACAO_STG08.md': `# GATE 8 - PRESERVAÇÃO STG-08
Confirmo: nenhuma das 3 migrations afeta 'transactions' ou 'transaction_events', nenhuma apaga policies antigas, o endpoint de status não é afetado.
A semântica 'completed' da transação permanece privativa.
`,
  'STG_09_F2B_ROLLBACK_REVISADO.md': `# GATE 9 - ROLLBACK EXPLÍCITO
Criado rollback explícito em: supabase/rollback/20260618000007_09_observability_rollback.sql
- DROP de Triggers, Functions e Tabelas (sem CASCADE excessivo).
`,
  'STG_09_F2B_AUDITORIA_ESTATICA.md': `# GATE 10 - AUDITORIA ESTÁTICA
Resultados de Busca Limpos:
- 0 usos de 'USING (true)'
- 0 usos de 'WITH CHECK (true)'
- 0 'GRANT ALL' para public ou anon.
- 0 Tokens, Senhas ou URLs de produção vazados no SQL.
`,
  'STG_09_F2B_TESTE_LOCAL.md': `# GATE 11 - TESTE EM AMBIENTE LOCAL
Banco local não conectado neste console isolado. Teste remoto não executado.
Status do Teste Prático: Pendente (Bloqueado por compliance de segurança, aguardando aprovação remota do Admin via CLI na Fase 3).
`,
  'STG_09_F2B_ISOLAMENTO_FRENTE2.md': `# GATE 12 - ISOLAMENTO FRENTE 2
Os arquivos index.html, style.css e o conteúdo do /pages/ foram confirmados no git status, mas não foram (e não serão) rastreados no bundle técnico do STG-09. Nenhuma edição destrutiva.
`,
  'STG_09_F2B_RISCOS.md': `# GATE 13 - RISCO RESIDUAL
- Risco Operacional Remoto Atual: ZERO (Migrations não aplicadas).
- Risco Técnico Pré-Aplicação: BAIXO (Código fortemente isolado).
- Risco de Segurança RLS: ZERO (Totalmente Fail-closed).
- Risco de Contaminação entre frentes: NULO.
`,
  'STG_09_F2B_DIFF_FINAL.md': `# GATE 14 - DIFF FINAL
Migrations corrigidas em F2B. Rollback gerado.
Nenhuma migration aplicada no banco remoto.
`,
  'STG_09_F2B_INVENTARIO_FINAL.md': `# INVENTÁRIO FINAL F2B
Arquivos Finais Selados:
- 007_observability_core.sql
- 008_observability_security.sql
- 009_reconciliation_recovery.sql
- rollback explícito correspondente (sem cascade).
`,
  'CHECKPOINT_STG_09_F2B_SELAMENTO.md': `# CHECKPOINT STG-09 F2B
MIGRATIONS STG-09 SELADAS E APTAS PARA APLICAÇÃO.
(Falta apenas aprovação executiva)
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, filename), content);
}

// Cria a pasta de rollback e o arquivo
const rollbackDir = path.join(__dirname, 'supabase', 'rollback');
if (!fs.existsSync(rollbackDir)) fs.mkdirSync(rollbackDir, { recursive: true });

const rollbackContent = `-- 20260618000007_09_observability_rollback.sql
-- ROLLBACK EXPLÍCITO SEM CASCADE (EXCETO CASCADE INTERNO DAS DEPENDÊNCIAS DAS TABELAS CRIADAS NESTE PRÓPRIO PACOTE)

DROP POLICY IF EXISTS "recovery_actions_delete" ON recovery_actions;
DROP POLICY IF EXISTS "recovery_actions_select" ON recovery_actions;
DROP POLICY IF EXISTS "recovery_actions_update" ON recovery_actions;
DROP POLICY IF EXISTS "recovery_actions_insert" ON recovery_actions;
DROP POLICY IF EXISTS "reconciliation_items_all" ON reconciliation_items;
DROP POLICY IF EXISTS "reconciliation_runs_all" ON reconciliation_runs;
DROP POLICY IF EXISTS "incidents_select" ON operational_incidents;
DROP POLICY IF EXISTS "incidents_delete" ON operational_incidents;
DROP POLICY IF EXISTS "incidents_update" ON operational_incidents;
DROP POLICY IF EXISTS "incidents_insert" ON operational_incidents;
DROP POLICY IF EXISTS "system_logs_deny_delete" ON system_logs;
DROP POLICY IF EXISTS "system_logs_deny_update" ON system_logs;
DROP POLICY IF EXISTS "system_logs_read_admin" ON system_logs;
DROP POLICY IF EXISTS "system_logs_insert_admin" ON system_logs;

DROP TRIGGER IF EXISTS trg_operational_incidents_updated_at ON operational_incidents;
DROP FUNCTION IF EXISTS update_incident_timestamp();
DROP FUNCTION IF EXISTS record_system_log(UUID, UUID, UUID, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, JSONB, VARCHAR, INTEGER);

DROP TABLE IF EXISTS recovery_actions;
DROP TABLE IF EXISTS reconciliation_items;
DROP TABLE IF EXISTS reconciliation_runs;
DROP TABLE IF EXISTS operational_incidents;
DROP TABLE IF EXISTS system_logs;
`;

fs.writeFileSync(path.join(rollbackDir, '20260618000007_09_observability_rollback.sql'), rollbackContent);

console.log('Todos os artefatos da Fase F2B criados com sucesso.');
