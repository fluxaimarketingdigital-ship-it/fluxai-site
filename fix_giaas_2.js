const fs = require('fs');
const giaasPath = 'c:\\Users\\BRENDA\\Desktop\\Identidade Visual FluxAI\\FLUXAI_SITE\\giaas.html';
let html = fs.readFileSync(giaasPath, 'utf8');

// FAQ Answers
html = html.replace(
    /Sim\. Caso precise de escopo adicional.*de forma segura e sem duplicidade\./g,
    'Sim. Escopos adicionais podem ser solicitados e avaliados pela equipe FluxAI. Quando aprovados, ampliam a capacidade operacional de produção assistida por IA dentro do projeto.'
);

html = html.replace(
    /Não\. Respeitamos o Protocolo de Curadoria Humana.*após conferência de nossos analistas\./g,
    'As métricas podem ser consolidadas automaticamente, mas os relatórios estratégicos passam por revisão humana antes de serem liberados.'
);

html = html.replace(
    /Nossos planos de Sistema de Crescimento possuem vigência mínima.*sobre o saldo remanescente\./g,
    'Os contratos podem prever vigência mínima e condições específicas de rescisão conforme escopo aprovado.'
);

// Add Plan warning paragraph
const warningText = '<p style="text-align: center; color: var(--color-text-muted); font-size: 0.85rem; max-width: 800px; margin: 40px auto 0; padding: 20px; background: rgba(255,255,255,0.02); border: 1px solid var(--color-border); border-radius: 8px;">Os planos funcionam como referência inicial de estrutura. O escopo final, valores e entregáveis são definidos após diagnóstico estratégico, maturidade da operação, canais envolvidos, volume de conteúdo, integrações, mídia e nível de acompanhamento.</p>';

if (!html.includes('Os planos funcionam como referência inicial de estrutura')) {
    html = html.replace(
        /(<\/div>\s*<!-- FAQ \/ Prova T)/i,
        `\n            <div class="container">\n                ${warningText}\n            </div>\n        $1`
    );
}

fs.writeFileSync(giaasPath, html, 'utf8');
console.log('giaas.html second pass done!');
