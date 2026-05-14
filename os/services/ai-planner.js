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

        // Buscar datas já ocupadas para evitar colisões
        const { data: existing } = await supabase.from('content_assets')
            .select('scheduled_at')
            .eq('project_id', projectId);
        
        const occupiedDates = (existing || []).map(e => {
            const d = new Date(e.scheduled_at);
            return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        });

        const contents = [];
        const now = new Date();
        const services = Object.keys(AIPlanner.STRATEGIC_MATRIX);

        // Gerar 1 item de cada serviço seguindo uma cadência estratégica (Ter, Qui, Sáb)
        const strategicDays = [2, 4, 6]; // Terça, Quinta, Sábado
        let daysOffset = 0;

        services.forEach((sKey, index) => {
            const service = AIPlanner.STRATEGIC_MATRIX[sKey];
            
            // Encontrar próxima data estratégica que NÃO esteja ocupada
            let date;
            let found = false;
            
            while (!found) {
                date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                date.setDate(date.getDate() + daysOffset);
                
                const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                
                if (strategicDays.includes(date.getDay()) && !occupiedDates.includes(dateKey)) {
                    found = true;
                    occupiedDates.push(dateKey); // Marcar como ocupada para o próximo item
                }
                daysOffset++;
            }

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
