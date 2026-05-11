/**
 * DATA ENTITY: CRM INTELLIGENCE (MOD.03)
 * Central de Relacionamento Operacional
 */

export const crmLeadsData = [
    {
        id: "LEAD-742",
        client: "Logística Alpha S.A.",
        temperature: "quente",
        healthScore: 92,
        status: "negociação",
        lastFollowUp: "2h atrás",
        nextAction: "Validar Contrato",
        priority: "alta",
        risk: "baixo",
        impact: "receita"
    },
    {
        id: "LEAD-815",
        client: "Varejo Prime Group",
        temperature: "morno",
        healthScore: 65,
        status: "diagnóstico",
        lastFollowUp: "3d atrás",
        nextAction: "Agendar Apresentação",
        priority: "crítica",
        risk: "médio",
        impact: "operação"
    },
    {
        id: "LEAD-690",
        client: "BioTech Solutions",
        temperature: "frio",
        healthScore: 42,
        status: "aguardando",
        lastFollowUp: "12d atrás",
        nextAction: "Reativar Contato",
        priority: "baixa",
        risk: "alto",
        impact: "retenção"
    }
];

export const crmMetrics = {
    activeOpportunities: 18,
    conversionRate: "14.2%",
    avgSalesCycle: "18 dias",
    totalPipelineValue: "R$ 4.2M"
};
