const fs = require('fs');
const path = require('path');

const scriptPath = 'c:\\Users\\BRENDA\\Desktop\\Identidade Visual FluxAI\\FLUXAI_SITE\\src\\scripts\\script.js';
let content = fs.readFileSync(scriptPath, 'utf8');

// Replace social proof gtag with nothing or trackEvent?
// User said: "Eventos que NÃO precisam ir para Make: Instagram, LinkedIn" (handled in HTML).
// The social proof might refer to the testimonials. Wait, I see "click_social_proof".
content = content.replace(
    /if\(typeof gtag === 'function'\) \{\s*gtag\('event', 'click_social_proof', \{\s*'event_category': 'engagement',\s*'event_label': platform\s*\}\);\s*\}/g,
    "trackEvent('click_social_proof', { button_text: 'Social Proof', platform: platform });"
);

// Form tracking: we need to trigger form_start on focus
// We'll append an event listener to inputs in diagnosticoForm
if(!content.includes('form_start_triggered')) {
    const focusLogic = `
        let form_start_triggered = false;
        diagnosticoForm.addEventListener('focusin', () => {
            if(!form_start_triggered) {
                form_start_triggered = true;
                trackEvent('form_start', { form_id: 'diagnosticoForm' });
            }
        });
    `;
    content = content.replace(
        /(const diagnosticoForm = document\.getElementById\('diagnosticoForm'\);\s*if \(diagnosticoForm\) \{)/,
        `$1\n${focusLogic}`
    );
}

// Replace lead_submit
content = content.replace(
    /if\(typeof fbq === 'function'\) fbq\('track', 'Lead'\);\s*if\(typeof gtag === 'function'\) gtag\('event', 'generate_lead', \{\s*'event_category': 'engagement',\s*'event_label': 'Formulário Diagnóstico'\s*\}\);/g,
    "// gtag generate_lead will be called only on success."
);

// Append trackEvent('lead_submit') ONLY on success
// The fetch block in script.js has `await fetch(WEBHOOK_URL...`
content = content.replace(
    /(await fetch\(WEBHOOK_URL, \{[^}]*\}\);\s*\} catch\(error\) \{)/,
    `await fetch(WEBHOOK_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    
                    if(typeof fbq === 'function') fbq('track', 'Lead');
                    trackEvent('lead_submit', { form_id: 'diagnosticoForm' });
                } catch(error) {`
);

// Replace whatsapp clicks
content = content.replace(
    /if\(typeof gtag === 'function'\) \{\s*gtag\('event', 'contact_whatsapp', \{\s*'event_category': 'engagement',\s*'event_label': 'Clique WhatsApp'\s*\}\);\s*\}/g,
    "trackEvent('whatsapp_click', { destination: 'whatsapp' });"
);

fs.writeFileSync(scriptPath, content, 'utf8');
console.log('script.js updated.');
