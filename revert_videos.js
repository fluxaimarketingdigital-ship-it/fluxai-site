const fs = require('fs');
const path = require('path');

const filePath = path.join('c:\\Users\\BRENDA\\Desktop\\Identidade Visual FluxAI\\FLUXAI_SITE', 'os/js/modules/fluxai-academy.js');

let content = fs.readFileSync(filePath, 'utf8');

// Revert the videoUrl links so the "GRAVACAO PENDENTE" UI shows up again
content = content.replace(/videoUrl: '..\/docs\/academy\/videos_estrutura\/.*\.mp4',/g, "videoUrl: '',");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Reverted videoUrls to empty string');
