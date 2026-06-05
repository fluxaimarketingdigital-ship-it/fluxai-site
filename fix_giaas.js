const fs = require('fs');

const giaasPath = 'c:\\Users\\BRENDA\\Desktop\\Identidade Visual FluxAI\\FLUXAI_SITE\\giaas.html';
let html = fs.readFileSync(giaasPath, 'utf8');

// 1. Logo Real
html = html.replace(
    /<a href="#" class="logo">[\s\S]*?FLUXAI <span>LABS<\/span>[\s\S]*?<\/a>/g,
    '<a href="/" class="logo"><img src="/assets/images/branding/logo-primary.webp" alt="FluxAI Labs" width="195" height="42" class="logo-img" /></a>'
);

// 2. Headline / Sub / CTA
html = html.replace('Operação de Crescimento & Engenharia de IA Proprietária para Corporações', 'Operação de Crescimento, Dados e IA aplicada para empresas em fase de escala.');
html = html.replace('Esqueça os PDFs de vaidade no final do mês. A FluxAI Labs™ centraliza sua gestão de tráfego, funis de CRM e geração de IA em uma plataforma operacional exclusiva de comando.', 'Uma estrutura mensal que conecta tráfego, CRM, dados, conteúdo e IA aplicada em uma operação acompanhada.');
html = html.replace('Aplicar p/ Reunião de Diagnóstico', 'Aplicar para Diagnóstico Estratégico');
html = html.replace('Triagem obrigatória de faturamento e cota de anúncios', 'Triagem obrigatória de faturamento, operação e investimento em mídia.');

// 3. Critica
html = html.replace('Por que as operações High-Ticket de alta performance abandonaram o marketing analógico.', 'Por que operações de alto valor estão abandonando o marketing solto e migrando para infraestrutura de crescimento.');

// 4. Nossa engenharia
html = html.replace('Uma estrutura mensal recorrente para empresas: a fusão perfeita entre tráfego qualificado, dados em tempo real e automações de Inteligência Artificial.', 'Uma estrutura mensal recorrente que conecta tráfego qualificado, dados operacionais, CRM e IA aplicada em uma rotina de crescimento acompanhada.');

// 5. Plataforma
html = html.replace('Licenças exclusivas ao nosso portal proprietário de BI e Mesa Editorial síncrona. Interface leve e segura.', 'Acesso controlado ao FluxAI OS™, nosso portal operacional para acompanhamento, conteúdo, aprovações, métricas e inteligência do projeto.');

// 6. Transparência
html = html.replace('Transparência síncrona absoluta', 'Transparência operacional em tempo real');
html = html.replace('Nós decidimos destruir a caixa preta das agências tradicionais. Ao integrar sua marca à FluxAI Labs, você recebe acesso imediato a sua própria infraestrutura de controle.', 'A FluxAI reduz a caixa preta da operação ao centralizar métricas, conteúdo, aprovações e relatórios em um ambiente controlado.');

// 7. Mockup
html = html.replace('<div class="mock-log-title">Auditoria de Logs de IA (Regra P3)</div>', '<div class="mock-log-title">Status e Entregáveis</div>');

html = html.replace('<span>Sincronia de saldo síncrono</span>\\s*<span class="status-green">200 OK</span>', '<span>Métricas capturadas</span>\n                            <span class="status-green">Meta Ads, GA4 e Leads</span>');

html = html.replace('<span>Upload log .txt Drive</span>\\s*<span class="status-green">CONCLUÍDO</span>', '<span>Conteúdos em revisão</span>\n                            <span class="status-neutral">12</span>');

html = html.replace('<span>Limite mensal IA</span>\\s*<span class="status-neutral">150/150</span>', '<span>Relatório mensal</span>\n                            <span class="status-green">Em curadoria FluxAI</span>\n                        </div>\n                        <div class="mock-log-item">\n                            <span>Capacidade IA</span>\n                            <span class="status-neutral">Dentro do escopo</span>');

// Replace "FLUXAI_LABS_001" or similar if they exist
html = html.replace(/FLUXAI_LABS_001/g, 'CLIENTE_PREMIUM');

// 8. FAQ, Onboarding and Credits
// Let's do some broad regex replacements for the remaining text.
html = html.replace('Integração e Onboarding em 48 Horas', 'Início de estruturação em até 48 horas após validação');
html = html.replace('Sua conta administrativa exclusiva no FluxAI OS™ é ativada instantaneamente.', 'Sua conta administrativa é estruturada após validação técnica, onboarding e configuração do ambiente operacional.');
html = html.replace('mapeia em 10 minutos o DNA de sua marca', 'coleta os primeiros dados operacionais, acessos, escopo e insumos estratégicos para iniciar o diagnóstico.');
html = html.replace('tokens oficiais seguras chumbadas no cofre', 'tokens oficiais armazenados em ambiente seguro, com controle de acesso e governança operacional.');

// Pricing replacements (50 creditos, etc)
html = html.replace('50 créditos mensais de IA auditada', 'Produção assistida por IA dentro do escopo contratado');
html = html.replace('150 créditos mensais de IA proprietária', 'Capacidade ampliada de produção assistida por IA');
html = html.replace('300+ créditos mensais de IA dedicada', 'Capacidade dedicada de IA aplicada conforme escopo aprovado');

// Footer
html = html.replace('Em total conformidade com a LGPD e termos síncronos Supabase.', 'Em conformidade com a LGPD e com os protocolos internos de segurança e governança da FluxAI Labs™.');

// Forms
html = html.replace('Enviar Aplicação e Agendar Diagnóstico Estratégico', 'Enviar aplicação para diagnóstico estratégico');

// Mod Padronization - MOD.01, etc. Let's do this later or generally.

fs.writeFileSync(giaasPath, html, 'utf8');
console.log("giaas.html updated successfully!");
