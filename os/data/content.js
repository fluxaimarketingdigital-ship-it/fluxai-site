/**
 * DATA ENTITY: CONTENT ENGINE (MOD.02)
 * Infraestrutura Editorial Operacional
 */

export const contentPipelineData = [
    {
        id: "CONT-001",
        title: "Whitepaper: Arquitetura de Crescimento B2B",
        stage: "revisão",
        priority: "alta",
        owner: "Admin",
        platform: "LinkedIn / Site",
        deadline: "2026-05-15",
        goal: "Autoridade Técnica",
        impact: "Retenção",
        approvals: { internal: true, strategic: true, client: false }
    },
    {
        id: "CONT-002",
        title: "Framework: Protocolo de Diagnóstico FluxAI",
        stage: "produção",
        priority: "crítica",
        owner: "Editor",
        platform: "Newsletter",
        deadline: "2026-05-12",
        goal: "Educação de Mercado",
        impact: "Operação",
        approvals: { internal: true, strategic: false, client: false }
    },
    {
        id: "CONT-003",
        title: "Case Study: Escala 10x na Indústria X",
        stage: "análise",
        priority: "alta",
        owner: "Analytics",
        platform: "Sales Kit",
        deadline: "Concluído",
        goal: "Prova Social Técnica",
        impact: "Receita",
        performance: "Acima da Média",
        approvals: { internal: true, strategic: true, client: true }
    }
];

export const editorialMetrics = {
    activeAssets: 24,
    avgCompletionTime: "4.2 dias",
    qualityScore: "9.4/10",
    distributionReach: "85k"
};
