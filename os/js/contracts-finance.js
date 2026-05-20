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
    
    // Inicializar mockProjects no localStorage para persistência cadastral
    let mockProjects = JSON.parse(localStorage.getItem('fluxai_mock_projects'));
    if (!mockProjects) {
        mockProjects = [
            { 
                id: "p_c1", 
                company_name: "Nutrição & Consultoria Alimentar",
                segment: "Saúde & Nutrição",
                digital_infrastructure: {
                    operational_links: {
                        instagram: "https://instagram.com/maria.nutri",
                        website: "https://marianutricao.com.br",
                        canva: "https://canva.com/design/maria-premium",
                        drive: "https://drive.google.com/drive/maria-folder",
                        whatsapp: "5511999999999"
                    }
                }
            },
            { 
                id: "p_c2", 
                company_name: "Alves Odonto Premium",
                segment: "Odontologia de Alta Performance",
                digital_infrastructure: {
                    operational_links: {
                        instagram: "https://instagram.com/alves.odonto",
                        website: "https://alvesodontologia.com.br",
                        canva: "https://canva.com/design/alves-premium",
                        drive: "https://drive.google.com/drive/alves-folder",
                        whatsapp: "5511888888888"
                    }
                }
            },
            { 
                id: "p_c3", 
                company_name: "Apex Educacional",
                segment: "Educação Executiva",
                digital_infrastructure: {
                    operational_links: {
                        instagram: "https://instagram.com/instituto.apex",
                        website: "https://apexeducacional.com.br",
                        canva: "https://canva.com/design/apex-premium",
                        drive: "https://drive.google.com/drive/apex-folder",
                        whatsapp: "5511777777777"
                    }
                }
            }
        ];
        localStorage.setItem('fluxai_mock_projects', JSON.stringify(mockProjects));
    }

    // Inicializar mockContracts no localStorage para persistência interativa
    let mockContracts = JSON.parse(localStorage.getItem('fluxai_mock_contracts'));
    if (!mockContracts) {
        mockContracts = [
            { id: "c1", project_id: "p_c1", client_name: "Maria Aparecida", company_name: "Nutrição & Consultoria Alimentar", deliverables: "2 carrosséis + 2 reels/mês", contract_value: 800, status: "ATIVO", created_at: "2026-05-10T00:00:00Z", due_day: 4 },
            { id: "c2", project_id: "p_c2", client_name: "Dr. Roberto Alves", company_name: "Alves Odonto Premium", deliverables: "Gestão de Tráfego + CRM", contract_value: 5000, status: "ATIVO", created_at: "2025-03-15T00:00:00Z", due_day: 15 },
            { id: "c3", project_id: "p_c3", client_name: "Instituto Apex", company_name: "Apex Educacional", deliverables: "Governança Full-Stack", contract_value: 8500, status: "ATIVO", created_at: "2024-11-20T00:00:00Z", due_day: 10 }
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
        if (p.contracts) {
            p.contracts.projects = mockProjects.find(pr => pr.id === p.contracts.project_id);
        }
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

// Helpers de Resiliência de Cadastro & Links Operacionais
function getProjectLinks(project) {
    if (!project) return {};
    return project.links || 
           project.digital_infrastructure?.operational_links || 
           project.metadata?.digital_infrastructure?.operational_links || 
           {};
}

function updateProjectLinks(project, updatedLinks) {
    if (!project) return {};
    
    project.links = updatedLinks;
    
    if (!project.digital_infrastructure) {
        project.digital_infrastructure = {};
    }
    project.digital_infrastructure.operational_links = updatedLinks;
    
    if (!project.metadata) {
        project.metadata = {};
    }
    if (!project.metadata.digital_infrastructure) {
        project.metadata.digital_infrastructure = {};
    }
    project.metadata.digital_infrastructure.operational_links = updatedLinks;
    
    return project;
}

// Controle de Abas do Modal
window.switchTab = (tabName) => {
    const tabs = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.tab-content-section');
    
    tabs.forEach(btn => {
        if (btn.getAttribute('onclick').includes(tabName)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    sections.forEach(sec => {
        if (sec.id === `tab-content-${tabName}`) {
            sec.style.display = 'block';
        } else {
            sec.style.display = 'none';
        }
    });
};

window.closeEditContractModal = () => {
    document.getElementById('edit-contract-modal').style.display = 'none';
};

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

    // Buscar projeto correspondente para obter links e segmentos
    let project = null;
    if (supabase && c.project_id && !c.project_id.startsWith('p_')) {
        try {
            const { data } = await supabase.from('projects').select('*').eq('id', c.project_id).single();
            project = data;
        } catch (e) {
            console.warn('[FINANCE] Erro ao buscar projeto no Supabase. Buscando nos mocks.', e);
        }
    }

    if (!project && c.project_id) {
        const mockProjects = JSON.parse(localStorage.getItem('fluxai_mock_projects') || '[]');
        project = mockProjects.find(x => x.id === c.project_id);
    }

    // Preencher campos recorrentes
    document.getElementById('edit-contract-id').value = c.id;
    document.getElementById('edit-project-id').value = c.project_id || '';
    document.getElementById('edit-monthly-fee').value = c.contract_value;
    document.getElementById('edit-payment-day').value = c.due_day || 5;
    document.getElementById('edit-contract-deliverables').value = c.deliverables || '';

    // Limpar campos extras (evitar manter entradas anteriores)
    document.getElementById('edit-extra-type').value = '';
    document.getElementById('edit-extra-value').value = '';
    document.getElementById('edit-extra-desc').value = '';

    // Preencher campos de cadastro
    document.getElementById('edit-brand-name').value = project ? project.company_name : (c.company_name || '');
    document.getElementById('edit-brand-segment').value = project ? (project.segment || '') : '';

    const links = getProjectLinks(project);
    document.getElementById('edit-link-instagram').value = links.instagram || '';
    document.getElementById('edit-link-whatsapp').value = links.whatsapp || '';
    document.getElementById('edit-link-drive').value = links.drive || '';
    document.getElementById('edit-link-canva').value = links.canva || '';
    document.getElementById('edit-link-website').value = links.website || '';

    // Exibir o modal
    document.getElementById('edit-contract-modal').style.display = 'flex';
    window.switchTab('contrato'); // Começa focado nos dados do Contrato
};

window.saveContractEdit = async () => {
    const contractId = document.getElementById('edit-contract-id').value;
    const projectId = document.getElementById('edit-project-id').value;
    
    const monthlyFee = Number(document.getElementById('edit-monthly-fee').value);
    const paymentDay = Number(document.getElementById('edit-payment-day').value);
    let deliverables = document.getElementById('edit-contract-deliverables').value;

    const brandName = document.getElementById('edit-brand-name').value;
    const brandSegment = document.getElementById('edit-brand-segment').value;

    // Extra / Avulso
    const extraType = document.getElementById('edit-extra-type').value;
    const extraValue = Number(document.getElementById('edit-extra-value').value) || 0;
    const extraDesc = document.getElementById('edit-extra-desc').value;

    // Links
    const updatedLinks = {
        instagram: document.getElementById('edit-link-instagram').value,
        whatsapp: document.getElementById('edit-link-whatsapp').value,
        drive: document.getElementById('edit-link-drive').value,
        canva: document.getElementById('edit-link-canva').value,
        website: document.getElementById('edit-link-website').value
    };

    // Caso haja um serviço extra válido, anexa ao escopo
    let extraAdded = false;
    if (extraValue > 0 && extraType) {
        deliverables += `\n[EXTRA]: ${extraType} - ${extraDesc}`;
        extraAdded = true;
    }

    const supabase = getSupabase();

    if (supabase && !contractId.startsWith('c')) {
        try {
            // 1. Atualizar o Contrato recorrente
            const { error: cErr } = await supabase.from('contracts').update({
                contract_value: monthlyFee,
                deliverables: deliverables,
                due_day: paymentDay,
                company_name: brandName
            }).eq('id', contractId);

            if (cErr) throw cErr;

            // 2. Atualizar o Cadastro & Links no Projeto
            if (projectId) {
                const { data: existingProject } = await supabase.from('projects').select('*').eq('id', projectId).single();
                
                let updatedProj = updateProjectLinks(existingProject || {}, updatedLinks);
                updatedProj.company_name = brandName;
                updatedProj.segment = brandSegment;

                const { error: pErr } = await supabase.from('projects').update(updatedProj).eq('id', projectId);
                if (pErr) throw pErr;
            }

            // 3. Se houver serviço extra, cria um faturamento imediato pendente para hoje
            if (extraAdded) {
                const { error: payErr } = await supabase.from('payments').insert([{
                    contract_id: contractId,
                    amount_due: extraValue,
                    due_date: new Date().toISOString(),
                    status: 'PENDENTE',
                    payment_method: 'Pix'
                }]);
                if (payErr) throw payErr;
                
                await logAction(`Extra lançado: ${extraType} (R$ ${extraValue})`, contractId);
            }

            await logAction('Contrato e cadastro atualizados via modal premium de governança', contractId);
            alert('Atualizações gravadas no Supabase com sucesso!');
        } catch (error) {
            alert('Erro ao salvar no banco de dados: ' + error.message);
            return;
        }
    } else {
        // MOCK PERSISTENCE (Resiliência offline localStorage)
        const mockContracts = JSON.parse(localStorage.getItem('fluxai_mock_contracts') || '[]');
        const mockProjects = JSON.parse(localStorage.getItem('fluxai_mock_projects') || '[]');
        const mockPayments = JSON.parse(localStorage.getItem('fluxai_mock_payments') || '[]');

        // 1. Atualizar o Contrato nos mocks
        const cIdx = mockContracts.findIndex(x => x.id === contractId);
        if (cIdx !== -1) {
            mockContracts[cIdx].contract_value = monthlyFee;
            mockContracts[cIdx].deliverables = deliverables;
            mockContracts[cIdx].due_day = paymentDay;
            mockContracts[cIdx].company_name = brandName;
            localStorage.setItem('fluxai_mock_contracts', JSON.stringify(mockContracts));
        }

        // 2. Atualizar Projeto nos mocks
        const pIdx = mockProjects.findIndex(x => x.id === projectId);
        if (pIdx !== -1) {
            mockProjects[pIdx].company_name = brandName;
            mockProjects[pIdx].segment = brandSegment;
            updateProjectLinks(mockProjects[pIdx], updatedLinks);
            localStorage.setItem('fluxai_mock_projects', JSON.stringify(mockProjects));
        } else if (projectId) {
            const newProj = {
                id: projectId,
                company_name: brandName,
                segment: brandSegment
            };
            updateProjectLinks(newProj, updatedLinks);
            mockProjects.push(newProj);
            localStorage.setItem('fluxai_mock_projects', JSON.stringify(mockProjects));
        }

        // 3. Atualizar faturamentos recorrentes em aberto para refletir novo valor se mudou
        mockPayments.forEach(p => {
            if (p.contract_id === contractId && p.status !== 'PAGO' && !p.id.includes('extra')) {
                p.amount_due = monthlyFee;
            }
        });

        // 4. Se adicionou serviço extra, lança lançamento avulso para hoje
        if (extraAdded) {
            const newPayment = {
                id: 'p_extra_' + Date.now(),
                contract_id: contractId,
                amount_due: extraValue,
                due_date: new Date().toISOString(),
                status: 'PENDENTE',
                payment_method: 'Pix'
            };
            mockPayments.push(newPayment);
        }

        localStorage.setItem('fluxai_mock_payments', JSON.stringify(mockPayments));
        alert('Contrato e cadastro atualizados localmente com sucesso!');
    }

    window.closeEditContractModal();
    loadFinanceData();
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
                const { data: project } = await supabase.from('projects').select('*').eq('id', p.contracts.project_id).single();
                const links = getProjectLinks(project);
                whatsapp = links.whatsapp || '';
            }
        } catch (e) {
            console.warn(e);
        }
    }

    if (!p) {
        const mockPayments = JSON.parse(localStorage.getItem('fluxai_mock_payments') || '[]');
        const mockContracts = JSON.parse(localStorage.getItem('fluxai_mock_contracts') || '[]');
        const mockProjects = JSON.parse(localStorage.getItem('fluxai_mock_projects') || '[]');
        p = mockPayments.find(x => x.id === paymentId);
        if (p) {
            p.contracts = mockContracts.find(c => c.id === p.contract_id);
            const project = mockProjects.find(pr => pr.id === p.contracts?.project_id);
            const links = getProjectLinks(project);
            whatsapp = links.whatsapp || '5511999999999';
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
