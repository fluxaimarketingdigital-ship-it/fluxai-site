/**
 * COMPONENT: Status Badge
 */

export const StatusBadge = {
    render: (status, label) => {
        const colors = {
            active: 'var(--os-success)',
            pending: 'var(--os-warning)',
            critical: 'var(--os-danger)',
            inactive: 'var(--os-text-muted)'
        };
        return `<span class="os-status-badge" style="background: ${colors[status] || colors.inactive}">${label}</span>`;
    }
};
