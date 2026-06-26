/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  FLUXAI OS™ — NÚCLEO CENTRAL DE CONFIGURAÇÃO                        ║
 * ║  Versão: 2.1.0 | Arquivo: /os/config/os-config.js                   ║
 * ║                                                                      ║
 * ║  REGRA ABSOLUTA:                                                     ║
 * ║  Este é o único arquivo onde URLs, roles, status, webhooks,          ║
 * ║  endpoints e feature flags podem ser definidos.                      ║
 * ║  Nenhum módulo, página ou serviço pode hardcodar esses valores.      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

'use strict';

import { OS_LOGS_ENGINE } from '../services/logs-engine.js';
import { STATUS_SYSTEM, StatusEngine } from './status-system.js';


// ═══════════════════════════════════════════════════════════
// 1. AMBIENTE E IDENTIDADE DO SISTEMA
// ═══════════════════════════════════════════════════════════

/**
 * Detecta automaticamente o ambiente baseado no hostname.
 * Em produção, aponta para o domínio real.
 * Em desenvolvimento, ativa os mocks locais.
 */
const _detectEnvironment = () => {
    if (typeof window !== 'undefined' && window.FLUXAI_ENV && window.FLUXAI_ENV.FLUXAI_ENVIRONMENT) {
        return window.FLUXAI_ENV.FLUXAI_ENVIRONMENT.toUpperCase();
    }
    if (typeof window === 'undefined') return 'PRODUCTION';
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.')) return 'DEVELOPMENT';
    if (host.includes('staging') || host.includes('preview') || host.includes('vercel.app')) return 'STAGING';
    return 'PRODUCTION';
};

// [STG-04] FAIL-CLOSED ASSERTIONS
if (typeof window !== 'undefined') {
    const env = _detectEnvironment();
    const subUrl = window.FLUXAI_ENV ? window.FLUXAI_ENV.SUPABASE_URL : '';
    
    if (env === 'STAGING') {
        if (!subUrl || subUrl.includes('rmbxeikejzbcfiooylsd')) {
            document.body.innerHTML = '<div style="padding:50px;font-family:sans-serif;color:red;"><h1>🚨 FAIL-CLOSED ATIVADO</h1><p>O ambiente foi detectado como STAGING, mas a URL do Supabase aponta para Produção (rmbxeikejzbcfiooylsd) ou está ausente. Por medida de segurança (STG-04), a inicialização do OS foi abortada.</p></div>';
            throw new Error('[FAIL-CLOSED] Abortando inicialização: Risco de cross-contamination detectado.');
        }

        // [STG-04] AVISO VISUAL DE STAGING (Gate 12)
        window.addEventListener('DOMContentLoaded', () => {
            const badge = document.createElement('div');
            badge.innerHTML = 'STG — AMBIENTE DE STAGING';
            badge.style.cssText = 'position:fixed;top:0;left:0;width:100%;background:red;color:white;text-align:center;z-index:999999;font-weight:bold;padding:5px;font-family:sans-serif;';
            document.body.prepend(badge);
        });
    }
}

export const ENVIRONMENT_CONFIG = {
    current: _detectEnvironment(),
    isDev:       _detectEnvironment() === 'DEVELOPMENT',
    isStaging:   _detectEnvironment() === 'STAGING',
    isProd:      _detectEnvironment() === 'PRODUCTION',
    version:     '2.1.0',
    buildDate:   '2026-05-25',
};

// ═══════════════════════════════════════════════════════════
// 2. IDENTIDADE DO SISTEMA
// ═══════════════════════════════════════════════════════════

export const SYSTEM_IDENTITY = {
    brand:         'FLUXAI OS™',
    version:       '2.1.0',
    codename:      'CONSOLIDATED',
    status:        'ESTÁVEL',
    operatingMode: 'INFRAESTRUTURA_ESTRATÉGICA',
};

// ═══════════════════════════════════════════════════════════
// 3. FEATURE FLAGS
// ═══════════════════════════════════════════════════════════

/**
 * Controla funcionalidades por ambiente.
 * Nunca hardcode "if (mock)" dentro de módulos —
 * sempre consume FEATURE_FLAGS.mockData.
 */
export const FEATURE_FLAGS = {
    // Fonte de dados
    mockData:             ENVIRONMENT_CONFIG.isDev,   // true em dev, false em prod
    sendRealWebhooks:     false,                      // GLOBALMENTE DESATIVADO por padrão para segurança
    enabledRealWebhooks:  ['LEAD_CAPTURE', 'DEMAND_SUBMISSION', 'CLIENT_ONBOARDING', 'SERVICE_EXTRA_REQUEST', 'SERVICE_EXTRA_APPROVAL', 'AI_OPERATIONAL_CONTROL'], // Apenas estes webhooks listados disparam real (homologação gradual)
    useSupabaseAuth:      true,   // Supabase é o auth primário (fallback: mock users)
    useSheetsAPI:         false,  // Google Sheets API direta (fase 2)
    useMakeWebhooks:      true,   // Webhooks Make como canal de escrita
    useGDriveLinks:       true,   // Drive como repositório de arquivos

    // Módulos operacionais
    enablePortalCliente:  true,
    enableRelatorioMensal: true,
    enableCreditoIA:      true,
    enableCatalogo:       true,
    enableOnboarding:     true,

    // UI / UX
    enableToasts:         true,
    enableActivityLog:    true,
    enableContextSwitcher: true,

    // Tracking (apenas no site institucional e portal do cliente)
    enableGA4:            ENVIRONMENT_CONFIG.isProd,
    enableGTM:            ENVIRONMENT_CONFIG.isProd,
    enableMetaPixel:      ENVIRONMENT_CONFIG.isProd,
    enableClarityTracking: ENVIRONMENT_CONFIG.isProd,

    // Debug
    verboseLogging:       ENVIRONMENT_CONFIG.isDev,
};

// ═══════════════════════════════════════════════════════════
// 4. WEBHOOKS — MAKE.COM
// ═══════════════════════════════════════════════════════════

/**
 * REGRA: Nenhum webhook pode estar hardcoded em módulo ou página.
 * Toda chamada deve referenciar WEBHOOK_CONFIG.<chave>.
 *
 * SEGURANÇA (P0 OWASP — Resolvido em 27/05/2026):
 * As URLs reais do Make foram removidas deste arquivo público.
 * Os disparos reais são roteados via Supabase Edge Function make-proxy.
 * As URLs reais vivem exclusivamente nos Secrets do Supabase Dashboard.
 *
 * Todas as chaves abaixo são aliases lógicos (não URLs).
 * O disparo real usa: os/services/webhook-dispatcher.js
 */
import { dispatchWebhook } from '../services/webhook-dispatcher.js';

export const WEBHOOK_CONFIG = {
    // 01_FLUXAI_PORTAL_DEMANDAS
    DEMAND_SUBMISSION: 'DEMAND_SUBMISSION',

    // 02_FLUXAI_LEADS_SITE
    LEAD_CAPTURE: 'LEAD_CAPTURE',

    // 09_FLUXAI_NOVO_CLIENTE_ONBOARDING
    CLIENT_ONBOARDING: 'CLIENT_ONBOARDING',

    // 10_FLUXAI_SERVICO_EXTRA_REQUEST
    SERVICE_EXTRA_REQUEST: 'SERVICE_EXTRA_REQUEST',

    // 11_FLUXAI_IA_CREDITOS_CONTROLE
    IA_CREDITOS_CONTROLE: 'IA_CREDITOS_CONTROLE',
    AI_OPERATIONAL_CONTROL: 'AI_OPERATIONAL_CONTROL',

    // 12_FLUXAI_SERVICO_EXTRA_APROVACAO
    SERVICE_EXTRA_APPROVAL: 'SERVICE_EXTRA_APPROVAL',

    // 13_FLUXAI_IA_GUARDRAIL
    IA_GUARDRAIL: 'IA_GUARDRAIL',

    // 14_FLUXAI_CLIENTES_ARQUIVOS_SYNC
    CLIENTES_ARQUIVOS_SYNC: '',

    // 15_FLUXAI_PLANEJAMENTO_CONTEUDO
    PLANEJAMENTO_CONTEUDO: 'PLANEJAMENTO_CONTEUDO',

    // 16_FLUXAI_CALENDARIO_POSTAGENS
    CALENDARIO_POSTAGENS: 'CALENDARIO_POSTAGENS',

    // 17_FLUXAI_GPT_GERACOES_LOG
    GPT_GERACOES_LOG: 'GPT_GERACOES_LOG',

    // 18_FLUXAI_LEADS_CLIENTES
    LEADS_CLIENTES: '',

    // --- ALIASES DE COMPATIBILIDADE ---
    SERVICE_EXTRA_INTERNAL: '',
    DEMAND_STATUS_UPDATE: '',
    REPORT_STATUS_UPDATE: '',
    DELIVERY_APPROVAL: '',
    METRICS_SYNC_INBOUND: '',
    LEADS_SYNC_INBOUND: '',

    /**
     * Utilitário interno — verifica se a rota está ativa para disparo real.
     * Agora aceita aliases lógicos (string não-vazia) além de https://.
     */
    _isConfigured: (key) => {
        const val = WEBHOOK_CONFIG[key];
        return typeof val === 'string' && val.length > 0;
    },

    /**
     * POST genérico via Supabase Edge Function make-proxy.
     * A assinatura é idêntica à anterior — nenhum chamador precisa mudar.
     * Retorna { success, status, error }.
     */
    send: async (webhookKey, payload) => {
        // Redirecionamento inteligente de aliases para rotas reais
        let targetKey = webhookKey;
        if (webhookKey === 'DELIVERY_APPROVAL') {
            targetKey = (payload.type === 'PLANNING' || payload.logical_transition?.includes('planning'))
                ? 'PLANEJAMENTO_CONTEUDO'
                : 'CALENDARIO_POSTAGENS';
        } else if (webhookKey === 'SERVICE_EXTRA_INTERNAL') {
            targetKey = 'SERVICE_EXTRA_APPROVAL';
        } else if (webhookKey === 'IA_CREDITOS_CONTROLE') {
            targetKey = 'AI_OPERATIONAL_CONTROL';
        }

        const isReal = (FEATURE_FLAGS.sendRealWebhooks ||
                       (Array.isArray(FEATURE_FLAGS.enabledRealWebhooks) && FEATURE_FLAGS.enabledRealWebhooks.includes(targetKey))) &&
                       WEBHOOK_CONFIG._isConfigured(targetKey);
        const isSimulated = !isReal;

        if (typeof console !== 'undefined') {
            console.info(
                `%c[WEBHOOK:${isSimulated ? 'SIMULADO' : 'PROXY'}] Acionando ${targetKey} (origem: ${webhookKey})...`,
                'color: #8e9e68; font-weight: bold;'
            );
        }

        if (isSimulated) {
            if (typeof OS_LOGS_ENGINE !== 'undefined') {
                OS_LOGS_ENGINE.webhook(targetKey, payload, true, 200, null, true);
            }
            return { success: true, status: 200, simulated: true };
        }

        if (!WEBHOOK_CONFIG._isConfigured(targetKey)) {
            console.warn(`[WEBHOOK] ${targetKey} não configurado. Payload ignorado.`, payload);
            if (typeof OS_LOGS_ENGINE !== 'undefined') {
                OS_LOGS_ENGINE.webhook(targetKey, payload, false, 0, 'WEBHOOK_NOT_CONFIGURED', false);
            }
            return { success: false, status: 0, error: 'WEBHOOK_NOT_CONFIGURED' };
        }

        try {
            // ── Disparo real via proxy seguro (sem URLs Make no frontend) ──
            const result = await dispatchWebhook(targetKey, payload);

            if (!result.ok) {
                throw new Error(result.error || `PROXY_HTTP_${result.status}`);
            }

            if (typeof OS_LOGS_ENGINE !== 'undefined') {
                OS_LOGS_ENGINE.webhook(targetKey, payload, true, result.status, null, false);
            }
            return { success: true, status: result.status };
        } catch (err) {
            console.error(`[WEBHOOK] Erro ao enviar para ${targetKey} via proxy:`, err.message);
            if (typeof OS_LOGS_ENGINE !== 'undefined') {
                OS_LOGS_ENGINE.webhook(targetKey, payload, false, 0, err.message, false);
            }
            return { success: false, status: 0, error: err.message };
        }
    }
};

// ═══════════════════════════════════════════════════════════
// 5. SUPABASE
// ═══════════════════════════════════════════════════════════

/**
 * Configuração do Supabase.
 * Em produção, nunca expor a service_role key no frontend.
 * Apenas a anon_key é segura para uso público.
 */
export const SUPABASE_CONFIG = {
    url:     (typeof window !== 'undefined' && window.FLUXAI_ENV && window.FLUXAI_ENV.SUPABASE_URL) ? window.FLUXAI_ENV.SUPABASE_URL : 'https://rmbxeikejzbcfiooylsd.supabase.co',
    anonKey: (typeof window !== 'undefined' && window.FLUXAI_ENV && window.FLUXAI_ENV.SUPABASE_ANON_KEY) ? window.FLUXAI_ENV.SUPABASE_ANON_KEY : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11Zmd3ZXRmaGZoaG1ob3diaGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1Mzg1MDYsImV4cCI6MjA5NDExNDUwNn0.G0VxvE6acPRKZIwee7d2ARBkIdqf9SRvVI1uagMrBZI',

    // Tabelas do Supabase
    tables: {
        PROFILES:  'profiles',
        LEADS:     'crm_leads',
        PROJECTS:  'projects',
    },
};

// ═══════════════════════════════════════════════════════════
// 6. GOOGLE SHEETS
// ═══════════════════════════════════════════════════════════

/**
 * Mapeamento das abas do Google Sheets.
 * O Make lê e escreve nessas abas.
 * O FluxAI OS consome via mock (fase 1) ou via API (fase 2).
 */
export const SHEETS_CONFIG = {
    // ID da planilha principal
    spreadsheetId: '',  // Preencher com o ID da planilha Google

    // Indicador de mock — controlado por FEATURE_FLAGS
    get mockEnabled() { return FEATURE_FLAGS.mockData; },

    // Mapeamento de abas (nome exato como aparece na planilha)
    tabs: {
        CLIENTES:          '04_CLIENTES_CONFIG',
        SERVICOS:          '03_SERVICOS_CLIENTES',
        ROTAS:             'ROTAS_AUTOMACOES',
        DEMANDAS:          '07_DEMANDAS_CLIENTES',
        LEADS_SITE:        'LEADS_SITE',
        LEADS_CLIENTES:    'LEADS_CLIENTES',
        GA4:               'GA4_DIARIO',
        CLARITY:           'CLARITY_DIARIO',
        SEARCH_CONSOLE:    'SEARCH_CONSOLE_DIARIO',
        INSTAGRAM:         'INSTAGRAM_DIARIO',
        META_ADS:          'META_ADS_DIARIO',
        STATUS:            'STATUS_MONITOR_DIARIO',
        ANALISE_MENSAL:    '29_ANALISE_MENSAL_CLIENTE',
        ARQUIVOS:          'CLIENTES_ARQUIVOS',
        ESTRATEGIA:        'CLIENTES_ESTRATEGIA',
        CONTRATOS:         'CONTRATOS_CLIENTES',
        SERVICOS_EXTRAS:   'SERVICOS_EXTRAS_CLIENTES',
        DNA_GPT:           'DNA_CLIENTE_GPT',
        PLANEJAMENTO:      'PLANEJAMENTO_CONTEUDO',
        CALENDARIO:        'CALENDARIO_POSTAGENS',
        GPT_LOG:           'GPT_GERACOES_LOG',
        IA_CREDITOS:       'IA_CREDITOS_CLIENTE',
        IA_CONTROLE:       'IA_GERACOES_CONTROLE',
        CATALOGO:          'CATALOGO_SERVICOS_FLUXAI',
    }
};

// ═══════════════════════════════════════════════════════════
// 7. GOOGLE DRIVE
// ═══════════════════════════════════════════════════════════

/**
 * IDs das pastas raiz do Drive.
 * Os subdiretórios de cada cliente são criados dentro dessas pastas.
 * O FluxAI OS apenas armazena e linka — nunca faz upload direto.
 */
export const DRIVE_CONFIG = {
    rootFolderId:     '',    // Pasta raiz de todos os clientes
    templateFolderId: '',    // Modelos de pasta para novos clientes

    // Estrutura padrão de subpastas por cliente
    defaultFolderStructure: [
        'identidade_visual',
        'entregas',
        'referencias',
        'contratos',
        'documentos_estrategicos',
        'relatorios',
    ],

    // Base URL para visualização de pastas no Drive
    viewUrl: (folderId) => `https://drive.google.com/drive/folders/${folderId}`,
};

// ═══════════════════════════════════════════════════════════
// 8. ROLES — CONTROLE DE ACESSO
// ═══════════════════════════════════════════════════════════

/**
 * Definição oficial dos papéis do sistema.
 * Todo módulo deve importar ROLE_CONFIG para verificar roles.
 * Nunca usar strings literais 'ADMIN', 'OPERATOR', etc.
 */
export const ROLE_CONFIG = {
    ADMIN:    'ADMIN',
    OPERATOR: 'OPERATOR',
    CLIENT:   'CLIENT',

    // Hierarquia de acesso (maior índice = maior poder)
    hierarchy: {
        CLIENT:   1,
        OPERATOR: 2,
        ADMIN:    3,
    },

    /**
     * Verifica se o role tem acesso ao nível mínimo exigido.
     * Ex: hasAccess('OPERATOR', 'CLIENT') → true
     */
    hasAccess: (userRole, requiredRole) => {
        const h = ROLE_CONFIG.hierarchy;
        return (h[userRole] || 0) >= (h[requiredRole] || 99);
    },

    // Permissões por módulo para cada role
    permissions: {
        ADMIN: ['*'],  // Acesso total

        OPERATOR: [
            'command-center',
            'onboarding-cliente',
            'clientes',
            'demandas',
            'leads',
            'metricas',
            'relatorio-mensal',
            'onboarding',
            'content-engine',
            'crm-intelligence',
            'automation-hub',
            'analytics',
            'client-portal',
        ],

        CLIENT: [
            'client-portal',
        ],
    },

    // Contextos de visualização
    contexts: {
        MASTER: 'MASTER',  // Visão global (todos os clientes)
        LABS:   'LABS',    // Workspace interno FluxAI
        CLIENT: 'CLIENT',  // Visão de um cliente específico
    },

    // Quais roles podem acessar qual contexto
    contextAccess: {
        MASTER: ['ADMIN', 'OPERATOR'],
        LABS:   ['ADMIN', 'OPERATOR'],
        CLIENT: ['ADMIN', 'OPERATOR', 'CLIENT'],
    },
};

// ═══════════════════════════════════════════════════════════
// 9. STATUS — SISTEMA OFICIAL DE STATUS
// ═══════════════════════════════════════════════════════════

/**
 * Todos os status do sistema em um único lugar.
 * Nunca escrever strings de status manualmente nos módulos.
 * Usar STATUS_CONFIG.<categoria>.<chave>.
 */
export const STATUS_CONFIG = {

    // Status de clientes
    CLIENTE: {
        ONBOARDING:      { key: 'onboarding',      label: 'Em Onboarding',    badge: 'warning' },
        ATIVO:           { key: 'ativo',            label: 'Ativo',            badge: 'success' },
        PAUSADO:         { key: 'pausado',          label: 'Pausado',          badge: 'neutral' },
        INATIVO:         { key: 'inativo',          label: 'Inativo',          badge: 'danger'  },
    },

    // Status de leads
    LEAD: {
        NOVO:            { key: 'novo',             label: 'Novo',             badge: 'success' },
        CONTATADO:       { key: 'contatado',        label: 'Contatado',        badge: 'info'    },
        EM_NEGOCIACAO:   { key: 'em_negociacao',    label: 'Em Negociação',    badge: 'warning' },
        PROPOSTA_ENVIADA:{ key: 'proposta_enviada', label: 'Proposta Enviada', badge: 'info'    },
        CONVERTIDO:      { key: 'convertido',       label: 'Convertido',       badge: 'success' },
        PERDIDO:         { key: 'perdido',          label: 'Perdido',          badge: 'danger'  },
    },

    // Status de demandas
    DEMANDA: {
        ABERTA:          { key: 'aberta',           label: 'Aberta',           badge: 'info'    },
        EM_ANDAMENTO:    { key: 'em_andamento',     label: 'Em Andamento',     badge: 'warning' },
        AGUARDANDO:      { key: 'aguardando',       label: 'Aguardando',       badge: 'neutral' },
        ENTREGUE:        { key: 'entregue',         label: 'Entregue',         badge: 'success' },
        CANCELADA:       { key: 'cancelada',        label: 'Cancelada',        badge: 'danger'  },
    },

    // Status de serviços extras
    SERVICO_EXTRA: {
        SOLICITADO:       { key: 'solicitado',       label: 'Solicitado',       badge: 'info'    },
        EM_ORCAMENTO:     { key: 'em_orcamento',     label: 'Em Orçamento',     badge: 'neutral' },
        ORCAMENTO_ENVIADO:{ key: 'orcamento_enviado',label: 'Orçamento Enviado',badge: 'warning' },
        APROVADO:         { key: 'aprovado',         label: 'Aprovado',         badge: 'primary' },
        EM_PRODUCAO:      { key: 'em_producao',      label: 'Em Produção',      badge: 'info'    },
        ENTREGUE:         { key: 'entregue',         label: 'Entregue',         badge: 'success' },
        CANCELADO:        { key: 'cancelado',        label: 'Cancelado',        badge: 'danger'  },
        RECUSADO:         { key: 'recusado',         label: 'Recusado',         badge: 'danger'  },
    },

    // Status de relatório mensal
    RELATORIO: {
        RASCUNHO:              { key: 'rascunho',              label: 'Rascunho',              badge: 'neutral' },
        EM_REVISAO:            { key: 'em_revisao',            label: 'Em Revisão',            badge: 'info'    },
        APROVADO_INTERNAMENTE: { key: 'aprovado_internamente', label: 'Aprovado Internamente', badge: 'warning' },
        ENVIADO_AO_CLIENTE:    { key: 'enviado_ao_cliente',    label: 'Enviado ao Cliente',    badge: 'success' },
    },

    // Status de geração de IA
    GERACAO_IA: {
        RASCUNHO:         { key: 'rascunho',         label: 'Rascunho',         badge: 'neutral' },
        EM_REVISAO:       { key: 'em_revisao',       label: 'Em Revisão',       badge: 'info'    },
        APROVADO:         { key: 'aprovado',         label: 'Aprovado',         badge: 'warning' }, // ocupa o limite operacional contratado
        PUBLICADO:        { key: 'publicado',        label: 'Publicado',        badge: 'success' }, // ocupa definitivamente o limite operacional daquele ciclo/contrato
        DESCARTADO:       { key: 'descartado',       label: 'Descartado',       badge: 'neutral' }, // sem consumo (se descartado antes da aprovação) ou espaço liberado por exclusão (requer confirmação se já aprovado)
    },

    // Status de token/integração
    TOKEN: {
        ATIVO:                 { key: 'ativo',                 label: 'Ativo',                 badge: 'success' },
        AUSENTE:               { key: 'ausente',               label: 'Não Configurado',       badge: 'neutral' },
        AGUARDANDO_AUTORIZACAO:{ key: 'aguardando_autorizacao',label: 'Aguardando Autorização',badge: 'warning' },
        EXPIRADO:              { key: 'expirado',              label: 'Expirado',              badge: 'danger'  },
    },

    // Resolver label a partir de key
    resolve: (category, key) => {
        const cat = STATUS_CONFIG[category];
        if (!cat) return { label: key, badge: 'neutral' };
        const found = Object.values(cat).find(s => s.key === key);
        return found || { label: key, badge: 'neutral' };
    },
};

// ═══════════════════════════════════════════════════════════
// 10. LABELS DA INTERFACE
// ═══════════════════════════════════════════════════════════

/**
 * Textos oficiais da interface.
 * Evita inconsistências de linguagem entre páginas.
 */
export const UI_LABELS = {
    // Estados genéricos
    LOADING:           'Carregando...',
    SYNCING:           'Sincronizando...',
    EMPTY:             'Nenhum registro encontrado.',
    ERROR_GENERIC:     'Ocorreu um erro. Tente novamente.',
    ERROR_NETWORK:     'Falha de conexão. Verifique sua internet.',
    SUCCESS_SAVED:     'Salvo com sucesso.',
    SUCCESS_SENT:      'Enviado com sucesso.',
    CONFIRM_LOGOUT:    'Deseja encerrar a sessão operacional?',
    CONFIRM_DELETE:    'Esta ação não pode ser desfeita. Confirmar?',

    // Onboarding
    ONBOARDING_SAVED:  'Dados salvos localmente.',
    ONBOARDING_SENT:   'Cliente ativado e enviado ao Make.',
    ONBOARDING_ERROR:  'Erro ao ativar cliente. Tente novamente.',

    // Relatórios
    REPORT_DRAFT:      'Rascunho salvo.',
    REPORT_REVIEWED:   'Relatório marcado como revisado.',
    REPORT_APPROVED:   'Relatório aprovado internamente.',
    REPORT_SENT:       'Relatório enviado ao cliente.',

    // Serviços extras
    EXTRA_SAVED:       'Serviço extra registrado.',
    EXTRA_BUDGET_SENT: 'Orçamento enviado ao cliente.',

    // Portal do cliente
    PORTAL_REQUEST_SENT: 'Solicitação enviada. Aguarde retorno da equipe.',

    // Auth
    AUTH_ERROR:           'Credenciais inválidas.',
    AUTH_OFFLINE:         'Sistema em modo offline. Autenticação local ativa.',
    AUTH_FIRST_ACCESS:    'Defina sua chave de acesso pessoal.',
    AUTH_PASSWORD_SAVED:  'Chave de acesso definida. Bem-vindo ao FluxAI OS™.',

    // Tradução de termos técnicos (para o portal do cliente)
    GLOSSARY: {
        'lead':           'Contato Comercial',
        'pipeline':       'Esteira Comercial',
        'roas':           'Retorno sobre Investimento em Mídia',
        'cpl':            'Custo por Contato Gerado',
        'reach':          'Alcance de Publicações',
        'ctr':            'Taxa de Cliques',
        'score':          'Pontuação Estratégica',
        'onboarding':     'Configuração Inicial',
        'crm':            'Gestão de Relacionamento Comercial',
        'insight':        'Leitura Estratégica',
    },
};

// ═══════════════════════════════════════════════════════════
// 11. TRACKING E ANALYTICS
// ═══════════════════════════════════════════════════════════

/**
 * IDs de tracking. Apenas para uso no site institucional
 * e portal do cliente — NUNCA no OS interno.
 */
export const TRACKING_CONFIG = {
    ga4Id:       '',    // ex: G-XXXXXXXXXX
    gtmId:       '',    // ex: GTM-XXXXXXX
    metaPixelId: '',    // ex: 1234567890
    clarityId:   '',    // ex: xxxxxxxxxx

    // Eventos padrão de conversão
    events: {
        LEAD_CAPTURED:     'lead_captured',
        BUDGET_REQUESTED:  'budget_requested',
        CLIENT_ACTIVATED:  'client_activated',
        REPORT_SENT:       'report_sent',
    },

    // Dispara evento (wrapper seguro)
    track: (event, data = {}) => {
        if (!FEATURE_FLAGS.enableGA4) return;
        try {
            if (typeof gtag !== 'undefined') gtag('event', event, data);
        } catch (e) {
            // silencioso — tracking nunca deve quebrar a operação
        }
    },
};

// ═══════════════════════════════════════════════════════════
// 12. CONFIGURAÇÃO DA IA / GPT
// ═══════════════════════════════════════════════════════════

/**
 * Parâmetros da Camada de Inteligência GPT.
 * O cliente nunca acessa essas configs diretamente.
 */
export const GPT_CONFIG = {
    // Regras de controle de escopo contratual e consumo interno de IA
    scopeControl: {
        RASCUNHO_SEM_CONSUMO:        0,     // Gerado mas não aprovado (não ocupa limite)
        APROVADO_INTERNAMENTE:       1,     // Passa a ocupar o limite operacional contratado
        PUBLICADO_ENTREGUE:          1,     // Ocupa definitivamente o limite operacional daquele ciclo/contrato
        ESTORNO_REQUER_CONFIRMACAO: true, // Geração excluída depois de aprovada só libera espaço (espaço liberado por exclusão) mediante confirmação interna manual da equipe
    },

    // Quem pode executar ações de IA (O controle é exclusivo do operador FluxAI. O cliente não controla limites, não gera IA e não libera limite)
    governance: {
        pode_gerar:    [ROLE_CONFIG.ADMIN, ROLE_CONFIG.OPERATOR],
        pode_aprovar:  [ROLE_CONFIG.ADMIN, ROLE_CONFIG.OPERATOR],
        pode_excluir:  [ROLE_CONFIG.ADMIN, ROLE_CONFIG.OPERATOR],
        pode_publicar: [ROLE_CONFIG.ADMIN, ROLE_CONFIG.OPERATOR],
        pode_ver_prompts: [ROLE_CONFIG.ADMIN, ROLE_CONFIG.OPERATOR], // Cliente não vê prompts internos
        // CLIENT: cliente não controla limites, não gera IA, não libera limite, não vê prompts internos.
    },
};

// ═══════════════════════════════════════════════════════════
// 13. CONFIGURAÇÃO DE FLUXOS OPERACIONAIS (Mapeamento de Abas e Webhooks)
// ═══════════════════════════════════════════════════════════

export const FLOWS_CONFIG = {
    onboarding: {
        webhook: 'CLIENT_ONBOARDING',
        tabs: ['CLIENTES', 'SERVICOS', 'DNA_GPT', 'CONTRATOS'],
        initialStatus: 'onboarding',
        feedback: 'Cliente ativado e enviado ao Make.',
        logAction: 'ONBOARDING_CREATED'
    },
    servico_extra: {
        webhook: 'SERVICE_EXTRA_REQUEST',
        tabs: ['SERVICOS_EXTRAS'],
        initialStatus: 'solicitado',
        feedback: 'Solicitação enviada. Aguarde retorno da equipe.',
        logAction: 'EXTRA_SERVICE_REQUESTED'
    },
    demanda: {
        webhook: 'DEMAND_SUBMISSION',
        tabs: ['DEMANDAS'],
        initialStatus: 'aberta',
        feedback: 'Demanda enviada com sucesso.',
        logAction: 'DEMAND_SUBMITTED'
    },
    lead: {
        webhook: 'LEAD_CAPTURE',
        tabs: ['LEADS_SITE'],
        initialStatus: 'novo',
        feedback: 'Diagnóstico enviado com sucesso.',
        logAction: 'LEAD_CAPTURED'
    },
    relatorio: {
        webhook: 'REPORT_STATUS_UPDATE',
        tabs: ['ANALISE_MENSAL'],
        initialStatus: 'rascunho',
        feedback: 'Status do relatório atualizado.',
        logAction: 'REPORT_STATUS_UPDATED'
    },
    aprovacao: {
        webhook: 'DELIVERY_APPROVAL',
        tabs: ['PLANEJAMENTO', 'CALENDARIO'],
        initialStatus: 'pendente',
        feedback: 'Aprovação de entrega registrada.',
        logAction: 'DELIVERY_APPROVED'
    }
};

export const OS_CONFIG = {
    env:          ENVIRONMENT_CONFIG,
    system:       SYSTEM_IDENTITY,
    flags:        FEATURE_FLAGS,
    webhooks:     WEBHOOK_CONFIG,
    supabase:     SUPABASE_CONFIG,
    sheets:       SHEETS_CONFIG,
    drive:        DRIVE_CONFIG,
    roles:        ROLE_CONFIG,
    status:       STATUS_CONFIG,
    labels:       UI_LABELS,
    tracking:     TRACKING_CONFIG,
    gpt:          GPT_CONFIG,
    flows:        FLOWS_CONFIG,
    logs:         OS_LOGS_ENGINE,
    statusSystem: StatusEngine,
    brand:        SYSTEM_IDENTITY.brand,
    version:      SYSTEM_IDENTITY.version,
    statusStr:    SYSTEM_IDENTITY.status
};

export default OS_CONFIG;
