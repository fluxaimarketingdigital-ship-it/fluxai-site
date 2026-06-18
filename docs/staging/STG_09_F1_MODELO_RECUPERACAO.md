# MODELO DE RECUPERAÇÃO - STG-09

A tabela `recovery_actions` governa as rotinas de retry seguro, reprocessamento ou compensação de falhas transacionais.

## Regras
- Toda ação de recuperação (`action_type`) deve estar vinculada a uma `transaction_id` ou `incident_id` existente.
- Ações são autorizadas manualmente ou por funções RPC de servidor com roles administrativas; recuperação passiva pelo Frontend é estritamente proibida.
- O histórico não deve apagar o evento da falha original, mantendo a trilha de "falhou -> recuperou".
