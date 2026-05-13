import { OS_UI, OS_AUTH } from '/os/js/os-core.js';
import { getSupabase } from '/os/services/supabase-client.js';

async function init() {
    const user = await OS_AUTH.check('ADMIN');
    if (!user) return;

    OS_UI.renderSidebar('contracts-finance', user.role);
    await OS_UI.renderTopbar();

    await loadFinanceData();

    document.getElementById('btn-sync-finance').onclick = loadFinanceData;
}

async function loadFinanceData() {
    const supabase = getSupabase();
    if (!supabase) return;

    try {
        const { data: contracts, error: cErr } = await supabase.from('contracts').select('*').order('created_at', { ascending: false });
        const { data: payments, error: pErr } = await supabase.from('payments').select('*, contracts(client_name, company_name)').order('due_date', { ascending: true });

        if (cErr || pErr) throw cErr || pErr;

        renderStats(contracts, payments);
        renderPayments(payments);
        renderContracts(contracts);

    } catch (error) {
        console.error('Erro ao carregar financeiro:', error);
    }
}

function renderStats(contracts, payments) {
    // Totais Gerais (Pipeline Completo)
    const totalExpected = payments.reduce((acc, p) => acc + Number(p.amount_due), 0);
    const totalPaid = payments.reduce((acc, p) => acc + Number(p.amount_paid), 0);
    const totalPending = totalExpected - totalPaid;

    document.getElementById('total-expected').innerText = formatCurrency(totalExpected);
    document.getElementById('total-paid').innerText = formatCurrency(totalPaid);
    document.getElementById('total-pending').innerText = formatCurrency(totalPending);
    document.getElementById('active-contracts-count').innerText = contracts.filter(c => c.status === 'ATIVO').length;
    
    console.log('[FINANCE] Dashboard atualizado com pipeline total.');
}

function renderPayments(payments) {
    const body = document.getElementById('payments-body');
    body.innerHTML = payments.map(p => {
        const isPaid = p.status === 'PAGO';
        const receiptHtml = p.receipt_url ? `<a href="${p.receipt_url}" target="_blank" title="Ver Comprovante" style="color: var(--os-primary); margin-left: 8px;"><i class="fa-solid fa-paperclip"></i></a>` : '';
        
        return `
            <tr>
                <td>
                    <div style="font-weight: 700;">${p.contracts?.client_name || 'Desconhecido'}</div>
                    <div style="font-size: 0.7rem; color: var(--os-text-muted);">${p.contracts?.company_name || ''} ${receiptHtml}</div>
                </td>
                <td style="font-family: var(--os-font-mono); font-weight: 600;">${formatCurrency(p.amount_due)}</td>
                <td>${new Date(p.due_date).toLocaleDateString('pt-BR')}</td>
                <td><span class="status-badge status-${p.status.toLowerCase()}">${p.status}</span></td>
                <td>
                    <div class="action-btns">
                        ${!isPaid ? `
                            <button class="btn-mini btn-whatsapp" title="Gerar Cobrança WhatsApp" onclick="window.sendWhatsAppBilling('${p.id}')">
                                <i class="fa-brands fa-whatsapp"></i>
                            </button>
                            <button class="btn-mini" title="Anexar Comprovante" onclick="window.attachReceipt('${p.id}')">
                                <i class="fa-solid fa-paperclip"></i>
                            </button>
                            <button class="btn-mini" title="Marcar como Pago" onclick="window.markAsPaid('${p.id}', ${p.amount_due})">
                                <i class="fa-solid fa-check"></i>
                            </button>
                        ` : `
                            <span style="font-size: 0.6rem; color: var(--os-success); font-weight: 700;"><i class="fa-solid fa-circle-check"></i> RECEBIDO</span>
                        `}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

window.attachReceipt = async (paymentId) => {
    const url = prompt('Cole o link do comprovante aqui:');
    if (!url) return;

    const supabase = getSupabase();
    const { error } = await supabase.from('payments').update({ receipt_url: url }).eq('id', paymentId);
    
    if (error) {
        alert('Erro ao anexar: ' + error.message);
    } else {
        alert('Comprovante anexado com sucesso!');
        loadFinanceData();
    }
};

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
                    <button class="btn-mini" title="Visualizar Contrato" onclick="window.generateContractDoc('${c.id}')">
                        <i class="fa-solid fa-file-pdf"></i>
                    </button>
                    <button class="btn-mini" title="Editar Contrato" onclick="window.editContract('${c.id}')">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

window.editContract = async (contractId) => {
    const supabase = getSupabase();
    const { data: c } = await supabase.from('contracts').select('*').eq('id', contractId).single();
    if (!c) return;

    const newValue = prompt('Novo Valor Mensal (R$):', c.contract_value);
    const newDeliverables = prompt('Novas Entregas (Escopo):', c.deliverables);
    const newDueDay = prompt('Novo Dia de Vencimento:', c.due_day);

    if (newValue && newDeliverables && newDueDay) {
        const { error } = await supabase.from('contracts').update({
            contract_value: newValue,
            deliverables: newDeliverables,
            due_day: newDueDay
        }).eq('id', contractId);

        if (error) {
            alert('Erro ao atualizar: ' + error.message);
        } else {
            alert('Contrato atualizado com sucesso!');
            loadFinanceData();
        }
    }
};

window.sendWhatsAppBilling = async (paymentId) => {
    const supabase = getSupabase();
    const { data: p } = await supabase.from('payments').select('*, contracts(client_name, company_name, project_id)').eq('id', paymentId).single();
    if (!p) return;

    // Buscar telefone no projeto
    const { data: project } = await supabase.from('projects').select('links').eq('id', p.contracts.project_id).single();
    const whatsapp = project?.links?.whatsapp || '';

    const msg = `Olá, ${p.contracts.client_name}. Tudo bem?\n\nPassando para lembrar que o pagamento referente ao serviço na FluxAI OS™ vence em ${new Date(p.due_date).toLocaleDateString('pt-BR')}, no valor de ${formatCurrency(p.amount_due)}.\n\nQualquer dúvida, fico à disposição.`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
};

window.markAsPaid = async (paymentId, amount) => {
    const method = prompt('Forma de Pagamento (Pix, Cartão, Boleto, etc):', 'Pix');
    if (!method) return;

    const receipt = prompt('Link do Comprovante (opcional):', '');

    const supabase = getSupabase();
    const { error } = await supabase.from('payments').update({
        status: 'PAGO',
        amount_paid: amount,
        payment_method: method,
        receipt_url: receipt,
        paid_at: new Date().toISOString()
    }).eq('id', paymentId);

    if (error) {
        alert('Erro ao registrar pagamento: ' + error.message);
    } else {
        await logAction(`Pagamento registrado via ${method}`, paymentId);
        loadFinanceData();
    }
};

window.generateContractDoc = (id) => {
    window.open(`/os/contract-view.html?id=${id}`, '_blank');
};

function formatCurrency(val) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

init();
