# ROTEIRO DE EXECUÇÃO: PACOTE SEGURO 04 (RUN ONCE)

**Regras e Bloqueios Operacionais (Obrigatórios):**
*   **Gate de Cliente:** `Cliente preferencial de teste: FLUXAI_LABS_001, condicionado à compatibilidade entre cenário, serviço contratado, rota autorizada e modo_coleta.`
*   **Fuso Horário:** `[ ] Fuso da planilha confirmado como America/Bahia` (Nenhum schedule poderá ser ativado enquanto o fuso estiver diferente).
*   **Schedules Ativos:** OFF em todos os cenários.
*   **Módulos de Envio (E-mail/Notificação):** Bloqueio absoluto para disparo a cliente externo.

Antes de qualquer "Run Once", é OBRIGATÓRIO confirmar se todas essas condições da Rota/Cenário passam no Gate:
- [ ] cliente ativo
- [ ] cenário compatível
- [ ] serviço ativo
- [ ] rota autorizada
- [ ] modo_coleta compatível
- [ ] relatório_incluir compatível
- [ ] credenciais disponíveis
- [ ] Schedule OFF

---

## 🚫 CENÁRIOS NÃO APLICÁVEIS / BLOQUEADOS

*(Vazio - Todos os cenários validados ou movidos para homologação final)*

---

## ✅ CENÁRIOS CONCLUÍDOS / HOMOLOGADOS

### `03_FLUXAI_INSTAGRAM_MANUAL_READER_REMAPEADO_TESTE`
*   **Status:** HOMOLOGADO FUNCIONALMENTE
*   **Resultados:** Leitura manual diária/conteúdo consolidadas, idempotência validada por `client_id + semana_inicio`.
*   **Schedule:** OFF.

### `04_FLUXAI_CONTENT_INTELLIGENCE_REMAPEADO_TESTE`
*   **Status:** HOMOLOGADO FUNCIONALMENTE EM TESTE
*   **Resultados:** Router manual/API executado com sucesso e protegido contra duplicidade. Aba `32_INSTAGRAM_CONTEUDO_API` implementada como fonte oficial.
*   **Schedule:** OFF.

### `06_FLUXAI_META_SYNC_REMAPEADO_TESTE`
*   **Instagram Profile:** Homologado.
*   **Instagram Insights:** Homologado.
*   **Meta Ads sem campanhas (Módulo 30):** Homologado.
*   **Meta Ads com campanhas (Módulo 8):** Configurado como destino final, mas **pendente de homologação** por ausência de campanhas reais ativas no momento do teste.
*   **Linha fantasma:** Corrigida (Excluída da arquitetura final pelos novos filtros da UI).
*   **Schedule:** OFF.

### `07_FLUXAI_RELATORIO_MENSAL_REMAPEADO_TESTE`
*   **Status:** HOMOLOGADO FUNCIONALMENTE EM TESTE CONTROLADO — ESCOPO PARCIAL DE INSTAGRAM API
*   **Resultados:** Seleciona cliente ativo em `04_CLIENTES_CONFIG`, valida o serviço Instagram API em `03_SERVICOS_CLIENTES`, lê registros em `23_INSTAGRAM_DIARIO`, grava exclusivamente em `29_ANALISE_MENSAL_CLIENTE` mantendo como rascunho interno.
*   **Governança:** `chave_idempotencia`, `origem_dados`, `modo_coleta`, `status_processamento`, `observacoes_processamento`, `data_criacao`, `data_atualizacao`. Chave homologada: `client_id + mes_referencia` (Ex: `FLUXAI_LABS_001_2026-06`).
*   **Schedule:** OFF. (Travas mantidas: nenhum e-mail, nenhum webhook, nenhuma publicação, nenhuma rota manual validada).

### `08_FLUXAI_CLIENT_STATUS_MONITOR_REMAPEADO_TESTE`
*   **Status:** HOMOLOGADO FUNCIONALMENTE
*   **Resultados:** 26 operações executadas (11 linhas em `STATUS_MONITOR_DIARIO`). Status `manual_ativo` gerado correto sob condição transitória.
*   **Schedule:** OFF.

### `19_FLUXAI_CONSOLIDADO_DIARIO`
*   **Status:** HOMOLOGADO FUNCIONALMENTE EM RUN ONCE
*   **Resultados:** Agrupamento por `client_id`, separação IG API/Manual. Idempotência e bloqueio de ROTA_DUPLICIDADE testados e homologados na aba 27.
*   **Schedule:** OFF.

---

## 🚀 ORDEM OPERACIONAL (PENDENTE DE EXECUÇÃO)

### 1. 05_FLUXAI_DAILY_SYNC_REMAPEADO_TESTE

**Inspeção Pré-Teste (Confirmar visualmente na UI do Make):**
- [ ] Módulos do cenário inspecionados
- [ ] Abas de origem confirmadas
- [ ] Abas de destino confirmadas (`20_GA4_DIARIO`, `21_SEARCH_CONSOLE_DIARIO`, `22_CLARITY_DIARIO`)
- [ ] Filtros corretos configurados
- [ ] Cliente fixado para o teste configurado
- [ ] Período/Data de leitura verificado
- [ ] Credenciais (Tokens/Keys) validadas e sem erro de permissão
- [ ] Módulos de escrita mapeados
- [ ] Ausência de módulo de envio/notificação externa

**Resultados do Teste:**

| Parâmetro | Preenchimento |
| :--- | :--- |
| **Abas confirmadas antes do teste:** | |
| **Linhas existentes antes da limpeza:** | |
| **Limpeza autorizada (S/N):** | |
| **Data/período consultado:** | |
| **Resultado esperado por aba:** | |
| **Serviços não aplicáveis:** | |
| **Linhas criadas depois do Run Once:** | |
| **Linhas incompletas (Sim/Não):** | |
| **Duplicações (Sim/Não):** | |
| **Mistura de client_id (Sim/Não):** | |
| **Erro de autenticação (Descreva):** | |

