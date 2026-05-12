/**
 * COMPONENT: Metric Card
 */

export const MetricCard = {
    render: (containerId, data) => {
        const trendClass = data.trend.startsWith('+') ? 'trend-up' : 'trend-down';
        const trendIcon = data.trend.startsWith('+') ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';
        
        const html = `
            <div class="os-widget-header">
                <span class="os-widget-label">${data.label}</span>
                <i class="fa-solid ${trendIcon} ${trendClass}"></i>
            </div>
            <div class="os-metric">
                <div class="os-metric-value">${data.value}</div>
                <div class="os-metric-meta">
                    <span class="${trendClass}">${data.trend}</span> 
                    <span style="color: var(--os-text-muted);">${data.meta}</span>
                </div>
            </div>`;
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = html;
    }
};
