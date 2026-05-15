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
    generatePlan: async (projectId, specificService = 'ALL', maxToGenerate = 99) => {
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

        // Determinar dias estratégicos baseados em métricas (Onboarding)
        // Se não houver definição, usa dias úteis (Seg-Sex) como base de escala
        const strategicDays = project.metadata?.onboarding?.best_posting_days || [1, 2, 3, 4, 5]; 
        
        const contents = [];
        const now = new Date();
        
        // Determinar quais serviços gerar
        let servicesToGenerate = [];
        const availableKeys = Object.keys(AIPlanner.STRATEGIC_MATRIX);
        
        if (specificService === 'ALL') {
            // Repetir a matriz até preencher a cota (Ex: se cota é 12 e matriz tem 10, gera os 10 + 2 primeiros)
            let i = 0;
            while (servicesToGenerate.length < maxToGenerate) {
                servicesToGenerate.push(availableKeys[i % availableKeys.length]);
                i++;
            }
        } else {
            // Se for serviço específico, vamos gerar várias instâncias dele até atingir o limite
            servicesToGenerate = Array(maxToGenerate).fill(specificService);
        }

        let daysOffset = 0;

        servicesToGenerate.forEach((sKey) => {
            const service = AIPlanner.STRATEGIC_MATRIX[sKey];
            if (!service) return;
            
            let date;
            let found = false;
            
            // Procurar o próximo slot livre (Preenchendo lacunas de itens excluídos)
            while (!found) {
                date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                date.setDate(date.getDate() + daysOffset);
                
                const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                
                // Só gera para o futuro e em dias estratégicos não ocupados
                if (strategicDays.includes(date.getDay()) && !occupiedDates.includes(dateKey)) {
                    found = true;
                    occupiedDates.push(dateKey);
                }
                daysOffset++;
            }

            // CÁLCULO AUTOMÁTICO DE SLA
            const scheduledAt = date;
            const strategicDeadline = new Date(scheduledAt.getTime() - (5 * 24 * 60 * 60 * 1000));
            strategicDeadline.setHours(18, 0, 0, 0);

            contents.push({
                project_id: projectId,
                title: `${service.name} • Estratégico`,
                status: 'PLANEJAMENTO',
                priority: 'ALTA',
                platform: service.platform,
                scheduled_at: scheduledAt.toISOString(),
                caption: service.template
                    .replace('[OBJ]', onboarding.objectives)
                    .replace(/\[IA\]/g, 'Gerado conforme o tom ' + onboarding.tone + ' para atingir o ICP: ' + onboarding.icp),
                metadata: {
                    responsible: service.platform === 'INSTAGRAM' ? 'Design' : 'Social Media',
                    version: 'V1',
                    approval_deadline: strategicDeadline.toISOString(),
                    risk: false
                },
                internal_notes: "" // Removida a mensagem redundante
            });
        });

        return contents;
    }
};
