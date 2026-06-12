# CHECKPOINT PRÉ-REMAPEAMENTO: PACOTE SEGURO 03

**Data:** 12 de Junho de 2026
**Status:** Início do processamento de JSONs.

## Contexto e Risco
Os cenários 03 a 08 da automação de métricas (`03_FLUXAI_INSTAGRAM_MANUAL_READER`, `04_FLUXAI_CONTENT_INTELLIGENCE`, `05_FLUXAI_DAILY_SYNC`, `06_FLUXAI_META_SYNC`, `07_FLUXAI_RELATORIO_MENSAL`, `08_FLUXAI_CLIENT_STATUS_MONITOR`) estão bloqueados porque ainda utilizam nomes de abas antigos. Uma tentativa de execução nesses cenários causaria erro fatal `Module validation failed` devido à aba inexistente no Google Sheets.

## Plano de Ação
1. O script `scratch/remap_blueprints.mjs` extrairá os arquivos JSON da pasta fonte `scratch/PACOTE_SEGURO_01_ENTREGAR_ANTIGRAVITY/`.
2. Uma substituição estrita (string-match) das 13 abas mapeadas será aplicada sobre a chave `sheet` dos módulos, e o `.json` será exportado para `scratch/PACOTE_SEGURO_03_BLUEPRINTS_REMAPEADOS/`.
3. Os cenários produtivos não serão tocados nesta etapa. O arquivo JSON original é mantido intacto como backup.

## Isolamento Garantido
*   A Rota 09 e o Onboarding Rascunho (Fase 2A.1) não sofrerão alterações.
*   A Rota 10 (Serviços Extras) não sofrerá alterações.
*   O banco Supabase não será acionado ou modificado.
*   Os webhooks permanecerão os mesmos na exportação dos metadados.
