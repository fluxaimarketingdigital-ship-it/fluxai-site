# STG-08: GATE 23 — ROLLBACK TESTADO

Teste Reverso:
* Compensação Sintética validada na transação de Mock. 
* Tabela de State Machine `transaction_events` impediu soft-deletes diretos. O Drop foi feito via Arquivo `DOWN` de Migration Local, desfazendo toda a arquitetura Transacional perfeitamente sem deixar resíduos nos Bancos Produtivos (que nunca foram tocados).
