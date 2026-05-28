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

        let html = `<div class="os-table-wrapper">
            <table class="os-table">
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
            let prioBadge = '';
            if (d.priority === 'alta') {
                prioBadge = '<span class="os-badge os-badge-danger">Alta</span>';
            } else if (d.priority === 'media') {
                prioBadge = '<span class="os-badge os-badge-warning">Média</span>';
            } else {
                prioBadge = '<span class="os-badge os-badge-success">Baixa</span>';
            }

            let statusBadge = `<span class="os-badge os-badge-neutral">${d.status}</span>`;
            if (d.status === 'concluido' || d.status === 'entregue') {
                statusBadge = `<span class="os-badge os-badge-success">${d.status}</span>`;
            } else if (d.status === 'em_andamento') {
                statusBadge = `<span class="os-badge os-badge-info">${d.status}</span>`;
            }

            html += `<tr>
                <td class="cell-mono">${window.escapeHTML(d.date)}</td>
                <td class="cell-mono">${window.escapeHTML(d.id)}</td>
                <td class="cell-primary">${window.escapeHTML(d.clientId)}</td>
                <td>${window.escapeHTML(d.title)}</td>
                <td>${prioBadge}</td>
                <td>${statusBadge}</td>
                <td>${window.escapeHTML(d.deadline)}</td>
            </tr>`;
        });

        html += `</tbody></table></div>`;
        container.innerHTML = html;
    } catch (e) {
        console.error(e);
        container.innerHTML = '<div style="color: var(--os-danger);">Erro ao carregar demandas.</div>';
    }
}

initPage();
