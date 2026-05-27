const fs = require('fs');
const path = require('path');

const SCAN_TERMS = [
    'password', 'senha', 'token', 'secret', 'service_role', 'api_key',
    'access_token', 'refresh_token', 'bearer', 'webhook', 'hook.us',
    'meta_access_token', 'google_private_key', 'client_secret',
    'SUPABASE_SERVICE_ROLE', '.env', 'C:\\Users', 'file://'
];

const IGNORE_DIRS = [
    'node_modules', '.git', 'pdf', 'screenshots', 'assets', '.agent', '_backup_os_v1', '_backup_refatoracao'
];

const IGNORE_FILES = [
    'run_security_scan.js', 'package-lock.json', 'logo.png'
];

const results = [];

function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (let file of files) {
        const fullPath = path.join(dir, file);
        const relativePath = path.relative(__dirname, fullPath);
        
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (IGNORE_DIRS.includes(file)) continue;
            scanDirectory(fullPath);
        } else if (stat.isFile()) {
            if (IGNORE_FILES.includes(file)) continue;
            
            // Ignora arquivos binários conhecidos
            const ext = path.extname(file).toLowerCase();
            if (['.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.zip', '.mp4'].includes(ext)) continue;
            
            scanFile(fullPath, relativePath);
        }
    }
}

function scanFile(filePath, relativePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
        const lineNum = index + 1;
        for (let term of SCAN_TERMS) {
            let matched = false;
            // Para C:\Users e file:// precisamos de correspondência de strings literais sem quebrar escapes
            if (term === 'C:\\Users') {
                matched = line.toLowerCase().includes('c:\\users');
            } else {
                matched = line.toLowerCase().includes(term.toLowerCase());
            }
            
            if (matched) {
                // Classificação automática preliminar
                let classification = 'precisa avaliar';
                
                // Mocks locais em JS/HTML
                if (line.includes('mock') || line.includes('simula') || line.includes('example')) {
                    classification = 'seguro (dados simulados/mock)';
                }
                // Chave anonKey do Supabase
                else if (line.includes('anonKey') || line.includes('anon_key')) {
                    classification = 'público por design';
                }
                // Referências de interface ou formulário HTML (Ex: type="password")
                else if (line.includes('type="password"') || line.includes('id="password"') || line.includes('id="senha"') || line.includes('input')) {
                    classification = 'seguro (campo de formulário frontend)';
                }
                // Referências a variáveis de ambiente ou .env.example
                else if (relativePath.endsWith('.example') || line.includes('process.env') || line.includes('import.meta.env')) {
                    classification = 'seguro (referência a variável de ambiente)';
                }
                // Links internos relativos ou links documentados
                else if (line.includes('file://') && relativePath.includes('docs') && !line.includes('C:\\Users')) {
                    classification = 'seguro (link relativo ou documentado)';
                }
                // Comentários de boas práticas
                else if (line.includes('//') && (line.includes('nunca') || line.includes('never') || line.includes('segurança'))) {
                    classification = 'seguro (comentário de governança)';
                }
                // Chaves reais ou suspeitas
                else if (line.includes('SUPABASE_SERVICE_ROLE') || line.includes('service_role')) {
                    classification = 'precisa documentar como sensível / bloquear no Git';
                }
                
                results.push({
                    file: relativePath.replace(/\\/g, '/'),
                    line: lineNum,
                    term: term,
                    snippet: line.trim().substring(0, 120),
                    classification: classification
                });
            }
        }
    });
}

console.log("Starting security scan...");
scanDirectory(__dirname);
console.log(`Scan finished. Found ${results.length} occurrences.`);

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/`/g, "&#96;")
        .replace(/\|/g, "\\|");
}

// Gerar formato markdown de tabela 
let mdTable = "| Arquivo | Linha | Termo | Trecho de Código | Classificação |\n"; 
mdTable += "|:---|:---:|:---:|:---|:---:|\n"; 
 
results.forEach(res => { 
    // Escapa caracteres markdown na snippet 
    const safeSnippet = escapeHTML(res.snippet);  
    mdTable += `| [${path.basename(res.file)}](${res.file}) | ${res.line} | \`${res.term}\` | \`${safeSnippet}\` | ${res.classification} |\n`; 
}); 

fs.writeFileSync('scan_results.md', mdTable);
console.log("Results saved to scan_results.md");
