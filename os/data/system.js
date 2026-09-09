export const OS_STATES = {
    ACTIVE: { id: "ativo", label: "Ativo", color: "#00cc66" },
    ATTENTION: { id: "atenção", label: "Atenção", color: "#ffcc00" },
    CRITICAL: { id: "crítico", label: "Crítico", color: "#ff4d4d" },
    PAUSED: { id: "pausado", label: "Pausado", color: "#888" },
    WAITING: { id: "aguardando", label: "Aguardando", color: "#4d94ff" },
    COMPLETED: { id: "concluído", label: "Concluído", color: "#00cc66" }
};

export const OS_PRIORITIES = {
    HIGH: { id: "alta", label: "Alta Prioridade", icon: "fa-circle-exclamation" },
    MEDIUM: { id: "media", label: "Prioridade Média", icon: "fa-circle-dot" },
    LOW: { id: "baixa", label: "Baixa Prioridade", icon: "fa-circle-info" }
};

export const systemConfig = {
    version: "v1.0.4_OPERATIONAL",
    lastSync: "2026-05-11T17:40:00Z",
    environment: "Produção",
    systemLabel: "FluxAI OS™"
};
