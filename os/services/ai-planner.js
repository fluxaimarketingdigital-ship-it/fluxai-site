import { KnowledgeCore } from '/os/js/os-knowledge-core.js';

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
        let project = null;
        let existing = [];
        let isDbOnline = false;

        try {
            const { data, error } = await supabase.from('projects').select('*, contracts(*)').eq('id', projectId).single();
            if (!error && data) {
                project = data;
                isDbOnline = true;
                
                const { data: dbExisting, error: existingErr } = await supabase.from('content_assets')
                    .select('scheduled_at')
                    .eq('project_id', projectId);
                if (!existingErr) {
                    existing = dbExisting || [];
                }
            }
        } catch (e) {
            console.warn('Erro ao acessar o banco de dados no planejador IA, buscando mocks locais...', e);
        }

        // Fallback Local se Supabase falhou ou não retornou dados
        if (!isDbOnline) {
            const mockProjects = JSON.parse(localStorage.getItem('fluxai_mock_projects') || '[]');
            project = mockProjects.find(p => p.id === projectId);
            
            const mockAssets = JSON.parse(localStorage.getItem('fluxai_mock_assets') || '[]');
            existing = mockAssets.filter(item => item && item.project_id === projectId);
        }
        
        const onboarding = project?.metadata?.onboarding || project?.onboarding || {};
        const opsActivation = project?.metadata?.operational_activation || project?.operational_activation || {};
        
        const icp = onboarding.icp || "Público High-Ticket, busca exclusividade";
        const tone = onboarding.voice_tone || onboarding.tone || "Soberano, técnico";
        const objectives = onboarding.primary_pain ? `Resolver dor: ${onboarding.primary_pain}` : "Escala e Autoridade";
        
        const painPoints = opsActivation.pain_points ? (Array.isArray(opsActivation.pain_points) ? opsActivation.pain_points.join(', ') : opsActivation.pain_points) : "Não especificado";
        const dnaDesired = opsActivation.dna?.desired_patterns ? (Array.isArray(opsActivation.dna.desired_patterns) ? opsActivation.dna.desired_patterns.join(', ') : opsActivation.dna.desired_patterns) : "Premium";
        const dnaAnti = opsActivation.dna?.anti_patterns ? (Array.isArray(opsActivation.dna.anti_patterns) ? opsActivation.dna.anti_patterns.join(', ') : opsActivation.dna.anti_patterns) : "Amadorismo";

        const occupiedDates = (existing || []).map(e => {
            const d = new Date(e.scheduled_at);
            return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        });

        const strategicDays = project?.metadata?.onboarding?.best_posting_days || [1, 2, 3, 4, 5]; 
        
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

        let daysOffset = 3; // Começa sempre no mínimo 3 dias no futuro para dar folga de aprovação

        const openAiKey = localStorage.getItem('openai_api_key');
        
        for (const sKey of servicesToGenerate) {
            const service = AIPlanner.STRATEGIC_MATRIX[sKey];
            if (!service) continue;
            
            let date;
            let found = false;
            let dayPosition = 0; // Identifica se é o 1º ou 2º post do mesmo dia
            
            while (!found) {
                date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                date.setDate(date.getDate() + daysOffset);
                
                const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                const occurrenceCount = occupiedDates.filter(d => d === dateKey).length;
                
                if (strategicDays.includes(date.getDay()) && occurrenceCount < 2) {
                    found = true;
                    dayPosition = occurrenceCount; // 0 para o primeiro, 1 para o segundo
                    occupiedDates.push(dateKey);
                } else {
                    daysOffset++;
                }
            }

            // Aplicando inteligência de horário de publicação estratégica premium (alternando horários de alto tráfego)
            let targetHour = 12;
            let targetMinute = 0;
            if (service.platform === 'REELS' || service.platform === 'INSTAGRAM') {
                if (dayPosition === 0) {
                    targetHour = 12; // Almoço
                    targetMinute = 0;
                } else {
                    targetHour = 18; // Pico da tarde/noite
                    targetMinute = 30;
                }
            } else {
                if (dayPosition === 0) {
                    targetHour = 9; // Horário comercial manhã
                    targetMinute = 0;
                } else {
                    targetHour = 15; // Tarde
                    targetMinute = 0;
                }
            }
            date.setHours(targetHour, targetMinute, 0, 0);

            const scheduledAt = date;
            
            // Prazo de Aprovação Inteligente e Seguro: 48h antes do post, ou ponto médio se colidir no passado
            let deadlineTime = scheduledAt.getTime() - (48 * 60 * 60 * 1000);
            if (deadlineTime < now.getTime()) {
                deadlineTime = now.getTime() + (scheduledAt.getTime() - now.getTime()) / 2;
            }
            const strategicDeadline = new Date(deadlineTime);

            const auditSummary = AIPlanner.auditInfrastructure(project);
            
            let captionText = "";
            let generatedByAI = false;

            // ── KNOWLEDGE CORE™ INTEGRATION ──────────────────────────────
            // Usa o Context Engine para montar o contexto correto do cliente
            // antes de chamar a IA, com regras éticas do nicho, contrato e extras.

            const kcContext = await KnowledgeCore.buildContext({
                projectId,
                module: 'content-engine',
                action: 'GENERATE_CONTENT_PLAN',
                userRole: 'ADMIN'
            });

            if (openAiKey && kcContext) {
                try {
                    console.log(`[KNOWLEDGE CORE] Gerando pauta com contexto real para ${service.name}...`);

                    const kcResult = await KnowledgeCore.ask(
                        kcContext,
                        'GENERATE_CONTENT_PLAN',
                        {
                            month: new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' }),
                            platform: service.platform,
                            objective: objectives,
                            qty: 1,
                            funnel: sKey === 'REELS' || sKey === 'CARROSSEL' ? 'Topo + Meio' : 'Meio + Fundo'
                        }
                    );

                    if (kcResult && !kcResult.error && kcResult.content) {
                        // Tentar parsear JSON retornado pelo template
                        try {
                            const parsed = JSON.parse(kcResult.content);
                            const firstPauta = parsed.pautas?.[0];
                            if (firstPauta) {
                                captionText = [
                                    `🎯 OBJETIVO: ${firstPauta.objetivo || objectives}`,
                                    `💻 FORMATO: ${firstPauta.formato || service.name}`,
                                    `🔥 GANCHO: ${firstPauta.gancho || ''}`,
                                    ``,
                                    firstPauta.copy_resumida || '',
                                    ``,
                                    `🚀 CTA: ${firstPauta.cta || ''}`,
                                    firstPauta.observacoes ? `\n⚠️ ${firstPauta.observacoes}` : ''
                                ].filter(Boolean).join('\n');
                            } else {
                                captionText = kcResult.content;
                            }
                        } catch (_) {
                            // Resposta não é JSON — usar como texto puro
                            captionText = kcResult.content;
                        }
                        generatedByAI = true;
                    } else if (kcResult.error) {
                        console.warn('[KNOWLEDGE CORE] Erro na chamada IA:', kcResult.error);
                    }
                } catch (err) {
                    console.error('[KNOWLEDGE CORE] Erro inesperado:', err);
                }
            }

            if (!generatedByAI) {
                const baseText = service.template
                    .replace(/\[OBJ\]/g, objectives)
                    .replace(/\[IA\]/g, `[Pendente de Estruturação com IA - Tom: ${tone}]`);
                
                captionText = `${baseText}

=========================================
[CONTEXTO ESTRATÉGICO DA MARCA]
ICP: ${icp}
⚠️ FOCO ESTRATÉGICO: Mitigar dores de ${painPoints}.
🧬 DNA DA MARCA: Transmitir (${dnaDesired}), Evitar estritamente (${dnaAnti}).

${auditSummary}`;
            }

            const priorityValue = (sKey === 'TRAFEGO' || sKey === 'LP' || sKey === 'SITE' || sKey === 'BRANDING' || sKey === 'REELS' || sKey === 'CARROSSEL') ? 'ALTA' : 'MÉDIA';

            contents.push({
                project_id: projectId,
                title: `${service.name} • Estratégico`,
                status: 'PLANEJAMENTO',
                priority: priorityValue,
                platform: service.platform,
                scheduled_at: scheduledAt.toISOString(),
                caption: captionText,
                metadata: {
                    responsible: service.platform === 'INSTAGRAM' ? 'Design' : 'Social Media',
                    version: 'V1',
                    approval_deadline: strategicDeadline.toISOString(),
                    risk: false
                },
                internal_notes: ""
            });
        }

        return contents;
    }
};
