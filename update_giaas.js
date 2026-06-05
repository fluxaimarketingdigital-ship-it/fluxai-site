const fs = require('fs');

const giaasPath = 'c:\\Users\\BRENDA\\Desktop\\Identidade Visual FluxAI\\FLUXAI_SITE\\giaas.html';
let content = fs.readFileSync(giaasPath, 'utf8');

// Add form_start logic to giaas.html
if(!content.includes('giaas_form_start_triggered')) {
    const focusLogic = `
        let giaas_form_start_triggered = false;
        document.getElementById('giaas-app-form').addEventListener('focusin', () => {
            if(!giaas_form_start_triggered) {
                giaas_form_start_triggered = true;
                trackEvent('form_start', { form_id: 'giaas-app-form' });
            }
        });
    `;
    
    content = content.replace(
        /(async function submitLead\(event\) \{)/,
        `${focusLogic}\n        $1`
    );
}

// Add lead_submit to submitLead on success
// The fetch inside submitLead returns response.ok
content = content.replace(
    /if\s*\(!response\.ok\)\s*throw new Error\('Falha'\);\s*btn\.innerHTML\s*=\s*'Aplica.*';/,
    `if (!response.ok) throw new Error('Falha');
                    
                    trackEvent('lead_submit', { form_id: 'giaas-app-form' });
                    
                    btn.innerHTML = 'Aplicação Recebida <i class="fa-solid fa-check"></i>';`
);

fs.writeFileSync(giaasPath, content, 'utf8');
console.log('giaas.html tracking updated.');
