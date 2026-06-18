# RLS PREPARADO (FASE 2)

O conjunto de segurança (`20260618000008_observability_security.sql`) implementa as seguintes travas RLS `fail-closed`:

- **system_logs**: Permite `INSERT` restrito (`auth.uid() IS NOT NULL`) e bloqueia totalmente `UPDATE` e `DELETE`.
- **operational_incidents**: Permite `INSERT` restrito, `UPDATE` restrito e bloqueia `DELETE`.
- **reconciliation_runs / items**: Somente admin (via server-side) tem controle sobre essas execuções de auditoria interna.
- **recovery_actions**: Leitura e Escrita protegidas; Nenhuma transação pode ser excluída do histórico (`DELETE` false).

Este modelo bloqueia manipulações maliciosas do Front-end em transações passadas.
