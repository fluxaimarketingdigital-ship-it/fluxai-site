import { OS_UI, OS_AUTH } from './os-core.js';
import { SERVICES_CATALOG } from './config/services-catalog.js';
import { MakeClient } from '../services/makeClient.js';
import { ROTAS_OS_MAKE } from '../services/makeRoutes.js';
import { getSupabase } from '../services/supabase-client.js';

window.ONBOARDING_MODE = 'new';
window.ONBOARDING_CLIENT_ID = null;

let currentStep = 1;
const totalSteps = 7;

async function initOnboarding() {
    // Renderiza topbar imediatamente (não depende de auth)
    try {
        await OS_UI.renderTopbar();
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
            const targetStep = Number.parseInt(item.getAttribute('data-step'), 10);
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

    setupModeToggle();
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
                <label style="color:var(--os-primary); font-size:0.75rem; font-weight:900; letter-spacing:1px;"><i class="fa-solid fa-pen-nib"></i> ENGENHARIA DE CONTEÚDO E ENTREGÁVEIS</label>
                <div class="grid-2" style="margin-top:15px">
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">Qtd. Reels/Mês</label><input type="number" name="escopo_conteudo_reels_qty" class="form-control" placeholder="12" value="12"></div>
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">Qtd. Carrosséis/Mês</label><input type="number" name="escopo_conteudo_carrossel_qty" class="form-control" placeholder="8" value="8"></div>
                </div>
                <div class="grid-2">
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">Qtd. Stories/Mês (Artes)</label><input type="number" name="escopo_conteudo_story_qty" class="form-control" placeholder="20" value="20"></div>
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">Qtd. Posts Estáticos/Mês</label><input type="number" name="escopo_conteudo_post_estatico_qty" class="form-control" placeholder="0" value="0"></div>
                </div>
                <div class="grid-2">
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">Qtd. Artigos/Mês</label><input type="number" name="escopo_conteudo_artigo_qty" class="form-control" placeholder="0" value="0"></div>
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">Qtd. E-mails (Campanhas)/Mês</label><input type="number" name="escopo_conteudo_email_qty" class="form-control" placeholder="0" value="0"></div>
                </div>
                <div class="grid-2">
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">Qtd. Landing Pages/Mês</label><input type="number" name="escopo_conteudo_landing_page_qty" class="form-control" placeholder="0" value="0"></div>
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">Qtd. Anúncios (Criativos)/Mês</label><input type="number" name="escopo_conteudo_anuncio_qty" class="form-control" placeholder="0" value="0"></div>
                </div>
                <div class="grid-2">
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">Qtd. Relatórios/Mês</label><input type="number" name="escopo_conteudo_relatorio_qty" class="form-control" placeholder="0" value="0"></div>
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">Qtd. Planejamento/Mês</label><input type="number" name="escopo_conteudo_planejamento_qty" class="form-control" placeholder="0" value="0"></div>
                </div>
                <div class="grid-2">
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">Qtd. LinkedIn/Mês</label><input type="number" name="escopo_conteudo_linkedin_qty" class="form-control" placeholder="0" value="0"></div>
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">Qtd. Copy/Mês</label><input type="number" name="escopo_conteudo_copy_qty" class="form-control" placeholder="0" value="0"></div>
                </div>
                <div class="grid-2">
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">Frequência Semanal</label><input type="text" name="escopo_conteudo_weekly_freq" class="form-control" placeholder="Ex: 5x na semana" value="5x na semana"></div>
                    <div class="form-group"></div>
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
                    <div class="form-group"><label style="font-size:0.55rem; color:var(--os-text-muted);">WhatsApp Comercial Base</label><input type="text" name="escopo_crm_whatsapp" class="form-control" placeholder="+55 (DDD) 90000-0000" value="+55 " oninput="maskPhone(event)"></div>
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

function setupModeToggle() {
    const btnNew = document.getElementById('btn-mode-new');
    const btnEdit = document.getElementById('btn-mode-edit');
    const searchContainer = document.getElementById('search-client-container');
    const loadBtn = document.getElementById('btn-load-client');
    const select = document.getElementById('client-search-select');

    btnNew.addEventListener('click', () => {
        window.ONBOARDING_MODE = 'new';
        window.ONBOARDING_CLIENT_ID = null;
        btnNew.style.background = 'var(--os-primary)';
        btnNew.style.color = '#000';
        btnEdit.style.background = 'rgba(255,255,255,0.05)';
        btnEdit.style.color = '#fff';
        searchContainer.style.display = 'none';
        document.getElementById('onboardingForm').reset();
    });

    btnEdit.addEventListener('click', async () => {
        window.ONBOARDING_MODE = 'edit';
        btnEdit.style.background = 'var(--os-primary)';
        btnEdit.style.color = '#000';
        btnNew.style.background = 'rgba(255,255,255,0.05)';
        btnNew.style.color = '#fff';
        searchContainer.style.display = 'block';

        const supabase = getSupabase();
        if (!supabase) return;
        
        try {
            const { data, error } = await supabase.from('CLIENTES_ESTRATEGIA').select('client_id, cliente_nome');
            if (data) {
                select.innerHTML = '<option value="">Selecione o cliente...</option>';
                data.forEach(c => {
                    select.innerHTML += `<option value="${c.client_id}">${c.cliente_nome}</option>`;
                });
            }
        } catch (e) {
            console.error(e);
        }
    });

    loadBtn.addEventListener('click', async () => {
        const clientId = select.value;
        if (!clientId) {
            alert('Selecione um cliente primeiro.');
            return;
        }

        window.ONBOARDING_CLIENT_ID = clientId;
        const supabase = getSupabase();
        
        try {
            loadBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            loadBtn.disabled = true;

            // Fetch basic strategy data and the massive JSON payload
            const { data: estData } = await supabase.from('CLIENTES_ESTRATEGIA').select('cliente_nome, segmento, objetivo_principal, responsavel_fluxai, setup_completo').eq('client_id', clientId).single();
            if (estData) {
                const form = document.getElementById('onboardingForm');
                
                // 1. Set the basic fields directly from the columns
                const setVal = (name, val) => { const el = form.querySelector(`[name="${name}"]`); if(el) el.value = val || ''; };
                setVal('company_name', estData.cliente_nome);
                setVal('segment', estData.segmento);
                setVal('objective', estData.objetivo_principal);
                setVal('responsible_name', estData.responsavel_fluxai);

                // 2. Magic JSON Auto-fill: If the Make webhook saved the massive payload to setup_completo
                let setup = estData.setup_completo;
                if (typeof setup === 'string') {
                    try { setup = JSON.parse(setup); } catch(e) {}
                }
                if (setup && Object.keys(setup).length > 0) {
                    Object.keys(setup).forEach(key => {
                        const val = setup[key];
                        const inputs = form.querySelectorAll(`[name="${key}"]`);
                        if (!inputs.length) return;
                        
                        if (Array.isArray(val)) {
                            // Handing checkbox arrays (like modules, infra_active_platforms)
                            inputs.forEach(input => {
                                if ((input.type === 'checkbox' || input.type === 'radio') && val.includes(input.value)) {
                                    input.checked = true;
                                }
                            });
                        } else {
                            const input = inputs[0];
                            if (input.type === 'checkbox' || input.type === 'radio') {
                                // Se o valor for uma string separada por vírgula (ex: "conteudo, trafego"), transforma em array para comparar
                                const valArray = typeof val === 'string' ? val.split(',').map(s => s.trim()) : [val];
                                inputs.forEach(i => {
                                    if (valArray.includes(i.value)) {
                                        i.checked = true;
                                    }
                                });
                            } else {
                                // Standard input/textarea/select
                                input.value = val;
                            }
                        }
                    });
                    
                    // Se o form tem renderização dinâmica (módulos), chama a função para exibir
                    if (typeof renderDynamicFields === 'function') {
                        renderDynamicFields();
                        // Refill dynamic fields after rendering
                        Object.keys(setup).forEach(key => {
                            if (key.startsWith('escopo_')) {
                                const el = form.querySelector(`[name="${key}"]`);
                                if (el) el.value = setup[key];
                            }
                        });
                    }
                }
            }
            
            alert('Dados pré-carregados com sucesso. Você pode navegar pelas etapas e atualizar o que for necessário.');
        } catch(e) {
            console.error(e);
        } finally {
            loadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Carregar';
            loadBtn.disabled = false;
        }
    });
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

    let projectId = window.ONBOARDING_CLIENT_ID;

    if (window.ONBOARDING_MODE === 'new' || !projectId) {
        // Geração rigorosa de client_id com verificação anti-duplicidade
        const safeName = (raw.company_name || 'CLIENTE_NOVO').toUpperCase().replace(/[^A-Z0-9]/g, '_').replace(/_+/g, '_').replace(/_$/, '');
        
        if (safeName === 'FLUXAI_LABS' || safeName === 'FLUXAI') {
            projectId = 'FLUXAI_LABS_001'; // ID legado protegido do workspace interno
        } else {
            // Anti-Duplicidade: Verifica no Supabase
            const supabase = getSupabase();
            let baseId = safeName;
            let counter = 1;
            let finalId = `${baseId}_${String(counter).padStart(3, '0')}`;
            
            if (supabase) {
                while (true) {
                    try {
                        const { data } = await supabase.from('projects').select('id').eq('id', finalId).limit(1);
                        if (data && data.length > 0) {
                            counter++;
                            finalId = `${baseId}_${String(counter).padStart(3, '0')}`;
                        } else {
                            break;
                        }
                    } catch (e) {
                        break;
                    }
                }
            }
            projectId = finalId;
        }
    }

    const isOwner = projectId === 'FLUXAI_LABS_001'; // workspace interno da FluxAI
    
    let realUuid = crypto.randomUUID();
    const supabase = getSupabase();
    
    if (supabase) {
        if (window.ONBOARDING_MODE === 'new') {
            // Anti-Duplicidade Técnica (Idempotência no backend)
            let isTechnicalDupe = false;
            try {
                if (btn) btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> VERIFICANDO BANCO...';
                const { data: existing, error: errExist } = await supabase.from('projects').select('id').eq('metadata->>legacy_client_id', projectId).limit(1);
                
                if (errExist) {
                    throw errExist; // Error de RLS ou rede
                }
                
                if (existing && existing.length > 0) {
                    realUuid = existing[0].id;
                    isTechnicalDupe = true;
                    console.log('[ONBOARDING] Projeto técnico já existente; UUID reutilizado.', realUuid);
                } 
            } catch (err) {
                console.error('[ONBOARDING] Erro ao verificar duplicidade técnica:', err);
                alert("Falha crítica: Não foi possível verificar o banco (Supabase).\nDetalhe: " + err.message);
                if (btn) {
                    btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> ERRO DE REDE/BANCO';
                    btn.style.background = '#ef4444';
                    btn.disabled = false;
                }
                return; // Aborta envio ao Make
            }

            if (!isTechnicalDupe) {
                try {
                    if (btn) btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> GRAVANDO NO BANCO...';
                    const { error: dbError } = await supabase.from('projects').insert([{
                        id: realUuid,
                        company_name: raw.company_name,
                        segment: raw.segment,
                        status: 'em_onboarding', // <-- inicial estado parcial para todos
                        workspace_type: isOwner ? 'admin' : 'client',
                        metadata: { legacy_client_id: projectId },
                        is_billing_exempt: isOwner
                    }]);
                    if (dbError) throw dbError;
                } catch (err) {
                    console.error('[ONBOARDING] Erro ao inserir na tabela projects:', err);
                    alert("Falha crítica: Não foi possível registrar o cliente na nova tabela projects (Supabase).\nDetalhe: " + err.message);
                    if (btn) {
                        btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> ERRO NO BANCO';
                        btn.style.background = '#ef4444';
                        btn.disabled = false;
                    }
                    return; // Aborta envio ao Make
                }
            }
        } else {
            // Se for edit, tenta buscar o UUID existente para enviar ao webhook
            try {
                const { data: projData } = await supabase.from('projects').select('id').eq('metadata->>legacy_client_id', projectId).limit(1);
                if (projData && projData.length > 0) {
                    realUuid = projData[0].id;
                }
            } catch (e) {
                console.warn('[ONBOARDING] Falha ao recuperar UUID do projeto em modo edit:', e);
            }
        }
    }

    // Captura usuário autenticado para responsavel_fluxai
    const currentSessionUser = await OS_AUTH.check('ADMIN').catch(() => null);
    const responsavelFluxai = currentSessionUser?.user_metadata?.full_name
        || currentSessionUser?.email
        || "FluxAI OS";

    const webhookPayload = {
        // Payload bruto para salvar inteiro no JSON (Magia do Cockpit)
        raw_payload_json: JSON.stringify(raw),
        // Controle de Modo (Novo ou Update)
        action: window.ONBOARDING_MODE === 'edit' ? 'update_client' : 'create_client',
        // Identidade
        project_id:                 realUuid,
        client_id:                  projectId,
        cliente_id:                 projectId, // fallback para legados Make
        client_name:                raw.company_name || "",
        cliente_nome:               raw.company_name || "", // fallback para legados Make
        tipo_cliente:               isOwner ? "owner" : "cliente_pago",
        origem:                     "onboarding_os",
        status_cliente:             isOwner ? "ativo" : "em_onboarding",
        responsavel:                raw.responsible_name || "",
        segmento:                   raw.segment || "",
        objetivo_90_dias:           raw.objective || "",          // Col O
        proposta_valor:             raw.value_proposition || "",
        diferenciais:               raw.differentiators || "",
        tom_de_voz:                 raw.voice_tone || "",
        posicionamento_editorial:   raw.editorial_positioning || "",
        posicionamento_atual:       raw.positioning_current || "",
        posicionamento_desejado:    raw.positioning_desired || "",
        publico_alvo:               raw.target_audience || "",
        persona_principal:          raw.main_persona || "",

        // DNA Narrativo — Colunas K, L, M, N, P, Q, V
        dor_principal:              raw.pain_points || "",         // Col K
        desejo_principal:           raw.icp_main_desire || "",    // Col L
        inimigo_comum:              raw.common_enemy || "",        // Col M
        nivel_percepcao_premium:    raw.awareness_level || "",     // Col N
        objetivo_mes_atual:         raw.current_month_goal || "", // Col P
        prioridade_estrategica:     raw.strategic_priority || "alta",
        palavras_usar:              raw.desired_language || "",    // Col T
        palavras_evitar:            raw.forbidden_language || "",  // Col S
        restricoes_comunicacao:     raw.objections || "",          // Col U
        observacoes_estrategicas:   raw.strategic_notes || "",     // Col V
        responsavel_fluxai:         responsavelFluxai,              // Col X (auto)

        // Outros conteúdo
        cta_padrao:                 raw.ideal_cta || "",
        referencias_visuais:        raw.references || "",
        pilares_editoriais:         raw.editorial_pillars || "",
        dna_status:                 "pendente_revisao",

        // Escopo de conteúdo
        reels_mes:                  raw.escopo_conteudo_reels_qty || "",
        carrosseis_mes:             raw.escopo_conteudo_carrossel_qty || "",
        stories_mes:                raw.escopo_conteudo_stories_qty || "",
        linkedin_mes:               raw.escopo_conteudo_linkedin_qty || "",
        frequencia_semanal:         raw.escopo_conteudo_weekly_freq || "",

        // Digital
        instagram:                  raw.client_instagram_handle || "",
        website:                    raw.client_website || "",
        dominio_dns:                raw.domain_dns || "",
        whatsapp_comercial:         raw.whatsapp_comercial || "",
        canais_digitais:            Array.from(formData.getAll('infra_active_platforms')).join(", ") || "",

        // Serviços
        modulos_contratados:        Array.from(formData.getAll('modules')).join(", ") || "",
        status_servico:             "inativo",
        servico_extra:              raw.finance_extra_services_type || "",
        valor_servico_extra:        raw.finance_extra_services_value || "",
        escopo_extra_desc:          raw.finance_extra_services_desc || "",

        // Assets
        drive_folder_url:           raw.asset_drive_link || "",
        logo_url:                   raw.asset_logos || "",
        manual_id_visual_url:       raw.asset_brand_guidelines || "",
        videos_brutos_url:          raw.asset_videos || "",
        banco_fotos_url:            raw.asset_photos || "",
        docs_extras_url:            raw.asset_documents || "",

        // Operação
        contrato_id:                "CONTRATO_" + projectId,
        status_contrato:            isOwner ? "ativo" : "rascunho",
        tipo_contrato:              raw.tipo_contrato || "",
        plano_cliente:              raw.plano_cliente || "",
        aprovador_final:            raw.approval_responsible || "",
        whatsapp_decisor:           raw.whatsapp_decisor || "",
        responsavel_comercial:      raw.responsible_comercial || "",
        responsavel_marketing:      raw.responsible_marketing || "",
        frequencia_postagem:        raw.post_frequency || "",
        sla_minutos:                raw.sla_minutes || "",
        fee_mensal:                 raw.monthly_fee || "",
        valor_setup:                raw.valor_setup || "",
        escopo_setup:               raw.finance_extra_services_desc || "",
        creditos_ia_base_mes:       raw.creditos_ia_base_mes || "",
        dia_vencimento:             raw.payment_day || "",
        metodo_pagamento:           raw.finance_payment_method || "",
        contrato_assinado:          raw.finance_contract_signed || "",
        data_inicio:                raw.finance_start_date || new Date().toISOString().split('T')[0],
        data_fim:                   raw.data_fim || "",
        ciclo_fidelidade:           raw.finance_min_duration || "",
        link_contrato_drive:        raw.link_contrato_drive || "",
        link_proposta_drive:        raw.link_proposta_drive || "",
        observacao_contrato:        raw.observacao_contrato || "",

        // Ativação
        // Ativação
        status_acesso:              isOwner ? "criado" : "nao_criado",
        ia_bloqueada:               !isOwner,
        risco_operacional:          raw.operational_risk || "",
        pilar_foco_critico:         raw.priority_30d || "",
        primeira_entrega:           raw.first_delivery || "",
        dependencias_acesso:        Array.from(formData.getAll('activation_dependencies')).join(", ") || ""
    };

    // --- ENGENHARIA DO ARRAY DE SERVIÇOS (PARA ITERATOR DO MAKE) ---
    const lista_servicos_para_planilha = [];
    
    // 1. Serviços de Conteúdo Recorrente e Entregáveis
    const entregaveisFields = ['reels', 'carrossel', 'story', 'post_estatico', 'artigo', 'email', 'landing_page', 'anuncio', 'relatorio', 'planejamento', 'copy', 'linkedin'];
    entregaveisFields.forEach(field => {
        const fieldName = `escopo_conteudo_${field}_qty`;
        if (raw[fieldName] && Number(raw[fieldName]) > 0) {
            lista_servicos_para_planilha.push({
                tipo_entrega: field,
                limite_mensal: Number(raw[fieldName]),
                status_limite: 'ativo',
                origem_limite: 'contrato'
            });
        }
    });
    
    // 2. Serviço Extra / Setup (Se houver)
    if (raw.finance_extra_services_type && raw.finance_extra_services_type !== 'Nenhum Serviço Extra') {
        let tipoExtra = 'outro'; // Padrão
        if (raw.finance_extra_services_type.toLowerCase().includes('landing page')) {
            tipoExtra = 'landing_page';
        } else if (raw.finance_extra_services_type.toLowerCase().includes('branding')) {
            tipoExtra = 'outro'; // Mantendo 'outro' para alinhar com o STRATEGIC_MATRIX
        }
        
        lista_servicos_para_planilha.push({
            tipo_entrega: tipoExtra,
            limite_mensal: 1, // Serviço extra de setup normalmente é 1 entrega única
            status_limite: 'ativo',
            origem_limite: 'contrato'
        });
    }

    // Injeta a lista pronta no payload que vai pro Make
    webhookPayload.lista_servicos_para_planilha = lista_servicos_para_planilha;
    // -----------------------------------------------------------------

    console.log('ONBOARDING_PAYLOAD_PREVIEW (FASE 2A)', webhookPayload);

    let makeSuccess = false;
    const alertContainer = document.querySelector('#step-7 .form-section');

    try {
        // Disparo para o Make via Proxy Oficial (ROTA 09)
        const makeRes = await MakeClient.sendPost(ROTAS_OS_MAKE['ROTA_OS_09_ONBOARDING'], webhookPayload);
        
        if (makeRes.success) {
            makeSuccess = true;
            if (typeof OS_LOGS_ENGINE !== 'undefined') {
                OS_LOGS_ENGINE.userAction('ONBOARDING_OFFICIAL_SUCCESS', webhookPayload, false);
            }
            
            // --> ATUALIZAÇÃO SÍNCRONA NO SUPABASE (MUDANÇA DE ESTADO DEVIDO A SUCESSO) <--
            if (supabase && window.ONBOARDING_MODE === 'new') {
                try {
                    await supabase.from('projects').update({
                        status: 'ativo',
                        metadata: { legacy_client_id: projectId, onboarding_status: 'completed', onboarding_completed_at: new Date().toISOString() }
                    }).eq('id', realUuid);
                } catch (e) {
                    console.warn('[ONBOARDING] Aviso: falha ao atualizar status final de projects para ativo', e);
                }
            }

            const overlay = document.getElementById('deploy-overlay');
            const deployBar = document.getElementById('deploy-bar');
            const deployLogs = document.getElementById('deploy-logs');
            
            if (overlay) overlay.style.display = 'flex';

            const logMessages = [
                { progress: 10, text: `> [SISTEMA] Iniciando requisição segura para o Make (Fase 2A)...` },
                { progress: 25, text: `> [SANEAMENTO] Bloqueando criação de usuário e permissões no Supabase.` },
                { progress: 40, text: `> [WORKFLOW] Payload dividido em 7 camadas. ID Gerado: ${projectId}` },
                { progress: 55, text: `> [WORKFLOW] Cliente classificado como 'em_onboarding'.` },
                { progress: 70, text: `> [WORKFLOW] Contrato submetido como 'rascunho'.` },
                { progress: 85, text: `> [WORKFLOW] Inteligência Artificial permanece 'bloqueada'.` },
                { progress: 95, text: `> [PROXY] Resposta 200 OK do Make. Camadas registradas com sucesso!` },
                { progress: 100, text: `> [SISTEMA] Onboarding enviado! Confirme a gravação das 7 planilhas.` }
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
                alert('Onboarding enviado ao Make. Valide o cenário 09.');
                window.location.href = 'command-center.html';
            }, 500);

        } else {
            console.warn('[ONBOARDING] Falha no Make ou cliente duplicado:', makeRes);
            if (typeof OS_LOGS_ENGINE !== 'undefined') {
                OS_LOGS_ENGINE.userAction('ONBOARDING_MAKE_DISPATCH_FAILED', { response: makeRes }, false);
            }
            
            // --> ATUALIZAÇÃO SÍNCRONA NO SUPABASE (MUDANÇA DE ESTADO DEVIDO A FALHA) <--
            if (supabase && window.ONBOARDING_MODE === 'new') {
                try {
                    await supabase.from('projects').update({
                        metadata: { legacy_client_id: projectId, onboarding_status: 'pending_make', last_onboarding_error: makeRes.data?.status || 'Erro interno Make' }
                    }).eq('id', realUuid);
                } catch (e) {
                    console.warn('[ONBOARDING] Aviso: falha ao atualizar status de projects para pending_make', e);
                }
            }

            if (btn) {
                btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> FALHA NO ENVIO AO MAKE';
                btn.style.background = '#ef4444';
                btn.disabled = false;
            }
            
            const overlay = document.getElementById('deploy-overlay');
            if (overlay) overlay.style.display = 'none';
            
            const alertHtml = `
                <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; padding: 20px; border-radius: 8px; margin-top: 20px; color: #fca5a5;">
                    <strong>🚨 ERRO DE VALIDAÇÃO NO MAKE</strong><br/>
                    O Make bloqueou o registro ou não respondeu. Detalhe: ${makeRes.data?.status || 'Erro interno'}.<br/>
                    Verifique o histórico do webhook 09 para mais detalhes.
                </div>
            `;
            alertContainer.insertAdjacentHTML('beforeend', alertHtml);
        }

    } catch (err) {
        console.warn('[ONBOARDING] Exceção crítica:', err);
        if (typeof OS_LOGS_ENGINE !== 'undefined') {
            OS_LOGS_ENGINE.userAction('ONBOARDING_TOTAL_FAILURE', { error: err.message }, false);
        }
        
        // --> ATUALIZAÇÃO SÍNCRONA NO SUPABASE (MUDANÇA DE ESTADO DEVIDO A EXCEÇÃO CRÍTICA) <--
        if (supabase && window.ONBOARDING_MODE === 'new') {
            try {
                await supabase.from('projects').update({
                    metadata: { legacy_client_id: projectId, onboarding_status: 'pending_make', last_onboarding_error: err.message || 'Timeout/Exceção de Rede' }
                }).eq('id', realUuid);
            } catch (e) {
                console.warn('[ONBOARDING] Aviso: falha ao atualizar status de projects para pending_make', e);
            }
        }

        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> ERRO CRÍTICO';
            btn.style.background = '#ef4444';
            btn.disabled = false;
        }
        
        const overlay = document.getElementById('deploy-overlay');
        if (overlay) overlay.style.display = 'none';
        
        const alertHtml = `
            <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; padding: 20px; border-radius: 8px; margin-top: 20px; color: #fca5a5;">
                <strong>🚨 FALHA NA CONEXÃO COM O PROXY</strong><br/>
                Erro de rede ou proxy inacessível. O onboarding não prosseguiu. (${err.message || 'Timeout'})
            </div>
        `;
        alertContainer.insertAdjacentHTML('beforeend', alertHtml);
    }
}



initOnboarding();






// Chave de rascunho de formulário (cache de UI, não-crítico)
const DRAFT_KEY = 'fluxai_onboarding_draft';

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
    
    try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
    } catch (err) {
        console.warn("Storage warning:", err);
    }
    
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
            const inputs = form.querySelectorAll(`[name="${key}"]`);
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
                    const el = form.querySelector(`[name="${key}"]`);
                    if (el) el.value = draftData[key];
                }
            });
        }
        
        if (restoredCount > 0) {
            const alertHtml = `
                <div id="draft-alert" style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin-bottom: 20px; color: #a7f3d0; display:flex; align-items:center; justify-content:space-between; font-size:0.8rem;">
                    <span><i class="fa-solid fa-rotate-left"></i> Rascunho local recuperado. Continue de onde parou.</span>
                    <i class="fa-solid fa-xmark" style="cursor:pointer;" onclick="this.parentElement.remove()"></i>
                </div>
            `;
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
