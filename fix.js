const fs = require('fs');
let content = fs.readFileSync('os/modules/content-engine/content-engine.js', 'utf8');
const searchHTML = '<button class="btn-mini safe-btn-edit"';
const replaceHTML = '<button class="btn-mini safe-btn-link" title="Copiar Link Cliente" style="background: rgba(255, 255, 255, 0.05); border-color: #444; color: #fff;"><i class="fa-solid fa-link"></i></button>\n                        <button class="btn-mini safe-btn-edit"';
content = content.replace(searchHTML, replaceHTML);

const searchJS = 'tr.querySelector(\'.safe-btn-edit\').onclick = () => window.openEditModal(c.id);';
const replaceJS = 'tr.querySelector(\'.safe-btn-link\').onclick = () => { const url = window.location.origin + \'/os/approval.html?id=\' + c.id; navigator.clipboard.writeText(url).then(() => alert(\'Link de aprovação copiado!\\n\' + url)); };\n        tr.querySelector(\'.safe-btn-edit\').onclick = () => window.openEditModal(c.id);';
content = content.replace(searchJS, replaceJS);

fs.writeFileSync('os/modules/content-engine/content-engine.js', content, 'utf8');
