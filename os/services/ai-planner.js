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
     * Realiza uma auditoria operacional completa baseada na Infraestrutura Digital do cliente
     */
    auditInfrastructure: (project) => {
        const infra = project.digital_infrastructure || project.metadata?.digital_infrastructure;
        if (!infra) {
            return `[ANÁLISE ECOSSISTEMA FLUXAI OS™]
- Canais Ativos: Instagram, Site institucional.
- Canais Ausentes: TikTok, YouTube, WhatsApp Business.
- Maturidade Digital: Bronze (Operação analógica parcial).
- Riscos para Tráfego: Alto risco (Ausência de pixel ou CAPI ativa no Meta).
- Gargalos Operacionais: Fluxo de aprovação manual e sem CRM estruturado.
- Possibilidades de Automação: Integração de lead sheets e notificações em tempo real.
- Recomendação de Publicação: Instagram e posts semanais no Site.
- Requisito de Configuração: Configurar o Pixel do Meta e GA4 antes de escalar.`;
        }

        const active = infra.active_platforms || [];
        const integrations = infra.integrations || [];
        
        // 1. Canais Ausentes
        const standardChannels = ["Instagram", "Facebook", "WhatsApp Business", "Google Business Profile", "LinkedIn", "TikTok", "YouTube", "Site", "Blog", "E-mail marketing"];
        const missing = standardChannels.filter(c => !active.includes(c));

        // 2. Gargalos e Dependências
        const bottlenecks = [];
        const dependencies = [];
        const risks = [];
        
        // Meta audit
        const meta = infra.meta || {};
        if (meta.business_manager === 'Não') bottlenecks.push("Business Manager (BM) do Meta está inativo ou inacessível");
        if (meta.instagram_connected === 'Não') bottlenecks.push("Instagram comercial desvinculado da página do Facebook");
        if (meta.pixel === 'Não') {
            risks.push("Aquisição paga ativa no Meta sem Pixel configurado (risco severo de perda de dados e otimização)");
            dependencies.push("Instalação e verificação do Meta Pixel");
        }
        if (meta.conversions_api === 'Não') {
            risks.push("Campanhas sem API de Conversões do Meta (redução de 30%+ na recepção de eventos devido a AdBlockers)");
            dependencies.push("Configuração da Conversions API (CAPI)");
        }
        if (meta.admin_permissions === 'Não') bottlenecks.push("Permissões de Administrador do Meta não liberadas à assessoria");

        // Google audit
        const google = infra.google || {};
        if (google.analytics === 'Não') {
            risks.push("Ausência de GA4 ativo para mapeamento de funil web");
            dependencies.push("Instalação do Google Analytics 4");
        }
        if (google.tag_manager === 'Não') bottlenecks.push("Google Tag Manager inativo (limita agilidade em scripts futuros)");
        if (google.business_profile === 'Não') bottlenecks.push("Google Business Profile (Ficha Local) desatualizado ou inativo");
        if (google.conversions === 'Não') {
            risks.push("Sem tagueamento de conversões customizadas no Google Ads");
            dependencies.push("Configurar metas e tags globais de conversão");
        }

        // Web structure audit
        const web = infra.web || {};
        if (web.current_domain && !web.desired_domain) {
            dependencies.push("Redirecionamento/migração do domínio atual");
        }
        if (web.blog_seo === 'Sim' && !active.includes("Blog")) {
            bottlenecks.push("Escopo prevê Blog de Conteúdo SEO, mas Blog não está ativado");
        }

        // 3. Maturidade Digital
        let score = 0;
        if (active.length > 3) score += 20;
        if (meta.pixel === 'Sim') score += 15;
        if (meta.conversions_api === 'Sim') score += 15;
        if (google.analytics === 'Sim') score += 15;
        if (integrations.length > 2) score += 15;
        if (meta.business_manager === 'Sim' && google.tag_manager === 'Sim') score += 20;

        let maturity = "Bronze (Iniciante Digital)";
        if (score >= 80) maturity = "Black (Elite Operacional)";
        else if (score >= 60) maturity = "Ouro (Infraestrutura Avançada)";
        else if (score >= 35) maturity = "Prata (Infraestrutura Estável)";

        // 4. Possibilidades de Automação
        const automations = [];
        if (!integrations.includes("CRM")) automations.push("Conexão entre formulários web e CRM via Webhook");
        if (!integrations.includes("WhatsApp")) automations.push("Disparo automático de boas-vindas e lembretes via API oficial do WhatsApp");
        if (!integrations.includes("Calendário")) automations.push("Fluxo automatizado de agendamento integrado à agenda do decisor");
        if (integrations.includes("Planilhas") && !integrations.includes("Dashboard")) automations.push("Migrar base de planilhas para Dashboard visual em tempo real");

        if (automations.length === 0) automations.push("Automações ativas maximizadas no funil atual");

        // 5. Recomendações de Publicação e Escala
        const recommendations = [];
        if (active.includes("Instagram") && !active.includes("TikTok")) {
            recommendations.push("Reaproveitar 100% dos Reels estratégicos da FluxAI no TikTok de forma orgânica");
        }
        if (active.includes("Google Business Profile") && google.business_profile === 'Sim') {
            recommendations.push("Publicar atualizações semanais e fotos reais na Ficha do Google para rankeamento local");
        }
        if (meta.pixel === 'Sim' && meta.conversions_api === 'Sim') {
            recommendations.push("Pronto para escala vertical de tráfego Meta Ads (infraestrutura de dados robusta)");
        } else {
            recommendations.push("Ajustar trackings e verificar eventos antes de iniciar qualquer escala de mídia");
        }

        return `[ANÁLISE ECOSSISTEMA FLUXAI OS™]
- Canais Ativos: ${active.length > 0 ? active.join(", ") : "Nenhum cadastrado"}
- Canais Ausentes: ${missing.length > 0 ? missing.join(", ") : "Nenhum ausente"}
- Maturidade Digital: ${maturity} (${score} pts)
- Riscos para Tráfego: ${risks.length > 0 ? "\n  • " + risks.join("\n  • ") : "Nenhum risco detectado"}
- Gargalos Operacionais: ${bottlenecks.length > 0 ? "\n  • " + bottlenecks.join("\n  • ") : "Nenhum gargalo estrutural detectado"}
- Dependências Técnicas: ${dependencies.length > 0 ? "\n  • " + dependencies.join("\n  • ") : "Nenhuma dependência pendente"}
- Possibilidades de Automação: \n  • ${automations.slice(0, 3).join("\n  • ")}
- Recomendações de Escala: \n  • ${recommendations.join("\n  • ")}`;
    },

    /**
     * Gera o planejamento estratégico operacional completo
     */
    generatePlan: async (projectId, specificService = 'ALL', maxToGenerate = 99) => {
        const supabase = window.getSupabase();
        const { data: project } = await supabase.from('projects').select('*, contracts(*)').eq('id', projectId).single();
        
        const onboarding = project.metadata?.onboarding || {};
        const opsActivation = project.metadata?.operational_activation || project.operational_activation || {};
        
        const icp = onboarding.icp || "Público High-Ticket, busca exclusividade";
        const tone = onboarding.voice_tone || onboarding.tone || "Soberano, técnico";
        const objectives = onboarding.primary_pain ? `Resolver dor: ${onboarding.primary_pain}` : "Escala e Autoridade";
        
        const painPoints = opsActivation.pain_points ? opsActivation.pain_points.join(', ') : "Não especificado";
        const dnaDesired = opsActivation.dna?.desired_patterns ? opsActivation.dna.desired_patterns.join(', ') : "Premium";
        const dnaAnti = opsActivation.dna?.anti_patterns ? opsActivation.dna.anti_patterns.join(', ') : "Amadorismo";

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

            // Aplicando inteligência de horário de publicação estratégica premium (alternando horários de alto tráfego)
            let targetHour = 12;
            let targetMinute = 0;
            if (service.platform === 'REELS' || service.platform === 'INSTAGRAM') {
                const peakHours = [12, 18, 10, 20];
                const peakMinutes = [0, 30, 45, 0];
                const index = daysOffset % peakHours.length;
                targetHour = peakHours[index];
                targetMinute = peakMinutes[index];
            } else {
                targetHour = 9; // Horário comercial padrão
                targetMinute = 0;
            }
            date.setHours(targetHour, targetMinute, 0, 0);

            const scheduledAt = date;
            const strategicDeadline = new Date(scheduledAt.getTime() - (5 * 24 * 60 * 60 * 1000));
            strategicDeadline.setHours(18, 0, 0, 0);

            const auditSummary = AIPlanner.auditInfrastructure(project);

            contents.push({
                project_id: projectId,
                title: `${service.name} • Estratégico`,
                status: 'PLANEJAMENTO',
                priority: 'MÉDIA',
                platform: service.platform,
                scheduled_at: scheduledAt.toISOString(),
                caption: service.template
                    .replace('[OBJ]', objectives)
                    .replace(/\[IA\]/g, `Gerado conforme o tom ${tone} para atingir o ICP: ${icp}
⚠️ FOCO ESTRATÉGICO: Mitigar dores de ${painPoints}.
🧬 DNA DA MARCA: Transmitir (${dnaDesired}), Evitar estritamente (${dnaAnti}).

${auditSummary}`),
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
