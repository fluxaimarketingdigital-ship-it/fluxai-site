# ROLLBACK SQL (FASE 2)

Caso ocorra falha ao aplicar o STG-09 em ambiente Staging (na Fase 3), a reversão do banco de dados ocorrerá conforme a ordem estrita abaixo:

```sql
-- Ordem reversa de deleção para evitar violação de constraints

DROP TRIGGER IF EXISTS trg_operational_incidents_updated_at ON operational_incidents;
DROP FUNCTION IF EXISTS update_incident_timestamp();

DROP TABLE IF EXISTS recovery_actions CASCADE;
DROP TABLE IF EXISTS reconciliation_items CASCADE;
DROP TABLE IF EXISTS reconciliation_runs CASCADE;
DROP TABLE IF EXISTS operational_incidents CASCADE;
DROP TABLE IF EXISTS system_logs CASCADE;
```

Este comando devolve o DB Staging integralmente ao estado do STG-08. Como a Fase 2 atua isoladamente e não executa código remoto, o risco no momento é ZERO.
