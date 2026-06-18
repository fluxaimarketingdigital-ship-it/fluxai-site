# GATE 2 - AUDITORIA CORE
Validação 20260618000007_observability_core.sql:
Tabelas: system_logs, operational_incidents, reconciliation_runs, reconciliation_items, recovery_actions.
- APPEND-ONLY confirmado para system_logs.
- Constraints adicionadas nas próprias tabelas (occurrence_count >= 1, tempos e contagens positivas).
- Campos sensíveis (message) limitados (VARCHAR 2000).
