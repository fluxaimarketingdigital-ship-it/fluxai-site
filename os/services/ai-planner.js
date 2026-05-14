export const AIPlanner = {
    /**
     * Matriz Estratégica por Tipo de Serviço
     */
    STRATEGIC_MATRIX: {
        'REELS': { name: 'Direção Audiovisual', platform: 'INSTAGRAM', template: '📍 DIREÇÃO ESTRATÉGICA: [OBJ]\n🎯 OBJETIVO: Atração de Leads High-Ticket\n🎬 HOOK: [IA]\n💬 FALAS: [IA]\n✨ CTA: [IA]\n⏳ TEMPO: 45s' },
        'CARROSSEL': { name: 'Estrutura Narrativa', platform: 'INSTAGRAM', template: '📍 DIREÇÃO ESTRATÉGICA: [OBJ]\n🎯 OBJETIVO: Autoridade Técnica e Retenção\n📚 ESTRUTURA: Slide 1-10 [IA]\n✨ CTA: [IA]\n🧲 TENSÃO: [IA]' },
        'SITE': { name: 'Arquitetura Digital', platform: 'WEB', template: '📍 DIREÇÃO ESTRATÉGICA: [OBJ]\n🎯 OBJETIVO: Conversão de Alta Autoridade\n🏗️ SEÇÕES: [IA]\n🖱️ FLUXO UX: Jornada de Decisão Executiva\n📝 COPY BASE: [IA]' },
        'DOMINIO': { name: 'Presença Digital (Domínio)', platform: 'INFRA', template: '📍 DIREÇÃO ESTRATÉGICA: [OBJ]\n🎯 OBJETIVO: Blindagem de Marca e Autoridade Digital\n🌐 DOMÍNIO: Arquitetura de DNS e Segurança SSL\n🔗 LINKAGEM: Integração com Ecossistema FluxAI' },
        'DATABASE': { name: 'Inteligência de Dados (DB)', platform: 'SISTEMA', template: '📍 DIREÇÃO ESTRATÉGICA: [OBJ]\n🎯 OBJETIVO: Rastreabilidade e Governança de Dados\n📊 ESTRUTURA: Modelagem de Banco de Dados Escalável\n🔐 SEGURANÇA: Criptografia e Backup Estratégico' },
        'BRANDING': { name: 'Posicionamento de Elite', platform: 'BRAND', template: '📍 DIREÇÃO ESTRATÉGICA: [OBJ]\n🎯 OBJETIVO: Percepção de Valor Inquestionável\n🗣️ NARRATIVA: [IA]\n🎨 TOM DE VOZ: [IA]\n💎 DIFERENCIAÇÃO: [IA]' },
        'TRAFEGO': { name: 'Aquisição Estratégica', platform: 'ADS', template: '📍 DIREÇÃO ESTRATÉGICA: [OBJ]\n🎯 OBJETIVO: Tração de Leads Qualificados (ICP)\n📈 ESTRATÉGIA: Funil de Conscientização Progressiva\n🖼️ CRIATIVOS: Foco em Dor Latente e Solução Técnica' },
        'CRM': { name: 'Inteligência de Vendas', platform: 'CRM', template: '📍 DIREÇÃO ESTRATÉGICA: [OBJ]\n🎯 OBJETIVO: Maximização de LTV e Conversão\n⛓️ PIPELINE: Estágios de Decisão [IA]\n🤖 AUTOMAÇÃO: Réguas de Relacionamento Comportamental' },
        'AUTOMACAO': { name: 'Eficiência Operacional', platform: 'SISTEMA', template: '📍 DIREÇÃO ESTRATÉGICA: [OBJ]\n🎯 OBJETIVO: Redução de Ruído e Escala de Processos\n⚙️ FLUXO: Automação de Tarefas Repetitivas\n🔗 INTEGRAÇÕES: Sincronização em Tempo Real' },
        'CONSULTORIA': { name: 'Diagnóstico de Escala', platform: 'DIAGNÓSTICO', template: '📍 DIREÇÃO ESTRATÉGICA: [OBJ]\n🎯 OBJETIVO: Identificação de Gargalos de Crescimento\n⚠️ ANÁLISE: Pontos de Atrito Operacional\n🚀 ROADMAP: Definição de Marcos para os próximos 12 meses' }
    },

    /**
     * Gera o planejamento estratégico operacional completo
     */
    generatePlan: async (projectId, specificService = 'ALL') => {
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
        
        // Determinar quais serviços gerar
        let servicesToGenerate = [];
        if (specificService === 'ALL') {
            servicesToGenerate = Object.keys(AIPlanner.STRATEGIC_MATRIX);
        } else {
            if (AIPlanner.STRATEGIC_MATRIX[specificService]) {
                servicesToGenerate = [specificService];
            } else {
                // Fallback ou erro se o serviço não existir
                servicesToGenerate = Object.keys(AIPlanner.STRATEGIC_MATRIX);
            }
        }

        const strategicDays = [2, 4, 6]; // Terça, Quinta, Sábado
        let daysOffset = 0;

        servicesToGenerate.forEach((sKey) => {
            const service = AIPlanner.STRATEGIC_MATRIX[sKey];
            
            let date;
            let found = false;
            
            while (!found) {
                date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                date.setDate(date.getDate() + daysOffset);
                
                const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                
                if (strategicDays.includes(date.getDay()) && !occupiedDates.includes(dateKey)) {
                    found = true;
                    occupiedDates.push(dateKey);
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
                internal_notes: `GERAÇÃO ESPECÍFICA: ${service.name}.`
            });
        });

        return contents;
    }
};
