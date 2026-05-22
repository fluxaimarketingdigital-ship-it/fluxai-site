/**
 * SERVICE: Supabase Client
 * Inicialização e exportação do cliente Supabase.
 */

import { SUPABASE_CONFIG } from '../config/secrets/supabase-keys.js';

// Nota: Em um ambiente real, carregaríamos via npm ou CDN
// Aqui assumimos que a biblioteca está disponível globalmente ou injetada.
let supabaseInstance = null;

export const getSupabase = () => {
    if (!supabaseInstance) {
        if (typeof window.supabase === 'undefined') {
            console.error('[SUPABASE] Biblioteca não carregada. Verifique o CDN no HTML.');
            return null;
        }
        supabaseInstance = window.supabase.createClient(
            SUPABASE_CONFIG.url,
            SUPABASE_CONFIG.anonKey
        );
    }
    return supabaseInstance;
};
