const fs = require('fs');
const glob = require('glob');
const path = require('path');

const basePath = 'c:\\Users\\BRENDA\\Desktop\\Identidade Visual FluxAI\\FLUXAI_SITE';

// Finding all HTML files excluding /os/
const files = glob.sync('**/*.html', { cwd: basePath, ignore: ['os/**', 'deck.html'] });

files.forEach(file => {
    let fullPath = path.join(basePath, file);
    let content = fs.readFileSync(fullPath, 'utf8');

    // Replace footer links and general links
    content = content.replace(/>\s*Command Center\s*<\/a>/g, '>MOD.01 Command Center</a>');
    content = content.replace(/>\s*Content Engine\s*<\/a>/g, '>MOD.02 Content Engine</a>');
    content = content.replace(/>\s*CRM Intelligence\s*<\/a>/g, '>MOD.03 CRM Intelligence</a>');
    content = content.replace(/>\s*Automation Hub\s*<\/a>/g, '>MOD.04 Automation Hub</a>');
    content = content.replace(/>\s*Analytics Intelligence\s*<\/a>/g, '>MOD.05 Analytics Intelligence</a>');
    content = content.replace(/>\s*Governança\s*<\/a>/g, '>MOD.06 Governança Operacional</a>');

    // Replace list items in Home
    content = content.replace(/<li><i class="fa-solid fa-check"><\/i>\s*Command Center<\/li>/g, '<li><i class="fa-solid fa-check"></i> MOD.01 Command Center</li>');
    content = content.replace(/<li><i class="fa-solid fa-check"><\/i>\s*Content Engine<\/li>/g, '<li><i class="fa-solid fa-check"></i> MOD.02 Content Engine</li>');
    content = content.replace(/<li><i class="fa-solid fa-check"><\/i>\s*CRM Intelligence<\/li>/g, '<li><i class="fa-solid fa-check"></i> MOD.03 CRM Intelligence</li>');

    // Replace title headers if missing MOD (excluding when it already has [MOD.XX])
    // Be careful here not to replace the title tag itself or places where it's already MOD.01

    fs.writeFileSync(fullPath, content, 'utf8');
});

console.log("MOD prefixes updated.");
