import { getSupabase } from '../../services/supabase-client.js';
import { OS_CONFIG } from '../../config/os-config.js';
import { OS_LOGS_ENGINE } from '../../services/logs-engine.js';
import { OS_AUTH } from '../os-core.js';

export async function processEntityAction(actionType, entityType, entity, currentProject, confirmMsg, payload, mockStorageKey, statusConfigs, logEvents, loadCallback) {
    if (!confirm(confirmMsg)) return;

    const userRole = OS_AUTH.user?.role || 'OPERATOR';

    try {
        const response = await OS_CONFIG.webhooks.send(entityType === 'lead' ? 'CRM_UPDATE' : 'PORTAL_DEMANDAS', payload);
        if (!response.success) {
            alert('Erro de conexão com o Webhook. Ação abortada para evitar perda de dados.');
            OS_LOGS_ENGINE.userAction(logEvents.failType, logEvents.context, logEvents.failPayload(response.error), userRole, currentProject, true);
            return;
        }

        const localItems = JSON.parse(localStorage.getItem(mockStorageKey) || '[]');
        const idx = localItems.findIndex(i => i.id === entity.id);
        
        const updateObj = { status: statusConfigs.newStatus };
        if (actionType === 'archive') {
            updateObj.archived_at = new Date().toISOString();
            updateObj.archived_by = userRole;
        }

        if (idx >= 0) {
            Object.assign(localItems[idx], updateObj);
            localStorage.setItem(mockStorageKey, JSON.stringify(localItems));
        } else {
            Object.assign(entity, updateObj);
            localItems.push(entity);
            localStorage.setItem(mockStorageKey, JSON.stringify(localItems));
        }

        OS_LOGS_ENGINE.userAction(logEvents.successType, logEvents.context, logEvents.successPayload, userRole, currentProject, false);
        loadCallback();
    } catch (e) {
        alert('Erro ao processar ação: ' + e.message);
    }
}


export async function populateProjectFilter(selectId, onSelectCallback, currentProject) {
    const filter = document.getElementById(selectId);
    if (!filter) return;

    if (currentProject) filter.value = currentProject;
    
    filter.onchange = async (e) => {
        const newProj = e.target.value;
        localStorage.setItem('fluxai_current_project_id', newProj);
        if (onSelectCallback) {
            await onSelectCallback(newProj);
        }
    };

    try {
        const cached = localStorage.getItem('fluxai_supabase_projects');
        let projects = cached ? JSON.parse(cached) : [];
        if (!projects || projects.length === 0) {
            const supabase = getSupabase();
            const { data } = await supabase.from('projects').select('*').eq('status', 'ATIVO');
            projects = data || [];
        }

        filter.textContent = '';
        const optDef = document.createElement('option');
        optDef.value = "";
        optDef.textContent = "Selecione um Cliente...";
        filter.appendChild(optDef);
        
        projects.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.innerText = p.company_name || p.name;
            if (p.id === currentProject) opt.selected = true;
            filter.appendChild(opt);
        });
    } catch (e) {
        console.warn('Erro ao carregar projetos no filtro:', e);
    }
}
