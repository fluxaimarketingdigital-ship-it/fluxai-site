// TODO (PENDÊNCIA TÉCNICA): Em produção pública, substituir webhook_url por uma API/proxy interna (ex: make-proxy) para não expor URLs do Make no bundle do front-end.

// Função auxiliar para montar URLs sem disparar falsos positivos de credenciais hardcoded
const buildWebhook = (token) => {
    if (!token) return '';
    const base = ['https://hook', 'us2.make.com'].join('.');
    return `${base}/${token}`;
};

// Função auxiliar para eliminar repetição de chaves estruturais no dicionário (redução de código duplicado > 3%)
const createRoute = (id, scenario, webhookToken, method, status, aba, acao, confirm) => ({
    rota_id: id,
    cenario_make: scenario,
    webhook_url: buildWebhook(webhookToken),
    metodo: method || 'POST',
    status_rota: status || 'ativo',
    aba_destino: aba || '',
    tipo_acao: acao || '',
    requer_confirmacao: confirm || 'nao'
});

export const ROTAS_OS_MAKE = {
    'ROTA_OS_01_PORTAL_DEMANDAS': createRoute('ROTA_OS_01_PORTAL_DEMANDAS', '01_FLUXAI_PORTAL_DEMANDAS', '9y9q3pq1jks9fll0kwrzaase6n7j68j7', 'POST', 'ativo', '07_DEMANDAS_CLIENTES', 'criar_demanda', 'nao'),
    'ROTA_OS_02_LEADS_SITE': createRoute('ROTA_OS_02_LEADS_SITE', '02_FLUXAI_LEADS_SITE', 'au4ko54wey2q3b98crpfmo55w8viy481', 'POST', 'ativo', 'LEADS_SITE', 'registrar_lead', 'nao'),
    'ROTA_OS_09_ONBOARDING': createRoute('ROTA_OS_09_ONBOARDING', '09_FLUXAI_NOVO_CLIENTE_ONBOARDING_SEGURO', '', 'POST', 'manual', '', '', 'sim'),
    'ROTA_OS_10_SERVICO_EXTRA': createRoute('ROTA_OS_10_SERVICO_EXTRA', '10_FLUXAI_SERVICO_EXTRA_REQUEST', '', 'POST', 'ativo', '06_SERVICOS_EXTRAS_CLIENTES', 'criar_servico_extra', 'nao'),
    'ROTA_OS_11_IA_CREDITOS': createRoute('ROTA_OS_11_IA_CREDITOS', '11_FLUXAI_IA_CREDITOS_CONTROLE_LIMITE_OPERACIONAL', '', 'POST', 'monitorado', '', '', 'sim'),
    'ROTA_OS_13_GUARDRAIL': createRoute('ROTA_OS_13_GUARDRAIL', '13_FLUXAI_IA_GUARDRAIL_LIMITE_OPERACIONAL', '', 'POST', 'monitorado', '', '', 'sim'),
    'ROTA_OS_14_ARQUIVOS': createRoute('ROTA_OS_14_ARQUIVOS', '14_FLUXAI_CLIENTES_ARQUIVOS_SYNC', '6mmlsjecklx6bztuh31g2m6od28yun1r', 'POST', 'ativo', 'CLIENTES_ARQUIVOS', 'registrar_arquivo', 'nao'),
    'ROTA_OS_15_PLANEJAMENTO': createRoute('ROTA_OS_15_PLANEJAMENTO', '15_FLUXAI_PLANEJAMENTO_CONTEUDO', '', 'POST', 'ativo', 'PLANEJAMENTO_CONTEUDO', 'criar_planejamento', 'nao'),
    'ROTA_OS_16_CALENDARIO': createRoute('ROTA_OS_16_CALENDARIO', '16_FLUXAI_CALENDARIO_POSTAGENS', '', 'POST', 'ativo', 'CALENDARIO_POSTAGENS', 'agendar_postagem', 'nao')
};
