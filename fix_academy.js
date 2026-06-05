const fs = require('fs');
const jsPath = 'c:\\Users\\BRENDA\\Desktop\\Identidade Visual FluxAI\\FLUXAI_SITE\\os\\js\\modules\\fluxai-academy.js';
let js = fs.readFileSync(jsPath, 'utf8');

js = js.replace('loadVideo(firstAvailable.id);', 'window.loadAcademyVideo(firstAvailable.id);');

// Make sure the placeholder text exactly matches the user's request
js = js.replace('Aguardando a gravação final e upload (Fase 05).<br>O script (roteiro) já está pronto!', 'Este treinamento será disponibilizado após a gravação oficial.');

fs.writeFileSync(jsPath, js, 'utf8');
console.log('JS fixed');

const htmlPath = 'c:\\Users\\BRENDA\\Desktop\\Identidade Visual FluxAI\\FLUXAI_SITE\\os\\fluxai-academy.html';
let html = fs.readFileSync(htmlPath, 'utf8');

html = html.replace(
    '<link rel="stylesheet" href="./css/os-theme.css">\n    <link rel="stylesheet" href="./css/os-layout.css">\n    <link rel="stylesheet" href="./css/os-components.css">',
    '<link rel="stylesheet" href="./styles/interface.css">\n    <link rel="stylesheet" href="./styles/components.css">'
);

// For mobile, ensure the sidebar has a basic collapsible styling if needed, but fixing the CSS paths should be enough since other pages work. We will add a small patch just in case.
const mobilePatch = `
    <style>
        @media (max-width: 768px) {
            .os-sidebar {
                display: flex;
                flex-direction: column;
                background: #0f120f;
            }
            .os-sidebar a {
                display: block;
                padding: 15px;
                border-bottom: 1px solid rgba(255,255,255,0.05);
                text-decoration: none;
                color: #fff;
            }
        }
    </style>
</head>`;
html = html.replace('</head>', mobilePatch);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('HTML fixed');
