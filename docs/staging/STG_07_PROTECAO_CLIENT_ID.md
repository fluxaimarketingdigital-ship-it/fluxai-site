# STG-07: GATE 5 — PROTEÇÃO DO CLIENT_ID E IDENTIDADE

A vulnerabilidade clássica do "Hidden Input Field" (modificar um ID oculto no HTML via Inspecionar Elemento para afetar outro usuário) foi estirpada.
* O Proxy Staging captura sim o body enviado, **porém**, ele sobrepõe compulsóriamente campos sensíveis baseando-se no `auth.uid()` validado.
* Se `Client A` (ID: 01) envia Payload contendo `{"client_id": "02", "acao": "deletar"}`, o Proxy não aceita "02". O Backend substitui ou descarta a requisição por quebra de contrato de Sessão x Payload.
* Vínculos confiáveis agora emanam apenas do JWT Backend State.
