/**
 * FLUXAI OS™ ROUTER
 * Gestão de Navegação entre Módulos
 */

import { ROUTES } from '../config/routes.js';

export const OS_ROUTER = {
    /**
     * Navega para um módulo específico
     */
    navigate: (moduleId) => {
        const route = ROUTES.find(r => r.id === moduleId);
        if (route) {
            window.location.href = route.path;
        } else {
            console.error(`Rota não encontrada: ${moduleId}`);
        }
    },

    /**
     * Obtém o ID do módulo atual baseado na URL
     */
    getCurrentModule: () => {
        const path = window.location.pathname;
        const route = ROUTES.find(r => path.includes(r.path.replace('../../', '')) || path.endsWith(r.id + '.html'));
        return route ? route.id : null;
    }
};
