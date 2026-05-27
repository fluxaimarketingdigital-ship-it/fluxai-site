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

        const activeClientsCount = activeContracts.length;
        const lateCount = overduePayments.length;
        const mockFinancialStats = { mrr_total: mrr };

        // 3. Renderizar KPIs Executivos
        const kpiGrid = document.getElementById('executive-kpi-grid');
            const kpi1 = document.createElement('div');
            kpi1.className = 'kpi-card';
            const t1 = document.createElement('div');
            t1.className = 'kpi-title';
            t1.textContent = 'Receita Mensal Recorrente (MRR Estimado)';
            const v1 = document.createElement('div');
            v1.className = 'kpi-value';
            v1.style.color = 'var(--os-success)';
            v1.textContent = 'R$ ' + (mockFinancialStats.mrr_total).toLocaleString('pt-BR', {minimumFractionDigits:2});
            const s1 = document.createElement('div');
            s1.className = 'kpi-subtitle';
            s1.textContent = 'Com base em contratos ativos no OS';
            kpi1.appendChild(t1);
            kpi1.appendChild(v1);
            kpi1.appendChild(s1);

            const kpi2 = document.createElement('div');
            kpi2.className = 'kpi-card';
            const t2 = document.createElement('div');
            t2.className = 'kpi-title';
            t2.textContent = 'Contratos Ativos';
            const v2 = document.createElement('div');
            v2.className = 'kpi-value';
            v2.textContent = activeClientsCount + ' ';
            const spanV2 = document.createElement('span');
            spanV2.style.cssText = 'font-size:0.9rem; color:var(--os-text-muted); font-weight:normal;';
            spanV2.textContent = '/ ' + mockProjects.length + ' Total';
            v2.appendChild(spanV2);
            const s2 = document.createElement('div');
            s2.className = 'kpi-subtitle';
            s2.textContent = 'Saúde de Retenção: ' + (activeClientsCount > 0 ? ((activeClientsCount/mockProjects.length)*100).toFixed(0) : 0) + '%';
            kpi2.appendChild(t2);
            kpi2.appendChild(v2);
            kpi2.appendChild(s2);

            const kpi3 = document.createElement('div');
            kpi3.className = 'kpi-card';
            const t3 = document.createElement('div');
            t3.className = 'kpi-title';
            t3.textContent = 'Atrasos Financeiros CRÍTICOS';
            const v3 = document.createElement('div');
            v3.className = 'kpi-value';
            v3.style.color = lateCount > 0 ? 'var(--os-danger)' : 'var(--os-success)';
            v3.textContent = lateCount + ' Ocorrência(s)';
            const s3 = document.createElement('div');
            s3.className = 'kpi-subtitle';
            s3.textContent = lateCount > 0 ? 'Requer Ação de Bloqueio Imediata' : 'Fluxo Saudável';
            kpi3.appendChild(t3);
            kpi3.appendChild(v3);
            kpi3.appendChild(s3);

            const kpi4 = document.createElement('div');
            kpi4.className = 'kpi-card';
            const t4 = document.createElement('div');
            t4.className = 'kpi-title';
            t4.textContent = 'Projeção de Novos Leads';
            const v4 = document.createElement('div');
            v4.className = 'kpi-value';
            v4.style.color = 'var(--os-primary)';
            v4.textContent = localLeads.filter(l => l.status === 'proposta_enviada').length + ' Propostas';
            const s4 = document.createElement('div');
            s4.className = 'kpi-subtitle';
            s4.textContent = 'Aguardando Fechamento';
            kpi4.appendChild(t4);
            kpi4.appendChild(v4);
            kpi4.appendChild(s4);

            kpiGrid.appendChild(kpi1);
            kpiGrid.appendChild(kpi2);
            kpiGrid.appendChild(kpi3);
            kpiGrid.appendChild(kpi4);

        // 4. Renderizar Tabela 1: Saúde Financeira por Cliente
        const tableFinanceBody = document.querySelector('#table-exec-finance tbody');
        if (tableFinanceBody) {
            tableFinanceBody.replaceChildren();
            const activeProjects = mockProjects.filter(p => true); // Ajuste se necessário

            if (activeProjects.length === 0) {
                const tr = document.createElement('tr');
                const td = document.createElement('td');
td.colSpan = 6;
td.style.cssText = 'text-align:center; padding:20px; opacity:0.5;';
td.textContent = 'Nenhum dado financeiro para os clientes ativos.';
tr.appendChild(td);
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
                    
                    const td1 = document.createElement('td');
                    td1.className = 'cell-mono';
                    td1.textContent = (contract?.id || proj.id).toUpperCase();
                    tr.appendChild(td1);

                    const td2 = document.createElement('td');
                    td2.className = 'cell-primary';
                    td2.textContent = proj.company_name;
                    tr.appendChild(td2);

                    const td3 = document.createElement('td');
                    td3.style.fontSize = '0.75rem';
                    td3.textContent = contract?.deliverables || 'N/A';
                    tr.appendChild(td3);

                    const td4 = document.createElement('td');
                    td4.textContent = new Date().toLocaleDateString('pt-BR');
                    tr.appendChild(td4);

                    const td5 = document.createElement('td');
                    const aDrive = document.createElement('a');
                    aDrive.target = '_blank';
                    aDrive.className = 'os-btn os-btn-sm';
                    aDrive.style.cssText = 'padding: 2px 8px; font-size: 0.65rem; background: rgba(255,255,255,0.03); border: 1px solid var(--os-border);';
                    aDrive.href = proj.drive_folder_id ? `https://drive.google.com/drive/folders/${proj.drive_folder_id}` : '#';
                    const iFolder = document.createElement('i');
                    iFolder.className = 'fa-solid fa-folder-open';
                    aDrive.appendChild(iFolder);
                    aDrive.appendChild(document.createTextNode(' Drive'));
                    td5.appendChild(aDrive);
                    tr.appendChild(td5);

                    const td6 = document.createElement('td');
                    td6.className = 'safe-status';
                    tr.appendChild(td6); 

                    const statusSpan = document.createElement('span');
                    const cStatus = contract?.status || 'PAUSADO';
                    if (cStatus === 'PAUSADO') {
                        statusSpan.className = 'os-badge os-badge-warning';
                        statusSpan.textContent = 'Pausado';
                    } else if (cStatus === 'CANCELADO') {
                        statusSpan.className = 'os-badge os-badge-danger';
                        statusSpan.textContent = 'Cancelado';
                    } else {
                        statusSpan.className = 'os-badge os-badge-success';
                        statusSpan.textContent = 'Ativo';
                    }
                    tr.querySelector('.safe-status').appendChild(statusSpan);
                    tableFinanceBody.appendChild(tr);
                });
            }
        }

        // 6. Renderizar Tabela 3: Pipeline de Leads e CRM Comercial
        const tableCommercialBody = document.querySelector('#table-exec-commercial tbody');
        if (tableCommercialBody) {
            tableCommercialBody.replaceChildren();
            if (localLeads.length === 0) {
                const tr = document.createElement('tr');
                const td = document.createElement('td');
td.colSpan = 5;
td.style.cssText = 'text-align:center; padding:20px; opacity:0.5;';
td.textContent = 'Nenhum lead em negociação.';
tr.appendChild(td);
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
                    
                    const td1 = document.createElement('td');
                    td1.className = 'cell-primary';
                    const divNome = document.createElement('div');
                    divNome.textContent = l.nome_lead;
                    const divEmpresa = document.createElement('div');
                    divEmpresa.style.cssText = 'font-size: 0.7rem; color: var(--os-text-muted);';
                    divEmpresa.textContent = `${l.empresa} - ${l.contato}`;
                    td1.appendChild(divNome);
                    td1.appendChild(divEmpresa);
                    tr.appendChild(td1);

                    const td2 = document.createElement('td');
                    td2.textContent = l.origem;
                    tr.appendChild(td2);

                    const td3 = document.createElement('td');
                    const spanServ = document.createElement('span');
                    spanServ.style.cssText = 'font-size: 0.7rem; border: 1px solid var(--os-border); padding: 2px 6px; border-radius: 4px;';
                    spanServ.textContent = l.servico_interesse;
                    td3.appendChild(spanServ);
                    tr.appendChild(td3);

                    const td4 = document.createElement('td');
                    td4.textContent = l.responsavel;
                    tr.appendChild(td4);

                    const td5 = document.createElement('td');
                    td5.appendChild(statusSpan);
                    tr.appendChild(td5);

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
                const td1 = document.createElement('td');
                td1.className = 'cell-primary';
                td1.textContent = ind.name;
                tr.appendChild(td1);

                const td2 = document.createElement('td');
                td2.textContent = ind.value;
                tr.appendChild(td2);
                 
                const sevSpan = document.createElement('span'); 
                if (i === 0) { 
                    if (Number(avgLoad) > 4) { sevSpan.className = 'os-badge os-badge-danger'; sevSpan.textContent = 'Sobrecarga'; } 
                    else if (Number(avgLoad) > 2) { sevSpan.className = 'os-badge os-badge-warning'; sevSpan.textContent = 'Moderada'; } 
                    else { sevSpan.className = 'os-badge os-badge-success'; sevSpan.textContent = 'Tranquila'; } 
                } else if (i === 1) { 
                    if (iaQueue > 5) { sevSpan.className = 'os-badge os-badge-danger'; sevSpan.textContent = 'Atrasada'; } 
                    else if (iaQueue > 0) { sevSpan.className = 'os-badge os-badge-warning'; sevSpan.textContent = 'Em Fila'; } 
                    else { sevSpan.className = 'os-badge os-badge-success'; sevSpan.textContent = 'Livre'; } 
                } else if (i === 2) { 
                    if (pendingDemands > 10) { sevSpan.className = 'os-badge os-badge-danger'; sevSpan.textContent = 'Crtica'; } 
                    else if (pendingDemands > 0) { sevSpan.className = 'os-badge os-badge-warning'; sevSpan.textContent = 'Ativa'; } 
                    else { sevSpan.className = 'os-badge os-badge-success'; sevSpan.textContent = 'Resolvida'; } 
                } else { 
                    sevSpan.className = 'os-badge os-badge-info'; sevSpan.textContent = 'Verificado'; 
                } 
                
                const td3 = document.createElement('td');
                td3.appendChild(sevSpan);
                tr.appendChild(td3);

                const td4 = document.createElement('td');
                td4.style.cssText = 'font-size: 0.75rem; color: var(--os-text-muted);';
                td4.textContent = ind.status;
                tr.appendChild(td4);
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
