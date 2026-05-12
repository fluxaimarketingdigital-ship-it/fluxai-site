/**
 * SERVICE: Notifications (Toast System)
 */

export const NotificationService = {
    notify: (title, message, type = 'info') => {
        const container = NotificationService._getContainer();
        const toast = document.createElement('div');
        toast.className = `os-toast toast-${type}`;
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fa-solid ${NotificationService._getIcon(type)}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">&times;</button>
        `;

        container.appendChild(toast);

        // Auto-remove
        setTimeout(() => {
            toast.classList.add('toast-exit');
            setTimeout(() => toast.remove(), 300);
        }, 5000);

        toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
    },

    _getContainer: () => {
        let container = document.querySelector('.os-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'os-toast-container';
            document.body.appendChild(container);
        }
        return container;
    },

    _getIcon: (type) => {
        switch (type) {
            case 'info': return 'fa-circle-info';
            case 'attention': return 'fa-triangle-exclamation';
            case 'critical': return 'fa-circle-exclamation';
            default: return 'fa-circle-info';
        }
    }
};
