import { ModuleLayout } from '../../components/module-layout.js';
import { MetricCard } from '../../components/metric-card.js';
import { AlertCard } from '../../components/alert-card.js';
import { PipelineStage } from '../../components/pipeline-stage.js';
import { ActivityItem } from '../../components/activity-item.js';
import { commandCenterData } from './command-center.data.js';

export const CommandCenter = {
    init: () => {
        // 1. Iniciar Layout
        ModuleLayout.init('command-center');

        // 2. Renderizar Dados do Módulo
        CommandCenter.render();
    },

    render: () => {
        // Métricas
        commandCenterData.metrics.forEach(metric => {
            MetricCard.render(metric.id, metric);
        });

        // Alertas
        AlertCard.render('alerts-container', commandCenterData.alerts);

        // Pipeline
        PipelineStage.render('pipeline-container', commandCenterData.pipeline);

        // Atividades
        ActivityItem.render('activity-log', commandCenterData.activities);
    }
};

// Auto-init
document.addEventListener('DOMContentLoaded', () => CommandCenter.init());
