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

## 🔗 Integração com Make.com (Proxy Seguro)

O FluxAI OS atua de forma passiva-agressiva com o Make.com. O frontend dispara intenções para os nossos **Edge Functions (Vercel)** na pasta `/api/`, que atuam como um Proxy Seguro (escondendo as URLs reais), e então repassam os dados para os Webhooks do Make. O Make orquestra os dados entre Google Sheets, Slack, Meta Ads e CRM.

Para visualizar o Payload exato necessário para configurar novos Webhooks, acesse a documentação da API fornecida nos manuais de entrega.

---

## 🧠 Camada Operacional: Make + Google Sheets + FluxAI OS™

O FluxAI OS™ agora atua como uma **interface de comando real** (Command Center).

**Fluxo Operacional:**
1. **Make.com:** Coleta demandas, leads, métricas diárias (GA4, Meta, Instagram) e status de rotas.
2. **Google Sheets:** Funciona como nosso banco de dados relacional intermediário (tabelas como `CLIENTES_CONFIG`, `DEMANDAS_CLIENTES`, etc).
3. **FluxAI OS™:** Lê, formata e exibe essas informações. Não há gravação direta pesada no frontend, toda a inteligência e lógica ficam no Sheets e Make.

**Regras de Governança Operacional:**
- Nenhum relatório mensal é enviado automaticamente ao cliente. Eles nascem como `rascunho` e passam por aprovação interna.
- Clientes com coleta manual geram alertas e pendências operacionais.
- Rotas pausadas ou com token ausente geram alertas críticos no Command Center.
- A comunicação entre o OS e o Make/Sheets ocorre estritamente pelos adaptadores na pasta `/os/services/` (`makeClient.js` e `makeRoutes.js`).

**Fluxo de Novo Cliente (Onboarding):**
O onboarding não salva mídias (imagens, PDFs) nativamente no banco (Supabase) nesta fase. Tudo funciona via referências do Google Drive para manter o servidor ágil e leve.
1. **Novo Cliente** (Sidebar > Operação Make > Novo Cliente)
2. **Onboarding Operacional** (Wizard local com preenchimento de Dados, Serviços, Tokens, Pastas do Drive e Estratégia)
3. **Revisão e Geração de Payload** (O OS formata a matriz pronta para as abas do Sheets)
4. **Ativar Cliente** (O cliente entra como pendente nos mocks locais e aguarda sincronização)
5. **Integração Real (Futura)** (O Webhook envia ao Make, que popula o Google Sheets)
6. **Operação Ativa** (Make passa a varrer as APIs do cliente e enviar o log diário ao OS)

**Camada de Inteligência GPT (Governança e Créditos):**
A API GPT não funciona como banco de dados; ela atua estritamente como *Camada de Inteligência* consumindo o contexto estruturado (Contrato, Serviços Extras, DNA e Métricas).
- **Regras Contratuais:** A IA só pode gerar pautas e relatórios se houver *Crédito de IA* disponível e o cliente possuir o serviço ativo.
- **Serviços Extras:** A aquisição de serviços avulsos (Catálogo FluxAI) pode injetar créditos adicionais e alterar a permissão da IA para criar landing pages ou pacotes de reels.
- **Isolamento de Papéis:** O **Cliente** pode apenas *solicitar orçamentos* via Portal. Ele **não pode** gerar IA diretamente, nem visualizar prompts, nem alterar o escopo. A geração, aprovação e exclusão de rascunhos são de exclusividade do **Operador FluxAI**. Tudo nasce como `rascunho` e passa por revisão técnica.
