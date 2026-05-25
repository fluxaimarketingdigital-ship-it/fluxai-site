import { OS_UI, OS_AUTH } from '../os-core.js';
import { SheetsService } from '../../services/sheets-service.js';
import { mockCatalogoServicos } from '../../data/catalogo.data.js';

let localClients = [];

async function initPage() {
    const user = await OS_AUTH.check('OPERATOR');
    if (!user) return;

    OS_UI.renderSidebar('clientes', user.role);
    await OS_UI.renderTopbar();
    
    await loadClients();
    setupExtrasModal(localClients);
}

function setupExtrasModal(clients) {
    const clientSelect = document.getElementById('extra-client-id');
    const catalogSelect = document.getElementById('extra-catalog-id');
    
    if (clientSelect) {
        clientSelect.innerHTML = clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }
    
    if (catalogSelect) {
        catalogSelect.innerHTML = mockCatalogoServicos.map(s => `<option value="${s.servico_id}">${s.nome_servico} (Base: R$ ${s.valor_base})</option>`).join('');
        catalogSelect.innerHTML += `<option value="SRV_EXTRA_CUSTOM">Outro Serviço Personalizado</option>`;
    }

    const btnSave = document.getElementById('btn-save-extra');
    if (btnSave) {
        btnSave.addEventListener('click', () => {
            alert('Serviço Extra salvo e registrado para Orçamento/Planejamento GPT.');
            document.getElementById('modal-extra').style.display = 'none';
        });
    }
}

async function loadClients() {
    const container = document.getElementById('clients-table-container');
    container.innerHTML = '<div style="opacity: 0.5;">Sincronizando com Google Sheets via Make...</div>';

    try {
        const clients = await SheetsService.fetchClients();
        localClients = clients;
        
        if (clients.length === 0) {
            container.innerHTML = '<div style="opacity: 0.5;">Nenhum cliente retornado pela API.</div>';
            return;
        }

        let html = `<table>
            <thead>
                <tr>
                    <th>Cliente</th>
                    <th>ID</th>
                    <th>Instagram</th>
                    <th>Token Auth</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>`;

        clients.forEach(c => {
            const statusClass = c.status === 'ativo' ? 'ativo' : 'inativo';
            const tokenClass = c.tokenStatus === 'ok' ? 'ativo' : 'inativo';
            html += `<tr>
                <td style="font-weight: 600; color: #fff;">${c.name}</td>
                <td style="color: var(--os-text-muted);">${c.id}</td>
                <td>${c.instagram}</td>
                <td><span class="badge ${tokenClass}">${c.tokenStatus}</span></td>
                <td><span class="badge ${statusClass}">${c.status}</span></td>
            </tr>`;
        });

        html += `</tbody></table>`;
        container.innerHTML = html;
    } catch (e) {
        console.error(e);
        container.innerHTML = '<div style="color: var(--os-danger);">Erro ao carregar dados dos clientes.</div>';
    }
}

initPage();
