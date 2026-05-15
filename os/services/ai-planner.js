export const AIPlanner = {
    /**
     * Matriz Estratégica por Tipo de Serviço (Portfólio FluxAI)
     */
    STRATEGIC_MATRIX: {
        'REELS': { 
            name: 'Direção Audiovisual (Reels)', 
            platform: 'INSTAGRAM', 
            template: '📍 DIREÇÃO ESTRATÉGICA: [OBJ]\n🎯 OBJETIVO: [OBJ]\n💎 TEMA: [IA]\n🎬 HOOK: [IA]\n⏳ RETENÇÃO: [IA]\n💬 FALAS: [IA]\n🤸 DIREÇÃO CORPORAL: [IA]\n🎵 RITMO E PAUSAS: [IA]\n🎥 CENAS: [IA]\n✨ APOIO VISUAL: [IA]\n🚀 CTA: [IA]\n📝 LEGENDA: [IA]\n# HASHTAGS: [IA]\n⏰ HORÁRIO IDEAL: [IA]' 
        },
        'CARROSSEL': { 
            name: 'Estrutura Narrativa (Carrossel)', 
            platform: 'INSTAGRAM', 
            template: '📍 DIREÇÃO ESTRATÉGICA: [OBJ]\n🎯 OBJETIVO: [OBJ]\n💎 TEMA: [IA]\n🔥 TENSÃO INICIAL: [IA]\n🎴 SLIDE 01 (RETENÇÃO): [IA]\n📚 PROGRESSÃO NARRATIVA: [IA]\n⚡ QUEBRA: [IA]\n💡 EXPLICAÇÃO: [IA]\n🔍 APROFUNDAMENTO: [IA]\n🚀 CTA: [IA]\n📝 LEGENDA: [IA]\n⏰ HORÁRIO IDEAL: [IA]' 
        },
        'CARD': { 
            name: 'Direção Estratégica Visual (Card)', 
            platform: 'INSTAGRAM', 
            template: '📍 DIREÇÃO ESTRATÉGICA: [OBJ]\n🎯 OBJETIVO: [OBJ]\n📢 HEADLINE: [IA]\n🎭 INTENÇÃO EMOCIONAL: [IA]\n🎨 DIREÇÃO VISUAL: [IA]\n📐 HIERARQUIA TEXTUAL: [IA]\n🚀 CTA: [IA]\n📝 LEGENDA: [IA]\n⏰ HORÁRIO IDEAL: [IA]' 
        },
        'STORIES': { 
            name: 'Fluxo Estratégico de Stories', 
            platform: 'INSTAGRAM', 
            template: '📍 DIREÇÃO ESTRATÉGICA: [OBJ]\n🎯 OBJETIVO: [OBJ]\n📱 SEQUÊNCIA: [IA]\n💬 INTERAÇÃO: [IA]\n📊 ENQUETE: [IA]\n🤝 CONEXÃO: [IA]\n🚀 CTA: [IA]\n📥 RESPOSTA ESPERADA: [IA]' 
        },
        'SITE': { 
            name: 'Arquitetura Estratégica Digital (Site)', 
            platform: 'WEB', 
            template: '📍 DIREÇÃO ESTRATÉGICA: [OBJ]\n🎯 OBJETIVO DO SITE: [OBJ]\n👥 ICP: [IA]\n🗺️ JORNADA DO USUÁRIO: [IA]\n🏗️ ESTRUTURA DE PÁGINAS: [IA]\n🖱️ ARQUITETURA DE NAVEGAÇÃO: [IA]\n🧱 SEÇÕES: [IA]\n📝 COPY ESTRUTURAL: [IA]\n🚀 CTA: [IA]\n📈 CONVERSÃO: [IA]\n🔍 SEO ESTRUTURAL: [IA]' 
        },
        'LP': { 
            name: 'Estrutura Estratégica de Conversão (LP)', 
            platform: 'WEB', 
            template: '📍 DIREÇÃO ESTRATÉGICA: [OBJ]\n🎯 OBJETIVO: [OBJ]\n🎁 OFERTA: [IA]\n📢 HEADLINE: [IA]\n🛡️ QUEBRA DE OBJEÇÃO: [IA]\n✅ PROVA: [IA]\n🚀 CTA PRINCIPAL: [IA]\n⛓️ FLUXO PERSUASIVO: [IA]\n📈 CONVERSÃO: [IA]' 
        },
        'BRANDING': { 
            name: 'Arquitetura de Posicionamento', 
            platform: 'BRAND', 
            template: '📍 DIREÇÃO ESTRATÉGICA: [OBJ]\n🩺 DIAGNÓSTICO: [IA]\n👁️ PERCEPÇÃO ATUAL: [IA]\n✨ PERCEPÇÃO DESEJADA: [IA]\n👥 ICP: [IA]\n🏆 POSICIONAMENTO: [IA]\n💎 DIFERENCIAÇÃO: [IA]\n🗣️ NARRATIVA: [IA]\n🎨 TOM DE VOZ: [IA]\n👁️‍🗨️ COMPORTAMENTO VISUAL: [IA]' 
        },
        'ID_VISUAL': { 
            name: 'Sistema de Identidade Visual', 
            platform: 'DESIGN', 
            template: '📍 DIREÇÃO ESTRATÉGICA: [OBJ]\n✨ PERCEPÇÃO DESEJADA: [IA]\n🎨 DIREÇÃO ESTÉTICA: [IA]\n🌈 PALETA: [IA]\n🔡 TIPOGRAFIA: [IA]\n📐 GRID: [IA]\n👁️‍🗨️ COMPORTAMENTO VISUAL: [IA]\n🖼️ APLICAÇÕES: [IA]\n🔄 CONSISTÊNCIA: [IA]' 
        },
        'TRAFEGO': { 
            name: 'Estratégia de Aquisição (Tráfego)', 
            platform: 'ADS', 
            template: '📍 DIREÇÃO ESTRATÉGICA: [OBJ]\n🎯 OBJETIVO: [OBJ]\n👥 ICP: [IA]\n🎁 OFERTA: [IA]\n🖼️ CRIATIVO: [IA]\n📝 COPY: [IA]\n🚀 CTA: [IA]\n🎯 SEGMENTAÇÃO: [IA]\n🔬 HIPÓTESE ESTRATÉGICA: [IA]\n📈 CONVERSÃO: [IA]' 
        },
        'CRM': { 
            name: 'Estrutura de Relacionamento (CRM)', 
            platform: 'CRM', 
            template: '📍 DIREÇÃO ESTRATÉGICA: [OBJ]\n📥 ENTRADA DO LEAD: [IA]\n🔍 QUALIFICAÇÃO: [IA]\n🔥 TEMPERATURA: [IA]\n📊 HEALTH SCORE: [IA]\n⛓️ PIPELINE: [IA]\n🤖 AUTOMAÇÃO: [IA]\n🔄 ACOMPANHAMENTO: [IA]\n📈 RETENÇÃO: [IA]' 
        },
        'AUTOMACAO': { 
            name: 'Arquitetura Operacional (Automação)', 
            platform: 'SISTEMA', 
            template: '📍 DIREÇÃO ESTRATÉGICA: [OBJ]\n🎯 OBJETIVO: [OBJ]\n⚙️ FLUXO LÓGICO: [IA]\n⚡ TRIGGERS: [IA]\n🔗 INTEGRAÇÕES: [IA]\n🚀 AÇÕES: [IA]\n⚠️ FALLBACK: [IA]\n📊 MONITORAMENTO: [IA]\n📜 LOGS: [IA]' 
        },
        'DASHBOARD': { 
            name: 'Infraestrutura Analítica', 
            platform: 'DADOS', 
            template: '📍 DIREÇÃO ESTRATÉGICA: [OBJ]\n🎯 OBJETIVO ANALÍTICO: [OBJ]\n📊 KPIs: [IA]\n📐 HIERARQUIA DE LEITURA: [IA]\n📈 MÉTRICAS PRINCIPAIS: [IA]\n⚠️ ALERTAS: [IA]\n🔍 CONTEXTO OPERACIONAL: [IA]\n🧠 TOMADA DE DECISÃO: [IA]' 
        },
        'APRESENTACAO': { 
            name: 'Estrutura Institucional', 
            platform: 'VENDAS', 
            template: '📍 DIREÇÃO ESTRATÉGICA: [OBJ]\n🎯 OBJETIVO: [OBJ]\n🗣️ NARRATIVA: [IA]\n⚠️ PROBLEMA: [IA]\n✅ SOLUÇÃO: [IA]\n🏆 PROVA: [IA]\n🎨 ESTRUTURA VISUAL: [IA]\n📐 HIERARQUIA: [IA]\n🚀 CTA FINAL: [IA]' 
        },
        'CONSULTORIA': { 
            name: 'Diagnóstico Estratégico', 
            platform: 'DIAGNÓSTICO', 
            template: '📍 DIREÇÃO ESTRATÉGICA: [OBJ]\n🩺 DIAGNÓSTICO: [IA]\n⚠️ GARGALOS: [IA]\n💥 IMPACTOS: [IA]\n🚀 OPORTUNIDADES: [IA]\n🎯 PRIORIDADES: [IA]\n🗺️ PLANO ESTRATÉGICO: [IA]\n⚙️ EXECUÇÃO: [IA]' 
        },
        'GOVOS': { 
            name: 'GOVOS™ | Infra Pública Digital', 
            platform: 'GOV', 
            template: '📍 DIREÇÃO ESTRATÉGICA: [OBJ]\n🩺 DIAGNÓSTICO MUNICIPAL: [IA]\n⚙️ ESTRUTURA OPERACIONAL: [IA]\n⛓️ FLUXOS PÚBLICOS: [IA]\n🌐 SERVIÇOS DIGITAIS: [IA]\n🏛️ GOVERNANÇA: [IA]\n👥 EXPERIÊNCIA DO CIDADÃO: [IA]\n📊 PAINÉIS EXECUTIVOS: [IA]\n🏗️ INFRAESTRUTURA PÚBLICA: [IA]' 
        }
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

        const strategicDays = project.metadata?.onboarding?.best_posting_days || [1, 2, 3, 4, 5]; 
        
        const contents = [];
        const now = new Date();
        
        let servicesToGenerate = [];
        const availableKeys = Object.keys(AIPlanner.STRATEGIC_MATRIX);
        
        if (specificService === 'ALL') {
            let i = 0;
            while (servicesToGenerate.length < maxToGenerate) {
                servicesToGenerate.push(availableKeys[i % availableKeys.length]);
                i++;
            }
        } else {
            servicesToGenerate = Array(maxToGenerate).fill(specificService);
        }

        let daysOffset = 0;

        servicesToGenerate.forEach((sKey) => {
            const service = AIPlanner.STRATEGIC_MATRIX[sKey];
            if (!service) return;
            
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

            const scheduledAt = date;
            const strategicDeadline = new Date(scheduledAt.getTime() - (5 * 24 * 60 * 60 * 1000));
            strategicDeadline.setHours(18, 0, 0, 0);

            contents.push({
                project_id: projectId,
                title: `${service.name} • Estratégico`,
                status: 'PLANEJAMENTO',
                priority: 'MÉDIA',
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
                internal_notes: ""
            });
        });

        return contents;
    }
};
