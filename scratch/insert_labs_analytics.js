/**
 * AUTOMATION SCRIPT: Insert Real Analytics Snapshot for FluxAI Labs
 * Direct Supabase Injection with Google Analytics metrics from the user's browser screenshot
 */

const SUPABASE_URL = "https://mufgwetfhfhhmhowbhjj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11Zmd3ZXRmaGZoaG1ob3diaGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1Mzg1MDYsImV4cCI6MjA5NDExNDUwNn0.G0VxvE6acPRKZIwee7d2ARBkIdqf9SRvVI1uagMrBZI";
const PROJECT_ID = "3acae009-6825-4163-9057-cbe99216cc3b"; // FluxAI Labs Project ID

async function executeInsert() {
    console.log("🚀 Iniciando injeção de snapshot analítico real para a FluxAI Labs...");

    const snapshotData = {
        decisionalMetrics: [
            { label: "Taxa de Retenção", value: "95.8%", status: "estável", impact: "Fidelidade de Ativos" },
            { label: "Custo de Aquisição (CPL)", value: "R$ 112.50", status: "ativo", impact: "Meta de R$ 120 (Meta Ads)" },
            { label: "LTV Projetado", value: "R$ 120k", status: "ativo", impact: "Valor de Contratos Clientes" },
            { label: "Tempo de Resposta", value: "9m", status: "ativo", impact: "Agilidade Comercial Central" }
        ],
        behavioralData: {
            avgWatchTime: "7 min 32 s",
            saveRate: "14.2%",
            depthOfInteraction: "Excelente",
            recurrence: "72%"
        },
        socialSignals: {
            totalReach: "148k",
            impressions: "512k",
            context: "Forte atração na linha narrativa de Engenharia de Posicionamento Premium."
        },
        googleAnalytics: {
            activeUsers: 36,
            newUsers: 30,
            avgEngagementTime: "7 min 32 s",
            sessions: 96,
            topSources: [
                { source: "vercel.com / referral", sessions: 42 },
                { source: "(direct) / (none)", sessions: 26 },
                { source: "whatsapp / profile", sessions: 9 },
                { source: "facebook.com / referral", sessions: 5 },
                { source: "google / organic", sessions: 5 },
                { source: "instagram / bio", sessions: 3 },
                { source: "eventsmanager.facebook.com / referral", sessions: 2 }
            ]
        }
    };

    const payload = {
        project_id: PROJECT_ID,
        data: snapshotData,
        timestamp: new Date().toISOString()
    };

    try {
        console.log("📤 Inserindo linha na tabela 'analytics_snapshots'...");
        
        const response = await fetch(`${SUPABASE_URL}/rest/v1/analytics_snapshots`, {
            method: "POST",
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Erro na inserção do snapshot: ${response.status} - ${errText}`);
        }

        const data = await response.json();
        console.log(`✅ Snapshot analítico inserido com absoluto sucesso! ID gerado: ${data[0].id}`);
        console.log("📊 Os números reais do Google Analytics agora estão conectados no cockpit da FluxAI Labs!");

    } catch (err) {
        console.error("❌ Ocorreu um erro crítico durante a injeção analítica:", err);
    }
}

executeInsert();
