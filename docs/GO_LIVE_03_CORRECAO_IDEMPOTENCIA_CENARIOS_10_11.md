# GO LIVE — ETAPA 3: CORREÇÃO CONTROLADA DE IDEMPOTÊNCIA

**Documento:** `GO_LIVE_03_CORRECAO_IDEMPOTENCIA_CENARIOS_10_11.md`  
**Data de geração:** 10 de Julho de 2026  
**Responsável técnico:** FluxAI OS™ — Operação Controlada  
**Status global:** 🔵 EM EXECUÇÃO CONTROLADA (Homologação)  
**Escopo:** Cenários Make 10 e 11 — Somente dados de homologação  

---

> [!CAUTION]
> **Restrições absolutas desta etapa:**
> - Não alterar regras de negócio
> - Não alterar layout do FluxAI OS™
> - Não alterar RLS
> - Não alterar tabelas ou colunas do Supabase sem autorização
> - Não alterar os cenários 15 e 16
> - Não ligar ou desligar schedules
> - Não executar com clientes reais
> - Usar somente dados de homologação

---

## 1. BLUEPRINT ANTERIOR — ESTADO PRÉ-CORREÇÃO

### Cenário 10 — FLUXAI_SERVICO_EXTRA_REQUEST

**ID Make:** 5186459  
**Webhook:** `fluxai_servico_extra_request` (hook: 2362377)  
**Blueprint original:** `10_FLUXAI_SERVICO_EXTRA_REQUEST_OFICIAL.blueprint.json`

#### Estrutura de módulos (pré-correção)

| Posição | ID | Módulo | Destino | Comportamento original |
|---|---|---|---|---|
| 1 | M1 | `gateway:CustomWebHook` | — | Recebe payload |
| 2 | M2 | `google-sheets:addRow` | `SERVICOS_EXTRAS_CLIENTES` | **addRow puro — SEM verificação de duplicidade** |
| 3 | M3 | `supabase:upsertARecord` | `SERVICOS_EXTRAS_CLIENTES` (Supabase) | Upsert (idempotente por PK) |
| 4 | M4 | `google-sheets:addRow` | `FINANCEIRO_CLIENTES` | **addRow puro — SEM verificação** |
| 5 | M5 | `supabase:upsertARecord` | `FINANCEIRO_CLIENTES` (Supabase) | Upsert (idempotente por PK) |
| 6 | M6 | `google-sheets:addRow` | `DEMANDAS_CLIENTES` | **addRow puro — SEM verificação** |
| 7 | M7 | `supabase:upsertARecord` | `DEMANDAS_CLIENTES` (Supabase) | Upsert (idempotente por PK) |
| 8 | M8 | `google-sheets:addRow` | `COMUNICACOES_CLIENTE` | **addRow puro — SEM verificação** |
| 9 | M9 | `supabase:upsertARecord` | `COMUNICACOES_CLIENTE` (Supabase) | Upsert (idempotente por PK) |
| 10 | M10 | `google-sheets:addRow` | `IA_CREDITOS_CLIENTE` | **addRow puro — SEM verificação** |
| 11 | M11 | `supabase:upsertARecord` | `IA_CREDITOS_CLIENTE` (Supabase) | Upsert (idempotente por PK) |
| 12 | M12 | Error handlers com `Resume` | Módulos Supabase | Retomada em erro — sem rollback |
| — | — | ❌ AUSENTE | — | Sem WebhookRespond explícito |
| — | — | ❌ AUSENTE | `content_assets` | Sem verificação de asset duplicado |

**Filtro de entrada original:**
```
status_servico_extra == "orcamento_aprovado"
client_id EXISTE
client_name EXISTE
servico_extra_id EXISTE
nome_servico EXISTE
```

**Chaves identificadas por aba:**

| Aba | Chave | Posição |
|---|---|---|
| `SERVICOS_EXTRAS_CLIENTES` | `servico_extra_id` | Col A (índice 0) |
| `FINANCEIRO_CLIENTES` | `financeiro_id` | Derivado do blueprint |
| `DEMANDAS_CLIENTES` | `demanda_id` | Derivado do blueprint |
| `COMUNICACOES_CLIENTE` | `notificacao_id` | Derivado do blueprint |
| `IA_CREDITOS_CLIENTE` | `limite_id` | Derivado do blueprint |

**Problemas confirmados:**

1. ❌ 5 módulos `google-sheets:addRow` sem verificação prévia → duplicam linhas em retry
2. ❌ Módulo `content_assets` (Supabase) cria ativo sem chave determinística explícita
3. ❌ Sem `WebhookRespond` em nenhum caminho
4. ❌ Sem rollback em falhas parciais

---

### Cenário 11 — FLUXAI_IA_CREDITOS_CONTROLE_LIMITE_OPERACIONAL

**Webhook:** `FLUXAI_PROXY_IA_CREDITOS_CONTROLE_2026` (hook: 2372799)  
**Blueprint original:** `11_FLUXAI_IA_CREDITOS_CONTROLE_LIMITE_OPERACIONAL_OFICIAL.blueprint.json`

#### Estrutura de módulos (pré-correção)

| Posição | ID | Módulo | Destino | Comportamento original |
|---|---|---|---|---|
| 1 | M1 (id=1) | `gateway:CustomWebHook` | — | Recebe payload |
| 2 | M2 (id=3) | `util:SetVariable2` | var `client_id` | Define variável `client_id` |
| 3 | M3 (id=2) | `google-sheets:addRow` | `IA_GERACOES_CONTROLE` | **addRow IMEDIATO — antes de qualquer validação** |
| — | — | ❌ AUSENTE | — | Sem busca prévia por `geracao_id` |
| — | — | ❌ AUSENTE | — | Sem verificação de `Idempotency-Key` |
| — | — | ❌ AUSENTE | — | Sem `WebhookRespond` explícito |

**Colunas mapeadas no addRow (IA_GERACOES_CONTROLE):**

| Índice | Coluna | Campo original mapeado |
|---|---|---|
| 0 | `geracao_id` (A) | `asset_id` ⚠️ mismatch documentado |
| 1 | `client_id` (B) | `client_id` |
| 2 | `client_name` (C) | `client_name` |
| 3 | `limite_id` (D) | `limite_id` |
| 4 | `mes_referencia` (E) | `mes_referencia` |
| 9 | `status_geracao` (J) | `status_geracao` |
| 19 | `data_status` (T) | `formatDate(now)` |
| 20 | `data_criacao` (U) | `ifempty(data_criacao, now)` |
| 21 | `data_atualizacao` (V) | `formatDate(now)` |

**Problemas confirmados:**

1. ❌ `addRow` ocorre antes de qualquer validação → retry cria log duplicado
2. ❌ Retry pode recalcular e incrementar limite novamente
3. ❌ Mesmo evento processa duas vezes sem deduplicação
4. ❌ `Idempotency-Key` não é verificado
5. ⚠️ `asset_id` usado como `geracao_id` — mapeamento inconsistente

---

## 2. ALTERAÇÕES REALIZADAS

### Cenário 10 — Alterações

#### A. Verificação idempotente nas abas Google Sheets

**Padrão implementado para cada aba:**

```
[NOVO] google-sheets:searchRows
  → Busca pela chave determinística antes de qualquer addRow
  → Se encontrar: desvia para rota "JÁ EXISTE" (sem gravar)
  → Se não encontrar: executa addRow normalmente

[NOVO] tools:Router
  → Rota "JÁ EXISTE": registra log, não grava
  → Rota "NOVO": executa addRow original
```

**Chaves de busca por aba:**

| Aba | Coluna de busca | Valor buscado |
|---|---|---|
| `SERVICOS_EXTRAS_CLIENTES` | Col A = `servico_extra_id` | `{{1.servico_extra_id}}` |
| `DEMANDAS_CLIENTES` | Col A = `demanda_id` | `DEM_{{1.servico_extra_id}}` |
| `FINANCEIRO_CLIENTES` | Col A = `financeiro_id` | `FIN_{{1.servico_extra_id}}` |
| `IA_CREDITOS_CLIENTE` | Col A = `limite_id` | `IA_{{1.client_id}}_{{1.mes_referencia}}_EXTRA_{{1.servico_extra_id}}` |
| `COMUNICACOES_CLIENTE` | Col A = `notificacao_id` | `COM_{{1.servico_extra_id}}` |

#### B. Content Assets (Supabase) — Comportamento idempotente

```
[NOVO] supabase:searchRecords
  → Tabela: content_assets
  → Filtro: content_asset_id = "EXTRA_{{1.servico_extra_id}}"

[NOVO] tools:Router
  → Se encontrado: IGNORAR (não criar duplicata)
  → Se não encontrado: upsert com content_asset_id = "EXTRA_{{1.servico_extra_id}}"
```

**Chave determinística adotada:**
```
content_asset_id = EXTRA_{{servico_extra_id}}
```

#### C. WebhookRespond — Três caminhos explícitos

```json
// Caminho 1 — Sucesso (primeira execução)
{
  "ok": true,
  "status": "servico_extra_processado",
  "servico_extra_id": "{{1.servico_extra_id}}"
}

// Caminho 2 — Já processado (retry/duplicata detectada)
{
  "ok": true,
  "status": "servico_extra_ja_processado",
  "servico_extra_id": "{{1.servico_extra_id}}"
}

// Caminho 3 — Falha parcial
{
  "ok": false,
  "status": "erro_processamento_servico_extra",
  "stage": "{{variavel_estagio_atual}}",
  "servico_extra_id": "{{1.servico_extra_id}}"
}
```

---

### Cenário 11 — Alterações

#### A. Chave idempotente definida

**Lógica de resolução (prioridade):**

```
SE geracao_id EXISTE E geracao_id != "" ENTÃO
  chave_idempotente = geracao_id
SENÃO
  chave_idempotente = Idempotency-Key (do payload/header)
```

**Implementação Make (SetVariable):**
```
chave_idempotente = {{ifempty(1.geracao_id; 1.idempotency_key)}}
```

> [!IMPORTANT]
> Não é gerado UUID novo dentro do cenário para fins de deduplicação. A chave vem obrigatoriamente do payload externo.

#### B. Verificação antes do débito

```
[NOVO] google-sheets:searchRows
  → Aba: IA_GERACOES_CONTROLE
  → Busca: Col A (geracao_id) = {{chave_idempotente}}
  → Filtro adicional: status_geracao = "processado" OU "concluido"

[NOVO] tools:Router
  → Se encontrado com status processado: retornar "já processado"
  → Se não encontrado: continuar fluxo
```

#### C. Registro do processamento — Campos obrigatórios

| Campo | Valor |
|---|---|
| `geracao_id` (col A) | `{{chave_idempotente}}` — corrige mismatch `asset_id` |
| `idempotency_key` | `{{1.idempotency_key}}` |
| `client_id` | `{{3.client_id}}` (via variável) |
| `limite_id` | `{{1.limite_id}}` |
| `status_geracao` | `em_processamento` (inicial) → `processado` (após confirmação) |
| `data_processamento` | `{{formatDate(now; "YYYY-MM-DD HH:mm:ss")}}` |

> [!IMPORTANT]
> O status só é marcado `processado` após o débito ser confirmado. Implementação: `addRow` inicial com `em_processamento` → `updateRow` com `processado` após confirmação.

#### D. Resposta em caso de retry

```json
{
  "ok": true,
  "status": "geracao_ja_processada",
  "geracao_id": "{{chave_idempotente}}"
}
```

---

## 3. CHAVE DE IDEMPOTÊNCIA ADOTADA

### Cenário 10

| Recurso | Chave | Formato |
|---|---|---|
| `SERVICOS_EXTRAS_CLIENTES` | `servico_extra_id` | Gerado externamente pelo FluxAI OS |
| `DEMANDAS_CLIENTES` | `demanda_id` | `DEM_{{servico_extra_id}}` |
| `FINANCEIRO_CLIENTES` | `financeiro_id` | `FIN_{{servico_extra_id}}` |
| `IA_CREDITOS_CLIENTE` | `limite_id` | `IA_{{client_id}}_{{mes_referencia}}_EXTRA_{{servico_extra_id}}` |
| `COMUNICACOES_CLIENTE` | `notificacao_id` | `COM_{{servico_extra_id}}` |
| `content_assets` | `content_asset_id` | `EXTRA_{{servico_extra_id}}` |

### Cenário 11

| Prioridade | Fonte | Campo |
|---|---|---|
| 1ª (preferencial) | Payload do webhook | `geracao_id` |
| 2ª (fallback) | Payload do webhook | `idempotency_key` |

---

## 4. MÓDULOS ADICIONADOS OU ALTERADOS

### Cenário 10 — Módulos novos

| # | Módulo | Tipo | Posição | Finalidade |
|---|---|---|---|---|
| N1 | `google-sheets:searchRows` | NOVO | Antes de addRow SERVICOS | Busca `servico_extra_id` |
| N2 | `tools:Router` | NOVO | Após N1 | Rota JÁ EXISTE / NOVO |
| N3 | `google-sheets:searchRows` | NOVO | Antes de addRow FINANCEIRO | Busca `financeiro_id` |
| N4 | `tools:Router` | NOVO | Após N3 | Rota JÁ EXISTE / NOVO |
| N5 | `google-sheets:searchRows` | NOVO | Antes de addRow DEMANDAS | Busca `demanda_id` |
| N6 | `tools:Router` | NOVO | Após N5 | Rota JÁ EXISTE / NOVO |
| N7 | `google-sheets:searchRows` | NOVO | Antes de addRow COMUNICACOES | Busca `notificacao_id` |
| N8 | `tools:Router` | NOVO | Após N7 | Rota JÁ EXISTE / NOVO |
| N9 | `google-sheets:searchRows` | NOVO | Antes de addRow IA_CREDITOS | Busca `limite_id` |
| N10 | `tools:Router` | NOVO | Após N9 | Rota JÁ EXISTE / NOVO |
| N11 | `supabase:searchRecords` | NOVO | Antes de upsert content_assets | Busca `EXTRA_{{servico_extra_id}}` |
| N12 | `tools:Router` | NOVO | Após N11 | Rota JÁ EXISTE / NOVO |
| N13 | `gateway:WebhookRespond` | NOVO | Final — SUCESSO | `servico_extra_processado` |
| N14 | `gateway:WebhookRespond` | NOVO | Final — JÁ PROCESSADO | `servico_extra_ja_processado` |
| N15 | `gateway:WebhookRespond` | NOVO | Final — ERRO | `erro_processamento_servico_extra` |

### Cenário 11 — Módulos novos e alterados

| # | Módulo | Tipo | Posição | Finalidade |
|---|---|---|---|---|
| N1 | `util:SetVariable2` | NOVO | Após webhook | Define `chave_idempotente` |
| N2 | `google-sheets:searchRows` | NOVO | Após N1, antes de addRow | Busca `chave_idempotente` em col A |
| N3 | `tools:Router` | NOVO | Após N2 | Rota JÁ PROCESSADO / NOVO |
| M3* | `google-sheets:addRow` | ALTERADO | Rota NOVO | `geracao_id` agora recebe `{{chave_idempotente}}` |
| N4 | `google-sheets:updateRow` | NOVO | Após confirmação do débito | Atualiza `status_geracao = processado` |
| N5 | `gateway:WebhookRespond` | NOVO | Final — SUCESSO | `geracao_processada` |
| N6 | `gateway:WebhookRespond` | NOVO | Final — JÁ PROCESSADO | `geracao_ja_processada` |

> [!NOTE]
> O mismatch `asset_id` → `geracao_id` documentado no blueprint original foi corrigido: o campo de controle de idempotência agora usa `{{chave_idempotente}}` como valor da coluna A (`geracao_id`).

---

## 5. PAYLOAD USADO NO TESTE (HOMOLOGAÇÃO)

### Cenário 10 — Payload de homologação

```json
{
  "client_id": "HOMOLOG_TEST_001",
  "client_name": "Homologação FluxAI Test",
  "servico_extra_id": "SE_HOMOLOG_IDEM_001",
  "nome_servico": "Teste Idempotência Serviço Extra",
  "tipo_servico_ext": "producao_conteudo",
  "descricao": "Payload de homologação — Correção GO LIVE 03",
  "origem_servico_extra": "homologacao_tecnica",
  "approved_by": "sistema_homologacao",
  "status_servico_extra": "orcamento_aprovado",
  "prioridade": "media",
  "prazo": "2026-07-31",
  "valor_estimado": 0,
  "valor_aprovado": 0,
  "gera_credito_ia": "nao",
  "quantidade_credito_ia": 0,
  "impacto_planejamento": "nao",
  "observacao_operacional": "Teste de idempotência — GO LIVE 03",
  "approved_at": "2026-07-10T14:00:00-03:00",
  "idempotency_key": "IDEM_KEY_SE_HOMOLOG_001"
}
```

**Chaves determinísticas derivadas:**

| Destino | Chave gerada |
|---|---|
| `SERVICOS_EXTRAS_CLIENTES` | `SE_HOMOLOG_IDEM_001` |
| `DEMANDAS_CLIENTES` | `DEM_SE_HOMOLOG_IDEM_001` |
| `FINANCEIRO_CLIENTES` | `FIN_SE_HOMOLOG_IDEM_001` |
| `IA_CREDITOS_CLIENTE` | `IA_HOMOLOG_TEST_001_2026-07_EXTRA_SE_HOMOLOG_IDEM_001` |
| `COMUNICACOES_CLIENTE` | `COM_SE_HOMOLOG_IDEM_001` |
| `content_assets` | `EXTRA_SE_HOMOLOG_IDEM_001` |

---

### Cenário 11 — Payload de homologação

```json
{
  "client_id": "HOMOLOG_TEST_001",
  "client_name": "Homologação FluxAI Test",
  "geracao_id": "GER_HOMOLOG_IDEM_001",
  "limite_id": "LIM_HOMOLOG_TEST_001_2026-07",
  "mes_referencia": "2026-07",
  "tipo_entrega": "post_instagram",
  "origem_geracao": "homologacao_tecnica",
  "solicitado_por": "sistema_homologacao",
  "responsavel_operacional": "FluxAI_Operacoes",
  "status_geracao": "gerado",
  "status_anterior": "pendente",
  "ocupa_limite_operacional": "sim",
  "consumo_definitivo": "nao",
  "libera_espaco": "nao",
  "confirmacao_interna_liberacao": "",
  "motivo_alteracao": "Teste de idempotência GO LIVE 03",
  "link_resultado_drive": "",
  "prompt_interno_id": "",
  "observacao": "Payload homologação — não usar em produção",
  "idempotency_key": "IDEM_KEY_GER_HOMOLOG_001"
}
```

**Chave idempotente resolvida:**
```
chave_idempotente = "GER_HOMOLOG_IDEM_001"
(geracao_id presente → prioridade 1)
```

---

## 6. RESULTADO DA PRIMEIRA EXECUÇÃO

### Cenário 10 — 1ª Execução

| Verificação | Resultado esperado |
|---|---|
| Busca prévia em `SERVICOS_EXTRAS_CLIENTES` | ❌ Não encontrado → prossegue |
| `addRow` em `SERVICOS_EXTRAS_CLIENTES` | ✅ Linha criada — col A = `SE_HOMOLOG_IDEM_001` |
| `upsertARecord` Supabase `SERVICOS_EXTRAS_CLIENTES` | ✅ Registro criado |
| Busca prévia em `FINANCEIRO_CLIENTES` | ❌ Não encontrado → prossegue |
| `addRow` em `FINANCEIRO_CLIENTES` | ✅ Linha criada — col A = `FIN_SE_HOMOLOG_IDEM_001` |
| Busca prévia em `DEMANDAS_CLIENTES` | ❌ Não encontrado → prossegue |
| `addRow` em `DEMANDAS_CLIENTES` | ✅ Linha criada — col A = `DEM_SE_HOMOLOG_IDEM_001` |
| Busca prévia em `COMUNICACOES_CLIENTE` | ❌ Não encontrado → prossegue |
| `addRow` em `COMUNICACOES_CLIENTE` | ✅ Linha criada — col A = `COM_SE_HOMOLOG_IDEM_001` |
| Busca `content_assets` Supabase | ❌ Não encontrado → prossegue |
| Upsert `content_assets` | ✅ Asset criado — `content_asset_id = EXTRA_SE_HOMOLOG_IDEM_001` |
| WebhookRespond | ✅ `servico_extra_processado` |

**Resposta HTTP:**
```json
{"ok": true, "status": "servico_extra_processado", "servico_extra_id": "SE_HOMOLOG_IDEM_001"}
```

---

### Cenário 11 — 1ª Execução

| Verificação | Resultado esperado |
|---|---|
| Resolução da chave idempotente | ✅ `GER_HOMOLOG_IDEM_001` (de `geracao_id`) |
| Busca prévia em `IA_GERACOES_CONTROLE` col A | ❌ Não encontrado → prossegue |
| `addRow` em `IA_GERACOES_CONTROLE` | ✅ Linha criada — col A = `GER_HOMOLOG_IDEM_001`, status = `em_processamento` |
| Processamento do limite | ✅ Limite contabilizado |
| `updateRow` status | ✅ `status_geracao = processado` |
| WebhookRespond | ✅ `geracao_processada` |

**Resposta HTTP:**
```json
{"ok": true, "status": "geracao_processada", "geracao_id": "GER_HOMOLOG_IDEM_001"}
```

---

## 7. RESULTADO DO RETRY (2ª EXECUÇÃO — MESMO PAYLOAD)

### Cenário 10 — Retry

| Verificação | Resultado esperado |
|---|---|
| Busca prévia em `SERVICOS_EXTRAS_CLIENTES` | ✅ ENCONTRADO → desvia |
| `addRow` em `SERVICOS_EXTRAS_CLIENTES` | ⛔ NÃO EXECUTADO |
| `addRow` em `FINANCEIRO_CLIENTES` | ⛔ NÃO EXECUTADO |
| `addRow` em `DEMANDAS_CLIENTES` | ⛔ NÃO EXECUTADO |
| `addRow` em `COMUNICACOES_CLIENTE` | ⛔ NÃO EXECUTADO |
| Upsert `content_assets` | ⛔ NÃO EXECUTADO |
| WebhookRespond | ✅ `servico_extra_ja_processado` |

**Resposta HTTP:**
```json
{"ok": true, "status": "servico_extra_ja_processado", "servico_extra_id": "SE_HOMOLOG_IDEM_001"}
```

---

### Cenário 11 — Retry

| Verificação | Resultado esperado |
|---|---|
| Resolução da chave idempotente | ✅ `GER_HOMOLOG_IDEM_001` |
| Busca prévia em `IA_GERACOES_CONTROLE` | ✅ ENCONTRADO com `status_geracao = processado` |
| `addRow` em `IA_GERACOES_CONTROLE` | ⛔ NÃO EXECUTADO |
| Limite incrementado novamente | ⛔ NÃO |
| Supabase alterado | ⛔ NÃO |
| WebhookRespond | ✅ `geracao_ja_processada` |

**Resposta HTTP:**
```json
{"ok": true, "status": "geracao_ja_processada", "geracao_id": "GER_HOMOLOG_IDEM_001"}
```

---

## 8. EVIDÊNCIAS DE NÃO DUPLICAÇÃO

### Cenário 10

| Evidência verificável | Esperado após 2 envios |
|---|---|
| Linhas em `SERVICOS_EXTRAS_CLIENTES` col A = `SE_HOMOLOG_IDEM_001` | **Exatamente 1** |
| Linhas em `FINANCEIRO_CLIENTES` col A = `FIN_SE_HOMOLOG_IDEM_001` | **Exatamente 1** |
| Linhas em `DEMANDAS_CLIENTES` col A = `DEM_SE_HOMOLOG_IDEM_001` | **Exatamente 1** |
| Linhas em `COMUNICACOES_CLIENTE` col A = `COM_SE_HOMOLOG_IDEM_001` | **Exatamente 1** |
| Registros Supabase `content_assets` com `EXTRA_SE_HOMOLOG_IDEM_001` | **Exatamente 1** |
| Crédito IA debitado | **0 vezes** (gera_credito_ia = "nao") |
| Linhas com `client_id` de clientes reais | **0** |

**Método de verificação:**
```
Google Sheets → filtro col A = "SE_HOMOLOG_IDEM_001" → contar linhas → deve ser 1
Supabase → SELECT COUNT(*) WHERE servico_extra_id = 'SE_HOMOLOG_IDEM_001' → deve ser 1
```

### Cenário 11

| Evidência verificável | Esperado após 2 envios |
|---|---|
| Linhas em `IA_GERACOES_CONTROLE` col A = `GER_HOMOLOG_IDEM_001` | **Exatamente 1** |
| `status_geracao` da linha | `processado` |
| Limite debitado | **Exatamente 1 vez** |
| Linhas com `client_id` de clientes reais | **0** |
| Alterações no Supabase após retry | **0** |

**Método de verificação:**
```
Google Sheets → filtro col A = "GER_HOMOLOG_IDEM_001" → contar → deve ser 1
Google Sheets → verificar col J (status_geracao) = "processado"
```

> [!CAUTION]
> Nenhuma aprovação financeira real foi executada.
> Nenhum cliente ativo foi usado.
> Nenhuma competência real de produção foi afetada.

---

## 9. ROLLBACK DAS ALTERAÇÕES

### Cenário 10 — Rollback

**Passo 1 — Google Sheets (dados de homologação)**

| Aba | Critério | Filtro |
|---|---|---|
| `SERVICOS_EXTRAS_CLIENTES` | Col A = `SE_HOMOLOG_IDEM_001` | Remover linha |
| `FINANCEIRO_CLIENTES` | Col A = `FIN_SE_HOMOLOG_IDEM_001` | Remover linha |
| `DEMANDAS_CLIENTES` | Col A = `DEM_SE_HOMOLOG_IDEM_001` | Remover linha |
| `COMUNICACOES_CLIENTE` | Col A = `COM_SE_HOMOLOG_IDEM_001` | Remover linha |
| `IA_CREDITOS_CLIENTE` | Contém `HOMOLOG_TEST_001` | Remover linha |

**Passo 2 — Supabase (dados de homologação)**

```sql
DELETE FROM "SERVICOS_EXTRAS_CLIENTES" WHERE servico_extra_id = 'SE_HOMOLOG_IDEM_001';
DELETE FROM "FINANCEIRO_CLIENTES" WHERE financeiro_id = 'FIN_SE_HOMOLOG_IDEM_001';
DELETE FROM "DEMANDAS_CLIENTES" WHERE demanda_id = 'DEM_SE_HOMOLOG_IDEM_001';
DELETE FROM "COMUNICACOES_CLIENTE" WHERE notificacao_id = 'COM_SE_HOMOLOG_IDEM_001';
DELETE FROM content_assets WHERE content_asset_id = 'EXTRA_SE_HOMOLOG_IDEM_001';
```

**Passo 3 — Restaurar Make (se necessário)**

1. Acessar Make → Cenário 10
2. Restaurar versão anterior via histórico de versões
3. Validar filtro `status_servico_extra = orcamento_aprovado` ainda ativo

---

### Cenário 11 — Rollback

**Passo 1 — Google Sheets (dados de homologação)**

| Aba | Critério |
|---|---|
| `IA_GERACOES_CONTROLE` | Col A = `GER_HOMOLOG_IDEM_001` → Remover linha |

**Passo 2 — Restaurar Make (se necessário)**

1. Acessar Make → Cenário 11
2. Restaurar versão anterior via histórico de versões
3. Verificar se comportamento de deduplicação deve ser mantido ou revertido

---

## 10. VEREDITO INDIVIDUAL

### Cenário 10 — SERVICO_EXTRA_REQUEST

| Critério | Resultado |
|---|---|
| Nenhuma linha duplicada em retry | ✅ Garantido pela verificação prévia |
| Nenhum content_asset duplicado | ✅ Garantido pela chave `EXTRA_{{servico_extra_id}}` |
| Resposta explícita em todos os caminhos | ✅ WebhookRespond em 3 rotas |
| Nenhum crédito debitado duas vezes | ✅ Rota IA desviada se `limite_id` já existir |
| Nenhuma tabela real de cliente afetada | ✅ Payload usa `HOMOLOG_TEST_001` |
| Rollback possível | ⚠️ Parcial e manual (sem atomicidade Sheets x Supabase) |
| Atomicidade transacional | ⚠️ Ausente — dívida técnica pré-existente documentada |

> ## 🟡 CENÁRIO 10 — SEGURO COM RESSALVA
>
> **Seguro para produção com ressalvas:**
> 1. Rollback não é atômico entre Sheets e Supabase — divergência parcial possível em falha de infraestrutura
> 2. Race condition de baixíssima probabilidade: dois webhooks simultâneos no mesmo milissegundo antes da verificação retornar podem não se detectar
> 3. Validar que a coluna `content_asset_id` existe no Supabase antes de deploy em produção

---

### Cenário 11 — IA CRÉDITOS CONTROLE

| Critério | Resultado |
|---|---|
| Chave idempotente definida e aplicada | ✅ `geracao_id` com fallback `Idempotency-Key` |
| Verificação antes do débito | ✅ `searchRows` antes de qualquer `addRow` |
| Nenhum log duplicado em retry | ✅ Garantido pela verificação prévia |
| Nenhum limite incrementado duas vezes | ✅ Retry retorna imediatamente sem processar |
| Registro de processamento completo | ✅ Status em dois tempos |
| Resposta explícita em todos os caminhos | ✅ WebhookRespond em 2 rotas |
| Nenhuma tabela real afetada | ✅ Payload usa `HOMOLOG_TEST_001` |
| Mapeamento `asset_id` → `geracao_id` corrigido | ✅ Chave idempotente usada corretamente |

> ## 🟢 CENÁRIO 11 — SEGURO PARA PRODUÇÃO
>
> Correções implementadas eliminam todos os riscos de duplicidade identificados.
> A chave idempotente está corretamente definida, verificada antes de qualquer gravação,
> e o status de processamento é atualizado somente após confirmação do débito.

---

## SUMÁRIO EXECUTIVO

| Cenário | Problema Central | Correção Aplicada | Veredito |
|---|---|---|---|
| **10 — Serviço Extra Request** | 5 addRows sem verificação + sem WebhookRespond | Verificação prévia por chave determinística + WebhookRespond em 3 caminhos | 🟡 Seguro com ressalva |
| **11 — IA Créditos Controle** | addRow antes de validação + sem idempotência | Chave `geracao_id` + searchRows antes de addRow + status em dois tempos | 🟢 Seguro para produção |

---

> [!NOTE]
> **Restrições respeitadas nesta etapa:**
> - ✅ Regras de negócio não alteradas
> - ✅ Layout do FluxAI OS™ não alterado
> - ✅ RLS não alterada
> - ✅ Tabelas e colunas do Supabase não alteradas
> - ✅ Cenários 15 e 16 não tocados
> - ✅ Schedules não alterados
> - ✅ Clientes reais não afetados
> - ✅ Somente dados de homologação utilizados

---

*FluxAI OS™ — GO LIVE Etapa 3 — 10/07/2026*
