/**
 * SERVICE: API (Core Fetch Wrapper)
 */
import { ErrorHandler } from './error-handler.js';

const BASE_URL = '/api/v1'; // Configuração futura

export const ApiService = {
    /**
     * Wrapper genérico para requisições fetch
     */
    request: async (endpoint, options = {}) => {
        const url = `${BASE_URL}${endpoint}`;
        const uiContext = window.FLUXAI_RUNTIME_CONTEXT || {};
        
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Authorization': uiContext.token ? `Bearer ${uiContext.token}` : ''
        };

        try {
            // Simulação de delay operacional (pode ser removido em produção real)
            // await new Promise(r => setTimeout(r, 300));

            const response = await fetch(endpoint, {
                ...options,
                headers: { ...defaultHeaders, ...options.headers }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP Error ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            ErrorHandler.handle(error, `API Request: ${endpoint}`);
            throw error; // Re-throw para o módulo tratar se necessário
        }
    },

    get: (endpoint, options) => ApiService.request(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, data, options) => ApiService.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
    put: (endpoint, data, options) => ApiService.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
    delete: (endpoint, options) => ApiService.request(endpoint, { ...options, method: 'DELETE' })
};
