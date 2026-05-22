# FluxAI OS™ - Sistema Operacional de Crescimento

Este é o repositório oficial do FluxAI OS, a infraestrutura centralizada para agências e consultorias High-Ticket gerenciarem operações de Marketing, CRM, Automação e Financeiro de seus clientes.

## 🏗 Arquitetura do Sistema

O FluxAI OS foi desenhado para ser **ultra rápido**, leve e escalável. 
Para isso, não utilizamos frameworks pesados no Frontend (como React ou Angular). Toda a aplicação roda em **Vanilla JavaScript ES6** emparelhado com CSS puro, entregando performance instantânea.

*   **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6 Modules).
*   **Backend / Automação:** Orquestrado via **Make.com (Integromat)** através de Webhooks.
*   **Banco de Dados / Auth:** **Supabase** (PostgreSQL + Autenticação nativa).
*   **Hospedagem:** **Vercel** (Edge CDN para carregamento em milissegundos).

---

## 📂 Estrutura de Pastas

```text
/
├── os/                 # Diretório Core do Sistema Operacional
│   ├── assets/         # Imagens, Logos e Mídias
│   ├── config/         # Configurações sensíveis e Variáveis de Ambiente
│   ├── data/           # Dados de Mocks (apenas para testes)
│   ├── js/             # Lógica de Interface, Estado (os-core.js, os-state.js)
│   ├── services/       # Clientes de APIs externas (Supabase, Make)
│   ├── styles/         # CSS System e Tokens Globais
│   └── *.html          # Módulos / Telas da Plataforma (ex: analytics.html)
└── README.md           # Você está aqui!
```

---

## 🚀 Como Rodar Localmente

Por ser um sistema estático/vanilla, rodar localmente é extremamente simples e não exige compilação (build).

### Pré-requisitos
* Ter o [Node.js](https://nodejs.org/) instalado (apenas para rodar um servidor HTTP rápido).
* Ter o [Git](https://git-scm.com/) instalado.

### Comandos de Inicialização

1. Clone o repositório:
```bash
git clone https://github.com/fluxaimarketingdigital-ship-it/fluxai-site.git
cd fluxai-site
```

2. Inicialize um servidor local (Você pode usar o npx ou Live Server):
```bash
npx serve .
```

3. Abra o navegador no endereço `http://localhost:3000` e navegue até a pasta `/os/`.

---

## 🔒 Governança e Segurança

*   **Senhas e Chaves:** Nunca faça commit de senhas no código fonte. Todos os acessos de API e chaves do Supabase devem ficar na pasta `os/config/secrets/`, que está sumariamente ignorada pelo `.gitignore`.
*   **LGPD:** O sistema está em conformidade com as exigências da LGPD. Todos os leads e clientes possuem telas de consentimento e termos de serviço em `os/termos-de-uso.html`.
*   **RBAC (Role Based Access Control):** A segurança de rotas é feita via script (`OS_AUTH`). Um usuário CLIENT jamais conseguirá renderizar a sidebar de ADMIN, e todas as chamadas de banco de dados possuem RLS (Row Level Security) ativado direto no PostgreSQL do Supabase.

---

## 🔗 Integração com Make.com

O FluxAI OS atua de forma passiva-agressiva com o Make.com. O frontend dispara intenções (POST Webhooks) e o Make orquestra os dados entre Google Sheets, Slack, Meta Ads e CRM.

Para visualizar o Payload exato necessário para configurar novos Webhooks, acesse a documentação da API fornecida nos manuais de entrega.
