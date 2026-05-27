# MAPA DE PERMISSOES (RBAC) — FluxAI OS™
## Matriz de Controle de Acesso Baseada em Função

---

## 1. Princípios de Segurança
A governança de dados e ações no **FluxAI OS™** é regida pelo controle rígido de perfis (Role-Based Access Control - RBAC). Há três perfis oficiais mapeados no sistema:
1.  **ADMIN:** Administrador com privilégios totais e irrestritos.
2.  **OPERATOR:** Operador interno responsável por gerir a esteira de conteúdo e o relacionamento com o cliente.
3.  **CLIENT:** Usuário externo com privilégios restritos unicamente ao seu portal de projetos.

---

## 2. Matriz Geral de Acessos a Telas

| Tela / Arquivo | ADMIN | OPERATOR | CLIENT | Detalhes / Regras de Negócio |
|:---|:---:|:---:|:---:|:---|
| `login.html` | ✅ | ✅ | ✅ | Tela pública de autenticação via Supabase. |
| `command-center.html` | ✅ | ✅ | ❌ | Dashboard operacional interno. OPERATOR não vê MRR ou finanças. |
| `operations-center.html`| ✅ | ✅ | ❌ | Painel de controle de cotas de IA, erros e relatórios da equipe. |
| `executive-center.html` | ✅ | ❌ | ❌ | Restrito ao ADMIN. Contém dados de faturamento, CRM de leads e MRR. |
| `clientes.html` | ✅ | ✅ | ❌ | Lista geral de clientes da agência. |
| `cliente-detalhe.html` | ✅ | ✅ | ❌ | Painel com dados e status de um cliente selecionado. |
| `demandas.html` | ✅ | ✅ | ❌ | Painel interno de acompanhamento e delegação de tarefas. |
| `content-engine.html` | ✅ | ✅ | ❌ | Painel de controle e geração de conteúdo assistido por IA. |
| `flux-calendar.html` | ✅ | ✅ | ❌ | Calendário de agendamento de posts e publicações. |
| `metricas.html` | ✅ | ✅ | ❌ | Dashboard técnico de tráfego, anúncios e engajamento. |
| `relatorio-mensal.html` | ✅ | ✅ | ❌ | Tela de compilação qualitativa e liberação de relatórios mensais. |
| `client-portal.html` | ✅ | ✅* | ✅ | Portal do cliente. *Operadores acessam apenas para visualização. |
| `logs.html` | ✅ | ✅ | ❌ | Histórico operacional de ações, erros de webhooks e alertas. |
| `governance-users.html`| ✅ | ❌ | ❌ | Restrito ao ADMIN. Gerenciamento cadastral de usuários e roles. |
| `governance.html` | ✅ | ❌ | ❌ | Restrito ao ADMIN. Configurações de webhooks, chaves de API e flags. |

---

## 3. Matriz Detalhada de Ações e Privilégios

### Gestão Cadastral e Financeira
*   **Cadastrar Novos Clientes / Onboarding:** `ADMIN` e `OPERATOR`
*   **Editar Contratos / Visualizar PDF de Contrato:** Apenas `ADMIN`
*   **Visualizar MRR, Faturamento e Forecast:** Apenas `ADMIN`
*   **Visualizar Inadimplência e CAC:** Apenas `ADMIN`
*   **Disparar Mensagens de Cobrança Assistida:** `ADMIN` e `OPERATOR` (comercial/atendimento)

### Gestão de Demandas e Projetos
*   **Criar Pauta de Demandas:** `ADMIN`, `OPERATOR` e `CLIENT` (solicitação via portal)
*   **Alterar Status de Demandas:** `ADMIN` e `OPERATOR`
*   **Deletar Demandas:** Apenas `ADMIN`
*   **Solicitar Serviço Extra:** `ADMIN`, `OPERATOR` e `CLIENT`
*   **Aprovar Orçamento de Serviço Extra:** `ADMIN` e `CLIENT` (cliente aceita ou recusa orçamento)
*   **Definir Preço de Serviço Extra:** Apenas `ADMIN`

### Motor de Conteúdo e IA
*   **Gerar Posts via IA (GPT-4):** `ADMIN` e `OPERATOR`
*   **Alterar Prompt do DNA do Cliente:** `ADMIN` e `OPERATOR`
*   **Aprovar Post Internamente (cota reservada):** `ADMIN` e `OPERATOR`
*   **Descartar Post (cota liberada):** `ADMIN` e `OPERATOR`
*   **Aprovar Post Disponibilizado:** `CLIENT` (ou `ADMIN`/`OPERATOR` em caso de alinhamento manual)
*   **Confirmar Publicação Manual Assistida:** `ADMIN` e `OPERATOR`
*   **Editar Legendas de Posts:** `ADMIN` e `OPERATOR`

### Governança e Auditoria
*   **Criar/Editar Usuários do Sistema:** Apenas `ADMIN`
*   **Alterar Roles/Permissões no Supabase:** Apenas `ADMIN`
*   **Modificar Chaves de APIs / Integrações:** Apenas `ADMIN`
*   **Limpar Histórico de Logs de Auditoria:** Apenas `ADMIN`
*   **Forçar Reenvio de Webhooks com Falha (Rollback):** Apenas `ADMIN`

---

## 4. Tratamento de Acesso Negado
Toda tentativa de navegação direta para uma URL não autorizada (ex: operador tentando digitar a URL do `executive-center.html`) dispara as seguintes medidas de segurança:
1.  **Redirecionamento Imediato:** O script de verificação na inicialização redireciona o navegador do usuário para a página `access-denied.html`.
2.  **Registro de Log de Segurança:** O sistema emite automaticamente um log com a chave `SECURITY_ACCESS_DENIED`, detalhando o e-mail do usuário logado, o IP/origem e a rota bloqueada que tentou acessar.
3.  **Bloqueio de Sessão (Repetição):** Se um usuário persistir em tentar acessar recursos restritos, o log gerará um alerta visual em destaque na tela de monitoramento do ADMIN.
