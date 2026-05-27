const fs = require('fs');
let content = fs.readFileSync('os/js/modules/executive-center.js', 'utf8');

// The block to replace:
const regex = /const tr = document\.createElement\('tr'\);\s*tr\.innerHTML = `[\s\S]*?<td class="safe-status"><\/td>\s*`;\s*tr\.querySelector\('\.safe-id'\)\.textContent = c\.id\.toUpperCase\(\);\s*tr\.querySelector\('\.safe-company'\)\.textContent = c\.company_name;\s*tr\.querySelector\('\.safe-deliv'\)\.textContent = c\.deliverables;\s*tr\.querySelector\('\.safe-renewal'\)\.textContent = renewal\.toLocaleDateString\('pt-BR'\);\s*tr\.querySelector\('\.safe-drive'\)\.href = driveLink;/g;

const newContent = `const tr = document.createElement('tr');
                    
                    const td1 = document.createElement('td');
                    td1.className = 'cell-mono';
                    td1.textContent = c.id.toUpperCase();
                    tr.appendChild(td1);

                    const td2 = document.createElement('td');
                    td2.className = 'cell-primary';
                    td2.textContent = c.company_name;
                    tr.appendChild(td2);

                    const td3 = document.createElement('td');
                    td3.style.fontSize = '0.75rem';
                    td3.textContent = c.deliverables;
                    tr.appendChild(td3);

                    const td4 = document.createElement('td');
                    td4.textContent = renewal.toLocaleDateString('pt-BR');
                    tr.appendChild(td4);

                    const td5 = document.createElement('td');
                    const aDrive = document.createElement('a');
                    aDrive.target = '_blank';
                    aDrive.className = 'os-btn os-btn-sm';
                    aDrive.style.cssText = 'padding: 2px 8px; font-size: 0.65rem; background: rgba(255,255,255,0.03); border: 1px solid var(--os-border);';
                    aDrive.href = driveLink;
                    const iFolder = document.createElement('i');
                    iFolder.className = 'fa-solid fa-folder-open';
                    aDrive.appendChild(iFolder);
                    aDrive.appendChild(document.createTextNode(' Drive'));
                    td5.appendChild(aDrive);
                    tr.appendChild(td5);

                    const td6 = document.createElement('td');
                    td6.className = 'safe-status';
                    tr.appendChild(td6);`;

content = content.replace(regex, newContent);

fs.writeFileSync('os/js/modules/executive-center.js', content, 'utf8');
