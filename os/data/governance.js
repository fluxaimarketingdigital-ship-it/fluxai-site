/**
 * DATA ENTITY: APPROVAL & GOVERNANCE (MOD.05)
 * Central de Controle e Auditoria Operacional
 */

export const approvalQueue = [
    {
        id: "APP-101",
        module: "Content Engine",
        target: "Whitepaper: Arquitetura B2B",
        requestedBy: "Editor",
        date: "2026-05-11",
        status: "aguardando",
        priority: "alta",
        impact: "Autoridade"
    },
    {
        id: "APP-102",
        module: "CRM Intelligence",
        target: "Alteração de Protocolo: Follow-up Industrial",
        requestedBy: "Sales Lead",
        date: "2026-05-11",
        status: "revisão",
        priority: "crítica",
        impact: "Operação"
    },
    {
        id: "APP-103",
        module: "Automation Hub",
        target: "Novo Fluxo: Webhook CRM -> Meta",
        requestedBy: "DevOps",
        date: "2026-05-10",
        status: "concluído",
        priority: "média",
        impact: "Automação"
    }
];

export const auditLog = [
    { time: "17:45", user: "Admin", action: "Aprovado Ativo CONT-003", module: "Content" },
    { time: "16:20", user: "System", action: "Versão v1.0.4 Deploy Concluído", module: "Core" },
    { time: "14:10", user: "Editor", action: "Solicitada Revisão de Protocolo", module: "CRM" }
];

export const governanceMetrics = {
    avgApprovalTime: "Estável",
    complianceRate: "Ideal",
    activeAudits: 0,
    systemIntegrity: "100%"
};
