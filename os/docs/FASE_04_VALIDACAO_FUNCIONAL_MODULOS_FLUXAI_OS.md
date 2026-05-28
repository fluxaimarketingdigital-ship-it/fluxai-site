# FASE 04 — VALIDAÇÃO FUNCIONAL DO FLUXAI OS™ POR MÓDULOS

**Data de Início:** 27 de Maio de 2026
**Status:** Planejamento e Diagnóstico

---

## 🛑 REGRA ABSOLUTA (CODE FREEZE)
O Ciclo OWASP 03.1 a 03.3C foi oficialmente encerrado e a Banca Técnica aprovou a arquitetura de segurança atual.
**É terminantemente proibido alterar:**
- `auth` e Mecanismo de Sessão
- `RBAC`
- `make-proxy` e Edge Functions do Supabase
- `CSP` e `vercel.json`
- `os-core.js` e `os-config.js`
- `login.html`
- `CSS global` e frameworks base
*(Qualquer alteração nestes itens exige um Checklist de Homologação específico prévio).*

---

## 🎯 Objetivo da Fase 04
Validar funcionalmente cada módulo operacional e de negócios do FluxAI OS™. O foco desta etapa é garantir usabilidade, consistência de dados, prevenção de erros (fallback e empty states) e alinhamento prático com as demandas do ecossistema FluxAI Labs, assegurando que o sistema não apenas seja seguro, mas 100% utilizável.

---

## 📋 Checklist de Diagnóstico por Módulo

Abaixo está a matriz de validação que será executada sequencialmente. Nenhuma correção será aplicada antes do diagnóstico da respectiva etapa ser submetido e aprovado pela diretoria.

### 1. Login / Acesso / Redirecionamento
- **Objetivo operacional:** Garantir fluidez no acesso de Operadores e Clientes.
- **Perfil de usuário permitido:** ADMIN, OPERATOR, CLIENT.
- **Fluxo esperado:** Login bem sucedido → Identificação de Role → Redirecionamento para dashboard correto.
- **Dados utilizados:** Credenciais, Supabase Auth Token.
- **Integrações envolvidas:** Supabase Auth, `os-core`.
- **Estados vazios:** N/A.
- **Estados de erro:** Credenciais inválidas, falha de rede.
- **Validação de permissão:** Tentativa de burlar redirecionamento (forçar `/os/command-center` logado como CLIENT).
- **Risco funcional:** Lockout de usuários legítimos ou vazamento de contexto.
- **Ajustes necessários:** [Em aberto]
- **Prioridade:** [Em aberto]

### 2. Command Center
- **Objetivo operacional:** Visão 360° gerencial do negócio (Admin/Operator).
- **Perfil de usuário permitido:** ADMIN, OPERATOR.
- **Fluxo esperado:** Exibição de KPIs globais (leads, contratos, saúde do sistema).
- **Dados utilizados:** Dados consolidados do Supabase/Google Sheets.
- **Integrações envolvidas:** Google Sheets (Mocks temporários), API de métricas.
- **Estados vazios:** Sistema sem clientes ativos ou sem leads no pipeline.
- **Estados de erro:** Falha no carregamento dos cards de KPIs.
- **Validação de permissão:** Acesso negado para CLIENT.
- **Risco funcional:** Exibição incorreta de dados mascarando a saúde do negócio.
- **Ajustes necessários:** [Em aberto]
- **Prioridade:** [Em aberto]

### 3. Client Portal
- **Objetivo operacional:** Painel seguro, transparente e restrito para clientes acompanharem demandas.
- **Perfil de usuário permitido:** CLIENT (e visão proxy por ADMIN/OPERATOR).
- **Fluxo esperado:** Cliente visualiza apenas seus dados, relatórios e demandas ativas.
- **Dados utilizados:** Contexto do cliente (`client_id`), Demandas, Relatórios.
- **Integrações envolvidas:** Supabase DB.
- **Estados vazios:** Cliente novo sem histórico de serviços.
- **Estados de erro:** Queda da conexão com o banco de dados.
- **Validação de permissão:** Cliente A não pode forçar a URL para ver dados do Cliente B.
- **Risco funcional:** Quebra de confidencialidade (Cross-Tenant Data Leak).
- **Ajustes necessários:** [Em aberto]
- **Prioridade:** [Em aberto]

### 4. Onboarding
- **Objetivo operacional:** Cadastramento unificado e ativação do funil inicial de um novo cliente.
- **Perfil de usuário permitido:** ADMIN, OPERATOR.
- **Fluxo esperado:** Preenchimento de dados → Geração de `client_id` → Disparo via Webhook → Confirmação.
- **Dados utilizados:** Formulário de ativação, metadados empresariais.
- **Integrações envolvidas:** Webhook Make (`make-proxy`).
- **Estados vazios:** Formulário resetado para nova entrada.
- **Estados de erro:** Falha no envio do Webhook, dados incompletos.
- **Validação de permissão:** Acesso negado para CLIENT.
- **Risco funcional:** Falha silenciosa no Make impedindo a criação do ecossistema do cliente.
- **Ajustes necessários:** [Em aberto]
- **Prioridade:** [Em aberto]

### 5. Content Engine
- **Objetivo operacional:** Esteira de produção de conteúdo (planejamento, aprovação e postagem).
- **Perfil de usuário permitido:** ADMIN, OPERATOR.
- **Fluxo esperado:** Listagem de pautas → Aprovação/Edição → Envio para calendário.
- **Dados utilizados:** Peças de conteúdo, status.
- **Integrações envolvidas:** Google Sheets, Webhook Make.
- **Estados vazios:** Nenhuma pauta aguardando aprovação.
- **Estados de erro:** Erro de sincronia com a planilha.
- **Validação de permissão:** Acesso negado para CLIENT.
- **Risco funcional:** Perda de trabalho ou duplicação de postagens.
- **Ajustes necessários:** [Em aberto]
- **Prioridade:** [Em aberto]

### 6. CRM / Leads / Demandas
- **Objetivo operacional:** Controle do pipeline comercial e acompanhamento de tickets/demandas.
- **Perfil de usuário permitido:** ADMIN, OPERATOR.
- **Fluxo esperado:** Gestão Kanban/lista de Leads, alteração de status, fechamento de ticket.
- **Dados utilizados:** Pipeline comercial.
- **Integrações envolvidas:** Supabase DB.
- **Estados vazios:** Pipeline zerado.
- **Estados de erro:** Falha na atualização de status.
- **Validação de permissão:** Acesso negado para CLIENT.
- **Risco funcional:** Contatos perdidos, gargalos comerciais invisíveis.
- **Ajustes necessários:** [Em aberto]
- **Prioridade:** [Em aberto]

### 7. Logs / Auditoria
- **Objetivo operacional:** Rastreio de eventos do sistema, disparos de webhooks e acessos.
- **Perfil de usuário permitido:** ADMIN, (OPERATOR restrito).
- **Fluxo esperado:** Listagem paginada de eventos cronológicos (Engine `os-logs`).
- **Dados utilizados:** Registro de eventos.
- **Integrações envolvidas:** `os-logs-engine`.
- **Estados vazios:** Sistema recém-iniciado (sem logs recentes).
- **Estados de erro:** Falha ao recuperar logs do banco/memória.
- **Validação de permissão:** Acesso negado para CLIENT.
- **Risco funcional:** Perda de rastreabilidade durante um incidente (Non-repudiation failure).
- **Ajustes necessários:** [Em aberto]
- **Prioridade:** [Em aberto]

### 8. Serviços Extras
- **Objetivo operacional:** Fluxo de up-sell e contratação de demandas fora do escopo padrão.
- **Perfil de usuário permitido:** ADMIN, OPERATOR, CLIENT.
- **Fluxo esperado:** Cliente solicita → Operador orça → Cliente aprova → Operador entrega.
- **Dados utilizados:** Catálogo de serviços, Orçamentos.
- **Integrações envolvidas:** Webhook Make.
- **Estados vazios:** Nenhum serviço extra solicitado no mês.
- **Estados de erro:** Falha na aprovação do orçamento.
- **Validação de permissão:** Cliente só pode ver e solicitar para si mesmo.
- **Risco funcional:** Perda de oportunidade de receita por falha no envio da solicitação.
- **Ajustes necessários:** [Em aberto]
- **Prioridade:** [Em aberto]

### 9. IA Créditos / Governança GPT
- **Objetivo operacional:** Gestão do pool de créditos de IA e controle de gastos.
- **Perfil de usuário permitido:** ADMIN, OPERATOR.
- **Fluxo esperado:** Visualização de consumo, alocação de pacotes de tokens.
- **Dados utilizados:** Log de geração GPT, saldos.
- **Integrações envolvidas:** Open AI / Make API.
- **Estados vazios:** Nenhum crédito consumido.
- **Estados de erro:** Falha na comunicação de saldo.
- **Validação de permissão:** Acesso negado para CLIENT (Cliente não controla IA no FluxAI OS).
- **Risco funcional:** Vazamento de limite (Overspending) por falha no cômputo.
- **Ajustes necessários:** [Em aberto]
- **Prioridade:** [Em aberto]

### 10. Relatórios / Camada Executiva
- **Objetivo operacional:** Geração e aprovação de relatórios de desempenho mensal.
- **Perfil de usuário permitido:** ADMIN, OPERATOR.
- **Fluxo esperado:** Compilação automatizada → Revisão do Operador → Aprovação → Envio ao Cliente.
- **Dados utilizados:** Google Analytics, Meta Ads, Clarity.
- **Integrações envolvidas:** Múltiplas fontes via Make.
- **Estados vazios:** Período sem dados agregados.
- **Estados de erro:** Erro de sync com APIs parceiras.
- **Validação de permissão:** Acesso negado para CLIENT (na camada de edição).
- **Risco funcional:** Envio de dados incompletos ou incorretos (Dano de imagem).
- **Ajustes necessários:** [Em aberto]
- **Prioridade:** [Em aberto]

---

## 📌 Próximos Passos
1. Receber aprovação desta matriz (Plano de Voo).
2. Executar validação E2E do Módulo 1 (Login / Acesso).
3. Gerar diagnóstico para o Módulo 1 e aguardar aprovação de plano de correção (se necessário).
4. Proceder iterativamente para os próximos módulos, sempre sob a regra absoluta do Code Freeze.
