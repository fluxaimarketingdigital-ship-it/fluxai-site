const fs = require('fs');
let content = fs.readFileSync('os/content-engine.html', 'utf8');

const searchHTML = '<button id="btn-ai-planner" class="btn-ai"';
const replaceHTML = '<button id="btn-config-openai" class="btn-ai" style="height: 34px; padding: 0 15px; background: rgba(255, 255, 255, 0.05); border: 1px solid #444; color: #fff; margin-right: 5px;" title="Configurar Chave da OpenAI"><i class="fa-solid fa-key"></i></button>\n                            <button id="btn-ai-planner" class="btn-ai"';
content = content.replace(searchHTML, replaceHTML);

fs.writeFileSync('os/content-engine.html', content, 'utf8');
