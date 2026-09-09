export const contentEngineData = {
    metrics: [
        { id: 'metric-assets', label: 'Ativos Ativos', value: '24', trend: '+3', meta: 'esta semana' },
        { id: 'metric-completion', label: 'Tempo Médio', value: '4.2d', trend: '-0.5d', meta: 'Eficiência Alta' },
        { id: 'metric-quality', label: 'Quality Score', value: '9.4', trend: '+0.2', meta: 'Meta: 9.0' },
        { id: 'metric-reach', label: 'Alcance Dist.', value: '85k', trend: '+12k', meta: 'Canais Integrados' }
    ],
    pipeline: [
        { 
            id: "CONT-001", 
            title: "Diagnóstico: Arquitetura de Crescimento B2B", 
            status: "PRODUÇÃO", 
            priority: "CRÍTICA", 
            platform: "LINKEDIN",
            scheduled_at: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
            metadata: { responsible: "Estrategista", version: "V2", risk: true, approval_deadline: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString() }
        },
        { 
            id: "CONT-002", 
            title: "Reels: Engenharia de Processos", 
            status: "APROVAÇÃO FINAL", 
            priority: "ALTA", 
            platform: "INSTAGRAM",
            scheduled_at: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
            metadata: { responsible: "Audiovisual", version: "V1", risk: false, approval_deadline: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString() }
        },
        { 
            id: "CONT-003", 
            title: "Case Study: Escala 10x Industrial", 
            status: "PRONTO", 
            priority: "MÉDIA", 
            platform: "YOUTUBE",
            scheduled_at: new Date().toISOString(),
            metadata: { responsible: "Design", version: "FINAL", risk: false }
        }
    ]
};
