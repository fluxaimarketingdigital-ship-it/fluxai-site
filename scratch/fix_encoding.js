import fs from 'fs';

const filePath = 'os/modules/content-engine/content-engine.js';
const content = fs.readFileSync(filePath, 'utf8');

// Convert UTF-8 string back to bytes using ISO-8859-1, then decode as UTF-8
function decodeDoubleUTF8(str) {
    const buf = Buffer.from(str, 'binary'); // 'binary' encoding in Node reads/writes 8-bit character codes directly to bytes
    return buf.toString('utf8');
}

try {
    const fixedContent = decodeDoubleUTF8(content);
    console.log("First 1000 characters of fixed content:");
    console.log(fixedContent.substring(0, 1000));
    
    // Check if some key terms are fixed
    console.log("\nChecking specific lines or terms:");
    const lines = fixedContent.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('GESTÃO') || lines[i].includes('Gestão') || lines[i].includes('Atenção')) {
            console.log(`Line ${i + 1}: ${lines[i].trim()}`);
        }
    }
} catch (e) {
    console.error("Error during recovery:", e);
}
