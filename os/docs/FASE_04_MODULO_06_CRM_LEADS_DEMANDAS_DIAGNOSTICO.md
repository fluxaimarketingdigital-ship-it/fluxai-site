# FASE 04 — DIAGNÓSTICO DO MÓDULO 06 (CRM / LEADS / DEMANDAS)

**Data da Validação:** 27 de Maio de 2026
**Módulo:** 6. CRM / Leads / Demandas
**Status Geral:** 🔴 Reprovado (Incompleto Estruturalmente)

## 📊 Matriz de Validação E2E

### Teste 1: Acesso por ADMIN
- **Cenário testado:** ADMIN acessa `/os/leads.html` e `/os/demandas.html`.
- **Perfil usado:** ADMIN
- **Resultado esperado:** Módulo carrega sem erros.
- **Resultado observado:** O layout carrega e a tabela é renderizada.
- **Evidência:** `leads.js` (Linha 5), `demandas.js` (Linha 5) `await OS_AUTH.check('OPERATOR')`.
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** Operação normal.

### Teste 2: Acesso por OPERATOR
- **Cenário testado:** OPERATOR tenta gerenciar demandas.
- **Perfil usado:** OPERATOR
- **Resultado esperado:** Acesso concedido.
- **Resultado observado:** O sistema permite a entrada do perfil Operador.
- **Evidência:** `await OS_AUTH.check('OPERATOR')`.
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** OK.

### Teste 3: Bloqueio de CLIENT
- **Cenário testado:** CLIENT tenta ver pipeline de vendas interno.
- **Perfil usado:** CLIENT
- **Resultado esperado:** Bloqueado na raiz.
- **Resultado observado:** O sistema barra perfis CLIENT porque a regra exige permissão hierárquica `OPERATOR` ou superior.
- **Evidência:** `OS_AUTH.check('OPERATOR')`.
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** Isolamento perimetral intacto (impede o risco P0 de vazamento).

### Teste 4: Listagem de leads/demandas
- **Cenário testado:** Renderização dos itens capturados via Sheets/Make.
- **Perfil usado:** ADMIN
- **Resultado esperado:** Itens devem carregar ID, projeto, nome, origem, status.
- **Resultado observado:** Os arquivos JS buscam no `SheetsService` e renderizam uma tabela HTML básica com `Nome, Empresa, Contato, Interesse, Origem e Status` (Leads) e `ID, Cliente, Título, Prioridade, Status, Prazo` (Demandas).
- **Evidência:** `leads.js` (Linhas 47-54).
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** Estrutura de leitura funcional, mas é puramente *Read-Only*.

### Teste 5: Empty state
- **Cenário testado:** Sem dados no Service.
- **Perfil usado:** ADMIN
- **Resultado esperado:** Mensagem polida, sem erro no painel.
- **Resultado observado:** O array vazio é tratado: `<div style="opacity: 0.5;">Nenhuma demanda encontrada.</div>`.
- **Evidência:** `demandas.js` (Linhas 20-23).
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** OK.

### Teste 6: Alteração de status
- **Cenário testado:** Tentar mover um lead para a próxima etapa.
- **Perfil usado:** ADMIN
- **Resultado esperado:** Status deve mudar e persistir.
- **Resultado observado:** **Não implementado**. As telas (`leads.html` e `demandas.html`) exibem dados puramente estáticos. Não há botões de ação (Editar, Mudar Status, Avançar).
- **Evidência:** Inspeção visual e ausência de métodos no JS.
- **Status:** Falha ❌
- **Prioridade:** P1 (Operacional)
- **Recomendação:** Criar interface de interação e funções de Update.

### Teste 7: Falha de atualização (Tratamento de erro)
- **Cenário testado:** Simular erro de rede ao atualizar lead.
- **Resultado observado:** Como a função de atualização não existe, o tratamento de erro reverso não pôde ser avaliado.
- **Status:** Falha ❌
- **Prioridade:** P1
- **Recomendação:** Implementar mecanismo *Fail-Safe* idêntico ao do Content Engine.

### Teste 8: Criação de nova demanda/lead
- **Cenário testado:** Inserção manual no CRM interno.
- **Resultado observado:** **Não implementado**. Não existe botão "Novo Lead" ou "Nova Demanda". O sistema só reflete o que o SheetsMock/Make envia.
- **Status:** Falha ❌
- **Prioridade:** P1
- **Recomendação:** Construir modal de inserção de demandas/leads, orquestrado com o banco Supabase.

### Teste 9: Proteção contra duplicidade
- **Cenário testado:** Evitar clique duplo ao cadastrar lead.
- **Resultado observado:** Sem aplicação no momento, por falta da feature.
- **Status:** N/A (Pendente de construção)

### Teste 10: Segregação por cliente/projeto
- **Cenário testado:** O Operador A vê apenas seus dados ou clientes separados?
- **Resultado esperado:** Filtro por `project_id`.
- **Resultado observado:** A listagem consome a resposta bruta do Sheets/Mock (`SheetsService.fetchDemands()`) sem anexar nenhum filtro de Workspace/Tenant na interface. O operador vê o banco de dados inteiro cruzado de todos os clientes. Como o `CLIENT` está bloqueado pela camada de auth (Teste 3), **não existe risco P0 de IDOR atual**, mas a usabilidade está poluída e carece de isolamento arquitetural no front.
- **Evidência:** Ausência de `eq('project_id', current_project)` nas chamadas.
- **Status:** Atenção ⚠️
- **Prioridade:** P1 (Isolamento Arquitetural Interno)
- **Recomendação:** Criar selector de clientes no header, similar ao Motor de Conteúdo.

### Teste 11: Integração Make/Sheets/Supabase
- **Cenário testado:** Como os dados trafegam?
- **Resultado observado:** Usa a camada `SheetsService`, o que isola chaves externas do frontend de forma elegante. Não há webhooks expostos soltos na DOM.
- **Evidência:** `sheets-service.js`.
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** Arquitetura limpa.

### Teste 12: Logs operacionais
- **Cenário testado:** Rastreabilidade ao alterar CRM.
- **Resultado observado:** O módulo **não chama** o `OS_LOGS_ENGINE` em nenhuma etapa, já que não realiza escrita/mutação de dados.
- **Status:** Falha ❌
- **Prioridade:** P1
- **Recomendação:** Injetar os trackers (CRON, UPDATE, DELETE) assim que as funções forem construídas.

### Teste 13: Exclusão ou arquivamento
- **Cenário testado:** Eliminar lixo do CRM.
- **Resultado observado:** Não há botão de excluir (lixeira).
- **Status:** Falha ❌
- **Prioridade:** P1
- **Recomendação:** Construir lógica com alerta de confirmação e soft-delete.

### Teste 14: Console F12
- **Cenário testado:** Ausência de erros sangrando o log.
- **Resultado observado:** Carrega perfeitamente limpo, injeta os mocks na DOM sem quebrar o CSP.
- **Status:** Aprovado ✅

---

## 🏁 Parecer Técnico (CRM / Leads / Demandas)
O Módulo 6 é **apenas um Dashboard de Leitura (Read-Only) em sua forma atual**. Ele importa os Mocks/Google Sheets corretamente e barra acesso indesejado de Clientes de maneira formidável.

**PORÉM**, ele carece inteiramente da "Engenharia de Interação" que foi consolidada nos módulos anteriores (4 e 5). Não há como editar, não há travas de webhook, não há injeção no Supabase, nem logs operacionais, pois as funções de escrita (C.R.U.D.) não foram desenhadas nos scripts `leads.js` e `demandas.js`.

**Classificação Oficial:**
**Incompleto Operacionalmente (P1 Generalizado)**. 

Devo prosseguir com a implementação do plano de recuperação técnica do Módulo 6 (construindo as modais, travas de Make, logs, filtros por tenant e integração Supabase) ou prefere que a gente apenas engavete ele no Backlog e pule para o Diagnóstico do Módulo 7 (Logs/Auditoria)?
