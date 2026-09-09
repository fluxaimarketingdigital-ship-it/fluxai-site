// O adapter transforma o dado bruto da planilha para um formato consumível pelo OS

export const SheetsAdapter = {
    parseClients: (rawData) => {
        return rawData.map(row => ({
            id: row.cliente_id,
            name: row.nome_cliente,
            status: row.status_ativo,
            instagram: row.instagram_profile,
            website: row.website,
            tokenStatus: row.token_auth_status,
            createdAt: row.data_entrada
        }));
    },
    parseServices: (rawData) => {
        return rawData.map(row => ({
            clientId: row.cliente_id,
            serviceName: row.servico,
            status: row.status_servico,
            collectionMode: row.modo_coleta // automatico, manual
        }));
    },
    parseRoutes: (rawData) => {
        return rawData.map(row => ({
            routeId: row.id_rota,
            clientId: row.cliente_id,
            routeName: row.nome_rota,
            status: row.status_rota // ativa, pausada, aguardando_autorizacao
        }));
    },
    parseDemands: (rawData) => {
        return rawData.map(row => ({
            id: row.id_demanda,
            clientId: row.cliente_id,
            title: row.titulo,
            priority: row.prioridade,
            deadline: row.prazo,
            status: row.status,
            responsible: row.responsavel,
            date: row.data_solicitacao
        }));
    },
    parseLeads: (rawData) => {
        return rawData.map(row => ({
            id: row.id_lead,
            name: row.nome_lead,
            company: row.empresa,
            contact: row.contato,
            serviceOfInterest: row.servico_interesse,
            origin: row.origem,
            status: row.status,
            responsible: row.responsavel
        }));
    },
    parseMonthlyAnalysis: (rawData) => {
        return rawData.map(row => ({
            id: row.id_relatorio,
            month: row.mes_referencia,
            clientId: row.cliente_id,
            followers: row.seguidores_fim_mes,
            reach: row.alcance,
            profileVisits: row.visitas_perfil,
            clicks: row.cliques,
            contentPublished: row.conteudos_publicados,
            executiveDiagnostic: row.diagnostico_executivo,
            nextMonthDecision: row.decisao_proximo_mes,
            priorities: row.prioridades,
            status: row.status_relatorio // rascunho, em_revisao, aprovado_internamente, enviado_ao_cliente
        }));
    },
    parseMetrics: (rawData) => {
        // Agrupa os diferentes tipos de métricas
        return rawData;
    }
};
