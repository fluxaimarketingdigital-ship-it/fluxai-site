import fs from 'fs';

const filePath = 'os/modules/content-engine/content-engine.js';
const content = fs.readFileSync(filePath, 'utf8');

const regex = /[\u00C0-\u00FF][\u0080-\u00BF\u00C0-\u00FF]*/g;
const matches = content.match(regex);
const uniqueMatches = Array.from(new Set(matches));

console.log("Non-ASCII matches:");
uniqueMatches.forEach(m => {
    // Show hex representation of the characters
    const hex = m.split('').map(c => '0x' + c.charCodeAt(0).toString(16)).join(' ');
    console.log(`${m} (${hex})`);
});
