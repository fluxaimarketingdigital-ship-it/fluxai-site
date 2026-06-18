# STG-08: GATE 3 — IDENTIFICADORES (REQUEST_ID E CORRELATION_ID)

No Proxy Autenticado (Backend Node.js/Vercel):
* **`request_id`:** É instanciado via `crypto.randomUUID()` logo na porta de entrada da API. O Frontend NÃO tem poder de sugerir `request_id`. Ele será propagado aos logs para auditoria ponto-a-ponto.
* **`correlation_id`:** Se ausente no payload (ou se formato falhar na validação), herda o `request_id`. Isso agrupa a cascata de Eventos que o Webhook do Make possa devolver em lotes (Ex: Processou 1 de 10 -> `partially_completed`). O Frontend o recebe na resposta 202.
