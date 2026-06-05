const fs = require('fs');

const index = 'c:\\Users\\BRENDA\\Desktop\\Identidade Visual FluxAI\\FLUXAI_SITE\\index.html';
const script = 'c:\\Users\\BRENDA\\Desktop\\Identidade Visual FluxAI\\FLUXAI_SITE\\src\\scripts\\script.js';

let html = fs.readFileSync(index, 'utf8');
let js = fs.readFileSync(script, 'utf8');

// 1. CTA 'Garantir meu diagnóstico estratégico'
html = html.replace(
    /<a href="#diagnostico" class="btn btn-primary btn-large" onclick="trackFacebookEvent\('Lead'\);">\s*Garantir Meu Diagnóstico Estratégico <i class="fa-solid fa-fire"><\/i>\s*<\/a>/i,
    `<a href="#diagnostico" class="btn btn-primary btn-large" style="cursor:pointer;" onclick="trackEvent('diagnostic_cta_click', { button_text: 'Garantir meu diagnóstico estratégico', button_id: 'impact_diagnostic_cta', cta_position: 'impact_section', destination: '#diagnostico' })">\n            Garantir Meu Diagnóstico Estratégico <i class="fa-solid fa-fire"></i>\n          </a>`
);

// 2. Rodapé 'Sistema de Crescimento'
if (!html.includes('Sistema de Crescimento')) {
    html = html.replace(
        /(<div class="footer-col links">\s*<h4>Operacional<\/h4>\s*<a href="\/pages\/diagnosticos\.html">Diagnósticos<\/a>\s*<a href="\/pages\/mercados\.html">Mercados<\/a>)/,
        `$1\n          <a href="/giaas" onclick="trackEvent('offer_click', { button_text: 'Sistema de Crescimento', button_id: 'footer_sistema_crescimento', cta_position: 'footer_operacional', destination: '/giaas' })">Sistema de Crescimento</a>`
    );
}

// 3. Form ID HTML mismatch
html = html.replace('id="fluxai-lead-form"', 'id="diagnosticoForm"');

fs.writeFileSync(index, html, 'utf8');

// 4. JS Payload & Success
// Update payload structure
js = js.replace(
    /const payload = \{\s*data: new Date\(\)\.toISOString\(\),\s*nome: nome,\s*whatsapp: wpp,\s*instagram: inst,\s*segmento: seg,\s*gargalo: gar,\s*desafio: des,\s*origem: utmSource,\s*meio: utmMedium,\s*campanha: utmCampaign,\s*referencia: document\.referrer \|\| 'Direto'\s*\};/,
    `const payload = {
                nome: nome,
                telefone: wpp,
                whatsapp: wpp,
                instagram: inst,
                site: inst,
                segmento: seg,
                gargalo: gar,
                descricao: des,
                cenario: des,
                origem_site: "site_fluxai",
                servico_interesse: "Diagnóstico Estratégico FluxAI",
                page_path: window.location.pathname,
                timestamp: new Date().toISOString(),
                origem: utmSource,
                meio: utmMedium,
                campanha: utmCampaign,
                referencia: document.referrer || 'Direto'
            };`
);

// Add success message UI
js = js.replace(
    /btnSubmit\.innerHTML = 'Sucesso! <i class="fa-solid fa-check"><\/i>';\s*setTimeout\(\(\) => \{\s*btnSubmit\.innerHTML = originalText;\s*btnSubmit\.disabled = false;\s*diagnosticoForm\.reset\(\);\s*\}, 3000\);/g,
    `btnSubmit.innerHTML = 'Aguarde nosso contato! <i class="fa-solid fa-check"></i>';
                btnSubmit.style.background = '#10b981';
                btnSubmit.style.color = '#fff';
                setTimeout(() => {
                    btnSubmit.innerHTML = originalText;
                    btnSubmit.style.background = '';
                    btnSubmit.style.color = '';
                    btnSubmit.disabled = false;
                    diagnosticoForm.reset();
                }, 4000);`
);

fs.writeFileSync(script, js, 'utf8');

console.log('Fixes applied successfully!');
