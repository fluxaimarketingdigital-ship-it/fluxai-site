# STG-08: GATE 9 E 10 — PROXY TRANSACIONAL E ADAPTER MOCK

### Proxy Transacional (Gate 9)
Ordem de Execução Enriquecida:
1. Recebe Payload + JWT.
2. Proxy Auth e Rate Limit.
3. Calcula `Payload_Hash` e `Idempotency_Key`.
4. Persiste Transação -> Estado `received` -> `accepted`.
5. Aciona o Adapter (Mock) com timeout estrito de 10s.
6. Atualiza `transaction_events` com a resposta mockada do Adapter.

### Adapter Mock (Gate 10)
Evoluído para suportar respostas programáveis. Um query_param `?simulate=delay` força Timeout no Mock; `?simulate=fail` gera Error 500 do Mock, mudando a transação mãe para `failed`. O Make real segue intacto e blindado.
