# FASE 04 — DIAGNÓSTICO DO MÓDULO 09 (IA CRÉDITOS / GOVERNANÇA GPT)

**Data da Validação:** 28 de Maio de 2026
**Módulo:** 9. IA Créditos / Governança GPT
**Status Geral:** 🔴 Reprovado (Incompleto Estruturalmente)

## 📊 Matriz de Validação E2E

### Teste 1: Acesso por ADMIN
- **Cenário testado:** Usuário ADMIN busca acessar o painel de Governança de IA e gestão de créditos.
- **Perfil usado:** ADMIN
- **Resultado esperado:** ADMIN acessa painel de créditos/governança IA.
- **Resultado observado:** O painel "Governança Operacional" (`governance.html`) existe e controla fila de aprovações e configuração de APIs, mas **não possui nenhum widget, tabela ou lógica** referente a Créditos de IA ou Regras de Consumo.
- **Evidência:** Código fonte de `governance.html` e `governance-users.html`.
- **Status:** Falha ❌
- **Prioridade:** P1 (Bloqueante Operacional)
- **Recomendação:** Implementar a aba ou dashboard específico para *IA Créditos / Governança GPT* com as métricas de consumo.

### Teste 2: Acesso por OPERATOR
- **Cenário testado:** Usuário OPERATOR acessa os módulos operacionais com recursos de IA.
- **Perfil usado:** OPERATOR
- **Resultado esperado:** OPERATOR acessa se tiver função de planejamento.
- **Resultado observado:** OPERATOR acessa o `content-engine.html` e pode acionar o `runAiPlanner`. No entanto, ele está bloqueado de acessar a página `governance.html` (restrito ao ADMIN via `OS_AUTH.check('ADMIN')`), logo não poderia ver seus créditos se estivessem lá.
- **Evidência:** `governance.html` (Linha 184) e `content-engine.js` (Linha 1591).
- **Status:** Atenção ⚠️ (Requer realocação do controle de créditos ou liberação de view para Operator).

### Teste 3: Bloqueio de CLIENT
- **Cenário testado:** Cliente tenta acessar a geração de IA ou aprovação interna.
- **Perfil usado:** CLIENT
- **Resultado esperado:** CLIENT bloqueado no painel interno de créditos, geração e aprovação.
- **Resultado observado:** O método `runAiPlanner` bloqueia ativamente o papel `CLIENT` e dispara o log de segurança (`SECURITY_WARNING: tentativa_negada_geracao_ia`).
- **Evidência:** `content-engine.js` (Linhas 1592-1600).
- **Status:** Aprovado ✅

### Teste 4: Visualização de créditos
- **Cenário testado:** Exibição do total, usado, disponível, origem (contrato, extra, manual).
- **Perfil usado:** ADMIN
- **Resultado esperado:** Painel exibe breakdown detalhado do limite da IA.
- **Resultado observado:** Painel não construído.
- **Status:** Falha ❌
- **Prioridade:** P1 (Funcionalidade Inexistente)

### Teste 5: Regra de consumo
- **Cenário testado:** Validação do desconto de saldo conforme os status (rascunho_ia, em_revisao, aprovado_interno, etc).
- **Perfil usado:** ADMIN / OPERATOR
- **Resultado esperado:** Cálculos condicionais dinâmicos.
- **Resultado observado:** O webhook envia `limite_anterior` e `limite_novo` de forma espelhada, mas não existe um middleware rodando na ponta (Client) descontando o consumo quando a pauta vai de rascunho para aprovado.
- **Evidência:** `content-engine.js` (Linha 1634-1635).
- **Status:** Falha ❌
- **Prioridade:** P1

### Teste 6: Cliente não controla IA
- **Cenário testado:** Ações ativas por parte do perfil CLIENT.
- **Resultado esperado:** Cliente não altera pacotes, nem exclui IA, nem gera IA.
- **Resultado observado:** A UI do portal do cliente (`client-portal.html`) e o RBAC travam rigorosamente o cliente nestas ações.
- **Status:** Aprovado ✅

### Teste 7: Operador de planejamento
- **Cenário testado:** Operador gerencia o ciclo da IA.
- **Resultado esperado:** Fluxo orgânico de aprovação e geração.
- **Resultado observado:** A modal trilateral no `content-engine.html` existe e o Operador consegue interagir com ela.
- **Status:** Aprovado ✅

### Teste 8: Serviço extra aprovado
- **Cenário testado:** Conciliação do crédito vindo de serviços extras.
- **Resultado esperado:** Crédito aparece com origem "servico_extra".
- **Resultado observado:** Não há visualização de créditos, e a função de injeção de crédito oriundo de upsell não está conectada ao log operacional.
- **Status:** Falha ❌
- **Prioridade:** P1

### Teste 9: Falha Make/OpenAI/API
- **Cenário testado:** Sistema de falha e rollback em erro de IA.
- **Resultado esperado:** Não fingir sucesso e não consumir crédito indevido.
- **Resultado observado:** Ao falhar o `OS_CONFIG.webhooks.send('AI_OPERATIONAL_CONTROL')`, o `content-engine` intercepta a falha, bloqueia a persistência local (rollback), injeta os logs transacionais `ROLLBACK_STARTED`/`ROLLBACK_COMPLETED`, não gasta crédito e exibe um alerta claro.
- **Evidência:** `content-engine.js` (Linhas 1641-1705).
- **Status:** Aprovado ✅

### Teste 10: Proteção contra duplicidade
- **Cenário testado:** Clique duplo no botão de gerar IA (`btn-ai-planner`).
- **Resultado esperado:** Não duplica geração.
- **Resultado observado:** O botão é travado (disabled = true) imediatamente após o clique, e volta ao original apenas no bloco `finally`.
- **Evidência:** `content-engine.js` (Linhas 1606-1610).
- **Status:** Aprovado ✅

### Teste 11: Logs operacionais
- **Cenário testado:** Disparo de telemetria completa no Event Bus.
- **Resultado esperado:** Logs de CREATED, REVIEW_STARTED, APPROVED, REJECTED, CREDIT_CONSUMED, etc.
- **Resultado observado:** O `runAiPlanner` dispara log para `IA_GENERATION_STATUS` e manda para o Webhook `IA_GENERATION_CREATED`. Contudo, os logs cruciais `IA_CREDIT_CONSUMED`, `IA_CREDIT_RELEASED` e `IA_CREDIT_MANUAL_ADJUSTMENT` não foram declarados em lugar algum do código.
- **Status:** Incompleto ⚠️
- **Prioridade:** P1 (Governança/Auditoria Comprometida)

### Teste 12: Dados esperados
- **Cenário testado:** Integração com as tabelas de referência de IA.
- **Resultado esperado:** Referência de abas correta.
- **Resultado observado:** Inexistente no Front-end (Dependente da criação do Painel de Créditos).
- **Status:** Falha ❌
- **Prioridade:** P1

### Teste 13: Segurança de escopo
- **Cenário testado:** Mistura de dados de clientes na geração.
- **Resultado esperado:** Dados perfeitamente segregados.
- **Resultado observado:** A função resgata o payload baseado estritamente no `client_id` selecionado, que é validado pela API.
- **Status:** Aprovado ✅

### Teste 14: Console F12
- **Cenário testado:** Chaves da OpenAI expostas ao cliente ou erros críticos.
- **Resultado esperado:** Nenhuma chave `sk-...` ou proxy vazada.
- **Resultado observado:** O painel solicita a chave dinamicamente via Prompt (`configOpenAIKey()`) e salva no `localStorage`, que só é rodado localmente e não sobe no backend. Nenhuma chave está hardcoded, não há exposição via console logs e o webhook é proxy.
- **Status:** Aprovado ✅

---

## 🛑 Veredito Técnico e Recomendação
Assim como encontramos nos Módulos 6 e 8, o Módulo 9 encontra-se com uma "casca" superficial operando na geração (`runAiPlanner`), porém o Motor de Regras de Negócio e a Interface Administrativa que rege a **Governança de Créditos GPT** não foi sequer codificada pela equipe de desenvolvimento. 

A arquitetura do painel financeiro de IA está ausente. 
É indispensável elaborarmos um **Plano de Recuperação Técnica** para materializar este dashboard e integrar a matemática dos créditos (Rascunhos = 0 consumido, Aprovados = Consome crédito) ao Content Engine, antes de darmos sequência.
