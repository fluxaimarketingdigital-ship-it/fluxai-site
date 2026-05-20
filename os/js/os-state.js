/**
 * FLUXAI OS™ — OS STATE v1.0.0
 * Estado global compartilhado entre todos os módulos.
 *
 * Substitui o uso fragmentado do localStorage como estado.
 * Todos os módulos importam daqui — nunca lêem localStorage diretamente para estado.
 *
 * USO:
 *   import { OSState } from '/os/core/os-state.js';
 *   const project = OSState.get('activeProject');
 *   OSState.set('activeProject', projectData);
 *   OSState.subscribe('activeProject', (val) => renderTopbar(val));
 */

// ─────────────────────────────────────────────────────────────────
// STORE INTERNO
// ─────────────────────────────────────────────────────────────────

const _state = {
    // Sessão e identidade
    currentUser: null,          // { id, name, email, role, permissions, scoped_project_id }
    userRole: null,             // 'SUPER_ADMIN' | 'ADMIN' | 'OPERATOR' | 'CLIENT'
    isAuthenticated: false,

    // Contexto de navegação
    activeContext: 'MASTER',    // 'MASTER' | 'LABS' | 'CLIENT'
    activeProject: null,        // objeto projeto completo
    activeProjectId: null,      // UUID do projeto ativo

    // Cache de dados (evita re-fetch entre módulos)
    projectsCache: null,        // []
    paymentsCache: null,        // []
    assetsCache: null,          // []

    // Alertas globais
    pendingApprovals: 0,
    financialAlerts: [],
    systemNotifications: [],

    // FluxAI Labs
    labsProject: null,          // projeto interno da FluxAI Labs
};

// Listeners por chave
const _listeners = {};

// ─────────────────────────────────────────────────────────────────
// API PÚBLICA
// ─────────────────────────────────────────────────────────────────

export const OSState = {
    /**
     * Lê um valor do estado global.
     * @param {string} key
     */
    get(key) {
        return _state[key] ?? null;
    },

    /**
     * Define um valor e notifica os listeners.
     * @param {string} key
     * @param {*} value
     */
    set(key, value) {
        _state[key] = value;
        // Persiste chaves críticas no localStorage como backup
        if (['activeProjectId', 'activeContext', 'userRole'].includes(key)) {
            try { localStorage.setItem(`fluxai_state_${key}`, JSON.stringify(value)); } catch (_) {}
        }
        // Notifica listeners
        if (_listeners[key]) {
            _listeners[key].forEach(fn => { try { fn(value); } catch (e) { console.warn('[STATE]', e); } });
        }
    },

    /**
     * Registra um listener para reagir a mudanças de uma chave.
     * Retorna função de unsubscribe.
     * @param {string} key
     * @param {Function} callback
     */
    subscribe(key, callback) {
        if (!_listeners[key]) _listeners[key] = [];
        _listeners[key].push(callback);
        return () => { _listeners[key] = _listeners[key].filter(fn => fn !== callback); };
    },

    /**
     * Carrega estado persistido do localStorage na inicialização.
     * Chamado uma vez, no boot da aplicação (os-core.js).
     */
    hydrate() {
        const keys = ['activeProjectId', 'activeContext', 'userRole'];
        keys.forEach(key => {
            try {
                const stored = localStorage.getItem(`fluxai_state_${key}`);
                if (stored !== null) _state[key] = JSON.parse(stored);
            } catch (_) {}
        });
        // Retrocompatibilidade: migrar chave legada
        const legacyProjectId = localStorage.getItem('fluxai_current_project_id');
        if (legacyProjectId && !_state.activeProjectId) {
            _state.activeProjectId = legacyProjectId;
        }
        // ADMIN sempre inicia em MASTER — nunca mantém contexto LABS gravado
        try {
            const session = JSON.parse(localStorage.getItem('fluxai_session') || '{}');
            if (session.role === 'ADMIN') {
                _state.activeContext = 'MASTER';
                localStorage.setItem('fluxai_state_activeContext', JSON.stringify('MASTER'));
            }
        } catch(_) {}
    },

    /**
     * Define o contexto de navegação (Master, Labs ou Cliente).
     * Dispara re-render da topbar e sidebar automaticamente.
     * @param {'MASTER'|'LABS'|'CLIENT'} context
     * @param {object|null} project — projeto ativo se context === 'CLIENT'
     */
    setContext(context, project = null) {
        OSState.set('activeContext', context);
        if (context === 'CLIENT' && project) {
            OSState.set('activeProject', project);
            OSState.set('activeProjectId', project.id);
            localStorage.setItem('fluxai_current_project_id', project.id);
        } else if (context === 'MASTER') {
            OSState.set('activeProject', null);
            OSState.set('activeProjectId', null);
            localStorage.removeItem('fluxai_current_project_id');
        } else if (context === 'LABS') {
            const labs = OSState.get('labsProject');
            OSState.set('activeProject', labs);
            OSState.set('activeProjectId', labs?.id || null);
        }
    },

    /**
     * Adiciona uma notificação global (exibida na topbar).
     * @param {'info'|'warning'|'danger'|'success'} type
     * @param {string} message
     */
    notify(type, message) {
        const notification = { id: Date.now(), type, message, at: new Date().toISOString() };
        const current = _state.systemNotifications;
        OSState.set('systemNotifications', [notification, ...current].slice(0, 10));
    },

    /**
     * Limpa o estado na saída (logout).
     */
    clear() {
        Object.keys(_state).forEach(k => { _state[k] = null; });
        _state.activeContext = 'MASTER';
        _state.financialAlerts = [];
        _state.systemNotifications = [];
        ['activeProjectId', 'activeContext', 'userRole'].forEach(k =>
            localStorage.removeItem(`fluxai_state_${k}`)
        );
    }
};

// Hidratação automática ao importar
OSState.hydrate();
