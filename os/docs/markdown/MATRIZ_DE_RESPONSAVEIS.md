# MATRIZ DE RESPONSAVEIS — FluxAI OS™
## Atribuição de Papéis Operacionais e Matriz RACI

---

## 1. Definição dos Papéis Operacionais
Para garantir que todos os módulos do **FluxAI OS™** sejam monitorados e alimentados corretamente, as atribuições da equipe foram divididas em papéis funcionais. Um colaborador pode exercer mais de um papel a depender do tamanho da equipe.

1.  **Admin do Sistema (SysAdmin):** Mantém a infraestrutura de servidores, banco de dados Supabase, renovações de API e segurança digital.
2.  **Operador de Planejamento (Planejamento):** Define pautas, cronogramas editoriais e gerencia o backlog de demandas.
3.  **Operador de Conteúdo (Copywriter/Designer):** Opera o motor de IA, edita legendas, anexa criativos do Drive e faz a publicação assistida.
4.  **Financeiro (CFO):** Cadastra mensalidades, controla vencimentos contratuais, monitora inadimplência e cobra clientes.
5.  **Comercial (SDR/Sales):** Monitora a chegada de leads do site, qualifica contatos e atualiza propostas de vendas.
6.  **Métricas (BI/Analytics):** Analisa a performance diária de tráfego/ads e escreve o diagnóstico dos relatórios mensais.
7.  **Automações (Integrador Make):** Desenvolve e monitora o funcionamento de webhooks e cenários no Make.com.
8.  **Auditor de Segurança (Compliance):** Monitora logs do tipo `SECURITY_ACCESS_DENIED` e gerencia usuários.
9.  **Atendimento (CS/Account):** Interage com o cliente no portal, gerencia refações e cobra orçamentos extras.

---

## 2. Matriz RACI de Processos Operacionais

### Definições RACI:
*   **R (Responsável):** Quem executa a tarefa.
*   **A (Aprovador):** Quem responde pela qualidade e tem poder de decisão final.
*   **C (Consultado):** Quem fornece insumos e feedback para a tarefa.
*   **I (Informado):** Quem é avisado sobre a conclusão ou alteração da tarefa.

| Processo / Atividade | Admin | Planejam. | Conteúdo | Financ. | Comercial | Métricas | Automaç. | Atendim. |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Captura e Prospecção de Leads** | I | I | ─ | ─ | **R** | ─ | **C** | ─ |
| **Cadastrar Cliente & Contrato** | **A** | I | I | **R** | **C** | ─ | I | I |
| **Executar Onboarding de Dados** | I | **R** | ─ | ─ | ─ | ─ | **C** | **A** |
| **Preencher DNA do Cliente** | ─ | **C** | **R** | ─ | ─ | ─ | ─ | **A** |
| **Gerar Rascunhos de IA (Posts)** | ─ | **C** | **R** | ─ | ─ | ─ | ─ | **A** |
| **Revisão e Validação Interna** | ─ | **A** | **R** | ─ | ─ | ─ | ─ | **C** |
| **Aprovação de Mídia pelo Cliente**| ─ | ─ | I | ─ | ─ | ─ | ─ | **R** / **A**|
| **Publicação Manual Assistida** | ─ | I | **R** | ─ | ─ | ─ | ─ | I |
| **Auditoria e Monitoramento de Logs**| **A** | ─ | ─ | ─ | ─ | ─ | **R** | ─ |
| **Precificar Serviço Extra** | **A** | ─ | ─ | **R** | ─ | ─ | ─ | **C** |
| **Compilar Relatório Mensal** | I | ─ | ─ | ─ | ─ | **R** | ─ | **A** |
| **Manutenção das APIs do Make** | **A** | ─ | ─ | ─ | ─ | ─ | **R** | ─ |

---

## 3. Políticas de Auditoria e Escalonamento
*   **Erro Crítico de Webhook (`WEBHOOK_REAL_FAILED`):** O Operador de Conteúdo (ou Atendimento) notifica imediatamente o Integrador Make (**R**) e o SysAdmin (**A**). A ação deve ser pausada no OS até o reestabelecimento.
*   **Cobrança de Inadimplência:** O Financeiro (**R**) detecta cobranças em aberto há mais de 5 dias no Executive Center, gera a mensagem pré-preenchida no clipboard e aciona o WhatsApp Web manual assistido.
*   **Gestão de Refações:** Se o cliente reprovar uma entrega no portal, o Atendimento (**R**) recebe o feedback detalhado, avalia o impacto na cota e encaminha a demanda de ajuste para o Copywriter/Designer (**R**).
