# PACOTE SEGURO 01 — Auditoria Cruzada Planilha x Make Blueprints

Esta auditoria foi executada de forma **Read-Only** diretamente nos mapeamentos JSON extraídos da planilha de produção (`FluxAI_Intelligence_Base_Ecossistema_Make`) e nos Blueprints exportados do Make. O objetivo é assegurar a estabilidade do ecossistema mapeando dependências legadas, conflitos e cenários seguros para operação.

---

## 1. Resumo da Planilha

A partir do arquivo `MAPA_COMPLETO_PLANILHA_FLUXAI_OS_20260612_113208.json`:

*   **Nome da Planilha:** `FluxAI_Intelligence_Base_Ecossistema_Make`
*   **Spreadsheet ID:** `1-MZBzS2KOZ_pSIR9rVX_mkecdvmQjF9j9q8ahMKqxQE`
*   **Total de abas reportadas:** 49
*   **Abas Reais (Algumas principais):** `01_CLIENTES_ESTRATEGIA`, `02_CONTRATOS_CLIENTES`, `03_SERVICOS_CLIENTES`, `04_CLIENTES_CONFIG`, `05_ROTAS_AUTOMACOES`, `06_SERVICOS_EXTRAS_CLIENTES`, `07_DEMANDAS_CLIENTES`, `LEADS_SITE`, `CLIENTES_ARQUIVOS`, `10_IA_CREDITOS_CLIENTE`, `GPT_GERACOES_LOG`, etc.
*   **Abas com validação de dados:** 22 abas possuem dropdowns de segurança (Status, Tipo, etc).
*   **Abas vazias / Mock:** 9 abas (ex: `06_SERVICOS_EXTRAS_CLIENTES`, `11_DNA_CLIENTE_GPT`, etc).
*   **Abas com campos de link/webhook:** 14 abas (ex: `ROTAS_OS_MAKE`, `02_CONTRATOS_CLIENTES`).

---

## 2. Inventário dos Blueprints Make

Varredura dos arquivos `blueprint*.json`:

*   `blueprint(2).json`: **[HOMOLOGADO] 01_FLUXAI_PORTAL_DEMANDAS** (Filter, AddRow) | Abas: `01_CLIENTES_ESTRATEGIA`, `07_DEMANDAS_CLIENTES`, `GPT_GERACOES_LOG` | Supabase: Não | WebhookResp: Não
*   `blueprint(16).json`: **[HOMOLOGADO] 02_FLUXAI_LEADS_SITE** (AddRow) | Abas: `LEADS_SITE` | Supabase: Não | WebhookResp: Sim
*   `blueprint(3).json`: **03_FLUXAI_INSTAGRAM_MANUAL_READER** | Abas: `SERVICOS_CLIENTES`, `CLIENTES_CONFIG`, `INSTAGRAM_MANUAL_DIARIO`, etc.
*   `blueprint(9).json`: **04_FLUXAI_CONTENT_INTELLIGENCE** | Abas: `SERVICOS_CLIENTES`, `CLIENTES_CONFIG`, `INSTAGRAM_CONTEUDO_MANUAL`, etc.
*   `blueprint(8).json`: **05_FLUXAI_DAILY_SYNC** | Abas: `SERVICOS_CLIENTES`, `CLIENTES_CONFIG`, `CONSOLIDADO_DIARIO`, etc | Supabase: Sim
*   `blueprint(17).json`: **06_FLUXAI_META_SYNC** | Abas: `ROTAS_AUTOMACOES`, `CLIENTES_CONFIG`, `SERVICOS_CLIENTES`
*   `blueprint(7).json`: **07_FLUXAI_RELATORIO_MENSAL** | Abas: `CLIENTES_CONFIG`, `SERVICOS_CLIENTES`
*   `blueprint(11).json`: **08_FLUXAI_CLIENT_STATUS_MONITOR** | Abas: `SERVICOS_CLIENTES`, `CLIENTES_CONFIG`, `ROTAS_AUTOMACOES`
*   `blueprint(5).json`: **09_FLUXAI_NOVO_CLIENTE_ONBOARDING_FASE_2A_RASCUNHO** | Abas: `01_CLIENTES_ESTRATEGIA`, `04_CLIENTES_CONFIG`, `03_SERVICOS_CLIENTES`, `02_CONTRATOS_CLIENTES`, `11_DNA_CLIENTE_GPT`, `CLIENTES_ARQUIVOS` | Supabase: Não | Drive: Não explícito (links).
*   `blueprint(13).json`: **[HOMOLOGADO] 10_FLUXAI_SERVICO_EXTRA_REQUEST** | Abas: `06_SERVICOS_EXTRAS_CLIENTES`, `08_FINANCEIRO_CLIENTES`, `07_DEMANDAS_CLIENTES`, `09_COMUNICACOES_CLIENTE`, `10_IA_CREDITOS_CLIENTE` | Supabase: Sim (upsertARecord).
*   `blueprint(14).json`: **[HOMOLOGADO] 11_FLUXAI_IA_CREDITOS_CONTROLE...** | Abas: `IA_GERACOES_CONTROLE`, `10_IA_CREDITOS_CLIENTE`
*   `blueprint(6).json`: **[HOMOLOGADO] 13_FLUXAI_IA_GUARDRAIL...** | Abas: `10_IA_CREDITOS_CLIENTE`
*   `blueprint(4).json`: **[HOMOLOGADO] 14_FLUXAI_CLIENTES_ARQUIVOS_SYNC** | Abas: `01_CLIENTES_ESTRATEGIA`, `CLIENTES_ARQUIVOS`, `GPT_GERACOES_LOG`
*   `blueprint(18).json`: **[HOMOLOGADO] 15_FLUXAI_PLANEJAMENTO_CONTEUDO** | Abas: `10_IA_CREDITOS_CLIENTE`
*   `blueprint(10).json`: **[HOMOLOGADO] 16_FLUXAI_CALENDARIO_POSTAGENS** | Abas: `PLANEJAMENTO_CONTEUDO`
*   `blueprint(1).json`: **17_FLUXAI_GPT_GERACOES_LOG** | Abas: `GPT_GERACOES_LOG`

---

## 3. Cruzamento de Abas e 4. Divergências de Nomes Antigos

A varredura revela que as planilhas base foram renomeadas (ganharam prefixos numéricos), mas vários cenários de automação e métricas ainda apontam para os nomes antigos.

| Cenário Make | Aba Chamada no Fluxo | Existe Atual? | Nome Atual Provável | Gravidade |
| :--- | :--- | :--- | :--- | :--- |
| `05_FLUXAI_DAILY_SYNC` | `CLIENTES_CONFIG` | **NÃO** | `04_CLIENTES_CONFIG` | CRÍTICA |
| `05_FLUXAI_DAILY_SYNC` | `SERVICOS_CLIENTES` | **NÃO** | `03_SERVICOS_CLIENTES` | CRÍTICA |
| `05_FLUXAI_DAILY_SYNC` | `GA4_DIARIO` | **NÃO** | `20_GA4_DIARIO` | ALTA |
| `08_STATUS_MONITOR` | `ROTAS_AUTOMACOES` | **NÃO** | `05_ROTAS_AUTOMACOES` | CRÍTICA |
| `03_INSTAGRAM_MANUAL` | `CONSOLIDADO_DIARIO` | **NÃO** | `27_CONSOLIDADO_DIARIO` | ALTA |

**Recomendação Global:** Todos os cenários (03, 04, 05, 06, 07, 08) que realizam tracking diário e monitoramento estão **BLOQUEADOS** para uso em produção até que os módulos do Google Sheets nesses cenários sejam remapeados para os novos nomes de aba.

---

## 5. Classificação por Risco e Status

| Cenário | Rotas Relacionadas | Usa Abas Atuais? | Usa Abas Antigas? | Supabase? | Drive? | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 01_PORTAL_DEMANDAS | 01 | Sim | Não | Não | Não | **OK** |
| 02_LEADS_SITE | 02 | Sim | Não | Não | Não | **OK** |
| 05_DAILY_SYNC | N/A | Não | **Sim** | Sim | Não | **BLOQUEADO** |
| 06_META_SYNC | N/A | Não | **Sim** | Não | Não | **BLOQUEADO** |
| 07_RELATORIO_MENSAL | N/A | Não | **Sim** | Não | Não | **BLOQUEADO** |
| 08_STATUS_MONITOR | N/A | Não | **Sim** | Não | Não | **BLOQUEADO** |
| 09_ONBOARDING_FASE_2A | 09 | Sim | Não | Não | Não | **SEGURO** |
| 10_SERVICO_EXTRA | 10 | Sim | Não | **Sim** | Não | **REVISAR** |
| 11_CREDITOS_CONTROLE | 11 | Sim | Não | Não | Não | **OK** |
| 13_IA_GUARDRAIL | 13 | Sim | Não | Não | Não | **OK** |
| 14_ARQUIVOS_SYNC | 14 | Sim | Não | Não | Não | **OK** |
| 17_GPT_GERACOES_LOG | 17 | Sim | Não | Não | Não | **OK** |

---

## 6. Atenção Especial & Validações Específicas

### 7. Validar ROTA 01 (Demandas)
*   **Resultados:** Positivo. O cenário usa `01_CLIENTES_ESTRATEGIA` para validação do client_id, escreve a demanda na `07_DEMANDAS_CLIENTES` e grava logs em `GPT_GERACOES_LOG` (que funciona de tabela de log genérica no Make). Segura.

### 8. Validar ROTA 09 (Onboarding Fase 2A Seguro)
*   **Resultados:** Aprovado. O blueprint (Cópia Fase 2A Rascunho) referencia perfeitamente: `01_CLIENTES_ESTRATEGIA`, `04_CLIENTES_CONFIG`, `03_SERVICOS_CLIENTES`, `02_CONTRATOS_CLIENTES`, `11_DNA_CLIENTE_GPT` e `CLIENTES_ARQUIVOS`. 
*   **Risco Supabase/Auth/IA:** Não utiliza módulo do Supabase. Não utiliza módulos de ativação explícita de IA. 
*   **Status:** Apta para produção após Correção de UTF-8 (acentuação) e rotação de Webhook.

### 9. Validar Métricas e Relatórios (05, 06, 07, 08)
*   **Resultados:** Reprovado. Estes cenários quebram imediatamente se ativados pois utilizam nomes antigos como `GA4_DIARIO` (agora `20_GA4_DIARIO`) e `CLIENTES_CONFIG` (agora `04_CLIENTES_CONFIG`). Devem ficar inativos/bloqueados no Make.

### 10. Validar Serviços Extras (ROTA 10 e 12)
*   **Resultados ROTA 10:** O cenário usa `06_SERVICOS_EXTRAS_CLIENTES` (correto). Porém, também realiza gravações automatizadas na `08_FINANCEIRO_CLIENTES` e invoca o Supabase (`supabase:upsertARecord`). Existe grave risco de **Faturamento Automático** ou distorção financeira se aprovado sem crivo. Teste E2E massivo é obrigatório antes de expor ao cliente. 
*   **Resultados ROTA 12:** Não localizado arquivo isolado, sugerindo que a Aprovação ocorre internamente ou necessita de um blueprint secundário.

### 11. Validar IA (11, 13, 17)
*   **Resultados:** Rota 11 e 13 utilizam corretamente a aba oficial `10_IA_CREDITOS_CLIENTE`. A aba `IA_GERACOES_CONTROLE` (ou `GPT_GERACOES_LOG`) é usada para fallback e bloqueio lógico. Rotas de consumo de IA estão bem roteirizadas e utilizam as abas atualizadas.

---

## 12. Conclusão Executiva

1.  **Cenários Seguros Hoje:** 01, 02, 09 (Cópia 2A), 11, 13, 14, 17. 
2.  **Cenários Bloqueados (Erro de Aba):** 03, 04, 05, 06, 07, 08. **O que fazer:** Necessitam remapeamento manual aba por aba dentro da interface visual do Make.co.
3.  **Cenários de Risco Financeiro:** ROTA 10 de Serviços Extras não pode ser ativada ainda. Possui gravação automática no Supabase e Financeiro. Precisa de Teste E2E e ajuste do botão do Portal (que está apontando para ROTA 01).
4.  **Ação Imediata (Lote):** O Onboarding 2A pode sofrer a virada técnica para produção após receber os ajustes de UTF-8 e troca do Webhook, já que ele foi construído usando as abas renomeadas corretamente.

---

## 13. Sugestão de Atualização do Plano-Mestre

Adicionar no final do `docs/PLANO_MESTRE_AUDITORIA_FINAL_FLUXAI_OS.md`:

```markdown
## PACOTE SEGURO 01 — Auditoria Cruzada Planilha x Make
[x] Arquivos JSON de blueprints e mapeamento recebidos
[x] Auditoria em execução (Concluída - MAPA SEGURO GERADO)
[ ] Correções pendentes por cenário (05, 06, 07, 08 precisam ter abas religadas no Make)
[ ] Teste E2E de Serviço Extra (Rota 10 Financeiro/Supabase)
[ ] Produção ainda bloqueada para métricas automatizadas e extra.
[ ] FASE 2A liberada para virada final (UTF-8 + Webhook novo)
```
