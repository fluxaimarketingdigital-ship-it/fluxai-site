const fs = require('fs');
const data = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const headersList = data.headers.find(h => h.source === '/(.*)').headers;
const csp = headersList.find(h => h.key === 'Content-Security-Policy');
csp.value = csp.value.replace('connect-src ''self''', 'connect-src ''self'' https://api.openai.com');
fs.writeFileSync('vercel.json', JSON.stringify(data, null, 2), 'utf8');
