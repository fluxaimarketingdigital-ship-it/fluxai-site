# STG-08: GATE 16 — FALHA PARCIAL E ETAPAS

(Ver documento consolidado `STG_08_TIMEOUT_AMBIGUIDADE.md`).
A Máquina de Estados agora isola a falha do meio do processo (ex: Erro no meio de um cenário Make com 10 módulos). Isso viabiliza rollbacks ou retry específicos da perna que ruiu (ex: `rollback_pending`).
