const fs = require('fs');
const path = require('path');

const filesToRestore = [
    'index.html',
    'giaas.html',
    'pages/command-center.html',
    'pages/content-engine.html',
    'pages/crm-intelligence.html',
    'pages/automation-hub.html',
    'pages/finance-audit.html'
];

for (const file of filesToRestore) {
    const filePath = path.join('c:\\Users\\BRENDA\\Desktop\\Identidade Visual FluxAI\\FLUXAI_SITE', file);
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove the current injected favicons
    content = content.replace(/<!-- Favicon -->[\s\S]*?<link rel="apple-touch-icon".*?>\n/g, '');
    
    // Add back the original favicon-main.webp
    const pathLevel = file.includes('/') || file.includes('\\') ? '../' : './';
    const oldFavicon = `<link rel="icon" type="image/webp" href="${pathLevel}assets/icons/favicon-main.webp" />\n<link rel="shortcut icon" href="${pathLevel}assets/icons/favicon-main.webp" type="image/x-icon" />\n<link rel="apple-touch-icon" href="${pathLevel}assets/icons/favicon-main.webp" />\n`;
    
    if(!content.includes('favicon-main.webp')) {
        content = content.replace('</head>', `    ${oldFavicon}</head>`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Restored main site favicons to favicon-main.webp');
