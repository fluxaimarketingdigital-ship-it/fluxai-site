const fs = require('fs');
const path = require('path');

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://mufgwetfhfhhmhowbhjj.supabase.co';
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11Zmd3ZXRmaGZoaG1ob3diaGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1Mzg1MDYsImV4cCI6MjA5NDExNDUwNn0.G0VxvE6acPRKZIwee7d2ARBkIdqf9SRvVI1uagMrBZI';

// 1. Generate supabase-keys.js
const content = `/**
 * CONFIG: Supabase Keys
 * Gerado automaticamente no build (Environment-Aware)
 * NUNCA commitar chaves secretas ou de staging aqui.
 */

export const SUPABASE_CONFIG = {
    url: "${url}",
    anonKey: "${anonKey}"
};
`;

const keysPath = path.join(__dirname, '../os/config/secrets/supabase-keys.js');
fs.writeFileSync(keysPath, content, 'utf8');
console.log(`[Build] Injected Supabase Config for host: ${new URL(url).hostname} into supabase-keys.js`);

// 2. Search and replace hardcoded production URLs in HTML and JS files
const prodId = 'mufgwetfhfhhmhowbhjj';
const targetId = new URL(url).hostname.split('.')[0]; // e.g. rmbxeikejzbcfiooylsd

function replaceInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let fileContent = fs.readFileSync(filePath, 'utf8');
    if (fileContent.includes(prodId) && targetId !== prodId) {
        fileContent = fileContent.replace(new RegExp(prodId, 'g'), targetId);
        fs.writeFileSync(filePath, fileContent, 'utf8');
        console.log(`[Build] Replaced prod ID with ${targetId} in ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'scripts') walkDir(fullPath);
        } else {
            if (fullPath.endsWith('.html') || fullPath.endsWith('.js')) {
                if (fullPath !== keysPath) replaceInFile(fullPath);
            }
        }
    }
}

if (targetId !== prodId) {
    walkDir(path.join(__dirname, '../'));
}
