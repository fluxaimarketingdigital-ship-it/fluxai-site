# FLUXAI OS™ — REGRAS OPERACIONAIS DO SISTEMA
**Versão:** 2.1.0 | **Arquivo:** `FLUXAI_OS_OPERATING_RULES.md`

---

## Missão do FluxAI OS™

O FluxAI OS™ **não é um dashboard**. É uma plataforma de infraestrutura estratégica que centraliza a operação, a inteligência e a entrega da FluxAI para seus clientes.

---

## Regras Absolutas

### R01 — Configuração Centralizada
Toda configuração (webhooks, roles, status, endpoints) vive em `/os/config/os-config.js`.
Nenhum módulo, página ou serviço pode hardcodar esses valores.

### R02 — Design System Único
Nenhuma página pode definir `:root` inline.
Todo token visual vive em `/os/styles/interface.css`.
Toda página operacional usa `body.os-mode`.

### R03 — Autenticação Real
Em produção, o Supabase é o único provedor de autenticação.
Usuários mock existem apenas no ambiente de desenvolvimento (`ENVIRONMENT_CONFIG.isDev`).
O bypass de auth offline está proibido em produção.

### R04 — Senhas Fora do Frontend
Nenhuma senha, service key ou token de serviço pode ser exposto no JavaScript público.
A `anonKey` do Supabase é aceitável. A `service_role` nunca.

### R05 — Escrita via Make, Leitura via OS
O FluxAI OS não escreve diretamente no Google Sheets.
A escrita é feita via Make.com (webhook → Make → Sheets).
A leitura é feita via mock (fase 1) ou API direta (fase 2).

### R06 — Arquivos via Drive
Nenhum arquivo (imagem, PDF, vídeo, contrato) é armazenado no Supabase.
Arquivos pesados vivem no Google Drive.
O OS armazena apenas a URL de referência.

### R07 — Inteligência GPT sob Governança
A API GPT é acionada exclusivamente pelo operador/admin.
O cliente não pode gerar, excluir ou aprovar conteúdo de IA diretamente.
Todo rascunho de IA passa por revisão interna antes de ser disponibilizado.

### R08 — Nenhum Relatório Automático ao Cliente
Relatórios mensais são gerados internamente, revisados e aprovados.
Só após aprovação interna o operador envia ao cliente.
Não há envio automático.

### R09 — Crédito de IA com Rastreabilidade
Rascunho descartado antes da aprovação → sem crédito consumido.
Aprovado internamente → 1 crédito consumido.
Publicado → crédito definitivo (não adicional).
Estorno de crédito aprovado exige confirmação interna da equipe.

### R10 — Isolamento do Portal do Cliente
O cliente acessa apenas o `client-portal.html` com seu `project_id`.
Não vê prompts internos, não vê histórico de operação, não altera configurações.
Pode: solicitar serviço extra, enviar briefing, acompanhar status, aprovar/reprovar entregas.

---

## Fluxo de Dados Padrão

```
CLIENTE SOLICITA (Portal)
        ↓
OS captura e formata payload
        ↓
Webhook → Make.com
        ↓
Make processa e grava no Google Sheets
        ↓
Make notifica o OS via webhook inbound (futuro)
        ↓
OS exibe o status atualizado
```

---

## Ambientes

| Ambiente | mockData | Supabase | Make | GA4/GTM |
|----------|----------|----------|------|---------|
| DEVELOPMENT | `true` | opcional | não | não |
| STAGING | `false` | sim | sim | não |
| PRODUCTION | `false` | sim | sim | sim |

A detecção de ambiente é automática via `ENVIRONMENT_CONFIG` (lê o `hostname`).

---

## Ciclo de Release

1. Desenvolver em branch de feature
2. Testar localmente com `mockData: true`
3. Fazer PR para `staging`
4. Validar com `mockData: false` + Make real
5. Merge para `main` (produção)
