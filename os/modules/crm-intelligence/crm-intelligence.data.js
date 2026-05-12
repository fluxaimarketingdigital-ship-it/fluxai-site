export const crmIntelligenceData = {
    metrics: [
        { id: 'metric-opps', label: 'Oportunidades', value: '18', trend: '+2', meta: 'em negociação' },
        { id: 'metric-cycle', label: 'Ciclo Médio', value: '24d', trend: '-2d', meta: 'vs meta 30d' },
        { id: 'metric-retention', label: 'Taxa Retenção', value: '96.5%', trend: '+0.5%', meta: 'Estabilidade' },
        { id: 'metric-value', label: 'Pipeline Total', value: 'R$ 4.2M', trend: '+R$ 800k', meta: 'Forecast Mensal' }
    ],
    leads: [
        { id: "L-1024", name: "Indústrias Delta S.A.", contact: "Roberto Silva (CTO)", temperature: "Quente", healthScore: 92, nextAction: "Apresentação Diagnóstico" },
        { id: "L-1025", name: "TechFlow Soluções", contact: "Ana Costa (CEO)", temperature: "Morna", healthScore: 65, nextAction: "Follow-up Proposta" },
        { id: "L-1026", name: "Global Logistics Ltd.", contact: "Carlos Magno (COO)", temperature: "Quente", healthScore: 45, nextAction: "Reunião Retenção" }
    ]
};
