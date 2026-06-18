# STG-08: GATE 22 — LOGS MÍNIMOS TRANSACIONAIS

A Event Store (`public.transaction_events`) consolida automaticamente uma timeline rigorosa e à prova de deleções.

**Exemplo:**
```json
{
  "request_id": "r1",
  "correlation_id": "c1",
  "idempotency_key": "SHA_MASKED",
  "status_anterior": "received",
  "status_novo": "accepted",
  "duracao": "45ms",
  "timestamp": "2026-06-18T10:00:00Z"
}
```
Prepara terreno sólido para STG-09 (Observabilidade).
