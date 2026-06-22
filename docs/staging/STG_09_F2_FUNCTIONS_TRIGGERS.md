# FUNCTIONS E TRIGGERS (FASE 2)

A auditoria confirma a criação de funções seguras (`SECURITY DEFINER` protegidas):

- `update_incident_timestamp()`: Função RPC segura e restrita, com `SET search_path = public` explícito, atrelada à trigger `trg_operational_incidents_updated_at`. Previne escalada de privilégio por execução maliciosa no path.
- Triggers atestadas funcionam passivamente em banco (antes de `UPDATE`), sem acionar chamadas HTTP/Webhooks diretas. Nenhuma trigger na Fase 2 invoca `pg_net` ou `Make.com`.
