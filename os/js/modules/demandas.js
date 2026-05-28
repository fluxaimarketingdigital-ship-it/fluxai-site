import { OS_UI, OS_AUTH } from '../os-core.js';
import { SheetsService } from '../../services/sheets-service.js';
import { getSupabase } from '../../services/supabase-client.js';
import { OS_LOGS_ENGINE } from '../../services/logs-engine.js';
import { OS_CONFIG } from '../../config/os-config.js';

let currentProject = null;
window.loadedDemands = [];

async function initPage() {
    const user = await OS_AUTH.check('OPERATOR');
    if (!user) return;

    OS_UI.renderSidebar('demandas', user.role);
    await OS_UI.renderTopbar();

    currentProject = localStorage.getItem('fluxai_current_project_id');
    await loadProjects();

    const filter = document.getElementById('project-filter');
    if (filter) {
        if (currentProject) filter.value = currentProject;
        filter.onchange = async (e) => {
            currentProject = e.target.value;
            localStorage.setItem('fluxai_current_project_id', currentProject);
            await OS_UI.renderTopbar();
            loadDemands();
        };
    }

    const btnNew = document.getElementById('btn-new-demand');
    if (btnNew) {
        btnNew.style.display = 'block';
        btnNew.onclick = () => {
            if (!currentProject) {
                alert('Selecione um cliente no topo da página antes de criar uma demanda.');
                return;
            }
            document.getElementById('modal-new-demand').style.display = 'flex';
        };
    }

    const btnSubmit = document.getElementById('btn-submit-demand');
    if (btnSubmit) {
        btnSubmit.onclick = submitNewDemand;
    }

    await loadDemands();
}

async function loadProjects() {
    try {
        const cached = localStorage.getItem('fluxai_supabase_projects');
        let projects = cached ? JSON.parse(cached) : [];
        if (!projects || projects.length === 0) {
            const supabase = getSupabase();
            const { data } = await supabase.from('projects').select('*').eq('status', 'ATIVO');
            projects = data || [];
        }

        const select = document.getElementById('project-filter');
        if (select) {
            select.textContent = '';
            const opt = document.createElement('option');
            opt.value = "";
            opt.textContent = "Selecione um Cliente...";
            select.appendChild(opt);
            projects.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.id;
                opt.innerText = p.company_name || p.name;
                select.appendChild(opt);
            });
        }
    } catch (e) {
        console.warn('Erro ao carregar projetos:', e);
    }
}

async function loadDemands() {
    const container = document.getElementById('demands-table-container');

    if (!currentProject) {
        container.textContent = '';
        const msg = document.createElement('div');
        msg.style.cssText = "padding:40px; text-align:center; color:var(--os-text-muted);";
        msg.textContent = "Selecione um cliente/projeto no topo para visualizar as demandas.";
        container.appendChild(msg);
        return;
    }

    container.textContent = '';
    const msgSync = document.createElement('div');
    msgSync.style.cssText = "opacity: 0.5; padding:20px;";
    msgSync.textContent = "Sincronizando com Google Sheets via Make...";
    container.appendChild(msgSync);

    try {
        let demands = await SheetsService.fetchDemands();
        
        // Simular banco estendido no mock
        const localDemands = JSON.parse(localStorage.getItem('fluxai_mock_demands_ext') || '[]');
        demands = [...demands, ...localDemands];
        
        // Aplicar filtro de tenant obrigatoriamente
        demands = demands.filter(d => d.clientId === currentProject || d.project_id === currentProject || (!d.project_id && d.id)); // fallback for mock
        
        // Strict filtering:
        demands = demands.filter(d => d.clientId === currentProject || d.project_id === currentProject);

        // Remover arquivados
        demands = demands.filter(d => d.status !== 'arquivado');

        window.loadedDemands = demands;

        if (demands.length === 0) {
            container.textContent = '';
            const msgEmpty = document.createElement('div');
            msgEmpty.style.cssText = "padding:40px; text-align:center; color:var(--os-text-muted);";
            msgEmpty.textContent = "Nenhuma demanda encontrada neste projeto.";
            container.appendChild(msgEmpty);
            return;
        }

        container.textContent = '';
        const wrapper = document.createElement('div');
        wrapper.className = "os-table-wrapper";
        const table = document.createElement('table');
        table.className = "os-table";
        const thead = document.createElement('thead');
        const trH = document.createElement('tr');
        const th1 = document.createElement('th'); th1.textContent = "Data";
        const th2 = document.createElement('th'); th2.textContent = "ID Demanda";
        const th3 = document.createElement('th'); th3.textContent = "Título";
        const th4 = document.createElement('th'); th4.textContent = "Prioridade";
        const th5 = document.createElement('th'); th5.textContent = "Status";
        const th6 = document.createElement('th'); th6.textContent = "Prazo";
        const th7 = document.createElement('th'); th7.style.textAlign = "right"; th7.textContent = "Ações";
        trH.appendChild(th1); trH.appendChild(th2); trH.appendChild(th3); trH.appendChild(th4); trH.appendChild(th5); trH.appendChild(th6); trH.appendChild(th7);
        thead.appendChild(trH);
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        tbody.id = "demands-tbody";
        table.appendChild(tbody);
        wrapper.appendChild(table);
        container.appendChild(wrapper);
        const tbody = document.getElementById('demands-tbody');

        demands.forEach(d => {
            const spanPrio = document.createElement('span');
            spanPrio.className = "os-badge";
            if (d.priority === 'alta') { spanPrio.classList.add('os-badge-danger'); spanPrio.textContent = 'Alta'; }
            else if (d.priority === 'media') { spanPrio.classList.add('os-badge-warning'); spanPrio.textContent = 'Média'; }
            else { spanPrio.classList.add('os-badge-success'); spanPrio.textContent = 'Baixa'; }

            const spanStatus = document.createElement('span');
            spanStatus.className = "os-badge";
            if (d.status === 'concluido' || d.status === 'entregue') { spanStatus.classList.add('os-badge-success'); spanStatus.textContent = d.status; }
            else if (d.status === 'em_andamento') { spanStatus.classList.add('os-badge-info'); spanStatus.textContent = 'Em Andamento'; }
            else { spanStatus.classList.add('os-badge-neutral'); spanStatus.textContent = d.status; }

            const tr = document.createElement('tr');
            const td1 = document.createElement('td');
            td1.className = "cell-mono safe-date";
            td1.textContent = d.date || new Date().toISOString().split('T')[0];

            const td2 = document.createElement('td');
            td2.className = "cell-mono safe-id";
            td2.textContent = d.id;

            const td3 = document.createElement('td');
            td3.className = "safe-title";
            td3.textContent = d.title;

            const td4 = document.createElement('td');
            td4.appendChild(spanPrio);

            const td5 = document.createElement('td');
            td5.appendChild(spanStatus);

            const td6 = document.createElement('td');
            td6.className = "safe-deadline";
            td6.textContent = d.deadline || 'A definir';

            const td7 = document.createElement('td');
            td7.style.textAlign = "right";
            
            const btnAdv = document.createElement('button');
            btnAdv.className = "btn-advance";
            btnAdv.title = "Avançar Etapa";
            btnAdv.style.cssText = "background:transparent; border:none; color:var(--os-success); cursor:pointer; margin-right:8px;";
            const iAdv = document.createElement('i');
            iAdv.className = "fa-solid fa-check";
            btnAdv.appendChild(iAdv);

            const btnArch = document.createElement('button');
            btnArch.className = "btn-archive";
            btnArch.title = "Arquivar Demanda";
            btnArch.style.cssText = "background:transparent; border:none; color:var(--os-danger); cursor:pointer;";
            const iArch = document.createElement('i');
            iArch.className = "fa-solid fa-box-archive";
            btnArch.appendChild(iArch);

            td7.appendChild(btnAdv);
            td7.appendChild(btnArch);

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);
            tr.appendChild(td6);
            tr.appendChild(td7);

            if (d.status === 'concluido' || d.status === 'entregue') {
                tr.querySelector('.btn-advance').style.display = 'none';
            } else {
                tr.querySelector('.btn-advance').onclick = () => window.advanceDemandStatus(d.id);
            }
            
            tr.querySelector('.btn-archive').onclick = () => window.archiveDemand(d.id);

            tbody.appendChild(tr);
        });

    } catch (e) {
        console.error(e);
        container.textContent = '';
        const msgErr = document.createElement('div');
        msgErr.style.cssText = "color: var(--os-danger); padding:20px;";
        msgErr.textContent = "Erro ao carregar demandas.";
        container.appendChild(msgErr);
    }
}

async function submitNewDemand() {
    const btn = document.getElementById('btn-submit-demand');
    if (btn.disabled) return;

    const title = document.getElementById('new-demand-title').value;
    const priority = document.getElementById('new-demand-priority').value;
    const deadline = document.getElementById('new-demand-deadline').value;

    if (!title) {
        alert('O título da demanda é obrigatório.');
        return;
    }

    btn.disabled = true;
    btn.textContent = '';
    const icn = document.createElement('i');
    icn.className = "fa-solid fa-spinner fa-spin";
    btn.appendChild(icn);
    btn.appendChild(document.createTextNode(" CRIANDO..."));

    const demandId = 'dem_' + Date.now();
    const newDemand = {
        id: demandId,
        project_id: currentProject,
        clientId: currentProject,
        title,
        priority,
        deadline,
        status: 'em_andamento',
        date: new Date().toISOString().split('T')[0]
    };

    const userRole = OS_AUTH.user?.role || 'OPERATOR';

    try {
        const localDemands = JSON.parse(localStorage.getItem('fluxai_mock_demands_ext') || '[]');
        localDemands.push(newDemand);
        localStorage.setItem('fluxai_mock_demands_ext', JSON.stringify(localDemands));

        const payload = {
            action: 'CREATE_DEMAND',
            demand_id: demandId,
            project_id: currentProject,
            demand_data: newDemand
        };
        const response = await OS_CONFIG.webhooks.send('CRM_UPDATE', payload);

        OS_LOGS_ENGINE.userAction(
            'DEMAND_CREATED',
            'demandas',
            { demand_id: demandId, title },
            userRole,
            currentProject,
            !response.success
        );

        if (!response.success) {
            alert('Demanda salva localmente como rascunho (Falha de sincronização com o Make).');
            OS_LOGS_ENGINE.userAction(
                'DEMAND_UPDATE_FAILED',
                'demandas',
                { demand_id: demandId, error: response.error },
                userRole,
                currentProject,
                true
            );
        }

        document.getElementById('modal-new-demand').style.display = 'none';
        document.getElementById('new-demand-title').value = '';
        
        loadDemands();

    } catch (e) {
        alert('Erro fatal ao criar demanda: ' + e.message);
    } finally {
        btn.disabled = false;
        btn.textContent = 'CRIAR DEMANDA';
    }
}

window.advanceDemandStatus = async (id) => {
    const demand = window.loadedDemands.find(d => d.id === id);
    if (!demand) return;

    if (!confirm(`Concluir a demanda "${demand.title}"?`)) return;

    const userRole = OS_AUTH.user?.role || 'OPERATOR';
    const oldStatus = demand.status;
    const newStatus = 'concluido';

    try {
        const payload = {
            action: 'UPDATE_DEMAND_STATUS',
            demand_id: id,
            project_id: currentProject,
            old_status: oldStatus,
            new_status: newStatus
        };
        
        const response = await OS_CONFIG.webhooks.send('CRM_UPDATE', payload);
        if (!response.success) {
            alert('Erro de conexão com o Webhook. Transição abortada para evitar inconsistência.');
            OS_LOGS_ENGINE.userAction(
                'DEMAND_UPDATE_FAILED',
                'demandas',
                { action: 'advance_status', demand_id: id, error: response.error },
                userRole,
                currentProject,
                true
            );
            return;
        }

        const localDemands = JSON.parse(localStorage.getItem('fluxai_mock_demands_ext') || '[]');
        const idx = localDemands.findIndex(d => d.id === id);
        if (idx >= 0) {
            localDemands[idx].status = newStatus;
            localStorage.setItem('fluxai_mock_demands_ext', JSON.stringify(localDemands));
        } else {
            demand.status = newStatus;
            localDemands.push(demand);
            localStorage.setItem('fluxai_mock_demands_ext', JSON.stringify(localDemands));
        }

        OS_LOGS_ENGINE.userAction(
            'DEMAND_STATUS_UPDATED',
            'demandas',
            { demand_id: id, from: oldStatus, to: newStatus },
            userRole,
            currentProject,
            false
        );

        loadDemands();

    } catch (e) {
        alert('Erro ao avançar demanda: ' + e.message);
    }
};

window.archiveDemand = async (id) => {
    const demand = window.loadedDemands.find(d => d.id === id);
    if (!demand) return;

    if (!confirm(`Tem certeza que deseja ARQUIVAR a demanda "${demand.title}"?`)) return;

    const userRole = OS_AUTH.user?.role || 'OPERATOR';

    try {
        const payload = {
            action: 'ARCHIVE_DEMAND',
            demand_id: id,
            project_id: currentProject
        };
        
        const response = await OS_CONFIG.webhooks.send('CRM_UPDATE', payload);
        if (!response.success) {
            alert('Erro de conexão com o Webhook. Arquivamento abortado.');
            OS_LOGS_ENGINE.userAction(
                'DEMAND_UPDATE_FAILED',
                'demandas',
                { action: 'archive', demand_id: id, error: response.error },
                userRole,
                currentProject,
                true
            );
            return;
        }

        const localDemands = JSON.parse(localStorage.getItem('fluxai_mock_demands_ext') || '[]');
        const idx = localDemands.findIndex(d => d.id === id);
        if (idx >= 0) {
            localDemands[idx].status = 'arquivado';
            localDemands[idx].archived_at = new Date().toISOString();
            localDemands[idx].archived_by = userRole;
            localStorage.setItem('fluxai_mock_demands_ext', JSON.stringify(localDemands));
        } else {
            demand.status = 'arquivado';
            demand.archived_at = new Date().toISOString();
            demand.archived_by = userRole;
            localDemands.push(demand);
            localStorage.setItem('fluxai_mock_demands_ext', JSON.stringify(localDemands));
        }

        OS_LOGS_ENGINE.userAction(
            'DEMAND_ARCHIVED',
            'demandas',
            { demand_id: id, title: demand.title },
            userRole,
            currentProject,
            false
        );

        loadDemands();

    } catch (e) {
        alert('Erro ao arquivar demanda: ' + e.message);
    }
};

initPage();
