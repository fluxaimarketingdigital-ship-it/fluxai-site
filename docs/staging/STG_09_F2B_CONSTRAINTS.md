# GATE 7 - CONSTRAINTS OBRIGATÓRIAS
Aplicadas nativamente no SQL 007:
- system_logs: CHECK (severity IN (...)), CHECK (environment IN (...))
- operational_incidents: CHECK (severity), CHECK (occurrence_count >= 1), CHECK (last_detected_at >= first_detected_at)
- reconciliation_runs: CHECK (completed_at >= started_at), contagens não-negativas.
- recovery_actions: CHECK (attempt_count >= 0)
