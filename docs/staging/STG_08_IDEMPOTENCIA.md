# STG-08: GATE 5 E 6 — IDEMPOTÊNCIA E PAYLOAD HASH

* O Frontend, para operações sensíveis, submete uma Intent.
* O Backend Proxy, antes de emitir o Dispatch para o Mock Adapter, calcula um `payload_hash` SHA-256 do JSON de entrada ordenado (expurgando timestamps vázios).
* O Proxy cria a `idempotency_key` associando: `Route_Name + Client_ID + Payload_Hash`.
* **Conflito Abortado:** Se o Usuário sofrer delay na UI e der "Dois Cliques", o Proxy intercepta a Requisição #2: "Transação Existente. Retornando Status Atual (`processing`)". O Make jamais receberá a duplicata acidental.
