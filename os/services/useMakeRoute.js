import { ROTAS_OS_MAKE } from './makeRoutes.js';
import { MakeClient } from './makeClient.js';
import { UIHelper } from './ui-helper.js';

/**
 * Ponto de entrada oficial para todos os botões e componentes visuais do FluxAI OS™.
 * Nenhum formulário deve chamar o makeClient diretamente. Sempre passar por aqui.
 */
export const useMakeRoute = {
    
    /**
     * @param {string} routeId - ID da rota cadastrada em ROTAS_OS_MAKE (ex: ROTA_OS_01_PORTAL_DEMANDAS)
     * @param {object} payloadTemplate - Dados do formulário para o corpo do webhook
     * @param {object} context - Contexto do usuário atual (ex: { role: 'OPERATOR' })
     */
    executeRoute: async (routeId, payloadTemplate, context = {}) => {
        const route = ROTAS_OS_MAKE[routeId];
        const userRole = context.role || 'CLIENT'; // Padrão mais restritivo caso não enviado
        
        // 1. Validar existência da rota
        if (!route) {
            console.error(`[MakeIntegration] Rota ${routeId} não configurada.`);
            // TODO: Se existir um UIHelper.showToast, usar ele em vez de alert genérico.
            alert(`Aviso: Rota ${routeId} indisponível no sistema.`);
            return { success: false };
        }

        // 2. Validação de Acesso (Status inativo, nível manual, etc.)
        const accessCheck = MakeClient.validateAccess(route, userRole);
        if (!accessCheck.valid) {
            alert(accessCheck.error);
            return { success: false };
        }

        // 3. Validação de Regras de Confirmação e Status Monitorado
        // TODO na Fase 2: Substituir window.confirm pelo modal corporativo do UIHelper.
        if (route.status_rota === 'monitorado') {
            const confirmed = window.confirm(`ATENÇÃO: Operação de Risco Sensível.\nEsta rota é monitorada e impacta os limites de IA ou infraestrutura.\n\nDeseja disparar a integração para ${route.acao}?`);
            if (!confirmed) return { success: false, canceled: true };
        } else if (route.requer_confirmacao === 'sim') {
            const confirmed = window.confirm(`Confirma a operação para:\n${route.acao.toUpperCase()}?`);
            if (!confirmed) return { success: false, canceled: true };
        }

        // 4. Pré-processamento e Geração de ID dinâmico caso exigido
        const finalPayload = { ...payloadTemplate };
        
        if (routeId === 'ROTA_OS_01_PORTAL_DEMANDAS' && !finalPayload.demanda_id) {
            finalPayload.demanda_id = MakeClient.generateId('DEM_FLUXAI');
        } else if (routeId === 'ROTA_OS_02_LEADS_SITE' && !finalPayload.lead_id) {
            finalPayload.lead_id = MakeClient.generateId('LEAD_SITE');
        } else if (routeId === 'ROTA_OS_14_ARQUIVOS' && !finalPayload.arquivo_id) {
            finalPayload.arquivo_id = MakeClient.generateId('ARQ_FLUXAI');
        }

        // Validação de payloads obrigatórios (Camada extra de fallback da UI)
        const payloadValidation = MakeClient.validatePayload(route, finalPayload);
        if (!payloadValidation.valid) {
            alert(payloadValidation.error);
            return { success: false };
        }

        // 5. Disparo Real
        try {
            // Se houver loader central no UIHelper
            // UIHelper.showLoader('global-loading'); 
            console.log(`[MakeIntegration] Disparando POST [${routeId}]...`);
            
            const result = await MakeClient.sendPost(route, finalPayload);
            
            let isSuccess = result.success;
            let msgMake = result.data?.message || result.data?.text || '';

            // Interpretação de retorno flexível exigida para ROTA_OS_14_ARQUIVOS
            if (routeId === 'ROTA_OS_14_ARQUIVOS') {
                const rawText = result.data?.text || JSON.stringify(result.data || {});
                if (result.success === true || 
                    rawText === 'Accepted' || 
                    rawText.includes('Arquivo') || 
                    rawText.includes('registrado') || 
                    result.status === 200 || 
                    result.status === 202) {
                    isSuccess = true;
                }
            }

            if (isSuccess) {
                // UIHelper.showToast('Operação realizada com sucesso.', 'success');
                alert(msgMake || 'Operação realizada com sucesso no Make!');
                return { success: true, ok: true, data: result.data }; // Retornando ok: true para evitar falsos negativos nos módulos
            } else {
                const errorMsg = result.data?.message || 'A solicitação foi rejeitada pelo Make.';
                const motivo = result.data?.motivo_bloqueio ? `(Motivo: ${result.data.motivo_bloqueio})` : '';
                alert(`Alerta do Make: ${errorMsg} ${motivo}`);
                return { success: false, ok: false, error: errorMsg, data: result.data };
            }

        } catch (error) {
            console.error('[MakeIntegration] Erro crítico no disparo:', error);
            alert(error.message);
            return { success: false, error: error.message };
        } finally {
            // UIHelper.hideLoader('global-loading');
        }
    }
};
