# STG-08: GATE 6 — PAYLOAD HASH

O Payload Hash (SHA-256) foi homologado no Proxy.
(Ver documento `STG_08_IDEMPOTENCIA.md` para as regras de composição conjunta e repulsa à dupla-submissão).
A Persistência do Hash livrou o sistema de guardar o Payload Integral contendo senhas ou PI (LGPD) no banco Transacional. O Hash é o selo de garantia de que o retry pertence à exata mesma intenção.
