# FASE 04 — DIAGNÓSTICO DO MÓDULO 08 (SERVIÇOS EXTRAS E CONTRATOS)

**Data da Validação:** 27 de Maio de 2026
**Módulo:** 8. Serviços Extras / Contratos & Financeiro
**Status Geral:** 🔴 Reprovado (Incompleto Operacionalmente / Funções Fantasmas)

## 📊 Matriz de Validação E2E

### Teste 1: Acesso por ADMIN
- **Cenário testado:** Usuário ADMIN acessa `/os/contracts-finance.html`.
- **Perfil usado:** ADMIN
- **Resultado esperado:** Tela carrega perfeitamente e exibe KPIs financeiros.
- **Resultado observado:** Painel carrega as abas, KPIs, tabelas de saúde contratual e lê tanto o Supabase quanto os Mocks (alta fidelidade) no fallback local de forma funcional.
- **Status:** Aprovado ✅
- **Prioridade:** N/A

### Teste 2: Bloqueio de OPERATOR e CLIENT
- **Cenário testado:** Usuário OPERATOR ou CLIENT tentam acessar o fluxo financeiro.
- **Resultado esperado:** Acesso negado.
- **Resultado observado:** A trava `OS_AUTH.check('ADMIN')` é disparada na linha 13 de `contracts-finance.js`. O bloqueio é efetivo.
- **Status:** Aprovado ✅
- **Prioridade:** N/A

### Teste 3: Lançamento de Serviços Extras (Upsell)
- **Cenário testado:** Adição de um serviço extra no contrato.
- **Resultado esperado:** A modal de edição abre, salva o serviço e reflete na tela e no banco.
- **Resultado observado:** O botão de edição da tabela dispara a função `window.editContract(c.id)`, e o formulário exige o salvamento via `window.saveContractEdit()`. No entanto, **NENHUMA dessas funções existe** no script `contracts-finance.js`. Os botões são apenas "fantasmas" (Dead links). Apenas o seletor visual de serviços preenche campos automaticamente.
- **Status:** Falha ❌
- **Prioridade:** P1 (Operacional)
- **Recomendação:** Implementar a lógica de controle da modal (abrir/fechar/abas) e a função de injeção dos extras.

### Teste 4: Emissão de Recibos / Docs (UI)
- **Cenário testado:** Botões `[Gerar Recibo]` e `[Abrir Contrato]`.
- **Resultado observado:** Os botões estão injetados no HTML e no JS (`window.generateContractDoc(c.id)`), mas o método de geração de PDFs/Recibos não está implementado, inviabilizando a ação financeira.
- **Status:** Falha ❌
- **Prioridade:** P2 (UX / Funcionalidade pendente)

### Teste 5: Event Bus e Logs Operacionais
- **Cenário testado:** Geração de logs para adições de contrato.
- **Resultado observado:** O script tem uma função arcaica `logAction` (linha 635) que tenta forçar inserção direta no Supabase `audit_logs`. Essa abordagem destoa completamente da arquitetura consolidada que utiliza o `OS_LOGS_ENGINE` unificado da Fase 03.
- **Status:** Falha ❌
- **Prioridade:** P2 (Dissonância Arquitetural)
- **Recomendação:** Refatorar para usar `OS_LOGS_ENGINE.userAction()`.

### Teste 6: Tratamento de Falhas (Fail-Safe)
- **Cenário testado:** Falha de comunicação com gateway/banco no update financeiro.
- **Resultado observado:** Não há o que testar, pois a função de Update (Submit) sequer existe.
- **Status:** Falha ❌
- **Prioridade:** P1

---

## 🏁 Parecer Técnico (Serviços Extras / Financeiro)
Semelhante ao estágio inicial do Módulo 6, o **Módulo 8 é um formidável painel visual de leitura (Read-Only)**. Seus algoritmos de classificação de *Risco Operacional*, contagem de *Ticket Médio* e filtragem de recebimentos atrasados são de altíssima qualidade analítica e arquitetural.

Contudo, ele falha miseravelmente ao tentar receber interação do usuário. É impossível faturar o up-sell de um serviço extra ou modificar o escopo do contrato pois a infraestrutura do C.R.U.D. para este módulo e a orquestração da Modal foram omitidas do código fonte `contracts-finance.js`.

**Classificação Oficial:**
**Incompleto Operacionalmente (P1 Generalizado).**

Diretriz Requerida:
Aguardo autorização para elaborar o **Plano de Recuperação Técnica do Módulo 8**, que trará as funções de Modal, injeção C.R.U.D. na tabela, padronização do log via `OS_LOGS_ENGINE` e tolerância a falhas.
