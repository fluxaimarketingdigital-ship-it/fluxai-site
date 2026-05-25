import { OS_UI, OS_AUTH } from '../os-core.js';
import { SheetsService } from '../../services/sheets-service.js';

async function initPage() {
    const user = await OS_AUTH.check('OPERATOR');
    if (!user) return;

    OS_UI.renderSidebar('demandas', user.role);
    await OS_UI.renderTopbar();

    await loadDemands();
}

async function loadDemands() {
    const container = document.getElementById('demands-table-container');
    container.innerHTML = '<div style="opacity: 0.5;">Sincronizando com Google Sheets via Make...</div>';

    try {
        const demands = await SheetsService.fetchDemands();
        if (demands.length === 0) {
            container.innerHTML = '<div style="opacity: 0.5;">Nenhuma demanda encontrada.</div>';
            return;
        }

        let html = `<table>
            <thead>
                <tr>
                    <th>Data</th>
                    <th>ID Demanda</th>
                    <th>Cliente</th>
                    <th>Título</th>
                    <th>Prioridade</th>
                    <th>Status</th>
                    <th>Prazo</th>
                </tr>
            </thead>
            <tbody>`;

        demands.forEach(d => {
            const prioClass = d.priority === 'alta' ? 'alta' : 'media';
            html += `<tr>
                <td style="color: var(--os-text-muted);">${d.date}</td>
                <td style="color: var(--os-text-muted);">${d.id}</td>
                <td style="font-weight: 600; color: #fff;">${d.clientId}</td>
                <td>${d.title}</td>
                <td><span class="badge ${prioClass}">${d.priority}</span></td>
                <td><span class="badge" style="background: rgba(255,255,255,0.1); color: #ccc;">${d.status}</span></td>
                <td>${d.deadline}</td>
            </tr>`;
        });

        html += `</tbody></table>`;
        container.innerHTML = html;
    } catch (e) {
        console.error(e);
        container.innerHTML = '<div style="color: var(--os-danger);">Erro ao carregar demandas.</div>';
    }
}

initPage();
