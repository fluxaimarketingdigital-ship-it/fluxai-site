/**
 * DATA ENTITY: CRM INTELLIGENCE (MOD.03)
 * Central de Relacionamento Operacional
 */

export const crmLeadsData = [
    {
        id: "L-1024",
        name: "Indústrias Delta S.A.",
        contact: "Roberto Silva (CTO)",
        temperature: "quente",
        healthScore: 92,
        lastFollowUp: "2 dias atrás",
        nextAction: "Apresentação de Diagnóstico",
        impact: "R$ 450k/ano",
        risk: "baixo",
        status: "ativo"
    },
    {
        id: "L-1025",
        name: "TechFlow Soluções",
        contact: "Ana Costa (CEO)",
        temperature: "morna",
        healthScore: 65,
        lastFollowUp: "1 semana atrás",
        nextAction: "Follow-up de Proposta",
        impact: "R$ 120k/ano",
        risk: "médio",
        status: "atenção"
    },
    {
        id: "L-1026",
        name: "Global Logistics Ltd.",
        contact: "Carlos Magno (COO)",
        temperature: "quente",
        healthScore: 45,
        lastFollowUp: "10 dias atrás",
        nextAction: "Reunião de Retenção",
        impact: "R$ 800k/ano",
        risk: "alto",
        status: "crítico"
    }
];

export const crmMetrics = {
    activeOpportunities: 18,
    avgSalesCycle: "24 dias",
    retentionRate: "96.5%",
    pipelineValue: "R$ 4.2M"
};
