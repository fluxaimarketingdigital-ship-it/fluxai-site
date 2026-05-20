import fs from 'fs';

const filePath = 'os/modules/content-engine/content-engine.js';
const content = fs.readFileSync(filePath, 'utf8');

const regex = /.{0,20}Ã.{0,20}/g;
let match;
while ((match = regex.exec(content)) !== null) {
    console.log(`Match at index ${match.index}:`);
    console.log(`  Raw: "${match[0]}"`);
    const hex = match[0].split('').map(c => '0x' + c.charCodeAt(0).toString(16)).join(' ');
    console.log(`  Hex: ${hex}`);
}
