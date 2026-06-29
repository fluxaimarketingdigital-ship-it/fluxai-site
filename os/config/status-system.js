/**
 * FLUXAI OS™ — SISTEMA CENTRAL DE ESTADOS (STATUS_SYSTEM)
 * Versão: 2.1.0 | Arquivo: /os/config/status-system.js
 */

export const STATUS_SYSTEM = {
    // 1. Clientes
    clientes: {
        onboarding: {
            value: 'onboarding',
            label: 'Em Onboarding',
            badge: 'warning',
            color: '#f59e0b',
            description: 'Cliente em fase de configuração inicial.',
            allowedTransitions: ['ativo', 'inativo'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: 'CLIENT_ONBOARDING',
            action: 'CLIENT_STATUS_UPDATED'
        },
        ativo: {
            value: 'ativo',
            label: 'Ativo',
            badge: 'success',
            color: '#10b981',
            description: 'Cliente ativo na operação.',
            allowedTransitions: ['pausado', 'inativo'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: 'STATUS_UPDATE',
            action: 'CLIENT_STATUS_UPDATED'
        },
        pausado: {
            value: 'pausado',
            label: 'Pausado',
            badge: 'neutral',
            color: '#6b7280',
            description: 'Operações suspensas temporariamente.',
            allowedTransitions: ['ativo', 'inativo'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: 'STATUS_UPDATE',
            action: 'CLIENT_STATUS_UPDATED'
        },
        inativo: {
            value: 'inativo',
            label: 'Inativo',
            badge: 'danger',
            color: '#ef4444',
            description: 'Contrato encerrado ou inativo.',
            allowedTransitions: ['onboarding', 'ativo'],
            authorizedRoles: ['ADMIN'],
            webhook: 'STATUS_UPDATE',
            action: 'CLIENT_STATUS_UPDATED'
        }
    },

    // 2. Onboarding
    onboarding: {
        setup_inicial: {
            value: 'setup_inicial',
            label: 'Configuração Inicial',
            badge: 'neutral',
            color: '#6b7280',
            description: 'Mapeando dados da marca.',
            allowedTransitions: ['aguardando_acessos'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: '',
            action: 'ONBOARDING_STATUS_CHANGED'
        },
        aguardando_acessos: {
            value: 'aguardando_acessos',
            label: 'Aguardando Acessos',
            badge: 'warning',
            color: '#f59e0b',
            description: 'Aguardando credenciais do cliente.',
            allowedTransitions: ['validacao'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: '',
            action: 'ONBOARDING_STATUS_CHANGED'
        },
        validacao: {
            value: 'validacao',
            label: 'Validação Estratégica',
            badge: 'info',
            color: '#3b82f6',
            description: 'Aprovando DNA e diretrizes iniciais.',
            allowedTransitions: ['concluido'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: '',
            action: 'ONBOARDING_STATUS_CHANGED'
        },
        concluido: {
            value: 'concluido',
            label: 'Setup Concluído',
            badge: 'success',
            color: '#10b981',
            description: 'Onboarding finalizado, workspace ativado.',
            allowedTransitions: [],
            authorizedRoles: ['ADMIN'],
            webhook: 'CLIENT_ONBOARDING',
            action: 'ONBOARDING_STATUS_CHANGED'
        }
    },

    // 3. Demandas
    demandas: {
        aberta: {
            value: 'aberta',
            label: 'Aberta',
            badge: 'info',
            color: '#3b82f6',
            description: 'Demanda aguardando início de produção.',
            allowedTransitions: ['em_andamento', 'cancelada'],
            authorizedRoles: ['ADMIN', 'OPERATOR', 'CLIENT'],
            webhook: 'DEMAND_STATUS_UPDATE',
            action: 'DEMAND_STATUS_UPDATED'
        },
        em_andamento: {
            value: 'em_andamento',
            label: 'Em Andamento',
            badge: 'warning',
            color: '#f59e0b',
            description: 'Demanda em execução pela equipe.',
            allowedTransitions: ['aguardando', 'entregue', 'cancelada'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: 'DEMAND_STATUS_UPDATE',
            action: 'DEMAND_STATUS_UPDATED'
        },
        aguardando: {
            value: 'aguardando',
            label: 'Aguardando Resposta',
            badge: 'neutral',
            color: '#6b7280',
            description: 'Bloqueado aguardando validação ou arquivos.',
            allowedTransitions: ['em_andamento', 'entregue', 'cancelada'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: 'DEMAND_STATUS_UPDATE',
            action: 'DEMAND_STATUS_UPDATED'
        },
        entregue: {
            value: 'entregue',
            label: 'Entregue',
            badge: 'success',
            color: '#10b981',
            description: 'Entrega realizada.',
            allowedTransitions: ['em_andamento'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: 'DEMAND_STATUS_UPDATE',
            action: 'DEMAND_STATUS_UPDATED'
        },
        cancelada: {
            value: 'cancelada',
            label: 'Cancelada',
            badge: 'danger',
            color: '#ef4444',
            description: 'Demanda cancelada.',
            allowedTransitions: ['aberta'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: 'DEMAND_STATUS_UPDATE',
            action: 'DEMAND_STATUS_UPDATED'
        }
    },

    // 4. Serviços Extras
    servicos_extras: {
        solicitado: {
            value: 'solicitado',
            label: 'Solicitado',
            badge: 'info',
            color: '#3b82f6',
            description: 'Cliente solicitou o serviço avulso.',
            allowedTransitions: ['em_orcamento', 'cancelado'],
            authorizedRoles: ['ADMIN', 'OPERATOR', 'CLIENT'],
            webhook: 'SERVICE_EXTRA_REQUEST',
            action: 'EXTRA_STATUS_UPDATED'
        },
        em_orcamento: {
            value: 'em_orcamento',
            label: 'Em Orçamento',
            badge: 'neutral',
            color: '#6b7280',
            description: 'Precificação sob análise da equipe.',
            allowedTransitions: ['orcamento_enviado', 'cancelado'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: '',
            action: 'EXTRA_STATUS_UPDATED'
        },
        orcamento_enviado: {
            value: 'orcamento_enviado',
            label: 'Orçamento Enviado',
            badge: 'warning',
            color: '#f59e0b',
            description: 'Orçamento enviado para aprovação do cliente.',
            allowedTransitions: ['aprovado', 'recusado', 'cancelado'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: '',
            action: 'EXTRA_STATUS_UPDATED'
        },
        aprovado: {
            value: 'aprovado',
            label: 'Aprovado',
            badge: 'primary',
            color: '#8e9e68',
            description: 'Orçamento aprovado. Iniciar faturamento/produção.',
            allowedTransitions: ['em_producao', 'cancelado'],
            authorizedRoles: ['ADMIN', 'OPERATOR', 'CLIENT'],
            webhook: 'SERVICE_EXTRA_INTERNAL',
            action: 'EXTRA_STATUS_UPDATED'
        },
        em_producao: {
            value: 'em_producao',
            label: 'Em Produção',
            badge: 'info',
            color: '#3b82f6',
            description: 'Serviço em fase de produção.',
            allowedTransitions: ['entregue', 'cancelado'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: '',
            action: 'EXTRA_STATUS_UPDATED'
        },
        entregue: {
            value: 'entregue',
            label: 'Entregue',
            badge: 'success',
            color: '#10b981',
            description: 'Serviço extra entregue ao cliente.',
            allowedTransitions: [],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: '',
            action: 'EXTRA_STATUS_UPDATED'
        },
        cancelado: {
            value: 'cancelado',
            label: 'Cancelado',
            badge: 'danger',
            color: '#ef4444',
            description: 'Serviço cancelado.',
            allowedTransitions: [],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: '',
            action: 'EXTRA_STATUS_UPDATED'
        },
        recusado: {
            value: 'recusado',
            label: 'Recusado',
            badge: 'danger',
            color: '#ef4444',
            description: 'Orçamento recusado pelo cliente.',
            allowedTransitions: ['em_orcamento'],
            authorizedRoles: ['ADMIN', 'OPERATOR', 'CLIENT'],
            webhook: '',
            action: 'EXTRA_STATUS_UPDATED'
        }
    },

    // 5. Relatórios
    relatorios: {
        rascunho_fluxai: {
            value: 'rascunho_fluxai',
            label: 'Rascunho Interno',
            badge: 'neutral',
            color: '#6b7280',
            description: 'Relatório mensal preliminar gerado internamente.',
            allowedTransitions: ['em_revisao_estrategica'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: 'REPORT_STATUS_UPDATE',
            action: 'REPORT_DRAFT_CREATED'
        },
        em_revisao_estrategica: {
            value: 'em_revisao_estrategica',
            label: 'Em Revisão Estratégica',
            badge: 'info',
            color: '#3b82f6',
            description: 'Operador editando e revisando dados.',
            allowedTransitions: ['aprovado_interno'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: 'REPORT_STATUS_UPDATE',
            action: 'REPORT_REVIEW_STARTED'
        },
        aprovado_interno: {
            value: 'aprovado_interno',
            label: 'Aprovado Interno',
            badge: 'warning',
            color: '#f59e0b',
            description: 'Aprovado internamente pela diretoria.',
            allowedTransitions: ['liberado_cliente'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: 'REPORT_STATUS_UPDATE',
            action: 'REPORT_APPROVED_INTERNAL'
        },
        liberado_cliente: {
            value: 'liberado_cliente',
            label: 'Liberado p/ Envio',
            badge: 'primary',
            color: '#8b5cf6',
            description: 'Pronto para ser enviado ao cliente.',
            allowedTransitions: ['enviado_cliente'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: 'REPORT_STATUS_UPDATE',
            action: 'REPORT_STATUS_UPDATED'
        },
        enviado_cliente: {
            value: 'enviado_cliente',
            label: 'Enviado ao Cliente',
            badge: 'success',
            color: '#10b981',
            description: 'Disponibilizado para visualização do cliente.',
            allowedTransitions: ['arquivado'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: 'REPORT_STATUS_UPDATE',
            action: 'REPORT_SENT_CLIENT'
        },
        arquivado: {
            value: 'arquivado',
            label: 'Arquivado',
            badge: 'neutral',
            color: '#4b5563',
            description: 'Relatório arquivado.',
            allowedTransitions: [],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: 'REPORT_STATUS_UPDATE',
            action: 'REPORT_STATUS_UPDATED'
        }
    },

    // 6. Conteúdos (Mesa Editorial)
    conteudos: {
        draft_planning: { value: 'draft_planning', label: 'Rascunho / Pauta', badge: 'neutral', color: '#6b7280', description: 'Pauta inicial ou rascunho.', allowedTransitions: ['internal_review', 'client_review_planning', 'client_revision_planning', 'planning_approved'], authorizedRoles: ['ADMIN', 'OPERATOR', 'CLIENT'] },
        internal_review: { value: 'internal_review', label: 'Revisão Interna', badge: 'warning', color: '#f59e0b', description: 'Em revisão pelo time estratégico.', allowedTransitions: ['internal_revision', 'client_review_planning'], authorizedRoles: ['ADMIN', 'OPERATOR'] },
        internal_revision: { value: 'internal_revision', label: 'Ajuste Interno', badge: 'warning', color: '#d97706', description: 'Correções internas de pauta.', allowedTransitions: ['internal_review'], authorizedRoles: ['ADMIN', 'OPERATOR'] },
        client_review_planning: { value: 'client_review_planning', label: 'Aprovação do Cliente', badge: 'info', color: '#3b82f6', description: 'Aguardando cliente aprovar a pauta.', allowedTransitions: ['client_revision_planning', 'planning_approved'], authorizedRoles: ['ADMIN', 'OPERATOR'] },
        client_revision_planning: { value: 'client_revision_planning', label: 'Ajuste Solicitado', badge: 'danger', color: '#ef4444', description: 'Cliente pediu ajustes na pauta.', allowedTransitions: ['internal_review', 'client_review_planning'], authorizedRoles: ['ADMIN', 'OPERATOR', 'CLIENT'] },
        planning_approved: { value: 'planning_approved', label: 'Pauta Aprovada', badge: 'success', color: '#10b981', description: 'Pauta pronta para produção.', allowedTransitions: ['production_queue'], authorizedRoles: ['ADMIN', 'OPERATOR'] },
        production_queue: { value: 'production_queue', label: 'Fila de Produção', badge: 'neutral', color: '#6b7280', description: 'Aguardando design ou audiovisual.', allowedTransitions: ['in_production'], authorizedRoles: ['ADMIN', 'OPERATOR'] },
        in_production: { value: 'in_production', label: 'Em Produção', badge: 'warning', color: '#f59e0b', description: 'Artes e vídeos sendo gerados.', allowedTransitions: ['internal_qa', 'client_review_content'], authorizedRoles: ['ADMIN', 'OPERATOR'] },
        internal_qa: { value: 'internal_qa', label: 'QA Interno', badge: 'info', color: '#8b5cf6', description: 'Controle de qualidade interno da FluxAI.', allowedTransitions: ['client_review_content', 'in_production'], authorizedRoles: ['ADMIN', 'OPERATOR'] },
        client_review_content: { value: 'client_review_content', label: 'Aprovação da Arte', badge: 'info', color: '#3b82f6', description: 'Aguardando aprovação final da arte/vídeo pelo cliente.', allowedTransitions: ['client_revision_content', 'content_approved'], authorizedRoles: ['ADMIN', 'OPERATOR'] },
        client_revision_content: { value: 'client_revision_content', label: 'Ajuste de Arte', badge: 'danger', color: '#ef4444', description: 'Cliente pediu ajustes na arte.', allowedTransitions: ['in_production', 'client_review_content'], authorizedRoles: ['ADMIN', 'OPERATOR', 'CLIENT'] },
        content_approved: { value: 'content_approved', label: 'Conteúdo Aprovado', badge: 'primary', color: '#8e9e68', description: 'Material final aprovado.', allowedTransitions: ['ready_to_post'], authorizedRoles: ['ADMIN', 'OPERATOR'] },
        ready_to_post: { value: 'ready_to_post', label: 'Pronto para Publicar', badge: 'success', color: '#10b981', description: 'Agendado ou pronto para postagem.', allowedTransitions: ['posted'], authorizedRoles: ['ADMIN', 'OPERATOR'] },
        posted: { value: 'posted', label: 'Publicado', badge: 'success', color: '#10b981', description: 'Postado nas redes.', allowedTransitions: [], authorizedRoles: ['ADMIN', 'OPERATOR'] }
    },

    // 7. Geração IA
    geracao_ia: {
        rascunho: {
            value: 'rascunho',
            label: 'Rascunho',
            badge: 'neutral',
            color: '#6b7280',
            description: 'Gerado como rascunho. Não ocupa limite operacional.',
            allowedTransitions: ['em_revisao', 'descartado'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: 'AI_OPERATIONAL_CONTROL',
            action: 'AI_GENERATION_STATUS'
        },
        em_revisao: {
            value: 'em_revisao',
            label: 'Em Revisão',
            badge: 'info',
            color: '#3b82f6',
            description: 'Em revisão pelo operador. Não ocupa limite operacional.',
            allowedTransitions: ['aprovado', 'descartado'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: 'AI_OPERATIONAL_CONTROL',
            action: 'AI_GENERATION_STATUS'
        },
        aprovado: {
            value: 'aprovado',
            label: 'Aprovado Interno',
            badge: 'warning',
            color: '#f59e0b',
            description: 'Aprovado internamente, ocupa o limite operacional contratado.',
            allowedTransitions: ['aguardando_publicacao', 'descartado'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: 'AI_OPERATIONAL_CONTROL',
            action: 'AI_GENERATION_APPROVED'
        },
        aguardando_publicacao: {
            value: 'aguardando_publicacao',
            label: 'Aguardando Publicação',
            badge: 'warning',
            color: '#d97706',
            description: 'Aguardando publicação. Ocupa o limite operacional contratado.',
            allowedTransitions: ['publicado', 'descartado'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: 'AI_OPERATIONAL_CONTROL',
            action: 'AI_GENERATION_STATUS'
        },
        publicado: {
            value: 'publicado',
            label: 'Publicado',
            badge: 'success',
            color: '#10b981',
            description: 'Publicado ou entregue, ocupa definitivamente o limite operacional daquele ciclo/contrato.',
            allowedTransitions: [],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: 'AI_OPERATIONAL_CONTROL',
            action: 'AI_GENERATION_STATUS'
        },
        descartado: {
            value: 'descartado',
            label: 'Descartado',
            badge: 'neutral',
            color: '#6b7280',
            description: 'Descartado pelo operador.',
            allowedTransitions: [],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: 'AI_OPERATIONAL_CONTROL',
            action: 'AI_GENERATION_DELETED'
        }
    },

    // 8. Aprovações
    aprovacoes: {
        pendente: {
            value: 'pendente',
            label: 'Pendente',
            badge: 'warning',
            color: '#f59e0b',
            description: 'Aguardando decisão.',
            allowedTransitions: ['aprovado', 'alteracao', 'rejeitado'],
            authorizedRoles: ['ADMIN', 'OPERATOR', 'CLIENT'],
            webhook: '',
            action: 'APPROVAL_STATUS'
        },
        aprovado: {
            value: 'aprovado',
            label: 'Aprovado',
            badge: 'success',
            color: '#10b981',
            description: 'Material aprovado.',
            allowedTransitions: [],
            authorizedRoles: ['ADMIN', 'OPERATOR', 'CLIENT'],
            webhook: 'DELIVERY_APPROVAL',
            action: 'DELIVERY_APPROVED'
        },
        alteracao: {
            value: 'alteracao',
            label: 'Ajuste Solicitado',
            badge: 'warning',
            color: '#f59e0b',
            description: 'Alterações solicitadas pelo cliente.',
            allowedTransitions: ['pendente'],
            authorizedRoles: ['ADMIN', 'OPERATOR', 'CLIENT'],
            webhook: 'DELIVERY_APPROVAL',
            action: 'DELIVERY_REJECTED'
        },
        rejeitado: {
            value: 'rejeitado',
            label: 'Rejeitado',
            badge: 'danger',
            color: '#ef4444',
            description: 'Reprovado completamente.',
            allowedTransitions: ['pendente'],
            authorizedRoles: ['ADMIN', 'OPERATOR', 'CLIENT'],
            webhook: 'DELIVERY_APPROVAL',
            action: 'DELIVERY_REJECTED'
        }
    },

    // 9. Integrações / Tokens
    integracoes: {
        ativo: {
            value: 'ativo',
            label: 'Ativo',
            badge: 'success',
            color: '#10b981',
            description: 'Integração ativa e funcional.',
            allowedTransitions: ['ausente', 'expirado'],
            authorizedRoles: ['ADMIN'],
            webhook: '',
            action: 'INTEGRATION_STATUS'
        },
        ausente: {
            value: 'ausente',
            label: 'Não Configurado',
            badge: 'neutral',
            color: '#6b7280',
            description: 'Chave ou token ausente.',
            allowedTransitions: ['aguardando_autorizacao', 'ativo'],
            authorizedRoles: ['ADMIN'],
            webhook: '',
            action: 'INTEGRATION_STATUS'
        },
        aguardando_autorizacao: {
            value: 'aguardando_autorizacao',
            label: 'Aguardando Autorização',
            badge: 'warning',
            color: '#f59e0b',
            description: 'Permissão pendente no canal.',
            allowedTransitions: ['ativo', 'expirado', 'ausente'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: '',
            action: 'INTEGRATION_STATUS'
        },
        expirado: {
            value: 'expirado',
            label: 'Expirado',
            badge: 'danger',
            color: '#ef4444',
            description: 'Token expirou. Requer re-autenticação.',
            allowedTransitions: ['aguardando_autorizacao', 'ativo'],
            authorizedRoles: ['ADMIN'],
            webhook: '',
            action: 'INTEGRATION_STATUS'
        }
    },

    // 10. Automações
    automacoes: {
        ativa: {
            value: 'ativa',
            label: 'Ativa',
            badge: 'success',
            color: '#10b981',
            description: 'Automação rodando em produção.',
            allowedTransitions: ['inativa', 'falha', 'manutencao'],
            authorizedRoles: ['ADMIN'],
            webhook: '',
            action: 'AUTOMATION_STATUS'
        },
        inativa: {
            value: 'inativa',
            label: 'Inativa',
            badge: 'neutral',
            color: '#6b7280',
            description: 'Desabilitada manualmente.',
            allowedTransitions: ['ativa', 'manutencao'],
            authorizedRoles: ['ADMIN'],
            webhook: '',
            action: 'AUTOMATION_STATUS'
        },
        falha: {
            value: 'falha',
            label: 'Falha Crítica',
            badge: 'danger',
            color: '#ef4444',
            description: 'Interrompida devido a erros consecutivos.',
            allowedTransitions: ['ativa', 'manutencao'],
            authorizedRoles: ['ADMIN'],
            webhook: '',
            action: 'AUTOMATION_STATUS'
        },
        manutencao: {
            value: 'manutencao',
            label: 'Manutenção',
            badge: 'warning',
            color: '#f59e0b',
            description: 'Sob ajustes ou updates de infraestrutura.',
            allowedTransitions: ['ativa', 'inativa'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: '',
            action: 'AUTOMATION_STATUS'
        }
    },
    
    // 11. Leads
    leads: {
        novo: {
            value: 'novo',
            label: 'Novo',
            badge: 'success',
            color: '#10b981',
            description: 'Lead capturado recentemente.',
            allowedTransitions: ['qualificado', 'em_negociacao', 'perdido'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: 'LEAD_CAPTURE',
            action: 'LEAD_UPDATED'
        },
        qualificado: {
            value: 'qualificado',
            label: 'Qualificado',
            badge: 'info',
            color: '#3b82f6',
            description: 'Lead qualificado após triagem.',
            allowedTransitions: ['em_negociacao', 'perdido'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: 'LEAD_CAPTURE',
            action: 'LEAD_UPDATED'
        },
        em_negociacao: {
            value: 'em_negociacao',
            label: 'Em Negociação',
            badge: 'warning',
            color: '#f59e0b',
            description: 'Negociação comercial em andamento.',
            allowedTransitions: ['proposta_enviada', 'convertido', 'perdido'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: 'LEAD_CAPTURE',
            action: 'LEAD_UPDATED'
        },
        proposta_enviada: {
            value: 'proposta_enviada',
            label: 'Proposta Enviada',
            badge: 'info',
            color: '#3b82f6',
            description: 'Proposta comercial enviada.',
            allowedTransitions: ['convertido', 'perdido'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: 'LEAD_CAPTURE',
            action: 'LEAD_UPDATED'
        },
        convertido: {
            value: 'convertido',
            label: 'Convertido',
            badge: 'success',
            color: '#10b981',
            description: 'Lead convertido em cliente.',
            allowedTransitions: [],
            authorizedRoles: ['ADMIN'],
            webhook: 'CLIENT_ONBOARDING',
            action: 'LEAD_CONVERTED'
        },
        perdido: {
            value: 'perdido',
            label: 'Perdido',
            badge: 'danger',
            color: '#ef4444',
            description: 'Negociação sem sucesso.',
            allowedTransitions: ['novo'],
            authorizedRoles: ['ADMIN', 'OPERATOR'],
            webhook: 'LEAD_CAPTURE',
            action: 'LEAD_UPDATED'
        }
    }
};

// Mapeamentos diretos
export const STATUS_LABELS = {};
export const STATUS_BADGES = {};
export const STATUS_COLORS = {};
export const STATUS_TRANSITIONS = {};
export const STATUS_PERMISSIONS = {};
export const STATUS_DESCRIPTIONS = {};

// Popular os mapeamentos a partir de STATUS_SYSTEM para manter DRY
Object.keys(STATUS_SYSTEM).forEach(category => {
    STATUS_LABELS[category] = {};
    STATUS_BADGES[category] = {};
    STATUS_COLORS[category] = {};
    STATUS_TRANSITIONS[category] = {};
    STATUS_PERMISSIONS[category] = {};
    STATUS_DESCRIPTIONS[category] = {};

    Object.keys(STATUS_SYSTEM[category]).forEach(key => {
        const item = STATUS_SYSTEM[category][key];
        STATUS_LABELS[category][key] = item.label;
        STATUS_BADGES[category][key] = item.badge;
        STATUS_COLORS[category][key] = item.color;
        STATUS_TRANSITIONS[category][key] = item.allowedTransitions;
        STATUS_PERMISSIONS[category][key] = item.authorizedRoles;
        STATUS_DESCRIPTIONS[category][key] = item.description;
    });
});

export const StatusEngine = {
    resolve: (category, key) => {
        const cat = STATUS_SYSTEM[category];
        if (!cat) return { value: key, label: key, badge: 'neutral', color: '#6b7280', description: '' };
        
        const normalize = (k) => String(k).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_');
        const cleanKey = normalize(key);
        const found = Object.values(cat).find(s => normalize(s.value) === cleanKey || normalize(s.label) === cleanKey);
        
        return found || { value: key, label: String(key).replace(/_/g, ' '), badge: 'neutral', color: '#6b7280', description: '' };
    },

    renderBadge: (category, key) => {
        const res = StatusEngine.resolve(category, key);
        return `<span class="os-badge os-badge-${res.badge}" style="background-color: ${res.color}15; border-color: ${res.color}50; color: ${res.color};">${res.label}</span>`;
    },

    validateTransition: (category, current, target, role = 'CLIENT') => {
        const cat = STATUS_SYSTEM[category];
        if (!cat) return { valid: false, reason: `Categoria '${category}' não encontrada.` };

        const currentStatus = Object.values(cat).find(s => normalize(s.value) === normalize(current) || normalize(s.label) === normalize(current));
        const targetStatus = Object.values(cat).find(s => normalize(s.value) === normalize(target) || normalize(s.label) === normalize(target));

        function normalize(k) {
            return String(k).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_');
        }

        if (!targetStatus) return { valid: false, reason: `Status de destino '${target}' inválido.` };
        if (!currentStatus) return { valid: true }; // Se não há status atual definido, permite transição livre de início

        // Verificar transição permitida
        if (currentStatus.allowedTransitions && currentStatus.allowedTransitions.length > 0 && !currentStatus.allowedTransitions.map(t => normalize(t)).includes(normalize(targetStatus.value))) {
            return { valid: false, reason: `Transição de '${currentStatus.label}' para '${targetStatus.label}' não é permitida.` };
        }

        // Verificar permissão de role
        if (targetStatus.authorizedRoles && !targetStatus.authorizedRoles.includes(role)) {
            return { valid: false, reason: `Perfil '${role}' não tem permissão para transicionar para o status '${targetStatus.label}'.` };
        }

        return { valid: true };
    },

    transition: async (category, itemId, current, target, session = {}) => {
        const role = session.role || 'CLIENT';
        const validation = StatusEngine.validateTransition(category, current, target, role);
        if (!validation.valid) {
            console.error(`[STATUS_SYSTEM] Transição inválida: ${validation.reason}`);
            return { success: false, error: validation.reason };
        }

        const targetStatus = StatusEngine.resolve(category, target);
        console.log(`[STATUS_SYSTEM] Transição bem-sucedida para '${category}' item ID '${itemId}': ${current} -> ${target}`);
        
        return {
            success: true,
            webhook: targetStatus.webhook || null,
            action: targetStatus.action || 'STATUS_CHANGED'
        };
    }
};

export default {
    system: STATUS_SYSTEM,
    labels: STATUS_LABELS,
    badges: STATUS_BADGES,
    colors: STATUS_COLORS,
    transitions: STATUS_TRANSITIONS,
    permissions: STATUS_PERMISSIONS,
    descriptions: STATUS_DESCRIPTIONS,
    engine: StatusEngine
};
