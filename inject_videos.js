const fs = require('fs');
const path = require('path');

const filePath = path.join('c:\\Users\\BRENDA\\Desktop\\Identidade Visual FluxAI\\FLUXAI_SITE', 'os/js/modules/fluxai-academy.js');

let content = fs.readFileSync(filePath, 'utf8');

// Replace the videoUrl empty strings with the actual paths we just generated
content = content.replace(/id: 'vid_01_introducao',[\s\S]*?videoUrl: '',/g, "id: 'vid_01_introducao',\n        title: 'Boas Vindas e Estrutura',\n        desc: 'Acesso inicial, visão geral da arquitetura.',\n        roles: ['ADMIN', 'OPERATOR', 'CLIENT'],\n        videoUrl: '../docs/academy/videos_estrutura/00_visao_geral/visao_geral.mp4',");

content = content.replace(/id: 'vid_02_operacao_interna',[\s\S]*?videoUrl: '',/g, "id: 'vid_02_operacao_interna',\n        title: 'Operação Interna',\n        desc: 'Command Center, Onboarding, Content Engine, CRM Intelligence, Financeiro e Auditoria.',\n        roles: ['ADMIN', 'OPERATOR'],\n        videoUrl: '../docs/academy/videos_estrutura/01_primeiros_passos/primeiros_passos.mp4',");

content = content.replace(/id: 'vid_03_portal_cliente',[\s\S]*?videoUrl: '',/g, "id: 'vid_03_portal_cliente',\n        title: 'Visão do Cliente',\n        desc: 'Navegação para os clientes da agência: como aprovar relatórios.',\n        roles: ['ADMIN', 'OPERATOR', 'CLIENT'],\n        videoUrl: '../docs/academy/videos_estrutura/02_gestao_demandas/gestao_demandas.mp4',");

content = content.replace(/id: 'vid_04_comercial_pitch',[\s\S]*?videoUrl: '',/g, "id: 'vid_04_comercial_pitch',\n        title: 'Apresentação Comercial',\n        desc: 'Pitch do sistema para reuniões de vendas e demonstração executiva para novos leads.',\n        roles: ['ADMIN', 'OPERATOR'],\n        videoUrl: '../docs/academy/videos_estrutura/03_analise_metricas/analise_metricas.mp4',");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Video paths injected into academy.js');
