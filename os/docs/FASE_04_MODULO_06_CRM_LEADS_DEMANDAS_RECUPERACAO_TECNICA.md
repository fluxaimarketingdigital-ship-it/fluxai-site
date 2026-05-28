# FASE 04 — RECUPERAÇÃO TÉCNICA (MÓDULO 06 - CRM / LEADS / DEMANDAS)

**Data da Implementação:** 27 de Maio de 2026
**Módulo:** 6. CRM / Leads / Demandas
**Engenheiro de IA:** FluxAI (Antigravity)
**Status Anterior:** 🔴 Reprovado (Read-Only Estático / Risco de Tenant Leaking Visual)
**Status Atual:** 🟢 Funcional com C.R.U.D. Protegido

## 1. Escopo de Refatoração

A fim de sanar os incidentes apontados no Diagnóstico, as seguintes áreas sofreram injeção de código, respeitando estritamente as regras de Code Freeze do Core (RBAC, auth e CSP mantidos intocados):

### 1.1 Isolamento por Tenant (Cross-Tenant Filter)
- Inserido tag `<select id="project-filter">` nos cabeçalhos de `leads.html` e `demandas.html`.
- O JS agora **obriga** a seleção de um `currentProject` ou herda do LocalStorage.
- Foi inserido o bloqueio severo (Empty State): se não houver cliente selecionado, a renderização exibe: *"Selecione um cliente no topo da página antes de visualizar..."* e aborta a query da listagem.
- A query via Mock/Sheets foi filtrada no root da matriz: `.filter(x => x.project_id === currentProject)`.

### 1.2 Criação e Interface C.R.U.D.
- Injetada estrutura HTML (`<div id="modal-new-lead">` e `<div id="modal-new-demand">`) em ambos os painéis.
- Os forms exigem campos obrigatórios e têm os gatilhos anti-clique-duplo (`btn.disabled = true; btn.innerHTML = 'CRIANDO...'`).
- IDs únicos gerados programaticamente via `Date.now()` para prevenir colisões (`lead_12345` / `dem_12345`).

### 1.3 Controle de Webhooks (Fail-Safe)
- Para cada ação (Criar, Avançar Status, Arquivar), as funções utilizam a central limpa de rede: `await OS_CONFIG.webhooks.send('CRM_UPDATE', payload)`.
- Se a requisição der `success: false` (queda do Make ou erro de Proxy), o código **ABORTA** e emite um alerta ao usuário informando que o salvamento foi desativado/está em rascunho, bloqueando transições falsas de UI.

### 1.4 Central de Monitoramento de Ações (Logs Engine)
- Toda e qualquer manipulação ativa passa pelo Event Bus de log para auditoria de gestão:
  - `CRM_LEAD_CREATED` / `DEMAND_CREATED`
  - `CRM_LEAD_STATUS_UPDATED` / `DEMAND_STATUS_UPDATED`
  - `CRM_LEAD_ARCHIVED` / `DEMAND_ARCHIVED`
  - `CRM_UPDATE_FAILED` / `DEMAND_UPDATE_FAILED` (Quando o Rollback entra em ação).

### 1.5 Arquivamento Defensivo (Soft Delete)
- Em lugar de comandos SQL destrutivos `DELETE FROM`, os botões de lixeira (<i class="fa-solid fa-box-archive"></i>) rodam um `prompt/confirm()` e alteram a flag para `status: 'arquivado'`. A query de leitura foi ajustada para `.filter(x => x.status !== 'arquivado')`, omitindo o ativo, mas não destruindo seu rastro no banco de dados Mock/Supabase.

## 2. Parecer e Encerramento
A recuperação técnica elevou o Módulo 6 de uma matriz estática (Dashboard Read-Only) para um Motor Operacional completo, robusto, tolerante a falhas (com LocalStorage Fallback) e plenamente integrado à cadeia de monitoramento de incidentes do FluxAI OS™.
