import { OS_UI, OS_AUTH } from '/os/js/os-core.js';
import { getSupabase } from '/os/services/supabase-client.js';

async function init() {
    console.log('[ONBOARDING] Iniciando módulo...');
    
    // 1. Renderizar Sidebar Imediatamente (Garante a interface visível)
    // Se o usuário não estiver logado, a sidebar será atualizada depois pelo check de auth
    OS_UI.renderSidebar('onboarding', 'ADMIN'); 
    OS_UI.renderTopbar();

    // 2. Validar Acesso em Background
    const user = await OS_AUTH.check('ADMIN');
    if (!user) {
        console.error('[ONBOARDING] Acesso negado ou não autenticado.');
        return;
    }

    // 3. Listener do Formulário
    const form = document.getElementById('onboardingForm');
    if (form) {
        form.addEventListener('submit', handleOnboarding);
        console.log('[ONBOARDING] Listener de formulário ativado.');
    }
}

async function handleOnboarding(e) {
    e.preventDefault();
    console.log('[ONBOARDING] Processando envio...');

    const btn = e.target.querySelector('.btn-save');
    const originalContent = btn.innerHTML;

    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ATIVANDO...';
    btn.disabled = true;

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const scope = Array.from(formData.getAll('scope'));

    const supabase = getSupabase();
    if (!supabase) {
        alert('Erro: Conexão com banco de dados falhou.');
        btn.innerHTML = originalContent;
        btn.disabled = false;
        return;
    }

    try {
        // 1. Criar Projeto
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
            .select().single();

        if (pError) throw pError;

        // 2. Criar Contrato
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
            .select().single();

        if (cError) throw cError;

        // 3. Gerar Financeiro
        const today = new Date();
        const dueDate = new Date(today.getFullYear(), today.getMonth(), data.due_day || 5);
        if (dueDate < today) dueDate.setMonth(dueDate.getMonth() + 1);

        const { error: payError } = await supabase
            .from('payments')
            .insert([{
                contract_id: contract.id,
                amount_due: data.contract_value,
                due_date: dueDate.toISOString(),
                status: 'AGUARDANDO'
            }]);

        if (payError) throw payError;

        // Sucesso Total
        btn.innerHTML = '<i class="fa-solid fa-check"></i> SUCESSO! REDIRECIONANDO...';
        btn.style.background = 'var(--os-success)';
        
        setTimeout(() => {
            window.location.href = '/os/contracts-finance.html';
        }, 1500);

    } catch (error) {
        console.error('[ONBOARDING ERROR]', error);
        alert('Erro ao ativar ecossistema: ' + error.message);
        btn.innerHTML = originalContent;
        btn.disabled = false;
    }
}

// Iniciar
init();
