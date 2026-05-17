/**
 * FLUXAI OS™ AUTHENTICATION
 * Controle de Acesso e Sessão (RBAC)
 */
import { ROUTES } from '../config/routes.js';

export const OS_AUTH = {
    /**
     * Verifica se o usuário tem permissão para acessar o módulo atual
     */
    check: (moduleId) => {
        const session = OS_AUTH.getSession();
        if (!session) {
            OS_AUTH.redirectToLogin();
            return false;
        }

        // Simulação de expiração de sessão (24h)
        const loginTime = new Date(session.loginTime).getTime();
        const now = new Date().getTime();
        const expiry = 24 * 60 * 60 * 1000;

        if (now - loginTime > expiry) {
            console.warn('[AUTH] Sessão expirada.');
            OS_AUTH.logout();
            return false;
        }

        // Se um moduleId for passado, verifica RBAC
        if (moduleId) {
            const route = ROUTES.find(r => r.id === moduleId);
            if (route && !route.roles.includes(session.role)) {
                console.error(`[AUTH] Acesso negado para o módulo: ${moduleId}`);
                window.location.href = '/os/modules/analytics/analytics.html'; // Fallback seguro
                return false;
            }
        }

        return true;
    },

    getSession: () => {
        const raw = localStorage.getItem('fluxai_session');
        if (raw) return JSON.parse(raw);
        
        // MOCK SESSION FALLBACK (DEVELOPMENT/DEMO)
        console.warn("[AUTH] Nenhuma sessão encontrada. Injetando Sessão Mock para visualização da UI.");
        return { role: 'ADMIN', name: 'Admin FluxAI (Mock)' };
    },

    login: (credentials) => {
        // Simulação pragmática de usuários por role
        const users = {
            'admin': { role: 'ADMIN', name: 'Diretor Operacional' },
            'op': { role: 'OPERATOR', name: 'Analista FluxAI' },
            'client': { role: 'CLIENT', name: 'Stakeholder' }
        };

        const user = users[credentials.username];
        if (user && credentials.password === 'fluxai2024') {
            localStorage.setItem('fluxai_session', JSON.stringify({
                ...user,
                token: 'mock-jwt-token',
                loginTime: new Date().toISOString()
            }));
            return true;
        }
        return false;
    },

    logout: () => {
        localStorage.removeItem('fluxai_session');
        OS_AUTH.redirectToLogin();
    },

    redirectToLogin: () => {
        const path = window.location.pathname;
        const target = path.includes('/modules/') ? '../../login.html' : 'login.html';
        window.location.href = target;
    }
};
