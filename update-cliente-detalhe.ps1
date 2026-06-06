$filePath = "c:\Users\BRENDA\Desktop\Identidade Visual FluxAI\FLUXAI_SITE\os\js\modules\cliente-detalhe.js"
$content = Get-Content $filePath -Raw -Encoding UTF8

if ($content -notmatch "import \{ getSupabase \}") {
    $content = $content -replace "import \{ StatusEngine \} from '../../config/status-system.js';", "import { StatusEngine } from '../../config/status-system.js';`nimport { getSupabase } from '../../services/supabase-client.js';"
}

$regexLoad = "(?s)async function loadClientData\(\) \{.*?(?=function setupDriveLink)"
$newLoad = @"
async function loadClientData() {
    const supabase = getSupabase();
    
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
        responsible: 'Dado pendente de sincronização'
    };

    if (supabase) {
        try {
            const { data: contratos } = await supabase.from('CONTRATOS_CLIENTES').select('*').eq('client_id', activeClientId).single();
            const { data: estrategia } = await supabase.from('CLIENTES_ESTRATEGIA').select('*').eq('client_id', activeClientId).single();
            const mesAtual = new Date().toISOString().substring(0, 7);
            const { data: creditos } = await supabase.from('IA_CREDITOS_CLIENTE').select('*').eq('client_id', activeClientId).eq('mes_referencia', mesAtual).eq('status_limite', 'ativo').single();

            if (estrategia) {
                client.name = estrategia.cliente_nome || activeClientId;
                client.segment = estrategia.segmento || 'Dado pendente de sincronização';
                client.scope = estrategia.objetivo_principal || 'Dado pendente de sincronização';
            }

            if (contratos) {
                client.startDate = contratos.data_inicio || contratos.data_criacao || 'Dado pendente de sincronização';
                client.contractType = contratos.escopo_contratado || 'Dado pendente de sincronização';
                client.responsible = contratos.responsavel_comercial || (estrategia ? estrategia.responsavel_fluxai : null) || 'Dado pendente de sincronização';
            } else {
                client.responsible = (estrategia ? estrategia.responsavel_fluxai : null) || 'Dado pendente de sincronização';
            }

            if (creditos) {
                client.iaMetrics.limit = creditos.limite_operacional_mensal || 0;
                client.iaMetrics.approved = creditos.limite_ocupado || 0; 
                client.iaMetrics.review = creditos.limite_disponivel_operacional || 0; 
                client.iaMetrics.published = creditos.limite_publicado || 0;
            }

            try {
                const { data: servicosExtras } = await supabase.from('SERVICOS_EXTRAS_CLIENTES').select('nome_servico').eq('client_id', activeClientId).eq('status', 'aprovado');
                if (servicosExtras && servicosExtras.length > 0) {
                    client.extras = servicosExtras.map(s => s.nome_servico);
                }
            } catch(e) {}

            try {
                const { data: srvs } = await supabase.from('SERVICOS_CLIENTES').select('*').eq('client_id', activeClientId).eq('status_servico', 'ativo');
                const { data: config } = await supabase.from('CLIENTES_CONFIG').select('*').eq('client_id', activeClientId).eq('status_cliente', 'ativo').single();
                
                if (srvs && srvs.length > 0 && config) {
                    client.integrations = srvs.map(s => {
                        return {
                            name: s.nome_servico || s.servico_id,
                            status: 'Conectado',
                            token: config.token_status || 'ativo',
                            manual: s.modo_coleta === 'manual',
                            alert: 'Integração configurada, aguardando coleta'
                        };
                    });
                }
            } catch(e) {}
            
            client.metrics = []; 
        } catch(e) {
            console.warn('[COCKPIT] Erro ao buscar dados reais', e);
        }
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
    setupDriveLink('drive-assets-link', client.folders.assets, 'Assets e Referências');

    renderClientLogs();
}

"@

$content = $content -replace $regexLoad, $newLoad

$regexMetrics = "(?s)function updateIAMetricsDisplay\(\) \{.*?(?=function renderProductionList)"
$newMetrics = @"
function updateIAMetricsDisplay() {
    if (!currentClientData) return;

    if (activeClientId !== 'FLUXAI_LABS_001') {
        const mockAssets = JSON.parse(localStorage.getItem('fluxai_mock_assets') || '[]');
        const clientAssets = mockAssets.filter(a => a && (a.project_id === activeClientId || a.clientId === activeClientId));

        let countReview = 0;
        let countApproved = 0;
        let countPublished = 0;

        clientAssets.forEach(asset => {
            const gia = mapAssetStatusToGia(asset.status);
            if (gia === 'rascunho') {
            } else if (gia === 'em_revisao') {
                countReview++;
            } else if (gia === 'aprovado' || gia === 'aguardando_publicacao') {
                countApproved++;
            } else if (gia === 'publicado') {
                countPublished++;
            }
        });

        currentClientData.iaMetrics.review = countReview;
        currentClientData.iaMetrics.approved = countApproved;
        currentClientData.iaMetrics.published = countPublished;
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

"@

$content = $content -replace $regexMetrics, $newMetrics

$regexRenderMetrics = "(?s)function renderMetricsList\(\) \{.*?(?=function renderClientLogs)"
$newRenderMetrics = @"
function renderMetricsList() {
    const container = document.getElementById('metrics-list');
    if (!container || !currentClientData) return;

    if (!currentClientData.metrics || currentClientData.metrics.length === 0) {
        container.innerHTML = \`
            <tr>
                <td colspan="5" style="text-align: center; color: var(--os-text-muted); padding: 25px 0;">
                    <div style="font-size: 0.8rem; font-weight: 600; margin-bottom: 4px; color: #888;">
                        <i class="fa-solid fa-chart-line-slash" style="margin-right: 6px;"></i> Sem métrica real sincronizada ainda
                    </div>
                    <div style="font-size: 0.65rem; color: #555;">
                        As tabelas de performance ainda não receberam dados oficiais para este ciclo.
                    </div>
                </td>
            </tr>\`;
        return;
    }

    container.innerHTML = currentClientData.metrics.map(m => {
        const isTrendUp = m.change.startsWith('+');
        const trendColor = isTrendUp ? 'var(--os-success)' : 'var(--os-danger)';
        return \`
            <tr>
                <td style="font-weight: 600; color: #fff;">\${m.channel}</td>
                <td>\${m.key}</td>
                <td style="font-family: var(--os-font-mono);">\${m.val}</td>
                <td style="font-family: var(--os-font-mono); color: \${trendColor};">\${m.change}</td>
                <td style="color: var(--os-text-muted); font-size: 0.7rem;">\${m.alert}</td>
            </tr>\`;
    }).join('');
}

"@

$content = $content -replace $regexRenderMetrics, $newRenderMetrics

Set-Content $filePath -Value $content -Encoding UTF8
