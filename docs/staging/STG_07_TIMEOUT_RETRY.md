# STG-07: GATE 10 — TIMEOUT E RETRY

As malhas de falha temporária foram desenhadas:
* Frontend Timeout: Setado em ~25s para aguardar a aceitação do proxy.
* Proxy Timeout: O Proxy desengata da call do Make simulado se passar de 15s, devolvendo estado `unknown` ao Frontend e deixando a tarefa "em observação".
* Auto-Retry: Desabilitado nativamente para ações que não declararam Idempotência Mestra na Tabela. Um erro não gerará 3 formulários idênticos enfileirados repetidamente como "metralhadora" acidental do usuário.
