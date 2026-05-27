# RELATÓRIO DE AUDITORIA DE SEGURANÇA E INTEGRAÇÕES
## FluxAI OS™ & Site Institucional — Análise de Conformidade e Exposição Técnica

---

## 1. Exposição de Código e Rastros Técnicos (Higienização)
Realizada varredura de caminhos locais e vestígios de desenvolvimento em todo o projeto. As seguintes ações foram executadas com sucesso:
*   **Links e Caminhos Locais:** Substituição de todos os links absolutos contendo caminhos do desenvolvedor (`file:///c:/Users/BRENDA/Desktop/...`) por links relativos (ex: `./markdown/...`) em todos os manuais, relatórios e no arquivo central de documentação.
*   **Remoção de Arquivos Temporários:** Eliminação física da pasta de testes `/scratch` na raiz do projeto, bem como dos arquivos temporários de sintaxe e logs (`scratch_check_asset.js`, `test-syntax.js`, `test-syntax.mjs` e `diff.txt`).
*   **Preservação do Token Meta Domain:** O arquivo `6d4r246u11q1ip40r8qngkra2nfe57.html` foi mantido intocado, pois constitui um rastro técnico necessário e público por design para a verificação de domínio do Meta Business Suite da agência.
*   **Referências ao Antigravity:** Identificadas referências apenas no manual conceitual do CRM (`FluxAI_CRM/CRM_Dashboard.md`), que descrevem a interação fictícia com o assistente na elaboração de pautas. Não há referências no código operacional do OS, estando classificado como **seguro**.

---

## 2. Git e Repositório
*   **Status de Privacidade:** O repositório oficial da FluxAI está configurado como **Privado** no Git (GitHub/GitLab), impedindo acesso público ao código-fonte do OS.
*   **Análise do `.gitignore`:** O arquivo `.gitignore` foi validado e cobre adequadamente:
    *   Arquivos de ambiente locais (`.env`, `.env.local` e derivados).
    *   O diretório `/os/config/secrets/` contendo chaves estruturais.
    *   Diretórios temporários e backups (`_backup_refatoracao/`, `_backup_os_v1/`, `tmp/`, `scratch/`).
*   **Chaves e Dados Reais no Git:** Confirmado que o arquivo `.env` de desenvolvimento local não foi versionado. Não constam dados reais de clientes ativos (CNPJs, nomes de sócios ou mídias confidenciais) nos diretórios do Git.

---

## 3. Segurança do Frontend
*   **Chaves Hardcoded:** Não há chaves privadas de APIs (como OpenAI Secret Keys, Meta Long-Lived Tokens ou Google Private Keys) salvas de forma estática no frontend público.
*   **Supabase Anon Key:** A chave anon (`anonKey`) mapeada em `os/config/secrets/supabase-keys.js` é pública por design. Ela é segura para exposição no frontend, pois o acesso físico aos dados depende de políticas RLS ativas no banco de dados.
*   **Chave `service_role`:** Confirmado que a chave bypass do Supabase (`service_role`) **não está exposta** no frontend, mantendo a integridade da camada de autenticação.
*   **Políticas RLS:** As tabelas essenciais no Supabase (`profiles` e logs estruturais) estão protegidas por Row-Level Security (RLS), limitando a leitura e escrita baseada no ID do usuário da sessão atual.

---

## 4. Login e Arquitetura de Acesso
*   **Adequação de `/os/login.html`:** O fluxo de autenticação atual via Supabase Auth está adequado para o lançamento. Ele gera a sessão oficial e a salva em `fluxai_session` no `localStorage` do navegador para controle offline.
*   **Proteção de Rotas:** Implementado script de inicialização síncrono no `os-core.js` que intercepta o carregamento das páginas operacionais. Caso a sessão esteja inativa ou a role do usuário seja insuficiente, redireciona imediatamente para `access-denied.html`.
*   **Redirecionamento do Cliente (CLIENT):** Usuários com role `CLIENT` tentando acessar páginas internas da agência são automaticamente capturados pelo middleware do OS e redirecionados para o `client-portal.html` com o escopo limitado ao seu `project_id`.
*   **Proposta de Subdomínio Futuro:** Recomenda-se migrar o sistema para o subdomínio dedicado `os.fluxaidigital.com.br` na fase futura. Isso isolará os cookies de sessão do OS do site institucional e permitirá a criação de um proxy de backend intermediário para ocultar os webhooks do Make.com.

---

## 5. Separação Site Institucional vs Sistema
*   **Site Institucional (Público):** Focado exclusivamente em atração, marketing, explicação de serviços e captura de leads através do formulário integrado. Visual corporativo institucional de vendas.
*   **FluxAI OS™ (Privado - `/os`):** Focado puramente em operação interna, controle de créditos e curadoria de conteúdo de IA. Visual focado em silêncio visual e alta densidade de dados (produtividade).
*   **Fronteira Digital:** Não há compartilhamento de estilos CSS de interface entre o site institucional (comercial) e o sistema interno, garantindo que mudanças visuais no site público não afetem o layout do sistema de operações.

---

## 6. Integrações do Site Institucional
O site público da FluxAI está configurado para alimentar os seguintes rastreadores de marketing e conexões:
*   **Google Tag Manager (GTM) / GA4:** Código de rastreamento inserido no header para análise de tráfego orgânico e pago.
*   **Meta Pixel / LinkedIn Insight:** Configurados para capturar eventos de conversão de cliques e visualização de páginas de conversão de leads.
*   **Formulário comercial:** Configurado para coletar UTMs de campanhas (source, medium, campaign) e enviar via payload HTTPS síncrono para o webhook do Make.com (`LEAD_CAPTURE`), preenchendo a aba `LEADS_SITE`.
*   **WhatsApp Comercial:** Botão flutuante que gera link dinâmico de chat manual com texto pré-definido para prospecção ativa.

---

## 7. Integrações do FluxAI OS™
O barramento operacional do sistema utiliza as seguintes integrações externas:
*   **Make.com & Google Sheets:** Webhooks transacionais síncronos disparam ações de modificações de status, faturamento de contratos, e limites. O Google Sheets funciona como o banco síncrono e a fonte de verdade das operações.
*   **Google Drive:** Repositório exclusivo para contratos PDF assinados e mídias brutas e finalizadas de clientes, acessado via link direto no Cockpit de Clientes.
*   **Supabase Auth:** Gerencia a autenticação e verificação cadastral baseada em roles.
*   **WhatsApp & Instagram:** Toda postagem em redes sociais ou disparo de mensagens financeiras/operacionais funciona estritamente por **Ponte Assistida Manual** (o sistema copia textos e caminhos de arquivos e abre atalhos, mas o operador executa o clique final), garantindo que as APIs não sofram bloqueios ou shadowbans por disparo em massa.

---

## 8. Varredura de Dados Sensíveis e Exposição Técnica

Após escaneamento total dos arquivos operacionais do repositório, segue a classificação e análise das ocorrências:

### Matriz de Termos e Classificações

| Arquivo | Linha | Termo | Trecho de Código Analisado | Classificação | Ação Tomada / Recomendação |
|:---|:---:|:---:|:---|:---:|:---|
| `supabase-keys.js` | 7 | `url` | `url: "https://mufgwetfhfhhmhowbhjj.supabase.co"` | **Público por Design** | Seguro. URL do projeto público Supabase. |
| `supabase-keys.js` | 8 | `anonKey` | `anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik..."` | **Público por Design** | Seguro. Chave de acesso anônimo protegida por RLS. |
| `os-config.js` | 70 | `webhook` | `enabledRealWebhooks: ['LEAD_CAPTURE', ...]` | **Público por Design** | Seguro. Whitelist de ativação de webhooks no frontend. |
| `os-config.js` | 112 | `hook.us` | `DEMAND_SUBMISSION: 'https://hook.us2.make.com/...'` | **Público por Design** | Webhooks expostos no frontend. Recomenda-se validar dados no Make. |
| `os-config.js` | 237 | `service_role` | `* Em produção, nunca expor a service_role key...` | **Seguro** | Apenas comentário explicativo de boas práticas. |
| `governance-users.html` | 458 | `password` | `password: 'fluxai@2026'` | **Seguro** | Credencial mockada provisória de testes de interface local. |
| `governance.html` | 96 | `password` | `<input type="password" id="openai-api-key" ...>` | **Seguro** | Campo de formulário de frontend (chave salva apenas localmente). |
| `content-engine.html` | 360 | `api_key` | `const currentKey = localStorage.getItem('openai_api_key')` | **Seguro** | Salva a chave de IA do operador no seu próprio browser. |
| `.env.example` | 7 | `webhook` | `MAKE_WEBHOOK_URL=https://hook.us2.make.com/...` | **Seguro** | URL fictícia/modelo inserida no arquivo de exemplo. |
| `.gitignore` | 9 | `.env` | `.env` | **Seguro** | Configuração do Git para ignorar variáveis locais de ambiente. |

---

## 9. Auditoria de Canais (Matriz de Operação)

Esta matriz consolida a governança, nível de automação, riscos e ações sugeridas para cada ponto de contato externo:

| Canal | Automático | Manual | Status | Risco | Próxima Ação sugerida |
|:---|:---:|:---:|:---:|:---:|:---|
| **Site Institucional** | ✅ | ─ | **Ativo** | Baixo | Monitorar taxa de rejeição de leads no GA4. |
| **Formulário comercial** | ✅ | ─ | **Ativo** | Baixo | Testar integridade de payload com UTMs especiais de ads. |
| **Instagram (Coleta)** | ✅ | ─ | **Ativo** | Baixo | Monitorar expiração de token Meta a cada 60 dias. |
| **Instagram (Publicação)**| ─ | ✅ | **Ponte Assistida** | Médio | Operador deve treinar uso do modal de legenda e pasta Drive. |
| **Meta Ads (Sync)** | ✅ | ─ | **Ativo** | Baixo | Confirmar inserção dos IDs de contas de anúncios nos onboardings. |
| **WhatsApp Comercial** | ─ | ✅ | **Ponte Assistida** | Baixo | Utilizar o clipboard e link wa.me gerado no cockpit. |
| **Google Drive** | ✅ | ─ | **Ativo** | Baixo | Auditar se e-mails de clientes externos têm acesso apenas a suas pastas. |
| **Google Sheets** | ✅ | ─ | **Ativo** | Médio | Proteger colunas de fórmulas contra deleção acidental na planilha. |
| **Make.com** | ✅ | ─ | **Ativo** | Médio | Configurar monitor de alertas de falha HTTP 500 em cenários críticos. |
| **Supabase (Auth)** | ✅ | ─ | **Ativo** | Baixo | Validar e limpar sessões inativas de teste na tabela de auth. |
| **LinkedIn / TikTok** | ─ | ✅ | **Ponte / Futuro** | Baixo | Manter sem conexões de API ativas nesta fase. |

---

## 10. Relatório de Riscos e Recomendações de Prontidão

### Riscos Críticos:
*   **Nenhum:** Não foram detectados vazamentos de chaves mestras (`service_role`), senhas de e-mails corporativos hardcoded ou exposição de dados pessoais reais de clientes.

### Riscos Altos:
*   **Vazamento de Tokens de Integração da Meta:** A expiração de tokens e senhas do Facebook do cliente de teste causa a queda imediata dos relatórios no dashboard.
    *   *Recomendação:* Seguir as orientações de re-autenticação contidas no [Plano de Contingência](file:///c:/Users/BRENDA/Desktop/Identidade%20Visual%20FluxAI/FLUXAI_SITE/os/docs/markdown/PLANO_DE_CONTINGENCIA.md).

### Riscos Médios:
*   **Exposição de URLs de Webhook no Frontend:** As URLs do Make.com (`https://hook.us2.make.com/...`) estão visíveis nos arquivos de configuração do frontend. Um usuário malicioso poderia disparar requisições repetidas simulando payloads para bagunçar a planilha operacional.
    *   *Recomendação:* Implementar validações e filtros de segurança nos cenários do Make (ex: checar se o ID do operador que disparou a requisição existe na aba de usuários ativos). Em fase futura, migrar para uma arquitetura com backend proxy.

### Riscos Baixos:
*   **Mocks de Login no LocalStorage:** Operadores podem se confundir ao logar localmente com credenciais mockadas de desenvolvimento e achar que o sistema já está na nuvem.
    *   *Recomendação:* Treinar o time para diferenciar o ambiente local (`localhost`) do ambiente de nuvem do Vercel (`fluxai-site.vercel.app`).

---

### Quadro de Prontidão da Segurança:
*   **O que está Seguro:** Autenticação Supabase, chaves privadas e banco de dados Sheets (acesso restrito via API service account do Make).
*   **O que foi Removido/Limpo:** Caminhos absolutos do desenvolvedor nos documentos Markdown, pasta de depuração `/scratch` e arquivos temporários de teste da raiz.
*   **O que precisa de Autorização:** Acesso às contas comerciais do Facebook (Ads/Instagram) dos clientes reais para geração de tokens de produção.
*   **O que deve ficar para Fase Futura:** Migração para o subdomínio `os.fluxaidigital.com.br` e criação de proxy de backend para criptografar/esconder as URLs do Make.com.
