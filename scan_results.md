| Arquivo | Linha | Termo | Trecho de Código | Classificação |
|:---|:---:|:---:|:---|:---:|
| [.env.example](.env.example) | 6 | `webhook` | `# WEBHOOKS` | seguro (referência a variável de ambiente) |
| [.env.example](.env.example) | 7 | `webhook` | `MAKE_WEBHOOK_URL=https://hook.us2.make.com/bnm7xedyxhxdlvh417gone7gy5m4e8me` | seguro (referência a variável de ambiente) |
| [.env.example](.env.example) | 7 | `hook.us` | `MAKE_WEBHOOK_URL=https://hook.us2.make.com/bnm7xedyxhxdlvh417gone7gy5m4e8me` | seguro (referência a variável de ambiente) |
| [.gitignore](.gitignore) | 8 | `secret` | `# Local configuration / secrets` | precisa avaliar |
| [.gitignore](.gitignore) | 9 | `.env` | `.env` | precisa avaliar |
| [.gitignore](.gitignore) | 10 | `.env` | `.env.local` | precisa avaliar |
| [.gitignore](.gitignore) | 11 | `.env` | `.env.development.local` | precisa avaliar |
| [.gitignore](.gitignore) | 12 | `.env` | `.env.test.local` | precisa avaliar |
| [.gitignore](.gitignore) | 13 | `.env` | `.env.production.local` | precisa avaliar |
| [.gitignore](.gitignore) | 14 | `secret` | `os/config/secrets/` | precisa avaliar |
| [v1.0_crm-lead-intelligence.md](docs/crm/v1.0_crm-lead-intelligence.md) | 29 | `webhook` | `*   **Triagem:** Webhooks via Make.com para validação e envio ao CRM.` | precisa avaliar |
| [v1.0_infraestrutura-devops.md](docs/devops/v1.0_infraestrutura-devops.md) | 29 | `token` | `*   **Variáveis de Ambiente:** Gestão centralizada de tokens e chaves.` | precisa avaliar |
| [v1.0_checklist-homologacao-executiva.md](docs/governance/v1.0_checklist-homologacao-executiva.md) | 24 | `webhook` | `- [ ] Webhook de formulário testado com sucesso.` | precisa avaliar |
| [v1.0_governanca-operacional.md](docs/governance/v1.0_governanca-operacional.md) | 54 | `senha` | `*   **Rotação de Senhas:** Semestral para contas críticas.` | precisa avaliar |
| [v1.0_governanca-operacional.md](docs/governance/v1.0_governanca-operacional.md) | 55 | `token` | `*   **Tokens & Secrets:** Armazenados exclusivamente em Environment Variables.` | precisa avaliar |
| [v1.0_governanca-operacional.md](docs/governance/v1.0_governanca-operacional.md) | 55 | `secret` | `*   **Tokens & Secrets:** Armazenados exclusivamente em Environment Variables.` | precisa avaliar |
| [v1.0_master-operacional-consolidado.md](docs/v1.0_master-operacional-consolidado.md) | 46 | `token` | `*   **Segurança:** Variáveis de ambiente para tokens/secrets, SSH Keys individuais.` | precisa avaliar |
| [v1.0_master-operacional-consolidado.md](docs/v1.0_master-operacional-consolidado.md) | 46 | `secret` | `*   **Segurança:** Variáveis de ambiente para tokens/secrets, SSH Keys individuais.` | precisa avaliar |
| [v1.0_master-operacional-consolidado.md](docs/v1.0_master-operacional-consolidado.md) | 59 | `webhook` | `*   **Automação:** Webhooks via Make.com (Automation Hub), alertas instantâneos comerciais.` | precisa avaliar |
| [ajuda.html](os/ajuda.html) | 166 | `senha` | `&lt;p class="faq-answer"&gt;Sim! Nós não armazenamos as senhas das suas redes sociais. Todas as integrações são feitas via Tok` | precisa avaliar |
| [ajuda.html](os/ajuda.html) | 166 | `token` | `&lt;p class="faq-answer"&gt;Sim! Nós não armazenamos as senhas das suas redes sociais. Todas as integrações são feitas via Tok` | precisa avaliar |
| [approval.html](os/approval.html) | 492 | `webhook` | `const webhookKey = transitionResult.webhook \|\| 'DELIVERY_APPROVAL';` | precisa avaliar |
| [approval.html](os/approval.html) | 504 | `webhook` | `await OS_CONFIG.webhooks.send(webhookKey, payload);` | precisa avaliar |
| [client-portal.html](os/client-portal.html) | 653 | `webhook` | `const webhookKey = isExtra ? 'SERVICE_EXTRA_REQUEST' : 'DEMAND_SUBMISSION';` | precisa avaliar |
| [client-portal.html](os/client-portal.html) | 682 | `webhook` | `// Enviar webhook simulado/real` | seguro (dados simulados/mock) |
| [client-portal.html](os/client-portal.html) | 683 | `webhook` | `const response = await OS_CONFIG.webhooks.send(webhookKey, {` | precisa avaliar |
| [client-portal.html](os/client-portal.html) | 691 | `webhook` | `throw new Error(response.error \|\| 'Falha no webhook');` | precisa avaliar |
| [cliente-detalhe.html](os/cliente-detalhe.html) | 395 | `token` | `&lt;th style="padding-bottom: 6px;"&gt;Token&lt;/th&gt;` | precisa avaliar |
| [cliente-detalhe.html](os/cliente-detalhe.html) | 541 | `webhook` | `Ações nesta área modificam o status de faturamento, permissões de escrita de webhooks do Make, sincronização de arquivos` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 7 | `webhook` | `* ║  Este é o único arquivo onde URLs, roles, status, webhooks,          ║` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 69 | `webhook` | `sendRealWebhooks:     false,                      // GLOBALMENTE DESATIVADO por padrão para segurança` | seguro (comentário de governança) |
| [os-config.js](os/config/os-config.js) | 70 | `webhook` | `enabledRealWebhooks:  ['LEAD_CAPTURE', 'DEMAND_SUBMISSION', 'CLIENT_ONBOARDING', 'SERVICE_EXTRA_REQUEST', 'SERVICE_EXTRA` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 73 | `webhook` | `useMakeWebhooks:      true,   // Webhooks Make como canal de escrita` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 99 | `webhook` | `// 4. WEBHOOKS — MAKE.COM` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 103 | `webhook` | `* REGRA: Nenhum webhook pode estar hardcoded em módulo ou página.` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 104 | `webhook` | `* Toda chamada deve referenciar WEBHOOK_CONFIG.&lt;chave&gt;.` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 106 | `webhook` | `* ATENÇÃO: URLs de webhook não devem ser expostas em` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 110 | `webhook` | `export const WEBHOOK_CONFIG = {` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 112 | `hook.us` | `DEMAND_SUBMISSION: 'https://hook.us2.make.com/bnm7xedyxhxdlvh417gone7gy5m4e8me',` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 115 | `hook.us` | `LEAD_CAPTURE: 'https://hook.us2.make.com/gmu9xakjqfocdd8nk4sn5lxcc7pmbte2',` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 118 | `hook.us` | `CLIENT_ONBOARDING: 'https://hook.us2.make.com/mybtyyiob2msvh5sgo1115vx9pxroym9',` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 121 | `hook.us` | `SERVICE_EXTRA_REQUEST: 'https://hook.us2.make.com/rplnhe37vqvzcjh6gu92ltpvr8rirean',` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 124 | `hook.us` | `IA_CREDITOS_CONTROLE: 'https://hook.us2.make.com/667mka2gvio5g6fpe1mgi39j5rmxeoo4',` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 125 | `hook.us` | `AI_OPERATIONAL_CONTROL: 'https://hook.us2.make.com/667mka2gvio5g6fpe1mgi39j5rmxeoo4',` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 128 | `hook.us` | `SERVICE_EXTRA_APPROVAL: 'https://hook.us2.make.com/tpmta55my8fjptkue3oll3y2e3aykrr6',` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 131 | `hook.us` | `IA_GUARDRAIL: 'https://hook.us2.make.com/v19wgjtxye8uqpfkcmauag4s7wjdz767',` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 137 | `hook.us` | `PLANEJAMENTO_CONTEUDO: 'https://hook.us2.make.com/ggmqkgpb7ea13dw5i1jprrnyox24u5ba',` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 140 | `hook.us` | `CALENDARIO_POSTAGENS: 'https://hook.us2.make.com/hxbcsiiti62ha5erdxbp24tats04vti5',` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 143 | `hook.us` | `GPT_GERACOES_LOG: 'https://hook.us2.make.com/g5l7uhmgir0uhs5v4d9xdfk6jgha5smy',` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 158 | `webhook` | `* Verifica se o webhook está configurado antes de chamar` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 161 | `webhook` | `const url = WEBHOOK_CONFIG[key];` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 169 | `webhook` | `send: async (webhookKey, payload) =&gt; {` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 171 | `webhook` | `let targetKey = webhookKey;` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 172 | `webhook` | `if (webhookKey === 'DELIVERY_APPROVAL') {` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 176 | `webhook` | `} else if (webhookKey === 'SERVICE_EXTRA_INTERNAL') {` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 178 | `webhook` | `} else if (webhookKey === 'IA_CREDITOS_CONTROLE') {` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 182 | `webhook` | `const isReal = (FEATURE_FLAGS.sendRealWebhooks \|\|` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 183 | `webhook` | `(Array.isArray(FEATURE_FLAGS.enabledRealWebhooks) && FEATURE_FLAGS.enabledRealWebhooks.includes(targetKey))) &&` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 184 | `webhook` | `WEBHOOK_CONFIG._isConfigured(targetKey);` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 189 | `webhook` | ``%c[WEBHOOK:${isSimulated ? 'SIMULADO' : 'REAL'}] Acionando ${targetKey} (origem: ${webhookKey})...`,` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 197 | `webhook` | `OS_LOGS_ENGINE.webhook(targetKey, payload, true, 200, null, true);` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 202 | `webhook` | `const url = WEBHOOK_CONFIG[targetKey];` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 203 | `webhook` | `if (!WEBHOOK_CONFIG._isConfigured(targetKey)) {` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 204 | `webhook` | `console.warn(`[WEBHOOK] ${targetKey} não configurado. Payload ignorado.`, payload);` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 206 | `webhook` | `OS_LOGS_ENGINE.webhook(targetKey, payload, false, 0, 'WEBHOOK_NOT_CONFIGURED', false);` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 208 | `webhook` | `return { success: false, status: 0, error: 'WEBHOOK_NOT_CONFIGURED' };` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 218 | `webhook` | `OS_LOGS_ENGINE.webhook(targetKey, payload, true, res.status, null, false);` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 222 | `webhook` | `console.error(`[WEBHOOK] Erro ao enviar para ${targetKey}:`, err.message);` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 224 | `webhook` | `OS_LOGS_ENGINE.webhook(targetKey, payload, false, 0, err.message, false);` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 237 | `service_role` | `* Em produção, nunca expor a service_role key no frontend.` | precisa documentar como sensível / bloquear no Git |
| [os-config.js](os/config/os-config.js) | 461 | `token` | `// Status de token/integração` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 462 | `token` | `TOKEN: {` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 520 | `password` | `AUTH_PASSWORD_SAVED:  'Chave de acesso definida. Bem-vindo ao FluxAI OS™.',` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 599 | `webhook` | `// 13. CONFIGURAÇÃO DE FLUXOS OPERACIONAIS (Mapeamento de Abas e Webhooks)` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 604 | `webhook` | `webhook: 'CLIENT_ONBOARDING',` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 611 | `webhook` | `webhook: 'SERVICE_EXTRA_REQUEST',` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 618 | `webhook` | `webhook: 'DEMAND_SUBMISSION',` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 625 | `webhook` | `webhook: 'LEAD_CAPTURE',` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 632 | `webhook` | `webhook: 'REPORT_STATUS_UPDATE',` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 639 | `webhook` | `webhook: 'DELIVERY_APPROVAL',` | precisa avaliar |
| [os-config.js](os/config/os-config.js) | 651 | `webhook` | `webhooks:     WEBHOOK_CONFIG,` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 17 | `webhook` | `webhook: 'CLIENT_ONBOARDING',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 28 | `webhook` | `webhook: 'STATUS_UPDATE',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 39 | `webhook` | `webhook: 'STATUS_UPDATE',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 50 | `webhook` | `webhook: 'STATUS_UPDATE',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 65 | `webhook` | `webhook: '',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 76 | `webhook` | `webhook: '',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 87 | `webhook` | `webhook: '',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 98 | `webhook` | `webhook: 'CLIENT_ONBOARDING',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 113 | `webhook` | `webhook: 'DEMAND_STATUS_UPDATE',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 124 | `webhook` | `webhook: 'DEMAND_STATUS_UPDATE',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 135 | `webhook` | `webhook: 'DEMAND_STATUS_UPDATE',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 146 | `webhook` | `webhook: 'DEMAND_STATUS_UPDATE',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 157 | `webhook` | `webhook: 'DEMAND_STATUS_UPDATE',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 172 | `webhook` | `webhook: 'SERVICE_EXTRA_REQUEST',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 183 | `webhook` | `webhook: '',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 194 | `webhook` | `webhook: '',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 205 | `webhook` | `webhook: 'SERVICE_EXTRA_INTERNAL',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 216 | `webhook` | `webhook: '',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 227 | `webhook` | `webhook: '',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 238 | `webhook` | `webhook: '',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 249 | `webhook` | `webhook: '',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 264 | `webhook` | `webhook: 'REPORT_STATUS_UPDATE',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 275 | `webhook` | `webhook: 'REPORT_STATUS_UPDATE',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 286 | `webhook` | `webhook: 'REPORT_STATUS_UPDATE',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 297 | `webhook` | `webhook: 'REPORT_STATUS_UPDATE',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 330 | `webhook` | `webhook: 'AI_OPERATIONAL_CONTROL',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 341 | `webhook` | `webhook: 'AI_OPERATIONAL_CONTROL',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 352 | `webhook` | `webhook: 'AI_OPERATIONAL_CONTROL',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 363 | `webhook` | `webhook: 'AI_OPERATIONAL_CONTROL',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 374 | `webhook` | `webhook: 'AI_OPERATIONAL_CONTROL',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 385 | `webhook` | `webhook: 'AI_OPERATIONAL_CONTROL',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 400 | `webhook` | `webhook: '',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 411 | `webhook` | `webhook: 'DELIVERY_APPROVAL',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 422 | `webhook` | `webhook: 'DELIVERY_APPROVAL',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 433 | `webhook` | `webhook: 'DELIVERY_APPROVAL',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 438 | `token` | `// 9. Integrações / Tokens` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 448 | `webhook` | `webhook: '',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 456 | `token` | `description: 'Chave ou token ausente.',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 459 | `webhook` | `webhook: '',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 470 | `webhook` | `webhook: '',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 478 | `token` | `description: 'Token expirou. Requer re-autenticação.',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 481 | `webhook` | `webhook: '',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 496 | `webhook` | `webhook: '',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 507 | `webhook` | `webhook: '',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 518 | `webhook` | `webhook: '',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 529 | `webhook` | `webhook: '',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 544 | `webhook` | `webhook: 'LEAD_CAPTURE',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 555 | `webhook` | `webhook: 'LEAD_CAPTURE',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 566 | `webhook` | `webhook: 'LEAD_CAPTURE',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 577 | `webhook` | `webhook: 'LEAD_CAPTURE',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 588 | `webhook` | `webhook: 'CLIENT_ONBOARDING',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 599 | `webhook` | `webhook: 'LEAD_CAPTURE',` | precisa avaliar |
| [status-system.js](os/config/status-system.js) | 690 | `webhook` | `webhook: targetStatus.webhook \|\| null,` | precisa avaliar |
| [content-engine.html](os/content-engine.html) | 360 | `api_key` | `const currentKey = localStorage.getItem('openai_api_key') \|\| '';` | precisa avaliar |
| [content-engine.html](os/content-engine.html) | 364 | `api_key` | `localStorage.removeItem('openai_api_key');` | precisa avaliar |
| [content-engine.html](os/content-engine.html) | 367 | `api_key` | `localStorage.setItem('openai_api_key', newKey.trim());` | precisa avaliar |
| [client-onboarding.schema.js](os/data/client-onboarding.schema.js) | 48 | `webhook` | `{ name: 'modo_coleta', label: 'Modo de Coleta', type: 'select', options: ['api', 'manual', 'webhook', 'nao_aplicavel'], ` | precisa avaliar |
| [client-onboarding.schema.js](os/data/client-onboarding.schema.js) | 114 | `token` | `{ name: 'token_status', label: 'Status Geral do Token', type: 'select', options: ['ativo', 'aguardando_autorizacao', 'ex` | precisa avaliar |
| [client-onboarding.schema.js](os/data/client-onboarding.schema.js) | 115 | `token` | `{ name: 'token_observacao', label: 'Observação de Acesso', type: 'textarea' }` | precisa avaliar |
| [clients.data.js](os/data/clients.data.js) | 8 | `token` | `token_auth_status: 'ok',` | precisa avaliar |
| [clients.data.js](os/data/clients.data.js) | 17 | `token` | `token_auth_status: 'ok',` | precisa avaliar |
| [clients.data.js](os/data/clients.data.js) | 26 | `token` | `token_auth_status: 'ausente',` | precisa avaliar |
| [governance.js](os/data/governance.js) | 30 | `webhook` | `target: "Novo Fluxo: Webhook CRM -&gt; Meta",` | precisa avaliar |
| [status-monitor.data.js](os/data/status-monitor.data.js) | 19 | `token` | `status_operacional: 'token_ausente',` | precisa avaliar |
| [demandas.html](os/demandas.html) | 21 | `webhook` | `&lt;p&gt;Demandas capturadas do Portal via webhook do Make.&lt;/p&gt;` | precisa avaliar |
| [architecture.md](os/docs/architecture.md) | 29 | `token` | `- **ApiService**: Wrapper de `fetch` com suporte a interceptores e tokens.` | precisa avaliar |
| [FLUXAI_OS_COPY_GUIDELINES.md](os/docs/FLUXAI_OS_COPY_GUIDELINES.md) | 49 | `token` | `\| Token \| Chave de acesso de API de terceiros \|` | precisa avaliar |
| [FLUXAI_OS_COPY_GUIDELINES.md](os/docs/FLUXAI_OS_COPY_GUIDELINES.md) | 50 | `webhook` | `\| Webhook \| Endpoint de comunicação entre sistemas \|` | precisa avaliar |
| [FLUXAI_OS_COPY_GUIDELINES.md](os/docs/FLUXAI_OS_COPY_GUIDELINES.md) | 70 | `webhook` | `\| Webhook \| — (nunca exibir) \|` | precisa avaliar |
| [FLUXAI_OS_COPY_GUIDELINES.md](os/docs/FLUXAI_OS_COPY_GUIDELINES.md) | 71 | `token` | `\| Token \| Acesso Conectado / Não Configurado \|` | precisa avaliar |
| [FLUXAI_OS_COPY_GUIDELINES.md](os/docs/FLUXAI_OS_COPY_GUIDELINES.md) | 166 | `webhook` | `&gt; "Leads processados pelos Webhooks do Make."` | precisa avaliar |
| [FLUXAI_OS_DATA_FLOW.md](os/docs/FLUXAI_OS_DATA_FLOW.md) | 17 | `webhook` | `│  • Orquestra webhooks de entrada (leads, demandas, solicitações)    │` | precisa avaliar |
| [FLUXAI_OS_DATA_FLOW.md](os/docs/FLUXAI_OS_DATA_FLOW.md) | 62 | `webhook` | `→ POST para WEBHOOK_CONFIG.LEAD_CAPTURE` | precisa avaliar |
| [FLUXAI_OS_DATA_FLOW.md](os/docs/FLUXAI_OS_DATA_FLOW.md) | 73 | `webhook` | `→ POST para WEBHOOK_CONFIG.CLIENT_ONBOARDING` | precisa avaliar |
| [FLUXAI_OS_DATA_FLOW.md](os/docs/FLUXAI_OS_DATA_FLOW.md) | 85 | `webhook` | `→ POST para WEBHOOK_CONFIG.SERVICE_EXTRA_REQUEST` | precisa avaliar |
| [FLUXAI_OS_DESIGN_SYSTEM.md](os/docs/FLUXAI_OS_DESIGN_SYSTEM.md) | 19 | `token` | `## 2. Tokens Oficiais` | precisa avaliar |
| [FLUXAI_OS_DESIGN_SYSTEM.md](os/docs/FLUXAI_OS_DESIGN_SYSTEM.md) | 24 | `token` | `\| Token \| Valor \| Uso \|` | precisa avaliar |
| [FLUXAI_OS_DESIGN_SYSTEM.md](os/docs/FLUXAI_OS_DESIGN_SYSTEM.md) | 47 | `token` | `\| Token \| Valor \|` | precisa avaliar |
| [FLUXAI_OS_DESIGN_SYSTEM.md](os/docs/FLUXAI_OS_DESIGN_SYSTEM.md) | 61 | `token` | `\| Token \| Valor \| Uso \|` | precisa avaliar |
| [FLUXAI_OS_DESIGN_SYSTEM.md](os/docs/FLUXAI_OS_DESIGN_SYSTEM.md) | 69 | `token` | `\| Token \| Valor \|` | precisa avaliar |
| [FLUXAI_OS_DESIGN_SYSTEM.md](os/docs/FLUXAI_OS_DESIGN_SYSTEM.md) | 180 | `token` | `- Usar tokens via variáveis CSS` | precisa avaliar |
| [FLUXAI_OS_OPERATING_RULES.md](os/docs/FLUXAI_OS_OPERATING_RULES.md) | 15 | `webhook` | `Toda configuração (webhooks, roles, status, endpoints) vive em `/os/config/os-config.js`.` | precisa avaliar |
| [FLUXAI_OS_OPERATING_RULES.md](os/docs/FLUXAI_OS_OPERATING_RULES.md) | 20 | `token` | `Todo token visual vive em `/os/styles/interface.css`.` | precisa avaliar |
| [FLUXAI_OS_OPERATING_RULES.md](os/docs/FLUXAI_OS_OPERATING_RULES.md) | 28 | `senha` | `### R04 — Senhas Fora do Frontend` | precisa avaliar |
| [FLUXAI_OS_OPERATING_RULES.md](os/docs/FLUXAI_OS_OPERATING_RULES.md) | 29 | `senha` | `Nenhuma senha, service key ou token de serviço pode ser exposto no JavaScript público.` | precisa avaliar |
| [FLUXAI_OS_OPERATING_RULES.md](os/docs/FLUXAI_OS_OPERATING_RULES.md) | 29 | `token` | `Nenhuma senha, service key ou token de serviço pode ser exposto no JavaScript público.` | precisa avaliar |
| [FLUXAI_OS_OPERATING_RULES.md](os/docs/FLUXAI_OS_OPERATING_RULES.md) | 30 | `service_role` | `A `anonKey` do Supabase é aceitável. A `service_role` nunca.` | público por design |
| [FLUXAI_OS_OPERATING_RULES.md](os/docs/FLUXAI_OS_OPERATING_RULES.md) | 34 | `webhook` | `A escrita é feita via Make.com (webhook → Make → Sheets).` | precisa avaliar |
| [FLUXAI_OS_OPERATING_RULES.md](os/docs/FLUXAI_OS_OPERATING_RULES.md) | 72 | `webhook` | `Webhook → Make.com` | precisa avaliar |
| [FLUXAI_OS_OPERATING_RULES.md](os/docs/FLUXAI_OS_OPERATING_RULES.md) | 76 | `webhook` | `Make notifica o OS via webhook inbound (futuro)` | precisa avaliar |
| [FLUXAI_OS_PERMISSIONS.md](os/docs/FLUXAI_OS_PERMISSIONS.md) | 124 | `senha` | `\| Email \| Senha \| Role \|` | precisa avaliar |
| [FLUXAI_OS_PERMISSIONS.md](os/docs/FLUXAI_OS_PERMISSIONS.md) | 131 | `senha` | `&gt; Senhas nunca devem ser expostas no código-fonte. Em produção, apenas Supabase autentica.` | precisa avaliar |
| [FLUXAI_OS_SHEETS_ARCHITECTURE.md](os/docs/FLUXAI_OS_SHEETS_ARCHITECTURE.md) | 26 | `token` | `\| `token_auth_status` \| Status \| ativo / ausente / aguardando_autorizacao / expirado \|` | precisa avaliar |
| [FLUXAI_OS_STATUS_SYSTEM.md](os/docs/FLUXAI_OS_STATUS_SYSTEM.md) | 77 | `token` | `### Tokens / Integrações` | precisa avaliar |
| [FLUXAI_OS_UI_GUIDELINES.md](os/docs/FLUXAI_OS_UI_GUIDELINES.md) | 117 | `token` | `&lt;!-- NUNCA definir :root ou tokens aqui --&gt;` | precisa avaliar |
| [FLUXAI_OS_WEBHOOK_MAP.md](os/docs/FLUXAI_OS_WEBHOOK_MAP.md) | 1 | `webhook` | `# FLUXAI OS™ — MAPA DE WEBHOOKS` | precisa avaliar |
| [FLUXAI_OS_WEBHOOK_MAP.md](os/docs/FLUXAI_OS_WEBHOOK_MAP.md) | 2 | `webhook` | `**Versão:** 2.1.0 \| **Arquivo:** `FLUXAI_OS_WEBHOOK_MAP.md`` | precisa avaliar |
| [FLUXAI_OS_WEBHOOK_MAP.md](os/docs/FLUXAI_OS_WEBHOOK_MAP.md) | 9 | `webhook` | `Toda escrita de dados operacionais passa pelo Make.com via webhook.` | precisa avaliar |
| [FLUXAI_OS_WEBHOOK_MAP.md](os/docs/FLUXAI_OS_WEBHOOK_MAP.md) | 15 | `webhook` | `## Mapa Completo de Webhooks` | precisa avaliar |
| [FLUXAI_OS_WEBHOOK_MAP.md](os/docs/FLUXAI_OS_WEBHOOK_MAP.md) | 17 | `webhook` | `### Webhooks de SAÍDA (OS → Make)` | precisa avaliar |
| [FLUXAI_OS_WEBHOOK_MAP.md](os/docs/FLUXAI_OS_WEBHOOK_MAP.md) | 19 | `webhook` | `\| Chave em `WEBHOOK_CONFIG` \| Evento Disparador \| Aba de Destino no Sheets \| Status \|` | precisa avaliar |
| [FLUXAI_OS_WEBHOOK_MAP.md](os/docs/FLUXAI_OS_WEBHOOK_MAP.md) | 28 | `webhook` | `### Webhooks de ENTRADA (Make → OS) — Fase 2` | precisa avaliar |
| [FLUXAI_OS_WEBHOOK_MAP.md](os/docs/FLUXAI_OS_WEBHOOK_MAP.md) | 105 | `token` | `"tokens": {` | precisa avaliar |
| [FLUXAI_OS_WEBHOOK_MAP.md](os/docs/FLUXAI_OS_WEBHOOK_MAP.md) | 144 | `webhook` | `1. **Todo webhook deve ter timeout de 10s** — Use `Promise.race` com um AbortController.` | precisa avaliar |
| [FLUXAI_OS_WEBHOOK_MAP.md](os/docs/FLUXAI_OS_WEBHOOK_MAP.md) | 145 | `webhook` | `2. **Erros de webhook não devem travar a UI** — O OS continua funcionando mesmo se o Make falhar.` | precisa avaliar |
| [CHECKLIST_DE_PRODUCAO.md](os/docs/markdown/CHECKLIST_DE_PRODUCAO.md) | 17 | `senha` | `*   [ ] Verificado que as senhas e tokens dos e-mails reais estão configurados (sem mocks ativos).` | seguro (dados simulados/mock) |
| [CHECKLIST_DE_PRODUCAO.md](os/docs/markdown/CHECKLIST_DE_PRODUCAO.md) | 17 | `token` | `*   [ ] Verificado que as senhas e tokens dos e-mails reais estão configurados (sem mocks ativos).` | seguro (dados simulados/mock) |
| [CHECKLIST_DE_PRODUCAO.md](os/docs/markdown/CHECKLIST_DE_PRODUCAO.md) | 30 | `webhook` | `### [ ] 4. Cenários no Make.com e Webhooks` | precisa avaliar |
| [CHECKLIST_DE_PRODUCAO.md](os/docs/markdown/CHECKLIST_DE_PRODUCAO.md) | 31 | `webhook` | `*   [ ] Todos os 6 cenários de webhooks de produção ativos no Make.com.` | precisa avaliar |
| [CHECKLIST_DE_PRODUCAO.md](os/docs/markdown/CHECKLIST_DE_PRODUCAO.md) | 32 | `webhook` | `*   [ ] Links HTTPS de produção do Make colados na configuração `WEBHOOK_CONFIG` em `os-config.js`.` | precisa avaliar |
| [CHECKLIST_DE_PRODUCAO.md](os/docs/markdown/CHECKLIST_DE_PRODUCAO.md) | 33 | `webhook` | `*   [ ] O whitelist `enabledRealWebhooks` atualizado para conter as chaves dos webhooks ativados.` | precisa avaliar |
| [CHECKLIST_DE_PRODUCAO.md](os/docs/markdown/CHECKLIST_DE_PRODUCAO.md) | 34 | `webhook` | `*   [ ] Flag `sendRealWebhooks` configurada conforme a política de segurança da agência.` | precisa avaliar |
| [CHECKLIST_DE_PRODUCAO.md](os/docs/markdown/CHECKLIST_DE_PRODUCAO.md) | 47 | `webhook` | `*   [ ] Validado o disparo do webhook e a criação de sua pasta no Drive.` | precisa avaliar |
| [CHECKLIST_DE_PRODUCAO.md](os/docs/markdown/CHECKLIST_DE_PRODUCAO.md) | 68 | `webhook` | `*   [ ] Verificado que o webhook disparou, atualizou o status para `aprovado` no Sheets e que o log foi gravado.` | precisa avaliar |
| [CHECKLIST_DE_PRODUCAO.md](os/docs/markdown/CHECKLIST_DE_PRODUCAO.md) | 69 | `webhook` | `*   [ ] Teste de falha de webhook realizado (forçar erro HTTP no Make), validando que a transação fez rollback completo ` | precisa avaliar |
| [MANUAL_DO_ADMIN.md](os/docs/markdown/MANUAL_DO_ADMIN.md) | 7 | `webhook` | `O perfil **ADMIN** possui controle total e irrestrito sobre o ecossistema do **FluxAI OS™**. Suas responsabilidades cobr` | precisa avaliar |
| [MANUAL_DO_ADMIN.md](os/docs/markdown/MANUAL_DO_ADMIN.md) | 22 | `webhook` | `## 3. Gestão e Configuração de Webhooks e Feature Flags` | precisa avaliar |
| [MANUAL_DO_ADMIN.md](os/docs/markdown/MANUAL_DO_ADMIN.md) | 25 | `webhook` | `*   **Ativação de Webhooks Reais:** Para colocar um fluxo em produção, o ADMIN deve inserir a chave do webhook no whitel` | precisa avaliar |
| [MANUAL_DO_ADMIN.md](os/docs/markdown/MANUAL_DO_ADMIN.md) | 26 | `webhook` | `*   **Ativação Global de Produção:** A flag `FEATURE_FLAGS.sendRealWebhooks` pode ser alterada para `true` para forçar q` | precisa avaliar |
| [MANUAL_DO_ADMIN.md](os/docs/markdown/MANUAL_DO_ADMIN.md) | 34 | `webhook` | `*   **Logs do Tipo `WEBHOOK_REAL_FAILED`:** Indicam que um webhook real de produção falhou ao se conectar com o Make.com` | precisa avaliar |
| [MANUAL_DO_OPERADOR.md](os/docs/markdown/MANUAL_DO_OPERADOR.md) | 16 | `token` | `*   Conferir a tabela de **Client Health** para identificar se algum cliente ativo mudou de status ou se apresenta APIs ` | precisa avaliar |
| [MANUAL_DO_SISTEMA.md](os/docs/markdown/MANUAL_DO_SISTEMA.md) | 19 | `webhook` | `4.  **Camada de Integração e Automação (Middleware):** Orquestrada pelo **Make.com**. Webhooks transacionais recebem pay` | precisa avaliar |
| [MANUAL_DO_SISTEMA.md](os/docs/markdown/MANUAL_DO_SISTEMA.md) | 41 | `webhook` | `2.  **Operations Center (`operations-center.html`):** O monitoramento sistêmico da equipe. Acompanha a ocupação dos limi` | precisa avaliar |
| [MANUAL_DO_SISTEMA.md](os/docs/markdown/MANUAL_DO_SISTEMA.md) | 48 | `webhook` | `*   **Consistência Transacional:** Nenhuma alteração no status de entregas ou faturamento é persistida localmente antes ` | precisa avaliar |
| [MAPA_DE_ABAS_SHEETS.md](os/docs/markdown/MAPA_DE_ABAS_SHEETS.md) | 9 | `webhook` | `*   **Propósito:** Atua como o banco de dados operacional síncrono. O OS faz leituras e disparos de webhook, e o Make re` | precisa avaliar |
| [MAPA_DE_AUTORIZACOES.md](os/docs/markdown/MAPA_DE_AUTORIZACOES.md) | 10 | `token` | `*   **API Ativa:** Token e credenciais configurados, comunicando perfeitamente.` | precisa avaliar |
| [MAPA_DE_AUTORIZACOES.md](os/docs/markdown/MAPA_DE_AUTORIZACOES.md) | 23 | `token` | `\| **Instagram Business** \| Graph API via Make.com \| Agência / Cliente \| **Aguardando Autorização**\| Vincular conta do In` | precisa avaliar |
| [MAPA_DE_AUTORIZACOES.md](os/docs/markdown/MAPA_DE_AUTORIZACOES.md) | 30 | `webhook` | `\| **Make.com** \| Webhooks e Conexões HTTP \| Automações (FluxAI) \| **API Ativa** \| Configurar chaves no whitelist do arqu` | precisa avaliar |
| [MAPA_DE_AUTORIZACOES.md](os/docs/markdown/MAPA_DE_AUTORIZACOES.md) | 46 | `webhook` | `4.  **Meta Ads Account ID:** O operador copia o ID numérico da conta de anúncios do cliente (ex: `act_123456789`) e cola` | precisa avaliar |
| [MAPA_DE_DRIVE.md](os/docs/markdown/MAPA_DE_DRIVE.md) | 13 | `webhook` | `Toda nova conta de cliente criada via webhook `CLIENT_ONBOARDING` do Make.com terá a seguinte árvore de diretórios gerad` | precisa avaliar |
| [MAPA_DE_FLUXOS.md](os/docs/markdown/MAPA_DE_FLUXOS.md) | 31 | `webhook` | `*   **Ação de Integração:** O site envia o payload via webhook `LEAD_CAPTURE` para o Make.com.` | precisa avaliar |
| [MAPA_DE_FLUXOS.md](os/docs/markdown/MAPA_DE_FLUXOS.md) | 43 | `webhook` | `*   **Ação de Integração:** O OS dispara o webhook `CLIENT_ONBOARDING` para o Make.com.` | precisa avaliar |
| [MAPA_DE_FLUXOS.md](os/docs/markdown/MAPA_DE_FLUXOS.md) | 84 | `webhook` | `*   **Aprovação Executiva:** O ADMIN aprova o relatório, disparando o webhook de liberação.` | precisa avaliar |
| [MAPA_DE_PERMISSOES.md](os/docs/markdown/MAPA_DE_PERMISSOES.md) | 30 | `webhook` | `\| `logs.html` \| ✅ \| ✅ \| ❌ \| Histórico operacional de ações, erros de webhooks e alertas. \|` | precisa avaliar |
| [MAPA_DE_PERMISSOES.md](os/docs/markdown/MAPA_DE_PERMISSOES.md) | 32 | `webhook` | `\| `governance.html` \| ✅ \| ❌ \| ❌ \| Restrito ao ADMIN. Configurações de webhooks, chaves de API e flags. \|` | precisa avaliar |
| [MAPA_DE_PERMISSOES.md](os/docs/markdown/MAPA_DE_PERMISSOES.md) | 67 | `webhook` | `*   **Forçar Reenvio de Webhooks com Falha (Rollback):** Apenas `ADMIN`` | precisa avaliar |
| [MAPA_DE_WEBHOOKS_MAKE.md](os/docs/markdown/MAPA_DE_WEBHOOKS_MAKE.md) | 1 | `webhook` | `# MAPA DE WEBHOOKS MAKE.COM — FluxAI OS™` | precisa avaliar |
| [MAPA_DE_WEBHOOKS_MAKE.md](os/docs/markdown/MAPA_DE_WEBHOOKS_MAKE.md) | 8 | `webhook` | `Toda ação de escrita no banco operacional é transacional e dispara um webhook.` | precisa avaliar |
| [MAPA_DE_WEBHOOKS_MAKE.md](os/docs/markdown/MAPA_DE_WEBHOOKS_MAKE.md) | 12 | `webhook` | `&gt; O FluxAI OS™ realiza atualizações na interface de usuário e persiste dados localmente **apenas após** receber o retorn` | precisa avaliar |
| [MAPA_DE_WEBHOOKS_MAKE.md](os/docs/markdown/MAPA_DE_WEBHOOKS_MAKE.md) | 16 | `webhook` | `## 2. Catálogo Oficial de Webhooks` | precisa avaliar |
| [MAPA_DE_WEBHOOKS_MAKE.md](os/docs/markdown/MAPA_DE_WEBHOOKS_MAKE.md) | 19 | `webhook` | `*   **ID do Webhook (OS):** `LEAD_CAPTURE`` | precisa avaliar |
| [MAPA_DE_WEBHOOKS_MAKE.md](os/docs/markdown/MAPA_DE_WEBHOOKS_MAKE.md) | 22 | `webhook` | `*   **Status de Ativação:** **Real** (whitelisted em `enabledRealWebhooks`)` | precisa avaliar |
| [MAPA_DE_WEBHOOKS_MAKE.md](os/docs/markdown/MAPA_DE_WEBHOOKS_MAKE.md) | 26 | `webhook` | `*   **ID do Webhook (OS):** `CLIENT_ONBOARDING`` | precisa avaliar |
| [MAPA_DE_WEBHOOKS_MAKE.md](os/docs/markdown/MAPA_DE_WEBHOOKS_MAKE.md) | 29 | `webhook` | `*   **Status de Ativação:** **Real** (whitelisted em `enabledRealWebhooks`)` | precisa avaliar |
| [MAPA_DE_WEBHOOKS_MAKE.md](os/docs/markdown/MAPA_DE_WEBHOOKS_MAKE.md) | 33 | `webhook` | `*   **ID do Webhook (OS):** `SERVICE_EXTRA_REQUEST`` | precisa avaliar |
| [MAPA_DE_WEBHOOKS_MAKE.md](os/docs/markdown/MAPA_DE_WEBHOOKS_MAKE.md) | 36 | `webhook` | `*   **Status de Ativação:** **Real** (whitelisted em `enabledRealWebhooks`)` | precisa avaliar |
| [MAPA_DE_WEBHOOKS_MAKE.md](os/docs/markdown/MAPA_DE_WEBHOOKS_MAKE.md) | 40 | `webhook` | `*   **ID do Webhook (OS):** `SERVICE_EXTRA_APPROVAL`` | precisa avaliar |
| [MAPA_DE_WEBHOOKS_MAKE.md](os/docs/markdown/MAPA_DE_WEBHOOKS_MAKE.md) | 43 | `webhook` | `*   **Status de Ativação:** **Real** (whitelisted em `enabledRealWebhooks`)` | precisa avaliar |
| [MAPA_DE_WEBHOOKS_MAKE.md](os/docs/markdown/MAPA_DE_WEBHOOKS_MAKE.md) | 47 | `webhook` | `*   **ID do Webhook (OS):** `DEMAND_STATUS_UPDATE`` | precisa avaliar |
| [MAPA_DE_WEBHOOKS_MAKE.md](os/docs/markdown/MAPA_DE_WEBHOOKS_MAKE.md) | 54 | `webhook` | `*   **ID do Webhook (OS):** `CONFIRM_MANUAL_POST`` | precisa avaliar |
| [MATRIZ_DE_RESPONSAVEIS.md](os/docs/markdown/MATRIZ_DE_RESPONSAVEIS.md) | 15 | `webhook` | `7.  **Automações (Integrador Make):** Desenvolve e monitora o funcionamento de webhooks e cenários no Make.com.` | precisa avaliar |
| [MATRIZ_DE_RESPONSAVEIS.md](os/docs/markdown/MATRIZ_DE_RESPONSAVEIS.md) | 47 | `webhook` | `*   **Erro Crítico de Webhook (`WEBHOOK_REAL_FAILED`):** O Operador de Conteúdo (ou Atendimento) notifica imediatamente ` | precisa avaliar |
| [PLANO_DE_CONTINGENCIA.md](os/docs/markdown/PLANO_DE_CONTINGENCIA.md) | 15 | `webhook` | `*   **Sintoma:** O OS exibe alertas na tela de que a conexão falhou e os logs registram a chave `WEBHOOK_REAL_FAILED` co` | precisa avaliar |
| [PLANO_DE_CONTINGENCIA.md](os/docs/markdown/PLANO_DE_CONTINGENCIA.md) | 37 | `token` | `### Cenário D: O Token de API da Meta (Instagram/Ads) Expirou` | precisa avaliar |
| [PLANO_DE_CONTINGENCIA.md](os/docs/markdown/PLANO_DE_CONTINGENCIA.md) | 39 | `senha` | `*   **Causa Comum:** Mudança de senha da conta do Facebook do cliente, ou expiração natural do token de longa duração (g` | precisa avaliar |
| [PLANO_DE_CONTINGENCIA.md](os/docs/markdown/PLANO_DE_CONTINGENCIA.md) | 39 | `token` | `*   **Causa Comum:** Mudança de senha da conta do Facebook do cliente, ou expiração natural do token de longa duração (g` | precisa avaliar |
| [PLANO_DE_CONTINGENCIA.md](os/docs/markdown/PLANO_DE_CONTINGENCIA.md) | 42 | `token` | `2.  Gere um novo Token de Acesso do Usuário do Sistema na Meta Business Suite e cole nas configurações do Cockpit do Cli` | precisa avaliar |
| [PLANO_DE_CONTINGENCIA.md](os/docs/markdown/PLANO_DE_CONTINGENCIA.md) | 53 | `webhook` | `1.  **Recuperação de Demanda:** Como a exclusão local no OS não deleta fisicamente o registro no Sheets antes do webhook` | precisa avaliar |
| [PLANO_DE_CONTINGENCIA.md](os/docs/markdown/PLANO_DE_CONTINGENCIA.md) | 58 | `webhook` | `*   **Causa Comum:** Disparos repetidos do mesmo webhook devido a instabilidade de rede (falha na confirmação de recebim` | precisa avaliar |
| [PLANO_DE_CONTINGENCIA.md](os/docs/markdown/PLANO_DE_CONTINGENCIA.md) | 61 | `webhook` | `2.  Ajuste o timeout do webhook no OS para evitar disparos duplicados em conexões lentas.` | precisa avaliar |
| [RELATORIO_FINAL_DE_PRONTIDAO_PRODUCAO.md](os/docs/markdown/RELATORIO_FINAL_DE_PRONTIDAO_PRODUCAO.md) | 29 | `webhook` | `*   **Descrição:** O sistema usa chamadas síncronas de webhook para garantir consistência transacional. Se a conexão de ` | precisa avaliar |
| [RELATORIO_FINAL_DE_PRONTIDAO_PRODUCAO.md](os/docs/markdown/RELATORIO_FINAL_DE_PRONTIDAO_PRODUCAO.md) | 32 | `token` | `### Risco Alto: Expiração e Revogação de Tokens de APIs Sociais (Meta)` | precisa avaliar |
| [RELATORIO_FINAL_DE_PRONTIDAO_PRODUCAO.md](os/docs/markdown/RELATORIO_FINAL_DE_PRONTIDAO_PRODUCAO.md) | 33 | `senha` | `*   **Descrição:** Tokens da Meta expiram a cada 60 dias ou quando o cliente altera as senhas de segurança de sua conta ` | precisa avaliar |
| [RELATORIO_FINAL_DE_PRONTIDAO_PRODUCAO.md](os/docs/markdown/RELATORIO_FINAL_DE_PRONTIDAO_PRODUCAO.md) | 33 | `token` | `*   **Descrição:** Tokens da Meta expiram a cada 60 dias ou quando o cliente altera as senhas de segurança de sua conta ` | precisa avaliar |
| [RELATORIO_FINAL_DE_PRONTIDAO_PRODUCAO.md](os/docs/markdown/RELATORIO_FINAL_DE_PRONTIDAO_PRODUCAO.md) | 34 | `token` | `*   **Ações Mitigadoras:** O sistema exibe o alerta de token expirado em destaque na lista de clientes. O operador de su` | precisa avaliar |
| [ROTEIROS_DE_TREINAMENTO.md](os/docs/markdown/ROTEIROS_DE_TREINAMENTO.md) | 26 | `webhook` | `2.  *Gatilho do Webhook:* Clicar em "Iniciar Onboarding".` | precisa avaliar |
| [ROTEIROS_DE_TREINAMENTO.md](os/docs/markdown/ROTEIROS_DE_TREINAMENTO.md) | 53 | `webhook` | `*   **Objetivo:** Ensinar a auditar a integridade sistêmica e diagnosticar falhas de webhook.` | precisa avaliar |
| [ROTEIROS_DE_TREINAMENTO.md](os/docs/markdown/ROTEIROS_DE_TREINAMENTO.md) | 56 | `webhook` | `2.  *Filtro:* Filtrar por erros de webhook e logs de segurança.` | precisa avaliar |
| [RELATORIO_DOCUMENTACAO_FINAL.md](os/docs/RELATORIO_DOCUMENTACAO_FINAL.md) | 16 | `webhook` | `8.  **[MAPA_DE_WEBHOOKS_MAKE.md](./markdown/MAPA_DE_WEBHOOKS_MAKE.md):** Catálogo de webhooks transacionais de entrada/s` | precisa avaliar |
| [RELATORIO_DOCUMENTACAO_FINAL.md](os/docs/RELATORIO_DOCUMENTACAO_FINAL.md) | 40 | `webhook` | `*   `MAPA_DE_WEBHOOKS_MAKE.pdf`` | precisa avaliar |
| [RELATORIO_DOCUMENTACAO_FINAL.md](os/docs/RELATORIO_DOCUMENTACAO_FINAL.md) | 99 | `webhook` | `*   **Vídeo 6: Diagnóstico de Erros de Webhooks e Rollbacks** (Duração sugerida: 5 minutos).` | precisa avaliar |
| [governance-users.html](os/governance-users.html) | 132 | `senha` | `/* Credenciais e Senha */` | precisa avaliar |
| [governance-users.html](os/governance-users.html) | 408 | `senha` | `&lt;label&gt;Senha Provisória Padrão&lt;/label&gt;` | precisa avaliar |
| [governance-users.html](os/governance-users.html) | 410 | `senha` | `&lt;span style="font-size: 0.6rem; color: var(--os-text-muted); display: block; margin-top: 5px;"&gt;O colaborador deverá alte` | precisa avaliar |
| [governance-users.html](os/governance-users.html) | 458 | `password` | `{ id: 'u1', full_name: 'Admin FluxAI', email: 'admin@fluxai.com', password: 'fluxai@2026', role: 'ADMIN', needsPasswordC` | precisa avaliar |
| [governance-users.html](os/governance-users.html) | 459 | `password` | `{ id: 'u2', full_name: 'Kassia Gomes', email: 'kassia@fluxai.com', password: 'fluxai@2026', role: 'OPERATOR', needsPassw` | precisa avaliar |
| [governance-users.html](os/governance-users.html) | 460 | `password` | `{ id: 'u3', full_name: 'Maria Aparecida', email: 'maria.nutri@gmail.com', password: 'fluxai@2026', role: 'CLIENT', needs` | precisa avaliar |
| [governance-users.html](os/governance-users.html) | 479 | `password` | `id: u.id, full_name: u.name, email: u.email, password: 'fluxai@2026', role: u.role, permissions: u.permissions \|\| []` | precisa avaliar |
| [governance-users.html](os/governance-users.html) | 535 | `password` | `&lt;span style="font-size: 0.7rem; color: var(--os-text-muted);"&gt;&lt;i class="fa-solid fa-key"&gt;&lt;/i&gt; Chave: &lt;span id="pass-${u.` | precisa avaliar |
| [governance-users.html](os/governance-users.html) | 552 | `password` | `&lt;button class="btn-credential-action" onclick="window.togglePasswordReveal('${u.id}', '${u.password}')" title="Revelar S` | precisa avaliar |
| [governance-users.html](os/governance-users.html) | 552 | `senha` | `&lt;button class="btn-credential-action" onclick="window.togglePasswordReveal('${u.id}', '${u.password}')" title="Revelar S` | precisa avaliar |
| [governance-users.html](os/governance-users.html) | 555 | `password` | `&lt;button class="btn-credential-action" onclick="window.copyToClipboard('${u.password}')" title="Copiar Senha"&gt;` | precisa avaliar |
| [governance-users.html](os/governance-users.html) | 555 | `senha` | `&lt;button class="btn-credential-action" onclick="window.copyToClipboard('${u.password}')" title="Copiar Senha"&gt;` | precisa avaliar |
| [governance-users.html](os/governance-users.html) | 574 | `password` | `&lt;button class="btn-card-action btn-card-reset" onclick="window.resetUserPassword('${u.id}')" title="Resetar senha para f` | precisa avaliar |
| [governance-users.html](os/governance-users.html) | 574 | `senha` | `&lt;button class="btn-card-action btn-card-reset" onclick="window.resetUserPassword('${u.id}')" title="Resetar senha para f` | precisa avaliar |
| [governance-users.html](os/governance-users.html) | 575 | `senha` | `&lt;i class="fa-solid fa-key"&gt;&lt;/i&gt; Resetar Senha` | precisa avaliar |
| [governance-users.html](os/governance-users.html) | 612 | `password` | `password: "fluxai@2026",` | precisa avaliar |
| [governance-users.html](os/governance-users.html) | 615 | `password` | `needsPasswordChange: true` | precisa avaliar |
| [governance-users.html](os/governance-users.html) | 643 | `password` | `window.togglePasswordReveal = (userId, actualPassword) =&gt; {` | precisa avaliar |
| [governance-users.html](os/governance-users.html) | 647 | `password` | `passSpan.innerText = actualPassword;` | precisa avaliar |
| [governance-users.html](os/governance-users.html) | 684 | `password` | `window.resetUserPassword = (userId) =&gt; {` | precisa avaliar |
| [governance-users.html](os/governance-users.html) | 685 | `senha` | `if(confirm('Tem certeza que deseja resetar a senha deste usuário para a senha padrão provisória ("fluxai@2026")? Ele dev` | precisa avaliar |
| [governance-users.html](os/governance-users.html) | 689 | `password` | `mockUsers[index].password = 'fluxai@2026';` | seguro (dados simulados/mock) |
| [governance-users.html](os/governance-users.html) | 690 | `password` | `mockUsers[index].needsPasswordChange = true;` | seguro (dados simulados/mock) |
| [governance-users.html](os/governance-users.html) | 692 | `senha` | `showToast('Senha resetada com sucesso!');` | precisa avaliar |
| [governance.html](os/governance.html) | 96 | `password` | `&lt;input type="password" id="openai-api-key" placeholder="sk-proj-..." style="flex: 1; max-width: 500px; padding: 12px 15p` | seguro (campo de formulário frontend) |
| [governance.html](os/governance.html) | 109 | `password` | `&lt;input type="password" id="google-api-key" placeholder="AIzaSyB..." style="flex: 1; max-width: 500px; padding: 12px 15px` | seguro (campo de formulário frontend) |
| [governance.html](os/governance.html) | 118 | `webhook` | `&lt;!-- Make.com / Webhooks --&gt;` | precisa avaliar |
| [governance.html](os/governance.html) | 120 | `webhook` | `&lt;label style="display:block; font-size: 0.75rem; font-weight: 800; color: #fff; margin-bottom: 8px;"&gt;&lt;i class="fa-solid ` | precisa avaliar |
| [governance.html](os/governance.html) | 122 | `password` | `&lt;input type="password" id="make-api-key" placeholder="https://hook.us1.make.com/..." style="flex: 1; max-width: 500px; p` | seguro (campo de formulário frontend) |
| [governance.html](os/governance.html) | 122 | `hook.us` | `&lt;input type="password" id="make-api-key" placeholder="https://hook.us1.make.com/..." style="flex: 1; max-width: 500px; p` | seguro (campo de formulário frontend) |
| [governance.html](os/governance.html) | 127 | `webhook` | `&lt;i class="fa-solid fa-circle-check"&gt;&lt;/i&gt; URL Base de Webhooks ativa.` | precisa avaliar |
| [governance.html](os/governance.html) | 135 | `password` | `&lt;input type="password" id="supabase-api-key" placeholder="eyJhbGciOiJIUzI1NiIs..." style="flex: 1; max-width: 500px; pad` | seguro (campo de formulário frontend) |
| [governance.html](os/governance.html) | 148 | `password` | `&lt;input type="password" id="claude-api-key" placeholder="sk-ant-..." style="flex: 1; max-width: 500px; padding: 12px 15px` | seguro (campo de formulário frontend) |
| [governance.html](os/governance.html) | 161 | `password` | `&lt;input type="password" id="github-api-key" placeholder="ghp_..." style="flex: 1; max-width: 500px; padding: 12px 15px; b` | seguro (campo de formulário frontend) |
| [governance.html](os/governance.html) | 329 | `senha` | `// Redesenhar fila de aprovações` | precisa avaliar |
| [governance.html](os/governance.html) | 358 | `senha` | `// Redesenhar logs de auditoria` | precisa avaliar |
| [governance.html](os/governance.html) | 395 | `api_key` | `localStorage.setItem(provider + '_api_key', key.trim());` | precisa avaliar |
| [governance.html](os/governance.html) | 403 | `api_key` | `localStorage.removeItem(provider + '_api_key');` | precisa avaliar |
| [governance.html](os/governance.html) | 412 | `api_key` | `const savedKey = localStorage.getItem(p + '_api_key');` | precisa avaliar |
| [approval.js](os/js/approval.js) | 8 | `token` | `const token = params.get('token');` | precisa avaliar |
| [approval.js](os/js/approval.js) | 10 | `token` | `if (!token) {` | precisa avaliar |
| [approval.js](os/js/approval.js) | 19 | `token` | `// 1. Buscar item de aprovação pelo token` | precisa avaliar |
| [approval.js](os/js/approval.js) | 23 | `token` | `.eq('token', token)` | precisa avaliar |
| [approval.js](os/js/approval.js) | 73 | `webhook` | `const isReal = OS_CONFIG.flags.sendRealWebhooks \|\|` | precisa avaliar |
| [approval.js](os/js/approval.js) | 74 | `webhook` | `(Array.isArray(OS_CONFIG.flags.enabledRealWebhooks) && OS_CONFIG.flags.enabledRealWebhooks.includes(transitionResult.web` | precisa avaliar |
| [approval.js](os/js/approval.js) | 76 | `webhook` | `// Disparar webhook real ANTES de qualquer persistência no banco` | precisa avaliar |
| [approval.js](os/js/approval.js) | 77 | `webhook` | `if (transitionResult.webhook) {` | precisa avaliar |
| [approval.js](os/js/approval.js) | 86 | `webhook` | `const response = await OS_CONFIG.webhooks.send(transitionResult.webhook, payload);` | precisa avaliar |
| [approval.js](os/js/approval.js) | 88 | `webhook` | `console.error('[DELIVERY_APPROVAL] Falha no webhook real. Abortando persistência.', response.error);` | precisa avaliar |
| [approval.js](os/js/approval.js) | 91 | `webhook` | `'WEBHOOK_REAL_FAILED',` | precisa avaliar |
| [approval.js](os/js/approval.js) | 93 | `webhook` | `{ webhook: transitionResult.webhook, error: response.error \|\| 'Erro Desconhecido', status: response.status \|\| 0 },` | precisa avaliar |
| [approval.js](os/js/approval.js) | 102 | `webhook` | `{ action: 'aprovar_entrega', reason: 'Falha no webhook real de integração' },` | precisa avaliar |
| [approval.js](os/js/approval.js) | 123 | `webhook` | `{ reason: 'Falha na resposta do webhook', client_id: app.project_id, preserved_status: app.status },` | precisa avaliar |
| [approval.js](os/js/approval.js) | 138 | `webhook` | `alert(`Falha Crítica de Conexão com o Webhook de Integração:\n\n${response.error \|\| 'O servidor de integração retornou e` | precisa avaliar |
| [approval.js](os/js/approval.js) | 158 | `webhook` | `'WEBHOOK_REAL_SUCCESS',` | precisa avaliar |
| [approval.js](os/js/approval.js) | 160 | `webhook` | `{ webhook: transitionResult.webhook },` | precisa avaliar |
| [approval.js](os/js/approval.js) | 208 | `webhook` | `const isReal = OS_CONFIG.flags.sendRealWebhooks \|\|` | precisa avaliar |
| [approval.js](os/js/approval.js) | 209 | `webhook` | `(Array.isArray(OS_CONFIG.flags.enabledRealWebhooks) && OS_CONFIG.flags.enabledRealWebhooks.includes(transitionResult.web` | precisa avaliar |
| [approval.js](os/js/approval.js) | 211 | `webhook` | `// Disparar webhook real ANTES de qualquer persistência no banco` | precisa avaliar |
| [approval.js](os/js/approval.js) | 212 | `webhook` | `if (transitionResult.webhook) {` | precisa avaliar |
| [approval.js](os/js/approval.js) | 221 | `webhook` | `const response = await OS_CONFIG.webhooks.send(transitionResult.webhook, payload);` | precisa avaliar |
| [approval.js](os/js/approval.js) | 223 | `webhook` | `console.error('[DELIVERY_APPROVAL] Falha no webhook real. Abortando persistência.', response.error);` | precisa avaliar |
| [approval.js](os/js/approval.js) | 226 | `webhook` | `'WEBHOOK_REAL_FAILED',` | precisa avaliar |
| [approval.js](os/js/approval.js) | 228 | `webhook` | `{ webhook: transitionResult.webhook, error: response.error \|\| 'Erro Desconhecido', status: response.status \|\| 0 },` | precisa avaliar |
| [approval.js](os/js/approval.js) | 237 | `webhook` | `{ action: 'solicitar_alteracao', reason: 'Falha no webhook real de integração' },` | precisa avaliar |
| [approval.js](os/js/approval.js) | 258 | `webhook` | `{ reason: 'Falha na resposta do webhook', client_id: app.project_id, preserved_status: app.status },` | precisa avaliar |
| [approval.js](os/js/approval.js) | 273 | `webhook` | `alert(`Falha Crítica de Conexão com o Webhook de Integração:\n\n${response.error \|\| 'O servidor de integração retornou e` | precisa avaliar |
| [approval.js](os/js/approval.js) | 296 | `webhook` | `'WEBHOOK_REAL_SUCCESS',` | precisa avaliar |
| [approval.js](os/js/approval.js) | 298 | `webhook` | `{ webhook: transitionResult.webhook },` | precisa avaliar |
| [approval.js](os/js/approval.js) | 330 | `webhook` | `const isReal = OS_CONFIG.flags.sendRealWebhooks \|\|` | precisa avaliar |
| [approval.js](os/js/approval.js) | 331 | `webhook` | `(Array.isArray(OS_CONFIG.flags.enabledRealWebhooks) && OS_CONFIG.flags.enabledRealWebhooks.includes(transitionResult.web` | precisa avaliar |
| [approval.js](os/js/approval.js) | 333 | `webhook` | `// Disparar webhook real ANTES de qualquer persistência no banco` | precisa avaliar |
| [approval.js](os/js/approval.js) | 334 | `webhook` | `if (transitionResult.webhook) {` | precisa avaliar |
| [approval.js](os/js/approval.js) | 343 | `webhook` | `const response = await OS_CONFIG.webhooks.send(transitionResult.webhook, payload);` | precisa avaliar |
| [approval.js](os/js/approval.js) | 345 | `webhook` | `console.error('[DELIVERY_APPROVAL] Falha no webhook real. Abortando persistência.', response.error);` | precisa avaliar |
| [approval.js](os/js/approval.js) | 348 | `webhook` | `'WEBHOOK_REAL_FAILED',` | precisa avaliar |
| [approval.js](os/js/approval.js) | 350 | `webhook` | `{ webhook: transitionResult.webhook, error: response.error \|\| 'Erro Desconhecido', status: response.status \|\| 0 },` | precisa avaliar |
| [approval.js](os/js/approval.js) | 359 | `webhook` | `{ action: 'rejeitar_entrega', reason: 'Falha no webhook real de integração' },` | precisa avaliar |
| [approval.js](os/js/approval.js) | 380 | `webhook` | `{ reason: 'Falha na resposta do webhook', client_id: app.project_id, preserved_status: app.status },` | precisa avaliar |
| [approval.js](os/js/approval.js) | 395 | `webhook` | `alert(`Falha Crítica de Conexão com o Webhook de Integração:\n\n${response.error \|\| 'O servidor de integração retornou e` | precisa avaliar |
| [approval.js](os/js/approval.js) | 415 | `webhook` | `'WEBHOOK_REAL_SUCCESS',` | precisa avaliar |
| [approval.js](os/js/approval.js) | 417 | `webhook` | `{ webhook: transitionResult.webhook },` | precisa avaliar |
| [contracts-finance.js](os/js/contracts-finance.js) | 50 | `webhook` | `desc: "Desenvolvimento de fluxos automatizados integrando WhatsApp, Planilhas, CRM e Email. Inclui tratamento de erros, ` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 31 | `token` | `{ name: 'Instagram Graph API', status: 'Conectado', token: 'ativo', manual: false, alert: 'Próxima renovação em 45 dias'` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 32 | `token` | `{ name: 'Meta Ads Manager API', status: 'Conectado', token: 'ativo', manual: false, alert: 'Sem pendências de faturament` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 33 | `token` | `{ name: 'Google Analytics 4 API', status: 'Conectado', token: 'ativo', manual: false, alert: 'Sincronização OK' },` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 34 | `token` | `{ name: 'Google Tag Manager', status: 'Instalado', token: 'ativo', manual: false, alert: 'Tags ativas e disparando' },` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 35 | `token` | `{ name: 'Microsoft Clarity', status: 'Conectado', token: 'ativo', manual: false, alert: 'Dados aquecidos' },` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 36 | `token` | `{ name: 'Google Search Console', status: 'Conectado', token: 'ativo', manual: false, alert: 'Varredura OK' },` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 37 | `token` | `{ name: 'Google Drive API', status: 'Conectado', token: 'ativo', manual: false, alert: 'Sincronização de arquivos ativa'` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 62 | `token` | `{ name: 'Instagram Graph API', status: 'Conectado', token: 'ativo', manual: false, alert: 'OK' },` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 63 | `token` | `{ name: 'Meta Ads Manager API', status: 'Conectado', token: 'ativo', manual: false, alert: 'OK' },` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 64 | `token` | `{ name: 'Google Analytics 4 API', status: 'Conectado', token: 'ativo', manual: false, alert: 'OK' },` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 65 | `token` | `{ name: 'Google Drive API', status: 'Conectado', token: 'ativo', manual: false, alert: 'Sincronização OK' }` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 88 | `token` | `{ name: 'Instagram Graph API', status: 'Não Configurado', token: 'ausente', manual: true, alert: 'Token expirado' }` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 274 | `token` | `connLabel = 'TOKEN EXPIRADO';` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 277 | `token` | `// Mapeamento do Token` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 278 | `token` | `let tokenClass = 'neutral';` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 279 | `token` | `if (int.token === 'ativo') {` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 280 | `token` | `tokenClass = 'success';` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 281 | `token` | `} else if (int.token === 'ausente' \|\| int.token === 'inativo') {` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 282 | `token` | `tokenClass = 'neutral';` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 283 | `token` | `} else if (int.token === 'expirado') {` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 284 | `token` | `tokenClass = 'danger';` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 291 | `token` | `&lt;td style="padding-top:12px;"&gt;&lt;span class="badge-status ${tokenClass}" style="font-size:0.55rem; letter-spacing:0.5px;"&gt;` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 331 | `webhook` | `!OS_CONFIG.flags.sendRealWebhooks` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 548 | `webhook` | `!OS_CONFIG.flags.sendRealWebhooks` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 571 | `webhook` | `!OS_CONFIG.flags.sendRealWebhooks` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 573 | `webhook` | `alert(automationsPaused ? 'Automações e Webhooks pausados para este cliente.' : 'Fluxo operacional de automações reativa` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 585 | `webhook` | `!OS_CONFIG.flags.sendRealWebhooks` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 599 | `webhook` | `!OS_CONFIG.flags.sendRealWebhooks` | precisa avaliar |
| [cliente-detalhe.js](os/js/modules/cliente-detalhe.js) | 687 | `webhook` | `!OS_CONFIG.flags.sendRealWebhooks` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 141 | `webhook` | `// Preparar payload para o webhook de aprovação real` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 166 | `webhook` | `const isReal = OS_CONFIG.flags.sendRealWebhooks \|\|` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 167 | `webhook` | `(Array.isArray(OS_CONFIG.flags.enabledRealWebhooks) && OS_CONFIG.flags.enabledRealWebhooks.includes('SERVICE_EXTRA_APPRO` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 169 | `webhook` | `// Acionar webhook via send (verifica se é real ou simulado)` | seguro (dados simulados/mock) |
| [clients.js](os/js/modules/clients.js) | 170 | `webhook` | `response = await OS_CONFIG.webhooks.send('SERVICE_EXTRA_APPROVAL', payload);` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 172 | `webhook` | `// Rollback seguro em caso de falha no webhook real` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 174 | `webhook` | `console.error('[SERVICE_EXTRA_APPROVAL] Falha no webhook real. Abortando persistência.', response.error);` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 177 | `webhook` | `// 1. WEBHOOK_REAL_FAILED` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 179 | `webhook` | `'WEBHOOK_REAL_FAILED',` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 181 | `webhook` | `{ webhook: 'SERVICE_EXTRA_APPROVAL', error: response.error \|\| 'Erro Desconhecido', status: response.status \|\| 0 },` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 191 | `webhook` | `{ action: 'aprovacao_servico_extra', reason: 'Falha no webhook real de integração', service: serviceName },` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 216 | `webhook` | `reason: 'Falha na resposta do webhook de aprovação',` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 243 | `webhook` | `alert(`Falha Crítica de Conexão com o Webhook:\n\n${response.error \|\| 'O servidor de integração retornou erro.'}\n\nOper` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 248 | `webhook` | `// Se chegamos aqui, o webhook teve sucesso (ou foi simulado/mock).` | seguro (dados simulados/mock) |
| [clients.js](os/js/modules/clients.js) | 264 | `webhook` | `const isRealWebhookSuccess = response.success && !response.simulated;` | seguro (dados simulados/mock) |
| [clients.js](os/js/modules/clients.js) | 278 | `webhook` | `!isRealWebhookSuccess` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 288 | `webhook` | `!isRealWebhookSuccess` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 304 | `webhook` | `!isRealWebhookSuccess` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 314 | `webhook` | `!isRealWebhookSuccess` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 324 | `webhook` | `!isRealWebhookSuccess` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 327 | `webhook` | `if (isRealWebhookSuccess) {` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 328 | `webhook` | `// WEBHOOK_REAL_SUCCESS` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 330 | `webhook` | `'WEBHOOK_REAL_SUCCESS',` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 332 | `webhook` | `{ webhook: 'SERVICE_EXTRA_APPROVAL', response_status: response.status \|\| 200 },` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 347 | `webhook` | `!isRealWebhookSuccess` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 439 | `senha` | `// 5. Desenhar Tabela` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 446 | `token` | `&lt;th style="text-align: center;"&gt;Token API&lt;/th&gt;` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 456 | `token` | `const tokenClass = c.tokenStatus === 'ok' ? 'ativo' : 'inativo';` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 472 | `token` | `&lt;td style="text-align: center;"&gt;&lt;span class="badge-status ${tokenClass}"&gt;${c.tokenStatus}&lt;/span&gt;&lt;/td&gt;` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 612 | `webhook` | `!OS_CONFIG.flags.sendRealWebhooks` | precisa avaliar |
| [clients.js](os/js/modules/clients.js) | 646 | `webhook` | `!OS_CONFIG.flags.sendRealWebhooks` | precisa avaliar |
| [command-center.js](os/js/modules/command-center.js) | 29 | `token` | `const apisOk = clients.filter(c =&gt; c.tokenStatus === 'ok').length;` | precisa avaliar |
| [command-center.js](os/js/modules/command-center.js) | 30 | `webhook` | `const activeWebhooks = routes.filter(r =&gt; r.status === 'ativa').length;` | precisa avaliar |
| [command-center.js](os/js/modules/command-center.js) | 48 | `token` | `&lt;div class="os-widget-header"&gt;&lt;span class="os-widget-label"&gt;APIs (Tokens OK)&lt;/span&gt;&lt;i class="fa-solid fa-key" style="col` | precisa avaliar |
| [command-center.js](os/js/modules/command-center.js) | 52 | `webhook` | `&lt;div class="os-widget-header"&gt;&lt;span class="os-widget-label"&gt;Webhooks Ativos&lt;/span&gt;&lt;i class="fa-solid fa-network-wired" s` | precisa avaliar |
| [command-center.js](os/js/modules/command-center.js) | 53 | `webhook` | `&lt;div class="os-metric"&gt;&lt;div class="os-metric-value"&gt;${activeWebhooks}&lt;/div&gt;&lt;/div&gt;` | precisa avaliar |
| [logs-view.js](os/js/modules/logs-view.js) | 53 | `webhook` | `action_type: 'WEBHOOK_TRIGGERED',` | precisa avaliar |
| [logs-view.js](os/js/modules/logs-view.js) | 55 | `webhook` | `payload: { webhook_key: "IA_CREDITOS_CONTROLE", data: { client_id: "proj_maria_aparecida", status_ia: "ativo", limite_re` | precisa avaliar |
| [logs-view.js](os/js/modules/logs-view.js) | 105 | `webhook` | `action_type: 'WEBHOOK_ERROR',` | precisa avaliar |
| [logs-view.js](os/js/modules/logs-view.js) | 107 | `webhook` | `payload: { webhook_key: "LEAD_CAPTURE", error: "CORS policies or invalid target URL configuration", target_url: "https:/` | precisa avaliar |
| [logs-view.js](os/js/modules/logs-view.js) | 107 | `hook.us` | `payload: { webhook_key: "LEAD_CAPTURE", error: "CORS policies or invalid target URL configuration", target_url: "https:/` | precisa avaliar |
| [logs-view.js](os/js/modules/logs-view.js) | 168 | `webhook` | `localStorage.removeItem('fluxai_logs_webhooks');` | precisa avaliar |
| [logs-view.js](os/js/modules/logs-view.js) | 185 | `webhook` | `const userActions = INITIAL_TELEMETRY_MOCKS.filter(l =&gt; !['WEBHOOK_TRIGGERED', 'WEBHOOK_ERROR', 'SYSTEM_ERROR', 'SECURIT` | precisa avaliar |
| [logs-view.js](os/js/modules/logs-view.js) | 186 | `webhook` | `const webhooks = INITIAL_TELEMETRY_MOCKS.filter(l =&gt; ['WEBHOOK_TRIGGERED', 'WEBHOOK_ERROR'].includes(l.action_type));` | precisa avaliar |
| [logs-view.js](os/js/modules/logs-view.js) | 191 | `webhook` | `localStorage.setItem('fluxai_logs_webhooks', JSON.stringify(webhooks));` | precisa avaliar |
| [logs-view.js](os/js/modules/logs-view.js) | 207 | `webhook` | `if (category === 'WEBHOOKS') {` | precisa avaliar |
| [logs-view.js](os/js/modules/logs-view.js) | 208 | `webhook` | `return logs.filter(l =&gt; l.action_type === 'WEBHOOK_TRIGGERED' \|\| l.action_type === 'WEBHOOK_ERROR');` | precisa avaliar |
| [logs-view.js](os/js/modules/logs-view.js) | 211 | `webhook` | `return logs.filter(l =&gt; l.severity === 'warning' \|\| l.severity === 'critical' \|\| l.action_type === 'SYSTEM_ERROR' \|\| l.a` | precisa avaliar |
| [logs-view.js](os/js/modules/logs-view.js) | 223 | `webhook` | `return logs.filter(l =&gt; l.action_type === 'WEBHOOK_TRIGGERED' \|\| l.action_type.startsWith('AUTOMATION') \|\| l.source_page` | precisa avaliar |
| [logs-view.js](os/js/modules/logs-view.js) | 268 | `webhook` | `const webhookStr = l.payload && l.payload.webhook_key ? String(l.payload.webhook_key).toLowerCase() : '';` | precisa avaliar |
| [logs-view.js](os/js/modules/logs-view.js) | 275 | `webhook` | `webhookStr.includes(searchVal);` | precisa avaliar |
| [logs-view.js](os/js/modules/logs-view.js) | 292 | `webhook` | `const webhookKey = l.payload && l.payload.webhook_key ? l.payload.webhook_key : (l.action_type.startsWith('WEBHOOK') ? '` | precisa avaliar |
| [logs-view.js](os/js/modules/logs-view.js) | 316 | `webhook` | `&lt;td class="col-webhook" title="${webhookKey}"&gt;${webhookKey}&lt;/td&gt;` | precisa avaliar |
| [logs-view.js](os/js/modules/logs-view.js) | 338 | `webhook` | `document.getElementById('count-webhooks').innerText = filterLogsByCategory(logsData, 'WEBHOOKS').length;` | precisa avaliar |
| [monthly-analysis.js](os/js/modules/monthly-analysis.js) | 115 | `webhook` | `const isReal = OS_CONFIG.flags.sendRealWebhooks \|\|` | precisa avaliar |
| [monthly-analysis.js](os/js/modules/monthly-analysis.js) | 116 | `webhook` | `(Array.isArray(OS_CONFIG.flags.enabledRealWebhooks) && OS_CONFIG.flags.enabledRealWebhooks.includes('REPORT_STATUS_UPDAT` | precisa avaliar |
| [monthly-analysis.js](os/js/modules/monthly-analysis.js) | 118 | `webhook` | `// Disparar webhook de integração real ANTES de qualquer persistência local` | precisa avaliar |
| [monthly-analysis.js](os/js/modules/monthly-analysis.js) | 119 | `webhook` | `const webhookResponse = await OS_CONFIG.webhooks.send('REPORT_STATUS_UPDATE', {` | precisa avaliar |
| [monthly-analysis.js](os/js/modules/monthly-analysis.js) | 125 | `webhook` | `// Se o webhook real falhar, executamos o Rollback Block e cancelamos a transição` | precisa avaliar |
| [monthly-analysis.js](os/js/modules/monthly-analysis.js) | 126 | `webhook` | `if (!webhookResponse.success && isReal) {` | precisa avaliar |
| [monthly-analysis.js](os/js/modules/monthly-analysis.js) | 127 | `webhook` | `console.error('[REPORT_STATUS_UPDATE] Falha no webhook real. Abortando transição.', webhookResponse.error);` | precisa avaliar |
| [monthly-analysis.js](os/js/modules/monthly-analysis.js) | 129 | `webhook` | `// 1. WEBHOOK_REAL_FAILED` | precisa avaliar |
| [monthly-analysis.js](os/js/modules/monthly-analysis.js) | 131 | `webhook` | `'WEBHOOK_REAL_FAILED',` | precisa avaliar |
| [monthly-analysis.js](os/js/modules/monthly-analysis.js) | 133 | `webhook` | `{ webhook: 'REPORT_STATUS_UPDATE', error: webhookResponse.error \|\| 'Erro Desconhecido', status: webhookResponse.status \|` | precisa avaliar |
| [monthly-analysis.js](os/js/modules/monthly-analysis.js) | 143 | `webhook` | `{ action: 'transicao_relatorio_mensal', reason: 'Falha no webhook real de integração', report: reportId },` | precisa avaliar |
| [monthly-analysis.js](os/js/modules/monthly-analysis.js) | 156 | `webhook` | `error: webhookResponse.error,` | precisa avaliar |
| [monthly-analysis.js](os/js/modules/monthly-analysis.js) | 166 | `webhook` | `{ reason: 'Falha na resposta do webhook de relatório', client_id: reportId, preserved_status: currentStatus },` | precisa avaliar |
| [monthly-analysis.js](os/js/modules/monthly-analysis.js) | 182 | `webhook` | `alert(`Falha Crítica de Conexão com o Webhook de Integração:\n\n${webhookResponse.error \|\| 'O servidor retornou erro.'}\` | precisa avaliar |
| [monthly-analysis.js](os/js/modules/monthly-analysis.js) | 206 | `webhook` | `!webhookResponse.success \|\| webhookResponse.simulated` | seguro (dados simulados/mock) |
| [monthly-analysis.js](os/js/modules/monthly-analysis.js) | 209 | `webhook` | `if (isReal && webhookResponse.success) {` | precisa avaliar |
| [monthly-analysis.js](os/js/modules/monthly-analysis.js) | 211 | `webhook` | `'WEBHOOK_REAL_SUCCESS',` | precisa avaliar |
| [monthly-analysis.js](os/js/modules/monthly-analysis.js) | 213 | `webhook` | `{ webhook: 'REPORT_STATUS_UPDATE', response_status: webhookResponse.status \|\| 200 },` | precisa avaliar |
| [operations-center.js](os/js/modules/operations-center.js) | 73 | `webhook` | `// Automações / Falhas de Webhook` | precisa avaliar |
| [operations-center.js](os/js/modules/operations-center.js) | 74 | `webhook` | `const criticalErrors = allLogs.filter(l =&gt; l.severity === 'critical' \|\| l.action_type === 'WEBHOOK_REAL_FAILED');` | precisa avaliar |
| [operations-center.js](os/js/modules/operations-center.js) | 110 | `token` | `let tokenStatusBadge = '&lt;span class="os-badge os-badge-success"&gt;OK&lt;/span&gt;';` | precisa avaliar |
| [operations-center.js](os/js/modules/operations-center.js) | 111 | `token` | `if (p.tokenStatus === 'expirado') tokenStatusBadge = '&lt;span class="os-badge os-badge-danger"&gt;Expirado&lt;/span&gt;';` | precisa avaliar |
| [operations-center.js](os/js/modules/operations-center.js) | 112 | `token` | `else if (p.tokenStatus === 'ausente') tokenStatusBadge = '&lt;span class="os-badge os-badge-neutral"&gt;Ausente&lt;/span&gt;';` | precisa avaliar |
| [operations-center.js](os/js/modules/operations-center.js) | 120 | `token` | `&lt;td&gt;${tokenStatusBadge}&lt;/td&gt;` | precisa avaliar |
| [operations-center.js](os/js/modules/operations-center.js) | 211 | `token` | `link: `approval.html?token=${a.token}`` | precisa avaliar |
| [operations-center.js](os/js/modules/operations-center.js) | 238 | `webhook` | `// --- RENDERIZAR TABELA 4: WEBHOOK ERRORS & ERRORS ---` | precisa avaliar |
| [operations-center.js](os/js/modules/operations-center.js) | 239 | `webhook` | `const tableWebhookErrorsBody = document.querySelector('#table-webhook-errors tbody');` | precisa avaliar |
| [operations-center.js](os/js/modules/operations-center.js) | 240 | `webhook` | `if (tableWebhookErrorsBody) {` | precisa avaliar |
| [operations-center.js](os/js/modules/operations-center.js) | 244 | `webhook` | `const errorLogs = allLogs.filter(l =&gt; l.severity === 'critical' \|\| l.severity === 'warning' \|\| l.action_type === 'WEBHOO` | precisa avaliar |
| [operations-center.js](os/js/modules/operations-center.js) | 247 | `webhook` | `html = '&lt;tr&gt;&lt;td colspan="4" style="text-align:center; padding: 20px; opacity:0.5; color: var(--os-success);"&gt;Nenhum erro` | precisa avaliar |
| [operations-center.js](os/js/modules/operations-center.js) | 270 | `webhook` | `tableWebhookErrorsBody.innerHTML = html;` | precisa avaliar |
| [onboarding.js](os/js/onboarding.js) | 79 | `webhook` | `desc: "Desenvolvimento de fluxos automatizados integrando WhatsApp, Planilhas, CRM e Email. Inclui tratamento de erros, ` | precisa avaliar |
| [onboarding.js](os/js/onboarding.js) | 263 | `senha` | `{ progress: 55, text: `&gt; [GOVERNANÇA] Conta de Portal '${email}' gerada com senha padrão 'fluxai@2026'.` },` | precisa avaliar |
| [onboarding.js](os/js/onboarding.js) | 390 | `webhook` | `// 3. Executar o webhook e provisionamento real` | precisa avaliar |
| [onboarding.js](os/js/onboarding.js) | 399 | `webhook` | `const webhookPayload = {` | precisa avaliar |
| [onboarding.js](os/js/onboarding.js) | 444 | `token` | `tokens: {` | precisa avaliar |
| [onboarding.js](os/js/onboarding.js) | 461 | `webhook` | `OS_LOGS_ENGINE.userAction('ONBOARDING_CREATED', webhookPayload, !OS_CONFIG.flags.sendRealWebhooks);` | precisa avaliar |
| [onboarding.js](os/js/onboarding.js) | 464 | `webhook` | `// Disparar Webhook` | precisa avaliar |
| [onboarding.js](os/js/onboarding.js) | 465 | `webhook` | `const webhookResult = await OS_CONFIG.webhooks.send('CLIENT_ONBOARDING', webhookPayload);` | precisa avaliar |
| [onboarding.js](os/js/onboarding.js) | 466 | `webhook` | `if (!webhookResult.success) {` | precisa avaliar |
| [onboarding.js](os/js/onboarding.js) | 467 | `webhook` | `console.warn('[ONBOARDING] Webhook não enviado ou falhou:', webhookResult.error);` | precisa avaliar |
| [onboarding.js](os/js/onboarding.js) | 680 | `password` | `password: "fluxai@2026",` | precisa avaliar |
| [onboarding.js](os/js/onboarding.js) | 683 | `password` | `needsPasswordChange: true` | precisa avaliar |
| [os-knowledge-core.js](os/js/os-knowledge-core.js) | 263 | `token` | `await _logUsage({ ...context._meta, templateId, model: 'CACHED', tokens: 0, cached: true });` | precisa avaliar |
| [os-knowledge-core.js](os/js/os-knowledge-core.js) | 273 | `api_key` | `const apiKey = localStorage.getItem('openai_api_key');` | precisa avaliar |
| [os-knowledge-core.js](os/js/os-knowledge-core.js) | 281 | `bearer` | `headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },` | precisa avaliar |
| [os-knowledge-core.js](os/js/os-knowledge-core.js) | 288 | `token` | `max_tokens: template.maxTokens \|\| 1200,` | precisa avaliar |
| [os-knowledge-core.js](os/js/os-knowledge-core.js) | 300 | `token` | `const tokensUsed = data.usage?.total_tokens \|\| 0;` | precisa avaliar |
| [os-knowledge-core.js](os/js/os-knowledge-core.js) | 302 | `token` | `const result = { content, model, tokensUsed, templateId };` | precisa avaliar |
| [os-knowledge-core.js](os/js/os-knowledge-core.js) | 311 | `token` | `await _logUsage({ ...context._meta, templateId, model, tokens: tokensUsed, cached: false });` | precisa avaliar |
| [os-knowledge-core.js](os/js/os-knowledge-core.js) | 427 | `token` | `async function _logUsage({ projectId, module, action, templateId, model, tokens, cached }) {` | precisa avaliar |
| [os-knowledge-core.js](os/js/os-knowledge-core.js) | 433 | `token` | `tokens_estimated: tokens,` | precisa avaliar |
| [os-knowledge-core.js](os/js/os-knowledge-core.js) | 434 | `token` | `cost_estimated: _estimateCost(model, tokens),` | precisa avaliar |
| [os-knowledge-core.js](os/js/os-knowledge-core.js) | 453 | `token` | `function _estimateCost(model, tokens) {` | precisa avaliar |
| [os-knowledge-core.js](os/js/os-knowledge-core.js) | 460 | `token` | `return ((rates[model] \|\| 0.000002) * tokens).toFixed(6);` | precisa avaliar |
| [os-prompt-templates.js](os/js/os-prompt-templates.js) | 8 | `token` | `*  - maxTokens     : limite de tokens de saída` | precisa avaliar |
| [os-prompt-templates.js](os/js/os-prompt-templates.js) | 43 | `token` | `maxTokens: 2000,` | precisa avaliar |
| [os-prompt-templates.js](os/js/os-prompt-templates.js) | 83 | `token` | `maxTokens: 1500,` | precisa avaliar |
| [os-prompt-templates.js](os/js/os-prompt-templates.js) | 103 | `token` | `maxTokens: 1000,` | precisa avaliar |
| [os-prompt-templates.js](os/js/os-prompt-templates.js) | 132 | `token` | `maxTokens: 600,` | precisa avaliar |
| [os-prompt-templates.js](os/js/os-prompt-templates.js) | 153 | `token` | `maxTokens: 400,` | precisa avaliar |
| [os-prompt-templates.js](os/js/os-prompt-templates.js) | 173 | `token` | `maxTokens: 250,` | precisa avaliar |
| [os-prompt-templates.js](os/js/os-prompt-templates.js) | 195 | `token` | `maxTokens: 300,` | precisa avaliar |
| [os-prompt-templates.js](os/js/os-prompt-templates.js) | 213 | `token` | `maxTokens: 600,` | precisa avaliar |
| [os-prompt-templates.js](os/js/os-prompt-templates.js) | 232 | `token` | `maxTokens: 1500,` | precisa avaliar |
| [os-prompt-templates.js](os/js/os-prompt-templates.js) | 257 | `token` | `maxTokens: 250,` | precisa avaliar |
| [os-prompt-templates.js](os/js/os-prompt-templates.js) | 280 | `token` | `maxTokens: 400,` | precisa avaliar |
| [os-prompt-templates.js](os/js/os-prompt-templates.js) | 299 | `token` | `maxTokens: 300,` | precisa avaliar |
| [os-prompt-templates.js](os/js/os-prompt-templates.js) | 320 | `token` | `maxTokens: 1200,` | precisa avaliar |
| [os-prompt-templates.js](os/js/os-prompt-templates.js) | 343 | `token` | `maxTokens: 500,` | precisa avaliar |
| [os-prompt-templates.js](os/js/os-prompt-templates.js) | 361 | `token` | `maxTokens: 2000,` | precisa avaliar |
| [os-prompt-templates.js](os/js/os-prompt-templates.js) | 382 | `token` | `maxTokens: 1500,` | precisa avaliar |
| [leads.html](os/leads.html) | 21 | `webhook` | `&lt;p&gt;Leads entrantes processados pelos Webhooks do Make.&lt;/p&gt;` | precisa avaliar |
| [login.html](os/login.html) | 76 | `password` | `&lt;input type="password" id="password" class="form-control" placeholder="••••••••" required style="padding-right: 40px;" /` | seguro (campo de formulário frontend) |
| [login.html](os/login.html) | 77 | `password` | `&lt;i class="fa-solid fa-eye" id="togglePassword" style="position: absolute; right: 15px; color: var(--os-text-muted); curs` | precisa avaliar |
| [login.html](os/login.html) | 89 | `senha` | `&lt;!-- Modal de Redefinição de Senha Obrigatória no Primeiro Acesso --&gt;` | precisa avaliar |
| [login.html](os/login.html) | 90 | `password` | `&lt;div id="passwordResetModal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-fil` | precisa avaliar |
| [login.html](os/login.html) | 97 | `senha` | `&lt;p style="color: var(--os-text-muted); font-size: 0.75rem; margin-top: 8px; line-height: 1.4;"&gt;Por motivos de segurança ` | precisa avaliar |
| [login.html](os/login.html) | 99 | `password` | `&lt;form class="login-form" id="passwordResetForm"&gt;` | precisa avaliar |
| [login.html](os/login.html) | 102 | `senha` | `&lt;label&gt;Nova Senha Pessoal&lt;/label&gt;` | precisa avaliar |
| [login.html](os/login.html) | 103 | `password` | `&lt;input type="password" id="newPassword" class="form-control" placeholder="Mínimo 6 caracteres" required minlength="6" /&gt;` | seguro (campo de formulário frontend) |
| [login.html](os/login.html) | 106 | `senha` | `&lt;label&gt;Confirmar Nova Senha&lt;/label&gt;` | precisa avaliar |
| [login.html](os/login.html) | 107 | `password` | `&lt;input type="password" id="confirmNewPassword" class="form-control" placeholder="••••••••" required minlength="6" /&gt;` | seguro (campo de formulário frontend) |
| [login.html](os/login.html) | 133 | `password` | `{ id: 'u1', full_name: 'Admin FluxAI', email: 'admin@fluxai.com', passwordHash: 'fe79d404866023dfaed7035f13a194e77c3f186` | precisa avaliar |
| [login.html](os/login.html) | 134 | `password` | `{ id: 'u2', full_name: 'Kassia Gomes', email: 'kassia@fluxai.com', passwordHash: 'fe79d404866023dfaed7035f13a194e77c3f18` | precisa avaliar |
| [login.html](os/login.html) | 135 | `password` | `{ id: 'u3', full_name: 'Maria Aparecida', email: 'maria.nutri@gmail.com', passwordHash: 'fe79d404866023dfaed7035f13a194e` | precisa avaliar |
| [login.html](os/login.html) | 143 | `password` | `const updateMockUserPassword = async (userId, newPassword) =&gt; {` | precisa avaliar |
| [login.html](os/login.html) | 147 | `password` | `mockUsers[index].passwordHash = await sha256(newPassword);` | seguro (dados simulados/mock) |
| [login.html](os/login.html) | 148 | `password` | `delete mockUsers[index].password; // remove plain text legacy if any` | seguro (dados simulados/mock) |
| [login.html](os/login.html) | 149 | `password` | `mockUsers[index].needsPasswordChange = false;` | seguro (dados simulados/mock) |
| [login.html](os/login.html) | 165 | `password` | `const password = document.getElementById('password').value.trim();` | precisa avaliar |
| [login.html](os/login.html) | 176 | `password` | `const enteredHash = await sha256(password);` | precisa avaliar |
| [login.html](os/login.html) | 177 | `password` | `const isPasswordValid = localUser.passwordHash` | precisa avaliar |
| [login.html](os/login.html) | 178 | `password` | `? localUser.passwordHash === enteredHash` | precisa avaliar |
| [login.html](os/login.html) | 179 | `password` | `: localUser.password === password;` | precisa avaliar |
| [login.html](os/login.html) | 181 | `password` | `if (isPasswordValid) {` | precisa avaliar |
| [login.html](os/login.html) | 182 | `password` | `if (localUser.needsPasswordChange) {` | precisa avaliar |
| [login.html](os/login.html) | 185 | `password` | `document.getElementById('passwordResetModal').style.display = 'flex';` | precisa avaliar |
| [login.html](os/login.html) | 199 | `senha` | `OS_LOGS_ENGINE.security('SECURITY_ACCESS_DENIED', { email, reason: 'Senha mock incorreta' }, 'warning');` | seguro (dados simulados/mock) |
| [login.html](os/login.html) | 219 | `password` | `const { data, error } = await supabase.auth.signInWithPassword({` | precisa avaliar |
| [login.html](os/login.html) | 221 | `password` | `password: password` | precisa avaliar |
| [login.html](os/login.html) | 292 | `senha` | `// Submissão do formulário de redefinição de senha` | precisa avaliar |
| [login.html](os/login.html) | 293 | `password` | `document.getElementById('passwordResetForm').addEventListener('submit', async (e) =&gt; {` | precisa avaliar |
| [login.html](os/login.html) | 296 | `password` | `const newPassword = document.getElementById('newPassword').value;` | precisa avaliar |
| [login.html](os/login.html) | 297 | `password` | `const confirmNewPassword = document.getElementById('confirmNewPassword').value;` | precisa avaliar |
| [login.html](os/login.html) | 299 | `password` | `if (newPassword !== confirmNewPassword) {` | precisa avaliar |
| [login.html](os/login.html) | 300 | `senha` | `alert('As senhas não coincidem. Digite novamente.');` | precisa avaliar |
| [login.html](os/login.html) | 304 | `password` | `if (newPassword === 'fluxai@2026') {` | precisa avaliar |
| [login.html](os/login.html) | 305 | `senha` | `alert('Por favor, escolha uma senha diferente da padrão provisória.');` | precisa avaliar |
| [login.html](os/login.html) | 309 | `password` | `const updatedUser = await updateMockUserPassword(userId, newPassword);` | precisa avaliar |
| [login.html](os/login.html) | 312 | `password` | `document.getElementById('passwordResetModal').style.display = 'none';` | precisa avaliar |
| [login.html](os/login.html) | 315 | `senha` | `alert('Erro ao atualizar senha local.');` | precisa avaliar |
| [login.html](os/login.html) | 319 | `senha` | `// Lógica do Olho para mostrar/ocultar senha` | precisa avaliar |
| [login.html](os/login.html) | 320 | `password` | `const togglePassword = document.getElementById('togglePassword');` | precisa avaliar |
| [login.html](os/login.html) | 321 | `password` | `const passwordInput = document.getElementById('password');` | precisa avaliar |
| [login.html](os/login.html) | 322 | `password` | `if (togglePassword && passwordInput) {` | precisa avaliar |
| [login.html](os/login.html) | 323 | `password` | `togglePassword.addEventListener('click', function () {` | precisa avaliar |
| [login.html](os/login.html) | 324 | `password` | `const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';` | precisa avaliar |
| [login.html](os/login.html) | 325 | `password` | `passwordInput.setAttribute('type', type);` | precisa avaliar |
| [logs.html](os/logs.html) | 297 | `webhook` | `.col-webhook {` | precisa avaliar |
| [logs.html](os/logs.html) | 472 | `webhook` | `&lt;button class="filter-tab" data-filter="WEBHOOKS"&gt;Webhooks &lt;span class="badge-count" id="count-webhooks"&gt;0&lt;/span&gt;&lt;/butto` | precisa avaliar |
| [logs.html](os/logs.html) | 529 | `webhook` | `&lt;th style="width: 140px;"&gt;Webhook&lt;/th&gt;` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 172 | `api_key` | `const currentKey = localStorage.getItem('openai_api_key') \|\| '';` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 176 | `api_key` | `localStorage.removeItem('openai_api_key');` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 179 | `api_key` | `localStorage.setItem('openai_api_key', newKey.trim());` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 798 | `webhook` | `// Determinar webhook PLANEJAMENTO_CONTEUDO ou CALENDARIO_POSTAGENS` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 801 | `webhook` | `const webhookKey = isPlanning ? 'PLANEJAMENTO_CONTEUDO' : 'CALENDARIO_POSTAGENS';` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 813 | `webhook` | `const response = await OS_CONFIG.webhooks.send(webhookKey, payload);` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 814 | `webhook` | `const isWebhookReal = (OS_CONFIG.flags.sendRealWebhooks \|\|` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 815 | `webhook` | `(Array.isArray(OS_CONFIG.flags.enabledRealWebhooks) && OS_CONFIG.flags.enabledRealWebhooks.includes(webhookKey))) &&` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 816 | `webhook` | `OS_CONFIG.webhooks._isConfigured(webhookKey);` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 821 | `webhook` | `'WEBHOOK_REAL_FAILED',` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 823 | `webhook` | `{ webhook: webhookKey, error: response.error \|\| 'Erro Desconhecido', status: response.status \|\| 0 },` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 832 | `webhook` | `{ action: 'salvar_edicao_status', reason: 'Falha no webhook real de integração', asset_id: editingAssetId },` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 855 | `webhook` | `reason: 'Falha na resposta do webhook de transição de status',` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 879 | `webhook` | `alert('Erro de conexão com o Webhook. Transição abortada e estado anterior mantido.');` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 883 | `webhook` | `// Webhook real success` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 885 | `webhook` | `'WEBHOOK_REAL_SUCCESS',` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 887 | `webhook` | `{ webhook: webhookKey, status: response.status \|\| 200 },` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 890 | `webhook` | `!isWebhookReal` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 901 | `webhook` | `!isWebhookReal` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 910 | `webhook` | `!isWebhookReal` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 919 | `webhook` | `!isWebhookReal` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 927 | `webhook` | `!isWebhookReal` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 937 | `webhook` | `!isWebhookReal` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1149 | `webhook` | `// Disparar webhook de controle de IA` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1162 | `webhook` | `const response = await OS_CONFIG.webhooks.send('AI_OPERATIONAL_CONTROL', payload);` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1165 | `webhook` | `// WEBHOOK_REAL_FAILED` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1167 | `webhook` | `'WEBHOOK_REAL_FAILED',` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1169 | `webhook` | `{ webhook: 'AI_OPERATIONAL_CONTROL', error: response.error \|\| 'Erro Desconhecido', status: response.status \|\| 0 },` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1179 | `webhook` | `{ action: 'aprovacao_ia', reason: 'Falha no webhook real de integração', asset_id: id },` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1204 | `webhook` | `reason: 'Falha na resposta do webhook de aprovação',` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1229 | `webhook` | `alert('Erro de conexão com o Make/Webhook. Aprovação abortada e estado anterior mantido.');` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1257 | `webhook` | `!OS_CONFIG.flags.sendRealWebhooks` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1266 | `webhook` | `!OS_CONFIG.flags.sendRealWebhooks` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1270 | `webhook` | `'WEBHOOK_REAL_SUCCESS',` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1272 | `webhook` | `{ webhook: 'AI_OPERATIONAL_CONTROL', status: response.status \|\| 200 },` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1275 | `webhook` | `!OS_CONFIG.flags.sendRealWebhooks` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1331 | `webhook` | `// Enviar webhook de controle operacional de IA` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1344 | `webhook` | `const response = await OS_CONFIG.webhooks.send('AI_OPERATIONAL_CONTROL', payload);` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1347 | `webhook` | `// WEBHOOK_REAL_FAILED` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1349 | `webhook` | `'WEBHOOK_REAL_FAILED',` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1351 | `webhook` | `{ webhook: 'AI_OPERATIONAL_CONTROL', error: response.error \|\| 'Erro Desconhecido', status: response.status \|\| 0 },` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1361 | `webhook` | `{ action: 'descarte_ia', reason: 'Falha no webhook real de integração', asset_id: id },` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1386 | `webhook` | `reason: 'Falha na resposta do webhook de descarte',` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1411 | `webhook` | `alert('Erro de conexão com o Make/Webhook. Descarte abortado e estado anterior mantido.');` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1437 | `webhook` | `!OS_CONFIG.flags.sendRealWebhooks` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1447 | `webhook` | `!OS_CONFIG.flags.sendRealWebhooks` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1457 | `webhook` | `!OS_CONFIG.flags.sendRealWebhooks` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1461 | `webhook` | `'WEBHOOK_REAL_SUCCESS',` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1463 | `webhook` | `{ webhook: 'AI_OPERATIONAL_CONTROL', status: response.status \|\| 200 },` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1466 | `webhook` | `!OS_CONFIG.flags.sendRealWebhooks` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1513 | `webhook` | `// Webhook de controle operacional de IA` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1530 | `webhook` | `const response = await OS_CONFIG.webhooks.send('AI_OPERATIONAL_CONTROL', payload);` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1533 | `webhook` | `// WEBHOOK_REAL_FAILED` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1535 | `webhook` | `'WEBHOOK_REAL_FAILED',` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1537 | `webhook` | `{ webhook: 'AI_OPERATIONAL_CONTROL', error: response.error \|\| 'Erro Desconhecido', status: response.status \|\| 0 },` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1547 | `webhook` | `{ action: 'geracao_ia_rascunho', reason: 'Falha no webhook real de integração', client_id: selectedId },` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1571 | `webhook` | `reason: 'Falha na resposta do webhook de criação de IA',` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1594 | `webhook` | `alert('Erro de conexão com o Make/Webhook. Geração abortada e estado anterior mantido.');` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1621 | `webhook` | `!OS_CONFIG.flags.sendRealWebhooks` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1625 | `webhook` | `'WEBHOOK_REAL_SUCCESS',` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1627 | `webhook` | `{ webhook: 'AI_OPERATIONAL_CONTROL', status: response.status \|\| 200 },` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1630 | `webhook` | `!OS_CONFIG.flags.sendRealWebhooks` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1742 | `webhook` | `btnConfirm.innerHTML = '&lt;i class="fa-solid fa-spinner fa-spin"&gt;&lt;/i&gt; ENVIANDO WEBHOOK...';` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1749 | `webhook` | `// Disparar webhook` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1762 | `webhook` | `const response = await OS_CONFIG.webhooks.send('AI_OPERATIONAL_CONTROL', payload);` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1765 | `webhook` | `// WEBHOOK_REAL_FAILED` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1767 | `webhook` | `'WEBHOOK_REAL_FAILED',` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1769 | `webhook` | `{ webhook: 'AI_OPERATIONAL_CONTROL', error: response.error \|\| 'Erro Desconhecido', status: response.status \|\| 0 },` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1779 | `webhook` | `{ action: 'publicacao_ia', reason: 'Falha no webhook real de integração', asset_id: id },` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1804 | `webhook` | `reason: 'Falha na resposta do webhook de publicação',` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1829 | `webhook` | `alert('Erro de conexão com o Make/Webhook. Publicação abortada e estado anterior mantido.');` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1858 | `webhook` | `!OS_CONFIG.flags.sendRealWebhooks` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1867 | `webhook` | `!OS_CONFIG.flags.sendRealWebhooks` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1871 | `webhook` | `'WEBHOOK_REAL_SUCCESS',` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1873 | `webhook` | `{ webhook: 'AI_OPERATIONAL_CONTROL', status: response.status \|\| 200 },` | precisa avaliar |
| [content-engine.js](os/modules/content-engine/content-engine.js) | 1876 | `webhook` | `!OS_CONFIG.flags.sendRealWebhooks` | precisa avaliar |
| [operations-center.html](os/operations-center.html) | 149 | `webhook` | `&lt;!-- SEÇÃO 4: FALHAS DE WEBHOOK E ALERTAS CRÍTICOS --&gt;` | precisa avaliar |
| [operations-center.html](os/operations-center.html) | 156 | `webhook` | `&lt;table class="os-table" id="table-webhook-errors"&gt;` | precisa avaliar |
| [ai-planner.js](os/services/ai-planner.js) | 166 | `webhook` | `if (!integrations.includes("CRM")) automations.push("Conexão entre formulários web e CRM via Webhook");` | precisa avaliar |
| [ai-planner.js](os/services/ai-planner.js) | 269 | `api_key` | `const openAiKey = localStorage.getItem('openai_api_key');` | precisa avaliar |
| [api.js](os/services/api.js) | 18 | `token` | `'Authorization': session.token ? `Bearer ${session.token}` : ''` | precisa avaliar |
| [api.js](os/services/api.js) | 18 | `bearer` | `'Authorization': session.token ? `Bearer ${session.token}` : ''` | precisa avaliar |
| [capture.js](os/services/capture.js) | 60 | `webhook` | `OS_LOGS_ENGINE.userAction('LEAD_CAPTURED', payloadMake, !OS_CONFIG.flags.sendRealWebhooks);` | precisa avaliar |
| [capture.js](os/services/capture.js) | 62 | `webhook` | `// Enviar via hub de webhooks centralizado` | precisa avaliar |
| [capture.js](os/services/capture.js) | 63 | `webhook` | `const result = await OS_CONFIG.webhooks.send('LEAD_CAPTURE', payloadMake);` | precisa avaliar |
| [logs-engine.js](os/services/logs-engine.js) | 27 | `webhook` | `// Webhooks` | precisa avaliar |
| [logs-engine.js](os/services/logs-engine.js) | 28 | `webhook` | `WEBHOOK_TRIGGERED: 'WEBHOOK_TRIGGERED',` | precisa avaliar |
| [logs-engine.js](os/services/logs-engine.js) | 29 | `webhook` | `WEBHOOK_ERROR: 'WEBHOOK_ERROR',` | precisa avaliar |
| [logs-engine.js](os/services/logs-engine.js) | 55 | `webhook` | `WEBHOOKS: 'fluxai_logs_webhooks',` | precisa avaliar |
| [logs-engine.js](os/services/logs-engine.js) | 159 | `webhook` | `webhook: (webhookKey, payload, success, responseStatus = 200, errMessage = null, simulated = true) =&gt; {` | seguro (dados simulados/mock) |
| [logs-engine.js](os/services/logs-engine.js) | 160 | `webhook` | `const eventType = success ? EVENT_TYPES.WEBHOOK_TRIGGERED : EVENT_TYPES.WEBHOOK_ERROR;` | precisa avaliar |
| [logs-engine.js](os/services/logs-engine.js) | 164 | `webhook` | `webhook_key: webhookKey,` | precisa avaliar |
| [logs-engine.js](os/services/logs-engine.js) | 171 | `webhook` | `_saveLog(OPERATION_LOGS_CONFIG.storageKeys.WEBHOOKS, entry);` | precisa avaliar |
| [sheets-adapter.js](os/services/sheets-adapter.js) | 11 | `token` | `tokenStatus: row.token_auth_status,` | precisa avaliar |
| [supabase-client.js](os/services/supabase-client.js) | 6 | `secret` | `import { SUPABASE_CONFIG } from '../config/secrets/supabase-keys.js';` | precisa avaliar |
| [interface.css](os/styles/interface.css) | 4 | `token` | `* ║  Versão: 2.1.0 \| Único arquivo de tokens e utilitários base     ║` | precisa avaliar |
| [interface.css](os/styles/interface.css) | 14 | `token` | `CAMADA 1 — TOKENS PRIMITIVOS` | precisa avaliar |
| [supabase_schema.sql](os/supabase_schema.sql) | 281 | `token` | `tokens_estimated INTEGER DEFAULT 0,` | precisa avaliar |
| [govos.html](pages/govos.html) | 41 | `senha` | `&lt;p style="margin-bottom: 20px;"&gt;Desde intranets de inteligência a CRMs desenhados sob medida e ambientes de portal custo` | precisa avaliar |
| [README.md](README.md) | 7 | `senha` | `O FluxAI OS foi desenhado para ser **ultra rápido**, leve e escalável.` | precisa avaliar |
| [README.md](README.md) | 11 | `webhook` | `*   **Backend / Automação:** Orquestrado via **Make.com (Integromat)** através de Webhooks.` | precisa avaliar |
| [README.md](README.md) | 27 | `token` | `│   ├── styles/         # CSS System e Tokens Globais` | precisa avaliar |
| [README.md](README.md) | 61 | `senha` | `*   **Senhas e Chaves:** Nunca faça commit de senhas no código fonte. Todos os acessos de API e chaves do Supabase devem` | precisa avaliar |
| [README.md](README.md) | 61 | `secret` | `*   **Senhas e Chaves:** Nunca faça commit de senhas no código fonte. Todos os acessos de API e chaves do Supabase devem` | precisa avaliar |
| [README.md](README.md) | 69 | `webhook` | `O FluxAI OS atua de forma passiva-agressiva com o Make.com. O frontend dispara intenções (POST Webhooks) e o Make orques` | precisa avaliar |
| [README.md](README.md) | 71 | `webhook` | `Para visualizar o Payload exato necessário para configurar novos Webhooks, acesse a documentação da API fornecida nos ma` | precisa avaliar |
| [README.md](README.md) | 87 | `token` | `- Rotas pausadas ou com token ausente geram alertas críticos no Command Center.` | precisa avaliar |
| [README.md](README.md) | 93 | `token` | `2. **Onboarding Operacional** (Wizard local com preenchimento de Dados, Serviços, Tokens, Pastas do Drive e Estratégia)` | precisa avaliar |
| [README.md](README.md) | 96 | `webhook` | `5. **Integração Real (Futura)** (O Webhook envia ao Make, que popula o Google Sheets)` | precisa avaliar |
| [integrations.js](src/config/integrations.js) | 5 | `webhook` | `webhookUrl: "https://hook.us2.make.com/bnm7xedyxhxdlvh417gone7gy5m4e8me"` | precisa avaliar |
| [integrations.js](src/config/integrations.js) | 5 | `hook.us` | `webhookUrl: "https://hook.us2.make.com/bnm7xedyxhxdlvh417gone7gy5m4e8me"` | precisa avaliar |
| [script.js](src/scripts/script.js) | 187 | `webhook` | `// 8. DIAGNOSTICO FORM (WEBHOOK + WHATSAPP REDIRECT)` | precisa avaliar |
| [script.js](src/scripts/script.js) | 212 | `webhook` | `const WEBHOOK_URL = INTEGRATIONS.webhookUrl;` | precisa avaliar |
| [script.js](src/scripts/script.js) | 234 | `webhook` | `if(WEBHOOK_URL) {` | precisa avaliar |
| [script.js](src/scripts/script.js) | 236 | `webhook` | `await fetch(WEBHOOK_URL, {` | precisa avaliar |
| [script.js](src/scripts/script.js) | 243 | `webhook` | `console.error("Erro ao enviar para webhook, redirecionando para WhatsApp...", error);` | precisa avaliar |
