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
        // 5. makeClient.js deve enviar: { routeId, payload }
        // 4. O frontend deve chamar apenas: /api/make-proxy
        let targetUrl = '/api/make-proxy';
        let finalBody = JSON.stringify({
            routeId: routeConfig.rota_id,
            payload: payload
        });

        // [STG-04] Bloqueio preventivo de Bypass. 
        // O frontend em staging (e futuramente produção) NUNCA disparará fetch direto para hook.make.com
        if (routeConfig.use_proxy === false) {
            console.warn(`[STG-BLOCKED] Tentativa de bypass do proxy bloqueada para rota ${routeConfig.rota_id}`);
            throw new Error(`A rota ${routeConfig.rota_id} solicita conexão direta (use_proxy=false). Isso é proibido pela política de segurança.`);
        }

        try {
            // Obter JWT dinâmico do usuário atual
            let token = '';
            if (globalThis.supabase !== undefined) {
                const { data: { session } } = await globalThis.supabase.auth.getSession();
                if (session?.access_token) {
                    token = session.access_token;
                }
            }

            const idempotencyKey = crypto.randomUUID();

            const response = await fetch(targetUrl, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json; charset=utf-8',
                    'Accept': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Idempotency-Key': idempotencyKey
                },
                body: finalBody
            });

            // Make.com tipicamente retorna "Accepted" (texto) ou um JSON (para rotas com Webhook Response)
            let responseData = {};
            const textRaw = await response.text();
            
            try {
                responseData = JSON.parse(textRaw);
            } catch (e) {
                // Se não for JSON (ex: "Accepted")
                responseData = { text: textRaw, ok: response.ok };
            }

            if (!response.ok) {
                return { success: false, data: responseData, status: response.status };
            }

            // O Make.com customizado pela FluxAI retorna ok: false em lógicas de bloqueio
            if (responseData.ok === false) {
                return { success: false, data: responseData, status: response.status };
            }

            return { success: true, data: responseData, status: response.status };

        } catch (networkError) {
            console.error('[MakeClient] Falha de rede no disparo do webhook:', networkError); // nosonar
            throw new Error('Não foi possível enviar para o Make. Verifique sua conexão ou a rota em ROTAS_OS_MAKE.');
        }
    }
};
