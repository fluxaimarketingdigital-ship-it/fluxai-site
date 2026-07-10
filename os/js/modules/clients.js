import { OS_UI, OS_AUTH } from '../os-core.js';
import { SheetsService } from '../../services/sheets-service.js';
import { OS_CONFIG } from '../../config/os-config.js';
import { OS_LOGS_ENGINE } from '../../services/logs-engine.js';
import { StatusEngine } from '../../config/status-system.js';
import { mockCatalogoServicos } from '../../data/catalogo.data.js';
import { SERVICES_CATALOG } from '../config/services-catalog.js';

let currentUser = null;

let localClients = [];
let currentStatusFilter = 'ALL';
let catalogServices = [];

async function initPage() {
    const user = await OS_AUTH.check('OPERATOR');
    if (!user) return;
    currentUser = user;

    OS_UI.renderSidebar('clientes', user.role);
    await OS_UI.renderTopbar();
    
    await loadClients();
    setupEventListeners();
}

function setupEventListeners() {
    // Tabs de status
    document.getElementById('status-tabs').addEventListener('click', (e) => {
        const tab = e.target.closest('.filter-tab');
        if (!tab) return;
        
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentStatusFilter = tab.dataset.status;
        renderClientsTable();
    });

    // Busca textual
    document.getElementById('client-search').addEventListener('input', () => {
        renderClientsTable();
    });

    // Modal extras save
    const btnSave = document.getElementById('btn-save-extra');
    if (btnSave) {
        btnSave.addEventListener('click', async () => {
            const clientId = document.getElementById('extra-client-id').value;
            const catalogId = document.getElementById('extra-catalog-id').value;
            const status = document.getElementById('extra-status').value;
            const valorEst = document.getElementById('extra-valor-est').value;
            const valorApr = document.getElementById('extra-valor-apr').value;
            const impact = document.getElementById('extra-impact').value;
            const obs = document.getElementById('extra-obs').value;
            const extraOwner = document.getElementById('extra-owner').value;
            const extraDeadline = document.getElementById('extra-deadline').value;
            const extraDueDate = document.getElementById('extra-due-date').value;
            const extraAiCredits = document.getElementById('extra-ai-credits').value;
            const extraDriveLink = document.getElementById('extra-drive-link').value;

            // Encontrar nome do serviço e categoria
            let serviceName = catalogId;
            let addLimit = 0;
            let categoryName = "outros";
            
            if (catalogId === 'Outro Serviço Avulso') {
                const customName = document.getElementById('extra-custom-name').value;
                if (customName) serviceName = customName;
            } else {
                const srv = catalogServices.find(s => s.servico_id === catalogId);
                if (srv) {
                    serviceName = srv.nome_servico;
                    categoryName = srv.categoria || "outros";
                    if (srv.gera_credito_ia) {
                        addLimit = srv.quantidade_credito_ia;
                    }
                }
            }

            const role = currentUser ? currentUser.role : 'CLIENT';
            
            // Regra: Apenas ADMIN/OPERATOR podem aprovar/alterar
            if (status === 'aprovado' || status === 'em_producao' || status === 'entregue') {
                if (role !== 'ADMIN' && role !== 'OPERATOR') {
                    alert('Erro de Permissão: Apenas administradores ou operadores podem aprovar serviços extras.');
                    OS_LOGS_ENGINE.security(
                        'SECURITY_ACCESS_DENIED',
                        { 
                            action: 'tentativa_negada_aprovacao_extra', 
                            client_id: clientId, 
                            role: role,
                            service: serviceName,
                            timestamp: new Date().toISOString()
                        },
                        'critical'
                    );
                    return;
                }
            }

            // Validar transição via STATUS_SYSTEM
            const validation = StatusEngine.validateTransition('servicos_extras', null, status, role);
            if (!validation.valid) {
                alert(`Erro de Governança: Transição inválida para '${status.toUpperCase()}'.\nMotivo: ${validation.reason}`);
                OS_LOGS_ENGINE.security(
                    'SECURITY_ACCESS_DENIED',
                    { 
                        action: 'tentativa_negada_transicao_extra', 
                        client_id: clientId, 
                        role: role, 
                        status_solicitado: status, 
                        reason: validation.reason,
                        timestamp: new Date().toISOString()
                    },
                    'critical'
                );
                return;
            }

            const isApproval = status === 'aprovado';
            let response = { success: true, simulated: true };

            const originalBtnHTML = btnSave.innerHTML;
            btnSave.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> PROCESSANDO...';
            btnSave.disabled = true;

            try {
                if (isApproval) {
                    const catalogItem = mockCatalogoServicos.find(s => s.servico_id === catalogId) || {};
                    const tipoServicoExt = catalogItem.tipo_servico_ext || catalogId;
                    const prioridade = catalogItem.prioridade || 'media';
                    const impacto = catalogItem.impacto_planejamento || 'nao_impacta';
                    const geraCredito = catalogItem.gera_credito_ia ? 'sim' : 'nao';
                    const qtyCredito = catalogItem.quantidade_credito_ia || 0;

                    // Preparar payload para o webhook de aprovação real
                    const payload = {
                        id: "extra_app_" + crypto.getRandomValues(new Uint32Array(1))[0].toString(36),
                        client_id: clientId,
                        cliente_id: clientId,
                        client_name: document.querySelector(`#extra-client-id option[value="${clientId}"]`)?.text || clientId,
                        cliente_nome: document.querySelector(`#extra-client-id option[value="${clientId}"]`)?.text || clientId,
                        service_id: catalogId,
                        servico_extra_id: catalogId,
                        tipo_servico: tipoServicoExt,
                        tipo_servico_ext: tipoServicoExt,
                        nome_servico: serviceName,
                        categoria: categoryName,
                        descricao: obs || serviceName,
                        status: "aprovado",
                        status_servico_extra: "orcamento_aprovado",
                        prioridade: prioridade,
                        impacto_planejamento: impact,
                        gera_credito_ia: extraAiCredits > 0 ? "sim" : "nao",
                        quantidade_credito_ia: extraAiCredits,
                        approved_by: extraOwner || currentUser?.email || currentUser?.username || role,
                        approved_at: new Date().toISOString(),
                        limite_operacional_adicionado: addLimit,
                        origem_servico_extra: "painel_operacoes",
                        observacao_operacional: obs,
                        valor: Number(valorApr) || Number(valorEst) || 0,
                        valor_base: Number(valorEst) || 0,
                        valor_estimado: Number(valorEst) || 0,
                        valor_aprovado: Number(valorApr) || 0,
                        prazo: extraDeadline || "N/A",
                        data_vencimento: extraDueDate,
                        link_entrega: extraDriveLink,
                        timestamp: new Date().toISOString()
                    };

                    const isReal = OS_CONFIG.flags.sendRealWebhooks || 
                                   (Array.isArray(OS_CONFIG.flags.enabledRealWebhooks) && OS_CONFIG.flags.enabledRealWebhooks.includes('SERVICE_EXTRA_APPROVAL'));

                    // Acionar webhook via send (verifica se é real ou simulado)
                    response = await OS_CONFIG.webhooks.send('SERVICE_EXTRA_APPROVAL', payload);

                    // Rollback seguro em caso de falha no webhook real
                    if (!response.success && isReal) {
                        console.error('[SERVICE_EXTRA_APPROVAL] Falha no webhook real. Abortando persistência.', response.error);

                        // Registrar logs exigidos de falha e rollback
                        // 1. WEBHOOK_REAL_FAILED
                        OS_LOGS_ENGINE.userAction(
                            'WEBHOOK_REAL_FAILED',
                            'clients-list',
                            { webhook: 'SERVICE_EXTRA_APPROVAL', error: response.error || 'Erro Desconhecido', status: response.status || 0 },
                            role,
                            clientId,
                            false
                        );

                        // 2. GOVERNANCE_ABORTED
                        OS_LOGS_ENGINE.userAction(
                            'GOVERNANCE_ABORTED',
                            'clients-list',
                            { action: 'aprovacao_servico_extra', reason: 'Falha no webhook real de integração', service: serviceName },
                            role,
                            clientId,
                            false
                        );

                        // 3. SECURITY_WARNING
                        OS_LOGS_ENGINE.security(
                            'SECURITY_WARNING',
                            { 
                                action: 'aprovacao_extra_cancelada_erro_conexao', 
                                client_id: clientId, 
                                role: role, 
                                service: serviceName,
                                error: response.error,
                                timestamp: new Date().toISOString()
                            },
                            'critical'
                        );

                        // 4. ROLLBACK_STARTED
                        OS_LOGS_ENGINE.userAction(
                            'ROLLBACK_STARTED',
                            'clients-list',
                            { 
                                reason: 'Falha na resposta do webhook de aprovação',
                                client_id: clientId, 
                                service: serviceName, 
                                preserved_limit: (getClientConfigs()[clientId] || {}).iaLimit || 10,
                                preserved_status: (getClientConfigs()[clientId] || {}).status || 'ativo'
                            },
                            role,
                            clientId,
                            false
                        );

                        // 5. ROLLBACK_COMPLETED
                        OS_LOGS_ENGINE.userAction(
                            'ROLLBACK_COMPLETED',
                            'clients-list',
                            { 
                                client_id: clientId, 
                                service: serviceName, 
                                restored_limit: (getClientConfigs()[clientId] || {}).iaLimit || 10,
                                restored_status: (getClientConfigs()[clientId] || {}).status || 'ativo',
                                local_db_status: 'CONSISTENT_UNMODIFIED'
                            },
                            role,
                            clientId,
                            false
                        );

                        alert(`Falha Crítica de Conexão com o Webhook:\n\n${response.error || 'O servidor de integração retornou erro.'}\n\nOperação abortada e revertida com sucesso (Rollback). Nenhum dado foi gravado no banco de dados local.`);
                        return;
                    }
                }

                // Se chegamos aqui, o webhook teve sucesso (ou foi simulado/mock).
                // Atualizar dados de limite no Supabase se houver addLimit
                let limitMsg = "";
                const isRealWebhookSuccess = response.success && !response.simulated;
                
                if (addLimit > 0 && (status === 'aprovado' || status === 'em_producao' || status === 'entregue' || impact === 'sim')) {
                    const supabase = getSupabase();
                    let currentMetadata = {};
                    try {
                        const { data } = await supabase.from('projects').select('metadata').eq('id', clientId).single();
                        if (data && data.metadata) currentMetadata = data.metadata;
                    } catch(e) {}

                    const oldLimit = currentMetadata.iaLimit !== undefined ? currentMetadata.iaLimit : 10;
                    const newLimit = oldLimit + addLimit;
                    currentMetadata.iaLimit = newLimit;

                    try {
                        await supabase.from('projects').update({ metadata: currentMetadata }).eq('id', clientId);
                        limitMsg = ` Limite operacional contratado incrementado em +${addLimit} (Total: ${newLimit}).`;
                        
                        // Atualiza estado local da UI
                        const cIdx = localClients.findIndex(c => c.id === clientId);
                        if (cIdx !== -1) localClients[cIdx].iaLimit = newLimit;

                        // Gravar log de governança sobre a alteração de permissão/limites
                        OS_LOGS_ENGINE.userAction(
                            'SECURITY_PERMISSIONS_CHANGED',
                            'clients-list',
                            { action: 'liberacao_limite_ia_via_servico_extra', servico: serviceName, limite_anterior: oldLimit, limite_adicionado: addLimit, limite_novo: newLimit },
                            role,
                            clientId,
                            !isRealWebhookSuccess
                        );

                        // LIMIT_UPDATE_CONFIRMED
                        OS_LOGS_ENGINE.userAction(
                            'LIMIT_UPDATE_CONFIRMED',
                            'clients-list',
                            { action: 'incremento_limite_operacional_contratado', limite_anterior: oldLimit, limite_adicionado: addLimit, limite_novo: newLimit },
                            role,
                            clientId,
                            !isRealWebhookSuccess
                        );
                    } catch (metaErr) {
                        console.error('Erro ao salvar novo limite no Supabase metadata:', metaErr);
                    }
                }

                renderClientsTable();

                // Logs adicionais exigidos
                if (isApproval) {
                    // SERVICE_EXTRA_APPROVED
                    OS_LOGS_ENGINE.userAction(
                        'SERVICE_EXTRA_APPROVED',
                        'clients-list',
                        { service: serviceName, status, valorEst, valorApr, impact, client: clientId, approved_by: currentUser ? currentUser.email : role },
                        role,
                        clientId,
                        !isRealWebhookSuccess
                    );

                    // STATUS_CHANGED
                    OS_LOGS_ENGINE.userAction(
                        'STATUS_CHANGED',
                        'clients-list',
                        { category: 'servicos_extras', item: serviceName, current_status: 'solicitado', target_status: 'aprovado' },
                        role,
                        clientId,
                        !isRealWebhookSuccess
                    );

                    // GOVERNANCE_ACTION
                    OS_LOGS_ENGINE.userAction(
                        'GOVERNANCE_ACTION',
                        'clients-list',
                        { action: 'autorizacao_aprovada', approved_by: currentUser ? currentUser.email : role, role },
                        role,
                        clientId,
                        !isRealWebhookSuccess
                    );

                    if (isRealWebhookSuccess) {
                        // WEBHOOK_REAL_SUCCESS
                        OS_LOGS_ENGINE.userAction(
                            'WEBHOOK_REAL_SUCCESS',
                            'clients-list',
                            { webhook: 'SERVICE_EXTRA_APPROVAL', response_status: response.status || 200 },
                            role,
                            clientId,
                            false
                        );
                    }
                }

                // Log geral de alteração
                OS_LOGS_ENGINE.userAction(
                    'SERVICE_EXTRA_ADDED',
                    'clients-list',
                    { service: serviceName, status, valorEst, valorApr, impact, client: clientId },
                    role,
                    clientId,
                    !isRealWebhookSuccess
                );

                alert(`Serviço Extra "${serviceName}" adicionado com sucesso para o cliente!${limitMsg}`);
                document.getElementById('modal-extra').style.display = 'none';

            } catch (err) {
                console.error('[SERVICE_EXTRA_APPROVAL] Erro imprevisto durante processamento.', err);
                OS_LOGS_ENGINE.error(
                    'SYSTEM_ERROR',
                    `Erro no fluxo de aprovação de serviço extra: ${err.message}`,
                    { client_id: clientId, service: serviceName }
                );
                alert(`Erro Crítico no Sistema:\n\n${err.message}\n\nAção abortada.`);
            } finally {
                btnSave.innerHTML = originalBtnHTML;
                btnSave.disabled = false;
            }
        });
    }
}

import { getSupabase } from '../../services/supabase-client.js';

async function loadClients() {
    const container = document.getElementById('clients-table-container');
    container.innerHTML = '<div style="opacity: 0.5;">Sincronizando com Supabase...</div>';

    try {
        const supabase = getSupabase();
        let clients = [];
        
        if (supabase) {
            // Buscar dados da tabela projects (nova estrutura central)
            const { data: projectsData, error: errProj } = await supabase.from('projects').select('id, company_name, name, status, segment, created_at').order('created_at', { ascending: false });
            
            // Fallbacks (para enriquecimento)
            const { data: estrategiaData } = await supabase.from('CLIENTES_ESTRATEGIA').select('client_id, cliente_nome, objetivo_principal, plano_ativo');
            const { data: contratosData } = await supabase.from('CONTRATOS_CLIENTES').select('client_id, status_contrato, tipo_contrato');
            
            if (projectsData && !errProj) {
                clients = projectsData.map(row => {
                    const strategy = (estrategiaData || []).find(s => s.client_id === row.id) || {};
                    const contrato = (contratosData || []).find(c => c.client_id === row.id) || {};
                    const meta = row.metadata || {};
                    
                    return {
                        id: row.id,
                        name: row.company_name || row.id,
                        status: row.status || 'rascunho',
                        instagram: strategy.instagram || contrato.observacao || '@pendente',
                        segment: row.segment || strategy.segmento || 'Não Definido',
                        tokenStatus: meta.tokenStatus || 'OK',
                        iaBlocked: !!meta.iaBlocked,
                        automationsPaused: !!meta.automationsPaused,
                        iaLimit: meta.iaLimit !== undefined ? meta.iaLimit : 10,
                        createdAt: row.created_at
                    };
                });
            } else {
                console.error("Erro ao carregar projects:", errProj);
                clients = [];
            }
        } else {
            console.warn("Supabase não configurado. Retornando array vazio.");
        }

        localClients = clients;
        
        // Carregar do catálogo de extras os seletores do modal
        const extraClientSelect = document.getElementById('extra-client-id');
        if (extraClientSelect) {
            extraClientSelect.innerHTML = clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        }
        
        const catalogSelect = document.getElementById('extra-catalog-id');
        if (catalogSelect) {
            catalogSelect.addEventListener('change', () => {
                const val = catalogSelect.value;
                const extraValField = document.getElementById('extra-valor-est');
                const extraDescField = document.getElementById('extra-obs');
                const customContainer = document.getElementById('extra-custom-container');

                if (val === 'Outro Serviço Avulso') {
                    if(customContainer) customContainer.style.display = 'block';
                    extraValField.value = '';
                    extraDescField.value = '';
                } else {
                    if(customContainer) customContainer.style.display = 'none';
                    if (val && SERVICES_CATALOG[val]) {
                        extraValField.value = '';
                        extraDescField.value = SERVICES_CATALOG[val].desc;
                    } else {
                        extraValField.value = '';
                        extraDescField.value = '';
                    }
                }
            });
        }

        renderClientsTable();
    } catch (e) {
        console.error(e);
        container.innerHTML = '<div style="color: var(--os-danger);">Erro ao carregar dados dos clientes.</div>';
    }
}

function renderClientsTable() {
    const container = document.getElementById('clients-table-container');
    const searchVal = document.getElementById('client-search').value.toLowerCase().trim();

    // 1. Atualizar contadores
    updateCounts();

    // 2. Usar dados reais do localClients (já enriquecidos com metadata)
    let mapped = [...localClients];

    // 3. Filtrar por Tab de Status
    if (currentStatusFilter !== 'ALL') {
        mapped = mapped.filter(c => c.status === currentStatusFilter);
    }

    // 4. Filtrar por Busca Textual
    if (searchVal) {
        mapped = mapped.filter(c => {
            return c.name.toLowerCase().includes(searchVal) ||
                   c.id.toLowerCase().includes(searchVal) ||
                   c.instagram.toLowerCase().includes(searchVal) ||
                   c.segment.toLowerCase().includes(searchVal);
        });
    }

    if (mapped.length === 0) {
        container.innerHTML = '<div style="opacity: 0.5; padding: 20px; text-align:center;">Nenhum cliente localizado com os filtros ativos.</div>';
        return;
    }

    // 5. Desenhar Tabela
    let html = `<table>
        <thead>
            <tr>
                <th>Cliente / Segmento</th>
                <th>ID do Cliente</th>
                <th>Instagram</th>
                <th style="text-align: center;">Token API</th>
                <th style="text-align: center;">IA Status</th>
                <th style="text-align: center;">Automações</th>
                <th style="text-align: center;">Status OS</th>
                <th style="text-align: right; width: 290px;">Ações Rápidas</th>
            </tr>
        </thead>
        <tbody>`;

    mapped.forEach(c => {
        const tokenClass = String(c.tokenStatus).toLowerCase() === 'ok' ? 'ativo' : 'inativo';
        const iaClass = c.iaBlocked ? 'inativo' : 'ativo';
        const iaText = c.iaBlocked ? 'BLOQUEADO' : 'ATIVO';

        const autoClass = c.automationsPaused ? 'inativo' : 'ativo';
        const autoText = c.automationsPaused ? 'PAUSADO' : 'OK';

        html += `<tr>
            <td style="font-weight: 600; color: #fff;">
                <a href="cliente-detalhe.html?client_id=${c.id}" style="color: var(--os-primary); text-decoration: none; font-weight: 700;">
                    ${c.name}
                </a>
                <div style="font-size:0.65rem; color:var(--os-text-muted); margin-top:2px; font-weight:400;">Segmento: ${c.segment}</div>
            </td>
            <td style="color: var(--os-text-muted); font-family: var(--os-font-mono);">${c.id}</td>
            <td>${c.instagram}</td>
            <td style="text-align: center;"><span class="badge-status ${tokenClass}">${c.tokenStatus}</span></td>
            <td style="text-align: center;"><span class="badge-status ${iaClass}">${iaText}</span></td>
            <td style="text-align: center;"><span class="badge-status ${autoClass}">${autoText}</span></td>
            <td style="text-align: center;"><span class="badge-status ${c.status}">${c.status}</span></td>
            <td style="text-align: right;">
                <div class="action-btn-group" style="justify-content: flex-end;">
                    <!-- Status toggles -->
                    ${c.status !== 'ativo' 
                        ? `<button class="row-action-btn" onclick="window.mutateClient('${c.id}', 'status', 'ativo')">Ativar</button>` 
                        : `<button class="row-action-btn" onclick="window.mutateClient('${c.id}', 'status', 'pausado')">Pausar</button>`
                    }
                    ${c.status !== 'inativo'
                        ? `<button class="row-action-btn danger" onclick="window.mutateClient('${c.id}', 'status', 'inativo')">Arquivar</button>`
                        : ''
                    }
                    
                    <!-- IA toggle -->
                    <button class="row-action-btn" onclick="window.mutateClient('${c.id}', 'ia', ${!c.iaBlocked})">
                        ${c.iaBlocked ? 'Unblock IA' : 'Block IA'}
                    </button>

                    <!-- Auto toggle -->
                    <button class="row-action-btn" onclick="window.mutateClient('${c.id}', 'auto', ${!c.automationsPaused})">
                        ${c.automationsPaused ? 'Auto Play' : 'Auto Pause'}
                    </button>
                    
                    <!-- Limit increment -->
                    <button class="row-action-btn" onclick="window.mutateClientLimit('${c.id}')" title="Incrementar limite operacional">
                        + Limite
                    </button>
                </div>
            </td>
        </tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

function updateCounts() {
    let all = localClients.length;
    let ativo = 0, pausado = 0, inativo = 0, onboarding = 0;

    localClients.forEach(c => {
        const status = c.status;
        if (status === 'ativo') ativo++;
        else if (status === 'pausado') pausado++;
        else if (status === 'inativo') inativo++;
        else if (status === 'onboarding') onboarding++;
    });

    document.getElementById('count-all').innerText = all;
    document.getElementById('count-ativo').innerText = ativo;
    document.getElementById('count-pausado').innerText = pausado;
    document.getElementById('count-inativo').innerText = inativo;
    document.getElementById('count-onboarding').innerText = onboarding;
}

window.mutateClient = async (clientId, property, value) => {
    const clientIndex = localClients.findIndex(c => c.id === clientId);
    if (clientIndex === -1) return;
    
    const client = localClients[clientIndex];
    const clientName = client.name;
    let logType = 'STATUS_CHANGED';
    let logPayload = { client: clientId, property, old_value: null, new_value: value };
    const role = currentUser ? currentUser.role : 'CLIENT';

    const updatePayload = {};
    const supabase = getSupabase();

    if (property === 'status') {
        const oldStatus = client.status;
        
        const validation = StatusEngine.validateTransition('clientes', oldStatus, value, role);
        if (!validation.valid) {
            alert(`Erro de Governança: Transição proibida de '${oldStatus.toUpperCase()}' para '${value.toUpperCase()}' para o perfil '${role}'.\nMotivo: ${validation.reason}`);
            
            OS_LOGS_ENGINE.security(
                'SECURITY_WARNING',
                { action: 'tentativa_negada_mudanca_status', client_id: clientId, role: role, status_atual: oldStatus, status_solicitado: value, reason: validation.reason, origem_acao: 'clients-list', timestamp: new Date().toISOString() },
                'critical'
            );
            return;
        }

        logPayload.old_value = oldStatus;
        updatePayload.status = value;
        
    } else if (property === 'ia') {
        if (role === 'CLIENT') {
            alert('Ação restrita: Apenas administradores e operadores podem alterar status de IA.');
            return;
        }
        logPayload.old_value = client.iaBlocked;
        let currentMetadata = {};
        try {
            const { data } = await supabase.from('projects').select('metadata').eq('id', clientId).single();
            if (data && data.metadata) currentMetadata = data.metadata;
        } catch(e) {}
        
        currentMetadata.iaBlocked = value;
        updatePayload.metadata = currentMetadata;
        logType = 'SECURITY_PERMISSIONS_CHANGED';
        
    } else if (property === 'auto') {
        if (role === 'CLIENT') {
            alert('Ação restrita: Apenas administradores e operadores podem alterar automações.');
            return;
        }
        logPayload.old_value = client.automationsPaused;
        let currentMetadata = {};
        try {
            const { data } = await supabase.from('projects').select('metadata').eq('id', clientId).single();
            if (data && data.metadata) currentMetadata = data.metadata;
        } catch(e) {}
        
        currentMetadata.automationsPaused = value;
        updatePayload.metadata = currentMetadata;
    }

    try {
        const { error } = await supabase.from('projects').update(updatePayload).eq('id', clientId);
        if (error) throw error;
        
        if (property === 'status') {
            client.status = value;
            const actionText = value === 'ativo' ? 'ativado' : (value === 'pausado' ? 'pausado' : 'arquivado');
            alert(`Cliente ${clientName} foi ${actionText} com sucesso!`);
        } else if (property === 'ia') {
            client.iaBlocked = value;
            alert(value ? `IA suspensa para ${clientName}.` : `IA reativada para ${clientName}.`);
        } else if (property === 'auto') {
            client.automationsPaused = value;
            alert(value ? `Automações pausadas para ${clientName}.` : `Automações reativadas para ${clientName}.`);
        }

        renderClientsTable();

        if (logType === 'SECURITY_PERMISSIONS_CHANGED') {
            OS_LOGS_ENGINE.security(
                'SECURITY_PERMISSIONS_CHANGED',
                { action: logPayload.old_value ? 'ia_ativada' : 'ia_bloqueada', client: clientId },
                'critical'
            );
        } else {
            const payloadData = property === 'status' ? {
                ...logPayload, role: role, status_atual: logPayload.old_value, status_solicitado: value, status_tentativa: 'valida', origem_acao: 'clients-list', timestamp: new Date().toISOString()
            } : logPayload;

            OS_LOGS_ENGINE.userAction(
                logType, 'clients-list', payloadData, role, clientId, false
            );
        }
    } catch(err) {
        console.error("Erro ao atualizar Supabase:", err);
        alert(`Falha ao gravar no Supabase: ${err.message || 'Erro desconhecido'}`);
    }
};

window.mutateClientLimit = async (clientId) => {
    const role = currentUser ? currentUser.role : 'CLIENT';
    if (role === 'CLIENT') {
        alert('Ação restrita: Apenas administradores e operadores podem ajustar limites de IA.');
        return;
    }

    const clientIndex = localClients.findIndex(c => c.id === clientId);
    if (clientIndex === -1) return;
    
    const client = localClients[clientIndex];
    const currentLimit = client.iaLimit !== undefined ? client.iaLimit : 10;
    const increment = prompt(`Informe a quantidade de limite operacional contratado a somar ao limite atual de ${currentLimit}:`, "5");
    
    if (increment === null) return;
    const add = parseInt(increment, 10);
    
    if (isNaN(add) || add <= 0) {
        alert('Por favor, insira um incremento numérico válido maior que zero!');
        return;
    }

    const newLimit = currentLimit + add;
    const supabase = getSupabase();
    
    let currentMetadata = {};
    try {
        const { data } = await supabase.from('projects').select('metadata').eq('id', clientId).single();
        if (data && data.metadata) currentMetadata = data.metadata;
    } catch(e) {}
    
    currentMetadata.iaLimit = newLimit;

    try {
        const { error } = await supabase.from('projects').update({ metadata: currentMetadata }).eq('id', clientId);
        if (error) throw error;
        
        client.iaLimit = newLimit;
        renderClientsTable();

        OS_LOGS_ENGINE.userAction(
            'SECURITY_PERMISSIONS_CHANGED',
            'clients-list',
            { action: 'liberacao_manual_limite_ia', limite_anterior: currentLimit, limite_adicionado: add, limite_novo: newLimit },
            role,
            clientId,
            false
        );
        alert(`Limite operacional contratado do cliente incrementado com sucesso! Novo Limite: ${newLimit}.`);

    } catch(err) {
        console.error("Erro ao atualizar Supabase limite:", err);
        alert(`Falha ao gravar no Supabase: ${err.message || 'Erro desconhecido'}`);
    }
};

initPage();
