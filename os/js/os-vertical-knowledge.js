/**
 * FLUXAI OS™ — VERTICAL KNOWLEDGE LAYER™ v1.0.0
 * Base de conhecimento por nicho/profissão.
 *
 * Cada segmento define:
 *  - regras éticas e legais de comunicação
 *  - temas permitidos e proibidos
 *  - tipo de público e funis
 *  - limites de linguagem
 *  - exemplos de pauta por funil
 *  - campos profissionais específicos (CRN, OAB, CRM etc.)
 *
 * USO (via KnowledgeCore):
 *   import { VERTICAL_KNOWLEDGE } from '/os/js/os-vertical-knowledge.js';
 *   const rules = VERTICAL_KNOWLEDGE.forSegment('Nutrição Clínica');
 */

// ─────────────────────────────────────────────────────────────────
// MAPA DE SEGMENTOS → VERTICAL
// Normaliza variações de nome de segmento para a vertical correta.
// ─────────────────────────────────────────────────────────────────

const SEGMENT_MAP = {
    // Nutrição
    'nutrição':             'NUTRICAO',
    'nutricionista':        'NUTRICAO',
    'consultora alimentar': 'NUTRICAO',
    'nutrição clínica':     'NUTRICAO',
    'emagrecimento':        'NUTRICAO',
    'consultoria alimentar':'NUTRICAO',
    'alimentação saudável': 'NUTRICAO',
    'boas práticas':        'NUTRICAO',
    'vigilância sanitária': 'NUTRICAO',

    // Advocacia
    'advocacia':            'ADVOCACIA',
    'advogado':             'ADVOCACIA',
    'direito':              'ADVOCACIA',
    'jurídico':             'ADVOCACIA',
    'escritório de advocacia': 'ADVOCACIA',

    // Medicina
    'medicina':             'MEDICINA',
    'médico':               'MEDICINA',
    'clínica médica':       'MEDICINA',
    'saúde':                'MEDICINA',
    'terapia':              'MEDICINA',
    'psicologia':           'MEDICINA',

    // Estética
    'estética':             'ESTETICA',
    'estética avançada':    'ESTETICA',
    'dermato':              'ESTETICA',
    'skin care':            'ESTETICA',
    'procedimento estético':'ESTETICA',
    'micropigmentação':     'ESTETICA',

    // Arquitetura
    'arquitetura':          'ARQUITETURA',
    'design de interiores': 'ARQUITETURA',
    'interiores':           'ARQUITETURA',
    'arquiteto':            'ARQUITETURA',

    // Marketing / Agência
    'marketing digital':    'MARKETING',
    'agência':              'MARKETING',
    'agência de marketing': 'MARKETING',
    'social media':         'MARKETING',
    'tráfego pago':         'MARKETING',

    // Educação
    'educação':             'EDUCACAO',
    'professor':            'EDUCACAO',
    'cursinho':             'EDUCACAO',
    'escola':               'EDUCACAO',
    'mentoria':             'EDUCACAO',
    'coach':                'EDUCACAO',

    // Gastronomia / Restaurante
    'gastronomia':          'GASTRONOMIA',
    'restaurante':          'GASTRONOMIA',
    'bar':                  'GASTRONOMIA',
    'lanchonete':           'GASTRONOMIA',
    'confeitaria':          'GASTRONOMIA',
    'chef':                 'GASTRONOMIA',

    // Saúde Animal
    'veterinária':          'VETERINARIA',
    'pet':                  'VETERINARIA',
    'clínica veterinária':  'VETERINARIA',

    // Fitness / Personal
    'personal trainer':     'FITNESS',
    'academia':             'FITNESS',
    'educação física':      'FITNESS',
    'fitness':              'FITNESS',
    'crossfit':             'FITNESS',
};

// ─────────────────────────────────────────────────────────────────
// VERTICAIS — CONHECIMENTO COMPLETO POR NICHO
// ─────────────────────────────────────────────────────────────────

const VERTICALS = {

    // ─── NUTRIÇÃO ───────────────────────────────────────────────
    NUTRICAO: {
        label: 'Nutrição & Consultoria Alimentar',
        professional_registry: 'CRN (Conselho Regional de Nutrição)',
        regulatory_body: 'CFN — Conselho Federal de Nutrição',

        audiences: {
            EMPRESAS: {
                label: 'Empresas e Estabelecimentos',
                description: 'Restaurantes, cozinhas industriais, escolas, hospitais que precisam de adequação sanitária.',
                content_focus: ['Boas Práticas de Fabricação', 'POP (Procedimento Operacional Padrão)', 'Adequação sanitária', 'Risco de fiscalização', 'ANVISA', 'Legislação RDC'],
                tone: 'Técnico, firme, confiável, institucional, preventivo',
                content_examples: [
                    'Os 5 erros sanitários que podem fechar seu estabelecimento',
                    'O que é POP e por que sua cozinha precisa ter',
                    'Checklist de boas práticas de fabricação para restaurantes',
                    'O impacto financeiro de uma autuação sanitária',
                    'Como treinar sua equipe sobre higiene alimentar'
                ]
            },
            PACIENTES: {
                label: 'Pacientes e Público Geral',
                description: 'Pessoas que buscam orientação alimentar, emagrecimento saudável, reeducação.',
                content_focus: ['Reeducação alimentar', 'Déficit calórico', 'Saciedade', 'Organização da semana', 'Escolhas inteligentes', 'Mitos alimentares'],
                tone: 'Humano, prático, acolhedor, simples, sem extremismo',
                content_examples: [
                    'Como montar um prato com saciedade real sem contar calorias',
                    '3 substituições que fazem diferença na sua rotina',
                    'Mitos sobre carboidrato que você ainda acredita',
                    'Como se organizar para não comer mal durante a semana',
                    'O que é déficit calórico na vida real (sem dieta estrita)'
                ]
            }
        },

        ethical_rules: {
            PROIBIDO: [
                'Promessas de resultados específicos (ex: "perca 10kg em 30 dias")',
                'Antes e depois com afirmação de resultado garantido',
                'Prescrição individualizada de dieta em conteúdo público',
                'Linguagem sensacionalista sobre alimentos',
                'Afirmar que cura doenças por meio da alimentação',
                'Incentivo a restrição alimentar extrema',
                'Comparações corporais depreciativas',
                'Conteúdo que pareça diagnóstico médico individual'
            ],
            PERMITIDO: [
                'Orientações gerais de educação alimentar',
                'Desmistificação de mitos com base em evidências',
                'Conteúdo educativo sobre nutrição e saúde',
                'Cases com consentimento e sem garantia de resultado',
                'Receitas e organização alimentar',
                'Orientações de boas práticas para empresas',
                'Conteúdo sobre legislação sanitária'
            ],
            NOTAS_LEGAIS: [
                'Resolução CFN nº 599/2018 regula publicidade em Nutrição',
                'Evitar uso de termos como "detox", "desintoxicação" sem embasamento',
                'Antes/depois permitido APENAS com consentimento e sem garantia de resultado'
            ]
        },

        content_pillars: [
            'Educação alimentar baseada em evidências',
            'Desmistificação e combate a desinformação',
            'Boas práticas para empresas (se aplicável)',
            'Rotina e organização alimentar',
            'Saúde como estilo de vida sustentável'
        ],

        forbidden_language: [
            'milagre', 'detox', 'limpar o organismo', 'eliminar toxinas',
            'resulta em perda de X kg', 'garantido', 'funciona para todos',
            'dieta perfeita', 'alimento proibido', 'jamais coma'
        ],

        professional_fields: {
            especialidades: ['Nutrição Clínica', 'Nutrição Esportiva', 'Nutrição Empresarial', 'Nutrição Infantil', 'Nutrição Oncológica'],
            tipo_atendimento: ['Presencial', 'Online', 'Para empresas', 'Para pacientes'],
            documentos_referencia: ['CRN', 'RDC ANVISA', 'POP', 'Manual de Boas Práticas']
        }
    },

    // ─── ADVOCACIA ───────────────────────────────────────────────
    ADVOCACIA: {
        label: 'Advocacia & Direito',
        professional_registry: 'OAB (Ordem dos Advogados do Brasil)',
        regulatory_body: 'CFOAB — Conselho Federal da OAB',

        audiences: {
            GERAL: {
                label: 'Pessoas Físicas e Empresas',
                content_focus: ['Direitos do cidadão', 'Orientação jurídica geral', 'Processos comuns', 'Legislação acessível'],
                tone: 'Institucional, técnico mas acessível, sério, confiável',
                content_examples: [
                    'O que fazer quando você recebe uma notificação extrajudicial',
                    '5 direitos do trabalhador que muitos não conhecem',
                    'Quando é necessário contratar um advogado empresarial',
                    'O que é e quando usar mediação extrajudicial'
                ]
            }
        },

        ethical_rules: {
            PROIBIDO: [
                'Captação de clientes com promessa de resultado',
                'Divulgação de valores de honorários',
                'Publicidade comparativa com outros advogados',
                'Títulos não reconhecidos pela OAB',
                'Conteúdo que pareça garantir decisão judicial',
                'Expressar opinião sobre casos em andamento com partes identificáveis'
            ],
            PERMITIDO: [
                'Conteúdo educativo sobre direito',
                'Orientações gerais sobre legislação',
                'Cases de sucesso SEM identificação das partes',
                'Orientação sobre quando buscar assistência jurídica',
                'Esclarecimento de dúvidas jurídicas gerais'
            ],
            NOTAS_LEGAIS: [
                'Código de Ética e Disciplina da OAB — Art. 28 a 44',
                'Provimento 94/2000 OAB — Publicidade na Advocacia',
                'Proibido uso de termos: "especialista em" sem certificação, "garanto o resultado"'
            ]
        },

        content_pillars: [
            'Educação jurídica acessível',
            'Orientação sobre direitos e deveres',
            'Transparência sobre o processo jurídico',
            'Prevenção de problemas legais'
        ],

        forbidden_language: ['garantimos', 'ganhamos sempre', 'resultado certo', 'especialista em (sem certificação)'],

        professional_fields: {
            areas_atuacao: ['Trabalhista', 'Cível', 'Empresarial', 'Criminal', 'Família', 'Tributário', 'Previdenciário'],
            tipo_atendimento: ['Empresas', 'Pessoas físicas', 'Consulta online', 'Escritório'],
        }
    },

    // ─── MEDICINA ────────────────────────────────────────────────
    MEDICINA: {
        label: 'Medicina & Saúde',
        professional_registry: 'CRM (Conselho Regional de Medicina)',
        regulatory_body: 'CFM — Conselho Federal de Medicina',

        audiences: {
            PACIENTES: {
                label: 'Pacientes e Público Geral',
                content_focus: ['Prevenção', 'Educação em saúde', 'Orientações gerais', 'Desmistificação'],
                tone: 'Técnico mas humano, empático, baseado em evidências, sério',
                content_examples: [
                    'Por que o check-up anual é mais importante do que parece',
                    'O que a ciência diz sobre o sono e a imunidade',
                    'Quando um sintoma comum pode ser sinal de algo importante',
                    'Como interpretar um exame de sangue básico'
                ]
            }
        },

        ethical_rules: {
            PROIBIDO: [
                'Prometer cura de doenças',
                'Prescrever medicamentos em conteúdo público',
                'Antes e depois com promessa de resultado',
                'Diagnóstico individual por conteúdo',
                'Divulgar valores de consulta',
                'Publicidade sensacionalista'
            ],
            PERMITIDO: [
                'Conteúdo educativo sobre saúde',
                'Orientações preventivas gerais',
                'Desmistificação de mitos de saúde',
                'Cases com consentimento e sem identificação'
            ],
            NOTAS_LEGAIS: [
                'CFM — Resolução 1974/2011 sobre publicidade médica',
                'Proibido usar "o melhor", "o único", "pioneiro" sem comprovação'
            ]
        },

        content_pillars: ['Prevenção', 'Educação em saúde', 'Evidência científica', 'Orientação geral'],
        forbidden_language: ['cura garantida', 'elimina a doença', 'trate em casa', 'sem efeito colateral'],

        professional_fields: {
            especialidades: ['Clínico Geral', 'Cardiologia', 'Endocrinologia', 'Dermatologia', 'Psiquiatria', 'Ortopedia'],
            tipo_atendimento: ['Presencial', 'Telemedicina', 'Particular', 'Convênio']
        }
    },

    // ─── ESTÉTICA ────────────────────────────────────────────────
    ESTETICA: {
        label: 'Estética & Beleza',
        professional_registry: 'Registro no Conselho Regional de acordo com formação',
        regulatory_body: 'ANVISA — para procedimentos regulamentados',

        audiences: {
            GERAL: {
                label: 'Público Geral — Beleza e Bem-estar',
                content_focus: ['Autoestima', 'Procedimentos estéticos', 'Cuidados com pele', 'Antes/depois (com ética)', 'Resultados reais'],
                tone: 'Elegante, sofisticado, acolhedor, confiável, empoderador',
                content_examples: [
                    'Como funciona o processo de harmonização facial — passo a passo',
                    'O que esperar dos primeiros dias após um procedimento',
                    'A diferença entre botox e preenchimento (sem romantizar)',
                    'Por que o aftercare é tão importante quanto o procedimento'
                ]
            }
        },

        ethical_rules: {
            PROIBIDO: [
                'Garantir resultado específico de procedimento',
                'Divulgar resultados de procedimentos regulamentados sem aprovação ANVISA',
                'Comparação corporal depreciativa',
                'Linguagem que promova padrão único de beleza',
                'Antes/depois identificável sem consentimento documentado'
            ],
            PERMITIDO: [
                'Educação sobre procedimentos de forma geral',
                'Antes/depois com consentimento e sem promessa',
                'Conteúdo sobre cuidados com a pele e autoestima',
                'Transparência sobre processos e riscos'
            ],
            NOTAS_LEGAIS: [
                'ANVISA regula divulgação de procedimentos médicos estéticos',
                'CFM — restrições para divulgação de procedimentos invasivos por não-médicos'
            ]
        },

        content_pillars: ['Autoestima e cuidado pessoal', 'Educação sobre procedimentos', 'Resultados reais e éticos', 'Segurança e aftercare'],
        forbidden_language: ['resultado garantido', 'instantâneo', 'sem risco', 'elimina definitivamente'],

        professional_fields: {
            procedimentos: ['Toxina Botulínica', 'Preenchimento', 'Bioestimuladores', 'Harmonização Facial', 'Micropigmentação', 'Laser'],
            tipo_atendimento: ['Clínica Estética', 'Studio', 'Atendimento Domiciliar']
        }
    },

    // ─── MARKETING ───────────────────────────────────────────────
    MARKETING: {
        label: 'Marketing Digital & Agência',
        professional_registry: 'N/A',
        regulatory_body: 'CONAR — Conselho Nacional de Autorregulamentação Publicitária',

        audiences: {
            EMPRESAS: {
                label: 'Empresas e Empreendedores',
                content_focus: ['Estratégia digital', 'ROI e resultados', 'Crescimento orgânico', 'Tráfego pago', 'Branding'],
                tone: 'Técnico, direto, baseado em dados, premium, sem guru',
                content_examples: [
                    'Por que sua empresa está investindo em anúncios sem estratégia',
                    'O que é ROAS e como calcular o retorno real dos seus anúncios',
                    'A diferença entre alcance e resultado real nas redes sociais',
                    'Como construir uma presença digital que converte'
                ]
            }
        },

        ethical_rules: {
            PROIBIDO: [
                'Prometer número específico de seguidores ou leads',
                'Garantir ROAS sem análise prévia',
                'Comparação direta negativa com concorrentes',
                'Cases de clientes sem autorização'
            ],
            PERMITIDO: [
                'Cases com autorização e dados reais',
                'Conteúdo educativo sobre marketing',
                'Dados de mercado e benchmarks gerais',
                'Resultados próprios da agência'
            ],
            NOTAS_LEGAIS: [
                'CONAR — Código Brasileiro de Autorregulamentação Publicitária',
                'LGPD — Lei 13.709/2018 para uso de dados em campanhas'
            ]
        },

        content_pillars: ['Estratégia baseada em dados', 'Resultados reais', 'Educação de mercado', 'Autoridade técnica'],
        forbidden_language: ['ficar rico', 'fácil', 'sem esforço', 'garantimos resultado', 'todo mundo pode'],

        professional_fields: {
            especialidades: ['Tráfego Pago', 'Social Media', 'SEO', 'Email Marketing', 'Branding', 'CRM'],
        }
    },

    // ─── GENÉRICO (fallback) ─────────────────────────────────────
    GENERIC: {
        label: 'Segmento Geral',
        professional_registry: 'N/A',
        regulatory_body: 'CONAR',
        audiences: { GERAL: { label: 'Público Geral', content_focus: [], tone: 'Profissional e adequado ao nicho', content_examples: [] } },
        ethical_rules: {
            PROIBIDO: ['Promessas não comprovadas', 'Linguagem enganosa', 'Dados falsos'],
            PERMITIDO: ['Conteúdo educativo', 'Cases com consentimento', 'Informações verificáveis'],
            NOTAS_LEGAIS: ['CONAR — Código Brasileiro de Autorregulamentação Publicitária', 'CDC — Código de Defesa do Consumidor']
        },
        content_pillars: ['Autoridade', 'Educação', 'Conexão', 'Conversão'],
        forbidden_language: ['garantido', 'milagre', 'melhor do mundo', 'sem risco'],
        professional_fields: {}
    }
};

// ─────────────────────────────────────────────────────────────────
// API PÚBLICA
// ─────────────────────────────────────────────────────────────────

export const VERTICAL_KNOWLEDGE = {

    /**
     * Retorna as regras e contexto do nicho como string formatada para o system prompt.
     * @param {string} segment — segmento do cliente (do onboarding)
     */
    forSegment(segment = '') {
        const vertical = this._resolveVertical(segment);
        const data = VERTICALS[vertical] || VERTICALS.GENERIC;

        const audiences = Object.values(data.audiences || {})
            .map(a => `  - ${a.label}: ${a.content_focus?.join(', ')}`)
            .join('\n');

        const prohibited = (data.ethical_rules?.PROIBIDO || []).map(r => `  ✗ ${r}`).join('\n');
        const permitted  = (data.ethical_rules?.PERMITIDO || []).map(r => `  ✓ ${r}`).join('\n');
        const legalNotes = (data.ethical_rules?.NOTAS_LEGAIS || []).map(n => `  ℹ ${n}`).join('\n');
        const pillars    = (data.content_pillars || []).map(p => `  • ${p}`).join('\n');
        const forbidden  = (data.forbidden_language || []).map(w => `"${w}"`).join(', ');

        return [
            `## Vertical: ${data.label}`,
            `Órgão Regulador: ${data.regulatory_body || 'N/A'}`,
            '',
            '### Públicos e Focos de Conteúdo',
            audiences,
            '',
            '### Pilares Editoriais do Nicho',
            pillars,
            '',
            '### REGRAS ÉTICAS — OBRIGATÓRIO RESPEITAR',
            '#### Proibido:',
            prohibited,
            '#### Permitido:',
            permitted,
            '',
            '### Notas Legais',
            legalNotes,
            '',
            `### Linguagem Proibida (jamais usar): ${forbidden}`
        ].filter(l => l !== undefined).join('\n');
    },

    /**
     * Retorna o objeto vertical completo (para uso programático).
     */
    getVerticalData(segment = '') {
        const key = this._resolveVertical(segment);
        return VERTICALS[key] || VERTICALS.GENERIC;
    },

    /**
     * Retorna os temas proibidos como array (para validação rápida de conteúdo).
     */
    getForbiddenLanguage(segment = '') {
        const data = this.getVerticalData(segment);
        return data.forbidden_language || [];
    },

    /**
     * Retorna os públicos disponíveis para um segmento.
     */
    getAudiences(segment = '') {
        const data = this.getVerticalData(segment);
        return Object.keys(data.audiences || { GERAL: {} });
    },

    /**
     * Retorna exemplos de pautas para um segmento e público.
     */
    getContentExamples(segment = '', audience = 'GERAL') {
        const data = this.getVerticalData(segment);
        return data.audiences?.[audience]?.content_examples || [];
    },

    /**
     * Retorna os pilares editoriais do nicho.
     */
    getContentPillars(segment = '') {
        const data = this.getVerticalData(segment);
        return data.content_pillars || [];
    },

    /**
     * Lista todos os verticais disponíveis.
     */
    listVerticals() {
        return Object.entries(VERTICALS)
            .filter(([k]) => k !== 'GENERIC')
            .map(([key, data]) => ({ key, label: data.label }));
    },

    /**
     * Resolve o segmento para a chave do vertical correto.
     */
    _resolveVertical(segment = '') {
        const normalized = segment.toLowerCase().trim();
        for (const [keyword, verticalKey] of Object.entries(SEGMENT_MAP)) {
            if (normalized.includes(keyword)) return verticalKey;
        }
        return 'GENERIC';
    }
};
