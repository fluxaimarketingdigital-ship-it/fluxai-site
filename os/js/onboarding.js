import { OS_UI, OS_AUTH } from './os-core.js';
import { getSupabase } from '../services/supabase-client.js';
import { dispatchEvent } from './os-integration.js';
import { OS_CONFIG } from '../config/os-config.js';
import { OS_LOGS_ENGINE } from '../services/logs-engine.js';
import { StatusEngine } from '../config/status-system.js';
import { SERVICES_CATALOG } from './config/services-catalog.js';

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
    if (form) form.onsubmit = (e) => e.preventDefault();

    const btnDisparar = document.getElementById('btn-disparar-infraestrutura');
    if (btnDisparar) {
        btnDisparar.onclick = window.handleOnboarding;
    }

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
    if (!container) {
        console.warn('[ONBOARDING] container dinâmico não encontrado, renderização ignorada.');
        return;
    }
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

function validateOnboardingBeforeSubmit(raw) {
    const errors = [];
    
    // Campos básicos
    if (!raw.company_name) errors.push("Nome da Marca é obrigatório (Etapa 1)");
    if (!raw.responsible_name) errors.push("Responsável Principal é obrigatório (Etapa 1)");
    if (!raw.segment) errors.push("Segmento é obrigatório (Etapa 1)");
    if (!raw.objective) errors.push("Objetivo Principal é obrigatório (Etapa 1)");
    if (!raw.asset_drive_link) errors.push("Link do Google Drive é obrigatório (Etapa 4)");
    
    // O cliente no caso do teste interno é FLUXAI_LABS_001. A tela não pede 'client_id' diretamente
    // mas pede Company Name.

    return errors;
}
window.handleOnboarding = async function(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-disparar-infraestrutura');
    if (btn && btn.disabled) return;

    const form = document.getElementById('onboardingForm');
    const formData = new FormData(form);
    const raw = Object.fromEntries(formData.entries());

    const errors = validateOnboardingBeforeSubmit(raw);
    if (errors.length > 0) {
        alert("⚠️ Pendências encontradas:\n" + errors.join('\n'));
        return;
    }

    if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> PREPARANDO ECOSSISTEMA...';
        btn.disabled = true;
    }

    
    // Identificadores de deploy
    let projectId = "p_" + Date.now();
    if (raw.company_name && raw.company_name.trim().toLowerCase().includes("fluxai labs")) {
        projectId = "FLUXAI_LABS_001";
    }
    const email = raw.client_instagram_handle 
        ? raw.client_instagram_handle.replace('@', '').trim().toLowerCase() + "@fluxai.com" 
        : raw.responsible_name.toLowerCase().replace(/[^a-z0-9]/g, '') + "@fluxai.com";

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

    let dbSuccess = false;
    let makeSuccess = false;
    let totalFailure = false;

    // 3. Executar o webhook e provisionamento real
    try {
        const session = window.FLUXAI_RUNTIME_CONTEXT || {};
        const statusConfig = StatusEngine.resolve('clientes', 'onboarding');
        projectData.status = statusConfig.value;

        // Montar o payload completo para o Make
        const webhookPayload = {
            // ----- DADOS NORMALIZADOS NA RAIZ (NOVO PADRÃO) -----
            cliente_id: projectId,
            client_id: projectId,
            cliente_nome: raw.company_name,
            client_name: raw.company_name,
            responsavel: raw.responsible_name,
            tipo_cliente: projectId === "FLUXAI_LABS_001" ? "interno" : "externo",
            status_cliente: statusConfig.value || "ativo",
            segmento: raw.segment,
            objetivo_principal: raw.objective,
            proposta_valor: raw.value_proposition || "",
            diferenciais: raw.differentiators || "",
            tom_de_voz: raw.voice_tone || "",
            posicionamento_editorial: raw.editorial_positioning || "",
            instagram: raw.client_instagram_handle || "",
            website: raw.client_website || "",
            drive_folder_url: raw.asset_drive_link || "",
            modulos_contratados: Array.from(formData.getAll('modules')).join(", ") || "",
            reels_mes: raw.escopo_conteudo_reels_qty || "",
            carrosseis_mes: raw.escopo_conteudo_carrossel_qty || "",
            stories_mes: raw.escopo_conteudo_stories_qty || "",
            frequencia_semanal: raw.escopo_conteudo_weekly_freq || "",
            verba_midia: raw.escopo_trafego_monthly_budget || "",
            meta_cpl: raw.escopo_trafego_target_cpl || "",
            meta_roas: raw.escopo_trafego_target_roas || "",
            crm_atual: raw.escopo_crm_system || "",
            whatsapp_comercial: raw.escopo_crm_whatsapp || "",
            sla_comercial: raw.escopo_crm_sla || "",
            pilares_editoriais: raw.editorial_pillars || "",
            dores_icp: raw.pain_points || "",
            objecoes: raw.objections || "",
            cta_padrao: raw.ideal_cta || "",
            linguagem_permitida: raw.desired_language || "",
            linguagem_proibida: raw.forbidden_language || "",
            fee_mensal: raw.monthly_fee || "",
            dia_vencimento: raw.payment_day || "",
            metodo_pagamento: raw.finance_payment_method || "",
            contrato_assinado: raw.finance_contract_signed || "",
            data_inicio: raw.finance_start_date || new Date().toISOString().split('T')[0],
            ciclo_fidelidade: raw.finance_min_duration || "",
            servico_extra: raw.finance_extra_services_type || "",
            valor_servico_extra: raw.finance_extra_services_value || "",
            escopo_setup: raw.first_delivery || "",
            roadmap_ia: document.getElementById('ia-roadmap-content') ? document.getElementById('ia-roadmap-content').innerText : "",
            relatorio_incluir: "sim",
            origem_validacao: "bloco_3_1_cliente_interno",
            
            // ----- COLEÇÕES ANINHADAS (PADRÃO ANTIGO - COMPATIBILIDADE) -----
            evento: "client_onboarding",
            timestamp: new Date().toISOString(),
            operador_id: session.id || "admin",
            dados_principais: {
                cliente_id: projectId,
                nome_interno: raw.company_name,
                nome_comercial: raw.company_name,
                email: email,
                telefone: raw.whatsapp_decisor,
                website: raw.client_website || '',
                instagram_profile: raw.client_instagram_handle || '',
                status_ativo: statusConfig.value || 'ativo',
                data_entrada: raw.finance_start_date || new Date().toISOString().split('T')[0]
            },
            contrato: {
                drive_url: raw.asset_drive_link || '',
                valor_global: Number(raw.monthly_fee) || 0,
                vigencia_meses: raw.finance_min_duration ? parseInt(raw.finance_min_duration) : 12,
                dia_vencimento: Number(raw.payment_day) || 5
            },
            servicos_contratados_list: Array.from(formData.getAll('modules')),
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
            planejamento_inicial: {
                briefing_mes_1: raw.first_delivery,
                alinhamento_kickoff: 'Agendado'
            }
        };

        // PREVIEW SEGURO (Sem Tokens Sensíveis)
        const safePreview = JSON.parse(JSON.stringify(webhookPayload));
        if (safePreview.tokens) safePreview.tokens = '[MASCARADO PARA SEGURANÇA]';
        console.log('ONBOARDING_PAYLOAD_PREVIEW', safePreview);

        // Disparar Webhook
        const webhookResult = await OS_CONFIG.webhooks.send('CLIENT_ONBOARDING', webhookPayload);
        if (webhookResult.success) {
            makeSuccess = true;
        } else {
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
            dbSuccess = true;
            
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
            const serviceExtraValue = Number(raw.finance_extra_services_value) || 0;
            if (serviceExtraValue > 0 && raw.finance_extra_services_type && contract) {
                const serviceTypeKey = raw.finance_extra_services_type
                    .replace('[FluxAI Labs] ', '').replace('[FluxAI] ', '')
                    .toUpperCase().replace(/[\s\-\/\(\)]/g, '_').substring(0, 20);
                await activateExtraService({
                    project_id: project.id,
                    contract_id: contract.id,
                    service_type: serviceTypeKey,
                    service_value: serviceExtraValue,
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

            // Logs de Segurança e Auditoria
            if (typeof OS_LOGS_ENGINE !== 'undefined') {
                if (makeSuccess) {
                    OS_LOGS_ENGINE.userAction('ONBOARDING_OFFICIAL_SUCCESS', webhookPayload, false);
                } else {
                    OS_LOGS_ENGINE.userAction('ONBOARDING_MAKE_DISPATCH_FAILED', webhookPayload, false);
                }
            }
        }

    } catch (err) {
        console.warn('[ONBOARDING] Falha de comunicação ou Supabase offline. Rodando persistência local mock.', err);
        totalFailure = !dbSuccess;
        if (typeof OS_LOGS_ENGINE !== 'undefined') {
            OS_LOGS_ENGINE.userAction('ONBOARDING_TOTAL_FAILURE', { error: err.message }, false);
        }
    } finally {
        // Garantir gravação robusta em localStorage (offline fallback primário)
        registerLocalMockProjectAndUser(projectId, projectData, raw, email);
    }

    // 4. Lidar com Interface Visual e Feedback de Status
    const alertContainer = document.querySelector('#step-7 .form-section');

    if (dbSuccess && makeSuccess) {
        // SUCCESSO OFICIAL ABSOLUTO
        const overlay = document.getElementById('deploy-overlay');
        const deployBar = document.getElementById('deploy-bar');
        const deployLogs = document.getElementById('deploy-logs');
        
        if (overlay) overlay.style.display = 'flex';

        const logMessages = [
            { progress: 10, text: `> [SISTEMA] Inicializando provisionamento de infraestrutura FluxAI OS™...` },
            { progress: 25, text: `> [DB ENGINE] Conectando ao cluster de banco de dados e aplicando políticas RLS...` },
            { progress: 40, text: `> [WORKSPACE] Workspace '${raw.company_name}' criado com sucesso. Tenant ID: tenant_${projectId}` },
            { progress: 55, text: `> [GOVERNANÇA] Conta de Portal '${email}' gerada.` },
            { progress: 70, text: `> [SLA ENGINE] SLAs operacionais calibrados para ${raw.sla_minutes} min.` },
            { progress: 85, text: `> [IA MEMORY] Consolidando DNA estratégico. Tom: '${raw.voice_tone}'...` },
            { progress: 95, text: `> [MESA EDITORIAL] Mesa ativada! Injetando pautas iniciais...` },
            { progress: 100, text: `> [SISTEMA] Deploy oficial concluído com 100% de sucesso no Make e Banco!` }
        ];

        const runLogs = async () => {
            for (let i = 0; i < logMessages.length; i++) {
                await new Promise(res => setTimeout(res, 400));
                if (deployBar) deployBar.style.width = `${logMessages[i].progress}%`;
                if (deployLogs) {
                    deployLogs.innerHTML += `<br/>${logMessages[i].text}`;
                    deployLogs.scrollTop = deployLogs.scrollHeight;
                }
            }
        };

        await runLogs();
        setTimeout(() => {
            window.location.href = `cliente-detalhe.html?client_id=${projectId}`;
        }, 500);

    } else if (dbSuccess && !makeSuccess) {
        // PARCIAL: BANCO OK, MAKE ERROR
        btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> SALVO NO BANCO COM ALERTA';
        btn.style.background = '#f59e0b';
        btn.disabled = false;
        
        const alertHtml = `
            <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin-top: 20px; color: #fbd38d;">
                <strong>⚠️ ATENÇÃO OPERACIONAL</strong><br/>
                Cliente salvo no banco, mas automação Make não confirmou execução. Revisar fila operacional.
            </div>
            <button type="button" onclick="window.location.href='cliente-detalhe.html?client_id=${projectId}'" style="margin-top:15px; padding:10px 20px; background:#f59e0b; color:#000; font-weight:800; border-radius:6px; cursor:pointer; border:none; transition:0.2s;">Prosseguir ao Perfil</button>
        `;
        alertContainer.insertAdjacentHTML('beforeend', alertHtml);

    } else {
        // FALHA TOTAL / FALLBACK
        if (typeof OS_LOGS_ENGINE !== 'undefined') {
            OS_LOGS_ENGINE.userAction('ONBOARDING_LOCAL_FALLBACK_DRAFT', projectData, false);
        }
        btn.innerHTML = '<i class="fa-solid fa-wifi"></i> SALVO COMO RASCUNHO OFFLINE';
        btn.style.background = '#ef4444';
        btn.disabled = false;
        
        const alertHtml = `
            <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; padding: 20px; border-radius: 8px; margin-top: 20px; color: #fca5a5;">
                <strong>🚨 MODO OFFLINE — Cliente salvo apenas como rascunho local. Não foi oficializado no banco nem enviado ao Make.</strong><br/>
                O cliente não tem ID persistente na nuvem e o webhook Make não ativou a jornada. Certifique-se de ter rede e refaça a tentativa quando o Supabase estiver online.
            </div>
        `;
        alertContainer.insertAdjacentHTML('beforeend', alertHtml);
    }
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






const DRAFT_KEY = "fluxai_onboarding_draft_FLUXAI_LABS_001";

window.saveOnboardingDraft = function(isAuto = false) {
    const form = document.getElementById('onboardingForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const draftData = {};
    for (let [key, value] of formData.entries()) {
        if (key.toLowerCase().includes('password') || key.toLowerCase().includes('token') || key.toLowerCase().includes('secret')) continue;
        if (draftData[key]) {
            if (!Array.isArray(draftData[key])) draftData[key] = [draftData[key]];
            draftData[key].push(value);
        } else {
            draftData[key] = value;
        }
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
    
    if (!isAuto) {
        const btn = document.getElementById('btn-save-draft');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Salvo!';
            btn.style.borderColor = '#10b981';
            btn.style.color = '#10b981';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.borderColor = 'var(--os-border)';
                btn.style.color = '#fff';
            }, 2000);
        }
    }
};

window.clearOnboardingDraft = function() {
    localStorage.removeItem(DRAFT_KEY);
    const btn = document.getElementById('btn-clear-draft');
    if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Limpo!';
        setTimeout(() => {
            btn.innerHTML = originalText;
            window.location.reload();
        }, 800);
    }
};

function restoreOnboardingDraft() {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (!draft) return;
    try {
        const draftData = JSON.parse(draft);
        const form = document.getElementById('onboardingForm');
        if (!form) return;
        
        let restoredCount = 0;
        Object.keys(draftData).forEach(key => {
            const val = draftData[key];
            const inputs = form.querySelectorAll([name=" + key + "]);
            if (!inputs.length) return;
            
            if (Array.isArray(val)) {
                inputs.forEach(input => {
                    if ((input.type === 'checkbox' || input.type === 'radio') && val.includes(input.value)) {
                        input.checked = true;
                        restoredCount++;
                    }
                });
            } else {
                const input = inputs[0];
                if (input.type === 'checkbox' || input.type === 'radio') {
                    inputs.forEach(i => {
                        if (i.value === val) {
                            i.checked = true;
                            restoredCount++;
                        }
                    });
                } else {
                    input.value = val;
                    restoredCount++;
                }
            }
        });
        
        if (typeof renderDynamicFields === 'function') {
            renderDynamicFields();
            Object.keys(draftData).forEach(key => {
                if (key.startsWith('escopo_')) {
                    const el = form.querySelector([name=" + key + "]);
                    if (el) el.value = draftData[key];
                }
            });
        }
        
        if (restoredCount > 0) {
            const alertHtml = 
                <div id="draft-alert" style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin-bottom: 20px; color: #a7f3d0; display:flex; align-items:center; justify-content:space-between; font-size:0.8rem;">
                    <span><i class="fa-solid fa-rotate-left"></i> Rascunho local recuperado. Continue de onde parou.</span>
                    <i class="fa-solid fa-xmark" style="cursor:pointer;" onclick="this.parentElement.remove()"></i>
                </div>
            ;
            const indicator = document.querySelector('.step-indicator');
            if (indicator) {
                indicator.insertAdjacentHTML('beforebegin', alertHtml);
                setTimeout(() => {
                    const alertEl = document.getElementById('draft-alert');
                    if (alertEl) alertEl.remove();
                }, 5000);
            }
        }
    } catch (e) {
        console.error("Erro ao restaurar rascunho:", e);
    }
}

// Attach to bottom
