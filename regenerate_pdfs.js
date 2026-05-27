const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const { marked } = require('marked');

const DOCUMENT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
body {
    font-family: 'Inter', sans-serif;
    color: #1a221a;
    background: #ffffff;
    line-height: 1.6;
    font-size: 11pt;
    margin: 0;
    padding: 0;
}
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 10px;
}
h1, h2, h3, h4 {
    color: #0f150f;
    font-weight: 700;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    page-break-after: avoid;
}
h1 {
    font-size: 24pt;
    border-bottom: 2px solid #8E9E68;
    padding-bottom: 8px;
    margin-top: 0;
}
h2 {
    font-size: 16pt;
    border-bottom: 1px solid #e2e8e2;
    padding-bottom: 6px;
    margin-top: 1.8em;
}
h3 {
    font-size: 13pt;
}
p {
    margin-bottom: 1.2em;
    text-align: justify;
}
ul, ol {
    margin-bottom: 1.2em;
    padding-left: 20px;
}
li {
    margin-bottom: 0.4em;
}
code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5pt;
    background: #f4f6f4;
    padding: 2px 6px;
    border-radius: 4px;
    color: #2b3a2b;
}
pre {
    background: #0f140f;
    padding: 15px;
    border-radius: 8px;
    overflow-x: auto;
    margin-bottom: 1.5em;
    border: 1px solid #1a221a;
    page-break-inside: avoid;
}
pre code {
    background: transparent;
    color: #a8b888;
    padding: 0;
    font-size: 9pt;
}
table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5em;
    font-size: 10pt;
    page-break-inside: avoid;
}
th, td {
    border: 1px solid #e2e8e2;
    padding: 10px 12px;
    text-align: left;
}
th {
    background: #f4f6f4;
    font-weight: 600;
    color: #0f150f;
}
tr:nth-child(even) {
    background: #fafbfa;
}

blockquote {
    margin: 1.5em 0;
    padding: 12px 18px;
    border-left: 5px solid #8E9E68;
    background: #f8faf8;
    border-radius: 0 8px 8px 0;
    page-break-inside: avoid;
}
blockquote p {
    margin: 0;
}
blockquote.note {
    border-left-color: #2A9D8F;
    background: #f0fbf9;
}
blockquote.warning {
    border-left-color: #E76F51;
    background: #fdf5f3;
}
blockquote.important {
    border-left-color: #8E9E68;
    background: #f8faf8;
}

hr {
    border: 0;
    border-top: 1px solid #e2e8e2;
    margin: 2em 0;
}
.mermaid {
    text-align: center;
    margin: 1.5em 0;
}
`;

function parseAlerts(html) {
    return html
        .replace(/<blockquote>\s*<p>\s*\[!NOTE\]/gi, '<blockquote class="note"><p><strong>NOTA:</strong>')
        .replace(/<blockquote>\s*<p>\s*\[!WARNING\]/gi, '<blockquote class="warning"><p><strong>AVISO:</strong>')
        .replace(/<blockquote>\s*<p>\s*\[!IMPORTANT\]/gi, '<blockquote class="important"><p><strong>IMPORTANTE:</strong>');
}

const VISUAL_GUIDE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
body {
    font-family: 'Inter', sans-serif;
    background: #fcfdfc;
    color: #1a221a;
    margin: 0;
    padding: 20px;
}
.header {
    text-align: center;
    border-bottom: 2px solid #8E9E68;
    padding-bottom: 15px;
    margin-bottom: 30px;
}
.header h1 {
    font-size: 22pt;
    margin: 0;
    color: #0f150f;
}
.header p {
    color: #5a665a;
    font-size: 11pt;
    margin: 5px 0 0 0;
}
.step-container {
    margin-bottom: 40px;
    background: #ffffff;
    border: 1px solid #e2e8e2;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
    page-break-inside: avoid;
}
.step-title {
    font-size: 13pt;
    font-weight: 700;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
}
.step-number {
    background: #8E9E68;
    color: #ffffff;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10pt;
    margin-right: 10px;
    font-weight: 800;
}
.grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}
.visual-wrapper {
    position: relative;
    border: 1px solid #d2d8d2;
    border-radius: 8px;
    overflow: hidden;
    background: #111;
}
.visual-wrapper img {
    width: 100%;
    display: block;
}
.highlight-box {
    position: absolute;
    border: 3px solid #E76F51;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.4);
    pointer-events: none;
    border-radius: 4px;
}
.info-column {
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.info-column p {
    margin: 0 0 10px 0;
    font-size: 10.5pt;
}
.do-dont {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-top: 15px;
    font-size: 9.5pt;
}
.do-box {
    background: #f0fbf3;
    border-left: 4px solid #2a9d8f;
    padding: 10px;
    border-radius: 0 6px 6px 0;
}
.dont-box {
    background: #fdf5f4;
    border-left: 4px solid #e76f51;
    padding: 10px;
    border-radius: 0 6px 6px 0;
}
.do-box strong, .dont-box strong {
    display: block;
    margin-bottom: 5px;
}
.error-box {
    margin-top: 15px;
    background: #fefbeb;
    border: 1px solid #fcd34d;
    padding: 10px;
    border-radius: 6px;
    font-size: 9.5pt;
}
.check-box {
    margin-top: 10px;
    background: #f0fdf4;
    border: 1px solid #86efac;
    padding: 10px;
    border-radius: 6px;
    font-size: 9.5pt;
}
`;

const VISUAL_GUIDES_DATA = [
    {
        filename: 'GUIA_VISUAL_DO_ADMIN.html',
        pdfName: 'GUIA_VISUAL_DO_ADMIN.pdf',
        title: 'GUIA VISUAL DO ADMINISTRADOR — FluxAI OS™',
        subtitle: 'Manual de Controle Executivo, Contratos e Governança de Usuários',
        steps: [
            {
                title: 'Tela de Login Administrativo',
                image: 'login.png',
                highlight: { top: '35%', left: '35%', width: '30%', height: '35%' },
                desc: 'Esta é a porta de entrada. O ADMIN utiliza suas credenciais corporativas salvas no Supabase.',
                do: 'Use a senha cadastrada no ambiente seguro e verifique o indicador de conexão.',
                dont: 'Nunca compartilhe sua senha de ADMIN ou salve as credenciais em dispositivos compartilhados.',
                error: 'Erro comum: "Auth offline". Significa que o projeto do Supabase gratuito foi pausado por inatividade e precisa ser reativado.',
                check: 'Como saber se deu certo: Você será direcionado para o Command Center com o perfil MASTER ativo.'
            },
            {
                title: 'Executive Center - Painel de Controle de MRR e Contratos',
                image: 'admin_executive_center.png',
                highlight: { top: '10%', left: '2%', width: '96%', height: '15%' },
                desc: 'O Executive Center consolida os indicadores financeiros (MRR, inadimplência) e lista comercial.',
                do: 'Monitore diariamente a taxa de inadimplência e o forecast comercial de novos contratos.',
                dont: 'Não permita acesso de operadores a esta tela, pois ela exibe faturamento e lucros da agência.',
                error: 'Valores zerados: Ocorre se a aba CONTRATOS_CLIENTES estiver sem registros ou o webhook falhar.',
                check: 'Como saber se deu certo: A soma das mensalidades ativas deve bater exatamente com os dados bancários.'
            },
            {
                title: 'Gestão de Usuários e Permissões (Governance Users)',
                image: 'admin_governance_users.png',
                highlight: { top: '25%', left: '15%', width: '70%', height: '50%' },
                desc: 'Aqui o ADMIN cadastra novos colaboradores e define as permissões de acesso baseadas em papéis.',
                do: 'Cadastre operadores com permissão mínima (OPERATOR) e clientes restritos a seus respectivos project_ids.',
                dont: 'Nunca altere a sua própria role de ADMIN para evitar autotravamento do sistema.',
                error: 'Usuário não consegue logar: Certifique-se de que o e-mail foi cadastrado exatamente igual no Supabase Auth.',
                check: 'Como saber se deu certo: O usuário aparece na lista com status "Ativo" e a role correta.'
            }
        ]
    },
    {
        filename: 'GUIA_VISUAL_DO_OPERADOR.html',
        pdfName: 'GUIA_VISUAL_DO_OPERADOR.pdf',
        title: 'GUIA VISUAL DO OPERADOR — FluxAI OS™',
        subtitle: 'Manual de Operações Diárias, Backlog de Demandas e Cronograma',
        steps: [
            {
                title: 'Command Center - Cockpit do Dia a Dia',
                image: 'op_command_center.png',
                highlight: { top: '15%', left: '20%', width: '60%', height: '30%' },
                desc: 'O painel diário exibe os alertas urgentes, coletas financeiras pendentes e saúde do portfólio.',
                do: 'Inicie seu turno resolvendo prioritariamente os alertas marcados com prioridade Alta/Crítica.',
                dont: 'Não encerre o dia com alertas de erros de webhook sem investigação.',
                error: 'Alerta persistente: O erro continuará aparecendo até que o status na planilha Sheets seja modificado.',
                check: 'Como saber se deu certo: Os cards de alertas mudam de cor ou desaparecem conforme são resolvidos.'
            },
            {
                title: 'Content Engine - Produção de Posts',
                image: 'op_content_engine.png',
                highlight: { top: '30%', left: '10%', width: '80%', height: '40%' },
                desc: 'O motor de conteúdo permite a geração de criativos e legendas inteligentes de forma contextualizada.',
                do: 'Selecione o cliente correto no menu de contexto para carregar as diretrizes do DNA de marca.',
                dont: 'Não edite os prompts estruturais diretamente sem autorização do ADMIN.',
                error: 'Cota de IA zerada: O post não será gerado se os créditos contratados do cliente estiverem esgotados.',
                check: 'Como saber se deu certo: O rascunho gerado é exibido na lista com status "rascunho_ia".'
            }
        ]
    },
    {
        filename: 'GUIA_VISUAL_DO_CLIENTE.html',
        pdfName: 'GUIA_VISUAL_DO_CLIENTE.pdf',
        title: 'GUIA VISUAL DO CLIENTE — FluxAI OS™',
        subtitle: 'Portal de Relacionamento, Envio de Briefing e Aprovação de Entregáveis',
        steps: [
            {
                title: 'Portal do Cliente - Visão de Entregas',
                image: 'client_portal.png',
                highlight: { top: '25%', left: '5%', width: '90%', height: '40%' },
                desc: 'Interface limpa onde o cliente visualiza as entregas preparadas pela equipe e aprova os materiais.',
                do: 'Clique em "Aprovar" para liberar a postagem ou "Reprovar" enviando o feedback de ajuste.',
                dont: 'O cliente não controla faturamento interno, limites de IA ou prompts de geração.',
                error: 'Entrega não aparece: Certifique-se de que o operador moveu o post para "aprovado_interno" no OS.',
                check: 'Como saber se deu certo: Ao aprovar, o status muda para "aguardando_publicacao" no painel da agência.'
            },
            {
                title: 'Solicitação de Nova Demanda / Serviço Extra',
                image: 'client_nova_demanda.png',
                highlight: { top: '20%', left: '25%', width: '50%', height: '60%' },
                desc: 'Formulário integrado para solicitar novas pautas e serviços extras que geram orçamentos avulsos.',
                do: 'Preencha o briefing com o máximo de informações e links de referências no Drive.',
                dont: 'Não envie solicitações com briefings curtos como "Criar post de venda" para evitar atrasos.',
                error: 'Erro no envio: Ocorre se a rede falhar. O modal mostrará um alerta e não fechará.',
                check: 'Como saber se deu certo: A demanda aparece na lista "Minhas Solicitações" como "solicitado".'
            }
        ]
    },
    {
        filename: 'GUIA_VISUAL_DE_PUBLICACAO_ASSISTIDA.html',
        pdfName: 'GUIA_VISUAL_DE_PUBLICACAO_ASSISTIDA.pdf',
        title: 'GUIA VISUAL DE PUBLICAÇÃO ASSISTIDA — FluxAI OS™',
        subtitle: 'Manual de Distribuição de Mídias e Confirmação Operacional',
        steps: [
            {
                title: 'Ponte de Publicação Assistida (Modal)',
                image: 'op_publicacao_assistida.png',
                highlight: { top: '15%', left: '15%', width: '70%', height: '70%' },
                desc: 'O modal reúne a legenda copiada, atalhos de mídias do Drive e link direto da rede social.',
                do: 'Clique em "Copiar Legenda" (o texto vai para o clipboard) e baixe a mídia na pasta aberta do Drive.',
                dont: 'Nunca feche o modal sem clicar em "Confirmar Publicação" após publicar na rede social.',
                error: 'Link do Drive quebrado: Ocorre se a URL da pasta não foi cadastrada no onboarding do cliente.',
                check: 'Como saber se deu certo: A peça de conteúdo muda de status para "publicado" e consome 1 cota de IA.'
            }
        ]
    },
    {
        filename: 'GUIA_VISUAL_DE_ERROS_E_LOGS.html',
        pdfName: 'GUIA_VISUAL_DE_ERROS_E_LOGS.pdf',
        title: 'GUIA VISUAL DE ERROS E LOGS DE AUDITORIA — FluxAI OS™',
        subtitle: 'Monitoramento de Segurança, Falhas de Webhook e Rollback Transacional',
        steps: [
            {
                title: 'Central de Logs e Auditoria',
                image: 'admin_logs.png',
                highlight: { top: '10%', left: '5%', width: '90%', height: '12%' },
                desc: 'Painel unificado que exibe todas as ações da agência catalogadas por severidade e categoria.',
                do: 'Filtre por "CRITICAL" para checar erros ativos de automação ou transações canceladas.',
                dont: 'Não limpe os logs de auditoria sem antes exportar ou analisar os incidentes de segurança.',
                error: 'Log duplicado: Indica que o operador clicou duas vezes seguidas em um botão de ação.',
                check: 'Como saber se deu certo: O log exibe a mensagem de sucesso com o e-mail do operador responsável.'
            },
            {
                title: 'Logs de Segurança e Falha de Webhook',
                image: 'admin_logs_errors.png',
                highlight: { top: '30%', left: '5%', width: '90%', height: '50%' },
                desc: 'Esta tela exibe logs específicos de incidentes de segurança ou webhooks do Make.com que retornaram erro.',
                do: 'Inspecione o payload JSON de erro para identificar se o problema está na rede ou nas colunas da planilha.',
                dont: 'Nunca ignore logs do tipo "SECURITY_WARNING" ou "SECURITY_ACCESS_DENIED".',
                error: 'Webhook inativo no Make: Causará falha repetida em todas as requisições.',
                check: 'Como saber se deu certo: Após reiniciar o cenário no Make, o reenvio registrará status SUCCESS.'
            }
        ]
    }
];

async function run() {
    console.log("Starting PDF generation pipeline...");
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    const markdownDir = path.join(__dirname, 'os', 'docs', 'markdown');
    const pdfDir = path.join(__dirname, 'os', 'docs', 'pdf');
    const screenshotsDir = path.join(__dirname, 'os', 'docs', 'screenshots');

    // 1. Converter os 15 arquivos markdown em PDF (com links relativos corrigidos!)
    const mdFiles = fs.readdirSync(markdownDir).filter(f => f.endsWith('.md'));
    for (let file of mdFiles) {
        const filePath = path.join(markdownDir, file);
        const pdfPath = path.join(pdfDir, file.replace('.md', '.pdf'));
        console.log(`Converting ${file} to PDF...`);

        const mdContent = fs.readFileSync(filePath, 'utf-8');
        let parsedHtml = marked(mdContent);
        parsedHtml = parseAlerts(parsedHtml);

        const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>${DOCUMENT_CSS}</style>
        </head>
        <body>
            <div class="container">
                ${parsedHtml}
            </div>
        </body>
        </html>
        `;

        await page.setContent(fullHtml, { waitUntil: 'domcontentloaded' });
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            displayHeaderFooter: true,
            headerTemplate: '<div style="font-size: 8px; color: #888; font-family: Inter, sans-serif; width: 100%; text-align: right; padding-right: 40px; padding-top: 10px;">FluxAI OS™ — Documentação Oficial</div>',
            footerTemplate: '<div style="font-size: 8px; color: #888; font-family: Inter, sans-serif; width: 100%; text-align: center; padding-bottom: 20px;">Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>',
            margin: { top: '70px', bottom: '70px', left: '50px', right: '50px' }
        });
    }

    // 2. Regenerar os 5 Guias Visuais (com links e imagens nítidas)
    for (let guide of VISUAL_GUIDES_DATA) {
        const pdfPath = path.join(pdfDir, guide.pdfName);
        console.log(`Generating visual guide: ${guide.pdfName}`);

        let stepsHtml = '';
        guide.steps.forEach((step, index) => {
            const stepImagePath = path.join(screenshotsDir, step.image);
            const imageUri = 'file://' + stepImagePath.replace(/\\/g, '/');

            let highlightHtml = '';
            if (step.highlight) {
                highlightHtml = `<div class="highlight-box" style="top: ${step.highlight.top}; left: ${step.highlight.left}; width: ${step.highlight.width}; height: ${step.highlight.height};"></div>`;
            }

            stepsHtml += `
            <div class="step-container">
                <div class="step-title">
                    <span class="step-number">${index + 1}</span>
                    ${step.title}
                </div>
                <div class="grid">
                    <div class="visual-wrapper">
                        <img src="${imageUri}" alt="${step.title}">
                        ${highlightHtml}
                    </div>
                    <div class="info-column">
                        <p><strong>Descrição:</strong> ${step.desc}</p>
                        <div class="do-dont">
                            <div class="do-box">
                                <strong>✅ O QUE FAZER:</strong>
                                ${step.do}
                            </div>
                            <div class="dont-box">
                                <strong>❌ O QUE NÃO FAZER:</strong>
                                ${step.dont}
                            </div>
                        </div>
                        <div class="error-box">
                            <strong>⚠️ ERROS POSSÍVEIS:</strong>
                            ${step.error}
                        </div>
                        <div class="check-box">
                            <strong>🎯 COMO VERIFICAR SE DEU CERTO:</strong>
                            ${step.check}
                        </div>
                    </div>
                </div>
            </div>
            `;
        });

        const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>${VISUAL_GUIDE_CSS}</style>
        </head>
        <body>
            <div class="header">
                <h1>${guide.title}</h1>
                <p>${guide.subtitle}</p>
            </div>
            ${stepsHtml}
        </body>
        </html>
        `;

        await page.setContent(fullHtml, { waitUntil: 'domcontentloaded' });
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            landscape: true,
            displayHeaderFooter: true,
            headerTemplate: '<div style="font-size: 8px; color: #888; font-family: Inter, sans-serif; width: 100%; text-align: right; padding-right: 40px; padding-top: 10px;">FluxAI OS™ — Guias Visuais Operacionais</div>',
            footerTemplate: '<div style="font-size: 8px; color: #888; font-family: Inter, sans-serif; width: 100%; text-align: center; padding-bottom: 20px;">Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>',
            margin: { top: '50px', bottom: '50px', left: '40px', right: '40px' }
        });
    }

    // 3. Converter o Relatório de Documentação Final em PDF na pasta docs raiz ou docs/pdf
    const reportPath = path.join(__dirname, 'os', 'docs', 'RELATORIO_DOCUMENTACAO_FINAL.md');
    const reportPdfPath = path.join(pdfDir, 'RELATORIO_DOCUMENTACAO_FINAL.pdf');
    console.log("Converting RELATORIO_DOCUMENTACAO_FINAL.md to PDF...");
    const reportContent = fs.readFileSync(reportPath, 'utf-8');
    let reportHtml = marked(reportContent);
    reportHtml = parseAlerts(reportHtml);
    const reportFullHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>${DOCUMENT_CSS}</style>
    </head>
    <body>
        <div class="container">
            ${reportHtml}
        </div>
    </body>
    </html>
    `;
    await page.setContent(reportFullHtml, { waitUntil: 'domcontentloaded' });
    await page.pdf({
        path: reportPdfPath,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: '<div style="font-size: 8px; color: #888; font-family: Inter, sans-serif; width: 100%; text-align: right; padding-right: 40px; padding-top: 10px;">FluxAI OS™ — Relatório Final</div>',
        footerTemplate: '<div style="font-size: 8px; color: #888; font-family: Inter, sans-serif; width: 100%; text-align: center; padding-bottom: 20px;">Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>',
        margin: { top: '70px', bottom: '70px', left: '50px', right: '50px' }
    });

    await browser.close();
    console.log("All PDFs successfully generated/updated with relative paths!");
}

run().catch(console.error);
