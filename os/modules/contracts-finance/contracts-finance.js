import { OS_UI, OS_AUTH } from '../../js/os-core.js';
import { getSupabase } from '../../services/supabase-client.js';

async function initFinanceModule() {
    // 1. Validar Acesso (Apenas ADMIN)
    const user = await OS_AUTH.check('ADMIN');
    if (!user) return;

    // 2. Renderizar Base
    OS_UI.renderSidebar('contracts-finance', user.role);
    await OS_UI.renderTopbar();

    // 3. Carregar Dados
    await loadFinanceData();

    // 4. Listener de Sincronização
    document.getElementById('btn-sync-finance').onclick = loadFinanceData;
}

async function loadFinanceData() {
    const supabase = getSupabase();
    if (!supabase) return;

    try {
        // Buscar Contratos e Pagamentos
        const { data: contracts, error: cErr } = await supabase.from('contracts').select('*, projects(whatsapp)').order('created_at', { ascending: false });
        const { data: payments, error: pErr } = await supabase.from('payments').select('*, contracts(client_name, company_name, projects(whatsapp))').order('due_date', { ascending: true });

        if (cErr || pErr) throw cErr || pErr;

        renderStats(contracts, payments);
        renderPayments(payments);
        renderContracts(contracts);

    } catch (error) {
        console.error('Erro ao carregar financeiro:', error);
        alert('Erro ao carregar dados financeiros.');
    }
}

function renderStats(contracts, payments) {
    const totalExpected = payments.reduce((acc, p) => acc + Number(p.amount_due), 0);
    const totalPaid = payments.reduce((acc, p) => acc + Number(p.amount_paid), 0);
    const totalPending = totalExpected - totalPaid;

    document.getElementById('total-expected').innerText = formatCurrency(totalExpected);
    document.getElementById('total-paid').innerText = formatCurrency(totalPaid);
    document.getElementById('total-pending').innerText = formatCurrency(totalPending);
    document.getElementById('active-contracts-count').innerText = contracts.filter(c => c.status === 'ATIVO').length;
}

function renderPayments(payments) {
    const body = document.getElementById('payments-body');
    body.innerHTML = payments.map(p => `
        <tr>
            <td>
                <div style="font-weight: 700;">${p.contracts.client_name}</div>
                <div style="font-size: 0.7rem; color: var(--os-text-muted);">${p.contracts.company_name}</div>
            </td>
            <td style="font-family: var(--os-font-mono); font-weight: 600;">${formatCurrency(p.amount_due)}</td>
            <td>${new Date(p.due_date).toLocaleDateString('pt-BR')}</td>
            <td><span class="status-badge status-${p.status.toLowerCase()}">${p.status}</span></td>
            <td>
                <div class="action-btns">
                    <button class="btn-mini btn-whatsapp" title="Gerar Cobrança WhatsApp" onclick="window.sendWhatsAppBilling('${p.id}')">
                        <i class="fa-brands fa-whatsapp"></i>
                    </button>
                    <button class="btn-mini" title="Marcar como Pago" onclick="window.markAsPaid('${p.id}', ${p.amount_due})">
                        <i class="fa-solid fa-check"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderContracts(contracts) {
    const body = document.getElementById('contracts-body');
    body.innerHTML = contracts.map(c => `
        <tr>
            <td>
                <div style="font-weight: 700;">${c.company_name}</div>
                <div style="font-size: 0.7rem; color: var(--os-text-muted);">${c.client_name}</div>
            </td>
            <td>
                <div style="font-size: 0.8rem; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${c.deliverables}">
                    ${c.deliverables || 'Nenhum escopo definido'}
                </div>
            </td>
            <td><span class="status-badge" style="background: rgba(255,255,255,0.05); color: #fff;">${c.status}</span></td>
            <td>
                <div class="action-btns">
                    <button class="btn-mini" title="Gerar Contrato" onclick="window.generateContractDoc('${c.id}')">
                        <i class="fa-solid fa-file-pdf"></i>
                    </button>
                    <button class="btn-mini" title="Configurar Vencimento" onclick="alert('Funcionalidade de edição em breve')">
                        <i class="fa-solid fa-calendar-day"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// FUNÇÕES GLOBAIS DE AÇÃO
window.sendWhatsAppBilling = async (paymentId) => {
    const supabase = getSupabase();
    const { data: p } = await supabase.from('payments').select('*, contracts(client_name, company_name, projects(links))').eq('id', paymentId).single();
    
    if (!p) return;

    const whatsapp = p.contracts.projects.links.whatsapp || '';
    const msg = `Olá, ${p.contracts.client_name}. Tudo bem?\n\nPassando para lembrar que o pagamento referente ao serviço na FluxAI OS™ vence em ${new Date(p.due_date).toLocaleDateString('pt-BR')}, no valor de ${formatCurrency(p.amount_due)}.\n\nLink para pagamento:\n${p.payment_link || '[Link não gerado]'}\n\nQualquer dúvida, fico à disposição.`;
    
    const encodedMsg = encodeURIComponent(msg);
    window.open(`https://wa.me/${whatsapp}?text=${encodedMsg}`, '_blank');

    await logAction('Cobrança enviada via WhatsApp', paymentId);
};

window.markAsPaid = async (paymentId, amount) => {
    if (!confirm('Deseja confirmar o recebimento deste pagamento?')) return;

    const supabase = getSupabase();
    const { error } = await supabase.from('payments').update({
        status: 'PAGO',
        amount_paid: amount,
        paid_at: new Date().toISOString()
    }).eq('id', paymentId);

    if (error) {
        alert('Erro ao registrar pagamento: ' + error.message);
    } else {
        await logAction('Pagamento registrado como PAGO', paymentId);
        loadFinanceData();
    }
};

window.generateContractDoc = (contractId) => {
    alert('O gerador de contrato operacional está sendo configurado. Utilize o modelo padrão por enquanto.');
};

async function logAction(action, targetId) {
    const supabase = getSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    
    await supabase.from('audit_logs').insert([{
        user_id: session.user.id,
        action: action,
        module: 'finance',
        target_id: targetId
    }]);
}

function formatCurrency(val) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

initFinanceModule();
