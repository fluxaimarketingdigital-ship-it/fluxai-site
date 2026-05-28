# FASE 04 — DIAGNÓSTICO DO MÓDULO 04 (ONBOARDING)

**Data da Validação:** 27 de Maio de 2026
**Módulo:** 4. Onboarding (Ativação de Clientes)
**Status Geral:** 🟡 Aprovado com Ressalvas (Feedback visual de erro enganoso)

## 📊 Matriz de Validação E2E

### Teste 1: Acesso por ADMIN
- **Cenário testado:** Usuário ADMIN acessa `/os/onboarding.html`.
- **Perfil usado:** ADMIN
- **Resultado esperado:** Tela carrega corretamente.
- **Resultado observado:** O layout (Stepper, Campos, Form) carrega de forma limpa. A validação `OS_AUTH.check('ADMIN')` garante o acesso.
- **Evidência:** `onboarding.js` (Linha 38) e UI.
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** Operação normal.

### Teste 2: Acesso por OPERATOR
- **Cenário testado:** Usuário OPERATOR acessa `/os/onboarding.html`.
- **Perfil usado:** OPERATOR
- **Resultado esperado:** Acesso concedido se o perfil tiver permissão operacional para cadastrar cliente.
- **Resultado observado:** O sistema está configurado rigorosamente com `OS_AUTH.check('ADMIN')`. Perfis do tipo `OPERATOR` ou abaixo são barrados e redirecionados.
- **Evidência:** `onboarding.js` (Linha 38).
- **Status:** Atenção ⚠️
- **Prioridade:** Backlog (Ajuste de negócio)
- **Recomendação:** O sistema hoje delega a criação de clientes APENAS a administradores globais. Se a operação desejar que Operadores comerciais ativem clientes, será necessário alterar o `.check('ADMIN')` para suportar `OPERATOR` com permissões específicas no futuro.

### Teste 3: Bloqueio de CLIENT
- **Cenário testado:** Tentativa de acesso direto à URL por um cliente.
- **Perfil usado:** CLIENT
- **Resultado esperado:** Acesso negado e redirecionamento.
- **Resultado observado:** O motor central barra a execução pois `CLIENT` não satisfaz a cláusula de `ADMIN`. O usuário é expulso de forma segura.
- **Evidência:** Lógica de Auth Core / JWT Hierárquico.
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** Proteção restrita confirmada.

### Teste 4: Validação de Campos Obrigatórios
- **Cenário testado:** Envio do form vazio.
- **Perfil usado:** ADMIN
- **Resultado esperado:** Bloqueio nativo do formulário.
- **Resultado observado:** O HTML impõe `required` em todos os campos essenciais do escopo (Nome, Empresa, Nicho, DNA, Drive, Contrato Financeiro, SLA). O envio é blindado pelo browser antes de ativar a engine.
- **Evidência:** `onboarding.html` (Linhas 157-524).
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** Estrutura de dados inicial não envia "lixo" ao backend.

### Teste 5: Geração de `client_id` (Tenant ID)
- **Cenário testado:** Avaliação do ID do projeto gerado para novos clientes.
- **Perfil usado:** ADMIN
- **Resultado esperado:** IDs únicos, padronizados.
- **Resultado observado:** O código gera internamente através de `const projectId = "p_" + Date.now()`. O e-mail base é sanitizado via `toLowerCase().replace(/[^a-z0-9]/g, '')`.
- **Evidência:** `onboarding.js` (Linhas 249-252).
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** Não há geração de chaves com caracteres especiais que quebrem URLs de pastas.

### Teste 6: Envio via make-proxy
- **Cenário testado:** Auditoria do tráfego de submissão do formulário.
- **Perfil usado:** ADMIN
- **Resultado esperado:** Nunca deve haver webhook Make direto no frontend.
- **Resultado observado:** O payload transita internamente utilizando o wrapper central `OS_CONFIG.webhooks.send('CLIENT_ONBOARDING', webhookPayload)`. A API-Key do Make está isolada no Backend (Edge Functions).
- **Evidência:** `onboarding.js` (Linha 469) e proxy refatorado na Fase 3.
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** Perímetro de segurança intacto.

### Teste 7: Proteção Contra Clique Duplo
- **Cenário testado:** Stress no botão "DISPARAR INFRAESTRUTURA".
- **Perfil usado:** ADMIN
- **Resultado esperado:** Botão entra em estado de bloqueio imediato.
- **Resultado observado:** Na primeira linha de `handleOnboarding()`, ocorre `btn.disabled = true;` acompanhado da inserção de um spinner `fa-spin`. O formulário congela enquanto as requisições processam.
- **Evidência:** `onboarding.js` (Linhas 241-243).
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** Evita múltiplos Tenants e contratos duplicados.

### Teste 8: Sucesso no Envio
- **Cenário testado:** Resposta afirmativa do Banco e do Make.
- **Perfil usado:** ADMIN
- **Resultado esperado:** Feedback claro e orientação.
- **Resultado observado:** Dispara uma modal full-screen esteticamente impecável ("Deploy Cinematic") narrando o progresso da infraestrutura, ativando SLAs e finalmente redirecionando o operador para o `cliente-detalhe.html`.
- **Evidência:** `onboarding.js` (Linha 254-288).
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** Experiência Premium confirmada.

### Teste 9: Falha no Envio (Supabase/Make Error)
- **Cenário testado:** Submeter onboarding com servidor fora do ar ou Make com erro.
- **Perfil usado:** ADMIN
- **Resultado esperado:** Interface mostra erro claro. Não deve fingir sucesso.
- **Resultado observado:** No evento de erro de submissão no `Supabase`, a função lança pro bloco `catch (err)` (linha 581), gerando um `console.warn`. O bloco `finally` (linha 584) obriga o registro de *Fallback/Mock LocalStorage* e não interrompe a animação visual. Ao fim, redireciona o Operador como se o cliente estivesse oficializado (fingindo sucesso num falso-positivo).
- **Evidência:** `onboarding.js` (Linhas 581-593).
- **Status:** Atenção ⚠️ (Feedback Enganoso)
- **Prioridade:** P2
- **Recomendação:** Necessita de correção. Se o servidor principal rejeitar, a interface precisa avisar o Operador: *"Conexão com servidor falhou. O cliente foi salvo apenas na memória local (Rascunho)."* ao invés de exibir a tela de "100% de sucesso" cega.

### Teste 10: Compatibilidade com Estrutura Operacional
- **Cenário testado:** Inspeção do JSON payload que viaja ao banco de dados e ao webhook do Make.
- **Perfil usado:** ADMIN
- **Resultado esperado:** Casamento perfeito com os atributos (Financeiro, CRM, Conteúdo).
- **Resultado observado:** O `webhookPayload` cobre absolutamente todas as matrizes: Dados Principais, Contrato, Módulos Extras, Pastas de Drive, DNA (Dores, Objeções, Tom de Voz), Tokens Analíticos Vazios e Planejamento Inicial. O DB também armazena as estruturas aninhadas `operational_activation`.
- **Evidência:** `onboarding.js` (Linhas 365-460).
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** Estrutura escalável e bem definida.

### Teste 11: Segurança de Escopo
- **Cenário testado:** Cliente logado tentando alterar seu próprio plano pelo formulário.
- **Perfil usado:** CLIENT
- **Resultado esperado:** Sem permissão.
- **Resultado observado:** Impossível o acesso da rota. Se o banco receber via API crua, o RLS bloqueia. O Front-end corta o acesso pela raiz e a página não provê formulário.
- **Evidência:** `OS_AUTH.check('ADMIN')`.
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** Isolamento perimetral certificado.

### Teste 12: Integridade do Console F12
- **Cenário testado:** Falso envio e renderização normal.
- **Perfil usado:** ADMIN
- **Resultado esperado:** Zero erros críticos vermelhos ou avisos de CORS/CSP.
- **Resultado observado:** A matriz de Webhooks mascarados mantém o F12 estéril. Não há vazamentos e CSP permite todas as fontes vitais de CSS/Fonts.
- **Evidência:** Histórico ZAP.
- **Status:** Aprovado ✅
- **Prioridade:** N/A
- **Recomendação:** OK.

---

## 🏁 Parecer Técnico (Onboarding)
O módulo cumpre sua função majestosamente. O provisionamento simula uma "máquina" instalando a operação para um cliente e possui altíssimo valor perceptível (UX). 

- Todos os campos mandatórios estão exigidos (Teste 4).
- O webhook é escondido de clientes e curiosos (Teste 6).
- Os cliques repetidos são bloqueados (Teste 7).

**Deficiências a Ajustar:**
- **[P2] Falso-Positivo de Sucesso (Teste 9):** O sistema não exibe alerta de falha de rede/Supabase na tela. O painel segue adiante renderizando a animação de "Deploy Concluído", guardando o usuário apenas no Mock Offline, o que pode fazer o administrador julgar incorretamente que o contrato subiu para o Banco Oficial e foi disparado no Make.
- **[Backlog] Acesso de Operador (Teste 2):** Se a liderança quiser, precisará afrouxar o `.check('ADMIN')` futuramente.

**Decisão Sugerida:** Como a falha P2 afeta apenas os funcionários internos (e não expõe dados dos clientes), não há gravidade de segurança, mas afeta a assertividade da operação. Solicito o posicionamento sobre como deseja proceder (Corrigir o alerta de fallback enganoso agora ou jogar pro backlog futuro do Onboarding?).
