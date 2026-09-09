# FLUXAI OS™ — PLANO-MESTRE CONSOLIDADO (Versão 2.0)
*Versão Anterior: 1.0*

> **NOTA OFICIAL DA CENTRAL DE CONTROLE**
> Este documento não substitui o Plano-Mestre executivo oficial.
> PLANO_TECNICO_DO_REPOSITORIO: `docs/PLANO_MESTRE_AUDITORIA_FINAL_FLUXAI_OS.md`
> PLANO_MESTRE_EXECUTIVO_OFICIAL: `FluxAI_OS_Plano_Mestre_v043.xlsx`
> O versionamento interno 1.0 → 2.0 do Markdown é independente da sequência executiva v041, v042, v043.

## 1. Diretriz geral
O FluxAI OS™ é o Sistema Operacional de Crescimento da FluxAI Labs.
A prioridade atual é concluir a homologação final com controle, sem:
* abrir novas frentes;
* alterar cenários já homologados;
* misturar teste e produção;
* ligar todos os Schedules de uma vez;
* automatizar envio externo sem revisão humana;
* tratar ausência de dados como zero;
* misturar Instagram API e Instagram manual.

Nenhuma execução crítica deve ocorrer sem mapeamento validado, evidências registradas e compatibilidade confirmada entre cenário, cliente e modo de operação.

## 2. Estado Estratégico Atual

[x] Fase 1 — Proxy Make Seguro
[x] Fase 2A — Onboarding Seguro em Cópia
[x] Fase 2A.1 — Virada Controlada do Onboarding Seguro
[x] Fase 2M — Mapa de Coerência entre Ferramentas
[x] PACOTE SEGURO 01 — Auditoria Cruzada
[x] PACOTE SEGURO 02 — Saneamento Documental
[x] PACOTE SEGURO 03 — Remapeamento dos Cenários 03–08
[~] PACOTE SEGURO 04 — Teste Controlado de Métricas
[!] Execução automática bloqueada (Schedules OFF)
[!] Relatório mensal real bloqueado
[!] Supabase/Auth/RBAC pendente (Bloco 04 aguardando Docker local para validação empírica)
[!] ROTA 10/12 Serviços Extras bloqueada
[!] IA operacional completa bloqueada
[~] Mapa completo da planilha (Google Sheets)
[~] Mapa Make, rotas, filtros e proxy (Bloco 06 - Fase 1 Concluída)

## 3. Prioridade Estratégica (Ordem Obrigatória)

1. **Resolver o bloqueador WSL/Docker e validar a fundação em execução (Blocos 04, 06 e 07).**
2. **Somente após a prova empírica (PASS) nestes 3 blocos:** Liberar o Pacote Seguro 04 (Rota Piloto Controlada).

---

## 4. Rodada de Validação Empírica (Bloqueio Atual)

A infraestrutura local do Docker/WSL está atualmente com falha (`read-only file system`). Assim que for restabelecida, a seguinte matriz de testes deve ser executada obrigatoriamente:

### Rodada 1 — Bloco 04 (RLS)
- `CLIENTE_A` vê apenas `CLIENTE_A` (Esperado: PASS)
- `CLIENTE_B` vê apenas `CLIENTE_B` (Esperado: PASS)
- `ADMIN` vê tudo (Esperado: PASS)
- `SEM_CLIENTE` vê nada (Esperado: PASS)

### Rodada 2 — Bloco 06 (Proxy)
- Envio sem JWT (Esperado: 401 Unauthorized)
- Envio com JWT válido (Esperado: 202 Accepted)
- Requisição duplicada com mesma Idempotency-Key (Esperado: 409 Conflict)
- Criação e validação do registro em `transactions` (Esperado: status=processing)

### Rodada 3 — Bloco 07 (Observabilidade)
- Verificação da cadeia de eventos no banco de dados (`transaction_events`):
  1. `proxy_received`
  2. `proxy_authenticated`
  3. `proxy_dispatched`
  4. `make_received`
  5. `make_processing`
  6. `business_completed`
- Teste Final: `SELECT * FROM transaction_events WHERE correlation_id = 'TX_TESTE';` deve retornar a linha do tempo completa.

Somente ao atingir o status **PASS** em todas as três rodadas, os Blocos 04, 06 e 07 receberão a chancela de "HOMOLOGADO" e o programa avançará para o Pacote Seguro 04.

---

## 5. Próxima Fase Segura Autorizada (Pós-Homologação)

**Objetivo:** Concluir o **PACOTE SEGURO 04** seguindo a ordem validada, com testes controlados, um cenário por vez, sem alterar clientes, filtros permanentes ou `modo_coleta` para forçar compatibilidade.

### Documentação de Execução da Próxima Fase:

**1. Qual ferramenta será analisada?**
- Make.com (Cenários restantes do Pacote Seguro 04 afetando métricas) e a respectiva comunicação com a Matriz Mestra (Google Sheets).

**2. Qual evidência será utilizada?**
- Histórico de execução de testes manuais (Run Once), blueprints exportados, planilhas geradas em abas segregadas de teste.

**3. O que pode apenas ser mapeado?**
- Estruturas de dados em produção real (nenhum envio ou insert no banco produtivo deve ser feito). O estado atual dos cenários do Pacote Seguro 04.

**4. O que não pode ser alterado ainda?**
- Não alterar clientes da base de produção.
- Não alterar filtros permanentes de execução no Make.
- Não alterar o `modo_coleta` nativo.
- Não religar Schedules.

**5. Qual teste valida a etapa?**
- Execução isolada em modo "Run Once" no Make, comprovando que o dado foi processado corretamente e alimentou as métricas apenas no ambiente de teste/sandbox (ou aba de homologação), sem misturar produção.

**6. Qual risco precisa ser evitado?**
- Corrupção da Matriz Mestra oficial.
- Quebra de lógica dinâmica ou inconsistência de dados entre Supabase e Planilha.
- Vazamento de "Ghost States" (dados de teste computados como faturamento real).

---

## 5. Rastreabilidade Documental e Evidências Técnicas
Este índice consolida os artefatos comprobatórios das auditorias executadas, servindo como base de conhecimento técnico.

*   **Evidência do Pacote Seguro 01:** `docs/AUDITORIA_CRUZADA_PLANILHA_MAKE_BLUEPRINTS.md`
*   **Evidência Fase 2A.1 (Onboarding):** `docs/CHECKPOINT_PRE_VIRADA_FASE_2A1_ONBOARDING.md`
*   **Pacote Seguro 04 (Teste de Métricas):** `docs/CHECKPOINT_PACOTE_SEGURO_04_TESTE_METRICAS_FLUXAI.md` e `docs/ROTEIRO_EXECUCAO_PACOTE_SEGURO_04_RUN_ONCE.md`
*   **Matriz Mestra de Cenários:** `docs/CHECKPOINT_MATRIZ_MESTRA_CENARIOS_MAKE.md`
*   **Auditoria Proxy (Bloco 06):** Diretório `docs/staging/Bloco06/`
*   **Implementação RLS (Bloco 04):** `supabase/migrations/20260626000001` a `04`
*   **Auditoria Identity (Micro-Gate CORE-001.0):** `C:\Users\BRENDA\Desktop\FLUXAI_DISK_EVIDENCE\CORE_001_0`
*   **Reconciliação Final de Infraestrutura (Gate 2.0C.4M.1A):** `D:\FLUXAI_DATA\03_EVIDENCIAS\FLUXAI_DISK_EVIDENCE\2026\GATE_2_0C_4M_1A`
*   **Criação Template Oficial (Micro-Gate TBP-001):** `docs/TBP-001_TEMPLATE_OFICIAL_BLUEPRINT.md` e `docs/auditorias/MICRO_GATE_TBP_001_EVIDENCIAS.md`

---

## 6. Estado Oficial (Frente de Infraestrutura)
*   **Status Atual:** CONCLUÍDO DEFINITIVAMENTE (Micro-Gate 2.0C.4M.1B).
*   **Percentual da Frente:** 100%.
*   **Arquitetura Base:** Auditoria CORE-001.0 finalizada. O Workspace e Identity Capability podem prosseguir em paralelo.

## 7. Política Oficial de Armazenamento
*   **Repositório Oficial:** `D:\FLUXAI_DATA` (Fonte oficial de todos os artefatos homologados).
*   **Ambiente de Trabalho:** `C:` (Utilizado apenas para desenvolvimento, execução temporária e arquivos de trabalho).
*   **Gestão de Espaço:** Arquivos homologados não deverão permanecer duplicados entre C: e D:.

