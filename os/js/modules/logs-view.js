import { OS_UI, OS_AUTH } from '../os-core.js';
import { OS_CONFIG } from '../../config/os-config.js';

let currentFilter = 'ALL';
let logsData = [];

// Logs fictícios iniciais de alta fidelidade para povoar a tela caso a localStorage esteja vazia
const INITIAL_TELEMETRY_MOCKS = [
    {
        timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(), // 3 min atrás
        user_id: 'admin@fluxai.com',
        role: 'ADMIN',
        client_id: 'global',
        action_type: 'AUTH_LOGIN',
        source_page: '/os/login.html',
        payload: { message: "Autenticação via Supabase bem-sucedida", session_ip: "186.220.12.98" },
        status: 'success',
        severity: 'info',
        environment: 'PRODUCTION',
        simulated: false
    },
    {
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 min atrás
        user_id: 'operador_junior@fluxai.com',
        role: 'OPERATOR',
        client_id: 'proj_maria_aparecida',
        action_type: 'AI_GENERATION_APPROVED',
        source_page: '/os/modules/content-engine/content-engine.js',
        payload: { pauta_id: "pt_991823", tema: "5 Benefícios do Marketing Conversacional", ocupacao_limite: "limite operacional contratado" },
        status: 'success',
        severity: 'info',
        environment: 'PRODUCTION',
        simulated: true
    },
    {
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 min atrás
        user_id: 'visitor_hostile_ip',
        role: 'VISITOR',
        client_id: 'global',
        action_type: 'SECURITY_ACCESS_DENIED',
        source_page: '/os/governance.html',
        payload: { reason: "Tentativa de acesso direto à tela de Governança sem perfil de administrador", user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
        status: 'error',
        severity: 'critical',
        environment: 'PRODUCTION',
        simulated: false
    },
    {
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 min atrás
        user_id: 'make_system_cron',
        role: 'SYSTEM',
        client_id: 'proj_maria_aparecida',
        action_type: 'WEBHOOK_TRIGGERED',
        source_page: 'MAKE_SCENARIO_11',
        payload: { webhook_key: "IA_CREDITOS_CONTROLE", data: { client_id: "proj_maria_aparecida", status_ia: "ativo", limite_restante: 12 }, status_code: 200 },
        status: 'success',
        severity: 'info',
        environment: 'PRODUCTION',
        simulated: false
    },
    {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(), // 1.5h atrás
        user_id: 'operador_junior@fluxai.com',
        role: 'OPERATOR',
        client_id: 'proj_maria_aparecida',
        action_type: 'DELIVERY_APPROVED',
        source_page: '/os/js/approval.js',
        payload: { delivery_id: "del_8712", theme: "Arte Instagram - Depoimento Social", approved_by: "CLIENT" },
        status: 'success',
        severity: 'info',
        environment: 'PRODUCTION',
        simulated: true
    },
    {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.2).toISOString(), // 3.2h atrás
        user_id: 'api_gateway',
        role: 'SYSTEM',
        client_id: 'global',
        action_type: 'SYSTEM_ERROR',
        source_page: '/os/services/sheets-adapter.js',
        payload: { error_code: "SHEETS_TIMEOUT", message: "Tempo limite esgotado ao sincronizar abas do Google Sheets. Nova tentativa agendada.", attempt: 3 },
        status: 'error',
        severity: 'warning',
        environment: 'PRODUCTION',
        simulated: false
    },
    {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4h atrás
        user_id: 'operador_junior@fluxai.com',
        role: 'OPERATOR',
        client_id: 'proj_maria_aparecida',
        action_type: 'AI_GENERATION_DELETED',
        source_page: '/os/modules/content-engine/content-engine.js',
        payload: { pauta_id: "pt_991802", status_pre_exclusao: "rascunho", estorno_limite: "não consome limite operacional" },
        status: 'success',
        severity: 'info',
        environment: 'PRODUCTION',
        simulated: true
    },
    {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6h atrás
        user_id: 'make_system_cron',
        role: 'SYSTEM',
        client_id: 'global',
        action_type: 'WEBHOOK_ERROR',
        source_page: 'MAKE_SCENARIO_02',
        payload: { webhook_key: "LEAD_CAPTURE", error: "CORS policies or invalid target URL configuration", target_url: "https://hook.us2.make.com/gmu9xakjqfocdd8nk4sn5lxcc7pmbte2", status_code: 502 },
        status: 'error',
        severity: 'warning',
        environment: 'PRODUCTION',
        simulated: false
    }
];

async function initPage() {
    // Validar se o usuário é ADMIN ou OPERATOR
    const user = await OS_AUTH.check('OPERATOR');
    if (!user) return;

    OS_UI.renderSidebar('logs', user.role);
    await OS_UI.renderTopbar();

    setupEventListeners();
    loadAndRenderLogs();
}

function setupEventListeners() {
    // Tabs de categorias
    document.getElementById('category-tabs').addEventListener('click', (e) => {
        const tab = e.target.closest('.filter-tab');
        if (!tab) return;
        
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        renderLogsTable();
    });

    // Checkboxes de Filtros
    ['chk-real', 'chk-simulado', 'chk-success', 'chk-warning', 'chk-critical'].forEach(id => {
        document.getElementById(id).addEventListener('change', () => {
            renderLogsTable();
        });
    });

    // Campo de busca
    document.getElementById('log-search-input').addEventListener('input', () => {
        renderLogsTable();
    });

    // Botão de Limpeza
    document.getElementById('btn-clear-logs').addEventListener('click', () => {
        if (confirm('Deseja realmente limpar todos os logs locais? Esta ação não afetará o histórico remoto no banco de dados.')) {
            clearLocalLogs();
        }
    });

    // Modal close
    document.getElementById('btn-close-modal').addEventListener('click', closeModal);
    document.getElementById('payload-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('payload-modal')) closeModal();
    });
}

function clearLocalLogs() {
    localStorage.removeItem('fluxai_logs_all');
    localStorage.removeItem('fluxai_logs_user_actions');
    localStorage.removeItem('fluxai_logs_webhooks');
    localStorage.removeItem('fluxai_logs_errors');
    localStorage.removeItem('fluxai_logs_security');
    
    logsData = [];
    renderLogsTable();
}

function loadAndRenderLogs() {
    try {
        let allLogs = JSON.parse(localStorage.getItem('fluxai_logs_all') || '[]');
        
        // Se a localStorage estiver vazia, popular com logs simulados para melhor usabilidade na demonstração
        if (allLogs.length === 0) {
            localStorage.setItem('fluxai_logs_all', JSON.stringify(INITIAL_TELEMETRY_MOCKS));
            
            // Separar em chaves específicas
            const userActions = INITIAL_TELEMETRY_MOCKS.filter(l => !['WEBHOOK_TRIGGERED', 'WEBHOOK_ERROR', 'SYSTEM_ERROR', 'SECURITY_ACCESS_DENIED'].includes(l.action_type));
            const webhooks = INITIAL_TELEMETRY_MOCKS.filter(l => ['WEBHOOK_TRIGGERED', 'WEBHOOK_ERROR'].includes(l.action_type));
            const errors = INITIAL_TELEMETRY_MOCKS.filter(l => l.status === 'error' || l.severity === 'warning' || l.severity === 'critical');
            const security = INITIAL_TELEMETRY_MOCKS.filter(l => l.action_type.startsWith('SECURITY'));
            
            localStorage.setItem('fluxai_logs_user_actions', JSON.stringify(userActions));
            localStorage.setItem('fluxai_logs_webhooks', JSON.stringify(webhooks));
            localStorage.setItem('fluxai_logs_errors', JSON.stringify(errors));
            localStorage.setItem('fluxai_logs_security', JSON.stringify(security));
            
            allLogs = INITIAL_TELEMETRY_MOCKS;
        }

        logsData = allLogs;
        renderLogsTable();
    } catch (e) {
        console.error('[LOGS_VIEW] Erro ao carregar logs locais:', e);
    }
}

function filterLogsByCategory(logs, category) {
    if (category === 'ALL') return logs;
    if (category === 'WEBHOOKS') {
        return logs.filter(l => l.action_type === 'WEBHOOK_TRIGGERED' || l.action_type === 'WEBHOOK_ERROR');
    }
    if (category === 'ERRORS') {
        return logs.filter(l => l.severity === 'warning' || l.severity === 'critical' || l.action_type === 'SYSTEM_ERROR' || l.action_type === 'WEBHOOK_ERROR');
    }
    if (category === 'SECURITY') {
        return logs.filter(l => l.action_type.startsWith('SECURITY'));
    }
    if (category === 'IA') {
        return logs.filter(l => l.action_type.startsWith('AI_'));
    }
    if (category === 'APPROVALS') {
        return logs.filter(l => l.action_type.includes('APPROVED') || l.action_type.includes('REJECTED'));
    }
    if (category === 'AUTOMATIONS') {
        return logs.filter(l => l.action_type === 'WEBHOOK_TRIGGERED' || l.action_type.startsWith('AUTOMATION') || l.source_page.includes('MAKE_SCENARIO'));
    }
    return logs;
}

function renderLogsTable() {
    const tableBody = document.getElementById('logs-table-body');
    const searchVal = document.getElementById('log-search-input').value.toLowerCase().trim();

    // Valores dos checkboxes
    const showReal = document.getElementById('chk-real').checked;
    const showSimulado = document.getElementById('chk-simulado').checked;
    const showSuccess = document.getElementById('chk-success').checked;
    const showWarning = document.getElementById('chk-warning').checked;
    const showCritical = document.getElementById('chk-critical').checked;

    // 1. Atualizar contadores nas tabs
    updateCategoryCounts();

    // 2. Filtrar logs
    let filtered = filterLogsByCategory(logsData, currentFilter);

    // 3. Filtros de checkboxes
    filtered = filtered.filter(l => {
        // Filtro de Real vs Simulado
        if (l.simulated && !showSimulado) return false;
        if (!l.simulated && !showReal) return false;

        // Filtro de Severidade
        const sev = l.severity ? l.severity.toLowerCase() : 'info';
        if (sev === 'info' && !showSuccess) return false;
        if (sev === 'warning' && !showWarning) return false;
        if (sev === 'critical' && !showCritical) return false;

        return true;
    });

    // 4. Filtro de pesquisa textual
    if (searchVal) {
        filtered = filtered.filter(l => {
            const userStr = String(l.user_id || '').toLowerCase();
            const clientStr = String(l.client_id || '').toLowerCase();
            const actionStr = String(l.action_type || '').toLowerCase();
            const sourceStr = String(l.source_page || '').toLowerCase();
            const payloadStr = JSON.stringify(l.payload || {}).toLowerCase();
            const webhookStr = l.payload && l.payload.webhook_key ? String(l.payload.webhook_key).toLowerCase() : '';

            return userStr.includes(searchVal) ||
                   clientStr.includes(searchVal) ||
                   actionStr.includes(searchVal) ||
                   sourceStr.includes(searchVal) ||
                   payloadStr.includes(searchVal) ||
                   webhookStr.includes(searchVal);
        });
    }

    // 5. Renderizar na tabela
    if (filtered.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; color: var(--os-text-muted); padding: 40px 0;">
                    Nenhum log operacional localizado com os filtros ativos.
                </td>
            </tr>`;
        return;
    }

    tableBody.innerHTML = filtered.map((l, index) => {
        const dateStr = formatDate(l.timestamp);
        const webhookKey = l.payload && l.payload.webhook_key ? l.payload.webhook_key : (l.action_type.startsWith('WEBHOOK') ? 'Simulação' : '—');
        
        let sevClass = 'status-success';
        let sevLabel = 'SUCCESS';
        if (l.severity === 'warning') {
            sevClass = 'status-warning';
            sevLabel = 'WARNING';
        } else if (l.severity === 'critical') {
            sevClass = 'status-critical';
            sevLabel = 'CRITICAL';
        }

        const typeClass = l.simulated ? 'pill-simulado' : 'pill-real';
        const typeLabel = l.simulated ? 'SIMULADO' : 'REAL';

        const payloadSummary = l.payload ? JSON.stringify(l.payload) : '—';
        const payloadText = payloadSummary.length > 50 ? payloadSummary.substring(0, 47) + '...' : payloadSummary;

        return `
            <tr>
                <td class="col-time">${dateStr}</td>
                <td class="col-user" title="${l.user_id} (${l.role})">${l.user_id} <span style="font-size:0.6rem; color:var(--os-text-muted);">(${l.role})</span></td>
                <td class="col-client" title="${l.client_id}">${l.client_id}</td>
                <td class="col-action" title="${l.action_type}">${l.action_type}</td>
                <td class="col-webhook" title="${webhookKey}">${webhookKey}</td>
                <td style="text-align: center;"><span class="pill-env ${typeClass}">${typeLabel}</span></td>
                <td style="text-align: center;"><span class="status-badge ${sevClass}">${sevLabel}</span></td>
                <td class="col-source" title="${l.source_page}">${l.source_page.split('/').pop()}</td>
                <td class="col-payload" data-index="${index}" title="Clique para ver o payload completo">${escapeHtml(payloadText)}</td>
            </tr>`;
    }).join('');

    // Listener para abrir o payload
    document.querySelectorAll('.col-payload').forEach(el => {
        el.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index, 10);
            const selectedLog = filtered[index];
            if (selectedLog) {
                openModal(selectedLog);
            }
        });
    });
}

function updateCategoryCounts() {
    document.getElementById('count-all').innerText = logsData.length;
    document.getElementById('count-webhooks').innerText = filterLogsByCategory(logsData, 'WEBHOOKS').length;
    document.getElementById('count-errors').innerText = filterLogsByCategory(logsData, 'ERRORS').length;
    document.getElementById('count-security').innerText = filterLogsByCategory(logsData, 'SECURITY').length;
    document.getElementById('count-ia').innerText = filterLogsByCategory(logsData, 'IA').length;
    document.getElementById('count-approvals').innerText = filterLogsByCategory(logsData, 'APPROVALS').length;
    document.getElementById('count-automations').innerText = filterLogsByCategory(logsData, 'AUTOMATIONS').length;
}

function formatDate(isoStr) {
    if (!isoStr) return '—';
    try {
        const d = new Date(isoStr);
        const pad = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    } catch (e) {
        return isoStr;
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function openModal(log) {
    const modal = document.getElementById('payload-modal');
    const title = document.getElementById('modal-log-title');
    const content = document.getElementById('modal-json-content');

    title.innerText = `Evento: ${log.action_type} (${log.simulated ? 'Simulado' : 'Real'})`;
    content.innerText = JSON.stringify(log, null, 4);
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('payload-modal').style.display = 'none';
}

initPage();
