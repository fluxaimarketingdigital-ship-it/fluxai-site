# STG-07: GATE 11 — LOGS MÍNIMOS DO PROXY

Em staging, a console output do Serverless imprime uma métrica segura e restrita por requisição.

**Exemplo de Log Valido:**
```json
{
  "request_id": "req_847192",
  "environment": "staging",
  "route": "onboarding_cliente",
  "role": "ADMIN",
  "status": "accepted",
  "duration_ms": 320,
  "commit": "a3567b5"
}
```
Senhas, PII (dados de identificação sensíveis) e JWT Inteiros foram ofuscados para prevenir GDPR/LGPD vazamentos nos coletores de log.
