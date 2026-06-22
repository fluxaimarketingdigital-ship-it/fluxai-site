# STG-08: GATE 2 — MODELO DE DADOS TRANSACIONAL

O arquivo `20260618000006_transaction_model.sql` foi criado implantando:
1. `public.transactions`: Tabela-mestra contendo `request_id`, `idempotency_key`, `payload_hash` e status transacional.
2. `public.transaction_events`: Event Store Imutável. Registra cada salto de status (ex: `received -> accepted`).

**Restrições Nativas (PostgreSQL):** RLS ativado na nascente. Um cliente não pode listar transações de outro `client_id`, nem pode emitir SQL UPDATE para forçar o status para `completed`.
