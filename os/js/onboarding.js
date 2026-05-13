import { OS_UI, OS_AUTH } from '/os/js/os-core.js';
import { getSupabase } from '/os/services/supabase-client.js';

async function init() {
    // 1. Validar Acesso (Apenas ADMIN pode fazer onboarding)
    const user = await OS_AUTH.check('ADMIN');
    if (!user) return;

    // 2. Renderizar Base
    OS_UI.renderSidebar('onboarding', user.role);
    await OS_UI.renderTopbar();

    // 3. Listener do Formulário
    const form = document.getElementById('onboardingForm');
    form.addEventListener('submit', handleOnboarding);
}

async function handleOnboarding(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-save');
    const originalContent = btn.innerHTML;

    // Feedback Visual
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ATIVANDO...';
    btn.disabled = true;

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Pegar checkboxes de escopo
    const scope = Array.from(formData.getAll('scope'));

    const supabase = getSupabase();
    if (!supabase) {
        alert('Erro: Supabase não configurado.');
        btn.innerHTML = originalContent;
        btn.disabled = false;
        return;
    }

    try {
        // 1. Criar Projeto (Memória Estratégica)
        const { data: project, error: pError } = await supabase
            .from('projects')
            .insert([{
                company_name: data.company_name,
                segment: data.segment,
                scope: scope,
                icp: data.icp,
                objectives: data.objectives,
                tone: data.tone,
                links: {
                    social: data.link_social,
                    assets: data.link_assets,
                    whatsapp: data.whatsapp
                },
                status: 'ATIVO'
            }])
            .select()
            .single();

        if (pError) throw pError;

        // 2. Criar Contrato (Financeiro)
        const { data: contract, error: cError } = await supabase
            .from('contracts')
            .insert([{
                project_id: project.id,
                client_name: data.client_name,
                company_name: data.company_name,
                deliverables: data.deliverables,
                contract_value: data.contract_value,
                due_day: data.due_day,
                status: 'ATIVO',
                start_date: new Date().toISOString()
            }])
            .select()
            .single();

        if (cError) throw cError;

        // 3. Gerar Primeira Parcela Financeira (Automação)
        const today = new Date();
        const dueDate = new Date(today.getFullYear(), today.getMonth(), data.due_day || 5);
        
        if (dueDate < today) {
            dueDate.setMonth(dueDate.getMonth() + 1);
        }

        const { error: pError } = await supabase
            .from('payments')
            .insert([{
                contract_id: contract.id,
                amount_due: data.contract_value,
                due_date: dueDate.toISOString(),
                status: 'AGUARDANDO'
            }]);

        if (pError) throw pError;

        // Sucesso
        btn.innerHTML = '<i class="fa-solid fa-check"></i> ATIVADO COM SUCESSO!';
        btn.style.background = 'var(--os-success)';
        
        setTimeout(() => {
            window.location.href = 'command-center.html';
        }, 2000);

    } catch (error) {
        console.error('Erro no Onboarding:', error);
        alert('Erro ao salvar dados: ' + error.message);
        btn.innerHTML = originalContent;
        btn.disabled = false;
    }
}

init();
