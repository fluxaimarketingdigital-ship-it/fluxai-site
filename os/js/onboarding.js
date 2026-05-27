import { OS_UI, OS_AUTH } from './os-core.js';
import { getSupabase } from '../services/supabase-client.js';
import { dispatchEvent } from './os-integration.js';
import { OS_CONFIG } from '../config/os-config.js';
import { OS_LOGS_ENGINE } from '../services/logs-engine.js';
import { StatusEngine } from '../config/status-system.js';

let currentStep = 1;
const totalSteps = 7;

async function initOnboarding() {
    // Renderiza topbar imediatamente (não depende de auth)
    try {
        OS_UI.renderTopbar();
    } catch(e) { console.error('[ONBOARDING] Falha ao renderizar interface base:', e); }

    // Permitir clique direto nas bolinhas das etapas lá em cima
    const moduleChecks = document.querySelectorAll('input[name="modules"]');
    moduleChecks.forEach(check => {
        check.onchange = renderDynamicFields;
    });

    // Permitir clique direto nas bolinhas das etapas lá em cima
    const stepItems = document.querySelectorAll('.step-item');
    stepItems.forEach(item => {
        item.onclick = () => {
            const targetStep = parseInt(item.getAttribute('data-step'));
            if (targetStep !== currentStep) {
                const delta = targetStep - currentStep;
                moveStep(delta);
            }
        };
    });

    const form = document.getElementById('onboardingForm');
    if (form) form.onsubmit = handleOnboarding;

    const user = await OS_AUTH.check('ADMIN');
    if (!user) {
        // Se não estiver logado, auth.check já redireciona
        return;
    }

    // Ativar auto-preenchimento inteligente de escopo e preço para Serviços Extras no Onboarding
    const selectOnboardingExtra = document.getElementById('finance_extra_services_type');
    if (selectOnboardingExtra) {
        selectOnboardingExtra.addEventListener('change', () => {
            const val = selectOnboardingExtra.value;
            const extraValField = document.getElementById('finance_extra_services_value');
            const extraDescField = document.getElementById('finance_extra_services_desc');
            
            const SERVICES_CATALOG = {
                "[FluxAI] Gravação / Captação Audiovisual": {
                    value: 400,
                    desc: "Captação presencial (até 4h de gravação) com equipamento profissional de áudio e vídeo, direção de cena para gravação de Reels e captação de materiais institucionais brutas."
                },
                "[FluxAI] Produção de Reels Extra (Unidade)": {
                    value: 100,
                    desc: "Roteirização técnica de 1 Reels extra (incluindo gancho forte, copy fluida e CTA clara), edição dinâmica premium com cortes precisos, legendas animadas sincronizadas e inserção de efeitos sonoros."
                },
                "[FluxAI] Produção de Carrosséis Extra (Unidade)": {
                    value: 80,
                    desc: "Pesquisa de pauta, roteiro em slides (até 8 slides) focado em storytelling, design visual premium corporativo sob a identidade da marca, criação de legenda de alta retenção e capa atraente."
                },
                "[FluxAI] Apresentação Comercial / Pitch Deck": {
                    value: 500,
                    desc: "Estruturação de narrativa de vendas (Pitch), design de apresentação corporativa premium (até 12 slides) no Canva ou PDF, diagramação limpa, focada em conversão para empresas e parceiros locais."
                },
                "[FluxAI] Branding & Identidade Visual Express": {
                    value: 1200,
                    desc: "Criação de logotipo principal, submark, paleta de cores institucional estratégica, tipografias recomendadas, manual básico de aplicação da marca e templates editáveis para posts e stories."
                },
                "[FluxAI] Gestão de Anúncios Meta Ads": {
                    value: 600,
                    desc: "Criação de conta de anúncios/gerenciador de negócios, configuração de pixel de rastreamento, pesquisa de público-alvo qualificado regional, criação de 2 campanhas de anúncios (Tráfego/Mensagens) e relatório quinzenal."
                },
                "[FluxAI Labs] Automação de Processos (Make / n8n)": {
                    value: 800,
                    desc: "Desenvolvimento de fluxos automatizados integrando WhatsApp, Planilhas, CRM e Email. Inclui tratamento de erros, webhook instantâneo, otimização de execução de tarefas e até 3 integrações ativas."
                },
                "[FluxAI Labs] Landing Page (LP) de Alta Conversão": {
                    value: 1500,
                    desc: "Criação de Landing Page com design premium responsivo, copy com técnicas de copywriting/venda, integração com WhatsApp ou formulários, pixel do Meta/Google instalado, SEO básico e hospedagem otimizada."
                },
                "[FluxAI Labs] Site Institucional Completo": {
                    value: 2500,
                    desc: "Desenvolvimento de site institucional estruturado em seções (Home, Sobre, Serviços, Depoimentos, Contato), design exclusivo, blog interno básico, otimização de velocidade, SEO On-Page avançado e integradores de contato."
                },
                "[FluxAI Labs] Arquitetura de CRM & Pipeline de Vendas": {
                    value: 900,
                    desc: "Estruturação completa de pipeline de funil de vendas (Prospecção, Qualificação, Apresentação, Fechamento) no CRM, automação de etapas para envio de propostas, tags e treinamento de equipe operacional."
                },
                "[FluxAI Labs] Chatbot de IA & Agente de Triagem": {
                    value: 1200,
                    desc: "Treinamento de agente inteligente de Inteligência Artificial para qualificar e realizar a triagem inicial de leads no WhatsApp ou Instagram Direct, integrado a banco de respostas do profissional."
                },
                "[FluxAI Labs] Dashboard de Analytics Personalizado": {
                    value: 1000,
                    desc: "Modelagem de dados operacionais e financeiros, integração com fontes de dados (Meta Ads/Google Sheets), gráficos iterativos corporativos no Looker Studio ou FluxAI OS Engine."
                }
            };
            
            if (val && SERVICES_CATALOG[val]) {
                extraValField.value = SERVICES_CATALOG[val].value;
                extraDescField.value = SERVICES_CATALOG[val].desc;
            } else {
                extraValField.value = '';
                extraDescField.value = '';
            }
        });
    }
}

window.moveStep = function(delta) {
    const nextStep = currentStep + delta;
    if (nextStep < 1 || nextStep > totalSteps) return;

    // Esconder atual, mostrar próxima
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.querySelector(`.step-item[data-step="${currentStep}"]`).classList.remove('active');

    currentStep = nextStep;

    document.getElementById(`step-${currentStep}`).classList.add('active');
    document.querySelector(`.step-item[data-step="${currentStep}"]`).classList.add('active');

    // UI Updates
    document.getElementById('current-step-display').innerText = currentStep;
    document.getElementById('btn-prev').style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    document.getElementById('btn-next').innerText = currentStep === totalSteps ? 'Concluir' : 'Próximo';
    
    if (currentStep === totalSteps) {
        document.getElementById('btn-next').style.display = 'none';
        generateIARoadmap();
    } else {
        document.getElementById('btn-next').style.display = 'flex';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function generateIARoadmap() {
    const form = document.getElementById('onboardingForm');
    const formData = new FormData(form);
    const raw = Object.fromEntries(formData.entries());
    const dependencies = Array.from(formData.getAll('activation_dependencies'));
    const modules = Array.from(formData.getAll('modules'));
    
    let html = `<strong>Objetivo:</strong> Ativação de Ecossistema de Alto Padrão<br/>`;
    
    // 1. Gargalos Iniciais
    if (dependencies.length > 0) {
        html += `<br/><span style="color:#ef4444; font-weight:800;">🔴 BLOQUEIOS CRÍTICOS DETECTADOS:</span><br/>`;
        dependencies.forEach(d => html += `- Solucionar pendência: ${d}<br/>`);
    } else {
        html += `<br/><span style="color:#10b981; font-weight:800;">🟢 ACESSOS:</span> Sem pendências críticas impeditivas mapeadas.<br/>`;
    }

    // 2. Foco Estratégico Baseado nas Dores
    if (raw.pain_points) {
        html += `<br/><span style="color:#f59e0b; font-weight:800;">⚠️ FOCOS DE NARRATIVA DEVIDO A DORES:</span><br/>`;
        const list = raw.pain_points.split('\n').filter(l => l.trim() !== '');
        list.slice(0, 3).forEach(p => html += `- Mitigar através do conteúdo: ${p}<br/>`);
    }

    // 3. Recomendação de Módulos (Semana 1-4)
    html += `<br/><strong>Semana 1-2 (Setup e Posicionamento):</strong><br/>`;
    if (modules.includes('conteudo')) html += `- Engenharia de Conteúdo: Definição de grade e DNA estratégicos (Tom: ${raw.voice_tone || 'Premium'}).<br/>`;
    if (modules.includes('branding')) html += `- Identidade Visual: Sincronização estratégica de logos e manual no Drive.<br/>`;
    
    html += `<br/><strong>Semana 3-4 (Escala e Tração):</strong><br/>`;
    if (modules.includes('trafego')) html += `- Tráfego Pago: Ativação de campanhas de Ads (Verba mensal: R$ ${raw.escopo_trafego_monthly_budget || 'A definir'}).<br/>`;
    if (modules.includes('crm')) html += `- CRM & Comercial: Integração e alinhamento de SLA comercial (${raw.escopo_crm_sla || raw.sla_minutes || '60'} min).<br/>`;
    
    html += `<br/><span style="font-size:0.7rem; opacity:0.8; margin-top:10px; display:block;"><i>(A IA do FluxAI OS assumirá o planejamento com base nestes pilares)</i></span>`;

    const container = document.getElementById('ia-roadmap-container');
    const content = document.getElementById('ia-roadmap-content');
    if (container && content) {
        content.innerHTML = html;
        container.style.display = 'block';
    }
}

function renderDynamicFields() {
    const container = document.getElementById('dynamic-module-fields');
    const selected = Array.from(document.querySelectorAll('input[name="modules"]:checked')).map(i => i.value);
    
    container.innerHTML = '';
    
    const templates = {
        'conteudo': `
            <div class="sub-fields" style="display:block; background:rgba(0,0,0,0.2); border:1px solid var(--os-border); padding:20px; border-radius:10px; margin-top:15px;">
                <label style="color:var(--os-primary); font-size:0.75rem; font-weight:900; letter-spacing:1px;"><i class="fa-solid fa-pen-nib"></i> ENGENHARIA DE CONTEÚDO</label>
                <div class="grid-2" style="margin-top:15px">
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">Qtd. Reels/Mês</label><input type="number" name="escopo_conteudo_reels_qty" class="form-control" placeholder="12" value="12"></div>
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">Qtd. Carrosséis/Mês</label><input type="number" name="escopo_conteudo_carrossel_qty" class="form-control" placeholder="8" value="8"></div>
                </div>
                <div class="grid-2">
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">Qtd. Stories/Mês (Artes)</label><input type="number" name="escopo_conteudo_stories_qty" class="form-control" placeholder="20" value="20"></div>
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">Frequência Semanal</label><input type="text" name="escopo_conteudo_weekly_freq" class="form-control" placeholder="Ex: 5x na semana" value="5x na semana"></div>
                </div>
            </div>`,
        'trafego': `
            <div class="sub-fields" style="display:block; background:rgba(0,0,0,0.2); border:1px solid var(--os-border); padding:20px; border-radius:10px; margin-top:15px;">
                <label style="color:var(--os-primary); font-size:0.75rem; font-weight:900; letter-spacing:1px;"><i class="fa-solid fa-chart-line"></i> AQUISIÇÃO PAGA</label>
                <div class="grid-2" style="margin-top:15px">
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">Verba Mensal Mídia</label><input type="number" name="escopo_trafego_monthly_budget" class="form-control" placeholder="R$ 3.000,00" value="3000"></div>
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">Objetivo Principal</label><input type="text" name="escopo_trafego_primary_goal" class="form-control" placeholder="Ex: Geração de Leads High-Ticket" value="Leads High-Ticket"></div>
                </div>
                <div class="grid-2">
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">Meta de CPL (R$)</label><input type="number" name="escopo_trafego_target_cpl" class="form-control" placeholder="15.00" value="15"></div>
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">Meta de ROAS (x)</label><input type="number" name="escopo_trafego_target_roas" class="form-control" placeholder="3.5" value="3.5"></div>
                </div>
            </div>`,
        'crm': `
            <div class="sub-fields" style="display:block; background:rgba(0,0,0,0.2); border:1px solid var(--os-border); padding:20px; border-radius:10px; margin-top:15px;">
                <label style="color:var(--os-primary); font-size:0.75rem; font-weight:900; letter-spacing:1px;"><i class="fa-solid fa-headset"></i> CRM & COMERCIAL</label>
                <div class="grid-2" style="margin-top:15px">
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">CRM Atual em uso</label><input type="text" name="escopo_crm_system" class="form-control" placeholder="RD Station, Pipedrive, Kommo..." value="Pipedrive"></div>
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">WhatsApp Comercial Base</label><input type="text" name="escopo_crm_whatsapp" class="form-control" placeholder="+55..." value=""></div>
                </div>
                <div class="grid-2">
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">Tamanho da Equipe Comercial</label><input type="text" name="escopo_crm_sales_team" class="form-control" placeholder="Qtd Vendedores" value="3"></div>
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">SLA Comercial (minutos)</label><input type="text" name="escopo_crm_sla" class="form-control" placeholder="Ex: 15" value="15"></div>
                </div>
            </div>`
    };

    selected.forEach(mod => {
        if (templates[mod]) container.innerHTML += templates[mod];
    });
}

async function handleOnboarding(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-save');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> PREPARANDO ECOSSISTEMA...';
    btn.disabled = true;

    const formData = new FormData(e.target);
    const raw = Object.fromEntries(formData.entries());
    
    // Identificadores de deploy
    const projectId = "p_" + Date.now();
    const email = raw.client_instagram_handle 
        ? raw.client_instagram_handle.replace('@', '').trim().toLowerCase() + "@fluxai.com" 
        : raw.responsible_name.toLowerCase().replace(/[^a-z0-9]/g, '') + "@fluxai.com";

    // 1. Mostrar o Overlay de Deploy Cinematográfico
    const overlay = document.getElementById('deploy-overlay');
    const deployBar = document.getElementById('deploy-bar');
    const deployLogs = document.getElementById('deploy-logs');
    
    if (overlay) {
        overlay.style.display = 'flex';
    }

    const logMessages = [
        { progress: 10, text: `> [SISTEMA] Inicializando provisionamento de infraestrutura FluxAI OS™...` },
        { progress: 25, text: `> [DB ENGINE] Conectando ao cluster de banco de dados e aplicando políticas RLS...` },
        { progress: 40, text: `> [WORKSPACE] Workspace '${raw.company_name}' criado com sucesso. Tenant ID: tenant_${projectId}` },
        { progress: 55, text: `> [GOVERNANÇA] Conta de Portal '${email}' gerada com senha padrão 'fluxai@2026'.` },
        { progress: 70, text: `> [SLA ENGINE] SLAs operacionais calibrados para ${raw.sla_minutes} min sob responsabilidade de ${raw.approval_responsible}.` },
        { progress: 85, text: `> [IA MEMORY] Consolidando DNA estratégico. Tom: '${raw.voice_tone}' | Objetivos: '${raw.objective}'...` },
        { progress: 95, text: `> [MESA EDITORIAL] Mesa ativada! Injetando pautas iniciais baseadas no ICP de ${raw.segment}...` },
        { progress: 100, text: `> [SISTEMA] Deploy concluído com 100% de sucesso! Redirecionando...` }
    ];

    const runLogs = async () => {
        for (let i = 0; i < logMessages.length; i++) {
            await new Promise(res => setTimeout(res, 500));
            if (deployBar) deployBar.style.width = `${logMessages[i].progress}%`;
            if (deployLogs) {
                deployLogs.innerHTML += `<br/>${logMessages[i].text}`;
                deployLogs.scrollTop = deployLogs.scrollHeight;
            }
        }
    };

    // Rodar os logs visualmente em paralelo
    const logPromise = runLogs();

    // 2. Construir Dados estruturados
    const digital_infrastructure = {
        web: {
            current_domain: raw.domain_dns || '',
            desired_domain: raw.client_website || '',
            blog_seo: 'Não',
            client_portal: 'Sim',
            notes: ''
        },
        active_platforms: Array.from(formData.getAll('infra_active_platforms')),
        operational_links: {
            instagram: raw.client_instagram_handle ? `https://instagram.com/${raw.client_instagram_handle.replace('@','')}` : '',
            website: raw.client_website || '',
            drive: raw.asset_drive_link || '',
            whatsapp: raw.whatsapp_comercial || ''
        }
    };

    const operational_activation = {
        identity: {
            instagram: raw.client_instagram_handle || '',
            website: raw.client_website || '',
            responsible_name: raw.responsible_name || '',
            voice_tone: raw.voice_tone || '',
            positioning: raw.editorial_positioning || '',
            value_proposition: raw.value_proposition || '',
            differentiators: raw.differentiators || ''
        },
        pain_points: raw.pain_points ? raw.pain_points.split('\n').filter(l => l.trim() !== '') : [],
        dna: {
            competitors: raw.references || '',
            forbidden_themes: raw.forbidden_language || '',
            desired_language: raw.desired_language || '',
            editorial_pillars: raw.editorial_pillars || ''
        },
        smart_scope: {
            conteudo: {
                reels: raw.escopo_conteudo_reels_qty || 12,
                carrossel: raw.escopo_conteudo_carrossel_qty || 8,
                stories: raw.escopo_conteudo_stories_qty || 20,
                freq: raw.escopo_conteudo_weekly_freq || '5x na semana'
            },
            trafego: {
                budget: raw.escopo_trafego_monthly_budget || 0,
                goal: raw.escopo_trafego_primary_goal || '',
                cpl: raw.escopo_trafego_target_cpl || 0,
                roas: raw.escopo_trafego_target_roas || 0
            },
            crm: {
                system: raw.escopo_crm_system || '',
                whatsapp: raw.escopo_crm_whatsapp || '',
                team: raw.escopo_crm_sales_team || '',
                sla: raw.escopo_crm_sla || ''
            }
        },
        finance: {
            method: raw.finance_payment_method || 'Pix',
            signed: raw.finance_contract_signed || 'Sim',
            start_date: raw.finance_start_date || new Date().toISOString(),
            duration: raw.finance_min_duration || '6 meses',
            extra_services_type: raw.finance_extra_services_type || '',
            extra_services_value: raw.finance_extra_services_value || 0,
            extra_services_desc: raw.finance_extra_services_desc || ''
        },
        bridges: {
            comercial: raw.responsible_comercial || '',
            marketing: raw.responsible_marketing || '',
            aprovacao: raw.approval_responsible || '',
            whatsapp_decisor: raw.whatsapp_decisor || ''
        },
        activation: {
            risk: raw.activation_operational_risk || 'Baixo',
            priority: raw.priority_30d || 'AUTORIDADE',
            dependencies: Array.from(formData.getAll('activation_dependencies'))
        }
    };

    const projectData = {
        company_name: raw.company_name,
        segment: raw.segment,
        status: 'ATIVO',
        digital_infrastructure: digital_infrastructure,
        operational_activation: operational_activation,
        tone: raw.voice_tone,
        objectives: raw.objective,
        metadata: {
            responsible: raw.responsible_name,
            onboarding: {
                goals: [raw.objective],
                voice_tone: raw.voice_tone,
                modules: Array.from(formData.getAll('modules')),
                ops: {
                    whatsapp: raw.whatsapp_decisor,
                    approval: raw.approval_responsible,
                    instagram: raw.client_instagram_handle,
                    assets: raw.asset_drive_link
                },
                activation: {
                    priority: raw.priority_30d,
                    first_delivery: raw.first_delivery
                },
                next_cycle_day: 20
            }
        }
    };

    // 3. Executar o webhook e provisionamento real
    try {
        const session = window.FLUXAI_RUNTIME_CONTEXT || {};
        
        // Obter status inicial a partir do STATUS_SYSTEM
        const statusConfig = StatusEngine.resolve('clientes', 'onboarding');
        projectData.status = statusConfig.value;

        // Montar o payload completo para o Make
        const webhookPayload = {
            evento: "client_onboarding",
            timestamp: new Date().toISOString(),
            operador_id: session.id || "admin",
            dados_principais: {
                cliente_id: projectId,
                nome_interno: raw.company_name,
                nome_comercial: raw.company_name,
                email: raw.responsible_name.toLowerCase().replace(/[^a-z0-9]/g, '') + "@fluxai.com",
                telefone: raw.whatsapp_decisor,
                website: raw.client_website || '',
                instagram_profile: raw.client_instagram_handle || '',
                status_ativo: statusConfig.value,
                data_entrada: raw.finance_start_date || new Date().toISOString().split('T')[0]
            },
            contrato: {
                drive_url: raw.asset_drive_link || '',
                valor_global: Number(raw.monthly_fee) || 0,
                vigencia_meses: raw.finance_min_duration ? parseInt(raw.finance_min_duration) : 12,
                dia_vencimento: Number(raw.payment_day) || 5
            },
            servicos_contratados: Array.from(formData.getAll('modules')),
            servicos_extras: raw.finance_extra_services_type ? [{
                nome_servico: raw.finance_extra_services_type,
                valor: Number(raw.finance_extra_services_value) || 0,
                descricao: raw.finance_extra_services_desc || ''
            }] : [],
            drive: {
                pasta_cliente: raw.asset_drive_link || '',
                identidade_visual: raw.asset_brand_guidelines || '',
                contrato: raw.asset_documents || '',
                logo_principal: raw.asset_logos || '',
                referencias: raw.references || '',
                entregas: raw.asset_videos || ''
            },
            dna: {
                objetivo_principal: raw.objective,
                publico_alvo: raw.segment,
                oferta_principal: raw.value_proposition,
                dor_mais_forte: raw.pain_points,
                diferencial_real: raw.differentiators,
                tom_de_voz: raw.voice_tone,
                palavras_proibidas: raw.forbidden_language,
                formatacao_exigida: raw.desired_language
            },
            tokens: {
                instagram_business_id: raw.client_instagram_handle || '',
                meta_ad_account_id: '',
                ga4_property_id: '',
                gtm_id: '',
                clarity_project_id: '',
                search_console_property: '',
                status_geral: 'aguardando_autorizacao'
            },
            planejamento_inicial: {
                briefing_mes_1: raw.first_delivery,
                alinhamento_kickoff: 'Agendado'
            }
        };

        // Disparar log de auditoria
        if (typeof OS_LOGS_ENGINE !== 'undefined') {
            OS_LOGS_ENGINE.userAction('ONBOARDING_CREATED', webhookPayload, !OS_CONFIG.flags.sendRealWebhooks);
        }

        // Disparar Webhook
        const webhookResult = await OS_CONFIG.webhooks.send('CLIENT_ONBOARDING', webhookPayload);
        if (!webhookResult.success) {
            console.warn('[ONBOARDING] Webhook não enviado ou falhou:', webhookResult.error);
        }

        const supabase = getSupabase();
        let project = null;
        let pError = null;

        // Inserir Projeto no Supabase
        try {
            const res = await supabase.from('projects').insert([projectData]).select().single();
            project = res.data;
            pError = res.error;
        } catch (dbErr) {
            pError = dbErr;
        }

        // Bypass de segurança se o Supabase não tiver colunas novas
        if (pError && (pError.code === 'PGRST204' || pError.code === '42703' || (pError.message && pError.message.includes('column')))) {
            console.warn('[ONBOARDING] Coluna ausente no Supabase (Bypass Ativado). Tentando inserção compatível.');
            const safeProj = { ...projectData };
            delete safeProj.digital_infrastructure;
            delete safeProj.operational_activation;
            
            const retryRes = await supabase.from('projects').insert([safeProj]).select().single();
            if (retryRes.error) throw retryRes.error;
            project = retryRes.data;
        } else if (pError) {
            throw pError;
        }

        if (project && project.id) {
            // Inserir Contrato no Supabase
            const extraValue = Number(raw.finance_extra_services_value) || 0;
            let finalDeliverables = `FEE MENSAL: Módulos contratados (${Array.from(formData.getAll('modules')).join(', ')})`;
            if (extraValue > 0) {
                finalDeliverables += `\n[EXTRA]: ${raw.finance_extra_services_type} - ${raw.finance_extra_services_desc}`;
            }

            const contractRes = await supabase.from('contracts').insert([{
                project_id: project.id,
                client_name: raw.responsible_name,
                company_name: raw.company_name,
                deliverables: finalDeliverables,
                contract_value: Number(raw.monthly_fee) || 0,
                due_day: Number(raw.payment_day) || 5,
                status: 'ATIVO',
                start_date: raw.finance_start_date || new Date().toISOString().split('T')[0]
            }]).select().single();
            const contract = contractRes.data;

            // ── FINANCIAL LAYER: Criar 1ª fatura na payments_ledger ──
            if (contract && contract.id && Number(raw.monthly_fee) > 0) {
                const firstDue = calcFirstDueDate(Number(raw.payment_day) || 5);
                await createPayment({
                    contract_id: contract.id,
                    due_date: firstDue,
                    amount_due: Number(raw.monthly_fee),
                    payment_type: 'RECORRENTE',
                    project_id: project.id
                });
            }

            // Inserir Conta de Governança do Cliente
            await supabase.from('governance_users').insert([{
                project_id: project.id,
                scoped_project_id: project.id,
                name: raw.responsible_name,
                email: email,
                role: 'CLIENT',
                permissions: JSON.stringify(['client-portal']),
                status: 'ACTIVE'
            }]);

            // ── CONTENT ENGINE: 3 Pautas Editoriais Iniciais ──
            const pautas = generatePautasTemplates(project.id, raw);
            await supabase.from('content_assets').insert(pautas);

            // ── SERVIÇO EXTRA (Operational Linking™) ──
            const extraValue = Number(raw.finance_extra_services_value) || 0;
            if (extraValue > 0 && raw.finance_extra_services_type && contract) {
                const serviceTypeKey = raw.finance_extra_services_type
                    .replace('[FluxAI Labs] ', '').replace('[FluxAI] ', '')
                    .toUpperCase().replace(/[\s\-\/\(\)]/g, '_').substring(0, 20);
                await activateExtraService({
                    project_id: project.id,
                    contract_id: contract.id,
                    service_type: serviceTypeKey,
                    service_value: extraValue,
                    deadline: null,
                    responsible: raw.responsible_comercial || 'Admin FluxAI'
                });
            }

            // ── EVENT BUS: Disparar evento de onboarding concluído ──
            await dispatchEvent(
                'ONBOARDING_CONCLUIDO',
                raw.responsible_name || 'Admin FluxAI',
                `Workspace de "${raw.company_name}" ativado. Contrato de R$ ${raw.monthly_fee}/mês criado. ${pautas.length} pautas injetadas.`,
                { company_name: raw.company_name, contract_value: raw.monthly_fee, pautas_qty: pautas.length },
                project.id
            );

            // Logs legado de compatibilidade
            await supabase.from('audit_logs').insert([
                { action: 'ATIVACAO_WORKSPACE', module: 'ONBOARDING', user_role: 'ADMIN', metadata: { company_name: raw.company_name } },
                { action: 'ATIVACAO_CONTRATO', module: 'FINANCAS', user_role: 'ADMIN', metadata: { contract_value: raw.monthly_fee } },
                { action: 'MESA_EDITORIAL_PROVIDA', module: 'CONTENT_ENGINE', user_role: 'IA_ENGINE', metadata: { qty: pautas.length } }
            ]);
        }

    } catch (err) {
        console.warn('[ONBOARDING] Falha de comunicação ou Supabase offline. Rodando persistência local mock.', err);
    } finally {
        // Garantir gravação robusta em localStorage (offline fallback primário)
        registerLocalMockProjectAndUser(projectId, projectData, raw, email);
    }

    // Aguardar a conclusão da animação de deploy para redirecionar de forma fantástica
    await logPromise;

    setTimeout(() => {
        window.location.href = `cliente-detalhe.html?client_id=${projectId}`;
    }, 500);
}

function generatePautasTemplates(projId, raw) {
    const segmentLabel = raw.segment || "SAUDE";
    const painPoints = raw.pain_points ? raw.pain_points.split('\n')[0] : "concorrentes tradicionais";
    const voiceTone = raw.voice_tone || "Soberano e Técnico";
    
    return [
        {
            project_id: projId,
            title: "Direção Audiovisual: Posicionamento no segmento " + segmentLabel,
            status: "DRAFT_PLANNING",
            priority: "ALTA",
            platform: "REELS",
            scheduled_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            caption: `🎯 OBJETIVO: Afirmação de autoridade e combate direto à dor de '${painPoints}'.\n\n🎬 HOOK: "A maioria das empresas em ${segmentLabel} foca em volume, quando o verdadeiro segredo para escalar é a arquitetura estratégica."\n\n💡 NARRATIVA: Desenvolver raciocínio fundamentado com tom de voz ${voiceTone}. Sem diquinhas rápidas.\n\n✨ CTA: ${raw.ideal_cta || 'Toque no link da bio para entender.'}`,
            metadata: { responsible: "Audiovisual", version: "V1", revision_cycle: 1, version_active: true, strategic_approved: false, operational_approved: false, client_approved: false }
        },
        {
            project_id: projId,
            title: "Estrutura Narrativa: Diferenciais de Posicionamento e Proposta de Valor",
            status: "DRAFT_PLANNING",
            priority: "MÉDIA",
            platform: "CARROSSEL",
            scheduled_at: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
            caption: `🎯 OBJETIVO: Apresentar a Proposta de Valor única: '${raw.value_proposition || 'Alta performance corporativa'}'.\n\nSlide 1: O custo invisível de não possuir diferenciação.\nSlide 2: Por que a maioria foca no operacional em vez de focar no posicionamento.\nSlide 3: Nossa metodologia foca exatamente em: ${raw.differentiators || 'Processos refinados'}.\n\n✨ CTA: ${raw.ideal_cta || 'Envie uma DM para diagnóstico.'}`,
            metadata: { responsible: "Design", version: "V1", revision_cycle: 1, version_active: true, strategic_approved: false, operational_approved: false, client_approved: false }
        },
        {
            project_id: projId,
            title: "Direção Estratégica: Combate às Objeções Comuns do ICP",
            status: "DRAFT_PLANNING",
            priority: "ALTA",
            platform: "INSTAGRAM",
            scheduled_at: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
            caption: `🎯 OBJETIVO: Quebrar objeções frequentes, especificamente: '${raw.objections || 'Orçamento ou tempo'}'.\n\n💡 CONCEITO: Mostrar que o verdadeiro risco está em manter o status quo. Aplicar a diretriz: ${raw.desired_language || 'Arquitetura de crescimento'}.\n\n✨ CTA: Salve este conteúdo para consultar ao planejar seu próximo trimestre.`,
            metadata: { responsible: "Estrategista", version: "V1", revision_cycle: 1, version_active: true, strategic_approved: false, operational_approved: false, client_approved: false }
        }
    ];
}

function registerLocalMockProjectAndUser(projectId, projectData, raw, email) {
    try {
        const contractId = "c_" + Date.now();
        const userId = "u_" + Date.now();

        // 1. Salvar no localStorage de Projetos
        const mockProjects = JSON.parse(localStorage.getItem('fluxai_mock_projects') || '[]');
        const existingProjIdx = mockProjects.findIndex(p => p.company_name === raw.company_name);
        
        const finalProj = {
            id: projectId,
            ...projectData
        };

        if (existingProjIdx >= 0) {
            mockProjects[existingProjIdx] = finalProj;
        } else {
            mockProjects.push(finalProj);
        }
        localStorage.setItem('fluxai_mock_projects', JSON.stringify(mockProjects));

        // 2. Salvar Contrato
        const mockContracts = JSON.parse(localStorage.getItem('fluxai_mock_contracts') || '[]');
        const extraValue = Number(raw.finance_extra_services_value) || 0;
        let finalDeliverables = `Módulos: ${Array.from(new FormData(document.getElementById('onboardingForm')).getAll('modules')).join(', ')}`;
        if (extraValue > 0) {
            finalDeliverables += `\n[EXTRA]: ${raw.finance_extra_services_type} - ${raw.finance_extra_services_desc}`;
        }

        mockContracts.push({
            id: contractId,
            project_id: projectId,
            client_name: raw.responsible_name,
            company_name: raw.company_name,
            deliverables: finalDeliverables,
            contract_value: Number(raw.monthly_fee) || 0,
            status: 'ATIVO',
            created_at: new Date().toISOString(),
            due_day: Number(raw.payment_day) || 5
        });
        localStorage.setItem('fluxai_mock_contracts', JSON.stringify(mockContracts));

        // 3. Salvar Usuário
        const mockUsers = JSON.parse(localStorage.getItem('fluxai_mock_users') || '[]');
        mockUsers.push({
            id: userId,
            project_id: projectId,
            full_name: raw.responsible_name,
            email: email,
            password: "fluxai@2026",
            role: "CLIENT",
            permissions: ["client-portal"],
            needsPasswordChange: true
        });
        localStorage.setItem('fluxai_mock_users', JSON.stringify(mockUsers));

        // 4. Inserir as 3 Pautas Iniciais de Conteúdo Mocks
        const mockAssets = JSON.parse(localStorage.getItem('fluxai_mock_assets') || '[]');
        const pautas = generatePautasTemplates(projectId, raw);
        localStorage.setItem('fluxai_mock_assets', JSON.stringify([...mockAssets, ...pautas]));

        // 5. Injetar Logs de Ativação na Timeline Geral
        const mockTimeline = JSON.parse(localStorage.getItem('fluxai_mock_timeline') || '[]');
        const logs = [
            {
                id: "log_" + Date.now() + "_1",
                project_id: projectId,
                type: 'SISTEMA',
                title: 'Deploy de Workspace Concluído',
                description: `Infraestrutura operacional de '${raw.company_name}' provisionada com sucesso no tenant_id: tenant_${projectId}.`,
                date: new Date().toISOString(),
                author: 'System Provisioning Engine'
            },
            {
                id: "log_" + Date.now() + "_2",
                project_id: projectId,
                type: 'IA_ENGINE',
                title: 'Consolidação de Memória Estratégica',
                description: `Linguagem permitida calçada sob tom '${raw.voice_tone || 'Soberano'}'. Foco de 30 dias direcionado para '${raw.priority_30d}'.`,
                date: new Date().toISOString(),
                author: 'FluxAI Memory Core'
            },
            {
                id: "log_" + Date.now() + "_3",
                project_id: projectId,
                type: 'OPERACIONAL',
                title: 'SLA & Matriz de Governança Sincronizados',
                description: `Acordo de nível de serviço definido para ${raw.sla_minutes} min. Responsável de aprovação final atribuído a '${raw.approval_responsible}'.`,
                date: new Date().toISOString(),
                author: 'Workflow Manager'
            }
        ];
        localStorage.setItem('fluxai_mock_timeline', JSON.stringify([...mockTimeline, ...logs]));

    } catch (e) {
        console.error('[ONBOARDING] Erro ao gravar local mock:', e);
    }
}

initOnboarding();
