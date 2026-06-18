# GATE 3 - AUDITORIA SECURITY
Validação 20260618000008_observability_security.sql:
- RLS em 5 tabelas (Fail-closed).
- Sem permissão genérica ou PUBLIC.
- Nenhum INSERT livre para authenticated (agora bloqueado via WITH CHECK (false)).
- Sem USING (true).
