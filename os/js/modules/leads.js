import { OS_UI, OS_AUTH } from '../os-core.js';
import { SheetsService } from '../../services/sheets-service.js';
import { getSupabase } from '../../services/supabase-client.js';
import { OS_LOGS_ENGINE } from '../../services/logs-engine.js';
import { OS_CONFIG } from '../../config/os-config.js';
import { populateProjectFilter, processEntityAction } from '../utils/ui-helpers.js';

let currentProject = null;
window.loadedLeads = [];

async function initPage() {
    const user = await OS_AUTH.check('OPERATOR');
    if (!user) return;

    OS_UI.renderSidebar('leads', user.role);
    await OS_UI.renderTopbar();

    currentProject = localStorage.getItem('fluxai_current_project_id');
    await populateProjectFilter('project-filter', async (newProj) => { 
        currentProject = newProj; 
        await OS_UI.renderTopbar(); 
        loadLeads(); 
    }, currentProject);

    const btnNew = document.getElementById('btn-new-lead');
    if (btnNew) {
        btnNew.style.display = 'block';
        btnNew.onclick = () => {
            if (!currentProject) {
                alert('Selecione um cliente no topo da página antes de criar um lead.');
                return;
            }
            document.getElementById('modal-new-lead').style.display = 'flex';
        };
    }

    const btnSubmit = document.getElementById('btn-submit-lead');
    if (btnSubmit) {
        btnSubmit.onclick = submitNewLead;
    }

    await loadLeads();
}


async function loadLeads() {
    const container = document.getElementById('leads-table-container');

    if (!currentProject) {
        container.innerHTML = '<div style="padding:40px; text-align:center; color:var(--os-text-muted);">Selecione um cliente/projeto no topo para visualizar os leads.</div>';
        return;
    }

    container.innerHTML = '<div style="opacity: 0.5; padding:20px;">Sincronizando com Google Sheets via Make...</div>';

    try {
        let leads = await SheetsService.fetchLeads();
        
        // Simular banco estendido no mock
        const localLeads = JSON.parse(localStorage.getItem('fluxai_mock_leads_ext') || '[]');
        leads = [...leads, ...localLeads];
        
        // Aplicar filtro de tenant obrigatoriamente
        leads = leads.filter(l => l.project_id === currentProject || (!l.project_id && l.id)); // fallback for generic mocks if needed, but we enforce strict filtering
        
        // Strict filtering:
        leads = leads.filter(l => l.project_id === currentProject);

        // Remover arquivados da view normal
        leads = leads.filter(l => l.status !== 'arquivado');

        window.loadedLeads = leads;

        if (leads.length === 0) {
            container.innerHTML = '<div style="padding:40px; text-align:center; color:var(--os-text-muted);">Nenhum lead encontrado neste projeto.</div>';
            return;
        }

        let html = `<div class="os-table-wrapper">
            <table class="os-table">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Empresa</th>
                    <th>Contato</th>
                    <th>Interesse</th>
                    <th>Origem</th>
                    <th>Status</th>
                    <th style="text-align:right;">Ações</th>
                </tr>
            </thead>
            <tbody id="leads-tbody"></tbody>
            </table></div>`;

        container.innerHTML = html;
        const tbody = document.getElementById('leads-tbody');

        leads.forEach(l => {
            let statusBadge = '';
            if (l.status === 'novo') {
                statusBadge = '<span class="os-badge os-badge-success">Novo</span>';
            } else if (l.status === 'arquivado') {
                statusBadge = '<span class="os-badge" style="background:#333;">Arquivado</span>';
            } else {
                statusBadge = '<span class="os-badge os-badge-warning">Negociação</span>';
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="cell-primary safe-name"></td>
                <td class="safe-company"></td>
                <td class="safe-contact" style="color: var(--os-text-muted);"></td>
                <td><span class="safe-service" style="font-size: 0.65rem; border: 1px solid var(--os-border); padding: 2px 6px; border-radius: 4px;"></span></td>
                <td class="safe-origin"></td>
                <td>${statusBadge}</td>
                <td style="text-align:right;">
                    <button class="btn-advance" title="Avançar Etapa" style="background:transparent; border:none; color:var(--os-success); cursor:pointer; margin-right:8px;"><i class="fa-solid fa-arrow-right"></i></button>
                    <button class="btn-archive" title="Arquivar Lead" style="background:transparent; border:none; color:var(--os-danger); cursor:pointer;"><i class="fa-solid fa-box-archive"></i></button>
                </td>
            `;

            tr.querySelector('.safe-name').textContent = l.name;
            tr.querySelector('.safe-company').textContent = l.company;
            tr.querySelector('.safe-contact').textContent = l.contact;
            tr.querySelector('.safe-service').textContent = l.serviceOfInterest;
            tr.querySelector('.safe-origin').textContent = l.origin;

            tr.querySelector('.btn-advance').onclick = () => window.advanceLeadStatus(l.id);
            tr.querySelector('.btn-archive').onclick = () => window.archiveLead(l.id);

            tbody.appendChild(tr);
        });

    } catch (e) {
        console.error(e);
        container.innerHTML = '<div style="color: var(--os-danger); padding:20px;">Erro ao carregar leads.</div>';
    }
}

async function submitNewLead() {
    const btn = document.getElementById('btn-submit-lead');
    if (btn.disabled) return; // Anti-double-click

    const name = document.getElementById('new-lead-name').value;
    const company = document.getElementById('new-lead-company').value;
    const contact = document.getElementById('new-lead-contact').value;
    const service = document.getElementById('new-lead-service').value;
    const origin = document.getElementById('new-lead-origin').value;

    if (!name || !company) {
        alert('Nome e Empresa são obrigatórios.');
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> CRIANDO...';

    const leadId = 'lead_' + Date.now();
    const newLead = {
        id: leadId,
        project_id: currentProject,
        name,
        company,
        contact,
        serviceOfInterest: service,
        origin,
        status: 'novo',
        created_at: new Date().toISOString()
    };

    const userRole = OS_AUTH.user?.role || 'OPERATOR';

    try {
        // Mock Save since there's no supabase table strictly for leads yet in the front
        const localLeads = JSON.parse(localStorage.getItem('fluxai_mock_leads_ext') || '[]');
        localLeads.push(newLead);
        localStorage.setItem('fluxai_mock_leads_ext', JSON.stringify(localLeads));

        // Enviar Webhook
        const payload = {
            action: 'CREATE_LEAD',
            lead_id: leadId,
            project_id: currentProject,
            lead_data: newLead
        };
        const response = await OS_CONFIG.webhooks.send('CRM_UPDATE', payload);

        OS_LOGS_ENGINE.userAction(
            'CRM_LEAD_CREATED',
            'leads',
            { lead_id: leadId, company },
            userRole,
            currentProject,
            !response.success
        );

        if (!response.success) {
            alert('Lead salvo localmente como rascunho (Falha de sincronização com o Make/CRM central).');
            OS_LOGS_ENGINE.userAction(
                'CRM_UPDATE_FAILED',
                'leads',
                { lead_id: leadId, error: response.error },
                userRole,
                currentProject,
                true
            );
        }

        document.getElementById('modal-new-lead').style.display = 'none';
        
        // Reset form
        document.getElementById('new-lead-name').value = '';
        document.getElementById('new-lead-company').value = '';
        document.getElementById('new-lead-contact').value = '';
        document.getElementById('new-lead-service').value = '';

        loadLeads();

    } catch (e) {
        alert('Erro fatal ao criar lead: ' + e.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'CRIAR LEAD';
    }
}

window.advanceLeadStatus = async (id) => {
    const lead = window.loadedLeads.find(l => l.id === id);
    if (!lead) return;
    if (lead.status === 'negociacao') {
        alert('Lead já está em Negociação. (Próxima etapa: Fechamento via Contratos)');
        return;
    }
    
    await processEntityAction('advance', 'lead', lead, currentProject, 
        `Avançar o lead "${lead.name}" para Negociação?`,
        { action: 'UPDATE_LEAD_STATUS', lead_id: id, project_id: currentProject, old_status: lead.status, new_status: 'negociacao' },
        'fluxai_mock_leads_ext',
        { newStatus: 'negociacao' },
        { failType: 'CRM_UPDATE_FAILED', context: 'leads', failPayload: (err) => ({ action: 'advance_status', lead_id: id, error: err }),
          successType: 'CRM_LEAD_STATUS_UPDATED', successPayload: { lead_id: id, from: lead.status, to: 'negociacao' } },
        loadLeads
    );
};

window.archiveLead = async (id) => {
    const lead = window.loadedLeads.find(l => l.id === id);
    if (!lead) return;
    
    await processEntityAction('archive', 'lead', lead, currentProject, 
        `Tem certeza que deseja ARQUIVAR o lead "${lead.name}"? Ele será ocultado da esteira ativa.`,
        { action: 'ARCHIVE_LEAD', lead_id: id, project_id: currentProject },
        'fluxai_mock_leads_ext',
        { newStatus: 'arquivado' },
        { failType: 'CRM_UPDATE_FAILED', context: 'leads', failPayload: (err) => ({ action: 'archive', lead_id: id, error: err }),
          successType: 'CRM_LEAD_ARCHIVED', successPayload: { lead_id: id, company: lead.company } },
        loadLeads
    );
};

initPage();
