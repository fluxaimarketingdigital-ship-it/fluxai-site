# MAPA DE AUTORIZACOES E INTEGRACOES — FluxAI OS™
## Painel de Conexões Externas e Credenciais

---

## 1. Visão Geral das Integrações
Para funcionar como a central única de controle e monitoramento, o **FluxAI OS™** conecta-se a diversas APIs e serviços externos. Este mapa categoriza e reporta o status de cada conexão de acordo com a classificação de prontidão.

### Classificação de Status:
*   **API Ativa:** Token e credenciais configurados, comunicando perfeitamente.
*   **Manual:** Sem API direta, processo realizado por ponte assistida e ação do operador.
*   **Aguardando Autorização:** Configuração física realizada, pendente de aceite ou login pelo cliente.
*   **Não Contratado:** Serviço opcional que não faz parte do pacote do cliente.
*   **Não Aplicável (N/A):** Serviço que não se aplica ao escopo operacional.

---

## 2. Matriz de Integrações e Autorizações

| Serviço / API | Canal de Integração | Responsabilidade | Classificação / Status | Ação Necessária / Onde Configurar |
|:---|:---|:---|:---:|:---|
| **Meta Business Suite** | Graph API via Make.com | Agência / Cliente | **Aguardando Autorização**| Cliente deve conceder acesso à página do Facebook para a agência. |
| **Instagram Business** | Graph API via Make.com | Agência / Cliente | **Aguardando Autorização**| Vincular conta do Instagram à página do Facebook e gerar Token. |
| **Meta Ads** | Marketing API via Make.com | Tráfego Pago (FluxAI) | **Aguardando Autorização**| Inserir o ID da Conta de Anúncios no Onboarding do Cliente. |
| **Google Analytics (GA4)** | Google Analytics Reporting API | Métricas (FluxAI) | **API Ativa** | Preencher a Property ID na planilha de clientes configurados. |
| **Google Search Console** | Google Search Console API | Métricas (FluxAI) | **API Ativa** | Adicionar o e-mail de serviço nas propriedades de domínio do cliente. |
| **Microsoft Clarity** | Código de Rastreamento (Site) | Desenvolvimento / Cliente | **API Ativa** | Inserir o ID do projeto Clarity nas configurações de dados do site. |
| **Google Drive** | Google Drive API via Make | Infraestrutura (FluxAI) | **API Ativa** | Autenticar a conta institucional da FluxAI no console do Make.com. |
| **Google Sheets** | Google Sheets API via Make | Banco de Dados (FluxAI)| **API Ativa** | Planilha compartilhada com a conta do Make.com. |
| **Make.com** | Webhooks e Conexões HTTP | Automações (FluxAI) | **API Ativa** | Configurar chaves no whitelist do arquivo `os-config.js`. |
| **Supabase** | Supabase JS Client (Auth/RLS)| Segurança (FluxAI) | **API Ativa** | Conectar as chaves `SUPABASE_URL` e `SUPABASE_ANON_KEY` no OS. |

---

## 3. Fluxo de Autorização de Clientes (Passo a Passo)

### Autorização de Contas do Google (Analytics, Search Console e Drive)
1.  **Google Analytics 4:** O cliente acessa seu console do GA4, vai em *Administrador* > *Acesso à Conta* e adiciona o e-mail oficial da FluxAI (`analytics@fluxaidigital.com.br`) como "Leitor".
2.  **Google Search Console:** O cliente acessa as configurações da propriedade, vai em *Usuários e Permissões* e adiciona o e-mail oficial da FluxAI como "Usuário Completo" ou "Restrito".
3.  **Google Drive:** A pasta do cliente criada automaticamente pelo Make é compartilhada com o e-mail de atendimento da agência e o e-mail cadastrado pelo cliente na onboarding.

### Autorização da Meta (Instagram, Facebook e Ads)
1.  **Configuração de Parceria:** O cliente adiciona a conta comercial da FluxAI (ID do BM da agência) como parceiro de ativos na página e na conta de anúncios.
2.  **Página do Facebook:** O cliente concede a permissão de "Gerenciar Página" para o parceiro FluxAI.
3.  **Instagram Business:** O perfil do Instagram precisa estar vinculado à página do Facebook para que as APIs do Make possam extrair métricas.
4.  **Meta Ads Account ID:** O operador copia o ID numérico da conta de anúncios do cliente (ex: `act_123456789`) e cola nas configurações do Cockpit do Cliente no OS para ativar o webhook diário de consumo.
