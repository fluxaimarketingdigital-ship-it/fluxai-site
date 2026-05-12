/**
 * COMPONENT: Activity Item
 */

export const ActivityItem = {
    render: (containerId, activities) => {
        let html = '';
        activities.forEach(act => {
            html += `
                <div class="log-entry">
                    <span class="log-time">[${act.time}]</span>
                    <span class="log-user">${act.user}:</span>
                    <span class="log-msg">${act.message}</span>
                </div>
            `;
        });
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = html;
    }
};
