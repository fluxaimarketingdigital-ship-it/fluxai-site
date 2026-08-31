// BRAND-WEB-001-R4: apply_footer_brand_r4.js
const fs = require('fs');
const path = require('path');
const NEW_ASSET = '/assets/images/branding/FluxAI_Labs_Wordmark_Horizontal_Official_v1.png';
const NEW_STYLE = 'width: 140px; margin-bottom: 25px;';
const HTML_FILES = [
  'index.html','giaas.html',
  'pages/analytics-intelligence.html','pages/analytics.html',
  'pages/automation-hub.html','pages/command-center.html',
  'pages/content-engine.html','pages/crm-intelligence.html',
  'pages/diagnosticos.html','pages/fluxai-os.html',
  'pages/governanca.html','pages/govos.html',
  'pages/mercados.html','pages/processo.html',
];
let totalModified = 0;
for (const relPath of HTML_FILES) {
  const filePath = path.join(__dirname, relPath);
  if (!fs.existsSync(filePath)) { console.log('SKIP: ' + relPath); continue; }
  const original = fs.readFileSync(filePath, 'utf8');
  let matchCount = 0;
  const updated = original.replace(/<img\s[^>]*alt="FluxAI Labs"[^>]*\/?>/g, (match) => {
    if (match.includes('footer-logo') || match.includes('logo-secondary') || match.includes('logo-horizontal') || match.includes('FluxAI_Labs_Wordmark')) {
      matchCount++;
      if (match.includes('class="footer-logo"')) return '<img src="' + NEW_ASSET + '" alt="FluxAI Labs" class="footer-logo" style="' + NEW_STYLE + '" loading="lazy" />';
      if (match.includes('class="logo-img"')) return '<img src="' + NEW_ASSET + '" alt="FluxAI Labs" class="logo-img" style="max-width: 140px; height: auto;" />';
      return '<img src="' + NEW_ASSET + '" alt="FluxAI Labs" style="' + NEW_STYLE + '" />';
    }
    return match;
  });
  if (updated !== original) { fs.writeFileSync(filePath, updated, 'utf8'); console.log('UPDATED (' + matchCount + '): ' + relPath); totalModified++; }
  else { console.log('NO_MATCH: ' + relPath); }
}
console.log('\nSUMMARY: ' + totalModified + ' files updated');
let totalMojibake = 0;
for (const relPath of HTML_FILES) {
  const filePath = path.join(__dirname, relPath);
  if (!fs.existsSync(filePath)) continue;
  const m = (fs.readFileSync(filePath,'utf8').match(/\u00c3\u00a9|\u00c3\u00a3|\u00c3\u00a7|\u00c3\u00a1|\u00c3\u00b3|\u00c3\u00b1/g)||[]).length;
  if (m > 0) { console.log('MOJIBAKE ' + relPath + ': ' + m); totalMojibake += m; }
}
console.log('MOJIBAKE_TOTAL: ' + totalMojibake);