const fs = require('fs');
const files = [
  'pages/crm-intelligence.html',
  'pages/diagnosticos.html',
  'pages/fluxai-os.html',
  'pages/mercados.html',
  'pages/processo.html',
];
const BOM = Buffer.from([0xEF, 0xBB, 0xBF]);
for (const f of files) {
  const buf = fs.readFileSync(f);
  if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
    const stripped = buf.slice(3);
    fs.writeFileSync(f, stripped);
    console.log('BOM_REMOVED: ' + f);
  } else {
    console.log('NO_BOM: ' + f);
  }
}
console.log('DONE');