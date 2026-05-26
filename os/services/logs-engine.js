/**
 * FLUXAI OS™ — SISTEMA CENTRAL DE LOGS OPERACIONAIS (OS_LOGS_ENGINE)
 * Versão: 2.1.0 | Arquivo: /os/services/logs-engine.js
 */

export const EVENT_TYPES = {
    // Auth
    AUTH_LOGIN: 'AUTH_LOGIN',
    AUTH_LOGOUT: 'AUTH_LOGOUT',
    
    // Onboarding
    ONBOARDING_CREATED: 'ONBOARDING_CREATED',
    
    // Serviços Extras
    EXTRA_SERVICE_REQUESTED: 'EXTRA_SERVICE_REQUESTED',
    EXTRA_SERVICE_ACTIVATED: 'EXTRA_SERVICE_ACTIVATED',
    
    // Demandas
    DEMAND_SUBMITTED: 'DEMAND_SUBMITTED',
    DEMAND_STATUS_UPDATED: 'DEMAND_STATUS_UPDATED',
    
    // Leads
    LEAD_CAPTURED: 'LEAD_CAPTURED',
    LEAD_UPDATED: 'LEAD_UPDATED',
    LEAD_CONVERTED: 'LEAD_CONVERTED',
    
    // Webhooks
    WEBHOOK_TRIGGERED: 'WEBHOOK_TRIGGERED',
    WEBHOOK_ERROR: 'WEBHOOK_ERROR',
    
    // Entregas e Aprovações
    DELIVERY_APPROVED: 'DELIVERY_APPROVED',
    DELIVERY_REJECTED: 'DELIVERY_REJECTED',
    
    // Relatórios
    REPORT_STATUS_UPDATED: 'REPORT_STATUS_UPDATED',
    
    // Geração IA
    AI_GENERATION_APPROVED: 'AI_GENERATION_APPROVED',
    AI_GENERATION_DELETED: 'AI_GENERATION_DELETED',
    
    // Segurança
    SECURITY_ACCESS_DENIED: 'SECURITY_ACCESS_DENIED',
    SECURITY_PERMISSIONS_CHANGED: 'SECURITY_PERMISSIONS_CHANGED',
    
    // Geral
    STATUS_CHANGED: 'STATUS_CHANGED',
    SYSTEM_ERROR: 'SYSTEM_ERROR'
};

export const OPERATION_LOGS_CONFIG = {
    maxEntries: 500,
    storageKeys: {
        USER_ACTIONS: 'fluxai_logs_user_actions',
        WEBHOOKS: 'fluxai_logs_webhooks',
        ERRORS: 'fluxai_logs_errors',
        SECURITY: 'fluxai_logs_security',
        ALL: 'fluxai_logs_all'
    }
};

const _detectEnv = () => {
    if (typeof window === 'undefined') return 'PRODUCTION';
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.')) return 'DEVELOPMENT';
    if (host.includes('staging') || host.includes('preview') || host.includes('vercel.app')) return 'STAGING';
    return 'PRODUCTION';
};

const _getCurrentSession = () => {
    try {
        const raw = localStorage.getItem('fluxai_session');
        if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
};

const _saveLog = (key, entry) => {
    try {
        // Salvar na categoria específica
        const specificLogs = JSON.parse(localStorage.getItem(key) || '[]');
        specificLogs.unshift(entry);
        localStorage.setItem(key, JSON.stringify(specificLogs.slice(0, OPERATION_LOGS_CONFIG.maxEntries)));

        // Salvar na timeline consolidada de todos os logs
        const allLogs = JSON.parse(localStorage.getItem(OPERATION_LOGS_CONFIG.storageKeys.ALL) || '[]');
        allLogs.unshift(entry);
        localStorage.setItem(OPERATION_LOGS_CONFIG.storageKeys.ALL, JSON.stringify(allLogs.slice(0, OPERATION_LOGS_CONFIG.maxEntries)));

        // Printar no console em ambiente de DEV/STAGING
        const env = _detectEnv();
        if (env !== 'PRODUCTION') {
            const styles = {
                info: 'color: #60a5fa; font-weight: bold;',
                warning: 'color: #f59e0b; font-weight: bold;',
                critical: 'color: #ef4444; font-weight: bold; background: rgba(239, 68, 68, 0.1); padding: 2px 4px; border-radius: 3px;'
            };
            const typeStr = entry.simulated ? 'SIMULADO' : 'REAL';
            console.log(
                `%c[LOG:${entry.severity.toUpperCase()}] [${entry.action_type}] [${typeStr}] %c${entry.source_page} - ${JSON.stringify(entry.payload)}`,
                styles[entry.severity] || '',
                'color: #eee;'
            );
        }
    } catch (e) {
        console.error('[OS_LOGS_ENGINE] Falha ao persistir log localmente:', e);
    }
};

export const OS_LOGS_ENGINE = {
    createEntry: (eventType, payload = {}, severity = 'info', status = 'success', simulated = true) => {
        const session = _getCurrentSession() || {};
        const pathname = typeof window !== 'undefined' ? window.location.pathname : 'system';
        const currentProjectId = typeof window !== 'undefined' ? (localStorage.getItem('fluxai_current_project_id') || payload.project_id || payload.cliente_id || null) : null;

        return {
            timestamp: new Date().toISOString(),
            user_id: session.id || session.name || 'visitor',
            role: session.role || 'VISITOR',
            client_id: currentProjectId || 'global',
            action_type: eventType,
            source_page: pathname,
            payload: payload,
            status: status,
            severity: severity,
            environment: _detectEnv(),
            simulated: simulated
        };
    },

    userAction: function(eventType, arg2, arg3, arg4, arg5, arg6) {
        let payload = arg2;
        let simulated = arg3 !== undefined ? arg3 : true;
        let userRole = arg4;
        let projectId = arg5;
        let moduleName = null;

        // Se o segundo argumento for uma string, significa que foi chamada na assinatura longa:
        // (eventType, moduleName, payload, userRole, projectId, simulated)
        if (typeof arg2 === 'string') {
            moduleName = arg2;
            payload = arg3 || {};
            simulated = arg6 !== undefined ? arg6 : true;
            userRole = arg4;
            projectId = arg5;
        }

        const entry = OS_LOGS_ENGINE.createEntry(eventType, payload, 'info', 'success', simulated);
        
        // Sobrescrever se vier de parâmetros explícitos da chamada longa
        if (userRole) entry.role = userRole;
        if (projectId) entry.client_id = projectId;
        if (moduleName) entry.source_page = moduleName;

        _saveLog(OPERATION_LOGS_CONFIG.storageKeys.USER_ACTIONS, entry);
        return entry;
    },

    webhook: (webhookKey, payload, success, responseStatus = 200, errMessage = null, simulated = true) => {
        const eventType = success ? EVENT_TYPES.WEBHOOK_TRIGGERED : EVENT_TYPES.WEBHOOK_ERROR;
        const severity = success ? 'info' : 'warning';
        const status = success ? 'success' : 'error';
        const logPayload = {
            webhook_key: webhookKey,
            data: payload,
            status_code: responseStatus,
            error: errMessage
        };

        const entry = OS_LOGS_ENGINE.createEntry(eventType, logPayload, severity, status, simulated);
        _saveLog(OPERATION_LOGS_CONFIG.storageKeys.WEBHOOKS, entry);
        return entry;
    },

    error: (message, context = {}, errorObj = null) => {
        let realContext = context;
        let realError = errorObj;
        if (context instanceof Error) {
            realContext = context.message;
            realError = context;
        }
        const logPayload = {
            message,
            context: realContext,
            stack: realError ? realError.stack : null
        };
        const entry = OS_LOGS_ENGINE.createEntry(EVENT_TYPES.SYSTEM_ERROR, logPayload, 'warning', 'error', false);
        _saveLog(OPERATION_LOGS_CONFIG.storageKeys.ERRORS, entry);
        return entry;
    },

    security: (eventType, details = {}, severity = 'critical') => {
        const entry = OS_LOGS_ENGINE.createEntry(eventType, details, severity, 'error', false);
        _saveLog(OPERATION_LOGS_CONFIG.storageKeys.SECURITY, entry);
        return entry;
    },

    printAll: () => {
        try {
            const all = JSON.parse(localStorage.getItem(OPERATION_LOGS_CONFIG.storageKeys.ALL) || '[]');
            console.table(all);
            return all;
        } catch (e) {
            console.error(e);
        }
    },

    clearAll: () => {
        Object.values(OPERATION_LOGS_CONFIG.storageKeys).forEach(k => {
            localStorage.removeItem(k);
        });
        console.log('[OS_LOGS_ENGINE] Logs limpos com sucesso.');
    }
};

export default OS_LOGS_ENGINE;
