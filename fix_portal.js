const fs = require('fs');
let content = fs.readFileSync('os/client-portal.html', 'utf8');

const search1 = "const profession = proj.metadata?.onboarding?.profession || 'Estratégia Institucional';";
const replace1 = "window.currentClientDriveLink = proj.metadata?.onboarding?.asset_drive_link || proj.metadata?.asset_drive_link || '#';\n                    const profession = proj.metadata?.onboarding?.profession || 'Estratégia Institucional';";
content = content.replace(search1, replace1);

const search2 = "const profession = proj.metadata?.onboarding?.profession || proj.segment || 'Estratégia Institucional';";
const replace2 = "window.currentClientDriveLink = proj.metadata?.onboarding?.asset_drive_link || proj.metadata?.asset_drive_link || '#';\n                    const profession = proj.metadata?.onboarding?.profession || proj.segment || 'Estratégia Institucional';";
content = content.replace(search2, replace2);

const search3 = "btn1.onclick = () => window.location.href = '#';";
const replace3 = "btn1.onclick = () => { const driveUrl = window.currentClientDriveLink || '#'; if (driveUrl !== '#') { window.open(driveUrl, '_blank'); } else { alert('Link da pasta do cliente (Drive) não configurado no Onboarding.'); } };";
content = content.replace(search3, replace3);

fs.writeFileSync('os/client-portal.html', content, 'utf8');
