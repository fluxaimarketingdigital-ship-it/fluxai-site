# FASE 04 — DIAGNÓSTICO DO MÓDULO 03 (CLIENT PORTAL)

**Data da Validação:** 27 de Maio de 2026
**Módulo:** 3. Client Portal (Interface de Valor)
**Status Geral:** 🟡 Aprovado com Ressalvas (Cross-Tenant Frontend IDOR)

## 📊 Matriz de Validação E2E

### Teste 1: Acesso Restrito (CLIENT)
- **Cenário testado:** Acesso direto à rota `/os/client-portal` por um usuário de papel `CLIENT`.
- **Resultado esperado:** Acesso autorizado. Botão "Voltar ao painel" (exclusivo para Admins/Operadores) deve sumir.
- **Resultado observado:** O framework avalia corretamente o escopo via `OS_AUTH.check('CLIENT')`. A lógica esconde o botão lateral se a role for igual a `CLIENT`.
- **Evidência:** `client-portal.html` (Linhas 548 e 581-584).
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** Autorização visual e sistêmica atestada.

### Teste 2: Acesso Proxy (ADMIN / OPERATOR)
- **Cenário testado:** Operador acessando o portal para visualizar como o cliente vê.
- **Resultado esperado:** O portal carrega os dados e mantém o botão "Voltar ao painel" visível.
- **Resultado observado:** Funciona perfeitamente. Como a regra `check('CLIENT')` autoriza cargos superiores na cadeia de herança, o operador entra e o botão persiste.
- **Evidência:** `client-portal.html` (Linhas 581-584).
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** Visão proxy operando normalmente.

### Teste 3: Processamento e Empty States (Métricas e Calendário)
- **Cenário testado:** Renderização dos KPIs (Alcance, ROI, Engajamento).
- **Resultado esperado:** Renderizar sem quebras de layout.
- **Resultado observado:** O layout e os dados fixos renderizam perfeitamente na *grid*, mesmo sob a falha da conexão do banco. O calendário tático possui a correta marcação das classes de "Dias vazios" e "Dias com Eventos".
- **Evidência:** UI Mockup no HTML (Linhas 332-356 e 423-503).
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** UI blindada contra falhas de render.

### Teste 4: Emissão de Demanda (Webhook e Estado)
- **Cenário testado:** Cliente clica em "Adicionar Nova Demanda" e submete o formulário.
- **Resultado esperado:** Bloqueio do botão, registro no log de governança (`OS_LOGS_ENGINE`) e envio real do webhook proxy (`make-proxy`).
- **Resultado observado:** Executado com maestria. O portal distingue `DEMANDA_NORMAL` de serviços de faturamento extra, validando a transição de status no `StatusEngine` e reportando via Webhook com IDs gerados (`dem_xxx`). Se estiver mockado, grava a demanda no LocalStorage.
- **Evidência:** `submitDemanda()` (Linhas 671-800).
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** Máquina de faturamento/demanda íntegra.

### Teste 5: Alertas Financeiros e PIX Dinâmico
- **Cenário testado:** Simulação de um título vencendo ou prestes a vencer.
- **Resultado esperado:** Aparição do banner com integração ao botão do PIX e WhatsApp.
- **Resultado observado:** A lógica do `checkFinancialAlerts()` lê os contratos e os pagamentos pendentes, calcula a diferença de dias para o vencimento (`diffDays === 0` ou `diffDays === 2`) e injeta banners vermelhos/amarelos chamativos. A modal PIX preenche as informações corretamente.
- **Evidência:** Linhas 862-1031.
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** Esteira de retenção operacional ativa.

### Teste 6: Vulnerabilidade Cross-Tenant (IDOR Simulado)
- **Cenário testado:** O `Cliente A` digita maliciosamente na barra de endereços: `?project_id=id_do_cliente_b`.
- **Resultado esperado:** O front-end deveria barrar a tentativa cruzando o `project_id` da URL com o `user.project_id` salvo na RAM, ou o banco recusa a consulta.
- **Resultado observado:** O código extrai a constante `projectId` da URL via `URLSearchParams` (linha 557) e utiliza isso cegamente.
  - Se o Supabase estiver online: O *Row Level Security (RLS)* no banco bloqueia a *Query* impedindo o vazamento severo, caindo no `catch (err)`.
  - No `catch (err)`, o front-end aciona o "Fallback Mock do LocalStorage" buscando pela chave `projectId` alterada da URL.
- **Risco:** No ambiente Mock/Fallback, um cliente manipulador visualizaria a UI sob o nome da empresa de outro. Em produção real o RLS do Supabase estanca o pior cenário, mas o front-end deveria checar a sessão do usuário logado contra o ID requisitado.
- **Evidência:** `client-portal.html` (Linha 557 e 611-622).
- **Status:** Atenção ⚠️ (Cross-Tenant Reference no Front-End)
- **Prioridade:** P1 (Segurança Operacional Front-End / Lógica)
- **Recomendação:** Na função `init()`, adicionar uma checagem de isolamento: se a role for `CLIENT` e o `projectId` requisitado for diferente do `OS_AUTH.user.project_id`, abortar ou forçar a adoção do projeto oficial do usuário logado.

---

## 🏁 Parecer e Próximos Passos
O **Módulo 3: Client Portal** representa o ponto máximo de entrega de valor visual e transparência ao cliente da FluxAI. Toda a orquestração de formulários extras, faturamento (alertas PIX) e emissão de demandas via webhooks proxy operam dentro da conformidade esperada. 

**Riscos Identificados:**
- O front-end confia excessivamente no parâmetro da URL (`?project_id=`) para carregar o escopo. Embora mitigado pelo RLS em produção ativa, gera uma brecha técnica em ambiente de mock/fallback que deve ser tratada como **P1** (Ajuste de Cross-Tenant).

- **Nenhum código do Code Freeze foi desrespeitado** durante o levantamento destas deficiências.
- Solicito a deliberação da diretoria: aprovamos o Módulo 3 registrando o P1 no Backlog da Fase 04, ou realizamos o ajuste de validação IDOR no front-end antes de seguir? O próximo passo, se liberado, é o **Módulo 4 (Onboarding)**.
