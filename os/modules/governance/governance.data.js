export const governanceData = {
    metrics: [
        { id: 'metric-approval', label: 'Tempo Aprovação', value: 'Estável', trend: '0%', meta: 'Fluxo Operacional' },
        { id: 'metric-compliance', label: 'Compliance', value: '100%', trend: 'Ideal', meta: 'Integridade Total' },
        { id: 'metric-audits', label: 'Auditorias Ativas', value: '0', trend: 'Estável', meta: 'Nenhum Risco' },
        { id: 'metric-integrity', label: 'Integridade', value: '100%', trend: 'Estável', meta: 'Core Systems' }
    ],
    queue: [
        { id: "APP-101", module: "Content Engine", target: "Whitepaper: Arquitetura B2B", requestedBy: "Editor", status: "Aguardando", priority: "Alta", impact: "Autoridade" },
        { id: "APP-102", module: "CRM Intelligence", target: "Alteração de Protocolo", requestedBy: "Sales Lead", status: "Revisão", priority: "Crítica", impact: "Operação" },
        { id: "APP-104", module: "Automation Hub", target: "Novo Fluxo de Nutrição", requestedBy: "Growth Lead", status: "Aguardando", priority: "Média", impact: "Receita" }
    ],
    audit: [
        { time: "17:45", user: "Admin", action: "Aprovado Ativo CONT-003", module: "Content" },
        { time: "16:20", user: "System", action: "Versão v1.1.0 Deploy Modular", module: "Core" },
        { time: "14:10", user: "Editor", action: "Solicitada Revisão de Protocolo", module: "CRM" }
    ]
};
