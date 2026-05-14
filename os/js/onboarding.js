import { OS_UI, OS_AUTH } from '/os/js/os-core.js';
import { getSupabase } from '/os/services/supabase-client.js';

let currentStep = 1;
const totalSteps = 7;

async function initOnboarding() {
    OS_UI.renderSidebar('onboarding', 'ADMIN'); 
    OS_UI.renderTopbar();

    const user = await OS_AUTH.check('ADMIN');
    if (!user) return;

    // Listeners de Navegação
    document.getElementById('btn-next').onclick = () => moveStep(1);
    document.getElementById('btn-prev').onclick = () => moveStep(-1);

    // Listener de Módulos Dinâmicos
    const moduleChecks = document.querySelectorAll('input[name="modules"]');
    moduleChecks.forEach(check => {
        check.onchange = renderDynamicFields;
    });

    const form = document.getElementById('onboardingForm');
    form.onsubmit = handleOnboarding;
}

function moveStep(delta) {
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
    } else {
        document.getElementById('btn-next').style.display = 'flex';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderDynamicFields() {
    const container = document.getElementById('dynamic-module-fields');
    const selected = Array.from(document.querySelectorAll('input[name="modules"]:checked')).map(i => i.value);
    
    container.innerHTML = '';
    
    const templates = {
        'conteudo': `
            <div class="sub-fields" style="display:block">
                <label style="color:var(--os-primary); font-size:0.6rem; font-weight:800;">ENGENHARIA DE CONTEÚDO</label>
                <div class="grid-2" style="margin-top:10px">
                    <input type="number" name="count_posts" class="form-control" placeholder="Posts/mês">
                    <input type="number" name="count_reels" class="form-control" placeholder="Reels/mês">
                </div>
                <textarea name="content_pillars" class="form-control" style="margin-top:10px" placeholder="Pilares de Conteúdo..."></textarea>
            </div>`,
        'site': `
            <div class="sub-fields" style="display:block">
                <label style="color:var(--os-primary); font-size:0.6rem; font-weight:800;">ARQUITETURA DE SITE</label>
                <input type="text" name="site_domain" class="form-control" style="margin-top:10px" placeholder="Domínio atual/desejado">
                <input type="text" name="site_pages" class="form-control" style="margin-top:10px" placeholder="Páginas Necessárias (Home, LP, etc)">
            </div>`,
        'trafego': `
            <div class="sub-fields" style="display:block">
                <label style="color:var(--os-primary); font-size:0.6rem; font-weight:800;">AQUISIÇÃO PAGA</label>
                <div class="grid-2" style="margin-top:10px">
                    <input type="number" name="ads_budget" class="form-control" placeholder="Verba Mensal Mídia">
                    <input type="text" name="ads_objective" class="form-control" placeholder="Objetivo Principal">
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
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ATIVANDO ECOSSISTEMA...';
    btn.disabled = true;

    const formData = new FormData(e.target);
    const raw = Object.fromEntries(formData.entries());
    
    // Organizar dados estruturados
    const data = {
        company_name: raw.company_name,
        segment: raw.segment,
        status: 'ATIVO',
        metadata: {
            responsible: raw.responsible_name,
            onboarding: {
                area: raw.service_area,
                description: raw.business_description,
                maturity: raw.digital_maturity,
                risks: Array.from(formData.getAll('risks')),
                primary_pain: raw.primary_pain,
                icp: raw.icp_details,
                goals: Array.from(formData.getAll('goals')),
                voice_tone: raw.voice_tone,
                modules: Array.from(formData.getAll('modules')),
                ops: {
                    whatsapp: raw.whatsapp_decisor,
                    approval: raw.approval_responsible,
                    instagram: raw.client_instagram,
                    assets: raw.assets_link
                },
                activation: {
                    priority: raw.priority_30d,
                    first_delivery: raw.first_delivery
                },
                // Dados dinâmicos capturados
                module_details: {
                    posts: raw.count_posts,
                    reels: raw.count_reels,
                    pillars: raw.content_pillars,
                    domain: raw.site_domain,
                    pages: raw.site_pages,
                    ads_budget: raw.ads_budget
                }
            }
        }
    };

    try {
        const supabase = getSupabase();
        
        // 1. Criar Projeto
        const { data: project, error: pError } = await supabase.from('projects').insert([data]).select().single();
        if (pError) throw pError;

        // 2. Criar Contrato
        await supabase.from('contracts').insert([{
            project_id: project.id,
            client_name: raw.responsible_name,
            company_name: raw.company_name,
            deliverables: raw.contract_deliverables,
            contract_value: raw.monthly_fee,
            due_day: raw.payment_day,
            status: 'ATIVO'
        }]);

        btn.innerHTML = '<i class="fa-solid fa-check"></i> ECOSSISTEMA ATIVADO!';
        btn.style.background = '#10b981';
        
        // Resumo de Ativação (Simulado)
        alert(`CLIENTE ATIVADO: ${data.company_name}\nNÚCLEO: ${data.metadata.onboarding.modules.join(', ')}\nPRIORIDADE: ${data.metadata.onboarding.activation.priority}`);

        setTimeout(() => {
            window.location.href = '/os/command-center.html';
        }, 2000);

    } catch (error) {
        alert('Erro na ativação: ' + error.message);
        btn.innerHTML = 'TENTAR NOVAMENTE';
        btn.disabled = false;
    }
}

initOnboarding();

