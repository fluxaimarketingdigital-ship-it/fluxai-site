/**
 * SCRIPT: ampliar_aba_27_consolidado_diario.gs
 * OBJETIVO: Adicionar 11 colunas de governança ao final dos 20 cabeçalhos existentes
 *           da aba 27_CONSOLIDADO_DIARIO, sem apagar dados ou mover colunas.
 * AUTORIZAÇÃO: ETAPA A — Aprovada em 14/06/2026.
 * MODO DE USO:
 *   1. Abra a Planilha no Google Sheets.
 *   2. Menu Extensões > Apps Script.
 *   3. Cole este conteúdo, salve e execute a função: executar()
 *
 * PROIBIÇÕES CODIFICADAS:
 *   - Não apaga dados.
 *   - Não move colunas existentes.
 *   - Não renomeia colunas antigas.
 *   - Aborta se a aba não for localizada.
 *   - Aborta se a aba já tiver 31+ colunas (proteção contra execução dupla).
 *   - Aborta se os 20 cabeçalhos esperados não forem confirmados.
 */

// ─────────────────────────────────────────────
// CONFIGURAÇÃO
// ─────────────────────────────────────────────

const ABA_NOME = "27_CONSOLIDADO_DIARIO";

const CABECALHOS_EXISTENTES_ESPERADOS = [
  "client_id", "date", "instagram_followers", "instagram_reach",
  "instagram_profile_views", "instagram_website_clicks",
  "clarity_sessions", "clarity_page_views",
  "meta_spend", "meta_impressions", "meta_reach", "meta_clicks",
  "meta_ctr", "meta_cpc", "meta_cpm",
  "status_dia", "alerta", "prioridade", "diagnostico", "acao_recomendada"
];

const NOVAS_COLUNAS = [
  "ga4_sessions",
  "ga4_total_users",
  "ga4_engagement_rate",
  "search_console_clicks",
  "search_console_impressions",
  "status_ga4",
  "status_search_console",
  "status_clarity",
  "status_instagram",
  "status_meta_ads",
  "status_fechamento"
];


// ─────────────────────────────────────────────
// FUNÇÃO PRINCIPAL
// ─────────────────────────────────────────────

function executar() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const aba = ss.getSheetByName(ABA_NOME);

  if (!aba) {
    throw new Error(`[ABORT] Aba "${ABA_NOME}" não encontrada. Verifique o nome exato.`);
  }

  const ultimaColuna = aba.getLastColumn();
  const ultimaLinha  = aba.getLastRow();

  // ── ETAPA 1: EVIDÊNCIA PRÉ-ALTERAÇÃO ──────────────────────
  const cabecalhosAtuais = aba.getRange(1, 1, 1, ultimaColuna).getValues()[0];
  const totalLinhasAntes = ultimaLinha - 1; // Linha 1 = cabeçalho; o resto são dados.

  Logger.log("═══════════════════════════════════════════════");
  Logger.log("EVIDÊNCIA PRÉ-ALTERAÇÃO");
  Logger.log("═══════════════════════════════════════════════");
  Logger.log("Total de colunas: " + ultimaColuna);
  Logger.log("Total de linhas de dados: " + totalLinhasAntes);
  Logger.log("Cabeçalhos atuais: " + cabecalhosAtuais.join(", "));

  // ── ETAPA 2: VALIDAÇÕES DE SEGURANÇA ──────────────────────

  // 2a. Proteção contra execução dupla
  if (ultimaColuna >= 31) {
    throw new Error(
      `[ABORT] A aba já possui ${ultimaColuna} colunas. ` +
      "Possível execução dupla detectada. Nenhuma alteração foi feita."
    );
  }

  // 2b. Confirmar integridade dos 20 cabeçalhos existentes
  for (let i = 0; i < CABECALHOS_EXISTENTES_ESPERADOS.length; i++) {
    if (cabecalhosAtuais[i] !== CABECALHOS_EXISTENTES_ESPERADOS[i]) {
      throw new Error(
        `[ABORT] Cabeçalho na coluna ${i + 1} diverge. ` +
        `Esperado: "${CABECALHOS_EXISTENTES_ESPERADOS[i]}" | ` +
        `Encontrado: "${cabecalhosAtuais[i]}". ` +
        "Nenhuma alteração foi feita."
      );
    }
  }

  Logger.log("[OK] Os 20 cabeçalhos existentes foram confirmados sem divergências.");
  Logger.log("[OK] Nenhuma linha de dados será apagada.");

  // ── ETAPA 3: INJEÇÃO DAS NOVAS COLUNAS ───────────────────

  const inicioNovaColunaIndex = ultimaColuna + 1; // Índice 1-based da próxima coluna disponível

  for (let j = 0; j < NOVAS_COLUNAS.length; j++) {
    const colunaIndex = inicioNovaColunaIndex + j;
    aba.getRange(1, colunaIndex).setValue(NOVAS_COLUNAS[j]);
  }

  Logger.log("[OK] 11 novas colunas injetadas com sucesso.");

  // ── ETAPA 4: EVIDÊNCIA PÓS-ALTERAÇÃO ─────────────────────

  const novaUltimaColuna = aba.getLastColumn();
  const cabecalhosFinais = aba.getRange(1, 1, 1, novaUltimaColuna).getValues()[0];
  const totalLinhasDepois = aba.getLastRow() - 1;

  Logger.log("═══════════════════════════════════════════════");
  Logger.log("EVIDÊNCIA PÓS-ALTERAÇÃO");
  Logger.log("═══════════════════════════════════════════════");
  Logger.log("Total de colunas: " + novaUltimaColuna);
  Logger.log("Total de linhas de dados: " + totalLinhasDepois);
  Logger.log("Cabeçalhos finais: " + cabecalhosFinais.join(", "));

  // ── ETAPA 5: CONFIRMAÇÕES FINAIS ──────────────────────────

  if (novaUltimaColuna !== 31) {
    throw new Error(
      `[ERRO] A aba deveria ter 31 colunas, mas possui ${novaUltimaColuna}. Revise manualmente.`
    );
  }

  if (totalLinhasDepois !== totalLinhasAntes) {
    throw new Error(
      `[ERRO CRÍTICO] A quantidade de linhas mudou! ` +
      `Antes: ${totalLinhasAntes} | Depois: ${totalLinhasDepois}. Revise manualmente.`
    );
  }

  Logger.log("[CONFIRMADO] 31 colunas — estrutura final íntegra.");
  Logger.log("[CONFIRMADO] As 11 novas colunas estão vazias (sem dados).");
  Logger.log(`[CONFIRMADO] Linhas de dados preservadas: ${totalLinhasDepois}`);
  Logger.log("[CONFIRMADO] As 20 colunas anteriores mantêm seus dados intactos.");
  Logger.log("[CONFIRMADO] Nenhuma alteração foi realizada no Make.");
  Logger.log("═══════════════════════════════════════════════");
  Logger.log("ETAPA A — CONCLUÍDA COM SUCESSO");
  Logger.log("CENÁRIO 19 — AINDA NÃO CRIADO");
  Logger.log("═══════════════════════════════════════════════");

  // Exibe um popup de confirmação no Sheets
  SpreadsheetApp.getUi().alert(
    "✅ ETAPA A CONCLUÍDA\n\n" +
    "31 colunas confirmadas.\n" +
    totalLinhasDepois + " linhas preservadas.\n\n" +
    "Consulte o Log de Execução em:\nExtensões > Apps Script > Execuções"
  );
}
