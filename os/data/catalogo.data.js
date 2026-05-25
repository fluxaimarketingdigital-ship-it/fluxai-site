export const mockCatalogoServicos = [
    {
        servico_id: 'SRV_FLX_001',
        nome_servico: 'Criação de Landing Page',
        categoria: 'desenvolvimento',
        descricao: 'Design e desenvolvimento de página de alta conversão.',
        valor_base: 1500.00,
        unidade: 'projeto',
        ativo: true,
        permite_orcamento: true,
        gera_credito_ia: true,
        quantidade_credito_ia: 5,
        observacao: 'Inclui copy inicial baseada em IA.'
    },
    {
        servico_id: 'SRV_FLX_002',
        nome_servico: 'Ensaio Fotográfico Corporativo',
        categoria: 'audiovisual',
        descricao: 'Captação de imagens profissionais na sede do cliente.',
        valor_base: 2500.00,
        unidade: 'diaria',
        ativo: true,
        permite_orcamento: true,
        gera_credito_ia: false,
        quantidade_credito_ia: 0,
        observacao: 'Deslocamento cobrado à parte.'
    },
    {
        servico_id: 'SRV_FLX_003',
        nome_servico: 'Pacote Extra de Reels (4x)',
        categoria: 'conteudo',
        descricao: 'Roteirização, gravação e edição de 4 vídeos curtos.',
        valor_base: 1200.00,
        unidade: 'pacote',
        ativo: true,
        permite_orcamento: true,
        gera_credito_ia: true,
        quantidade_credito_ia: 4,
        observacao: 'Necessita do DNA de conteúdo aprovado.'
    },
    {
        servico_id: 'SRV_FLX_004',
        nome_servico: 'Setup de CRM (ActiveCampaign/Hubspot)',
        categoria: 'automacao',
        descricao: 'Configuração de pipeline, tags e integrações básicas.',
        valor_base: 3000.00,
        unidade: 'projeto',
        ativo: true,
        permite_orcamento: true,
        gera_credito_ia: false,
        quantidade_credito_ia: 0,
        observacao: 'Licença da ferramenta não inclusa.'
    },
    {
        servico_id: 'SRV_FLX_005',
        nome_servico: 'Auditoria Estratégica Completa',
        categoria: 'consultoria',
        descricao: 'Diagnóstico profundo de posicionamento e tráfego.',
        valor_base: 5000.00,
        unidade: 'projeto',
        ativo: true,
        permite_orcamento: false, // Só a FluxAI pode sugerir, não o cliente direto pelo portal
        gera_credito_ia: true,
        quantidade_credito_ia: 10,
        observacao: 'Venda consultiva B2B.'
    }
];
