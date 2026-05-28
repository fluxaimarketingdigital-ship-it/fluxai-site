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
- **Ajustes necessários:** Substituir `alert()` nativo por Modal/Toast UI.
- **Prioridade:** Backlog (UX)
- **Status da Validação:** 🟢 Homologado (Aprovado com ressalva UX em backlog)

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
- **Ajustes necessários:** Adicionar feedback visual quando falhar a conexão com SheetsService/API, substituindo estado eterno de sincronização por mensagem clara de falha controlada.
- **Prioridade:** P2 (UX / Feedback operacional)
- **Status da Validação:** 🟢 Homologado (Aprovado com ressalva em backlog)

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
- **Ajustes necessários:** IDOR Front-End (Vazamento Cross-Tenant) corrigido via patch de segurança cruzando URL e JWT na função init(). Falta apenas flag visual de Fallback.
- **Prioridade:** Backlog UX
- **Status da Validação:** 🟢 Homologado (P0 mitigado; P2 UX visual confuso documentado no Backlog)

### 4. Onboarding
- **Objetivo operacional:** Cadastramento unificado e ativação do funil inicial de um novo cliente.
- **Perfil de usuário permitido:** ADMIN (comercial e operacional).
- **Fluxo esperado:** Coleta de dados (Empresa, URLs, Escopo, Dados do cartão/faturamento).
- **Dados utilizados:** Escopo do serviço, integrações requisitadas.
- **Integrações envolvidas:** Disparo webhook Make (Ativação Cliente).
- **Estados de erro:** Falha no webhook Make ou Supabase (Fallback offline tratado e bloqueio visual ativo).
- **Validação de permissão:** Acesso bloqueado para CLIENT e OPERATOR regular.
- **Risco funcional:** Envio duplo criando cadastros replicados (corrigido com desativação do botão) ou falsos-positivos (corrigido com trava offline).
- **Ajustes necessários:** O falso-positivo de rede/banco foi convertido e mapeado; logs separados de Sucesso Oficial, Falha Parcial e Falha Total inseridos na controller.
- **Prioridade:** Resolvido (P1 mitigado).
- **Status da Validação:** 🟢 Homologado

### 5. Content Engine
- **Objetivo operacional:** Esteira de produção de conteúdo (planejamento, aprovação e postagem).
- **Perfil de usuário permitido:** ADMIN, OPERATOR.
- **Fluxo esperado:** Listagem de pautas → Aprovação/Edição → Envio para calendário.
- **Dados utilizados:** Peças de conteúdo, status.
- **Integrações envolvidas:** Google Sheets, Webhook Make.
- **Estados vazios:** Nenhuma pauta aguardando aprovação.
- **Estados de erro:** Rollback ativo impedindo falso-positivos se o webhook Make falhar. Fallback para LocalStorage se Supabase falhar.
- **Validação de permissão:** Acesso negado rigidamente para CLIENT nas controllers vitais.
- **Risco funcional:** Múltiplas travas impedem transições sem validação e protegem o limite de IA do cliente.
- **Ajustes necessários:** Nenhum. Módulo 100% blindado por Rollback Automático.
- **Prioridade:** Resolvido.
- **Status da Validação:** 🟢 Homologado

### 6. CRM / Leads / Demandas
- **Objetivo operacional:** Controle do pipeline comercial e acompanhamento de tickets/demandas.
- **Perfil de usuário permitido:** ADMIN, OPERATOR.
- **Fluxo esperado:** Recebimento de lead/demanda → Tratamento/Triagem → Evolução de status.
- **Dados utilizados:** Nome, origem, serviço, prioridade, prazos.
- **Integrações envolvidas:** Webhook Make (CRM_UPDATE).
- **Estados vazios:** Sem demanda aguardando. (Isolado por tenant obrigatório).
- **Estados de erro:** Falha no webhook avisa de rascunho local e emite log de falha (Fail-safe).
- **Validação de permissão:** Acesso negado para CLIENT.
- **Risco funcional:** Proteção estrita contra vazamento tenant-tenant e bloqueio de cliques duplos implantado.
- **Ajustes necessários:** Resolvido via Recuperação Técnica.
- **Prioridade:** Resolvido.
- **Status da Validação:** 🟢 Homologado (Pós-Recuperação Técnica)

### 7. Logs / Auditoria
- **Objetivo operacional:** Rastreio de eventos do sistema, disparos de webhooks e acessos.
- **Perfil de usuário permitido:** ADMIN. (Restrito via Patch de Governança).
- **Fluxo esperado:** Captura de eventos do local storage ou DB e exibição cronológica.
- **Dados utilizados:** Timestamp, UserID, Tenant, Ação, Payload.
- **Integrações envolvidas:** Event Bus local (`OS_LOGS_ENGINE`).
- **Estados vazios:** Mocks injetados automaticamente na ausência de logs reais.
- **Estados de erro:** Parsing seguro contra payloads corrompidos.
- **Validação de permissão:** Acesso severamente negado para OPERATOR e CLIENT.
- **Risco funcional:** Vazamento de webhook keys e tokens em raw payloads.
- **Ajustes necessários:** Resolvido (Nível de acesso subido para ADMIN, Redaction visual de secrets ativada).
- **Prioridade:** Resolvido (P1 mitigado).
- **Status da Validação:** 🟢 Homologado (Pós-Patch de Acesso)

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
