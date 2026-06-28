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

import { getSupabase } from './supabase-client.js';

// O Endpoint da Edge Function será gerado dinamicamente.
// Agora aponta diretamente para o Túnel Blindado do Supabase (Edge Function)
function getProxyEndpoint() {
    // Busca a URL do Supabase do ambiente ou usa a oficial
    const baseUrl = (typeof window !== 'undefined' && globalThis.FLUXAI_ENV?.SUPABASE_URL) 
        ? globalThis.FLUXAI_ENV.SUPABASE_URL 
        : 'https://mufgwetfhfhhmhowbhjj.supabase.co';
        
    return `${baseUrl}/functions/v1/make-proxy`;
}

// ─── Proxy-Key pública (não é secret — apenas identifica o frontend) ────────
// O verdadeiro segredo vive somente no Supabase (FLUXAI_PROXY_ACCESS_KEY).
// Esta chave pública é um fingerprint de origem controlada; CORS na Edge
// Function restringe chamadas a domínios não-autorizados.
const PROXY_ACCESS_KEY = 'fluxai-proxy-public-2026';

async function resolveToken(providedToken) {
    if (providedToken) return providedToken;
    try {
        const supabase = getSupabase();
        const { data } = await supabase?.auth.getSession() || {};
        if (data?.session?.access_token) {
            return data.session.access_token;
        }
    } catch (e) {
        console.warn('[DISPATCHER] Falha ao buscar token JWT:', e);
    }
    // Se for mock mode local, cria um token fake para passar pelo proxy em ambiente DEV
    const hostname = globalThis.location?.hostname || '';
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'dev-mock-token';
    }
    return null;
}

/**
 * Dispara um webhook via Supabase Edge Function make-proxy.
 *
 * @param {string} route     - Rota lógica (ex: 'LEAD_CAPTURE', 'DEMAND_SUBMISSION')
 * @param {object} payload   - Dados a serem encaminhados ao Make
 * @param {string} [token]   - JWT do usuário autenticado (opcional; ausente em rotas públicas)
 * @returns {Promise<{ok: boolean, status: number, data?: object, error?: string}>}
 */
export async function dispatchWebhook(route, payload, token = null) {
    const fallbackIdk = typeof crypto !== 'undefined' && crypto.getRandomValues ? `idk_${Date.now()}_${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}` : `idk_${Date.now()}_fallback`;
    const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : fallbackIdk;

    const headers = {
        'Content-Type': 'application/json',
        'x-fluxai-proxy-key': PROXY_ACCESS_KEY,
        'Idempotency-Key': idempotencyKey,
    };

    const finalToken = await resolveToken(token);
    if (finalToken) {
        headers['Authorization'] = `Bearer ${finalToken}`;
    }

    // Injeta o client_id legado (ex: FLUXAI_LABS_001) no payload para no quebrar o ecossistema Make
    let finalPayload = { ...payload };
    const legacyClientId = typeof window !== 'undefined' && window.FLUXAI_RUNTIME_CONTEXT?.project_id;
    if (legacyClientId) {
        finalPayload.legacy_client_id = legacyClientId;
        // Substitui tambm o client_id oficial pelo legado para garantir 100% de retrocompatibilidade com o Make
        finalPayload.client_id = legacyClientId;
    }

    // Garante que o ecossistema antigo do Make receba o mes_referencia e tipo_entrega
    if (finalPayload.action && finalPayload.action.startsWith('IA_GENERATION')) {
        const now = new Date();
        finalPayload.mes_referencia = finalPayload.mes_referencia || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        
        let tipo_entrega = 'conteudo_estrategico';
        if (finalPayload.title && finalPayload.title.toLowerCase().includes('carrossel')) {
            tipo_entrega = 'carrossel';
        }
        finalPayload.tipo_entrega = finalPayload.tipo_entrega || tipo_entrega;
    }

    let response;
    try {
        const endpoint = getProxyEndpoint();
        response = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify({ route, payload: finalPayload }),
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
