export const intelligenceData = {
    learnings: [
        {
            id: 'LOG-CTX-01',
            title: "Performance: Conteúdo vs Qualificação CRM",
            insight: "Ativos de 'Autoridade Técnica' (Whitepapers) apresentam correlação de +22% na temperatura de leads CRM no ciclo de 30 dias.",
            modules: ['Content', 'CRM'],
            impact: "Aumento de Qualificação",
            severity: 'info'
        },
        {
            id: 'LOG-CTX-02',
            title: "Eficiência de Fluxo: Automação vs Governança",
            insight: "Redução de 4h/dia em processamento manual. Taxa de conversão final vinculada ao tempo de resposta no MOD.05.",
            modules: ['Automation', 'Governance'],
            impact: "Otimização de Tempo",
            severity: 'info'
        },
        {
            id: 'LOG-CTX-03',
            title: "Monitoramento de Churn: Analytics vs CRM",
            insight: "Clientes com engajamento regular em 'Relatórios Estratégicos' mantêm taxa de churn 15% inferior à média sistêmica.",
            modules: ['Analytics', 'CRM'],
            impact: "LTV / Retenção",
            severity: 'info'
        }
    ],
    contextualInsights: [
        { label: "Sincronização de Dados", value: "98.5%", trend: "Estável", context: "Entre CRM e Analytics" },
        { label: "Aderência Editorial", value: "92%", trend: "+5%", context: "Alinhamento com ICP" },
        { label: "Velocidade de Governança", value: "4.2h", trend: "-1h", context: "Média de aprovação" }
    ],
    decisionSupport: [
        {
            title: "Recomendação Operacional",
            desc: "Aumentar a frequência de ativos do tipo 'Whitepaper' para o segmento industrial, dado o alto engajamento no CRM.",
            action: "Escalar Produção",
            severity: 'attention'
        },
        {
            title: "Alerta de Integridade",
            desc: "A divergência de 2% entre Analytics e CRM sugere revisão nos protocolos de Webhook.",
            action: "Auditar Conectores",
            severity: 'critical'
        }
    ]
};
