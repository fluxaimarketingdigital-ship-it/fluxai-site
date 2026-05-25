import { OS_UI, OS_AUTH } from '../os-core.js';
import { SheetsService } from '../../services/sheets-service.js';

async function initPage() {
    const user = await OS_AUTH.check('OPERATOR');
    if (!user) return;

    OS_UI.renderSidebar('leads', user.role);
    await OS_UI.renderTopbar();

    await loadLeads();
}

async function loadLeads() {
    const container = document.getElementById('leads-table-container');
    container.innerHTML = '<div style="opacity: 0.5;">Sincronizando com Google Sheets via Make...</div>';

    try {
        const leads = await SheetsService.fetchLeads();
        if (leads.length === 0) {
            container.innerHTML = '<div style="opacity: 0.5;">Nenhum lead encontrado.</div>';
            return;
        }

        let html = `<table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Empresa</th>
                    <th>Contato</th>
                    <th>Interesse</th>
                    <th>Origem</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>`;

        leads.forEach(l => {
            const statusClass = l.status === 'novo' ? 'novo' : 'em_negociacao';
            html += `<tr>
                <td style="font-weight: 600; color: #fff;">${l.name}</td>
                <td>${l.company}</td>
                <td style="color: var(--os-text-muted);">${l.contact}</td>
                <td><span style="font-size: 0.65rem; border: 1px solid var(--os-border); padding: 2px 6px; border-radius: 4px;">${l.serviceOfInterest}</span></td>
                <td>${l.origin}</td>
                <td><span class="badge ${statusClass}">${l.status}</span></td>
            </tr>`;
        });

        html += `</tbody></table>`;
        container.innerHTML = html;
    } catch (e) {
        console.error(e);
        container.innerHTML = '<div style="color: var(--os-danger);">Erro ao carregar leads.</div>';
    }
}

initPage();
