import { ROLE_CONFIG } from '../config/os-config.js';

export const MakeClient = {
    /**
     * Gera ID padronizado no formato PREFIX_YYYY_MM_XXXX
     */
    generateId: (prefix) => {
        const date = new Date();
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const randomBuffer = new Uint32Array(1);
        crypto.getRandomValues(randomBuffer);
        const randomStr = String(randomBuffer[0] % 10000).padStart(4, '0');
        return `${prefix}_${yyyy}_${mm}_${randomStr}`;
    },

    /**
     * Valida se a rota pode ser executada baseado no status e no role do usuário.
     */
    validateAccess: (routeConfig, userRole) => {
        if (!routeConfig) {
            return { valid: false, error: 'Rota não encontrada na configuração oficial.' };
        }
        if (routeConfig.status_rota === 'inativo') {
            return { valid: false, error: 'Rota inativa. Envio bloqueado por segurança.' };
        }
        if (routeConfig.status_rota === 'manual' && !ROLE_CONFIG.hasAccess(userRole, 'OPERATOR')) {
            return { valid: false, error: 'Acesso negado. Esta operação é restrita a níveis ADMIN ou OPERATOR.' };
        }
        return { valid: true };
    },

    /**
     * Valida os campos obrigatórios básicos exigidos por rotas (pode ser estendido por cenário).
     */
    validatePayload: (routeConfig, payload) => {
        if (routeConfig.rota_id === 'ROTA_OS_01_PORTAL_DEMANDAS') {
            if (!payload.titulo || !payload.descricao) return { valid: false, error: 'Título e descrição são obrigatórios para demandas.' };
        }
        if (routeConfig.rota_id === 'ROTA_OS_02_LEADS_SITE') {
            if (!payload.nome_lead) return { valid: false, error: 'Nome é obrigatório para leads.' };
        }
        return { valid: true };
    },

    /**
     * Dispara requisição POST real para o Webhook homologado
     */
    sendPost: async (routeConfig, payload) => {
        // [STG-04] Bloqueio preventivo de Bypass. 
        if (routeConfig.use_proxy === false) {
            console.warn(`[STG-BLOCKED] Tentativa de bypass do proxy bloqueada para rota ${routeConfig.rota_id}`);
            throw new Error(`A rota ${routeConfig.rota_id} solicita conexão direta (use_proxy=false). Isso é proibido pela política de segurança.`);
        }

        try {
            // Usa o dispatcher unificado (Edge Function)
            const { dispatchWebhook } = await import('./webhook-dispatcher.js');
            const result = await dispatchWebhook(routeConfig.rota_id, payload);
            
            if (!result.ok) {
                return { success: false, data: result.data || {}, status: result.status };
            }

            return { success: true, data: result.data, status: result.status };
        } catch (err) {
            console.error(`[MakeClient] Erro crítico ao enviar POST via dispatcher (Rota: ${routeConfig.rota_id}):`, err);
            return { success: false, error: err.message };
        }
    }
};
