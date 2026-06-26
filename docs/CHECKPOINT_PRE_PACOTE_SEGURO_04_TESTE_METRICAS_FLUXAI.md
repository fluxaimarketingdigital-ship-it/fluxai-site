# CHECKPOINT PRÉ-TESTE: PACOTE SEGURO 04

**Data:** 12 de Junho de 2026
**Status:** Início da Validação de Métricas Controlada

## Contexto e Risco
Após o remapeamento estrito das planilhas (Pacote 03), os cenários 03 a 08 precisam ser submetidos a um teste de leitura e escrita real para validar se o Google Sheets e o Make vão trafegar os dados sem erros (Missing Fields, Validation Failed, etc) e sem duplicar abas. Qualquer execução precipitada com a base total ativada poderia enviar relatórios de testes para dezenas de clientes ativos.

## Estratégia do Teste (Single-Run Controlado)
O teste será executado **exclusivamente com um cliente laboratório** da própria agência para não acionar relatórios externos:
*   **Cliente Preferencial:** `FLUXAI_LABS_001`
*   **Fallback Fake (Se FLUXAI_LABS_001 não estiver estruturado):** `FLUXAI_METRICAS_TESTE_2026_06_001`

A aprovação desta fase requer a validação manual ("Run Once" via interface do Make) de cada um dos cenários isoladamente (sem disparos agendados) e o tracking exato do que foi lido e escrito.

## Isolamento Garantido
*   A Rota 09 e o Onboarding Rascunho (Fase 2A.1) não serão re-testados e nem impactados.
*   A Rota 10 (Serviços Extras) permanece bloqueada.
*   O banco Supabase não receberá inserts.
*   Não haverá "Schedule" ativo durante a bateria de testes.
*   Nenhum relatório será enviado a cliente final externo.
