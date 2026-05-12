export const gptLayerData = {
    activeContext: [
        { module: "CRM Intelligence", status: "Reading", items: 42, focus: "Lead Temperature" },
        { module: "Content Engine", status: "Analyzing", items: 12, focus: "Performance Correlation" },
        { module: "Analytics", status: "Synthesizing", items: 150, focus: "Conversion Patterns" }
    ],
    operationalInsights: [
        {
            id: 'GPT-INS-01',
            type: 'Interpretativo',
            context: 'CRM + Content',
            insight: "Identificada queda de 12% no engajamento de leads 'Enterprise' após o envio do último Whitepaper. Sugere-se ajuste no tom técnico para o próximo envio.",
            action: "Gerar Draft de Ajuste"
        },
        {
            id: 'GPT-INS-02',
            type: 'Sugestivo',
            context: 'Automation + CRM',
            insight: "O fluxo de nutrição 'High-Ticket' está retendo leads por mais de 48h na etapa de diagnóstico. Sugere-se ativação de lembrete operacional no WhatsApp.",
            action: "Configurar Gatilho"
        }
    ],
    assistedWorkflows: [
        {
            title: "Otimização de Pauta Editorial",
            description: "Baseado no aprendizado contextual do MOD.07, o sistema sugere focar em 'Infraestrutura de Dados' para o próximo ciclo.",
            suggestedDraft: "Por que a soberania de dados é o novo diferencial competitivo para consultorias B2B?"
        },
        {
            title: "Refinamento de Segmentação",
            description: "A análise de cruzamento sugere que leads vindos do LinkedIn Ads têm 3x mais probabilidade de aprovação na Governança.",
            suggestedDraft: "Ajustar prioridade de entrada para origem: LinkedIn Ads."
        }
    ],
    status: {
        engine: "Operational",
        latency: "42ms",
        contextDepth: "High"
    }
};
