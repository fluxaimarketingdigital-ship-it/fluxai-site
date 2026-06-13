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
*   **Status:** NÃO APLICÁVEL TEMPORARIAMENTE (Bloqueado)
*   **Motivo:** A linha de `modo_coleta = manual` da `FLUXAI_LABS_001` está propositalmente isolada em status `teste_bloqueado` com `uso_operacional = teste`.
*   **Como Destravar (Apenas para Homologação Futura):**
    1. Alterar `status_servico` para `ativo_teste`.
    2. Alterar `status_validacao` para `em_teste`.
    3. Manter `relatorio_incluir` como `nao`.
    4. Garantir que os filtros no Make busquem exclusivamente o modo_coleta manual.
*   **Run Once:** NÃO EXECUTADO ATÉ A ATIVAÇÃO MANUAL DE TESTE.

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

**🔒 Regras de Segurança e Preparação (Checklist Técnico):**
A arquitetura do blueprint atual não apresentou módulos nativos de disparo. No entanto, é OBRIGATÓRIA a inspeção visual na UI do Make antes do teste, garantindo o bloqueio total.

- [ ] **Lista Completa de Módulos Inspecionados na UI:** Confirmar se há apenas (Google Sheets: 1, 2, 6, 23, 22 e Router 3).
- [ ] **Identificação de Envios Externos:** Identificar se algum módulo de `Email`, `Gmail`, `WhatsApp`, `Slack` ou `Webhook (HTTP)` foi adicionado à cópia de teste.
- [ ] **Procedimento de Bloqueio Físico (Caso exista módulo de envio):** 
    1. Desconectar o módulo fisicamente na UI; ou 
    2. Adicionar um filtro impossível (Ex: Condição `1 = 2`) na rota que leva ao módulo de envio.
- [ ] **Abas Lidas:** `04_CLIENTES_CONFIG`, `03_SERVICOS_CLIENTES` e `23_INSTAGRAM_DIARIO`.
- [ ] **Aba de Destino:** `29_ANALISE_MENSAL_CLIENTE`.
- [ ] **Cliente Utilizado:** `FLUXAI_LABS_001`.
- [ ] **Período do Relatório:** Validar se a data consultada no Make condiz com o mês em vigor (somente teste interno).
- [ ] **Schedule OFF:** Confirmado.
- [ ] **Garantia de Isolamento:** Nenhum cliente externo será notificado. O relatório será gravado estritamente de forma silenciosa na aba.

*(Não executar o Cenário 07 automaticamente. Aguardar inspeção visual e autorização manual na UI do Make)*
