const fs = require('fs');
const path = require('path');

const files = [
    { name: 'giaas.html', pathLevel: './' },
    { name: 'pages/command-center.html', pathLevel: '../' },
    { name: 'pages/content-engine.html', pathLevel: '../' },
    { name: 'pages/crm-intelligence.html', pathLevel: '../' },
    { name: 'pages/automation-hub.html', pathLevel: '../' },
    { name: 'pages/analytics-intelligence.html', pathLevel: '../' },
    { name: 'pages/governanca.html', pathLevel: '../' }
];

files.forEach(fileObj => {
    const filePath = path.join('c:\\Users\\BRENDA\\Desktop\\Identidade Visual FluxAI\\FLUXAI_SITE', fileObj.name);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove the previous absolute paths we just injected
        content = content.replace(/<link rel="icon" type="image\/png" href="\/assets\/icons\/favicon-os\.png" \/>/g, '');
        content = content.replace(/<link rel="shortcut icon" href="\/assets\/icons\/favicon-os\.png" type="image\/x-icon" \/>/g, '');
        content = content.replace(/<link rel="apple-touch-icon" href="\/assets\/icons\/favicon-os\.png" \/>/g, '');
        content = content.replace(/<!-- Favicon -->/g, '');

        const faviconTags = `
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="${fileObj.pathLevel}assets/icons/favicon-os.png" />
    <link rel="shortcut icon" href="${fileObj.pathLevel}assets/icons/favicon-os.png" type="image/x-icon" />
    <link rel="apple-touch-icon" href="${fileObj.pathLevel}assets/icons/favicon-os.png" />
`;

        content = content.replace('</head>', `${faviconTags}</head>`);
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated relative favicon in ${fileObj.name}`);
    } else {
        console.log(`File not found: ${fileObj.name}`);
    }
});
