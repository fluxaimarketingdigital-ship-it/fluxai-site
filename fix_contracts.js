const fs = require('fs');
let content = fs.readFileSync('os/js/contracts-finance.js', 'utf8');

// The block with tr.innerHTML around 324 is probably `renderFinanceAlerts` or similar. Let's find them.
content = content.replace(/tr\.innerHTML = `[\s\S]*?<td class="safe-status"><\/td>\s*`;/g, 
`const td1 = document.createElement('td');
td1.className = 'cell-primary';
const divDate = document.createElement('div');
divDate.className = 'safe-data';
const divId = document.createElement('div');
divId.className = 'safe-id';
divId.style.cssText = 'font-size: 0.7rem; color: var(--os-text-muted); font-family: monospace;';
td1.appendChild(divDate);
td1.appendChild(divId);
tr.appendChild(td1);

const td2 = document.createElement('td');
td2.className = 'safe-empresa';
tr.appendChild(td2);

const td3 = document.createElement('td');
td3.className = 'safe-valor';
tr.appendChild(td3);

const td4 = document.createElement('td');
td4.className = 'safe-tipo';
tr.appendChild(td4);

const td5 = document.createElement('td');
td5.className = 'safe-status';
tr.appendChild(td5);`);

// 415 and 425:
content = content.replace(/deliverablesHtmlNode\.innerHTML = `\s*<div class="safe-base" style="font-weight: 500;"><\/div>\s*<div class="safe-extras" style="font-size: 0\.7rem; color: var\(--os-primary\); margin-top: 4px;"><\/div>\s*`;/g, 
`const divBase = document.createElement('div');
divBase.className = 'safe-base';
divBase.style.fontWeight = '500';
const divExtras = document.createElement('div');
divExtras.className = 'safe-extras';
divExtras.style.cssText = 'font-size: 0.7rem; color: var(--os-primary); margin-top: 4px;';
deliverablesHtmlNode.appendChild(divBase);
deliverablesHtmlNode.appendChild(divExtras);`);

content = content.replace(/deliverablesHtmlNode\.innerHTML = `<div class="safe-base" style="font-weight: 500;"><\/div>`;/g, 
`const divBase = document.createElement('div');
divBase.className = 'safe-base';
divBase.style.fontWeight = '500';
deliverablesHtmlNode.appendChild(divBase);`);

// 430 block
content = content.replace(/tr\.innerHTML = `[\s\S]*?<td class="safe-status-container"><\/td>\s*`;/g, 
`const td1 = document.createElement('td');
td1.className = 'cell-mono safe-id';
tr.appendChild(td1);

const td2 = document.createElement('td');
td2.className = 'cell-primary';
const divName = document.createElement('div');
divName.className = 'safe-name';
const divCnpj = document.createElement('div');
divCnpj.className = 'safe-cnpj';
divCnpj.style.cssText = 'font-size: 0.7rem; color: var(--os-text-muted);';
td2.appendChild(divName);
td2.appendChild(divCnpj);
tr.appendChild(td2);

const td3 = document.createElement('td');
td3.className = 'safe-deliverables';
td3.style.fontSize = '0.8rem';
tr.appendChild(td3);

const td4 = document.createElement('td');
td4.className = 'safe-value';
tr.appendChild(td4);

const td5 = document.createElement('td');
td5.className = 'safe-dates';
tr.appendChild(td5);

const td6 = document.createElement('td');
td6.className = 'safe-status-container';
tr.appendChild(td6);`);

// 864 block
content = content.replace(/tr\.innerHTML = `[\s\S]*?<td class="safe-status-container"><\/td>\s*`;/g, 
`const td1 = document.createElement('td');
td1.className = 'cell-primary safe-name';
tr.appendChild(td1);

const td2 = document.createElement('td');
td2.className = 'safe-company';
tr.appendChild(td2);

const td3 = document.createElement('td');
td3.className = 'safe-value';
tr.appendChild(td3);

const td4 = document.createElement('td');
td4.className = 'safe-dates';
tr.appendChild(td4);

const td5 = document.createElement('td');
td5.className = 'safe-status-container';
tr.appendChild(td5);`);

fs.writeFileSync('os/js/contracts-finance.js', content, 'utf8');
