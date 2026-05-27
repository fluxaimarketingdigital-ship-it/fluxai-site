import { OS_UI, OS_AUTH } from '../os-core.js';
import { SheetsService } from '../../services/sheets-service.js';
import { OS_LOGS_ENGINE } from '../../services/logs-engine.js';

let currentUser = null;

async function initPage() {
    // Restrição absoluta ao perfil ADMIN
    const user = await OS_AUTH.check('ADMIN');
    if (!user) return;
    currentUser = user;

    OS_UI.renderSidebar('executive-center', user.role);
    await OS_UI.renderTopbar();

    await loadExecutiveData();
}

async function loadExecutiveData() {
    try {
        // 1. Carregar dados do localStorage e fallbacks
        const mockContracts = JSON.parse(localStorage.getItem('fluxai_mock_contracts') || '[]');
        const mockPayments = JSON.parse(localStorage.getItem('fluxai_mock_payments') || '[]');
        const mockProjects = JSON.parse(localStorage.getItem('fluxai_mock_projects') || '[]');
        const mockAssets = JSON.parse(localStorage.getItem('fluxai_mock_assets') || '[]');
        const mockDemands = JSON.parse(localStorage.getItem('fluxai_mock_demands') || '[]');
        const clientConfigs = JSON.parse(localStorage.getItem('fluxai_client_configs') || '{}');

        // Leads fallback
        let localLeads = JSON.parse(localStorage.getItem('fluxai_mock_leads') || '[]');
        if (localLeads.length === 0) {
            localLeads = [
                { id_lead: 'LD_5001', nome_lead: 'Roberto Dutra', empresa: 'Dutra Logística', contato: '11 99122-3344', servico_interesse: 'Gestão de Mídia Social', origem: 'LinkedIn', status: 'proposta_enviada', responsavel: 'Comercial' },
                { id_lead: 'LD_5002', nome_lead: 'Maria Oliveira', empresa: 'Clínica Saúde', contato: '11 98888-7777', servico_interesse: 'Tráfego Pago + CRM', origem: 'Instagram', status: 'em_negociacao', responsavel: 'Comercial' },
                { id_lead: 'LD_5003', nome_lead: 'Carlos Andrade', empresa: 'Andrade Law', contato: '21 97777-6666', servico_interesse: 'Assessoria de Conteúdo', origem: 'Indicação', status: 'novo', responsavel: 'Diretoria' },
                { id_lead: 'LD_5004', nome_lead: 'Juliana Costa', empresa: 'Costa Estética', contato: '82 99933-2211', servico_interesse: 'Onboarding Estratégico', origem: 'Site', status: 'fechado', responsavel: 'Comercial' }
            ];
            localStorage.setItem('fluxai_mock_leads', JSON.stringify(localLeads));
        }

        // 2. Cálculos Financeiros
        const activeContracts = mockContracts.filter(c => c.status === 'ATIVO');
        
        // MRR
        const mrr = activeContracts.reduce((acc, c) => acc + Number(c.contract_value || 0), 0);
        
        // Contas a receber
        const totalExpected = mockPayments.reduce((acc, p) => acc + Number(p.amount_due || 0), 0);
        const totalPaid = mockPayments.reduce((acc, p) => acc + Number(p.amount_paid || 0), 0);
        const totalPending = totalExpected - totalPaid;
        
        // Ticket Médio
        const avgTicket = activeContracts.length > 0 ? (mrr / activeContracts.length) : 0;
        
        // Margem Operacional Estimada (custos estimados em 28%)
        const marginEstimated = 72; // 72%
        
        // Inadimplência
        const overduePayments = mockPayments.filter(p => {
            if (p.status === 'PAGO') return false;
            const diff = (new Date() - new Date(p.due_date)) / (1000 * 60 * 60 * 24);
            return diff > 0;
        });
        const overdueAmount = overduePayments.reduce((acc, p) => acc + Number(p.amount_due || 0), 0);
        const defaultRate = totalExpected > 0 ? ((overdueAmount / totalExpected) * 100).toFixed(1) : '0.0';

        // 3. Renderizar KPIs Executivos
        const kpiGrid = document.getElementById('executive-kpi-grid');
        kpiGrid.innerHTML = `
            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header">
                    <span class="os-widget-label">Receita Recorrente (MRR)</span>
                    <i class="fa-solid fa-crown" style="color:var(--os-primary)"></i>
                </div>
                <div class="os-metric">
                    <div class="os-metric-value">${formatCurrency(mrr)}</div>
                    <div class="os-metric-meta">Carga ativa contratada</div>
                </div>
            </div>
            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header">
                    <span class="os-widget-label">Contas a Receber (Mês)</span>
                    <i class="fa-solid fa-hand-holding-dollar" style="color:var(--os-primary)"></i>
                </div>
                <div class="os-metric">
                    <div class="os-metric-value">${formatCurrency(totalExpected)}</div>
                    <div class="os-metric-meta">Pago: ${formatCurrency(totalPaid)} | Pendente: ${formatCurrency(totalPending)}</div>
                </div>
            </div>
            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header">
                    <span class="os-widget-label">Ticket Médio Executivo</span>
                    <i class="fa-solid fa-chart-pie" style="color:var(--os-primary)"></i>
                </div>
                <div class="os-metric">
                    <div class="os-metric-value">${formatCurrency(avgTicket)}</div>
                    <div class="os-metric-meta">Média por portfólio ativo</div>
                </div>
            </div>
            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header">
                    <span class="os-widget-label">Retenção & Margem</span>
                    <i class="fa-solid fa-shield-halved" style="color:var(--os-success)"></i>
                </div>
                <div class="os-metric">
                    <div class="os-metric-value">98.2% / ${marginEstimated}%</div>
                    <div class="os-metric-meta">Churn: 1.8% | Inadimplência: ${defaultRate}%</div>
                </div>
            </div>
        `;

        // 4. Renderizar Tabela 1: Saúde Financeira por Cliente
        const tableFinanceBody = document.querySelector('#table-exec-finance tbody');
        if (tableFinanceBody) {
            tableFinanceBody.replaceChildren();
            const activeProjects = mockProjects.filter(p => true); // Ajuste se necessário

            if (activeProjects.length === 0) {
                const tr = document.createElement('tr');
                tr.innerHTML = '<td colspan="6" style="text-align:center; padding:20px; opacity:0.5;">Nenhum dado financeiro para os clientes ativos.</td>';
                tableFinanceBody.appendChild(tr);
            } else {
                activeProjects.forEach(proj => {
                    const contract = mockContracts.find(c => c.project_id === proj.id || c.client_name === proj.company_name);
                    const payments = mockPayments.filter(p => p.contract_id === contract?.id);
                    
                    const value = contract ? contract.contract_value : 0;
                    const paid = payments.reduce((acc, p) => acc + (p.status === 'PAGO' ? p.amount_due : 0), 0);
                    const pending = value - paid > 0 ? value - paid : 0;
                    
                    const overdue = payments.some(p => {
                        if (p.status === 'PAGO') return false;
                        return (new Date() - new Date(p.due_date)) > 0;
                    });
                    
                    const dueDay = contract ? `Dia ${contract.due_day}` : 'N/A'; 
 
                    const tr = document.createElement('tr'); 
                    tr.innerHTML = ` 
                        <td class="cell-primary safe-company"></td> 
                        <td class="cell-mono safe-value"></td> 
                        <td class="cell-mono safe-paid" style="color: var(--os-success);"></td> 
                        <td class="cell-mono safe-pending"></td> 
                        <td class="safe-dueday"></td> 
                        <td class="safe-status"></td> 
                    `; 
                    tr.querySelector('.safe-company').textContent = proj.company_name; 
                    tr.querySelector('.safe-value').textContent = formatCurrency(value);
                    tr.querySelector('.safe-paid').textContent = formatCurrency(paid);
                    tr.querySelector('.safe-pending').textContent = formatCurrency(pending);
                    if (pending > 0) tr.querySelector('.safe-pending').style.color = 'var(--os-warning)';
                    tr.querySelector('.safe-dueday').textContent = dueDay;
                    
                    const statusSpan = document.createElement('span');
                    if (overdue) {
                        statusSpan.className = 'os-badge os-badge-danger';
                        statusSpan.textContent = 'Atrasado';
                    } else if (pending > 0) {
                        statusSpan.className = 'os-badge os-badge-warning';
                        statusSpan.textContent = 'Pendente';
                    } else {
                        statusSpan.className = 'os-badge os-badge-success';
                        statusSpan.textContent = 'Em dia';
                    }
                    tr.querySelector('.safe-status').appendChild(statusSpan);
                    tableFinanceBody.appendChild(tr); 
                });
            }
        }

        // 5. Renderizar Tabela 2: Gestão de Contratos de Clientes
        const tableContractsBody = document.querySelector('#table-exec-contracts tbody');
        if (tableContractsBody) {
            tableContractsBody.replaceChildren();
            if (mockContracts.length === 0) {
                const tr = document.createElement('tr');
                tr.innerHTML = '<td colspan="6" style="text-align:center; padding:20px; opacity:0.5;">Nenhum contrato cadastrado.</td>';
                tableContractsBody.appendChild(tr);
            } else {
                mockContracts.forEach(c => {
                    const project = mockProjects.find(p => p.id === c.project_id);
                    const driveLink = project?.digital_infrastructure?.operational_links?.drive || '#';
                    const renewal = new Date(c.created_at); 
                    renewal.setMonth(renewal.getMonth() + 6); // 6 meses de vigência padrão 
 
                    const tr = document.createElement('tr'); 
                    tr.innerHTML = ` 
                        <td class="cell-mono safe-id"></td> 
                        <td class="cell-primary safe-company"></td> 
                        <td class="safe-deliv" style="font-size: 0.75rem;"></td> 
                        <td class="safe-renewal"></td> 
                        <td> 
                            <a class="safe-drive" target="_blank" class="os-btn os-btn-sm" style="padding: 2px 8px; font-size: 0.65rem; background: rgba(255,255,255,0.03); border: 1px solid var(--os-border);"> 
                                <i class="fa-solid fa-folder-open"></i> Drive 
                            </a> 
                        </td> 
                        <td class="safe-status"></td> 
                    `; 
                    tr.querySelector('.safe-id').textContent = c.id.toUpperCase();
                    tr.querySelector('.safe-company').textContent = c.company_name; 
                    tr.querySelector('.safe-deliv').textContent = c.deliverables; 
                    tr.querySelector('.safe-renewal').textContent = renewal.toLocaleDateString('pt-BR');
                    tr.querySelector('.safe-drive').href = driveLink; 

                    const statusSpan = document.createElement('span');
                    if (c.status === 'PAUSADO') {
                        statusSpan.className = 'os-badge os-badge-warning';
                        statusSpan.textContent = 'Pausado';
                    } else if (c.status === 'CANCELADO') {
                        statusSpan.className = 'os-badge os-badge-danger';
                        statusSpan.textContent = 'Cancelado';
                    } else {
                        statusSpan.className = 'os-badge os-badge-success';
                        statusSpan.textContent = 'Ativo';
                    }
                    tr.querySelector('.safe-status').appendChild(statusSpan);
                    tableContractsBody.appendChild(tr);
                });
            }
        }

        // 6. Renderizar Tabela 3: Pipeline de Leads e CRM Comercial
        const tableCommercialBody = document.querySelector('#table-exec-commercial tbody');
        if (tableCommercialBody) {
            tableCommercialBody.replaceChildren();
            if (localLeads.length === 0) {
                const tr = document.createElement('tr');
                tr.innerHTML = '<td colspan="5" style="text-align:center; padding:20px; opacity:0.5;">Nenhum lead em negociação.</td>';
                tableCommercialBody.appendChild(tr);
            } else {
                localLeads.forEach(l => {
                    let badge = '<span class="os-badge os-badge-neutral">' + l.status.replace('_', ' ') + '</span>';
                    if (l.status === 'fechado') badge = '<span class="os-badge os-badge-success">Fechado</span>';
                    const statusVal = l.status.replace('_', ' ');
                    
                    const statusSpan = document.createElement('span');
                    if (l.status === 'fechado') {
                        statusSpan.className = 'os-badge os-badge-success';
                        statusSpan.textContent = 'Fechado';
                    } else if (l.status === 'proposta_enviada') {
                        statusSpan.className = 'os-badge os-badge-info';
                        statusSpan.textContent = 'Proposta Enviada';
                    } else if (l.status === 'em_negociacao') {
                        statusSpan.className = 'os-badge os-badge-warning';
                        statusSpan.textContent = 'Negociação';
                    } else {
                        statusSpan.className = 'os-badge os-badge-neutral';
                        statusSpan.textContent = statusVal;
                    }
 
                    const tr = document.createElement('tr'); 
                    tr.innerHTML = ` 
                        <td class="cell-primary"> 
                            <div class="safe-nome"></div> 
                            <div class="safe-empresa-contato" style="font-size: 0.7rem; color: var(--os-text-muted);"></div> 
                        </td> 
                        <td class="safe-origem"></td> 
                        <td><span class="safe-servico" style="font-size: 0.7rem; border: 1px solid var(--os-border); padding: 2px 6px; border-radius: 4px;"></span></td> 
                        <td class="safe-resp"></td> 
                        <td class="safe-status-container"></td> 
                    `; 
                    tr.querySelector('.safe-nome').textContent = l.nome_lead; 
                    tr.querySelector('.safe-empresa-contato').textContent = `${l.empresa} - ${l.contato}`; 
                    tr.querySelector('.safe-origem').textContent = l.origem; 
                    tr.querySelector('.safe-servico').textContent = l.servico_interesse; 
                    tr.querySelector('.safe-resp').textContent = l.responsavel; 
                    tr.querySelector('.safe-status-container').appendChild(statusSpan);
                    tableCommercialBody.appendChild(tr);
                });
            }
        }

        // 7. Renderizar Tabela 4: Estatísticas de Carga Operacional
        const tableOperationsBody = document.querySelector('#table-exec-operations tbody');
        if (tableOperationsBody) {
            const activeClients = mockProjects.filter(p => {
                const cfg = clientConfigs[p.id] || {};
                return cfg.status !== 'inativo';
            }).length;

            const pendingDemands = mockDemands.filter(d => d.status === 'aberta' || d.status === 'em_andamento').length;
            const iaQueue = mockAssets.filter(a => a.status === 'aguardando_publicacao').length;
            const inReview = mockAssets.filter(a => a.status === 'em_revisao').length;

            // Calcular carga total (média de demandas + fila de IA por cliente ativo)
            const activeClientsNum = activeClients || 1;
            const avgLoad = ((pendingDemands + iaQueue + inReview) / activeClientsNum).toFixed(1);
            
            const indicators = [ 
                { name: 'Carga Operacional por Cliente (Média)', value: `${avgLoad} entregas/ciclo`, status: 'Estável' }, 
                { name: 'Fila de Postagens Assistidas (IA)', value: `${iaQueue} posts aguardando`, status: 'Aguardando Operador' }, 
                { name: 'Demandas Técnicas Pendentes', value: `${pendingDemands} abertas`, status: 'Fila ativa' }, 
                { name: 'Total de Clientes Gerenciados', value: `${activeClients} corporações`, status: 'Ativos no OS' } 
            ];
            
            tableOperationsBody.replaceChildren();
            indicators.forEach((ind, i) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="cell-primary safe-name"></td> 
                    <td class="safe-value"></td> 
                    <td class="safe-severity-container"></td> 
                    <td class="safe-status" style="font-size: 0.75rem; color: var(--os-text-muted);"></td> 
                `;
                tr.querySelector('.safe-name').textContent = ind.name;
                tr.querySelector('.safe-value').textContent = ind.value;
                tr.querySelector('.safe-status').textContent = ind.status;
                
                const sevSpan = document.createElement('span');
                if (i === 0) {
                    if (Number(avgLoad) > 4) { sevSpan.className = 'os-badge os-badge-danger'; sevSpan.textContent = 'Sobrecarga'; }
                    else if (Number(avgLoad) > 2) { sevSpan.className = 'os-badge os-badge-warning'; sevSpan.textContent = 'Moderada'; }
                    else { sevSpan.className = 'os-badge os-badge-success'; sevSpan.textContent = 'Baixa'; }
                } else if (i === 1) {
                    if (iaQueue > 5) { sevSpan.className = 'os-badge os-badge-warning'; sevSpan.textContent = 'Gargalo'; }
                    else { sevSpan.className = 'os-badge os-badge-success'; sevSpan.textContent = 'Sob Controle'; }
                } else if (i === 2) {
                    if (pendingDemands > 10) { sevSpan.className = 'os-badge os-badge-danger'; sevSpan.textContent = 'Alerta'; }
                    else { sevSpan.className = 'os-badge os-badge-success'; sevSpan.textContent = 'OK'; }
                } else if (i === 3) {
                    sevSpan.className = 'os-badge os-badge-info'; sevSpan.textContent = 'Portfólio';
                }
                tr.querySelector('.safe-severity-container').appendChild(sevSpan);
                tableOperationsBody.appendChild(tr);
            });
        }

    } catch (e) {
        console.error('[EXECUTIVE CENTER] Erro ao carregar dados:', e);
    }
}

function formatCurrency(val) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

initPage();
