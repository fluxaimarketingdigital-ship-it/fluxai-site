const fs = require('fs');
const path = require('path');

const files = [
    'giaas.html',
    'pages/command-center.html',
    'pages/content-engine.html',
    'pages/crm-intelligence.html',
    'pages/automation-hub.html',
    'pages/analytics-intelligence.html',
    'pages/governanca.html'
];

const faviconTags = `
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/assets/icons/favicon-os.png" />
    <link rel="shortcut icon" href="/assets/icons/favicon-os.png" type="image/x-icon" />
    <link rel="apple-touch-icon" href="/assets/icons/favicon-os.png" />
`;

files.forEach(file => {
    const filePath = path.join('c:\\Users\\BRENDA\\Desktop\\Identidade Visual FluxAI\\FLUXAI_SITE', file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove existing favicon webp tags if they exist
        content = content.replace(/<link rel="icon".*favicon-main\.webp".*>/g, '');
        content = content.replace(/<link rel="shortcut icon".*favicon-main\.webp".*>/g, '');
        content = content.replace(/<link rel="apple-touch-icon".*favicon-main\.webp".*>/g, '');
        content = content.replace(/<!-- Favicon.*-->/g, '');

        // Also check if there's any other favicon tag
        content = content.replace(/<link rel="icon".*>/g, '');
        content = content.replace(/<link rel="shortcut icon".*>/g, '');

        // Insert new favicon right before </head>
        content = content.replace('</head>', `${faviconTags}</head>`);
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated favicon in ${file}`);
    } else {
        console.log(`File not found: ${file}`);
    }
});
