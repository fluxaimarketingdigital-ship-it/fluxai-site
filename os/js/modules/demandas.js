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
            select.innerHTML = '<option value="">Selecione um Cliente...</option>';
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
        container.innerHTML = '<div style="padding:40px; text-align:center; color:var(--os-text-muted);">Selecione um cliente/projeto no topo para visualizar as demandas.</div>';
        return;
    }

    container.innerHTML = '<div style="opacity: 0.5; padding:20px;">Sincronizando com Google Sheets via Make...</div>';

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
            container.innerHTML = '<div style="padding:40px; text-align:center; color:var(--os-text-muted);">Nenhuma demanda encontrada neste projeto.</div>';
            return;
        }

        let html = `<div class="os-table-wrapper">
            <table class="os-table">
            <thead>
                <tr>
                    <th>Data</th>
                    <th>ID Demanda</th>
                    <th>Título</th>
                    <th>Prioridade</th>
                    <th>Status</th>
                    <th>Prazo</th>
                    <th style="text-align:right;">Ações</th>
                </tr>
            </thead>
            <tbody id="demands-tbody"></tbody>
            </table></div>`;

        container.innerHTML = html;
        const tbody = document.getElementById('demands-tbody');

        demands.forEach(d => {
            let prioBadge = '';
            if (d.priority === 'alta') prioBadge = '<span class="os-badge os-badge-danger">Alta</span>';
            else if (d.priority === 'media') prioBadge = '<span class="os-badge os-badge-warning">Média</span>';
            else prioBadge = '<span class="os-badge os-badge-success">Baixa</span>';

            let statusBadge = `<span class="os-badge os-badge-neutral">${d.status}</span>`;
            if (d.status === 'concluido' || d.status === 'entregue') statusBadge = `<span class="os-badge os-badge-success">${d.status}</span>`;
            else if (d.status === 'em_andamento') statusBadge = `<span class="os-badge os-badge-info">Em Andamento</span>`;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="cell-mono safe-date"></td>
                <td class="cell-mono safe-id"></td>
                <td class="safe-title"></td>
                <td>${prioBadge}</td>
                <td>${statusBadge}</td>
                <td class="safe-deadline"></td>
                <td style="text-align:right;">
                    <button class="btn-advance" title="Avançar Etapa" style="background:transparent; border:none; color:var(--os-success); cursor:pointer; margin-right:8px;"><i class="fa-solid fa-check"></i></button>
                    <button class="btn-archive" title="Arquivar Demanda" style="background:transparent; border:none; color:var(--os-danger); cursor:pointer;"><i class="fa-solid fa-box-archive"></i></button>
                </td>
            `;

            tr.querySelector('.safe-date').textContent = d.date || new Date().toISOString().split('T')[0];
            tr.querySelector('.safe-id').textContent = d.id;
            tr.querySelector('.safe-title').textContent = d.title;
            tr.querySelector('.safe-deadline').textContent = d.deadline || 'A definir';

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
        container.innerHTML = '<div style="color: var(--os-danger); padding:20px;">Erro ao carregar demandas.</div>';
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
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> CRIANDO...';

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
        btn.innerHTML = 'CRIAR DEMANDA';
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
