import { OS_UI, OS_AUTH } from '../os-core.js';
import { getSupabase } from '../../services/supabase-client.js';

async function initPage() {
    const user = await OS_AUTH.check('OPERATOR');
    if (!user) return;

    OS_UI.renderSidebar('command-center', user.role);
    await OS_UI.renderTopbar();

    await loadCommandCenter();
}

async function loadCommandCenter() {
    const supabase = getSupabase();
    if (!supabase) {
        console.error("[Command Center] Cliente Supabase não disponível.");
        // Remover loading em caso de falha crítica no cliente
        document.getElementById('metrics-grid').innerHTML = '<div style="opacity: 0.5; padding: 20px; grid-column: span 12; color: var(--os-danger);">Falha de Conexão com Banco de Dados.</div>';
        return;
    }

    try {
        // Envolve as queries em try/catch individuais para não quebrar a tela inteira se uma falhar
        const queries = [
            // 0: Clientes Ativos
            supabase.from('projects').select('id', { count: 'exact' }).eq('status', 'ATIVO').eq('workspace_type', 'CLIENT').then(res => res.error ? {count: 0, error: res.error} : res),
            // 1: Serviços Ativos (Contratos Ativos)
            supabase.from('contracts').select('id', { count: 'exact' }).eq('status', 'ATIVO').then(res => res.error ? {count: 0, error: res.error} : res),
            // 2: Auth Pendente (External Approvals)
            supabase.from('external_approvals').select('id', { count: 'exact' }).eq('status', 'PENDENTE').then(res => res.error ? {count: 0, error: res.error} : res),
            // 3: Relatórios Rascunho (Assumindo planejamento de assets)
            supabase.from('content_assets').select('id', { count: 'exact' }).eq('status', 'PLANEJAMENTO').then(res => res.error ? {count: 0, error: res.error} : res),
            // 4: Alertas Operacionais Críticos (Últimos Eventos)
            supabase.from('operational_events').select('event_type, responsible, context, created_at').order('created_at', { ascending: false }).limit(5).then(res => res.error ? {data: [], error: res.error} : res),
            // 5: Tabela de Client Health
            supabase.from('operational_events').select('*, projects(company_name)').order('created_at', { ascending: false }).limit(10).then(res => res.error ? {data: [], error: res.error} : res)
        ];

        const results = await Promise.all(queries);

        // Map Results
        const activeClients = results[0].count || 0;
        const activeServices = results[1].count || 0;
        const pendingAuths = results[2].count || 0;
        const draftReports = results[3].count || 0;
        
        // Métricas que ainda não possuem tabela definida na Fase 2
        const apisOk = 0;
        const activeWebhooks = 0;
        const manualTasks = 0;
        const pausedRoutes = 0;

        const alertsData = results[4].data || [];
        const healthData = results[5].data || [];

        // Log de erros silenciosos (Warnings)
        results.forEach((r, i) => { if (r.error) console.warn(`[Command Center] Falha na query do índice ${i}:`, r.error); });

        // Render Cards
        const grid = document.getElementById('metrics-grid');
        grid.innerHTML = `
            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header"><span class="os-widget-label">Clientes Ativos</span><i class="fa-solid fa-users" style="color:var(--os-primary)"></i></div>
                <div class="os-metric"><div class="os-metric-value">${activeClients}</div></div>
            </div>
            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header"><span class="os-widget-label">Serviços Ativos</span><i class="fa-solid fa-briefcase" style="color:var(--os-primary)"></i></div>
                <div class="os-metric"><div class="os-metric-value">${activeServices}</div></div>
            </div>
            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header"><span class="os-widget-label">APIs (Tokens OK)</span><i class="fa-solid fa-key" style="color:#10b981"></i></div>
                <div class="os-metric"><div class="os-metric-value">${apisOk}</div></div>
            </div>
            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header"><span class="os-widget-label">Webhooks Ativos</span><i class="fa-solid fa-network-wired" style="color:#10b981"></i></div>
                <div class="os-metric"><div class="os-metric-value">${activeWebhooks}</div></div>
            </div>

            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header"><span class="os-widget-label">Coletas Manuais</span><i class="fa-solid fa-hand" style="color:#f59e0b"></i></div>
                <div class="os-metric"><div class="os-metric-value">${manualTasks}</div></div>
            </div>
            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header"><span class="os-widget-label">Rotas Pausadas</span><i class="fa-solid fa-pause" style="color:#ef4444"></i></div>
                <div class="os-metric"><div class="os-metric-value">${pausedRoutes}</div></div>
            </div>
            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header"><span class="os-widget-label">Auth Pendente</span><i class="fa-solid fa-triangle-exclamation" style="color:#f59e0b"></i></div>
                <div class="os-metric"><div class="os-metric-value">${pendingAuths}</div></div>
            </div>
            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header"><span class="os-widget-label">Relatórios Rascunho</span><i class="fa-solid fa-file-signature" style="color:var(--os-primary)"></i></div>
                <div class="os-metric"><div class="os-metric-value">${draftReports}</div></div>
            </div>
        `;

        // Render Alerts
        const alertsContainer = document.getElementById('alerts-container');
        let alertsHtml = '';
        alertsData.forEach(a => {
            const isError = a.event_type && (a.event_type.includes('FALHA') || a.event_type.includes('ERRO') || a.event_type.includes('REPROVADO'));
            const color = isError ? 'var(--os-danger)' : 'var(--os-warning)';
            const icon = isError ? 'fa-triangle-exclamation' : 'fa-hand-paper';
            alertsHtml += `
            <div class="os-alert-item" style="border-left: 3px solid ${color};">
                <div class="os-alert-icon" style="color: ${color};"><i class="fa-solid ${icon}"></i></div>
                <div class="os-alert-content">
                    <h4 style="font-size:0.7rem; margin:0; color:#fff; text-transform:uppercase;">${(a.event_type || 'ALERTA').replace('_', ' ')}</h4>
                    <p style="font-size:0.6rem; margin:2px 0 0; color:var(--os-text-muted);">${a.responsible || 'Sistema'} • ${a.context || 'Ação reportada'}</p>
                </div>
            </div>`;
        });
        alertsContainer.innerHTML = alertsHtml || '<div style="opacity:0.3; text-align:center; padding:20px; font-size:0.7rem;">ESTADO OPERACIONAL ESTÁVEL</div>';

        // Render Client Health Table
        const healthContainer = document.getElementById('health-table-container');
        
        if (healthData.length === 0) {
            // Empty State Handling
            healthContainer.innerHTML = `
            <div style="padding: 40px; text-align: center; border: 1px dashed rgba(255,255,255,0.1); border-radius: 8px;">
                <i class="fa-solid fa-shield-halved" style="font-size: 2.5rem; color: var(--os-text-muted); margin-bottom: 15px; opacity: 0.3;"></i>
                <h3 style="margin: 0; font-size: 1rem; color: #fff;">Saúde Operacional Estável</h3>
                <p style="color: var(--os-text-muted); font-size: 0.8rem; margin-top: 5px;">Nenhum alerta ou inconsistência mapeada no banco de dados.</p>
            </div>`;
        } else {
            let healthHtml = `<div class="os-table-wrapper">
                <table class="os-table">
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Serviço</th>
                        <th>Status Operacional</th>
                        <th>Criticidade</th>
                        <th>Ação Recomendada</th>
                    </tr>
                </thead>
                <tbody>`;
            
            healthData.forEach(s => {
                const clientName = (s.projects && s.projects.company_name) ? s.projects.company_name : 'N/A';
                const isError = s.event_type && (s.event_type.includes('FALHA') || s.event_type.includes('ERRO'));
                const critText = isError ? 'ALTA' : 'BAIXA';
                
                let badgeStyle = isError ? 'background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3);' 
                                         : 'background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);';

                healthHtml += `<tr>
                    <td class="cell-primary">${clientName}</td>
                    <td>SISTEMA</td>
                    <td><span style="font-size:0.65rem; border:1px solid var(--os-border); padding:2px 6px; border-radius:4px;">${s.event_type || 'EVENTO'}</span></td>
                    <td><span class="os-badge" style="${badgeStyle}">${critText}</span></td>
                    <td style="color: var(--os-text-muted); font-size:0.75rem;">${s.context || '-'}</td>
                </tr>`;
            });
            healthHtml += `</tbody></table></div>`;
            healthContainer.innerHTML = healthHtml;
        }

    } catch (e) {
        console.error("[Command Center] Erro Crítico:", e);
        // Fallback visual em caso de exceção síncrona
        document.getElementById('metrics-grid').innerHTML = '<div style="opacity: 0.5; padding: 20px; grid-column: span 12; color: var(--os-danger);">Erro ao renderizar Dashboard. Verifique o console.</div>';
    }
}

initPage();
