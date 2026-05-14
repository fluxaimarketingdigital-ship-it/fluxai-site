export const AIPlanner = {
    /**
     * Matriz Estratégica por Tipo de Serviço
     */
    STRATEGIC_MATRIX: {
        'REELS': { name: 'REELS', platform: 'INSTAGRAM', template: '🎯 OBJETIVO: [OBJ]\n🎬 HOOK: [IA]\n💬 FALAS: [IA]\n👁️ DIREÇÃO: [IA]\n✨ CTA: [IA]\n🧠 GATILHO: [IA]\n⏳ TEMPO: 45s' },
        'CARROSSEL': { name: 'CARROSSEL', platform: 'INSTAGRAM', template: '🎯 OBJETIVO: [OBJ]\n📚 ESTRUTURA: Slide 1-10 [IA]\n🎨 HIERARQUIA: [IA]\n✨ CTA: [IA]\n🧲 TENSÃO: [IA]' },
        'SITE': { name: 'SITE', platform: 'WEB', template: '🎯 OBJETIVO: Conversão\n🏗️ ARQUITETURA: Seções [IA]\n🖱️ FLUXO UX: [IA]\n📝 COPY BASE: [IA]\n🔍 SEO: [IA]' },
        'BRANDING': { name: 'BRANDING', platform: 'ESTRATÉGIA', template: '🎯 OBJETIVO: Posicionamento\n🗣️ NARRATIVA: [IA]\n🎨 PALETA/TOM: [IA]\n💎 DIFERENCIAÇÃO: [IA]' },
        'TRAFEGO': { name: 'TRÁFEGO PAGO', platform: 'META/GOOGLE', template: '🎯 OBJETIVO: Aquisição\n📈 CAMPANHAS: [IA]\n🖼️ CRIATIVOS: [IA]\n🎯 PÚBLICO: [IA]\n💰 DISTRIBUIÇÃO: [IA]' },
        'CRM': { name: 'CRM', platform: 'OPERACIONAL', template: '🎯 OBJETIVO: Relacionamento\n⛓️ PIPELINE: Etapas [IA]\n🤖 AUTOMAÇÃO: [IA]\n🌡️ HEALTH SCORE: [IA]' },
        'AUTOMACAO': { name: 'AUTOMAÇÃO', platform: 'SISTEMA', template: '🎯 OBJETIVO: Eficiência\n⚙️ FLUXO LÓGICO: [IA]\n🔗 INTEGRAÇÕES: [IA]\n⚡ GATILHOS: [IA]' },
        'DASHBOARD': { name: 'DASHBOARD', platform: 'ANALYTICS', template: '🎯 OBJETIVO: Inteligência\n📊 KPIs: [IA]\n🧐 LEITURA: [IA]\n📌 PRIORIDADES: [IA]' },
        'CONSULTORIA': { name: 'CONSULTORIA', platform: 'ESTRATÉGICO', template: '🎯 OBJETIVO: Diagnóstico\n⚠️ GARGALOS: [IA]\n🚀 OPORTUNIDADES: [IA]\n📍 DIRECIONAMENTO: [IA]' }
    },

    /**
     * Gera o planejamento estratégico operacional completo
     */
    generatePlan: async (projectId) => {
        const supabase = window.getSupabase();
        const { data: project } = await supabase.from('projects').select('*, contracts(*)').eq('id', projectId).single();
        
        const onboarding = project.metadata?.onboarding || {
            icp: "Público High-Ticket, busca exclusividade",
            tone: "Soberano, técnico",
            objectives: "Escala e Autoridade"
        };

        const contents = [];
        const now = new Date();
        const services = Object.keys(AIPlanner.STRATEGIC_MATRIX);

        // Gerar 1 item de cada serviço para demonstrar a abrangência do Plano Mestre
        services.forEach((sKey, index) => {
            const service = AIPlanner.STRATEGIC_MATRIX[sKey];
            const date = new Date(now.getTime() + (index * 24 * 60 * 60 * 1000));
            
            contents.push({
                project_id: projectId,
                title: `${service.name} • Estratégico`,
                status: 'PAUTA',
                priority: 'ALTA',
                platform: service.platform,
                scheduled_at: date.toISOString(),
                caption: service.template
                    .replace('[OBJ]', onboarding.objectives)
                    .replace(/\[IA\]/g, 'Gerado conforme o tom ' + onboarding.tone + ' para atingir o ICP: ' + onboarding.icp),
                internal_notes: `PLANO MESTRE V7: Focado em ${onboarding.objectives}.`
            });
        });

        return contents;
    }
};
