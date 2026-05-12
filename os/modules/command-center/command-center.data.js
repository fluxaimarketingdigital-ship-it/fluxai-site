export const commandCenterData = {
    metrics: [
        { id: 'metric-comercial', label: 'Fluxo Comercial', value: '14.2', trend: '+12.5%', meta: 'vs semana anterior' },
        { id: 'metric-conteudo', label: 'Eficiência de Conteúdo', value: '88%', trend: '-2.1%', meta: 'Ação Necessária' },
        { id: 'metric-crm', label: 'Saúde do CRM', value: '94.5', trend: '+5.2', meta: 'Pontos de Ativos' },
        { id: 'metric-roas', label: 'ROAS Operacional', value: '6.8x', trend: '+0.4x', meta: 'Estável' }
    ],
    alerts: [
        { type: 'danger', title: 'Desconexão API CRM', message: 'Impacto: Receita | Prioridade: Alta' },
        { type: 'success', title: 'Lote Editorial Aprovado', message: 'Impacto: Autoridade | 1h atrás' }
    ],
    pipeline: [
        { label: 'Diagnóstico', progress: 40, value: '08' },
        { label: 'Implementação', progress: 70, value: '12' }
    ],
    activities: [
        { time: '17:05', user: 'ADMIN', message: 'Atualizou protocolos de CRM Intelligence.' },
        { time: '16:42', user: 'SISTEMA', message: 'Auto-scaling ativado no cluster de automação.' }
    ]
};
