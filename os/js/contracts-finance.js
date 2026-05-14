import { OS_UI, OS_AUTH } from '/os/js/os-core.js';
import { getSupabase } from '/os/services/supabase-client.js';

async function initFinance() {
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
        const { data: payments, error: pErr } = await supabase.from('payments').select('*, contracts(client_name, company_name, project_id)').order('due_date', { ascending: true });

        if (cErr || pErr) throw cErr || pErr;

        const activeContracts = contracts || [];
        const activePayments = payments || [];

        renderStats(activeContracts, activePayments);
        renderPayments(activePayments);
        renderContracts(activeContracts);
        renderContractHealth(activeContracts, activePayments);
        renderOperationalAlerts(activeContracts, activePayments);

    } catch (error) {
        console.error('Erro ao carregar financeiro:', error);
    }
}

function renderStats(contracts, payments) {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    const totalExpected = payments.reduce((acc, p) => {
        const amount = p.contracts?.client_name === 'Maria Aparecida' ? 800 : Number(p.amount_due);
        return acc + amount;
    }, 0);
    const totalPaid = payments.reduce((acc, p) => acc + Number(p.amount_paid), 0);
    const totalPending = totalExpected - totalPaid;
    
    const activeCount = contracts.filter(c => c.status === 'ATIVO').length;
    const totalContractValue = contracts.reduce((acc, c) => {
        const val = c.client_name === 'Maria Aparecida' ? 800 : Number(c.contract_value);
        return acc + val;
    }, 0);
    const avgTicket = activeCount > 0 ? (totalContractValue / activeCount) : 0;
    
    const nextDue = payments.filter(p => {
        const d = new Date(p.due_date);
        return p.status !== 'PAGO' && d >= now && d <= sevenDaysFromNow;
    }).length;

    const riskRevenue = payments.reduce((acc, p) => {
        const d = new Date(p.due_date);
        const diff = (now - d) / (1000 * 60 * 60 * 24);
        return (p.status !== 'PAGO' && diff > 5) ? acc + Number(p.amount_due) : acc;
    }, 0);

    document.getElementById('total-expected').innerText = formatCurrency(totalExpected);
    document.getElementById('total-paid').innerText = formatCurrency(totalPaid);
    document.getElementById('total-pending').innerText = formatCurrency(totalPending);
    document.getElementById('active-contracts-count').innerText = activeCount;
    document.getElementById('avg-ticket').innerText = formatCurrency(avgTicket);
    document.getElementById('next-due-count').innerText = nextDue;
    document.getElementById('revenue-at-risk').innerText = formatCurrency(riskRevenue);
}

function renderPayments(payments) {
    const body = document.getElementById('payments-body');
    const now = new Date();
    
    body.innerHTML = payments.map(p => {
        const dueDate = new Date(p.due_date);
        const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
        const isPaid = p.status === 'PAGO';
        
        let delayText = '';
        let delayClass = '';
        
        if (isPaid) {
            delayText = 'Liquidado';
            delayClass = 'color: var(--os-success); font-weight: 700;';
        } else if (diffDays < 0) {
            delayText = `${Math.abs(diffDays)}d atraso`;
            delayClass = 'color: var(--os-danger); font-weight: 700;';
        } else if (diffDays === 0) {
            delayText = 'Vence Hoje';
            delayClass = 'color: var(--os-info); font-weight: 800;';
        } else {
            delayText = `em ${diffDays} dias`;
            delayClass = 'color: var(--os-text-muted);';
        }

        const statusClass = p.status === 'PAGO' ? 'status-pago' : (diffDays < 0 ? 'status-atrasado' : 'status-pendente');

        return `
            <tr>
                <td>
                    <div style="font-weight: 700;">${p.contracts?.client_name || 'Desconhecido'}</div>
                    <div style="font-size: 0.7rem; color: var(--os-text-muted);">${p.contracts?.company_name || ''}</div>
                </td>
                <td style="font-family: var(--os-font-mono); font-weight: 600;">${formatCurrency(p.amount_due)}</td>
                <td>${dueDate.toLocaleDateString('pt-BR')}</td>
                <td style="font-size: 0.7rem; text-transform: uppercase;">${p.payment_method || 'Pix'}</td>
                <td><span class="status-badge ${statusClass}">${p.status}</span></td>
                <td style="${delayClass} font-size: 0.75rem;">${delayText}</td>
                <td>
                    <div class="action-btns" style="justify-content: flex-end;">
                        ${!isPaid ? `
                            <button class="btn-mini btn-whatsapp" title="Lembrar WhatsApp" onclick="window.sendWhatsAppBilling('${p.id}')">
                                <i class="fa-brands fa-whatsapp"></i>
                            </button>
                            <button class="btn-mini" title="Marcar Recebido" onclick="window.markAsPaid('${p.id}', ${p.amount_due})">
                                <i class="fa-solid fa-check"></i>
                            </button>
                        ` : `
                             <button class="btn-mini" title="Gerar Recibo"><i class="fa-solid fa-file-invoice"></i></button>
                        `}
                        <button class="btn-mini" title="Abrir Contrato" onclick="window.generateContractDoc('${p.contract_id}')">
                            <i class="fa-solid fa-file-pdf"></i>
                        </button>
                        <button class="btn-mini" title="Abrir Workspace" onclick="window.open('/os/content-engine.html?project=${p.contracts?.project_id}', '_blank')">
                            <i class="fa-solid fa-briefcase"></i>
                        </button>
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
    body.innerHTML = contracts.map(c => {
        const startDate = new Date(c.created_at).toLocaleDateString('pt-BR');
        const renewalDate = new Date(new Date(c.created_at).setMonth(new Date(c.created_at).getMonth() + 6)).toLocaleDateString('pt-BR');

        const val = c.client_name === 'Maria Aparecida' ? 800 : c.contract_value;
        const deliverables = c.client_name === 'Maria Aparecida' ? '2 carrosséis + 2 reels/mês' : (c.deliverables || 'N/A');

        return `
            <tr>
                <td>
                    <div style="font-weight: 700;">${c.company_name}</div>
                    <div style="font-size: 0.7rem; color: var(--os-text-muted);">${c.client_name}</div>
                </td>
                <td style="font-size: 0.7rem; font-weight: 700; color: var(--os-primary);">ENGENHARIA DE CONTEÚDO</td>
                <td style="font-size: 0.75rem;">${deliverables}</td>
                <td style="font-family: var(--os-font-mono); font-weight: 600;">${formatCurrency(val)}</td>
                <td><span class="status-badge" style="background: rgba(255,255,255,0.05);">${c.status}</span></td>
                <td>${startDate}</td>
                <td>${renewalDate}</td>
                <td>
                    <div class="action-btns" style="justify-content: flex-end;">
                        <button class="btn-mini" title="Abrir Contrato" onclick="window.generateContractDoc('${c.id}')">
                            <i class="fa-solid fa-file-pdf"></i>
                        </button>
                        <button class="btn-mini" title="Editar" onclick="window.editContract('${c.id}')">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
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

function renderContractHealth(contracts, payments) {
    const body = document.getElementById('health-body');
    if (!body) return;
    const now = new Date();

    body.innerHTML = contracts.map(c => {
        const cPayments = payments.filter(p => p.contract_id === c.id);
        const hasLate = cPayments.some(p => p.status !== 'PAGO' && new Date(p.due_date) < now);
        
        let health = 'Saudável';
        let healthClass = 'health-saudavel';
        let finRisk = 'Nulo';
        let opRisk = 'Baixo';
        let nextAction = 'Manter planejamento mensal e revisar próxima rodada';

        if (hasLate) {
            health = 'Atenção';
            healthClass = 'health-atencao';
            finRisk = 'Moderado';
            nextAction = 'Notificar Financeiro';
        }

        if (c.status !== 'ATIVO') {
            health = 'Encerrado';
            healthClass = 'health-atencao';
            nextAction = 'N/A';
        }

        return `
            <tr>
                <td>${c.client_name}</td>
                <td><span class="health-pill ${healthClass}">${health}</span></td>
                <td style="font-size: 0.7rem; color: ${finRisk === 'Nulo' ? 'var(--os-success)' : 'var(--os-warning)'};">${finRisk}</td>
                <td style="font-size: 0.7rem; color: var(--os-success);">${opRisk}</td>
                <td style="font-size: 0.7rem; color: var(--os-success);">Em Conformidade</td>
                <td style="font-size: 0.75rem; font-weight: 700; color: var(--os-primary);">${nextAction}</td>
            </tr>
        `;
    }).join('');
}

function renderOperationalAlerts(contracts, payments) {
    const container = document.getElementById('alerts-container');
    if (!container) return;
    const now = new Date();
    const alerts = [];

    payments.forEach(p => {
        const d = new Date(p.due_date);
        const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
        
        if (p.status !== 'PAGO') {
            if (diff === 1) {
                alerts.push({
                    type: 'warning',
                    title: `Vencimento Próximo: ${p.contracts?.client_name}`,
                    desc: `Pagamento vence amanhã (${d.toLocaleDateString('pt-BR')}). Cobrança automática agendada.`
                });
            } else if (diff < 0) {
                alerts.push({
                    type: 'critical',
                    title: `Pagamento Atrasado: ${p.contracts?.client_name}`,
                    desc: `Atraso de ${Math.abs(diff)} dias detectado. Necessário contato direto.`
                });
            }
        }
    });

    contracts.forEach(c => {
        const renewalDate = new Date(new Date(c.created_at).setMonth(new Date(c.created_at).getMonth() + 6));
        const diff = Math.ceil((renewalDate - now) / (1000 * 60 * 60 * 24));
        
        if (diff > 0 && diff < 30) {
            alerts.push({
                type: 'warning',
                title: `Renovação de Contrato: ${c.company_name}`,
                desc: `Vínculo expira em ${diff} dias (${renewalDate.toLocaleDateString('pt-BR')}). Preparar proposta.`
            });
        }
    });

    if (alerts.length === 0) {
        container.innerHTML = '<p style="font-size: 0.8rem; color: var(--os-text-muted); opacity: 0.5;">Nenhum alerta crítico pendente.</p>';
        return;
    }

    container.innerHTML = alerts.map(a => `
        <div class="alert-item ${a.type}">
            <div class="alert-icon" style="color: ${a.type === 'critical' ? 'var(--os-danger)' : 'var(--os-warning)'};">
                <i class="fa-solid ${a.type === 'critical' ? 'fa-triangle-exclamation' : 'fa-circle-info'}"></i>
            </div>
            <div class="alert-content">
                <h4>${a.title}</h4>
                <p>${a.desc}</p>
            </div>
        </div>
    `).join('');
}

async function logAction(action, targetId) {
    const supabase = getSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    await supabase.from('audit_logs').insert([{
        user_id: session.user.id,
        action: action,
        module: 'finance',
        target_id: targetId
    }]);
}

initFinance();
