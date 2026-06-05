const fs = require('fs');

const index = 'c:\\Users\\BRENDA\\Desktop\\Identidade Visual FluxAI\\FLUXAI_SITE\\index.html';
const script = 'c:\\Users\\BRENDA\\Desktop\\Identidade Visual FluxAI\\FLUXAI_SITE\\src\\scripts\\script.js';

let html = fs.readFileSync(index, 'utf8');
let js = fs.readFileSync(script, 'utf8');

// 1. Fixing CTA in HTML
html = html.replace(
    /<button type="button" class="btn btn-primary btn-large" style="cursor:pointer; border:none; font-family:inherit;" onclick=".*"\s*>\s*Garantir Meu Diagnóstico Estratégico <i class="fa-solid fa-fire"><\/i>\s*<\/button>/i,
    `<button type="button" id="impact_diagnostic_cta" class="btn btn-primary btn-large" style="cursor:pointer; border:none; font-family:inherit;">
            Garantir Meu Diagnóstico Estratégico <i class="fa-solid fa-fire"></i>
          </button>`
);

fs.writeFileSync(index, html, 'utf8');

// 2. Fixing CTA listener and Form fetch logic in script.js
// Find where to append the CTA listener (e.g. at the bottom of the DOMContentLoaded block)
const ctaLogic = `
    // CTA EVENT LISTENER EXPLICITO
    document.querySelector('#impact_diagnostic_cta')?.addEventListener('click', function(e) {
        e.preventDefault();
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: "diagnostic_cta_click",
            button_text: "Garantir meu diagnóstico estratégico",
            button_id: "impact_diagnostic_cta",
            cta_position: "impact_section",
            destination: "#diagnostico",
            page_path: window.location.pathname,
            page_location: window.location.href
        });

        const target = document.querySelector('#diagnostico');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
`;

js = js.replace(/(}\);\s*initWelcomePopup\(\);)/, `${ctaLogic}\n    $1`);

// Form replace
const oldFetch = /const WEBHOOK_URL = INTEGRATIONS\.webhookUrl;[\s\S]*?btnSubmit\.disabled = false;\s*diagnosticoForm\.reset\(\);\s*\}, 4000\);\s*\}\s*catch\(error\)\s*\{\s*\/\/ WhatsApp redirect removido.*?\n\s*\}/g;

const newFetch = `const WEBHOOK_URL = 'https://mufgwetfhfhhmhowbhjj.supabase.co/functions/v1/make-proxy';

            const payload = {
                nome_lead: nome,
                telefone: wpp,
                instagram_site: inst,
                segmento: seg,
                gargalo: gar,
                desafio: des,
                origem_site: "site_fluxai",
                servico_interesse: "Diagnóstico Estratégico FluxAI",
                page_path: "/",
                page_location: window.location.href,
                timestamp: new Date().toISOString()
            };

            try {
                const response = await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (!response.ok) throw new Error('Falha no envio');
                
                if(typeof fbq === 'function') fbq('track', 'Lead');
                trackEvent('lead_submit', { form_id: 'diagnosticoForm' });
                
                btnSubmit.innerHTML = 'Aguarde nosso contato. Sua aplicação foi recebida. <i class="fa-solid fa-check"></i>';
                btnSubmit.style.background = '#10b981';
                btnSubmit.style.color = '#fff';
                
                setTimeout(() => {
                    btnSubmit.innerHTML = originalText;
                    btnSubmit.style.background = '';
                    btnSubmit.style.color = '';
                    btnSubmit.disabled = false;
                    diagnosticoForm.reset();
                }, 4000);
            } catch(error) {
                console.error("Erro ao enviar form", error);
                btnSubmit.innerHTML = 'Não foi possível enviar sua aplicação agora. Revise os dados e tente novamente.';
                btnSubmit.style.background = '#ef4444';
                setTimeout(() => {
                    btnSubmit.innerHTML = originalText;
                    btnSubmit.style.background = '';
                    btnSubmit.disabled = false;
                }, 4000);
            }`;

js = js.replace(oldFetch, newFetch);

fs.writeFileSync(script, js, 'utf8');

console.log('Final blocking bugs fixed.');
