import { mockCatalogoServicos } from './catalogo.data.js';

export const ClientOnboardingSchema = {
    blocks: {
        principal: {
            id: 'bloco-1',
            title: '1. Dados Principais',
            fields: [
                { name: 'client_id', label: 'ID do Cliente (único)', type: 'text', required: true },
                { name: 'client_name', label: 'Nome Interno', type: 'text', required: true },
                { name: 'nome_comercial', label: 'Nome Comercial', type: 'text', required: true },
                { name: 'responsavel_cliente', label: 'Responsável (Cliente)', type: 'text', required: true },
                { name: 'email', label: 'E-mail Principal', type: 'email', required: true },
                { name: 'telefone', label: 'Telefone / WhatsApp', type: 'text', required: true },
                { name: 'site', label: 'Website URL', type: 'url', required: false },
                { name: 'instagram', label: 'Instagram (@)', type: 'text', required: false },
                { name: 'status', label: 'Status Inicial', type: 'select', options: ['ativo', 'inativo', 'onboarding'], default: 'onboarding' },
                { name: 'data_inicio', label: 'Data de Início', type: 'date', required: true }
            ]
        },
        contrato: {
            id: 'bloco-2',
            title: '2. Contrato',
            fields: [
                { name: 'drive_contrato', label: 'URL do Contrato (Drive)', type: 'url' },
                { name: 'valor_global', label: 'Valor Global / MRR', type: 'text' },
                { name: 'vigencia_meses', label: 'Vigência (Meses)', type: 'number' },
                { name: 'dia_vencimento', label: 'Dia de Vencimento', type: 'number' },
                { name: 'observacao_contrato', label: 'Condições Especiais', type: 'textarea' }
            ]
        },
        servicos: {
            id: 'bloco-3',
            title: '3. Serviços Contratados (Base)',
            options: [
                { value: 'instagram', label: 'Gestão de Instagram' },
                { value: 'meta_ads', label: 'Meta Ads' },
                { value: 'site', label: 'Manutenção de Site' },
                { value: 'leads_site', label: 'Captação Leads Site' },
                { value: 'portal_demandas', label: 'Portal de Demandas' },
                { value: 'conteudo', label: 'Produção de Conteúdo' },
                { value: 'crm', label: 'Consultoria CRM' },
                { value: 'automacao', label: 'Automação (Make/Zapier)' },
                { value: 'relatorio_mensal', label: 'Relatório Mensal de Performance' }
            ],
            subFields: [
                { name: 'status_servico', label: 'Status', type: 'select', options: ['ativo', 'pausado', 'cancelado'], default: 'ativo' },
                { name: 'modo_coleta', label: 'Modo de Coleta', type: 'select', options: ['api', 'manual', 'webhook', 'nao_aplicavel'], default: 'nao_aplicavel' },
                { name: 'fonte_dados', label: 'Fonte de Dados', type: 'text' },
                { name: 'aba_destino', label: 'Aba Destino (Sheets)', type: 'text' },
                { name: 'relatorio_incluir', label: 'Incluir no Relatório?', type: 'select', options: ['sim', 'nao'], default: 'nao' },
                { name: 'frequencia', label: 'Frequência Operacional', type: 'select', options: ['diario', 'semanal', 'mensal', 'sob_demanda'] },
                { name: 'responsavel', label: 'Responsável (FluxAI)', type: 'text' }
            ]
        },
        servicos_extras: {
            id: 'bloco-4',
            title: '4. Serviços Extras Possíveis / Ativos',
            catalogo: mockCatalogoServicos,
            subFields: [
                { name: 'status_extra', label: 'Status do Extra', type: 'select', options: ['solicitado', 'em_orcamento', 'orcamento_enviado', 'aprovado', 'em_producao', 'entregue', 'cancelado', 'recusado'], default: 'em_orcamento' },
                { name: 'valor_estimado', label: 'Valor Estimado', type: 'text' },
                { name: 'valor_aprovado', label: 'Valor Aprovado', type: 'text' },
                { name: 'descricao_personalizada', label: 'Descrição / Escopo Customizado', type: 'textarea' }
            ]
        },
        arquivos: {
            id: 'bloco-5',
            title: '5. Pastas e Arquivos do Drive',
            fields: [
                { name: 'drive_pasta_cliente', label: 'URL da Pasta Raiz do Cliente', type: 'url' },
                { name: 'drive_identidade_visual', label: 'URL da Identidade Visual', type: 'url' },
                { name: 'drive_logo_principal', label: 'URL da Logo Principal', type: 'url' },
                { name: 'drive_logo_secundaria', label: 'URL da Logo Secundária', type: 'url' },
                { name: 'drive_referencias', label: 'URL da Pasta de Referências', type: 'url' },
                { name: 'drive_entregas', label: 'URL da Pasta de Entregas', type: 'url' },
                { name: 'drive_documentos_estrategicos', label: 'URL da Pasta de Docs Estratégicos', type: 'url' }
            ]
        },
        dna: {
            id: 'bloco-6',
            title: '6. DNA Estratégico do Cliente',
            fields: [
                { name: 'objetivo_principal', label: 'Objetivo Principal (Macro)', type: 'textarea' },
                { name: 'prioridade_comercial', label: 'Prioridade Comercial atual', type: 'text' },
                { name: 'publico_alvo', label: 'Público Alvo Principal', type: 'textarea' },
                { name: 'oferta_principal', label: 'Oferta/Produto Principal', type: 'text' },
                { name: 'dor_mais_forte', label: 'Dor mais forte resolvida', type: 'textarea' },
                { name: 'diferencial_real', label: 'Diferencial Real', type: 'textarea' },
                { name: 'risco_atual', label: 'Maior risco atual da operação', type: 'textarea' },
                { name: 'oportunidade_estrategica', label: 'Oportunidade Estratégica Rápida', type: 'textarea' }
            ]
        },
        regras_comunicacao: {
            id: 'bloco-7',
            title: '7. Regras de Comunicação',
            fields: [
                { name: 'tom_de_voz', label: 'Tom de Voz', type: 'text' },
                { name: 'palavras_proibidas', label: 'Palavras Proibidas (Anti-patterns)', type: 'textarea' },
                { name: 'formatacao_exigida', label: 'Formatação Exigida (Ex: emojis, tamanhos)', type: 'textarea' }
            ]
        },
        canais: {
            id: 'bloco-8',
            title: '8. Canais e Permissões',
            fields: [
                { name: 'facebook_page_id', label: 'Facebook Page ID', type: 'text' },
                { name: 'instagram_business_id', label: 'Instagram Business ID', type: 'text' },
                { name: 'meta_ad_account_id', label: 'Meta Ad Account ID', type: 'text' },
                { name: 'ga4_property_id', label: 'GA4 Property ID', type: 'text' },
                { name: 'gtm_id', label: 'GTM ID', type: 'text' },
                { name: 'clarity_project_id', label: 'Clarity Project ID', type: 'text' },
                { name: 'search_console_property', label: 'Search Console Property', type: 'text' },
                { name: 'token_status', label: 'Status Geral do Token', type: 'select', options: ['ativo', 'aguardando_autorizacao', 'expirado', 'ausente'], default: 'ausente' },
                { name: 'token_observacao', label: 'Observação de Acesso', type: 'textarea' }
            ]
        },
        planejamento: {
            id: 'bloco-10',
            title: '10. Planejamento Inicial',
            fields: [
                { name: 'briefing_mes_1', label: 'Briefing Geral (Mês 1)', type: 'textarea' },
                { name: 'alinhamento_kickoff', label: 'Decisões do Kickoff', type: 'textarea' }
            ]
        }
    }
};
