# FASE 04 — DIAGNÓSTICO DO MÓDULO 03 (CLIENT PORTAL)

**Data da Validação:** 27 de Maio de 2026
**Módulo:** 3. Client Portal (Interface de Valor)
**Status Geral:** 🔴 Atenção Crítica (Falha P0 / IDOR)

## 📊 Matriz de Validação E2E

### Teste 1: Acesso Restrito ao Próprio Portal
- **Cenário testado:** Cliente acessando sua rota padrão (`/os/client-portal`).
- **Perfil usado:** CLIENT
- **Resultado esperado:** Acesso concedido e botão administrativo "Voltar ao Painel" oculto.
- **Resultado observado:** A função `OS_AUTH.check('CLIENT')` libera a tela. O bloco `init()` oculta proativamente o botão `.btn-back-portal` caso `session.role === 'CLIENT'`.
- **Evidência:** `client-portal.html` (Linhas 548 e 581-584).
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** Autorização base funcional.

### Teste 2: Cross-Tenant Data Leak (IDOR via URL)
- **Cenário testado:** Cliente logado tenta forçar acesso ao painel de outro cliente alterando `?project_id=XXX` na URL.
- **Perfil usado:** CLIENT
- **Resultado esperado:** Sistema bloqueia a renderização e injeta o `project_id` original atrelado ao JWT/Sessão do usuário logado.
- **Resultado observado:** O script extrai cegamente a variável `projectId` da URL (`new URLSearchParams`). **Não há cruzamento de segurança** com o `OS_AUTH.user.project_id`. Se a conexão de banco cair (ou estiver em Mocks), o cliente visualiza a interface populada com os dados de outra empresa (exposição de Mocks cruzados).
- **Evidência:** `client-portal.html` (Linhas 556-557 e fallback em 611-622).
- **Status:** Falha ❌
- **Prioridade:** P0 (Risco Severo Front-End)
- **Recomendação:** Adicionar validação no `init()`: Se role = CLIENT e `projectId` da URL for diferente do `user.project_id`, reescrever a URL e forçar o ID do usuário.

### Teste 3: Visão Proxy (ADMIN / OPERATOR)
- **Cenário testado:** Operador acessando o portal para monitorar a visão do cliente.
- **Perfil usado:** ADMIN / OPERATOR
- **Resultado esperado:** Dados carregam e botão "Voltar ao painel" permanece visível, sem prender o Operador no portal do cliente.
- **Resultado observado:** A lógica condicional apenas esconde o botão se a role for exata e estritamente `CLIENT`. Para Admin, o botão fica.
- **Evidência:** `client-portal.html` (Linha 581).
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** Visão proxy operante.

### Teste 4: Empty State para Cliente Novo
- **Cenário testado:** Renderização para cliente recém-cadastrado sem dados.
- **Perfil usado:** CLIENT
- **Resultado esperado:** Interface limpa informando que os dados/dashboards estão sendo gerados.
- **Resultado observado:** Não há lógica de Empty State real implementada; a página hoje joga valores `hardcoded` fakes (ex: '14.2K') no DOM incondicionalmente no fim do carregamento.
- **Evidência:** `client-portal.html` (Linhas 624-628).
- **Status:** Atenção ⚠️
- **Prioridade:** P2 / Backlog UX
- **Recomendação:** Os valores fixos devem ser injetados apenas se não houver dados. Remover hardcode futuro.

### Teste 5: Fallback Controlado e Realista
- **Cenário testado:** Supabase fora do ar ou dados vazios do servidor.
- **Perfil usado:** ADMIN / CLIENT
- **Resultado esperado:** Fallback local aparece como fallback, sem fingir ser dado real e oficial validado.
- **Resultado observado:** O script avisa silenciosamente no console que ativou "Fallback LocalStorage Mocks" mas a UI exibe o dashboard normal pro usuário (com dados frios), gerando risco de interpretação equivocada por parte do cliente.
- **Evidência:** `client-portal.html` (Linhas 611-622).
- **Status:** Atenção ⚠️
- **Prioridade:** P2
- **Recomendação:** Adicionar flag visual ("Modo Offline / Dados Cacheados") caso caia no catch.

### Teste 6: Vazamento Estratégico (Segregação de Visão)
- **Cenário testado:** Inspeção da página `client-portal` em busca de tokens, prompts ou logs restritos.
- **Perfil usado:** CLIENT
- **Resultado esperado:** O portal não deve trafegar segredos, IA prompts ou logs da operação interna.
- **Resultado observado:** A página não importa nem expõe o `webhook-dispatcher` puro (apenas o enviador restrito do `os-config.js`). Não constam chaves de IA nem rotas do backend no HTML.
- **Evidência:** Source Code Review do componente.
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** Isolamento perimetral de contexto garantido.

### Teste 7: Fluxo de Serviço Extra (Orçamento vs Compra Automática)
- **Cenário testado:** Submissão do formulário de solicitação de novo serviço.
- **Perfil usado:** CLIENT
- **Resultado esperado:** O pedido deve ser classificado como "solicitado" (orçamento) e não faturado diretamente.
- **Resultado observado:** O script cruza os tipos, marca como `DEMANDA_NORMAL` ou extra (`isExtra`), direciona para o webhook `SERVICE_EXTRA_REQUEST` com *targetStatus* = `'solicitado'` e registra o log `EXTRA_SERVICE_REQUESTED`.
- **Evidência:** `client-portal.html` (Linhas 705-720).
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** O fluxo de "pedir orçamento" está protegido.

### Teste 8: Geração IA Direta (Proibição)
- **Cenário testado:** Tentativa de um cliente acionar processamento GPT/IA pelo seu painel.
- **Perfil usado:** CLIENT
- **Resultado esperado:** Ausência completa dessa capacidade.
- **Resultado observado:** Não existem funções, botões ou imports do `openai` ou similares no front-end do portal. O cliente é mero consumidor passivo do resultado produzido pelo operador.
- **Evidência:** Inspeção visual e DOM parsing.
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** Restrição de consumo operacional validada.

### Teste 9: Aprovação de Planejamento Interno (Proibição)
- **Cenário testado:** Tentativa de um cliente aceitar/rejeitar cronograma via portal.
- **Perfil usado:** CLIENT
- **Resultado esperado:** A visão do calendário deve ser "Read-Only" ou "Follow-Up".
- **Resultado observado:** O calendário (linhas 423-503) é estritamente de visualização via CSS grid, não possuindo funções de edição ou clique ativo submetendo formulários (`div class="calendar-event"`).
- **Evidência:** Code Review (`client-portal.html`).
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** Interface passiva segura.

### Teste 10: Feedback Visual de Conexão com Supabase
- **Cenário testado:** Supabase recusa conexão (Token expirado ou falha de rede).
- **Perfil usado:** CLIENT
- **Resultado esperado:** Feedback explícito no portal de que os dados reais não carregaram.
- **Resultado observado:** Quando o Supabase falha, o código joga pro `catch`, que não renderiza nenhum toast/modal ou banner vermelho pro usuário. Apenas substitui o conteúdo pela leitura do LocalStorage silenciosamente.
- **Evidência:** `client-portal.html` (Linhas 611-622).
- **Status:** Atenção ⚠️
- **Prioridade:** P2 / Backlog UX
- **Recomendação:** Necessário injetar aviso de erro de rede em tela caso a requisição inicial do `init()` retorne throw/error.

### Teste 11: Integridade do Console F12
- **Cenário testado:** Acesso da página pelo cliente sob rede limpa.
- **Perfil usado:** CLIENT
- **Resultado esperado:** Zero erros críticos vermelhos (Bloqueios CORS, CSP, Vazamentos).
- **Resultado observado:** O refatoramento de CSP da Fase 03 cobriu perfeitamente o tráfego desta página. Sem ofensores críticos.
- **Evidência:** Histórico ZAP e Testes Locais.
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** Política de hardening operando bem.

---

## 🏁 Parecer e Próximos Passos
O **Módulo 3: Client Portal** possui um layout de excelente nível e cumpre sua premissa de ocultar do cliente o acesso ao motor (Métricas falsas/verdadeiras, orçamentos, webhooks), mas reprova na validação primária de segurança no front-end (Testes 2, 4, 5 e 10).

**Riscos Identificados:**
- **[P0]** Furo de segurança IDOR (Teste 2): O cliente tem a capacidade técnica de ver Mocks ou causar colisão alterando o `project_id` na URL. Deve ser corrigido obrigatoriamente antes da liberação total.
- **[P2]** Ausência de Empty States, feedbacks falsos e falta de aviso em falhas de rede.

**Decisão:** Módulo reprovado em auditoria secundária (Devido à falha P0 do Teste 2).
Aguardando autorização da diretoria para propor a solução no código para sanar a falha de segurança antes de prosseguir com a Fase 04.
