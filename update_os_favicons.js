const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Use relative paths to FLUXAI_SITE
const siteDir = 'c:\\Users\\BRENDA\\Desktop\\Identidade Visual FluxAI\\FLUXAI_SITE';

// Find all HTML files in root and os/
const files = glob.sync('{*.html,os/*.html}', { cwd: siteDir });

files.forEach(file => {
    const filePath = path.join(siteDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Calculate pathLevel
    const pathLevel = file.includes('/') || file.includes('\\') ? '../' : './';
    
    // Check if the file already has the new favicon tag
    if (!content.includes('favicon-os.png')) {
        // Remove old tags
        content = content.replace(/<link rel="icon".*favicon-main\.webp".*>/g, '');
        content = content.replace(/<link rel="shortcut icon".*favicon-main\.webp".*>/g, '');
        content = content.replace(/<link rel="apple-touch-icon".*favicon-main\.webp".*>/g, '');
        content = content.replace(/<!-- Favicon.*-->/g, '');

        const faviconTags = `
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="${pathLevel}assets/icons/favicon-os.png" />
    <link rel="shortcut icon" href="${pathLevel}assets/icons/favicon-os.png" type="image/x-icon" />
    <link rel="apple-touch-icon" href="${pathLevel}assets/icons/favicon-os.png" />
`;
        content = content.replace('</head>', `${faviconTags}</head>`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Favicon fixed in ${file}`);
    }
});
