/**
 * SERVICE: Global Error Handler
 */
import { NotificationService } from './notifications.js';

export const ErrorHandler = {
    init: () => {
        window.onerror = (message, source, lineno, colno, error) => {
            ErrorHandler.handle(error || message, 'Global Exception');
        };

        window.onunhandledrejection = (event) => {
            ErrorHandler.handle(event.reason, 'Unhandled Promise Rejection');
        };
    },

    handle: (error, context = 'Operational Error') => {
        const timestamp = new Date().toISOString();
        const errorMessage = error.message || error;
        
        // 1. Log to console (Infrastructure View)
        console.error(`[FLUXAI-OS][${timestamp}][${context}]:`, error);

        // 2. Telemetry (Mock: Log to localStorage for now)
        ErrorHandler._logToTelemetry({ timestamp, context, errorMessage });

        // 3. User Feedback (Institutional/Discrete)
        NotificationService.notify(
            'Aviso de Sistema',
            'Uma instabilidade operacional foi detectada e registrada.',
            'attention'
        );
    },

    _logToTelemetry: (logEntry) => {
        try {
            const logs = JSON.parse(localStorage.getItem('os_telemetry_logs') || '[]');
            logs.unshift(logEntry);
            localStorage.setItem('os_telemetry_logs', JSON.stringify(logs.slice(0, 100)));
        } catch (e) {
            console.error('Failed to log telemetry:', e);
        }
    }
};
