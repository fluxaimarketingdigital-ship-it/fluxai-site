# STG-07: GATE 16 E 17 — SEGURANÇA E UI FRONTEND

### Validação Vercel Preview (Gate 16)
A interface em Preview (`fluxai-os-[hash]-preview.vercel.app`) submeteu os envios com o SDK nativo atualizado (`os/services/makeClient.js`).
* Quando `accepted`, o usuário viu uma tela informando "Processando..." ao invés da tela "Concluído", adequando-se ao estado pendente verdadeiro.
* Quando `401/403`, Toast Vermelho Seguro descrevendo "Acesso Inválido". Nenhuma stack trace exposta ao usuário.

### Segurança Perimetral (Gate 17)
* Replay attacks (mesmo payload+token) com Timestamp atrasado de Timeout foram ignorados.
* Enumeração de Rotas não catalogadas (`/api/make-proxy?route=rota_secreta`) bloqueadas pelo Registry Lookup no O(1).
* CORS nativamente configurado para aceitar requisições APENAS da base Vercel Preview atual, bloqueando CURLs oriundos de origens não registradas.
