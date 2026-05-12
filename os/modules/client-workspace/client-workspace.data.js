export const clientWorkspaceData = {
    project: {
        name: "Expansão Digital FluxAI",
        progress: 65,
        status: "Operacional",
        nextMilestone: "Lançamento do Portal de Leads",
        deadline: "25 de Junho, 2026"
    },
    approvals: [
        { id: 'APP-CLI-01', title: "Estrutura de Campanha Q3", module: "Content Engine", status: "Pendente", deadline: "Em 48h" },
        { id: 'APP-CLI-02', title: "Fluxo de Nutrição High-Ticket", module: "Automation Hub", status: "Pendente", deadline: "Hoje" }
    ],
    deliverables: [
        { id: 'DEL-01', title: "Estratégia Editorial V1", type: "Documento", status: "Aprovado", date: "10/05/2026", version: "v1.2" },
        { id: 'DEL-02', title: "Fluxos de Automação (CRM)", type: "Infraestrutura", status: "Em Revisão", date: "11/05/2026", version: "v0.9" },
        { id: 'DEL-04', title: "Identidade Visual OS", type: "Design", status: "Aprovado", date: "08/05/2026", version: "v2.0" }
    ],
    timeline: [
        { time: "Hoje, 14:30", message: "Concluída integração de Leads via Webhook.", status: "concluído" },
        { time: "Hoje, 09:00", message: "Iniciada revisão de governança para ativos Q3.", status: "processando" },
        { time: "Ontem, 17:15", message: "Aprovado layout final do Dashboard Analytics.", status: "concluído" }
    ],
    insights: [
        { title: "Qualidade de Leads", value: "+15%", desc: "Aumento na qualificação técnica dos leads via conteúdos de autoridade." },
        { title: "Eficiência Operacional", value: "24h", desc: "Redução no tempo médio de resposta entre lead e primeiro contato." }
    ],
    nextSteps: [
        { task: "Homologação do Portal de Leads", due: "15/05" },
        { task: "Ativação do Fluxo de Nutrição Q3", due: "18/05" },
        { task: "Reunião de Alinhamento Estratégico", due: "20/05" }
    ],
    assets: [
        { name: "Brandbook_FluxAI_v2.pdf", size: "4.2 MB", link: "#" },
        { name: "Relatorio_Analytics_Maio.xlsx", size: "1.1 MB", link: "#" }
    ]
};
