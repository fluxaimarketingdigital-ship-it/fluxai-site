# ATUALIZAÇÃO ESTRUTURAL — CENÁRIO 04

Para refletir a criação da aba `31_INSIGHTS_CONTEUDO` de forma governada, as seguintes definições devem ser injetadas nos mapas de controle do Google Sheets:

## 1. Inventário de Abas
**Adicionar a seguinte linha ao Inventário Oficial:**
*   **Nome da Aba:** `31_INSIGHTS_CONTEUDO`
*   **Propósito:** Consolidação unificada de métricas de postagens (Manuais e API).
*   **Permissão Sugerida:** Escrita restrita ao Service Account do Make; Leitura livre.
*   **Status:** Ativa.

## 2. Mapa de Governança
**Adicionar os seguintes vínculos:**
*   **Aba:** `31_INSIGHTS_CONTEUDO`
*   **Lida por:** `30_RELATORIO_OPERACIONAL_FLUXAI`, `29_ANALISE_MENSAL_CLIENTE`, Painel Front-End (Supabase).
*   **Escrita por:** `04_FLUXAI_CONTENT_INTELLIGENCE` (Cenário Make).
*   **Campos Sensíveis:** Nenhum.
*   **Proteção RLS:** Nível de Cliente (Supabase).

## 3. Dicionário de Dados (`31_INSIGHTS_CONTEUDO`)

| Coluna | Tipo | Validação (Dropdown) | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| `client_id` | Chave (Texto) | - | Sim | ID único do cliente. |
| `date` | Data | - | Sim | Data de extração ou fechamento diário. |
| `content_id` | Chave (Texto) | - | Sim | ID único do post no Meta ou identificador do post manual. |
| `published_at` | Data/Hora | - | Não | Data oficial da publicação na rede. |
| `origem_dados` | Enum | `api`, `manual` | Sim | Define o fluxo do Router. |
| `formato` | Enum | `reels`, `carrossel`, `imagem`, `video`, `story`, `live`, `texto`, `outro` | Sim | Formato da peça de conteúdo. |
| `permalink` | URL | - | Não | Link direto para o post. |
| `caption_resumo` | Texto | - | Não | Resumo ou legenda extraída/gerada. |
| `reach` | Numérico | - | Não | Contas alcançadas. |
| `impressions` | Numérico | - | Não | Visualizações totais. |
| `views_plays` | Numérico | - | Não | Plays (específico de vídeos/reels). |
| `likes` | Numérico | - | Não | Curtidas. |
| `comments` | Numérico | - | Não | Comentários. |
| `shares` | Numérico | - | Não | Compartilhamentos. |
| `saves` | Numérico | - | Não | Salvamentos. |
| `engagement_total` | Numérico | - | Não | Soma de likes, comments, shares e saves. |
| `engagement_rate` | Numérico | - | Não | engagement_total / reach. |
| `rota_id` | Texto | - | Sim | Identificador técnico do pipeline. |
| `status_processamento` | Enum | `coletado`, `processado`, `sem_dados`, `erro`, `pendente`, `ignorado` | Sim | Flag para evitar reprocessamento ou apontar falhas. |
| `observacao` | Texto Livre | - | Não | Fallbacks (ex: "sem_dados_api_200"). |
| `data_criacao` | Data/Hora | - | Sim | Timestamp automático da criação da linha. |
| `data_atualizacao`| Data/Hora | - | Não | Timestamp da última sobreposição. |

## 4. Guia de Reestruturação do Cenário 04 (Make UI)
O cenário 04 deve receber um Router primário logo após o filtro inicial do cliente, bifurcando nas duas rotas abaixo:

**Rota A: Coleta Manual (`modo_coleta = manual`)**
1. Filtro da Rota: `modo_coleta` Igual a `manual`
2. Módulo Google Sheets: Search Rows em `25_INSTAGRAM_CONTEUDO_MANUAL`
3. Processamento: Iterators e extração de KPIs das legendas/criativos.
4. Módulo Google Sheets: Add a Row mapeado para o destino `31_INSIGHTS_CONTEUDO`

**Rota B: Coleta API (`modo_coleta = api`)**
1. Filtro da Rota: `modo_coleta` Igual a `api`
2. Módulo HTTP: Make a Request na API da Meta (Endpoint: `instagram_business_id/media` ou similar)
3. Processamento: Iterators para desmembrar o JSON retornado pela Meta.
4. Módulo Google Sheets: Add a Row mapeado para o destino `31_INSIGHTS_CONTEUDO`
