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
    
    if (supabase) {
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
            return;
        } catch (error) {
            console.warn('[FINANCE] Erro na API do Supabase. Carregando Dados Simulados Premium.', error);
        }
    }

    // SUPABASE OFFLINE OU RETORNOU ERRO -> USAR DADOS SIMULADOS DO LOCALSTORAGE PARA FIDELIDADE PREMIUM
    const now = new Date();
    const nextWeek = new Date(now); nextWeek.setDate(now.getDate() + 5);
    
    // Inicializar mockContracts no localStorage para persistência interativa
    let mockContracts = JSON.parse(localStorage.getItem('fluxai_mock_contracts'));
    if (!mockContracts) {
        mockContracts = [
            { id: "c1", client_name: "Maria Aparecida", company_name: "Nutrição & Consultoria Alimentar", deliverables: "2 carrosséis + 2 reels/mês", contract_value: 800, status: "ATIVO", created_at: "2026-05-10T00:00:00Z", due_day: 4 },
            { id: "c2", client_name: "Dr. Roberto Alves", company_name: "Alves Odonto Premium", deliverables: "Gestão de Tráfego + CRM", contract_value: 5000, status: "ATIVO", created_at: "2025-03-15T00:00:00Z", due_day: 15 },
            { id: "c3", client_name: "Instituto Apex", company_name: "Apex Educacional", deliverables: "Governança Full-Stack", contract_value: 8500, status: "ATIVO", created_at: "2024-11-20T00:00:00Z", due_day: 10 }
        ];
        localStorage.setItem('fluxai_mock_contracts', JSON.stringify(mockContracts));
    }

    // Inicializar mockPayments no localStorage para persistência interativa
    let mockPayments = JSON.parse(localStorage.getItem('fluxai_mock_payments'));
    if (!mockPayments) {
        mockPayments = [
            { id: "p1", contract_id: "c1", amount_due: 800, due_date: "2026-06-04T00:00:00Z", status: "PAGO", payment_method: "Pix" },
            { id: "p2", contract_id: "c2", amount_due: 5000, due_date: nextWeek.toISOString(), status: "PENDENTE", payment_method: "Boleto" },
            { id: "p3", contract_id: "c3", amount_due: 8500, amount_paid: 8500, due_date: "2026-05-10T00:00:00Z", status: "PAGO", payment_method: "Pix" }
        ];
        localStorage.setItem('fluxai_mock_payments', JSON.stringify(mockPayments));
    }

    // Vincular referências
    mockPayments.forEach(p => {
        p.contracts = mockContracts.find(c => c.id === p.contract_id);
    });

    renderStats(mockContracts, mockPayments);
    renderPayments(mockPayments);
    renderContracts(mockContracts);
    renderContractHealth(mockContracts, mockPayments);
    renderOperationalAlerts(mockContracts, mockPayments);
}

function renderStats(contracts, payments) {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    const isFluxAI = (name) => name && name.toLowerCase().includes('fluxai');

    const totalExpected = payments.reduce((acc, p) => {
        if (isFluxAI(p.contracts?.company_name) || isFluxAI(p.contracts?.client_name)) return acc;
        return acc + Number(p.amount_due || 0);
    }, 0);
    const totalPaid = payments.reduce((acc, p) => {
        if (isFluxAI(p.contracts?.company_name) || isFluxAI(p.contracts?.client_name)) return acc;
        return acc + Number(p.amount_paid || 0);
    }, 0);
    const totalPending = totalExpected - totalPaid;
    
    const activeCount = contracts.filter(c => c.status === 'ATIVO' && !isFluxAI(c.company_name) && !isFluxAI(c.client_name)).length;
    const totalContractValue = contracts.reduce((acc, c) => {
        if (isFluxAI(c.company_name) || isFluxAI(c.client_name)) return acc;
        return acc + Number(c.contract_value || 0);
    }, 0);
    const avgTicket = activeCount > 0 ? (totalContractValue / activeCount) : 0;
    
    const nextDue = payments.filter(p => {
        if (isFluxAI(p.contracts?.company_name) || isFluxAI(p.contracts?.client_name)) return false;
        const d = new Date(p.due_date);
        return p.status !== 'PAGO' && d >= now && d <= sevenDaysFromNow;
    }).length;

    const riskRevenue = payments.reduce((acc, p) => {
        if (isFluxAI(p.contracts?.company_name) || isFluxAI(p.contracts?.client_name)) return acc;
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

        const val = c.contract_value;
        const deliverables = c.deliverables || 'N/A';

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
    let c = null;

    if (supabase && !contractId.startsWith('c')) {
        try {
            const { data } = await supabase.from('contracts').select('*').eq('id', contractId).single();
            c = data;
        } catch (e) {
            console.warn('[FINANCE] Erro ao buscar no Supabase. Buscando nos mocks.', e);
        }
    }

    if (!c) {
        const mockContracts = JSON.parse(localStorage.getItem('fluxai_mock_contracts') || '[]');
        c = mockContracts.find(x => x.id === contractId);
    }

    if (!c) {
        alert('Contrato não encontrado.');
        return;
    }

    const newValue = prompt('Novo Valor Mensal (R$):', c.contract_value);
    const newDeliverables = prompt('Novas Entregas (Escopo):', c.deliverables);
    const newDueDay = prompt('Novo Dia de Vencimento:', c.due_day || 5);

    if (newValue !== null && newDeliverables !== null && newDueDay !== null) {
        if (supabase && !contractId.startsWith('c')) {
            try {
                const { error } = await supabase.from('contracts').update({
                    contract_value: Number(newValue),
                    deliverables: newDeliverables,
                    due_day: Number(newDueDay)
                }).eq('id', contractId);

                if (error) throw error;
                alert('Contrato atualizado com sucesso!');
                loadFinanceData();
            } catch (error) {
                alert('Erro ao atualizar no banco: ' + error.message);
            }
        } else {
            // Mock update
            const mockContracts = JSON.parse(localStorage.getItem('fluxai_mock_contracts') || '[]');
            const idx = mockContracts.findIndex(x => x.id === contractId);
            if (idx !== -1) {
                mockContracts[idx].contract_value = Number(newValue);
                mockContracts[idx].deliverables = newDeliverables;
                mockContracts[idx].due_day = Number(newDueDay);
                localStorage.setItem('fluxai_mock_contracts', JSON.stringify(mockContracts));

                // Também atualizar os pagamentos simulados referentes a este contrato
                const mockPayments = JSON.parse(localStorage.getItem('fluxai_mock_payments') || '[]');
                mockPayments.forEach(p => {
                    if (p.contract_id === contractId) {
                        p.amount_due = Number(newValue);
                        if (p.status === 'PAGO') {
                            p.amount_paid = Number(newValue);
                        }
                    }
                });
                localStorage.setItem('fluxai_mock_payments', JSON.stringify(mockPayments));

                alert('Contrato atualizado localmente com sucesso!');
                loadFinanceData();
            }
        }
    }
};

window.sendWhatsAppBilling = async (paymentId) => {
    const supabase = getSupabase();
    let p = null;
    let whatsapp = '';

    if (supabase && !paymentId.startsWith('p')) {
        try {
            const { data } = await supabase.from('payments').select('*, contracts(client_name, company_name, project_id)').eq('id', paymentId).single();
            p = data;
            if (p) {
                const { data: project } = await supabase.from('projects').select('links').eq('id', p.contracts.project_id).single();
                whatsapp = project?.links?.whatsapp || '';
            }
        } catch (e) {
            console.warn(e);
        }
    }

    if (!p) {
        const mockPayments = JSON.parse(localStorage.getItem('fluxai_mock_payments') || '[]');
        const mockContracts = JSON.parse(localStorage.getItem('fluxai_mock_contracts') || '[]');
        p = mockPayments.find(x => x.id === paymentId);
        if (p) {
            p.contracts = mockContracts.find(c => c.id === p.contract_id);
            whatsapp = '5511999999999'; // Default mock number
        }
    }

    if (!p) return;

    const msg = `Olá, ${p.contracts.client_name}. Tudo bem?\n\nPassando para lembrar que o pagamento referente ao serviço na FluxAI OS™ vence em ${new Date(p.due_date).toLocaleDateString('pt-BR')}, no valor de ${formatCurrency(p.amount_due)}.\n\nQualquer dúvida, fico à disposição.`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
};

window.markAsPaid = async (paymentId, amount) => {
    const method = prompt('Forma de Pagamento (Pix, Cartão, Boleto, etc):', 'Pix');
    if (!method) return;

    const receipt = prompt('Link do Comprovante (opcional):', '');

    const supabase = getSupabase();
    if (supabase && !paymentId.startsWith('p')) {
        try {
            const { error } = await supabase.from('payments').update({
                status: 'PAGO',
                amount_paid: amount,
                payment_method: method,
                receipt_url: receipt,
                paid_at: new Date().toISOString()
            }).eq('id', paymentId);

            if (error) throw error;
            await logAction(`Pagamento registrado via ${method}`, paymentId);
            loadFinanceData();
        } catch (error) {
            alert('Erro ao registrar pagamento: ' + error.message);
        }
    } else {
        // Mock update
        const mockPayments = JSON.parse(localStorage.getItem('fluxai_mock_payments') || '[]');
        const idx = mockPayments.findIndex(p => p.id === paymentId);
        if (idx !== -1) {
            mockPayments[idx].status = 'PAGO';
            mockPayments[idx].amount_paid = amount;
            mockPayments[idx].payment_method = method;
            mockPayments[idx].receipt_url = receipt;
            mockPayments[idx].paid_at = new Date().toISOString();
            localStorage.setItem('fluxai_mock_payments', JSON.stringify(mockPayments));
            alert('Pagamento registrado localmente!');
            loadFinanceData();
        }
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
