export const commandCenterData = {
    systemStatus: {
        uptime: "99.98%",
        lastUpdate: "2026-05-11T17:30:00Z",
        health: "Healthy",
        activeThreads: 12
    },
    metrics: [
        {
            id: "lead-velocity",
            label: "Lead Velocity",
            value: "14.2/day",
            trend: "+12%",
            status: "optimal",
            module: "CRM Intelligence",
            actionRequired: false
        },
        {
            id: "content-efficiency",
            label: "Content Efficiency",
            value: "88%",
            trend: "-2%",
            status: "warning",
            module: "Content Engine",
            actionRequired: true,
            actionLabel: "Review Underperforming Assets"
        },
        {
            id: "system-latency",
            label: "System Latency",
            value: "120ms",
            trend: "stable",
            status: "optimal",
            module: "Automation Hub",
            actionRequired: false
        }
    ],
    alerts: [
        {
            id: "alt-01",
            type: "critical",
            title: "API Connection Dropped",
            module: "CRM",
            timestamp: "10m ago",
            priority: "high"
        },
        {
            id: "alt-02",
            type: "info",
            title: "New Content Batch Approved",
            module: "Content",
            timestamp: "1h ago",
            priority: "low"
        }
    ],
    activePipeline: [
        { id: "p-01", stage: "Diagnostic", leads: 8, status: "active" },
        { id: "p-02", stage: "Onboarding", leads: 3, status: "pending" },
        { id: "p-03", stage: "Production", leads: 12, status: "active" },
        { id: "p-04", stage: "Delivery", leads: 5, status: "completed" }
    ],
    recentActivities: [
        { user: "Admin", action: "Updated CRM Protocols", time: "25m ago" },
        { user: "System", action: "Auto-scaled Automation Cluster", time: "1h ago" },
        { user: "Agent_GPT", action: "Generated 5 Content Briefs", time: "2h ago" }
    ]
};
