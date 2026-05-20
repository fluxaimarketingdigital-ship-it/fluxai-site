/**
 * AUTOMATION HUB DATA — FluxAI OS™
 * Dados reais carregados do Supabase via Make.com.
 * Este arquivo define apenas o estado inicial (sem integrações configuradas).
 */
export const automationHubData = {
    integrations: [
        { id: 'meta-api',       label: 'Meta API',       status: 'pendente',      icon: 'fa-brands fa-facebook' },
        { id: 'make-com',       label: 'Make.com',       status: 'pendente',      icon: 'fa-solid fa-bolt' },
        { id: 'whatsapp-api',   label: 'WhatsApp API',   status: 'pendente',      icon: 'fa-brands fa-whatsapp' },
        { id: 'webhook-leads',  label: 'Webhook Leads',  status: 'pendente',      icon: 'fa-solid fa-cloud-arrow-up' }
    ],
    flows: [],
    queue: [],
    logs: [
        { time: "Agora", type: "info", message: "Sistema aguardando configuração das integrações via Make.com." }
    ],
    alerts: [
        { title: "Configuração Pendente", message: "Nenhuma integração ativa. Configure os webhooks no Make.com para ativar os fluxos automáticos.", priority: "alta" }
    ]
};
