export const automationHubData = {
    integrations: [
        { id: 'meta-api', label: 'Meta API', status: 'operacional', icon: 'fa-brands fa-facebook' },
        { id: 'crm-sync', label: 'CRM Sync', status: 'operacional', icon: 'fa-solid fa-sync' },
        { id: 'whatsapp-api', label: 'WhatsApp API', status: 'estável', icon: 'fa-brands fa-whatsapp' },
        { id: 'webhook-leads', label: 'Webhook Leads', status: 'estável', icon: 'fa-solid fa-cloud-arrow-up' }
    ],
    flows: [
        { id: 'flow-01', name: "Entrada de Lead → CRM", trigger: "Formulário Site", target: "RD Station", status: "ativo", impact: "Receita" },
        { id: 'flow-02', name: "Aprovação Ativo → Agendamento", trigger: "Governança", target: "Google Calendar", status: "ativo", impact: "Operação" },
        { id: 'flow-03', name: "Publicação → Analytics", trigger: "Content Engine", target: "Dashboard", status: "ativo", impact: "Autoridade" },
        { id: 'flow-04', name: "Novo Cliente → Notificação", trigger: "Stripe", target: "Slack", status: "ativo", impact: "Retenção" }
    ],
    queue: [
        { id: "EXE-402", flow: "Sincronização CRM", status: "concluído", time: "Há 2 min", impact: "Médio" },
        { id: "EXE-403", flow: "Webhook Leads", status: "concluído", time: "Há 5 min", impact: "Crítico" },
        { id: "EXE-404", flow: "Publicação Editorial", status: "processando", time: "Agora", impact: "Baixo" }
    ],
    logs: [
        { time: "Agora", type: "success", message: "Conexão com a API do Meta restabelecida e operando em latência mínima." },
        { time: "Há 5 min", type: "success", message: "Fluxo 'Entrada de Lead' concluído: novos leads injetados no CRM." },
        { time: "Há 12 min", type: "success", message: "Webhook de pagamentos confirmou sincronia estável com servidor." }
    ],
    alerts: [
        { title: "Ecossistema Estável", message: "Todas as integrações operacionais. Nenhuma falha detectada nas últimas 24h.", priority: "baixa" }
    ]
};
