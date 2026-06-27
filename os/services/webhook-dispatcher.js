/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  FLUXAI OS™ — WEBHOOK DISPATCHER                                     ║
 * ║  Arquivo: os/services/webhook-dispatcher.js                          ║
 * ║                                                                      ║
 * ║  Wrapper centralizado de disparo de webhooks via Supabase Edge       ║
 * ║  Function make-proxy. Nenhum módulo deve fazer fetch() direto        ║
 * ║  ao Make. Todas as chamadas passam obrigatoriamente por aqui.        ║
 * ║                                                                      ║
 * ║  REGRA ABSOLUTA: Nunca inserir URLs reais do Make neste arquivo.     ║
 * ║  Nunca inserir service_role key aqui.                                ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

'use strict';

import { SUPABASE_CONFIG } from '../config/os-config.js';
import { getSupabase } from './supabase-client.js';

// O Endpoint da Edge Function será gerado dinamicamente para evitar
// problemas de inicialização (dependência circular com os-config.js).
function getProxyEndpoint() {
    return `/api/make-proxy`;
}

// ─── Proxy-Key pública (não é secret — apenas identifica o frontend) ────────
// O verdadeiro segredo vive somente no Supabase (FLUXAI_PROXY_ACCESS_KEY).
// Esta chave pública é um fingerprint de origem controlada; CORS na Edge
// Function restringe chamadas a domínios não-autorizados.
const PROXY_ACCESS_KEY = 'fluxai-proxy-public-2026';

/**
 * Dispara um webhook via Supabase Edge Function make-proxy.
 *
 * @param {string} route     - Rota lógica (ex: 'LEAD_CAPTURE', 'DEMAND_SUBMISSION')
 * @param {object} payload   - Dados a serem encaminhados ao Make
 * @param {string} [token]   - JWT do usuário autenticado (opcional; ausente em rotas públicas)
 * @returns {Promise<{ok: boolean, status: number, data?: object, error?: string}>}
 */
export async function dispatchWebhook(route, payload, token = null) {
    const headers = {
        'Content-Type': 'application/json',
        'x-fluxai-proxy-key': PROXY_ACCESS_KEY,
    };

    if (!token) {
        try {
            const supabase = getSupabase();
            if (supabase) {
                const { data } = await supabase.auth.getSession();
                if (data && data.session && data.session.access_token) {
                    token = data.session.access_token;
                }
            }
        } catch (e) {
            console.warn('[DISPATCHER] Falha ao buscar token JWT:', e);
        }
    }

    // Se for mock mode local, cria um token fake para passar pelo proxy em ambiente DEV
    if (!token && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        token = 'dev-mock-token';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    let response;
    try {
        const endpoint = getProxyEndpoint();
        response = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify({ route, payload }),
        });
    } catch (networkError) {
        console.warn(`[DISPATCHER] Falha de rede ao chamar make-proxy para ${route}:`, networkError?.message);
        return { ok: false, status: 0, error: 'NETWORK_ERROR' };
    }

    let data = {};
    try {
        data = await response.json();
    } catch {
        data = { raw: true };
    }

    if (!response.ok) {
        console.warn(`[DISPATCHER] make-proxy retornou ${response.status} para ${route}`, data);
        return { ok: false, status: response.status, data, error: data?.error || `HTTP_${response.status}` };
    }

    return { ok: true, status: response.status, data };
}

export default { dispatchWebhook };
