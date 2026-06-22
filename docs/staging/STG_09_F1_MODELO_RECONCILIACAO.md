# MODELO DE RECONCILIAÇÃO - STG-09

As tabelas `reconciliation_runs` e `reconciliation_items` documentam as auditorias sintéticas entre o Supabase e Mock Adapters (Sheets/Drive).

## Regras
- Execução iniciada estritamente por processo autorizado, nunca pelo Frontend.
- Nenhuma correção é automática. O processo foca em apontar divergência (`expected_count` vs `actual_count`).
- Itens divergentes são gravados como evidência em `reconciliation_items` para posterior análise e `recovery_actions`.
