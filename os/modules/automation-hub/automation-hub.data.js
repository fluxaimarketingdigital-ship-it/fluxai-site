export const automationHubData = {
    integrations: [
        { id: 'meta-api', label: 'Meta API', status: 'operacional', icon: 'fa-brands fa-facebook' },
        { id: 'crm-sync', label: 'CRM Sync', status: 'atenção', icon: 'fa-solid fa-sync' },
        { id: 'whatsapp-api', label: 'WhatsApp API', status: 'estável', icon: 'fa-brands fa-whatsapp' },
        { id: 'webhook-leads', label: 'Webhook Leads', status: 'falha parcial', icon: 'fa-solid fa-cloud-arrow-down' }
    ],
    flows: [
        { id: 'flow-01', name: "Entrada de Lead → CRM", trigger: "Formulário Site", target: "RD Station", status: "ativo", impact: "Receita" },
        { id: 'flow-02', name: "Aprovação Ativo → Agendamento", trigger: "Governança", target: "Google Calendar", status: "ativo", impact: "Operação" },
        { id: 'flow-03', name: "Publicação → Analytics", trigger: "Content Engine", target: "Dashboard", status: "processando", impact: "Autoridade" },
        { id: 'flow-04', name: "Novo Cliente → Notificação", trigger: "Stripe", target: "Slack", status: "estável", impact: "Retenção" }
    ],
    queue: [
        { id: "EXE-402", flow: "Sincronização CRM", status: "aguardando", time: "14:22", impact: "Médio" },
        { id: "EXE-403", flow: "Webhook Leads", status: "erro", time: "14:20", impact: "Crítico" },
        { id: "EXE-404", flow: "Publicação Editorial", status: "processando", time: "14:25", impact: "Baixo" }
    ],
    logs: [
        { time: "14:22", type: "error", message: "Falha na sincronização do CRM detectada. Tentando reconexão em 5m." },
        { time: "14:15", type: "success", message: "Fluxo 'Entrada de Lead' concluído: 12 novos leads processados." },
        { time: "13:50", type: "warning", message: "Atraso detectado na API do WhatsApp. Latência acima do normal." }
    ],
    alerts: [
        { title: "Integração Parada", message: "Meta API sem atividade há 2h.", priority: "alta" },
        { title: "Falha Repetitiva", message: "Webhook falhou 3x consecutivas.", priority: "crítica" }
    ]
};
