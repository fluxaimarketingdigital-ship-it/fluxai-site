import { getSupabase } from '../services/supabase-client.js';
import { StatusEngine } from '../config/status-system.js';
import { OS_LOGS_ENGINE } from '../services/logs-engine.js';
import { OS_CONFIG } from '../config/os-config.js';
import { OS_AUTH } from './os-core.js';

async function handleWebhookFailure(app, response, transitionResult, actionName) {
    console.error('[DELIVERY_APPROVAL] Falha no webhook real. Abortando persistência.', response.error);

    OS_LOGS_ENGINE.userAction(
        'WEBHOOK_REAL_FAILED',
        'client-approval',
        { webhook: transitionResult.webhook, error: response.error || 'Erro Desconhecido', status: response.status || 0 },
        'CLIENT',
        app.project_id,
        false
    );

    OS_LOGS_ENGINE.userAction(
        'GOVERNANCE_ABORTED',
        'client-approval',
        { action: actionName, reason: 'Falha no webhook real de integração' },
        'CLIENT',
        app.project_id,
        false
    );

    OS_LOGS_ENGINE.security(
        'SECURITY_WARNING',
        { 
            action: actionName + '_cancelada_erro_conexao', 
            client_id: app.project_id, 
            role: 'CLIENT', 
            error: response.error,
            timestamp: new Date().toISOString()
        },
        'critical'
    );

    OS_LOGS_ENGINE.userAction(
        'ROLLBACK_STARTED',
        'client-approval',
        { reason: 'Falha na resposta do webhook', client_id: app.project_id, preserved_status: app.status },
        'CLIENT',
        app.project_id,
        false
    );

    OS_LOGS_ENGINE.userAction(
        'ROLLBACK_COMPLETED',
        'client-approval',
        { client_id: app.project_id, restored_status: app.status, local_db_status: 'CONSISTENT_UNMODIFIED' },
        'CLIENT',
        app.project_id,
        false
    );

    alert(`Falha Crítica de Conexão com o Webhook de Integração:\n\n${response.error || 'O servidor de integração retornou erro.'}\n\nOperação abortada e revertida com sucesso (Rollback). Nenhum dado foi gravado.`);
}

async function initApproval() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const assetId = params.get('id');

    if (!token && !assetId) {
        showError('Link de aprovação inválido ou expirado.');
        return;
    }

    const supabase = getSupabase();
    if (!supabase) return;

    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            showError('Acesso Anônimo Bloqueado: Por favor, autentique-se no painel do FluxAI OS™ para realizar a aprovação.');
            return;
        }

        let app = null;

        if (token) {
            // Fluxo Genérico (external_approvals)
            const { data, error } = await supabase
                .from('external_approvals')
                .select('*, projects(company_name)')
                .eq('token', token)
                .single();
            if (error || !data) throw new Error('Aprovação não encontrada (token).');
            app = data;
        } else if (assetId) {
            // Fluxo Direto (content_assets)
            const { data, error } = await supabase
                .from('content_assets')
                .select('*')
                .eq('id', assetId)
                .single();
            if (error || !data) throw new Error('Ativo não encontrado (id).');
            
            // Adaptar asset para o formato esperado pelo renderApproval
            app = {
                id: data.id,
                is_asset: true,
                project_id: data.project_id,
                type: 'CONTENT',
                status: data.status,
                content_data: {
                    description: data.title + '\n\n' + (data.caption || ''),
                    preview_url: data.metadata?.final_asset_url || data.metadata?.reference_url
                },
                projects: { company_name: 'Ativo de Conteúdo' }, // mock para renderApproval
                original_asset: data
            };
        }

        renderApproval(app);
        bindEvents(app);

    } catch (err) {
        showError(err.message);
    }
}

async function executeStateTransition(app, targetStatus, feedback, actionName) {
    const transitionResult = await StatusEngine.transition('aprovacoes', app.id, app.status, targetStatus, { role: 'CLIENT' });
    if (!transitionResult.success) {
        alert(`Erro de Governança: Transição inválida.\nMotivo: ${transitionResult.error}`);
        return { success: false };
    }
    const isReal = OS_CONFIG.flags.sendRealWebhooks || (Array.isArray(OS_CONFIG.flags.enabledRealWebhooks) && OS_CONFIG.flags.enabledRealWebhooks.includes(transitionResult.webhook));
    if (transitionResult.webhook) {
        const now = new Date();
        const mes_referencia_fb = app.original_asset?.metadata?.mes_referencia || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const tipo_entrega_fb = app.original_asset?.metadata?.tipo_entrega || 'carrossel'; 
        const client_id_raw = app.project_id;
        const client_id_mapped = client_id_raw === '3acae009-6825-4163-9057-cbe99216cc3b' ? 'FLUXAI_LABS_001' : client_id_raw;
        const limite_id_fb = app.original_asset?.metadata?.limite_id || `LIM_${client_id_mapped}_${mes_referencia_fb.replace('-', '_')}_${tipo_entrega_fb.toUpperCase()}`;

        const payload = {
            client_id: client_id_mapped,
            asset_id: app.id,
            title: app.original_asset?.title || 'Revisão de Material',
            status_anterior: app.original_asset?.status || app.status,
            status_novo: targetStatus,
            logical_transition: `client_review->${targetStatus}`,
            timestamp: now.toISOString(),
            responsavel_operacional: app.original_asset?.metadata?.responsavel_operacional || 'Equipe',
            link_referencia: app.original_asset?.metadata?.reference_url || '',
            link_resultado_drive: app.original_asset?.metadata?.final_asset_url || '',
            solicitado_por: 'Cliente (via Portal)',
            feedback: feedback || '',
            limite_id: limite_id_fb,
            mes_referencia: mes_referencia_fb,
            tipo_entrega: tipo_entrega_fb,
            geracao_id: app.original_asset?.metadata?.geracao_id || app.original_asset?.metadata?.mock_id || ''
        };
        const response = await OS_CONFIG.webhooks.send(transitionResult.webhook, payload);
        if (!response.success && isReal) {
            await handleWebhookFailure(app, response, transitionResult, actionName);
            return { success: false };
        }
    }
    return { success: true, webhook: transitionResult.webhook, isReal };
}

function renderApproval(app) {
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';

    document.getElementById('project-tag').innerText = `CLIENTE: ${app.projects.company_name}`;
    document.getElementById('item-type').innerText = app.type === 'PLANNING' ? 'Planejamento Estratégico' : 'Aprovação de Conteúdo';
    document.getElementById('item-description').innerText = app.content_data.description || 'Por favor, revise o material abaixo para prosseguirmos com a operação.';

    // Renderizar Preview (Imagem ou Link)
    const previewArea = document.getElementById('preview-area');
    previewArea.replaceChildren();
    if (app.content_data.preview_url) {
        const img = document.createElement('img');
        img.src = app.content_data.preview_url;
        img.alt = 'Preview';
        previewArea.appendChild(img);
    } else {
        const p = document.createElement('p');
        p.style.opacity = '0.5';
        p.textContent = '[Material em formato de link ou documento]';
        previewArea.appendChild(p);
    }
}

function bindEvents(app) {
    const supabase = getSupabase();

    // 1. Botão Aprovar
    document.getElementById('btn-approve-all').onclick = async () => {
        if (!confirm('Deseja aprovar este material?')) return;
        
        const exec = await executeStateTransition(app, 'aprovado', null, 'aprovar_entrega');
        if (!exec.success) return;
        const isReal = exec.isReal;
        const transitionResult = { webhook: exec.webhook };

        try {
            if (app.is_asset) {
                const currentStatus = String(app.original_asset.status).toUpperCase();
                // Se estiver aprovando planejamento/rascunho, vai pra produção. Se for aprovação final, vai pra publicação.
                const nextStatus = (currentStatus === 'APROVAÇÃO FINAL' || currentStatus === 'CLIENT_REVIEW_CONTENT') ? 'READY_TO_POST' : 'PRODUCTION_QUEUE';
                
                const newMeta = { ...app.original_asset.metadata, client_approved: true };
                await supabase.from('content_assets').update({ status: nextStatus, metadata: newMeta }).eq('id', app.id);
            } else {
                await supabase.from('external_approvals').update({ status: 'APROVADO' }).eq('id', app.id);
            }
            
            // Gravar log de governança/ação do usuário
            OS_LOGS_ENGINE.userAction(
                'DELIVERY_APPROVED',
                'client-approval',
                { id: app.id, type: app.type, client_id: app.project_id },
                'CLIENT',
                app.project_id,
                false
            );

            if (isReal) {
                OS_LOGS_ENGINE.userAction(
                    'WEBHOOK_REAL_SUCCESS',
                    'client-approval',
                    { webhook: transitionResult.webhook },
                    'CLIENT',
                    app.project_id,
                    false
                );
            }

            alert('Aprovado com sucesso! Obrigado.');
            window.location.reload();
        } catch (err) {
            OS_LOGS_ENGINE.error('APPROVAL_APPROVE_ERROR', err.message, { id: app.id });
            alert('Erro ao processar aprovação: ' + err.message);
        }
    };

    // 2. Botão Solicitar Alteração (Abre o form)
    document.getElementById('btn-request-change').onclick = () => {
        document.getElementById('action-bar').style.display = 'none';
        document.getElementById('change-form').style.display = 'block';
    };

    // 3. Enviar Alteração
    document.getElementById('btn-submit-change').onclick = async () => {
        const feedback = {
            element: document.getElementById('change-element').value,
            page: document.getElementById('change-page').value,
            description: document.getElementById('change-desc').value,
            timestamp: new Date().toISOString()
        };

        if (!feedback.description) {
            alert('Por favor, descreva o que precisa ser alterado.');
            return;
        }

        const exec = await executeStateTransition(app, 'alteracao', feedback, 'solicitar_alteracao');
        if (!exec.success) return;
        const isReal = exec.isReal;
        const transitionResult = { webhook: exec.webhook };

        try {
            if (app.is_asset) {
                const hist = app.original_asset.metadata?.history || [];
                hist.push({ date: new Date().toISOString(), type: 'CLIENT', author: 'Cliente (Aprovação Externa)', note: feedback.description });
                const newMeta = { ...app.original_asset.metadata, history: hist, client_approved: false };
                
                // Determinar o status
                const currentStatus = String(app.original_asset.status).toUpperCase();
                const nextStatus = currentStatus === 'CLIENT_REVIEW_PLANNING' ? 'CLIENT_REVISION_PLANNING' : 'CLIENT_REVISION_CONTENT';
                
                await supabase.from('content_assets').update({ status: nextStatus, metadata: newMeta }).eq('id', app.id);
            } else {
                await supabase.from('external_approvals').update({ 
                    status: 'ALTERACAO',
                    feedback: feedback
                }).eq('id', app.id);
            }

            // Gravar log
            OS_LOGS_ENGINE.userAction(
                'DELIVERY_REJECTED',
                'client-approval',
                { id: app.id, type: app.type, client_id: app.project_id, feedback },
                'CLIENT',
                app.project_id,
                false
            );

            if (isReal) {
                OS_LOGS_ENGINE.userAction(
                    'WEBHOOK_REAL_SUCCESS',
                    'client-approval',
                    { webhook: transitionResult.webhook },
                    'CLIENT',
                    app.project_id,
                    false
                );
            }

            alert('Solicitação de alteração enviada. Vamos ajustar e te avisar!');
            window.location.reload();
        } catch (err) {
            OS_LOGS_ENGINE.error('APPROVAL_CHANGE_ERROR', err.message, { id: app.id });
            alert('Erro ao processar solicitação de alteração: ' + err.message);
        }
    };

    // 4. Botão Reprovar
    document.getElementById('btn-reject-all').onclick = async () => {
        if (!confirm('Deseja realmente reprovar este material?')) return;
        
        const exec = await executeStateTransition(app, 'rejeitado', null, 'rejeitar_entrega');
        if (!exec.success) return;
        const isReal = exec.isReal;
        const transitionResult = { webhook: exec.webhook };

        try {
            if (app.is_asset) {
                const hist = app.original_asset.metadata?.history || [];
                hist.push({ date: new Date().toISOString(), type: 'CLIENT', author: 'Cliente (Aprovação Externa)', note: 'Material Reprovado integralmente.' });
                const newMeta = { ...app.original_asset.metadata, history: hist, client_approved: false };
                await supabase.from('content_assets').update({ status: 'CLIENT_REVISION_CONTENT', metadata: newMeta }).eq('id', app.id);
            } else {
                await supabase.from('external_approvals').update({ status: 'REPROVADO' }).eq('id', app.id);
            }

            // Gravar log
            OS_LOGS_ENGINE.userAction(
                'DELIVERY_REJECTED',
                'client-approval',
                { id: app.id, type: app.type, client_id: app.project_id },
                'CLIENT',
                app.project_id,
                false
            );

            if (isReal) {
                OS_LOGS_ENGINE.userAction(
                    'WEBHOOK_REAL_SUCCESS',
                    'client-approval',
                    { webhook: transitionResult.webhook },
                    'CLIENT',
                    app.project_id,
                    false
                );
            }

            alert('Material reprovado.');
            window.location.reload();
        } catch (err) {
            OS_LOGS_ENGINE.error('APPROVAL_REJECT_ERROR', err.message, { id: app.id });
            alert('Erro ao processar reprovação: ' + err.message);
        }
    };
}

function showError(msg) { 
    const p = document.createElement('p');
    p.style.cssText = 'color: var(--os-danger); font-weight: 700;';
    p.textContent = msg;
    document.getElementById('loading-state').replaceChildren(p); 
} 

initApproval();
