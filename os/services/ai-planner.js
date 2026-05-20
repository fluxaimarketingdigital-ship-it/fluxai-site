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

            if (openAiKey) {
                try {
                    console.log(`[OPENAI PLANNER] Gerando pauta ao vivo para ${service.name}...`);
                    
                    let customContext = '';
                    if (project.company_name && project.company_name.includes('FluxAI')) {
                        customContext = `
[DNA DE MARCA DA FLUXAI LABS]
Lembre-se: O cliente é a nossa própria empresa "FluxAI Labs". Desenvolvemos e implementamos Infraestrutura Estratégica Digital para negócios, unindo tecnologia, inteligência artificial, branding e engenharia operacional de crescimento.
Nossos pilares principais de serviço que devemos promover ativamente para educar e atrair tomadores de decisão (B2B High-Ticket) são:
1. Arquitetura Digital Premium (Sites institucionais refinados e LPs de conversão ultra-profissionais com Portal do Cliente).
2. Engenharia de Conteúdo no Instagram (Reels de alta autoridade, Carrosséis estratégicos focados em escala e sofisticação visual).
3. Campanhas de Tráfego Pago Avançadas (Meta Ads e Google Ads focados em alta renda, evitando leads desqualificados).
4. Sistemas Operacionais de Crescimento e Automação (Integração de processos, CRM Hubspot/Salesforce e Cockpits analíticos como o FluxAI OS™).
Produza a pauta com base nessa autoridade técnica, educando a audiência de empresários sobre por que o amadorismo digital impede a escala comercial.
`;
                    }

                    const prompt = `Você é um Estrategista Digital High-Ticket de elite trabalhando na agência FluxAI.
Você deve redigir um roteiro e pauta de conteúdo estratégico para o cliente "${project.company_name}".
${customContext}

[DIRETRIZES DO CLIENTE]
- Público-Alvo (ICP): ${icp}
- Tom de Voz: ${tone}
- Dores a resolver: ${painPoints}
- DNA de Marca a Transmitir: ${dnaDesired}
- DNA de Marca a Evitar: ${dnaAnti}

[FORMATO DE POST]
- Canal/Plataforma: ${service.platform}
- Tipo de Entrega: ${service.name}

Escreva uma pauta completa de alta autoridade contendo:
1. Objetivo Estratégico do Post (Alinhado a: ${objectives})
2. Roteiro Direcionado (Cena por Cena ou Slide por Slide)
3. Gancho (Hook) ultra-atraente de abertura
4. Legenda persuasiva e sofisticada para Instagram
5. Chamada de Ação (CTA) clara.

Por favor, seja extremamente técnico, premium, inovador e direto ao ponto. Não use jargões amadores nem clichês como "Você já pensou...".
Adicione também um sumário de auditoria no final:
${auditSummary}`;

                    const response = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${openAiKey}`
                        },
                        body: JSON.stringify({
                            model: 'gpt-4o',
                            messages: [
                                { role: 'system', content: 'Você é um estrategista digital e copywriter sênior com foco em infoprodutos e marcas premium high-ticket.' },
                                { role: 'user', content: prompt }
                            ],
                            temperature: 0.7
                        })
                    });

                    if (response.ok) {
                        const resData = await response.json();
                        captionText = resData.choices[0].message.content;
                        generatedByAI = true;
                    } else {
                        console.warn("[PLANNER OPENAI] Falha na requisição OpenAI. Usando modelo estratégico local.");
                    }
                } catch (err) {
                    console.error("[PLANNER OPENAI] Erro ao conectar com a API da OpenAI:", err);
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
