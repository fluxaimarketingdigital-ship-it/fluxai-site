// TODO (PENDÊNCIA TÉCNICA): Em produção pública, substituir webhook_url por uma API/proxy interna (ex: make-proxy) para não expor URLs do Make no bundle do front-end.
export const ROTAS_OS_MAKE = {
    'ROTA_OS_01_PORTAL_DEMANDAS': {
        rota_id: 'ROTA_OS_01_PORTAL_DEMANDAS',
        cenario_make: '01_FLUXAI_PORTAL_DEMANDAS',
        webhook_url: 'https://hook.us2.make.com/9y9q3pq1jks9fll0kwrzaase6n7j68j7',
        metodo: 'POST',
        status_rota: 'ativo',
        aba_destino: '07_DEMANDAS_CLIENTES',
        tipo_acao: 'criar_demanda',
        requer_confirmacao: 'nao'
    },
    'ROTA_OS_02_LEADS_SITE': {
        rota_id: 'ROTA_OS_02_LEADS_SITE',
        cenario_make: '02_FLUXAI_LEADS_SITE',
        webhook_url: 'https://hook.us2.make.com/au4ko54wey2q3b98crpfmo55w8viy481',
        metodo: 'POST',
        status_rota: 'ativo',
        aba_destino: 'LEADS_SITE',
        tipo_acao: 'registrar_lead',
        requer_confirmacao: 'nao'
    },
    'ROTA_OS_09_ONBOARDING': {
        rota_id: 'ROTA_OS_09_ONBOARDING',
        cenario_make: '09_FLUXAI_NOVO_CLIENTE_ONBOARDING_SEGURO',
        webhook_url: '', // Preencher caso recupere via API posteriormente
        metodo: 'POST',
        status_rota: 'manual',
        aba_destino: '',
        tipo_acao: '',
        requer_confirmacao: 'sim'
    },
    'ROTA_OS_10_SERVICO_EXTRA': {
        rota_id: 'ROTA_OS_10_SERVICO_EXTRA',
        cenario_make: '10_FLUXAI_SERVICO_EXTRA_REQUEST',
        webhook_url: '', 
        metodo: 'POST',
        status_rota: 'ativo',
        aba_destino: '06_SERVICOS_EXTRAS_CLIENTES',
        tipo_acao: 'criar_servico_extra',
        requer_confirmacao: 'nao'
    },
    'ROTA_OS_11_IA_CREDITOS': {
        rota_id: 'ROTA_OS_11_IA_CREDITOS',
        cenario_make: '11_FLUXAI_IA_CREDITOS_CONTROLE_LIMITE_OPERACIONAL',
        webhook_url: '', 
        metodo: 'POST',
        status_rota: 'monitorado',
        aba_destino: '',
        tipo_acao: '',
        requer_confirmacao: 'sim'
    },
    'ROTA_OS_13_GUARDRAIL': {
        rota_id: 'ROTA_OS_13_GUARDRAIL',
        cenario_make: '13_FLUXAI_IA_GUARDRAIL_LIMITE_OPERACIONAL',
        webhook_url: '',
        metodo: 'POST',
        status_rota: 'monitorado',
        aba_destino: '',
        tipo_acao: '',
        requer_confirmacao: 'sim'
    },
    'ROTA_OS_14_ARQUIVOS': {
        rota_id: 'ROTA_OS_14_ARQUIVOS',
        cenario_make: '14_FLUXAI_CLIENTES_ARQUIVOS_SYNC',
        webhook_url: 'https://hook.us2.make.com/6mmlsjecklx6bztuh31g2m6od28yun1r',
        metodo: 'POST',
        status_rota: 'ativo',
        aba_destino: 'CLIENTES_ARQUIVOS',
        tipo_acao: 'registrar_arquivo',
        requer_confirmacao: 'nao'
    },
    'ROTA_OS_15_PLANEJAMENTO': {
        rota_id: 'ROTA_OS_15_PLANEJAMENTO',
        cenario_make: '15_FLUXAI_PLANEJAMENTO_CONTEUDO',
        webhook_url: '',
        metodo: 'POST',
        status_rota: 'ativo',
        aba_destino: 'PLANEJAMENTO_CONTEUDO',
        tipo_acao: 'criar_planejamento',
        requer_confirmacao: 'nao'
    },
    'ROTA_OS_16_CALENDARIO': {
        rota_id: 'ROTA_OS_16_CALENDARIO',
        cenario_make: '16_FLUXAI_CALENDARIO_POSTAGENS',
        webhook_url: '',
        metodo: 'POST',
        status_rota: 'ativo',
        aba_destino: 'CALENDARIO_POSTAGENS',
        tipo_acao: 'agendar_postagem',
        requer_confirmacao: 'nao'
    }
};
