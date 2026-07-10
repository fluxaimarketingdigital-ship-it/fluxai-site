import { OS_UI, OS_AUTH } from '/os/js/os-core.js';
import { getSupabase } from '/os/services/supabase-client.js';
import { OS_LOGS_ENGINE } from '/os/services/logs-engine.js';
import { OS_CONFIG } from '/os/config/os-config.js';
import { SERVICES_CATALOG } from '/os/js/config/services-catalog.js';

window.OS_LOGS_ENGINE = OS_LOGS_ENGINE;
window.OS_CONFIG = OS_CONFIG;

function formatCurrency(value) {
    const number = Number(value || 0);
    return number.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

async function initFinance() {
    const user = await OS_AUTH.check('ADMIN');
    if (!user) return;

    OS_UI.renderSidebar('contracts-finance', user.role);
    await OS_UI.renderTopbar();

    await loadFinanceData();
    await loadBankAccounts();

    document.getElementById('btn-sync-finance').onclick = loadFinanceData;
    document.getElementById('btn-manage-banks').onclick = () => {
        loadBankAccounts();
        document.getElementById('bank-accounts-modal').style.display = 'flex';
    };

    // Ativar auto-preenchimento inteligente de escopo e preço para Serviços Extras
    const selectExtra = document.getElementById('edit-extra-type');
    if (selectExtra) {
        selectExtra.addEventListener('change', () => {
            const val = selectExtra.value;
            const extraValField = document.getElementById('edit-extra-value');
            const extraDescField = document.getElementById('edit-extra-desc');
            const customContainer = document.getElementById('edit-extra-custom-container');
            
            if (val === 'Outro Serviço Avulso') {
                customContainer.style.display = 'block';
                extraValField.value = '';
                extraDescField.value = '';
            } else {
                customContainer.style.display = 'none';
                if (val && SERVICES_CATALOG[val]) {
                    extraValField.value = '';
                    extraDescField.value = SERVICES_CATALOG[val].desc;
                } else {
                    extraValField.value = '';
                    extraDescField.value = '';
                }
            }
        });
    }
}

async function loadFinanceData() {
    const supabase = getSupabase();
    
    if (!supabase) {
        console.error('[FINANCE] Supabase não inicializado.');
        document.getElementById('total-expected').innerText = 'ERRO';
        return;
    }

    try {
        const { data: contratosRaw, error: cErr } = await supabase.from('CONTRATOS_CLIENTES').select('client_id, contract_value, status, due_day');
        const { data: financeiroRaw, error: pErr } = await supabase.from('FINANCEIRO_CLIENTES').select('client_id, status_fatura, vencimento_fatura, valor_fatura');
        const { data: extrasRaw } = await supabase.from('SERVICOS_EXTRAS_CLIENTES').select('client_id, service_value, workflow_status');

        if (cErr || pErr) throw cErr || pErr;

        // Mapear CONTRATOS_CLIENTES para DTO da UI
        const activeContracts = (contratosRaw || []).map(c => ({
            id: c.contrato_id || c.client_id, // fallback para client_id se id falhar
            project_id: c.client_id,
            client_name: c.cliente_nome || c.client_id,
            company_name: c.cliente_nome || c.client_id,
            contract_value: c.valor_mensal || 0,
            due_day: parseInt(c.dia_vencimento || '5', 10),
            status: c.status_contrato || 'ATIVO',
            created_at: c.data_inicio || c.data_criacao || new Date().toISOString(),
            deliverables: c.escopo_contratado || 'N/A',
            projects: { is_billing_exempt: false }
        }));

        // Mapear FINANCEIRO_CLIENTES para DTO da UI
        const activePayments = (financeiroRaw || []).map(f => {
            const contract = activeContracts.find(c => c.project_id === f.client_id) || {
                client_name: f.client_name || f.client_id,
                company_name: f.client_name || f.client_id,
                project_id: f.client_id,
                projects: { is_billing_exempt: false }
            };
            const isPaid = (f.status_pagamento || '').toLowerCase() === 'pago';
            return {
                id: f.financeiro_id,
                contract_id: contract.id,
                amount_due: f.valor || 0,
                amount_paid: isPaid ? (f.valor || 0) : 0,
                due_date: f.data_vencimento || f.data_criacao || new Date().toISOString(),
                status: isPaid ? 'PAGO' : ((f.status_pagamento || '').toUpperCase()),
                payment_method: f.forma_pagamento || '-',
                contracts: contract,
                is_extra: false
            };
        });

        // Mapear SERVICOS_EXTRAS_CLIENTES
        const extraPayments = (extrasRaw || []).map(ex => {
            const isPaid = (ex.status_servico_extra || '').toLowerCase() === 'pago';
            return {
                id: ex.servico_extra_id,
                amount_due: ex.valor_aprovado || 0,
                amount_paid: isPaid ? (ex.valor_aprovado || 0) : 0,
                due_date: ex.data_vencimento || ex.data_solicitacao || ex.data_criacao || new Date().toISOString(),
                status: isPaid ? 'PAGO' : 'PENDENTE',
                payment_method: 'Serviço Extra',
                is_extra: true,
                contracts: {
                    client_name: ex.client_name || ex.client_id,
                    company_name: (ex.client_name || ex.client_id) + ' [EXTRA]',
                    project_id: ex.client_id,
                    projects: { is_billing_exempt: false }
                }
            };
        });

        const allPayments = [...activePayments, ...extraPayments];

        window.__FINANCE_CONTRACTS = activeContracts;
        window.__FINANCE_PAYMENTS = allPayments;

        renderStats(activeContracts, allPayments);
        renderPayments(allPayments);
        renderContracts(activeContracts);
        renderContractHealth(activeContracts, allPayments);
        renderOperationalAlerts(activeContracts, allPayments);

    } catch (error) {
        console.error('[FINANCE] Erro crítico na API do Supabase.', error);
        alert('Falha ao carregar dados financeiros. Verifique a conexão com o servidor.');
        document.getElementById('total-expected').innerText = 'ERRO';
        document.getElementById('total-paid').innerText = 'ERRO';
        document.getElementById('total-pending').innerText = 'ERRO';
        
        const bodyContracts = document.getElementById('contracts-body');
        if (bodyContracts) bodyContracts.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--os-danger);">Servidor Indisponível</td></tr>';
        const bodyPayments = document.getElementById('payments-body');
        if (bodyPayments) bodyPayments.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--os-danger);">Servidor Indisponível</td></tr>';
    }
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
     
    body.replaceChildren();
    payments.forEach(p => { 
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
 
        const tr = document.createElement('tr');
        
        const td1 = document.createElement('td');
        const divClient = document.createElement('div');
        divClient.className = 'safe-client';
        divClient.style.fontWeight = '700';
        divClient.textContent = p.contracts?.client_name || 'Desconhecido';
        const divCompany = document.createElement('div');
        divCompany.className = 'safe-company';
        divCompany.style.cssText = 'font-size: 0.7rem; color: var(--os-text-muted);';
        divCompany.textContent = p.contracts?.company_name || '';
        td1.appendChild(divClient);
        td1.appendChild(divCompany);
        tr.appendChild(td1);

        const td2 = document.createElement('td');
        td2.style.cssText = 'font-family: var(--os-font-mono); font-weight: 600;';
        td2.textContent = formatCurrency(p.amount_due);
        tr.appendChild(td2);

        const td3 = document.createElement('td');
        td3.textContent = new Date(p.due_date).toLocaleDateString('pt-BR');
        tr.appendChild(td3);

        const td4 = document.createElement('td');
        td4.style.cssText = 'font-size: 0.7rem; text-transform: uppercase;';
        td4.textContent = p.payment_method || '-';
        tr.appendChild(td4);

        const td5 = document.createElement('td');
        const spanStatus = document.createElement('span');
        spanStatus.className = `status-badge ${statusClass}`;
        spanStatus.textContent = p.status;
        td5.appendChild(spanStatus);
        tr.appendChild(td5);

        const td6 = document.createElement('td');
        td6.style.cssText = `font-size: 0.75rem; font-weight: 700; ${delayClass}`;
        td6.textContent = delayText;
        tr.appendChild(td6);

        const td7 = document.createElement('td');
        const actionDiv = document.createElement('div');
        actionDiv.className = 'action-btns';
        actionDiv.style.justifyContent = 'flex-end';
        
        const btnDoc = document.createElement('button');
        btnDoc.className = 'btn-mini';
        btnDoc.title = 'Gerar Recibo';
        btnDoc.innerHTML = '<i class="fa-solid fa-file-invoice"></i>';
        btnDoc.onclick = () => window.generateReceiptDoc(p);
        actionDiv.appendChild(btnDoc);

        const btnWork = document.createElement('button');
        btnWork.className = 'btn-mini';
        btnWork.title = 'Abrir Workspace';
        btnWork.innerHTML = '<i class="fa-solid fa-briefcase"></i>';
        btnWork.onclick = () => window.location.href = `/os/client-portal.html?project_id=${encodeURIComponent(p.contracts?.project_id)}`;
        actionDiv.appendChild(btnWork);

        const btnWpp = document.createElement('button');
        btnWpp.className = 'btn-mini btn-whatsapp';
        btnWpp.title = 'Cobrar via WhatsApp';
        btnWpp.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
        btnWpp.onclick = () => {
            const msg = window.getWhatsAppBillingMessage(p);
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(msg).then(() => {
                    alert('Mensagem de cobrança copiada! Cole no WhatsApp Web para enviar ao cliente.');
                }).catch(err => {
                    console.warn('Falha no clipboard:', err);
                    alert('Por favor, copie esta mensagem manualmente:\n\n' + msg);
                });
            } else {
                alert('Sua área de transferência está indisponível. Mensagem:\n\n' + msg);
            }
        };
        actionDiv.appendChild(btnWpp);

        if (p.status !== 'PAGO') {
            const btnBaixa = document.createElement('button');
            btnBaixa.className = 'btn-mini';
            btnBaixa.style.cssText = 'background: rgba(142, 158, 104, 0.2); color: var(--os-success); border-color: var(--os-success);';
            btnBaixa.title = 'Dar Baixa / Conciliar';
            btnBaixa.innerHTML = '<i class="fa-solid fa-check-double"></i>';
            btnBaixa.onclick = () => window.openBaixaModal(p.id, p.is_extra);
            actionDiv.appendChild(btnBaixa);
        }

        td7.appendChild(actionDiv);
        tr.appendChild(td7);
        
        body.appendChild(tr);
    });
}

function renderContracts(contracts) {
    const body = document.getElementById('contracts-body');
    if (!body) return;
    body.replaceChildren();
    contracts.forEach(c => {
        const startDate = new Date(c.created_at).toLocaleDateString('pt-BR');
        const renewalDate = new Date(new Date(c.created_at).setMonth(new Date(c.created_at).getMonth() + 6)).toLocaleDateString('pt-BR');
        const val = c.contract_value;
        const deliverables = c.deliverables || 'N/A';

        const tr = document.createElement('tr');

        const td1 = document.createElement('td');
        const divCompany = document.createElement('div');
        divCompany.style.fontWeight = '700';
        divCompany.textContent = c.company_name;
        const divClient = document.createElement('div');
        divClient.style.cssText = 'font-size: 0.7rem; color: var(--os-text-muted);';
        divClient.textContent = c.client_name;
        td1.appendChild(divCompany);
        td1.appendChild(divClient);
        tr.appendChild(td1);

        const td2 = document.createElement('td');
        td2.style.cssText = 'font-size: 0.7rem; font-weight: 700; color: var(--os-primary);';
        td2.textContent = 'ENGENHARIA DE CONTEÚDO';
        tr.appendChild(td2);

        const td3 = document.createElement('td');
        td3.style.cssText = 'font-size: 0.75rem;';
        if (deliverables.includes('[EXTRA]')) {
            const parts = deliverables.split('[EXTRA]:');
            const baseDeliverables = parts[0].trim();
            const extraDetails = parts.slice(1).join('[EXTRA]:').trim();
            const divBase = document.createElement('div');
            divBase.style.fontWeight = '500';
            divBase.textContent = baseDeliverables;
            const divExtra = document.createElement('div');
            divExtra.style.cssText = 'margin-top: 6px; display: inline-flex; align-items: center; gap: 6px; background: rgba(142, 158, 104, 0.12); border: 1px dashed var(--os-primary); padding: 4px 8px; border-radius: 4px; font-size: 0.65rem; color: #fff; line-height: 1.2;';
            const iconExtra = document.createElement('i');
            iconExtra.className = 'fa-solid fa-wand-magic-sparkles';
            iconExtra.style.cssText = 'color: var(--os-primary); font-size: 0.65rem;';
            const spanExtra = document.createElement('span');
            const strongExtra = document.createElement('strong');
            strongExtra.textContent = 'EXTRA: ';
            spanExtra.appendChild(strongExtra);
            spanExtra.appendChild(document.createTextNode(extraDetails));
            divExtra.appendChild(iconExtra);
            divExtra.appendChild(spanExtra);
            td3.appendChild(divBase);
            td3.appendChild(divExtra);
        } else {
            const divBase = document.createElement('div');
            divBase.style.fontWeight = '500';
            divBase.textContent = deliverables;
            td3.appendChild(divBase);
        }
        tr.appendChild(td3);

        const td4 = document.createElement('td');
        td4.style.cssText = 'font-family: var(--os-font-mono); font-weight: 600;';
        td4.textContent = formatCurrency(val);
        tr.appendChild(td4);

        const td5 = document.createElement('td');
        const spanStatus = document.createElement('span');
        spanStatus.className = 'status-badge';
        spanStatus.style.background = 'rgba(255,255,255,0.05)';
        spanStatus.textContent = c.status;
        td5.appendChild(spanStatus);
        tr.appendChild(td5);

        const td6 = document.createElement('td');
        td6.textContent = startDate;
        tr.appendChild(td6);

        const td7 = document.createElement('td');
        td7.textContent = renewalDate;
        tr.appendChild(td7);

        const td8 = document.createElement('td');
        const actionDiv = document.createElement('div');
        actionDiv.className = 'action-btns';
        actionDiv.style.justifyContent = 'flex-end';

        const btnPortal = document.createElement('a');
        btnPortal.setAttribute('href', '/os/client-portal.html?project_id=' + encodeURIComponent(c.project_id));
        btnPortal.className = 'btn-mini';
        btnPortal.style.cssText = 'display:inline-flex; align-items:center; justify-content:center; text-decoration:none;';
        btnPortal.title = 'Ver Portal Cliente';
        const iconPortal = document.createElement('i');
        iconPortal.className = 'fa-solid fa-briefcase';
        btnPortal.appendChild(iconPortal);
        actionDiv.appendChild(btnPortal);

        const btnDoc = document.createElement('button');
        btnDoc.className = 'btn-mini';
        btnDoc.title = 'Abrir Contrato';
        btnDoc.onclick = () => window.generateContractDoc(c.id);
        const iconDoc = document.createElement('i');
        iconDoc.className = 'fa-solid fa-file-pdf';
        btnDoc.appendChild(iconDoc);
        actionDiv.appendChild(btnDoc);

        const btnEdit = document.createElement('button');
        btnEdit.className = 'btn-mini';
        btnEdit.title = 'Editar';
        btnEdit.onclick = () => window.editContract(c.id);
        const iconEdit = document.createElement('i');
        iconEdit.className = 'fa-solid fa-pen-to-square';
        btnEdit.appendChild(iconEdit);
        actionDiv.appendChild(btnEdit);

        td8.appendChild(actionDiv);
        tr.appendChild(td8);

        body.appendChild(tr);
    });
}

function renderContractHealth(contracts, payments) {
    const body = document.getElementById('health-body');
    if (!body) return;
    const now = new Date();
    body.replaceChildren();
    contracts.forEach(c => {
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
        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        td1.textContent = c.client_name;
        tr.appendChild(td1);
        const td2 = document.createElement('td');
        const spanHealth = document.createElement('span');
        spanHealth.className = 'health-pill ' + healthClass;
        spanHealth.textContent = health;
        td2.appendChild(spanHealth);
        tr.appendChild(td2);
        const td3 = document.createElement('td');
        td3.style.cssText = 'font-size: 0.7rem; color: ' + (finRisk === 'Nulo' ? 'var(--os-success)' : 'var(--os-warning)') + ';';
        td3.textContent = finRisk;
        tr.appendChild(td3);
        const td4 = document.createElement('td');
        td4.style.cssText = 'font-size: 0.7rem; color: var(--os-success);';
        td4.textContent = opRisk;
        tr.appendChild(td4);
        const td5 = document.createElement('td');
        td5.style.cssText = 'font-size: 0.7rem; color: var(--os-success);';
        td5.textContent = 'Em Conformidade';
        tr.appendChild(td5);
        const td6 = document.createElement('td');
        td6.style.cssText = 'font-size: 0.75rem; font-weight: 700; color: var(--os-primary);';
        td6.textContent = nextAction;
        tr.appendChild(td6);
        body.appendChild(tr);
    });
}

function renderOperationalAlerts(contracts, payments) {
    const container = document.getElementById('alerts-container');
    if (!container) return;
    const now = new Date();
    // Reseta horas para comparação de dias precisa
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const alerts = [];

    payments.forEach(p => {
        const d = new Date(p.due_date);
        const dueDateObj = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const diff = Math.ceil((dueDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (p.status !== 'PAGO') {
            if (diff === 2) {
                alerts.push({
                    type: 'warning',
                    title: `Alerta: Vencimento em 2 dias (${p.contracts?.client_name})`,
                    desc: `Vence dia ${dueDateObj.toLocaleDateString('pt-BR')}. Lembre-se de mandar a mensagem de cobrança.`
                });
            } else if (diff === 0) {
                alerts.push({
                    type: 'critical',
                    title: `VENCIMENTO HOJE: ${p.contracts?.client_name}`,
                    desc: `Pagamento vence hoje! Envie a mensagem com o PIX.`
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

    container.replaceChildren();
    if (alerts.length === 0) {
        const pNode = document.createElement('p');
        pNode.style.cssText = "font-size: 0.8rem; color: var(--os-text-muted); opacity: 0.5;";
        pNode.textContent = "Nenhum alerta crítico pendente.";
        container.appendChild(pNode);
        return;
    }

    alerts.forEach(a => {
        const div = document.createElement('div'); 
        div.className = `alert-item ${a.type}`; 
        
        const iconDiv = document.createElement('div');
        iconDiv.className = 'alert-icon';
        iconDiv.style.color = a.type === 'critical' ? 'var(--os-danger)' : 'var(--os-warning)';
        
        const iconI = document.createElement('i');
        iconI.className = `fa-solid ${a.type === 'critical' ? 'fa-triangle-exclamation' : 'fa-circle-info'}`;
        iconDiv.appendChild(iconI);
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'alert-content';
        
        const titleH4 = document.createElement('h4');
        titleH4.className = 'safe-title';
        titleH4.textContent = a.title;
        
        const descP = document.createElement('p');
        descP.className = 'safe-desc';
        descP.textContent = a.desc;
        
        contentDiv.appendChild(titleH4);
        contentDiv.appendChild(descP);
        
        div.appendChild(iconDiv);
        div.appendChild(contentDiv);
        
        container.appendChild(div); 
    }); 
}

// ==========================================
// LÓGICA DA MODAL E C.R.U.D MVP
// ==========================================

window.switchTab = (tabId) => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content-section').forEach(s => s.style.display = 'none');
    
    event.currentTarget.classList.add('active');
    document.getElementById(`tab-content-${tabId}`).style.display = 'block';
};

window.closeEditContractModal = () => {
    document.getElementById('edit-contract-modal').style.display = 'none';
    document.getElementById('edit-contract-form').reset();
};

window.editContract = (contractId) => {
    const contractsList = window.__FINANCE_CONTRACTS || [];
    const contract = contractsList.find(c => c.id === contractId);
    if (!contract) {
        alert('Erro: Contrato não encontrado na base de dados ativa.');
        return;
    }
    
    document.getElementById('edit-contract-id').value = contract.id;
    document.getElementById('edit-project-id').value = contract.project_id || '';
    document.getElementById('edit-monthly-fee').value = contract.contract_value || '';
    document.getElementById('edit-payment-day').value = contract.due_day || 5;
    document.getElementById('edit-contract-deliverables').value = contract.deliverables || '';
    
    // Fallbacks para campos que antes vinham de mocks do localStorage
    document.getElementById('edit-brand-name').value = contract.company_name || '';
    document.getElementById('edit-brand-segment').value = '';
    document.getElementById('edit-link-instagram').value = '';
    document.getElementById('edit-link-whatsapp').value = '';
    document.getElementById('edit-link-drive').value = '';
    document.getElementById('edit-link-canva').value = '';
    document.getElementById('edit-link-website').value = '';
    
    document.getElementById('edit-contract-modal').style.display = 'flex';
    window.switchTab('contrato'); // Ensure first tab is active
    
    if (window.OS_LOGS_ENGINE) {
        window.OS_LOGS_ENGINE.userAction('CONTRACT_EDIT_STARTED', `Visualizando contrato ${contract.id}`);
    }
};

window.saveContractEdit = async () => {
    const contractId = document.getElementById('edit-contract-id').value;
    const btnSubmit = document.querySelector('#edit-contract-form button[type="submit"]');
    
    if (btnSubmit.disabled) return;
    btnSubmit.disabled = true;
    const originalText = btnSubmit.textContent;
    btnSubmit.textContent = '';
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-spinner fa-spin';
    btnSubmit.appendChild(icon);
    btnSubmit.appendChild(document.createTextNode(' Salvando...'));

    try {
        // Mapeando DTO inverso para a fonte da verdade oficial: CONTRATOS_CLIENTES
        const payload = {
            valor_mensal: parseFloat(document.getElementById('edit-monthly-fee').value),
            dia_vencimento: document.getElementById('edit-payment-day').value,
            escopo_contratado: document.getElementById('edit-contract-deliverables').value,
            data_atualizacao: new Date().toISOString()
        };
        
        // Verifica se há serviço extra preenchido
        let extraType = document.getElementById('edit-extra-type').value;
        if (extraType === 'Outro Serviço Avulso') {
            const customName = document.getElementById('edit-extra-custom-name').value;
            if (customName) extraType = customName;
        }

        let extraServicePayload = null;
        if (extraType && extraType !== "") {
            extraServicePayload = {
                extra_id: 'ext_' + crypto.getRandomValues(new Uint32Array(1))[0].toString(36),
                type: extraType,
                value: parseFloat(document.getElementById('edit-extra-value').value || 0),
                approved_value: parseFloat(document.getElementById('edit-extra-approved-value').value || 0),
                status: document.getElementById('edit-extra-status').value || 'solicitado',
                owner: document.getElementById('edit-extra-owner').value || 'Pendente',
                deadline_days: parseInt(document.getElementById('edit-extra-deadline').value || 0, 10),
                ai_credits: parseInt(document.getElementById('edit-extra-ai-credits').value || 0, 10),
                impact: document.getElementById('edit-extra-impact').value || 'baixo',
                description: document.getElementById('edit-extra-desc').value || '',
                drive_link: document.getElementById('edit-extra-drive-link').value || '',
                data_vencimento: document.getElementById('edit-extra-due-date').value || null,
                created_at: new Date().toISOString()
            };
        }

        const supabase = getSupabase();
        let remoteSuccess = false;

        // Tentativa de update no Supabase se existir
        if (supabase) {
            try {
                // Update contrato base apontando para a tabela real PT-BR (CONTRATOS_CLIENTES)
                const { error: errUpdate } = await supabase.from('CONTRATOS_CLIENTES').update(payload).eq('contrato_id', contractId);
                
                if (!errUpdate) remoteSuccess = true;
            } catch (e) {
                console.warn('[FINANCE_UPDATE] Erro remoto ao atualizar.', e);
            }
        }

        // Simulação do Webhook Engine
        let webhookSuccess = false;
        try {
            const webhookPayload = { event: 'FINANCE_UPDATE', payload: { id: contractId, ...payload }, extra_service: extraServicePayload };
            if (window.OS_CONFIG && window.OS_CONFIG.webhooks) {
                const res = await window.OS_CONFIG.webhooks.send('FINANCE_UPDATE', webhookPayload);
                webhookSuccess = res && res.success;
            } else {
                webhookSuccess = true;
            }
        } catch (e) {
            console.warn('[FINANCE_WEBHOOK] Falha.', e);
        }

        // Sem localStorage fallback. Erros são reais.
        if (!remoteSuccess) {
            alert("⚠️ ERRO CRÍTICO: Não foi possível gravar na tabela oficial (CONTRATOS_CLIENTES).");
            if (window.OS_LOGS_ENGINE) {
                window.OS_LOGS_ENGINE.userAction('CONTRACT_UPDATE_FAILED', 'Falha ao atualizar CONTRATOS_CLIENTES no Supabase.');
            }
        } else {
            if (window.OS_LOGS_ENGINE) {
                window.OS_LOGS_ENGINE.userAction('CONTRACT_UPDATED', `Contrato ${contractId} modificado na tabela oficial.`);
                if (extraServicePayload) {
                    window.OS_LOGS_ENGINE.userAction('SERVICE_EXTRA_ADDED', `Serviço ${extraType} acionado`);
                }
            }
        }

        // Reload data
        await loadFinanceData();
        window.closeEditContractModal();
        
    } catch (err) {
        console.error('[FINANCE_SAVE_ERROR]', err);
        alert("ERRO CRÍTICO: Não foi possível processar a edição. Tente novamente.");
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = originalText;
    }
};

window.getWhatsAppBillingMessage = (p) => {
    const isExtra = p.is_extra;
    const desc = isExtra ? 'Serviço Extra' : 'Mensalidade do Contrato';
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const d = new Date(p.due_date);
    const dueDateObj = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diff = Math.ceil((dueDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let greeting = '';
    if (diff > 0) {
        greeting = `Olá! Passando para lembrar que o vencimento do seu ${desc} está programado para o dia ${dueDateObj.toLocaleDateString('pt-BR')}.`;
    } else if (diff === 0) {
        greeting = `Olá! Passando para lembrar que o vencimento do seu ${desc} é HOJE (${dueDateObj.toLocaleDateString('pt-BR')}).`;
    } else {
        greeting = `Olá! Passando para informar que consta um atraso no pagamento do seu ${desc} que venceu dia ${dueDateObj.toLocaleDateString('pt-BR')}.`;
    }

    const value = formatCurrency(p.amount_due);
    
    let msg = `${greeting}\n\n`;
    msg += `Valor: *${value}*\n\n`;
    msg += `💳 *Dados para PIX:*\n`;
    msg += `Chave PIX (Celular): 7198111-4694\n`;
    msg += `Nome: Kássia Drucila Gomes de Farias\n`;
    msg += `Banco Itaú - Ag: 1576\n\n`;
    msg += `⚠️ _Por favor, confirme o nome do recebedor antes de concluir a transação._\n\n`;
    msg += `Assim que efetuar o pagamento, por favor, anexe o comprovante aqui mesmo nesta mensagem para darmos baixa no sistema!\n\n`;
    msg += `Qualquer dúvida, estamos à disposição. Equipe FluxAI.`;
    
    return msg;
};

window.openBaixaModal = (paymentId, isExtra) => {
    document.getElementById('baixa-payment-id').value = paymentId;
    document.getElementById('baixa-is-extra').value = isExtra ? 'true' : 'false';
    document.getElementById('baixa-form').reset();
    
    // Auto-preencher o mês atual como sugestão
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    document.getElementById('baixa-ref').value = `${now.getFullYear()}-${month}`;
    
    document.getElementById('baixa-modal').style.display = 'flex';
};

window.closeBaixaModal = () => {
    document.getElementById('baixa-modal').style.display = 'none';
};

window.saveBaixaPagamento = async () => {
    const paymentId = document.getElementById('baixa-payment-id').value;
    const isExtra = document.getElementById('baixa-is-extra').value === 'true';
    const conta = document.getElementById('baixa-conta').value;
    const forma = document.getElementById('baixa-forma').value;
    const ref = document.getElementById('baixa-ref').value;
    const comprovante = document.getElementById('baixa-comprovante').value;

    const btnSubmit = document.querySelector('#baixa-form button[type="submit"]');
    if (btnSubmit.disabled) return;
    btnSubmit.disabled = true;
    const originalText = btnSubmit.textContent;
    btnSubmit.textContent = 'Salvando...';

    try {
        const payload = {
            status: 'PAGO',
            receiving_account_id: conta || null,
            payment_method_real: forma,
            reference_month_year: ref,
            receipt_url: comprovante
        };

        const supabase = getSupabase();
        let remoteSuccess = false;

        if (supabase) {
            try {
                if (isExtra) {
                    await supabase.from('SERVICOS_EXTRAS_CLIENTES').update({ status_servico_extra: 'pago' }).eq('servico_extra_id', paymentId);
                } else {
                    await supabase.from('payments_ledger').update(payload).eq('id', paymentId);
                }
                remoteSuccess = true;
            } catch (e) {
                console.warn('[BAIXA] Falha remota', e);
            }
        }

        // Mock UI Update
        let mockPayments = JSON.parse(localStorage.getItem('fluxai_mock_payments') || '[]');
        const idx = mockPayments.findIndex(p => p.id === paymentId);
        if (idx !== -1) {
            mockPayments[idx].status = 'PAGO';
            mockPayments[idx].amount_paid = mockPayments[idx].amount_due;
            localStorage.setItem('fluxai_mock_payments', JSON.stringify(mockPayments));
        }

        if (window.OS_LOGS_ENGINE) {
            window.OS_LOGS_ENGINE.userAction('PAYMENT_RECONCILED', `Baixa do pagamento ${paymentId} concluída. Conta: ${conta}`);
        }

        await loadFinanceData();
        window.closeBaixaModal();
        alert('Pagamento reconciliado com sucesso! Baixa concluída.');

    } catch (err) {
        console.error('[BAIXA_ERROR]', err);
        alert('Erro ao dar baixa. Tente novamente.');
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = originalText;
    }
};

window.loadBankAccounts = async () => {
    const list = document.getElementById('bank-accounts-list');
    if(!list) return;
    list.innerHTML = '';
    
    const supabase = getSupabase();
    let accounts = [];
    
    if (supabase) {
        const { data } = await supabase.from('fluxai_bank_accounts').select('id, bank_name, agency, account_number, is_default').order('created_at', { ascending: false });
        if (data) accounts = data;
    }
    
    // Escapar HTML para evitar XSS (CodeQL DOM text reinterpreted as HTML)
    const escapeHtml = (unsafe) => (unsafe||'').toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

    if (accounts.length === 0) {
        list.innerHTML = '<li style="color:var(--os-text-muted); padding:10px 0;">Nenhuma conta configurada.</li>';
    } else {
        accounts.forEach(acc => {
            const li = document.createElement('li');
            li.className = 'bank-account-item';
            
            const info = document.createElement('div');
            info.innerHTML = `<strong style="color:var(--os-text);">${escapeHtml(acc.bank_name)}</strong> - ${escapeHtml(acc.owner_name)}<br/><span style="opacity:0.6;">Ag: ${escapeHtml(acc.agency)} | Cc: ${escapeHtml(acc.account_number)} | PIX: ${escapeHtml(acc.pix_key) || '-'}</span>`;
            
            const delBtn = document.createElement('button');
            delBtn.className = 'btn-mini';
            delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
            delBtn.style.cssText = "background: transparent; color: var(--os-danger); border: none;";
            delBtn.onclick = async () => {
                if(confirm('Remover esta conta?')) {
                    if (supabase) {
                        await supabase.from('fluxai_bank_accounts').delete().eq('id', acc.id);
                    }
                    loadBankAccounts();
                }
            };
            
            li.appendChild(info);
            li.appendChild(delBtn);
            list.appendChild(li);
        });
    }
};

window.saveBankAccount = async () => {
    const name = document.getElementById('new-bank-name').value;
    const owner = document.getElementById('new-bank-owner').value;
    const agency = document.getElementById('new-bank-agency').value;
    const account = document.getElementById('new-bank-account').value;
    const pix = document.getElementById('new-bank-pix').value;
    
    if(!name || !owner || !agency || !account) {
        alert('Preencha os campos obrigatórios.');
        return;
    }
    
    const payload = {
        id: crypto.randomUUID(),
        bank_name: name,
        owner_name: owner,
        agency: agency,
        account_number: account,
        pix_key: pix,
        is_active: true
    };

    const supabase = getSupabase();
    if (supabase) {
        await supabase.from('fluxai_bank_accounts').insert([payload]);
    }
    
    document.getElementById('add-bank-form').reset();
    loadBankAccounts();
};

window.generateContractDoc = (contractId) => {
    alert('Visualizador de Contrato (PDF) será integrado na próxima fase!');
};

window.generateReceiptDoc = (payment) => {
    if (!payment) return;
    
    if (window.OS_LOGS_ENGINE) {
        window.OS_LOGS_ENGINE.userAction('RECEIPT_DOC_REQUESTED', `Geração de recibo HTML para pagamento ${payment.id}`);
    }

    const contentDiv = document.getElementById('receipt-content');
    
    let extrasHtmlNode = null;
    if (!payment.is_extra && payment.contracts?.extras && payment.contracts.extras.length > 0) {
        const extrasWrapper = document.createElement('div');
        const extrasHeader = document.createElement('h4');
        extrasHeader.style.cssText = "margin: 15px 0 5px 0; color: var(--os-primary);";
        extrasHeader.textContent = "Serviços Extras / Avulsos Lançados:";
        const extrasUl = document.createElement('ul');
        extrasUl.style.cssText = "padding-left: 20px; color: var(--os-text-muted);";
        
        payment.contracts.extras.forEach(ext => {
            const li = document.createElement('li');
            const strongExtType = document.createElement('strong');
            strongExtType.textContent = ext.type;
            const textNode = document.createTextNode(` - Valor: ${formatCurrency(ext.value)} (Status: ${ext.status.toUpperCase()})`);
            li.appendChild(strongExtType);
            li.appendChild(textNode);
            extrasUl.appendChild(li);
        });
        extrasWrapper.appendChild(extrasHeader);
        extrasWrapper.appendChild(extrasUl);
        extrasHtmlNode = extrasWrapper;
    }

    contentDiv.textContent = '';
    
    const headerDiv = document.createElement('div');
    headerDiv.style.cssText = "display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;";
    
    const clientDiv = document.createElement('div');
    const pClient = document.createElement('p');
    const strongClient = document.createElement('strong');
    strongClient.textContent = "Para o Cliente:";
    const br1 = document.createElement('br');
    const clientNameNode = document.createTextNode(payment.contracts?.client_name || 'Cliente');
    const br2 = document.createElement('br');
    const spanCompany = document.createElement('span');
    spanCompany.style.color = "var(--os-text-muted)";
    spanCompany.textContent = payment.contracts?.company_name || '';
    pClient.appendChild(strongClient);
    pClient.appendChild(br1);
    pClient.appendChild(clientNameNode);
    pClient.appendChild(br2);
    pClient.appendChild(spanCompany);
    clientDiv.appendChild(pClient);
    
    const infoDiv = document.createElement('div');
    infoDiv.style.textAlign = "right";
    const pInfo = document.createElement('p');
    const strongRef = document.createElement('strong');
    strongRef.textContent = "Pagamento Ref:";
    const refNode = document.createTextNode(" #" + payment.id.toUpperCase());
    const br3 = document.createElement('br');
    const strongStatus = document.createElement('strong');
    strongStatus.textContent = "Status:";
    const statusNode = document.createTextNode(" " + payment.status);
    pInfo.appendChild(strongRef);
    pInfo.appendChild(refNode);
    pInfo.appendChild(br3);
    pInfo.appendChild(strongStatus);
    pInfo.appendChild(statusNode);
    infoDiv.appendChild(pInfo);
    
    headerDiv.appendChild(clientDiv);
    headerDiv.appendChild(infoDiv);
    
    const scopeDiv = document.createElement('div');
    scopeDiv.style.cssText = "background: rgba(255,255,255,0.05); padding: 15px; border-radius: 4px; border: 1px solid var(--os-border); margin-bottom: 20px;";
    const pScope = document.createElement('p');
    pScope.style.margin = "0";
    const strongScope = document.createElement('strong');
    strongScope.textContent = payment.is_extra ? "Serviço Extra:" : "Escopo Recorrente Acordado:";
    const br4 = document.createElement('br');
    pScope.appendChild(strongScope);
    pScope.appendChild(br4);
    
    let desc = payment.is_extra ? (payment.contracts?.company_name || 'Serviço Extra') : (payment.contracts?.deliverables || 'Contrato Base');
    if (desc) {
        const deliverablesLines = desc.split('\\n');
        deliverablesLines.forEach((line, index) => {
            pScope.appendChild(document.createTextNode(line));
            if (index < deliverablesLines.length - 1) {
                pScope.appendChild(document.createElement('br'));
            }
        });
    }
    
    scopeDiv.appendChild(pScope);
    
    const valueDiv = document.createElement('div');
    valueDiv.style.cssText = "display: flex; justify-content: space-between; font-size: 1.1rem; font-family: var(--os-font-mono); font-weight: 700; border-top: 1px solid var(--os-border); padding-top: 15px;";
    const spanValText = document.createElement('span');
    spanValText.textContent = payment.is_extra ? "Valor do Serviço:" : "Valor da Parcela / Fatura:";
    const spanVal = document.createElement('span');
    spanVal.textContent = formatCurrency(payment.amount_due);
    valueDiv.appendChild(spanValText);
    valueDiv.appendChild(spanVal);
    
    contentDiv.appendChild(headerDiv);
    contentDiv.appendChild(scopeDiv);
    contentDiv.appendChild(valueDiv);
    
    if (typeof extrasHtmlNode !== 'undefined' && extrasHtmlNode) {
        contentDiv.appendChild(extrasHtmlNode);
    }

    document.getElementById('receipt-date').innerText = new Date().toLocaleString('pt-BR');
    document.getElementById('receipt-hash').innerText = btoa(payment.id + Date.now()).substring(0, 16).toUpperCase();
    
    document.getElementById('receipt-modal').style.display = 'flex';
};

window.printReceipt = () => {
    window.print();
};

initFinance();
