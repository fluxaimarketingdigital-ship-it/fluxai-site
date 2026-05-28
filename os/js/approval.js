import { getSupabase } from '../services/supabase-client.js';
import { StatusEngine } from '../config/status-system.js';
import { OS_LOGS_ENGINE } from '../services/logs-engine.js';
import { OS_CONFIG } from '../config/os-config.js';

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
}async function initApproval() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
        showError('Link de aprovação inválido ou expirado.');
        return;
    }

    const supabase = getSupabase();
    if (!supabase) return;

    try {
        // 1. Buscar item de aprovação pelo token
        const { data: app, error } = await supabase
            .from('external_approvals')
            .select('*, projects(company_name)')
            .eq('token', token)
            .single();

        if (error || !app) throw new Error('Aprovação não encontrada.');

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
        const payload = {
            approval_id: app.id,
            project_id: app.project_id,
            type: app.type,
            status: targetStatus,
            feedback: feedback,
            timestamp: new Date().toISOString()
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
            await supabase.from('external_approvals').update({ status: 'APROVADO' }).eq('id', app.id);
            
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
            await supabase.from('external_approvals').update({ 
                status: 'ALTERACAO',
                feedback: feedback
            }).eq('id', app.id);

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
            await supabase.from('external_approvals').update({ status: 'REPROVADO' }).eq('id', app.id);

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
