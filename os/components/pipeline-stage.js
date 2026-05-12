/**
 * COMPONENT: Pipeline Stage
 */

export const PipelineStage = {
    render: (containerId, stages) => {
        let html = '';
        stages.forEach(stage => {
            html += `
                <div class="os-pipeline-stage">
                    <span class="stage-label">${stage.label}</span>
                    <div class="stage-track">
                        <div class="stage-progress" style="width: ${stage.progress}%;"></div>
                    </div>
                    <span class="stage-value">${stage.value}</span>
                </div>
            `;
        });
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = html;
    }
};
