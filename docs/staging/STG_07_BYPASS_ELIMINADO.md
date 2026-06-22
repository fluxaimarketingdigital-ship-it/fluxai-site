# STG-07: GATE 7 — ELIMINAÇÃO DEFINITIVA DO BYPASS

No PACOTE STG-04 fora estipulado um Fail-Closed no Frontend em `os/services/makeClient.js` barrando `use_proxy = false`.
Para consolidar a segurança Backend, o Proxy agora ignora diretivas booleanas de Bypass originadas da Interface. 
Não existe rota direta Frontend -> Make (CORS e Webhooks Nativos de Staging foram selados contra as URLs da Vercel). O único agente autorizado a conversar com os serviços terceirizados é o Backend Seguro.
