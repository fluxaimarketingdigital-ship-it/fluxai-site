// TODO (PENDÊNCIA TÉCNICA): Em produção pública, substituir webhook_url por uma API/proxy interna (ex: make-proxy) para não expor URLs do Make no bundle do front-end.

// 1. Não colocar tokens/webhooks do Make dentro de api/make-proxy.js.
// 2. Usar variáveis de ambiente na Vercel (gerenciadas lá)
// 3. Remover qualquer token/hook do makeRoutes.js.

// Todas as chamadas diretas são agora roteadas para o proxy interno
const createRoute = (id, scenario, proxyMode, method, status, aba, acao, confirm) => ({
    rota_id: id,
    cenario_make: scenario,
    use_proxy: proxyMode !== undefined ? proxyMode : true, // flag para indicar roteamento interno
    metodo: method || 'POST',
    status_rota: status || 'ativo',
    aba_destino: aba || '',
    tipo_acao: acao || '',
    requer_confirmacao: confirm || 'nao'
});

export const ROTAS_OS_MAKE = {
    // 6. Allowlist rígida (01, 02, 14) ativada.
    // 13. Não conectar rotas 09, 10, 11, 13, 15 ou 16 ainda.
    'ROTA_OS_01_PORTAL_DEMANDAS': createRoute('ROTA_OS_01_PORTAL_DEMANDAS', '01_FLUXAI_PORTAL_DEMANDAS', true, 'POST', 'ativo', '07_DEMANDAS_CLIENTES', 'criar_demanda', 'nao'),
    'ROTA_OS_02_LEADS_SITE': createRoute('ROTA_OS_02_LEADS_SITE', '02_FLUXAI_LEADS_SITE', true, 'POST', 'ativo', 'LEADS_SITE', 'registrar_lead', 'nao'),
    'ROTA_OS_09_ONBOARDING': createRoute('ROTA_OS_09_ONBOARDING', '09_FLUXAI_NOVO_CLIENTE_ONBOARDING_SEGURO', true, 'POST', 'manual', '', '', 'sim'),
    'ROTA_OS_10_SERVICO_EXTRA': createRoute('ROTA_OS_10_SERVICO_EXTRA', '10_FLUXAI_SERVICO_EXTRA_REQUEST', false, 'POST', 'ativo', '06_SERVICOS_EXTRAS_CLIENTES', 'criar_servico_extra', 'nao'),
    'ROTA_OS_11_IA_CREDITOS': createRoute('ROTA_OS_11_IA_CREDITOS', '11_FLUXAI_IA_CREDITOS_CONTROLE_LIMITE_OPERACIONAL', false, 'POST', 'monitorado', '', '', 'sim'),
    'ROTA_OS_13_GUARDRAIL': createRoute('ROTA_OS_13_GUARDRAIL', '13_FLUXAI_IA_GUARDRAIL_LIMITE_OPERACIONAL', false, 'POST', 'monitorado', '', '', 'sim'),
    'ROTA_OS_14_ARQUIVOS': createRoute('ROTA_OS_14_ARQUIVOS', '14_FLUXAI_CLIENTES_ARQUIVOS_SYNC', true, 'POST', 'ativo', 'CLIENTES_ARQUIVOS', 'registrar_arquivo', 'nao'),
    'ROTA_OS_15_PLANEJAMENTO': createRoute('ROTA_OS_15_PLANEJAMENTO', '15_FLUXAI_PLANEJAMENTO_CONTEUDO', false, 'POST', 'ativo', 'PLANEJAMENTO_CONTEUDO', 'criar_planejamento', 'nao'),
    'ROTA_OS_16_CALENDARIO': createRoute('ROTA_OS_16_CALENDARIO', '16_FLUXAI_CALENDARIO_POSTAGENS', false, 'POST', 'ativo', 'CALENDARIO_POSTAGENS', 'agendar_postagem', 'nao')
};
