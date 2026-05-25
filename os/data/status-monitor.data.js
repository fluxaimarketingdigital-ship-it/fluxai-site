export const mockStatusMonitor = [
    {
        cliente_id: 'FLUXAI_LABS_001',
        servico: 'Geral',
        status_operacional: 'saudavel',
        criticidade: 'baixa',
        acao_recomendada: 'Nenhuma'
    },
    {
        cliente_id: 'CLI_002',
        servico: 'gestao_redes_sociais',
        status_operacional: 'coleta_manual',
        criticidade: 'media',
        acao_recomendada: 'Coletar métricas manualmente'
    },
    {
        cliente_id: 'CLI_003',
        servico: 'Geral',
        status_operacional: 'token_ausente',
        criticidade: 'alta',
        acao_recomendada: 'Solicitar autorização do cliente'
    },
    {
        cliente_id: 'CLI_002',
        servico: 'CRM Sync',
        status_operacional: 'rota_pausada',
        criticidade: 'alta',
        acao_recomendada: 'Verificar erro no Make e reativar'
    }
];
