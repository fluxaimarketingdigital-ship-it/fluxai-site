# STG-08: GATE 11 — ENDPOINT DE CONSULTA DE STATUS

Construído Endpoint `/api/transactions/:request_id`.
* **Retorno Falso/Mockado em STG:**
```json
{
  "request_id": "req_12345",
  "correlation_id": "corr_999",
  "route": "onboarding_cliente",
  "status": "processing",
  "timestamps": {
    "received_at": "2026-06-18T10:00:00Z",
    "accepted_at": "2026-06-18T10:00:01Z"
  }
}
```
* O Endpoint é protegido por Auth Middleware. Usuário A não enxerga Status da transação do Usuário B.
