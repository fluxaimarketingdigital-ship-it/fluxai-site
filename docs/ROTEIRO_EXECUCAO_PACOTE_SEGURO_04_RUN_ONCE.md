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

### `03_FLUXAI_INSTAGRAM_MANUAL_READER_REMAPEADO_TESTE`
*   **Status:** NÃO APLICÁVEL TEMPORARIAMENTE
*   **Motivo:** Ausência de cliente ativo com `modo_coleta = manual` (O cliente `FLUXAI_LABS_001` utiliza coleta API/Meta).
*   **Run Once:** NÃO EXECUTADO

---

### `04_FLUXAI_CONTENT_INTELLIGENCE_REMAPEADO_TESTE`
*   **Status:** BLOQUEADO TEMPORARIAMENTE
*   **Motivo:** Erro `400 INVALID_ARGUMENT` devido ao destino legado `INSIGHTS_CONTEUDO` e incompatibilidade do modo_coleta API com a antiga Rota Manual.
*   **Ação Pendente (Admin):** Reestruturar a arquitetura na UI do Make com um Router Primário:
    *   **Rota Manual:** Lê de `25_INSTAGRAM_CONTEUDO_MANUAL` ➔ Grava em `31_INSIGHTS_CONTEUDO`
    *   **Rota API:** Lê via Meta API ➔ Grava em `31_INSIGHTS_CONTEUDO`
*   **Run Once:** NÃO EXECUTAR até a arquitetura estar 100% refletida no Make.

---

## ✅ CENÁRIOS CONCLUÍDOS / HOMOLOGADOS

### `06_FLUXAI_META_SYNC_REMAPEADO_TESTE`
*   **Instagram Profile:** Homologado.
*   **Instagram Insights:** Homologado.
*   **Meta Ads sem campanhas (Módulo 30):** Homologado.
*   **Meta Ads com campanhas (Módulo 8):** Configurado como destino final, mas **pendente de homologação** por ausência de campanhas reais ativas no momento do teste.
*   **Linha fantasma:** Corrigida (Excluída da arquitetura final pelos novos filtros da UI).
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
### 2. 08_FLUXAI_CLIENT_STATUS_MONITOR_REMAPEADO_TESTE
*(Preenchimento bloqueado. Aguardar conclusão do Cenário 04)*

---

### 4. 07_FLUXAI_RELATORIO_MENSAL_REMAPEADO_TESTE (ÚLTIMO)

**🔒 Regra de Segurança Máxima:**
Qualquer módulo de *e-mail, WhatsApp, notificação, webhook externo, ou envio ao cliente* deve estar **fisicamente desabilitado, desconectado ou bloqueado por filtro impossível** na cópia de teste (`1 = 2`, por exemplo).
- [ ] Critério de Gate: `Notificou cliente externo = NÃO`
*(Uma falha neste gate implica o bloqueio total do Pacote 04)*
