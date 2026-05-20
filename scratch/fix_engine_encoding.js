import fs from 'fs';

const filePath = 'os/modules/content-engine/content-engine.js';
let content = fs.readFileSync(filePath, 'utf8');

// Replacements map - ordered from longest to shortest to prevent partial matching issues
const replacements = [
    // Multi-character / specific corrupted Unicode sequences
    { pattern: 'Ã‡Ãƒ', replacement: 'ÇÃ' },
    { pattern: '\u00c3\u2021\u00c3\u0192', replacement: 'ÇÃ' },
    { pattern: 'Ã§Ã£', replacement: 'çã' },
    { pattern: 'Ã§Ãµ', replacement: 'çõ' },
    
    // Single character double-encoded patterns
    { pattern: 'Ã¢', replacement: 'â' },
    { pattern: 'Ã ', replacement: 'à' },
    { pattern: 'Ã¡', replacement: 'á' },
    { pattern: 'Ã£', replacement: 'ã' },
    { pattern: 'Ã§', replacement: 'ç' },
    { pattern: 'Ã©', replacement: 'é' },
    { pattern: 'Ãª', replacement: 'ê' },
    { pattern: 'Ã­', replacement: 'í' }, // soft-hyphen/i-accent combo
    { pattern: 'Ã³', replacement: 'ó' },
    { pattern: 'Ã´', replacement: 'ô' },
    { pattern: 'Ãµ', replacement: 'õ' },
    { pattern: 'Ãº', replacement: 'ú' },
    { pattern: 'Ã¼', replacement: 'ü' },
    
    // Uppercase double-encoded patterns
    { pattern: 'Ã‰', replacement: 'É' },
    { pattern: 'Ã‡', replacement: 'Ç' },
    { pattern: 'Ãƒ', replacement: 'Ã' },
    { pattern: 'Ã•', replacement: 'Õ' },
    { pattern: 'Ãš', replacement: 'Ú' },
    { pattern: 'Ã‚', replacement: 'Â' },
    { pattern: 'Ã”', replacement: 'Ô' },
    { pattern: 'Ã“', replacement: 'Ó' },
    { pattern: 'Ã€', replacement: 'À' },
    
    // Specific replacement character issues (Windows-1252 / Unicode replacement char)
    { pattern: 'DISPONÃ\ufffdVEL', replacement: 'DISPONÍVEL' },
    { pattern: 'DISPONÃVEL', replacement: 'DISPONÍVEL' },
    { pattern: 'RESPONSÃ\ufffdVEL', replacement: 'RESPONSÁVEL' },
    { pattern: 'RESPONSÃVEL', replacement: 'RESPONSÁVEL' },
    
    // Extra cleanups
    { pattern: 'GestÃ£o', replacement: 'Gestão' },
    { pattern: 'gestÃ£o', replacement: 'gestão' },
    { pattern: 'GESTÃƒO', replacement: 'GESTÃO' },
];

console.log("Starting replacements...");
let count = 0;
replacements.forEach(r => {
    // Escape regex special chars
    const escapedPattern = r.pattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(escapedPattern, 'g');
    const matchCount = (content.match(regex) || []).length;
    if (matchCount > 0) {
        content = content.replace(regex, r.replacement);
        console.log(`Replaced "${r.pattern}" -> "${r.replacement}" (${matchCount} occurrences)`);
        count += matchCount;
    }
});

console.log(`Finished. Total replacements: ${count}`);

// Let's write it back to the file
fs.writeFileSync(filePath, content, 'utf8');
console.log("File saved successfully.");
