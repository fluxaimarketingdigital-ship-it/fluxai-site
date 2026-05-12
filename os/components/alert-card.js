/**
 * COMPONENT: Alert Card
 */

export const AlertCard = {
    render: (containerId, alerts) => {
        let html = '<div class="os-alert-list">';
        alerts.forEach(alert => {
            const iconColor = alert.type === 'danger' ? 'var(--os-danger)' : (alert.type === 'success' ? 'var(--os-success)' : 'var(--os-warning)');
            const icon = alert.type === 'danger' ? 'fa-circle-exclamation' : (alert.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation');
            
            html += `
                <div class="os-alert-item">
                    <div class="os-alert-icon" style="color: ${iconColor};"><i class="fa-solid ${icon}"></i></div>
                    <div class="os-alert-content">
                        <h4>${alert.title}</h4>
                        <p>${alert.message}</p>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = html;
    }
};
