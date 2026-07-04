import { OS_UI, OS_AUTH } from '../os-core.js';
import { useMakeRoute } from '../../services/useMakeRoute.js';
import { SheetsService } from '../../services/sheets-service.js';
import { OS_CONFIG } from '../../config/os-config.js';
import { OS_LOGS_ENGINE } from '../../services/logs-engine.js';
import { StatusEngine } from '../../config/status-system.js';
import { getSupabase } from '../../services/supabase-client.js';

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
    let rawClientId = urlParams.get('client_id') || 'FLUXAI_LABS_001';
    
    // Mitigação de Prototype Pollution: Bloquear chaves perigosas
    if (rawClientId === '__proto__' || rawClientId === 'constructor' || rawClientId === 'prototype') {
        rawClientId = 'FLUXAI_LABS_001';
    }
    activeClientId = rawClientId;

    await loadClientData();
    setupEventListeners();
}

async function loadClientData() {
    const supabase = getSupabase();
    
    // ── GUARDA DE SESSÃO + CLIENTE AUTENTICADO ──────────────────────────────
    // O singleton CDN não propaga setSession nos headers REST retroativamente.
    // Solução: criar um cliente descartável com o Bearer token injetado como
    // global header, garantindo que TODAS as queries operacionais saiam autenticadas.
    let authedClient = supabase; // fallback para o singleton caso não haja sessão
    
    if (supabase) {
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const session = sessionData?.session;
            const hasSession = !!session;
            const hasToken  = !!session?.access_token;

            console.log('[Cockpit-DIAG] Sessão:', { hasSession, hasAccessToken: hasToken, email: session?.user?.email || null, activeClientId });

            if (!hasSession || !hasToken) {
                console.error('[Cockpit] Sessão expirada ou inválida.');
                const container = document.getElementById('client-detail-content');
                if (container) container.innerHTML = '<div style="padding:40px;text-align:center;color:var(--os-danger);font-size:1.1rem;"><i class="fa-solid fa-lock"></i> Sessão expirada. <a href="../os/login" style="color:var(--os-primary);">Faça login novamente.</a></div>';
                return;
            }

            // Criar cliente descartável com o token Bearer injetado diretamente
            // Isso garante que o header Authorization está presente em TODAS as queries
            if (window.supabase && window.supabase.createClient) {
                authedClient = window.supabase.createClient(
                    'https://mufgwetfhfhhmhowbhjj.supabase.co',
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11Zmd3ZXRmaGZoaG1ob3diaGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1Mzg1MDYsImV4cCI6MjA5NDExNDUwNn0.G0VxvE6acPRKZIwee7d2ARBkIdqf9SRvVI1uagMrBZI',
                    {
                        global: {
                            headers: { Authorization: `Bearer ${session.access_token}` }
                        },
                        auth: { persistSession: false }
                    }
                );
                console.log('[Cockpit-DIAG] Cliente autenticado criado com Bearer token injetado.');
            }
        } catch(e) {
            console.error('[Cockpit] Erro ao criar cliente autenticado:', e);
        }
    }
    // ────────────────────────────────────────────────────────────────────────

    let client = {
        name: activeClientId,
        segment: 'Dado pendente de sincronização',
        startDate: 'Dado pendente de sincronização',
        status: 'ativo',
        contractType: 'Dado pendente de sincronização',
        services: [],
        extras: [],
        scope: 'Dado pendente de sincronização',
        iaMetrics: { limit: 'Pendente', approved: 0, review: 0, published: 0 },
        metrics: [],
        integrations: [],
        folders: { root: '#', brand: '#', contracts: '#', assets: '#' },
        responsible: 'Dado pendente de sincronização',
        planejamento: []
    };

    if (authedClient) {
        let contratos = null;

        let estrategia = null;
        let creditos = null;

        try {
            const { data } = await authedClient.from('CONTRATOS_CLIENTES').select('*').eq('client_id', activeClientId).limit(1);
            if (data && data.length > 0) contratos = data[0];
            console.log('[Cockpit-DIAG] CONTRATOS_CLIENTES fetching:', data);
        } catch(e) { console.warn('[COCKPIT] Erro em CONTRATOS_CLIENTES', e); }

        try {
            const { data } = await authedClient.from('CLIENTES_ESTRATEGIA').select('*').eq('client_id', activeClientId).limit(1);
            if (data && data.length > 0) estrategia = data[0];
            console.log('[Cockpit-DIAG] CLIENTES_ESTRATEGIA fetching:', data);
        } catch(e) { console.warn('[COCKPIT] Erro em CLIENTES_ESTRATEGIA', e); }

        let tagsHTML = '';

        if (estrategia) {
            client.name = estrategia.cliente_nome || activeClientId;
            const segmentMap = {
                'SAUDE': 'Saúde / Médicos / Especializados',
                'DIREITO': 'Advocacia / Jurídico de Elite',
                'FINANCAS': 'Finanças / Wealth Advisors',
                'TECNOLOGIA': 'Tecnologia / B2B / SaaS',
                'CONSULTORIA': 'Consultoria Corporativa',
                'ESTETICA': 'Estética / Clínicas Premium',
                'OUTRO': 'Outro Segmento High-Ticket'
            };
            const rawSeg = estrategia.segmento || 'Dado pendente de sincronização';
            client.segment = segmentMap[rawSeg] || rawSeg;
            const scopeMap = {
                'AUTHORITY': 'Posicionamento de Autoridade Absoluta',
                'LEADS': 'Geração de Leads Qualificados (Inbound)',
                'ACQUISITION': 'Aquisição Direta & High-Ticket',
                'REBRANDING': 'Reposicionamento / Rebranding Digital'
            };
            const rawScope = estrategia.objetivo_principal || 'Dado pendente de sincronização';
            client.scope = scopeMap[rawScope] || rawScope;
            
            // Build Tags from fallback fields if they exist
            if (estrategia.nivel_percepcao_premium === 'alto' || estrategia.nivel_percepcao_premium === 'premium') {
                tagsHTML += '<span class="tag-badge">High-Ticket</span>';
            }
        }

        if (contratos) {
            client.startDate = contratos.data_inicio || contratos.data_criacao || 'Dado pendente de sincronização';
            client.contractType = contratos.escopo_contratado || 'Dado pendente de sincronização'; // fallback text for 'Contrato Ativo'
            client.responsible = contratos.responsavel_comercial || (estrategia ? estrategia.responsavel_fluxai : null) || 'Dado pendente de sincronização';
            if (contratos.status_contrato) client.status = contratos.status_contrato;
            
            // TIPO DE OPERACAO: Infer based on escopo or use tipo_contrato if it exists
            if (contratos.tipo_contrato) {
                client.operationType = contratos.tipo_contrato.toUpperCase();
            } else if ((contratos.escopo_contratado || '').includes('trafego') && (contratos.escopo_contratado || '').includes('conteudo')) {
                client.operationType = 'OPERAÇÃO INTEGRAL';
            } else {
                client.operationType = 'OPERAÇÃO CUSTOMIZADA';
            }

            // SERVICOS ATIVOS: Split from escopo_contratado (comma separated string)
            if (contratos.escopo_contratado) {
                client.services = contratos.escopo_contratado.split(',').map(s => s.trim().toUpperCase()).filter(s => s);
            }

            if ((contratos.escopo_contratado || '').includes('trafego')) {
                tagsHTML += '<span class="tag-badge">Meta Ads Scale</span>';
            }
        } else {
            client.responsible = (estrategia ? estrategia.responsavel_fluxai : null) || 'Dado pendente de sincronização';
        }
        
        client.tagsHTML = tagsHTML;

        console.log(`[Cockpit-DIAG] activeClientId = ${activeClientId}`);

        console.log('[Cockpit] carregando limites IA');
        try {
            const today = new Date();
            const currentMesReferencia = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
            
            const { data } = await authedClient.from('IA_CREDITOS_CLIENTE').select('*').eq('client_id', activeClientId).eq('mes_referencia', currentMesReferencia).eq('status_limite', 'ativo');
            creditos = data;
            console.log(`[Cockpit-DIAG] IA_CREDITOS_CLIENTE: qtd=${data?.length || 0} para ${currentMesReferencia}`, data && data.length > 0 ? data[0] : null);
        } catch(e) { console.error('[COCKPIT] Erro em IA_CREDITOS_CLIENTE', e); }

        console.log('[Cockpit] carregando planejamento de conteudo');
        try {
            const { data: pautas } = await authedClient.from('PLANEJAMENTO_CONTEUDO').select('*').eq('client_id', activeClientId).order('data_prevista', { ascending: true });
            if (pautas) {
                client.planejamento = pautas;
                console.log(`[Cockpit-DIAG] PLANEJAMENTO_CONTEUDO fetching:`, pautas);
            }
        } catch(e) { console.warn('[COCKPIT] Erro em PLANEJAMENTO_CONTEUDO', e); }

        if (creditos && creditos.length > 0) {
            let sumLimit = 0;
            let sumOcup = 0;
            let sumDisp = 0;
            let sumPub = 0;
            creditos.forEach(c => {
                sumLimit += Number(c.limite_operacional_mensal) || 0;
                sumOcup += Number(c.limite_ocupado) || 0;
                sumDisp += Number(c.limite_disponivel_operacional) || 0;
                sumPub += Number(c.limite_published) || 0;
            });
            client.iaMetrics.limit = sumLimit;
            client.iaMetrics.approved = sumOcup; 
            client.iaMetrics.review = sumDisp; 
            client.iaMetrics.published = sumPub;

            if (sumLimit > 0) {
                client.tagsHTML += '<span class="tag-badge">Camada GPT Ativa</span>';
            }
        }
        
        if (!client.tagsHTML) {
            client.tagsHTML = '<span style="color:var(--os-text-muted); font-size: 0.65rem;">Sem tags dinâmicas ativas</span>';
        }

        try {
            console.log('[Cockpit] carregando serviços extras');
            const { data: servicosExtras } = await authedClient.from('SERVICOS_EXTRAS_CLIENTES').select('*').eq('client_id', activeClientId);
            console.log(`[Cockpit-DIAG] SERVICOS_EXTRAS_CLIENTES: qtd=${servicosExtras?.length || 0}`, servicosExtras && servicosExtras.length > 0 ? servicosExtras[0] : null);
            renderServicosExtras(servicosExtras);
            if (servicosExtras && servicosExtras.length > 0) {
                client.extras = servicosExtras.map(s => s.nome_servico);
            }
        } catch(e) { 
            console.error('[COCKPIT] Erro em SERVICOS_EXTRAS_CLIENTES', e);
            renderServicosExtras(null); 
        }

        try {
            console.log('[Cockpit] carregando financeiro');
            if (currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'OPERATOR')) {
                const financeiroWidget = document.getElementById('widget-financeiro');
                if (financeiroWidget) financeiroWidget.style.display = 'block';
                const { data: financeiro } = await authedClient.from('FINANCEIRO_CLIENTES').select('*').eq('client_id', activeClientId);
                console.log(`[Cockpit-DIAG] FINANCEIRO_CLIENTES: qtd=${financeiro?.length || 0}`, financeiro && financeiro.length > 0 ? financeiro[0] : null);
                renderFinanceiro(financeiro);
            }
        } catch(e) { 
            console.error('[COCKPIT] Erro em FINANCEIRO_CLIENTES', e);
            renderFinanceiro(null); 
        }

        try {
            console.log('[Cockpit] carregando demandas');
            const { data: demandas } = await authedClient.from('DEMANDAS_CLIENTES').select('*').eq('client_id', activeClientId);
            console.log(`[Cockpit-DIAG] DEMANDAS_CLIENTES: qtd=${demandas?.length || 0}`, demandas && demandas.length > 0 ? demandas[0] : null);
            renderDemandas(demandas);
        } catch(e) { 
            console.error('[COCKPIT] Erro em DEMANDAS_CLIENTES', e);
            renderDemandas(null); 
        }

        try {
            console.log('[Cockpit] carregando comunicações');
            const { data: comunicacoes } = await authedClient.from('COMUNICACOES_CLIENTE').select('*').eq('client_id', activeClientId);
            console.log(`[Cockpit-DIAG] COMUNICACOES_CLIENTE: qtd=${comunicacoes?.length || 0}`, comunicacoes && comunicacoes.length > 0 ? comunicacoes[0] : null);
            renderComunicacoes(comunicacoes, currentUser?.role);
        } catch(e) { 
            console.error('[COCKPIT] Erro em COMUNICACOES_CLIENTE', e);
            renderComunicacoes(null); 
        }

        console.log('[Cockpit] dados extras carregados com sucesso');
        client.integrations = [];
        client.metrics = []; 
    }

    if (activeClientId !== 'FLUXAI_LABS_001' && Object.prototype.hasOwnProperty.call(CLIENT_COCKPIT_MOCKS, activeClientId)) {
        client = CLIENT_COCKPIT_MOCKS[activeClientId];
    }
    
    currentClientData = client;
    
    document.getElementById('client-name-title').innerText = `Cockpit: ${client.name}`;
    document.getElementById('info-client-name').innerText = client.name;
    document.getElementById('info-segment').innerText = client.segment;
    document.getElementById('info-start-date').innerText = client.startDate;
    document.getElementById('info-contract-type').innerText = client.contractType;
    document.getElementById('info-operation-type').innerText = client.operationType || '—';
    document.getElementById('info-tags').innerHTML = client.tagsHTML || '<span style="color:var(--os-text-muted); font-size: 0.65rem;">Dado pendente de sincronização</span>';
    
    const respEl = document.getElementById('info-responsible');
    if (respEl) respEl.innerText = client.responsible || 'Dado pendente de sincronização';

    const badgeStatus = document.getElementById('badge-operational-status');
    badgeStatus.innerText = client.status.toUpperCase();
    badgeStatus.className = `badge-status ${client.status === 'ativo' ? 'success' : (client.status === 'pausado' ? 'warning' : 'danger')}`;

    renderIntegrationsList();

    document.getElementById('contract-services-list').innerHTML = client.services && client.services.length > 0 ? client.services.map(s => `<span class="tag-badge">${s}</span>`).join('') : '<span style="color:var(--os-text-muted);">Dado pendente de sincronização</span>';
    document.getElementById('contract-extras-list').innerHTML = client.extras && client.extras.length > 0 ? client.extras.map(e => `<span class="tag-badge" style="background:rgba(59,130,246,0.1); border-color:rgba(59,130,246,0.3); color:#60a5fa;">${e}</span>`).join('') : '<span style="color:var(--os-text-muted);">Nenhum serviço extra aprovado neste ciclo.</span>';
    document.getElementById('contract-scope-text').innerText = client.scope;

    updateIAMetricsDisplay();
    renderProductionList();
    renderMetricsList();

    setupDriveLink('drive-root-link', client.folders.root, 'Pasta Raiz do Cliente');
    setupDriveLink('drive-brand-link', client.folders.brand, 'Identidade Visual');
    setupDriveLink('drive-contracts-link', client.folders.contracts, 'Contratos & Propostas');
    setupDriveLink('drive-assets-link', client.folders.assets, 'Assets e ReferÃªncias');

    renderClientLogs();
}

// === WIDGETS RENDERERS ===
function renderServicosExtras(data) {
    const tbody = document.getElementById('extras-list-body');
    if (!tbody) return;
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--os-text-muted);">Nenhum serviço extra aprovado encontrado. Sincronizado via Supabase.</td></tr>';
        return;
    }
    tbody.innerHTML = data.map(i => {
        const hasIa = i.gera_credito_ia === 'sim';
        return `<tr>
            <td style="font-weight:600; color:#fff;">${i.nome_servico || '-'}</td>
            <td><span class="badge-status success">${i.status_servico_extra || '-'}</span></td>
            <td>R$ ${i.valor_aprovado ? Number(i.valor_aprovado).toFixed(2) : '0.00'}</td>
            <td>${i.prazo_aprovado || '-'}</td>
            <td>${hasIa ? `<span class="badge-status warning">+${i.quantidade_credito_ia}</span>` : '<span class="badge-status neutral">NÃO</span>'}</td>
        </tr>`;
    }).join('');
}

function renderFinanceiro(data) {
    const tbody = document.getElementById('financeiro-list-body');
    if (!tbody) return;
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--os-text-muted);">Nenhum lançamento financeiro encontrado. Sincronizado via Supabase.</td></tr>';
        return;
    }
    tbody.innerHTML = data.map(i => {
        const isPaid = i.status_pagamento === 'pago';
        return `<tr>
            <td style="font-weight:600; color:#fff;">${i.descricao_lancamento || '-'}</td>
            <td>R$ ${i.valor ? Number(i.valor).toFixed(2) : '0.00'}</td>
            <td>${i.competencia || '-'}</td>
            <td><span class="badge-status ${isPaid ? 'success' : 'warning'}">${i.status_pagamento || '-'}</span></td>
            <td>${i.forma_pagamento || '-'}</td>
        </tr>`;
    }).join('');
}

function renderDemandas(data) {
    const tbody = document.getElementById('demandas-list-body');
    if (!tbody) return;
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--os-text-muted);">Nenhuma demanda operacional encontrada. Sincronizado via Supabase.</td></tr>';
        return;
    }
    tbody.innerHTML = data.map(i => {
        const isHigh = i.prioridade === 'alta';
        return `<tr>
            <td style="font-weight:600; color:#fff;">${i.titulo_demanda || '-'}</td>
            <td><span class="badge-status neutral">${i.status_demanda || '-'}</span></td>
            <td><span class="badge-status ${isHigh ? 'danger' : 'neutral'}">${i.prioridade || '-'}</span></td>
            <td>${i.prazo || '-'}</td>
            <td>${i.responsavel || '-'}</td>
        </tr>`;
    }).join('');
}

function renderComunicacoes(data, role) {
    const tbody = document.getElementById('comunicacoes-list-body');
    if (!tbody) return;
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--os-text-muted);">Nenhuma comunicação encontrada. Sincronizado via Supabase.</td></tr>';
        return;
    }
    
    // Filtro por role
    const filtered = data.filter(i => {
        if (role === 'CLIENT' && i.status_notificacao === 'rascunho_fluxai') return false;
        return true;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--os-text-muted);">Nenhuma comunicação encontrada. Sincronizado via Supabase.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(i => {
        const isDraft = i.status_notificacao === 'rascunho_fluxai';
        return `<tr>
            <td style="font-weight:600; color:#fff;">${i.titulo || '-'}</td>
            <td>${i.tipo_notificacao || '-'}</td>
            <td><span class="badge-status ${isDraft ? 'warning' : 'success'}">${i.status_notificacao || '-'}</span></td>
            <td>${i.canal_sugerido || '-'}</td>
            <td>${i.requer_revisao_humana === 'sim' ? '<span class="badge-status danger">SIM</span>' : '<span class="badge-status success">NÃO</span>'}</td>
        </tr>`;
    }).join('');
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

function mapAssetStatusToGia(status) {
    const std = String(status || '').toUpperCase();
    if (std === 'DRAFT_PLANNING' || std === 'RASCUNHO') return 'rascunho';
    if (std === 'POSTED' || std === 'PUBLICADO') return 'publicado';
    if (std === 'READY_TO_POST' || std === 'AGUARDANDO_PUBLICACAO') return 'aguardando_publicacao';
    if (std === 'PLANNING_APPROVED' || std === 'APROVADO' || std === 'CONTENT_APPROVED' || std === 'PRODUCTION_QUEUE' || std === 'IN_PRODUCTION' || std === 'INTERNAL_QA') return 'aprovado';
    if (std === 'DESCARTADO') return 'descartado';
    return 'em_revisao';
}

function updateIAMetricsDisplay() {
    if (!currentClientData) return;

    if (activeClientId !== 'FLUXAI_LABS_001') {
        // IA Metrics are now fetched directly from Supabase (IA_CREDITOS_CLIENTE) in fetchClientData.
        // We do not override them with mock data anymore.
    }

    const limit = currentClientData.iaMetrics.limit !== undefined ? currentClientData.iaMetrics.limit : 'Pendente';
    const approved = currentClientData.iaMetrics.approved !== undefined ? currentClientData.iaMetrics.approved : 0;
    const review = currentClientData.iaMetrics.review !== undefined ? currentClientData.iaMetrics.review : 0;
    const published = currentClientData.iaMetrics.published !== undefined ? currentClientData.iaMetrics.published : 0;

    document.getElementById('ia-limit-total').innerText = limit;
    document.getElementById('ia-limit-approved').innerText = approved; 
    document.getElementById('ia-limit-review').innerText = review; 
    document.getElementById('ia-limit-published').innerText = published; 

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
    const prodContainer = document.getElementById('production-list');
    if (!prodContainer) return;

    if (!currentClientData.planejamento || currentClientData.planejamento.length === 0) {
        prodContainer.innerHTML = `
            <div style="text-align: center; color: var(--os-text-muted); padding: 20px;">
                <i class="fa-solid fa-folder-open" style="margin-bottom:8px;"></i><br>
                Nenhuma pauta planejada para este cliente no Cockpit ainda.
            </div>`;
    } else {
        prodContainer.innerHTML = currentClientData.planejamento.map(p => {
            let color = "#3b82f6"; // default blue
            const st = (p.status_planejamento || '').toLowerCase();
            if (st.includes('aprovad')) color = "#8e9e68"; // green
            else if (st.includes('revis')) color = "#f59e0b"; // yellow
            else if (st.includes('rascunho')) color = "#64748b"; // gray

            const title = p.tema || p.objetivo_conteudo || `Pauta #${p.planejamento_id?.substring(0,6) || 'Sem Título'}`;
            const type = p.formato_conteudo || 'Formato Indefinido';
            const status = p.status_planejamento || 'Planejado';

            return `
                <div class="prod-item">
                    <span style="font-weight: 500; color: #fff;">${escapeHTML(title)} <span style="font-size:0.6rem; color:var(--os-text-muted);">(${escapeHTML(type)})</span></span>
                    <span class="prod-status" style="background:${color}15; color:${color}; border: 1px solid ${color}40;">${escapeHTML(status)}</span>
                </div>
            `;
        }).join('');
    }

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
                        <i class="fa-solid fa-chart-line-slash" style="margin-right: 6px;"></i> Sem métrica real sincronizada ainda
                    </div>
                    <div style="font-size: 0.65rem; color: #555;">
                        As tabelas de performance ainda não receberam dados oficiais para este ciclo.
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
        console.error('[COCKPIT] Erro ao renderizar logs', e);
        container.innerHTML = '<tr><td colspan="6">Erro ao renderizar logs do cliente.</td></tr>';
    }
}

function setupEventListeners() {
    // EDITAR CLIENTE
    const btnEditClient = document.getElementById('btn-edit-client');
    if (btnEditClient) {
        btnEditClient.addEventListener('click', () => {
            openEditClientModal();
        });
    }

    const btnSaveClientEdits = document.getElementById('btn-save-client-edits');
    if (btnSaveClientEdits) {
        btnSaveClientEdits.addEventListener('click', () => {
            saveClientEdits();
        });
    }

    // IA - Bloquear / Desbloquear IA
    const btnToggleIa = document.getElementById('btn-toggle-ia');
    if (btnToggleIa) {
        btnToggleIa.addEventListener('click', () => {
        const role = currentUser ? currentUser.role : 'CLIENT';
        if (role === 'CLIENT') {
            alert('Ação restrita: Apenas administradores e operadores podem gerenciar acesso à IA.');
            return;
        }

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
        const role = currentUser ? currentUser.role : 'CLIENT';
        if (role === 'CLIENT') {
            alert('Ação restrita: Apenas administradores e operadores podem ajustar limites de IA.');
            return;
        }

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
        const role = currentUser ? currentUser.role : 'CLIENT';
        if (role === 'CLIENT') {
            alert('Ação restrita: Apenas administradores e operadores podem gerenciar automações.');
            return;
        }

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
        const role = currentUser ? currentUser.role : 'CLIENT';
        if (role === 'CLIENT') {
            alert('Ação restrita: Você não possui autorização para aprovar relatórios via cockpit interno.');
            return;
        }

        OS_LOGS_ENGINE.userAction(
            'DELIVERY_APPROVED',
            'cliente-detalhe',
            { document_type: 'REPORT', month: 'Corrente', details: 'Aprovado pelo operador' },
            role,
            activeClientId,
            !OS_CONFIG.flags.sendRealWebhooks
        );
        alert('Relatório mensal aprovado internamente!');
        renderClientLogs();
    });

    // PRODUÇÃO - Devolver relatório mensal para revisão
    document.getElementById('btn-return-report').addEventListener('click', () => {
        const role = currentUser ? currentUser.role : 'CLIENT';
        if (role === 'CLIENT') {
            alert('Ação restrita: Apenas equipe interna pode devolver relatórios no cockpit.');
            return;
        }

        OS_LOGS_ENGINE.userAction(
            'STATUS_CHANGED',
            'cliente-detalhe',
            { document_type: 'REPORT', transition: 'devolver_para_revisao' },
            role,
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

    // REGISTRAR ARQUIVO - ROTA_OS_14_ARQUIVOS
    const btnSubmitArquivo = document.getElementById('btn-submit-arquivo');
    if (btnSubmitArquivo) {
        btnSubmitArquivo.addEventListener('click', async () => {
            const btnOriginalText = btnSubmitArquivo.innerHTML;
            btnSubmitArquivo.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
            btnSubmitArquivo.disabled = true;

            try {
                const payload = {
                    arquivo_id: "",
                    client_id: activeClientId,
                    client_name: currentClientData ? currentClientData.name : "FluxAI Labs",
                    tipo_arquivo: document.getElementById('arquivo-tipo')?.value || "briefing",
                    categoria: document.getElementById('arquivo-categoria')?.value || "conteudo",
                    nome_arquivo: document.getElementById('arquivo-nome')?.value?.trim() || "",
                    link_drive: document.getElementById('arquivo-link')?.value?.trim() || "",
                    pasta_drive: document.getElementById('arquivo-pasta')?.value?.trim() || "",
                    status_arquivo: "ativo",
                    responsavel: currentUser?.name || "Kassia",
                    observacao: document.getElementById('arquivo-obs')?.value?.trim() || "Arquivo registrado via FluxAI OS pelo formulário real de Registrar Arquivo."
                };

                const contextoUsuario = {
                    userId: currentUser?.id || 'CLIENT',
                    userRole: currentUser?.role || 'CLIENT',
                    clientId: activeClientId
                };

                const response = await useMakeRoute.executeRoute('ROTA_OS_14_ARQUIVOS', payload, contextoUsuario);
                
                if (response && response.ok) {
                    alert('Arquivo registrado com sucesso via Make!');
                    document.getElementById('modal-registrar-arquivo').style.display = 'none';
                    // Limpar formulário
                    document.getElementById('arquivo-nome').value = '';
                    document.getElementById('arquivo-link').value = '';
                    document.getElementById('arquivo-pasta').value = '';
                    document.getElementById('arquivo-obs').value = '';
                } else {
                    alert('Falha ao registrar arquivo: ' + (response?.message || 'Erro desconhecido'));
                }
            } catch (err) {
                console.error('[Registrar Arquivo] Erro na execução da rota:', err);
                alert('Erro ao enviar para o Make.');
            } finally {
                btnSubmitArquivo.innerHTML = btnOriginalText;
                btnSubmitArquivo.disabled = false;
            }
        });
    }
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

function openEditClientModal() {
    const role = currentUser ? currentUser.role : 'CLIENT';
    if (role === 'CLIENT') {
        alert('Ação restrita: Apenas administradores podem editar clientes.');
        return;
    }
    
    document.getElementById('edit-client-segment').value = currentClientData.segment || '';
    document.getElementById('edit-client-scope').value = currentClientData.scope || '';
    document.getElementById('edit-client-responsible').value = currentClientData.responsible || '';
    
    document.getElementById('modal-edit-client').style.display = 'flex';
}

async function saveClientEdits() {
    const btn = document.getElementById('btn-save-client-edits');
    const originalTextContent = [...btn.childNodes];
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';

    const payload = {
        client_id: activeClientId,
        segment: document.getElementById('edit-client-segment').value,
        scope: document.getElementById('edit-client-scope').value,
        responsible: document.getElementById('edit-client-responsible').value,
        action: 'edit_client_info'
    };

    try {
        // Envia para o Webhook do Make
        const webhookUrl = 'https://hook.us2.make.com/YOUR_WEBHOOK_URL_HERE'; 
        
        // Simulação do Webhook local
        console.log('[MAKE WEBHOOK SIMULATION] Disparando webhook com:', payload);
        
        // Simula latência de rede
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Log interno
        OS_LOGS_ENGINE.userAction(
            'CLIENT_EDITED_VIA_MAKE',
            'cliente-detalhe',
            payload,
            currentUser ? currentUser.role : 'ADMIN',
            activeClientId,
            true
        );

        alert('Alterações enviadas para o Make! A planilha e o banco de dados serão atualizados em instantes.');
        document.getElementById('modal-edit-client').style.display = 'none';
        
    } catch (err) {
        console.error(err);
        alert('Erro ao enviar edição para o Make.');
    } finally {
        btn.replaceChildren(...originalTextContent);
        btn.disabled = false;
    }
}

initPage();

