# PLANO DE ROLLBACK - FASE 1 E 2 (STG-09)

Como as alterações referem-se à geração de SQL versionado localmente e criação de documentação técnica, o plano de rollback é simples e não-destrutivo.

## Rollback de Geração Local
1. Excluir os arquivos `.sql` recém-criados em `supabase/migrations/`.
2. Remover ou reverter a documentação gerada em `docs/staging/`.
3. Executar `git restore --staged .` e apagar o commit técnico gerado, retornando ao estado original (`19246cb` ou STG-08).

## Rollback de Isolamento
As modificações comerciais da Frente 2 (`index.html`, etc.) não serão comitadas nesta rotina, portanto, um git reset técnico não as eliminará do workspace.
