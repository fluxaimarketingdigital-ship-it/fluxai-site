import { OS_UI, OS_AUTH } from '../os-core.js';
import { getSupabase } from '../../services/supabase-client.js';
import { OS_LOGS_ENGINE } from '../../services/logs-engine.js';
import { OS_CONFIG } from '../../config/os-config.js';
import { populateProjectFilter } from '../utils/ui-helpers.js';

let currentProject = null;
window.loadedDemands = [];

async function initPage() {
    const user = await OS_AUTH.check('OPERATOR');
    if (!user) return;

    OS_UI.renderSidebar('demandas', user.role);
    await OS_UI.renderTopbar();

    currentProject = localStorage.getItem('fluxai_current_project_id');
    await populateProjectFilter('project-filter', async (newProj) => { 
        currentProject = newProj; 
        await OS_UI.renderTopbar(); 
        loadDemands(); 
    }, currentProject);

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
    msgSync.textContent = "Sincronizando com Supabase...";
    container.appendChild(msgSync);

    try {
        const supabase = getSupabase();
        if (!supabase) throw new Error("Supabase não configurado.");

        const { data: dbDemands, error } = await supabase
            .from('DEMANDAS_CLIENTES')
            .select('demanda_id, client_id, titulo_demanda, prioridade, prazo, status_demanda, data_criacao')
            .eq('client_id', currentProject)
            .neq('status_demanda', 'arquivado')
            .order('data_criacao', { ascending: false });

        if (error) throw error;

        // Converter para o formato esperado pela UI original para manter layout intacto
        let demands = (dbDemands || []).map(d => ({
            id: d.demanda_id,
            clientId: d.client_id,
            title: d.titulo_demanda || 'Sem título',
            priority: d.prioridade || 'media',
            deadline: d.prazo || 'A definir',
            status: d.status_demanda || 'pendente',
            date: (d.data_criacao || '').split('T')[0] || new Date().toISOString().split('T')[0]
        }));

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

    const randomStr = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).substring(0, 3).toUpperCase();
    const demandId = 'DEMANDA_' + Date.now() + '_' + randomStr;
    const nowISO = new Date().toISOString();
    const userRole = OS_AUTH.user?.role || 'OPERATOR';
    const userName = OS_AUTH.user?.email || 'Operador';
    const clientName = document.querySelector('#project-filter option:checked')?.text || currentProject;

    const newDemandDB = {
        demanda_id: demandId,
        client_id: currentProject,
        client_name: clientName,
        origem_demanda: 'FluxAI OS',
        titulo_demanda: title,
        descricao_demanda: title,
        status_demanda: 'em_andamento',
        prioridade: priority,
        responsavel: userName,
        prazo: deadline,
        data_criacao: nowISO,
        data_atualizacao: nowISO
    };

    try {
        const supabase = getSupabase();
        const { error } = await supabase.from('DEMANDAS_CLIENTES').insert([newDemandDB]);
        
        if (error) throw error;

        // Disparo acessório de notificação pro Make (não trava a execução e não desfaz se falhar)
        const payload = {
            action: 'CREATE_DEMAND',
            demand_id: demandId,
            project_id: currentProject,
            demand_data: newDemandDB
        };
        
        OS_CONFIG.webhooks.send('CRM_UPDATE', payload).catch(err => {
            console.warn("Erro no webhook do Make, mas a demanda foi salva no Supabase:", err);
        });

        OS_LOGS_ENGINE.userAction(
            'DEMAND_CREATED',
            'demandas',
            { demand_id: demandId, title },
            userRole,
            currentProject,
            false
        );

        document.getElementById('modal-new-demand').style.display = 'none';
        document.getElementById('new-demand-title').value = '';
        
        loadDemands();

    } catch (e) {
        alert('Erro fatal ao criar demanda no banco de dados: ' + e.message);
    } finally {
        btn.disabled = false;
        btn.textContent = 'CRIAR DEMANDA';
    }
}

window.advanceDemandStatus = async (id) => {
    const demand = window.loadedDemands.find(d => d.id === id);
    if (!demand) return;
    const seq = ['pendente', 'em_andamento', 'revisao', 'concluido'];
    const cIdx = seq.indexOf(demand.status);
    if (cIdx === -1 || cIdx === seq.length - 1) return;
    const newStatus = seq[cIdx + 1];
    
    if (!confirm(`Avançar a demanda "${demand.title}" de [${demand.status}] para [${newStatus}]?`)) {
        return;
    }

    try {
        const supabase = getSupabase();
        const { error } = await supabase.from('DEMANDAS_CLIENTES')
            .update({ 
                status_demanda: newStatus, 
                data_atualizacao: new Date().toISOString() 
            })
            .eq('demanda_id', id);

        if (error) throw error;

        // Webhook acessório
        OS_CONFIG.webhooks.send('CRM_UPDATE', {
            action: 'UPDATE_DEMAND_STATUS', demand_id: id, project_id: currentProject, old_status: demand.status, new_status: newStatus
        }).catch(console.error);

        OS_LOGS_ENGINE.userAction(
            'PORTAL_DEMANDAS_STATUS_UPDATED',
            'demandas',
            { demand_id: id, from: demand.status, to: newStatus },
            OS_AUTH.user?.role || 'OPERATOR',
            currentProject,
            false
        );

        loadDemands();

    } catch(err) {
        alert(`Falha ao avançar status: ${err.message}`);
        OS_LOGS_ENGINE.userAction(
            'PORTAL_DEMANDAS_UPDATE_FAILED',
            'demandas',
            { action: 'advance_status', demand_id: id, error: err.message },
            OS_AUTH.user?.role || 'OPERATOR',
            currentProject,
            true
        );
    }
};

window.archiveDemand = async (id) => {
    const demand = window.loadedDemands.find(d => d.id === id);
    if (!demand) return;
    
    if (!confirm(`Tem certeza que deseja ARQUIVAR a demanda "${demand.title}"?`)) {
        return;
    }

    try {
        const supabase = getSupabase();
        const { error } = await supabase.from('DEMANDAS_CLIENTES')
            .update({ 
                status_demanda: 'arquivado', 
                data_atualizacao: new Date().toISOString() 
            })
            .eq('demanda_id', id);

        if (error) throw error;

        // Webhook acessório
        OS_CONFIG.webhooks.send('CRM_UPDATE', { action: 'ARCHIVE_DEMAND', demand_id: id, project_id: currentProject }).catch(console.error);

        OS_LOGS_ENGINE.userAction(
            'PORTAL_DEMANDAS_ARCHIVED',
            'demandas',
            { demand_id: id, title: demand.title },
            OS_AUTH.user?.role || 'OPERATOR',
            currentProject,
            false
        );

        loadDemands();

    } catch(err) {
        alert(`Falha ao arquivar demanda: ${err.message}`);
        OS_LOGS_ENGINE.userAction(
            'PORTAL_DEMANDAS_UPDATE_FAILED',
            'demandas',
            { action: 'archive', demand_id: id, error: err.message },
            OS_AUTH.user?.role || 'OPERATOR',
            currentProject,
            true
        );
    }
};

initPage();
