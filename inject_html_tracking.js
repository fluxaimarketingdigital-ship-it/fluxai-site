const fs = require('fs');
const path = require('path');

const basePath = 'c:\\Users\\BRENDA\\Desktop\\Identidade Visual FluxAI\\FLUXAI_SITE';

function getAllFiles(dirPath, arrayOfFiles) {
  let files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      if(file !== 'os' && file !== '.agent') {
          arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
      }
    } else {
      if(file.endsWith('.html') && file !== 'deck.html') {
          arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });
  return arrayOfFiles;
}

const files = getAllFiles(basePath);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Mapear eventos GTM para os CTAs
    // 1. Garantir Diagnóstico (Hero Home & pages)
    content = content.replace(/class="btn-primary"([^>]*href="#aplicar"[^>]*)>/g, 'class="btn-primary"$1 onclick="trackEvent(\'diagnostic_cta_click\', { button_text: \'Garantir Diagnóstico\', cta_position: \'hero\' })">');
    // 2. Garantir meu diagnóstico estratégico (Footer Home)
    content = content.replace(/id="diagnostico"([^>]*)class="btn-submit"/g, 'id="diagnostico"$1class="btn-submit" onclick="trackEvent(\'diagnostic_cta_click\', { button_text: \'Garantir meu diagnóstico estratégico\', cta_position: \'footer\' })"');
    
    // 3. Form Home is in script.js

    // 4. Aplicar para Diagnóstico Estratégico (Giaas Hero)
    if(file.includes('giaas.html')) {
        content = content.replace(/class="btn-primary"\s*([^>]*)>\s*Aplicar para Diagnóstico/g, 'class="btn-primary" $1 onclick="trackEvent(\'offer_click\', { button_text: \'Aplicar para Diagnóstico\', cta_position: \'hero\', destination: \'/giaas\' })">\n                Aplicar para Diagnóstico');
    }

    // 6. Sistema de Crescimento (Rodapé)
    content = content.replace(/<a href="\/giaas"([^>]*)>Sistema de Crescimento<\/a>/g, '<a href="/giaas"$1 onclick="trackEvent(\'offer_click\', { button_text: \'Sistema de Crescimento\', cta_position: \'footer\', destination: \'/giaas\' })">Sistema de Crescimento</a>');

    // 7. Instagram
    content = content.replace(/href="https:\/\/www.instagram.com[^"]*"([^>]*)>/g, 'href="https://www.instagram.com/fluxai.labs/"$1 onclick="trackEvent(\'outbound_click\', { button_text: \'Instagram\', destination: \'instagram\' })">');
    
    // 8. LinkedIn
    content = content.replace(/href="https:\/\/www.linkedin.com[^"]*"([^>]*)>/g, 'href="https://www.linkedin.com/company/112506521"$1 onclick="trackEvent(\'outbound_click\', { button_text: \'LinkedIn\', destination: \'linkedin\' })">');

    // 9. Portal do Cliente
    content = content.replace(/href="\/os\/login.html"([^>]*)class="btn btn-primary"([^>]*)>/g, 'href="/os/login.html"$1class="btn btn-primary"$2 onclick="trackEvent(\'portal_click\', { button_text: \'Portal do Cliente\' })">');

    // 10. Explorar Conceito
    content = content.replace(/href="\/pages\/command-center.html"([^>]*)class="btn btn-secondary"([^>]*)>/g, 'href="/pages/command-center.html"$1class="btn btn-secondary"$2 onclick="trackEvent(\'module_page_click\', { button_text: \'Explorar Conceito\', destination: \'/pages/command-center.html\' })">');

    // 11. Botões de Módulos (Menu e Rodapé)
    const modules = [
        { href: '/pages/command-center.html', name: 'MOD.01 Command Center' },
        { href: '/pages/content-engine.html', name: 'MOD.02 Content Engine' },
        { href: '/pages/crm-intelligence.html', name: 'MOD.03 CRM Intelligence' },
        { href: '/pages/automation-hub.html', name: 'MOD.04 Automation Hub' },
        { href: '/pages/analytics-intelligence.html', name: 'MOD.05 Analytics Intelligence' },
        { href: '/pages/governanca.html', name: 'MOD.06 Governança Operacional' }
    ];

    modules.forEach(m => {
        // Ex: <a href="/pages/command-center.html">MOD.01 Command Center</a>
        let regex = new RegExp(`<a href="${m.href}"([^>]*)>${m.name.replace(/\./g, '\\.')}<\\/a>`, 'g');
        content = content.replace(regex, `<a href="${m.href}"$1 onclick="trackEvent('module_page_click', { button_text: '${m.name}', destination: '${m.href}' })">${m.name}</a>`);
    });

    // 12. WhatsApp is handled in script.js global selector

    // 13. Política de Privacidade
    content = content.replace(/id="openPrivacyModal"([^>]*)>/g, 'id="openPrivacyModal"$1 onclick="trackEvent(\'footer_link_click\', { button_text: \'Política de Privacidade\' })">');

    // 14. Voltar ao Topo
    content = content.replace(/<a href="#topo"([^>]*)class="back-to-top"([^>]*)>/g, '<a href="#topo"$1class="back-to-top"$2 onclick="trackEvent(\'footer_link_click\', { button_text: \'Voltar ao Topo\' })">');

    // Avoid duplicate onclicks if script runs twice
    content = content.replace(/onclick="trackEvent\([^)]*\)"\s*onclick="trackEvent\([^)]*\)"/g, match => match.split(' onclick')[0] + ' onclick' + match.split(' onclick')[1]);

    fs.writeFileSync(file, content, 'utf8');
});

console.log('HTML tracking tags updated.');
