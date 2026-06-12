# PLANO DE REMAPEAMENTO DOS CENÁRIOS 03 A 08

**Problema:**
Os cenários Make responsáveis pela coleta de inteligência, métricas, relatórios mensais e daily sync utilizam nomes de abas obsoletos da planilha principal (ex: `CLIENTES_CONFIG`, `SERVICOS_CLIENTES`, `GA4_DIARIO`). A base de produção os atualizou com prefixos numéricos (ex: `04_CLIENTES_CONFIG`, `03_SERVICOS_CLIENTES`, `20_GA4_DIARIO`). 

**Regra de Ouro:** Não ativar esses cenários antes do remapeamento. O disparo contra nomes inexistentes causará erro imediato no fluxo.

## Cenários Afetados:
- `03_FLUXAI_INSTAGRAM_MANUAL_READER`
- `04_FLUXAI_CONTENT_INTELLIGENCE`
- `05_FLUXAI_DAILY_SYNC`
- `06_FLUXAI_META_SYNC`
- `07_FLUXAI_RELATORIO_MENSAL`
- `08_FLUXAI_CLIENT_STATUS_MONITOR`

## Passos para o Saneamento Manual no Make:
1. Abrir o Blueprint visual de cada cenário no painel do Make.
2. Localizar cada módulo Google Sheets (FilterRows / AddRow / UpdateRow).
3. Selecionar o campo `Spreadsheet` e remapear manualmente (Select from List) a aba correspondente para o novo nome com o prefixo.
4. Salvar o cenário e executar um `"Run Once"` com um Mock seguro ou apenas confirmar se a validação visual do módulo remove os alertas de erro no Make.
5. Após o remapeamento, gerar o novo blueprint JSON e comitar para versionamento.

**Status de Produção Atual:** Estes workflows devem permanecer desativados no ambiente oficial do cliente.
