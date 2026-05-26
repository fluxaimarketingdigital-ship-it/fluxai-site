import { OS_UI, OS_AUTH } from '../os-core.js';
import { SheetsService } from '../../services/sheets-service.js';
import { OS_CONFIG } from '../../config/os-config.js';
import { OS_LOGS_ENGINE } from '../../services/logs-engine.js';
import { StatusEngine } from '../../config/status-system.js';

let activeClientId = null;
let currentClientData = null;
let iaBlocked = false;
let automationsPaused = false;
let currentUser = null;

// Mock de detalhes adicionais de clientes para povoar o cockpit operacional
const CLIENT_COCKPIT_MOCKS = {
    'FLUXAI_LABS_001': {
        name: 'FluxAI Labs',
        segment: 'Tecnologia & IA',
        startDate: '2025-01-01',
        status: 'ativo',
        contractType: 'Recorrente Mensal (Master Config)',
        services: ['Gestão de Mídia Social', 'Camada GPT Autônoma', 'Criação de Landing Pages', 'Design de Criativos'],
        extras: ['Upgrade Motor de Conteúdo (Aprovado)', 'Consultoria Avançada de IA (Aprovado)'],
        scope: '3 publicações semanais (Reels/Carrossel), monitoramento diário de performance em Meta Ads, geração automatizada de relatórios executivos no D1 de cada ciclo e sincronização do Drive.',
        iaMetrics: { limit: 20, approved: 12, review: 3, published: 9 },
        metrics: [
            { channel: 'Instagram', key: 'Seguidores', val: '12.4K', change: '+8.2%', alert: 'Estável' },
            { channel: 'Meta Ads', key: 'ROAS Global', val: '4.8x', change: '+12.5%', alert: 'Excelente performance comercial' },
            { channel: 'Google Analytics 4', key: 'Visitas Únicas', val: '42K', change: '+18.1%', alert: 'Crescimento de tráfego orgânico' }
        ],
        integrations: [
            { name: 'Instagram Graph API', status: 'Conectado', token: 'ativo', manual: false, alert: 'Próxima renovação em 45 dias' },
            { name: 'Meta Ads Manager API', status: 'Conectado', token: 'ativo', manual: false, alert: 'Sem pendências de faturamento' },
            { name: 'Google Analytics 4 API', status: 'Conectado', token: 'ativo', manual: false, alert: 'Sincronização OK' },
            { name: 'Google Tag Manager', status: 'Instalado', token: 'ativo', manual: false, alert: 'Tags ativas e disparando' },
            { name: 'Microsoft Clarity', status: 'Conectado', token: 'ativo', manual: false, alert: 'Dados aquecidos' },
            { name: 'Google Search Console', status: 'Conectado', token: 'ativo', manual: false, alert: 'Varredura OK' },
            { name: 'Google Drive API', status: 'Conectado', token: 'ativo', manual: false, alert: 'Sincronização de arquivos ativa' }
        ],
        folders: {
            root: 'https://drive.google.com/drive/folders/labs_root_id',
            brand: 'https://drive.google.com/drive/folders/labs_brand_id',
            contracts: 'https://drive.google.com/drive/folders/labs_contracts_id',
            assets: 'https://drive.google.com/drive/folders/labs_assets_id'
        }
    },
    'CLI_002': {
        name: 'Empresa Alpha',
        segment: 'Indústria High-Ticket',
        startDate: '2025-03-15',
        status: 'ativo',
        contractType: 'Mensal Corporativo (Alpha Plus)',
        services: ['Gestão de Mídia Social', 'Produção Audiovisual', 'Tráfego Pago Meta Ads'],
        extras: ['Gravação Estúdio (Aprovado)'],
        scope: '2 publicações semanais focadas em branding B2B, gestão ativa de contatos comerciais no CRM e campanhas focadas em atração de leads qualificados.',
        iaMetrics: { limit: 10, approved: 4, review: 1, published: 3 },
        metrics: [
            { channel: 'Instagram', key: 'Seguidores', val: '4.2K', change: '+3.5%', alert: 'Engajamento abaixo da média' },
            { channel: 'Meta Ads', key: 'Custo por Lead', val: 'R$ 14,20', change: '-5.2%', alert: 'CAC dentro do esperado' },
            { channel: 'Google Analytics 4', key: 'Tempo de Sessão', val: '2m15s', change: '+0.8%', alert: 'Estável' }
        ],
        integrations: [
            { name: 'Instagram Graph API', status: 'Conectado', token: 'ativo', manual: false, alert: 'OK' },
            { name: 'Meta Ads Manager API', status: 'Conectado', token: 'ativo', manual: false, alert: 'OK' },
            { name: 'Google Analytics 4 API', status: 'Conectado', token: 'ativo', manual: false, alert: 'OK' },
            { name: 'Google Drive API', status: 'Conectado', token: 'ativo', manual: false, alert: 'Sincronização OK' }
        ],
        folders: {
            root: 'https://drive.google.com/drive/folders/alpha_root_id',
            brand: 'https://drive.google.com/drive/folders/alpha_brand_id',
            contracts: 'https://drive.google.com/drive/folders/alpha_contracts_id',
            assets: 'https://drive.google.com/drive/folders/alpha_assets_id'
        }
    },
    'CLI_003': {
        name: 'Consultoria Beta',
        segment: 'Finanças & Gestão',
        startDate: '2025-05-10',
        status: 'inativo',
        contractType: 'Avulso Estratégico',
        services: ['Criação de DNA da Marca', 'Desenvolvimento de Prompts'],
        extras: [],
        scope: 'Onboarding estratégico e documentação estruturada do ecossistema de conteúdo.',
        iaMetrics: { limit: 0, approved: 0, review: 0, published: 0 },
        metrics: [
            { channel: 'Instagram', key: 'Seguidores', val: '1.8K', change: '0.0%', alert: 'Inativo' }
        ],
        integrations: [
            { name: 'Instagram Graph API', status: 'Não Configurado', token: 'ausente', manual: true, alert: 'Token expirado' }
        ],
        folders: {
            root: '#',
            brand: '#',
            contracts: '#',
            assets: '#'
        }
    }
};

function getClientConfigs() {
    let configs = localStorage.getItem('fluxai_client_configs');
    if (!configs) {
        const defaults = {
            'FLUXAI_LABS_001': { status: 'ativo', iaBlocked: false, automationsPaused: false, iaLimit: 20, extras: [] },
            'CLI_002': { status: 'ativo', iaBlocked: false, automationsPaused: false, iaLimit: 10, extras: [] },
            'CLI_003': { status: 'inativo', iaBlocked: true, automationsPaused: true, iaLimit: 0, extras: [] }
        };
        localStorage.setItem('fluxai_client_configs', JSON.stringify(defaults));
        return defaults;
    }
    return JSON.parse(configs);
}

function saveClientConfigs(configs) {
    localStorage.setItem('fluxai_client_configs', JSON.stringify(configs));
}

async function initPage() {
    const user = await OS_AUTH.check('OPERATOR');
    if (!user) return;
    currentUser = user;

    OS_UI.renderSidebar('clientes', user.role);
    await OS_UI.renderTopbar();

    // Obter cliente da URL
    const urlParams = new URLSearchParams(window.location.search);
    activeClientId = urlParams.get('client_id') || 'FLUXAI_LABS_001';

    await loadClientData();
    setupEventListeners();
}

async function loadClientData() {
    // Buscar detalhes do cliente
    let client = CLIENT_COCKPIT_MOCKS[activeClientId];
    if (!client) {
        // Fallback para labs se ID não bater
        activeClientId = 'FLUXAI_LABS_001';
        client = CLIENT_COCKPIT_MOCKS[activeClientId];
    }
    
    // Carregar configurações reais persistentes em localStorage
    const configs = getClientConfigs();
    if (configs[activeClientId]) {
        client.status = configs[activeClientId].status;
        client.iaMetrics.limit = configs[activeClientId].iaLimit;
        iaBlocked = configs[activeClientId].iaBlocked;
        automationsPaused = configs[activeClientId].automationsPaused;
        
        // Merge extras if defined in configs!
        if (configs[activeClientId].extras) {
            const mergedExtras = [...(CLIENT_COCKPIT_MOCKS[activeClientId].extras || [])];
            configs[activeClientId].extras.forEach(extra => {
                if (!mergedExtras.includes(extra)) {
                    mergedExtras.push(extra);
                }
            });
            client.extras = mergedExtras;
        }
    } else {
        // Inicializar configurações padrão para este ID se não estiver listado
        configs[activeClientId] = {
            status: client.status,
            iaBlocked: false,
            automationsPaused: false,
            iaLimit: client.iaMetrics.limit,
            extras: []
        };
        saveClientConfigs(configs);
        iaBlocked = false;
        automationsPaused = false;
    }

    currentClientData = client;

    // Atualizar UI Geral
    document.getElementById('client-name-title').innerText = `Cockpit: ${client.name}`;
    document.getElementById('info-client-name').innerText = client.name;
    document.getElementById('info-segment').innerText = client.segment;
    document.getElementById('info-start-date').innerText = client.startDate;
    document.getElementById('info-contract-type').innerText = client.contractType;

    // Renderizar status
    const badgeStatus = document.getElementById('badge-operational-status');
    badgeStatus.innerText = client.status.toUpperCase();
    badgeStatus.className = `badge-status ${client.status === 'ativo' ? 'success' : (client.status === 'pausado' ? 'warning' : 'danger')}`;

    // Renderizar Integrações
    renderIntegrationsList();

    // Renderizar Serviços
    document.getElementById('contract-services-list').innerHTML = client.services.map(s => `<span class="tag-badge">${s}</span>`).join('');
    document.getElementById('contract-extras-list').innerHTML = client.extras.length > 0 
        ? client.extras.map(e => `<span class="tag-badge" style="background:rgba(59,130,246,0.1); border-color:rgba(59,130,246,0.3); color:#60a5fa;">${e}</span>`).join('')
        : '<span style="color:var(--os-text-muted);">Nenhum serviço extra ativo</span>';
    document.getElementById('contract-scope-text').innerText = client.scope;

    // Renderizar IA Metrics
    updateIAMetricsDisplay();

    // Renderizar Produção (Mesa Editorial)
    renderProductionList();

    // Renderizar KPIs
    renderMetricsList();

    // Links de Arquivos (configurados de forma resiliente)
    setupDriveLink('drive-root-link', client.folders.root, 'Pasta Raiz do Cliente');
    setupDriveLink('drive-brand-link', client.folders.brand, 'Identidade Visual');
    setupDriveLink('drive-contracts-link', client.folders.contracts, 'Contratos & Propostas');
    setupDriveLink('drive-assets-link', client.folders.assets, 'Assets e Referências');

    // Renderizar Logs específicos do cliente
    renderClientLogs();
}

function setupDriveLink(elementId, url, defaultLabel) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    const span = el.querySelector('span');
    const iconExternal = el.querySelector('.fa-arrow-up-right-from-square');
    
    if (!url || url === '#' || url === '') {
        el.removeAttribute('href');
        el.style.opacity = '0.4';
        el.style.pointerEvents = 'none';
        el.style.cursor = 'not-allowed';
        if (span) span.innerText = `${defaultLabel} (Não Configurado)`;
        if (iconExternal) iconExternal.style.display = 'none';
    } else {
        el.href = url;
        el.style.opacity = '1';
        el.style.pointerEvents = 'auto';
        el.style.cursor = 'pointer';
        if (span) span.innerText = defaultLabel;
        if (iconExternal) iconExternal.style.display = 'inline-block';
    }
}

function renderIntegrationsList() {
    const listContainer = document.getElementById('integrations-list');
    if (!listContainer || !currentClientData) return;

    if (!currentClientData.integrations || currentClientData.integrations.length === 0) {
        listContainer.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; color: var(--os-text-muted); padding: 20px 0;">
                    Nenhuma integração mapeada no escopo contratual.
                </td>
            </tr>`;
        return;
    }

    listContainer.innerHTML = currentClientData.integrations.map((int, idx) => {
        // Mapeamento semântico do status de conexão
        let connClass = 'neutral';
        let connLabel = int.status.toUpperCase();
        
        if (int.manual) {
            connClass = 'warning';
            connLabel = 'MANUAL (API SUSPENSA)';
        } else if (int.status.toLowerCase().includes('conect') || int.status.toLowerCase() === 'ativo' || int.status.toLowerCase() === 'instalado') {
            connClass = 'success';
            connLabel = 'API ATIVA';
        } else if (int.status.toLowerCase().includes('aguard')) {
            connClass = 'warning';
            connLabel = 'AGUARDANDO AUTORIZAÇÃO';
        } else if (int.status.toLowerCase().includes('ausente') || int.status.toLowerCase().includes('não config')) {
            connClass = 'neutral';
            connLabel = 'NÃO CONFIGURADO';
        } else if (int.status.toLowerCase().includes('expir')) {
            connClass = 'danger';
            connLabel = 'TOKEN EXPIRADO';
        }

        // Mapeamento do Token
        let tokenClass = 'neutral';
        if (int.token === 'ativo') {
            tokenClass = 'success';
        } else if (int.token === 'ausente' || int.token === 'inativo') {
            tokenClass = 'neutral';
        } else if (int.token === 'expirado') {
            tokenClass = 'danger';
        }

        return `
            <tr>
                <td class="int-name" style="padding-top:12px;"><i class="fa-solid ${getIconForChannel(int.name)}"></i> ${int.name}</td>
                <td style="padding-top:12px;"><span class="badge-status ${connClass}" style="font-size:0.55rem; letter-spacing:0.5px;">${connLabel}</span></td>
                <td style="padding-top:12px;"><span class="badge-status ${tokenClass}" style="font-size:0.55rem; letter-spacing:0.5px;">TOKEN: ${int.token.toUpperCase()}</span></td>
                <td style="text-align: right; padding-top:12px;">
                    <button class="switch-manual ${int.manual ? 'active' : ''}" onclick="window.toggleManualMode(${idx})">
                        ${int.manual ? 'MANUAL' : 'API'}
                    </button>
                </td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.02);">
                <td colspan="4" style="font-size: 0.65rem; color: var(--os-text-muted); padding-top: 2px; padding-bottom: 12px; font-weight:400;">
                    <i class="fa-solid fa-circle-info" style="margin-right: 4px; font-size:0.6rem; opacity:0.7;"></i> ${int.alert}
                </td>
            </tr>`;
    }).join('');
}

function getIconForChannel(name) {
    const n = name.toLowerCase();
    if (n.includes('instagram')) return 'fa-brands fa-instagram';
    if (n.includes('meta')) return 'fa-brands fa-meta';
    if (n.includes('analytics') || n.includes('tag')) return 'fa-brands fa-google';
    if (n.includes('clarity')) return 'fa-solid fa-chart-line';
    if (n.includes('search')) return 'fa-solid fa-magnifying-glass';
    if (n.includes('drive')) return 'fa-brands fa-google-drive';
    return 'fa-solid fa-link';
}

window.toggleManualMode = (idx) => {
    if (!currentClientData) return;
    currentClientData.integrations[idx].manual = !currentClientData.integrations[idx].manual;
    renderIntegrationsList();
    
    // Log da ação
    const intName = currentClientData.integrations[idx].name;
    const isManual = currentClientData.integrations[idx].manual;
    OS_LOGS_ENGINE.userAction(
        'SECURITY_PERMISSIONS_CHANGED',
        'cliente-detalhe',
        { integration: intName, mode: isManual ? 'manual' : 'api_integration' },
        currentUser ? currentUser.role : 'CLIENT',
        activeClientId,
        !OS_CONFIG.flags.sendRealWebhooks
    );
};

function updateIAMetricsDisplay() {
    if (!currentClientData) return;
    document.getElementById('ia-limit-total').innerText = currentClientData.iaMetrics.limit;
    document.getElementById('ia-limit-approved').innerText = currentClientData.iaMetrics.approved;
    document.getElementById('ia-limit-review').innerText = currentClientData.iaMetrics.review;
    document.getElementById('ia-limit-published').innerText = currentClientData.iaMetrics.published;

    const badgeIa = document.getElementById('badge-ia-active');
    if (iaBlocked) {
        badgeIa.innerText = 'BLOQUEADO';
        badgeIa.className = 'badge-status danger';
        document.getElementById('btn-toggle-ia').innerHTML = '<i class="fa-solid fa-circle-play"></i> Desbloquear IA';
    } else {
        badgeIa.innerText = 'ATIVO';
        badgeIa.className = 'badge-status success';
        document.getElementById('btn-toggle-ia').innerHTML = '<i class="fa-solid fa-ban"></i> Bloquear IA';
    }
}

function renderProductionList() {
    // Lista mockada de conteúdos na Mesa Editorial desse cliente
    const prodMocks = [
        { title: "Pauta #1019 - Estratégia de Conteúdo Orgânico", type: "Carrossel", status: "Em Revisão", color: "#3b82f6" },
        { title: "Pauta #1020 - Storytelling e Retenção", type: "Reels", status: "Aprovado", color: "#f59e0b" },
        { title: "Pauta #1021 - Análise Prática de Escala", type: "Carrossel", status: "Publicado", color: "#8e9e68" }
    ];

    const prodContainer = document.getElementById('production-list');
    if (!prodContainer) return;

    prodContainer.innerHTML = prodMocks.map(p => `
        <div class="prod-item">
            <span style="font-weight: 500; color: #fff;">${p.title} <span style="font-size:0.6rem; color:var(--os-text-muted);">(${p.type})</span></span>
            <span class="prod-status" style="background:${p.color}15; color:${p.color}; border: 1px solid ${p.color}40;">${p.status}</span>
        </div>
    `).join('');

    const badgeAuto = document.getElementById('badge-automation-status');
    if (automationsPaused) {
        badgeAuto.innerText = 'AUTOMAÇÕES: PAUSADAS';
        badgeAuto.className = 'badge-status danger';
        document.getElementById('btn-toggle-automations').innerHTML = '<i class="fa-solid fa-play"></i> Reativar Automações';
    } else {
        badgeAuto.innerText = 'AUTOMAÇÕES: OK';
        badgeAuto.className = 'badge-status success';
        document.getElementById('btn-toggle-automations').innerHTML = '<i class="fa-solid fa-pause"></i> Pausar Automações';
    }
}

function renderMetricsList() {
    const container = document.getElementById('metrics-list');
    if (!container || !currentClientData) return;

    if (!currentClientData.metrics || currentClientData.metrics.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: var(--os-text-muted); padding: 25px 0;">
                    <div style="font-size: 0.8rem; font-weight: 600; margin-bottom: 4px; color: #888;">
                        <i class="fa-solid fa-chart-line-slash" style="margin-right: 6px;"></i> Nenhuma Métrica Coletada
                    </div>
                    <div style="font-size: 0.65rem; color: #555;">
                        Canais de GA4 / Meta Ads desconectados ou sem integração de dados ativa neste ciclo.
                    </div>
                </td>
            </tr>`;
        return;
    }

    container.innerHTML = currentClientData.metrics.map(m => {
        const isTrendUp = m.change.startsWith('+');
        const trendColor = isTrendUp ? 'var(--os-success)' : 'var(--os-danger)';
        return `
            <tr>
                <td style="font-weight: 600; color: #fff;">${m.channel}</td>
                <td>${m.key}</td>
                <td style="font-family: var(--os-font-mono);">${m.val}</td>
                <td style="font-family: var(--os-font-mono); color: ${trendColor};">${m.change}</td>
                <td style="color: var(--os-text-muted); font-size: 0.7rem;">${m.alert}</td>
            </tr>`;
    }).join('');
}

function renderClientLogs() {
    const container = document.getElementById('client-logs-body');
    if (!container) return;

    try {
        const allLogs = JSON.parse(localStorage.getItem('fluxai_logs_all') || '[]');
        // Filtrar logs associados a este cliente
        const filtered = allLogs.filter(l => l.client_id === activeClientId || l.client_id === 'global');

        if (filtered.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: var(--os-text-muted); padding: 15px 0;">
                        Nenhum evento registrado para este cliente nas últimas 24 horas.
                    </td>
                </tr>`;
            return;
        }

        container.innerHTML = filtered.slice(0, 10).map(l => {
            const date = new Date(l.timestamp).toLocaleTimeString('pt-BR');
            const statusClass = l.status === 'success' ? 'success' : 'danger';
            
            const payloadSummary = l.payload ? JSON.stringify(l.payload) : '{}';
            const payloadText = payloadSummary.length > 50 ? payloadSummary.substring(0, 47) + '...' : payloadSummary;
            
            return `
                <tr>
                    <td>${date}</td>
                    <td>${l.user_id}</td>
                    <td><span style="color: var(--os-primary);">${l.action_type}</span></td>
                    <td style="text-align: center;"><span class="badge-status" style="border: 1px solid rgba(255,255,255,0.05); font-size:0.55rem;">${l.simulated ? 'SIMULADO' : 'REAL'}</span></td>
                    <td style="text-align: center;"><span class="badge-status ${statusClass}">${l.status}</span></td>
                    <td style="color: var(--os-text-muted); text-overflow:ellipsis; overflow:hidden;" title='${payloadSummary}'>${payloadText}</td>
                </tr>`;
        }).join('');
    } catch (e) {
        container.innerHTML = '<tr><td colspan="6">Erro ao renderizar logs do cliente.</td></tr>';
    }
}

function setupEventListeners() {
    // IA - Bloquear / Desbloquear IA
    document.getElementById('btn-toggle-ia').addEventListener('click', () => {
        iaBlocked = !iaBlocked;
        
        // Salvar localmente
        const configs = getClientConfigs();
        configs[activeClientId].iaBlocked = iaBlocked;
        saveClientConfigs(configs);
        
        updateIAMetricsDisplay();
        
        // Registrar Log
        OS_LOGS_ENGINE.security(
            'SECURITY_PERMISSIONS_CHANGED',
            { action: iaBlocked ? 'bloqueio_ia' : 'desbloqueio_ia', client: activeClientId },
            'critical'
        );
        alert(iaBlocked ? 'Serviços de IA suspensos para o cliente.' : 'Acesso à Camada GPT restabelecido.');
        renderClientLogs();
    });

    // IA - Liberar limite operacional manual
    document.getElementById('btn-adjust-limit').addEventListener('click', () => {
        document.getElementById('input-new-limit').value = currentClientData.iaMetrics.limit;
        document.getElementById('limit-modal').style.display = 'flex';
    });

    // IA - Salvar novo limite
    document.getElementById('btn-save-new-limit').addEventListener('click', () => {
        const val = parseInt(document.getElementById('input-new-limit').value, 10);
        if (isNaN(val) || val < 0) {
            alert('Por favor, informe um limite válido!');
            return;
        }

        const oldLimit = currentClientData.iaMetrics.limit;
        currentClientData.iaMetrics.limit = val;
        
        // Salvar localmente
        const configs = getClientConfigs();
        configs[activeClientId].iaLimit = val;
        saveClientConfigs(configs);
        
        updateIAMetricsDisplay();
        document.getElementById('limit-modal').style.display = 'none';

        // Registrar Log
        OS_LOGS_ENGINE.userAction(
            'SECURITY_PERMISSIONS_CHANGED',
            'cliente-detalhe',
            { action: 'ajuste_manual_limite_ia', anterior: oldLimit, novo: val },
            currentUser ? currentUser.role : 'CLIENT',
            activeClientId,
            !OS_CONFIG.flags.sendRealWebhooks
        );
        alert(`Limite operacional contratado atualizado de ${oldLimit} para ${val} com sucesso!`);
        renderClientLogs();
    });

    // PRODUÇÃO - Pausar / Reativar automações
    document.getElementById('btn-toggle-automations').addEventListener('click', () => {
        automationsPaused = !automationsPaused;
        
        // Salvar localmente
        const configs = getClientConfigs();
        configs[activeClientId].automationsPaused = automationsPaused;
        saveClientConfigs(configs);

        renderProductionList();

        OS_LOGS_ENGINE.userAction(
            'STATUS_CHANGED',
            'cliente-detalhe',
            { automations_state: automationsPaused ? 'paused' : 'running' },
            currentUser ? currentUser.role : 'CLIENT',
            activeClientId,
            !OS_CONFIG.flags.sendRealWebhooks
        );
        alert(automationsPaused ? 'Automações e Webhooks pausados para este cliente.' : 'Fluxo operacional de automações reativado.');
        renderClientLogs();
    });

    // PRODUÇÃO - Aprovar relatório mensal
    document.getElementById('btn-approve-report').addEventListener('click', () => {
        OS_LOGS_ENGINE.userAction(
            'DELIVERY_APPROVED',
            'cliente-detalhe',
            { document_type: 'REPORT', month: 'Corrente', details: 'Aprovado pelo operador' },
            currentUser ? currentUser.role : 'CLIENT',
            activeClientId,
            !OS_CONFIG.flags.sendRealWebhooks
        );
        alert('Relatório mensal aprovado internamente!');
        renderClientLogs();
    });

    // PRODUÇÃO - Devolver relatório mensal para revisão
    document.getElementById('btn-return-report').addEventListener('click', () => {
        OS_LOGS_ENGINE.userAction(
            'STATUS_CHANGED',
            'cliente-detalhe',
            { document_type: 'REPORT', transition: 'devolver_para_revisao' },
            currentUser ? currentUser.role : 'CLIENT',
            activeClientId,
            !OS_CONFIG.flags.sendRealWebhooks
        );
        alert('Relatório mensal devolvido para revisão e ajustes.');
        renderClientLogs();
    });

    // GOVERNANÇA - Ativar Cliente
    document.getElementById('btn-gov-active').addEventListener('click', () => {
        updateClientStatus('ativo');
    });

    // GOVERNANÇA - Pausar Cliente
    document.getElementById('btn-gov-pause').addEventListener('click', () => {
        updateClientStatus('pausado');
    });

    // GOVERNANÇA - Desativar Cliente
    document.getElementById('btn-gov-deactivate').addEventListener('click', () => {
        updateClientStatus('inativo');
    });

    // GOVERNANÇA - Arquivar Cliente
    document.getElementById('btn-gov-archive').addEventListener('click', () => {
        if (confirm('Deseja realmente arquivar este cliente? A operação ficará suspensa e congelada de forma definitiva.')) {
            updateClientStatus('inativo', 'arquivamento_operacional');
        }
    });
}

function updateClientStatus(newStatus, detail = 'alteracao_status') {
    if (!currentClientData) return;
    const oldStatus = currentClientData.status;
    const role = currentUser ? currentUser.role : 'CLIENT';

    // Validação transicional via STATUS_SYSTEM
    const validation = StatusEngine.validateTransition('clientes', oldStatus, newStatus, role);
    if (!validation.valid) {
        alert(`Erro de Governança: Transição proibida de '${oldStatus.toUpperCase()}' para '${newStatus.toUpperCase()}' para o perfil '${role}'.\nMotivo: ${validation.reason}`);
        
        // Log de SECURITY_WARNING
        OS_LOGS_ENGINE.security(
            'SECURITY_WARNING',
            { 
                action: 'tentativa_negada_mudanca_status', 
                client_id: activeClientId, 
                role: role, 
                status_atual: oldStatus, 
                status_solicitado: newStatus, 
                reason: validation.reason,
                origem_acao: 'cliente-detalhe',
                timestamp: new Date().toISOString()
            },
            'critical'
        );
        renderClientLogs();
        return;
    }

    currentClientData.status = newStatus;
    
    // Salvar localmente
    const configs = getClientConfigs();
    configs[activeClientId].status = newStatus;
    saveClientConfigs(configs);

    // Atualizar UI
    const badgeStatus = document.getElementById('badge-operational-status');
    badgeStatus.innerText = newStatus.toUpperCase();
    badgeStatus.className = `badge-status ${newStatus === 'ativo' ? 'success' : (newStatus === 'pausado' ? 'warning' : 'danger')}`;

    // Registrar no Log
    OS_LOGS_ENGINE.userAction(
        'STATUS_CHANGED',
        'cliente-detalhe',
        { 
            entity: 'CLIENT', 
            action: detail, 
            status_anterior: oldStatus, 
            status_novo: newStatus,
            role: role,
            status_atual: oldStatus,
            status_solicitado: newStatus,
            status_tentativa: 'valida',
            origem_acao: 'cliente-detalhe',
            timestamp: new Date().toISOString()
        },
        role,
        activeClientId,
        !OS_CONFIG.flags.sendRealWebhooks
    );
    alert(`Status do cliente atualizado de ${oldStatus.toUpperCase()} para ${newStatus.toUpperCase()} com sucesso!`);
    renderClientLogs();
}

initPage();
