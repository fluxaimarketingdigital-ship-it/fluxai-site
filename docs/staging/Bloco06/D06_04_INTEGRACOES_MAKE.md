# INVENTÁRIO DE INTEGRAÇÕES MAKE

## Mapeamento de Webhooks e Acoplamento

- **Webhooks:** Definidos no painel da Vercel (`MAKE_WEBHOOK_ROTA_...`). O código fonte do Proxy isola esses segredos, não vazando para o front.
- **Payloads Enviados:** O Proxy repassa integralmente e cegamente o objeto `payload` oriundo do body do Request Frontend (`JSON.stringify(payload)`).
- **Payloads Recebidos:** O Proxy aguarda a resolução HTTP síncrona do Make. Se o Make retorna `200 OK` (geralmente com o texto "Accepted"), o Proxy o encerra. Se o cenário for customizado e possuir um "Webhook Response", o Proxy lê o JSON e devolve para o front (`makeRes.text()` seguido de `JSON.parse`).
- **Dependências Críticas:** O sistema React acoplou o conceito de "Sucesso de Ação do Usuário" ao recebimento do retorno `success: true` da API do Proxy.
