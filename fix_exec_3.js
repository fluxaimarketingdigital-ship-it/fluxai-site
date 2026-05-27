const fs = require('fs');
let content = fs.readFileSync('os/js/modules/executive-center.js', 'utf8');

// Replace all tr.innerHTML with static text
content = content.replace(/tr\.innerHTML = '<td colspan="6" style="text-align:center; padding:20px; opacity:0\.5;">Nenhum dado financeiro para os clientes ativos\.<\/td>';/g, 
`const td = document.createElement('td');
td.colSpan = 6;
td.style.cssText = 'text-align:center; padding:20px; opacity:0.5;';
td.textContent = 'Nenhum dado financeiro para os clientes ativos.';
tr.appendChild(td);`);

content = content.replace(/tr\.innerHTML = '<td colspan="6" style="text-align:center; padding:20px; opacity:0\.5;">Nenhum contrato cadastrado\.<\/td>';/g, 
`const td = document.createElement('td');
td.colSpan = 6;
td.style.cssText = 'text-align:center; padding:20px; opacity:0.5;';
td.textContent = 'Nenhum contrato cadastrado.';
tr.appendChild(td);`);

content = content.replace(/tr\.innerHTML = '<td colspan="5" style="text-align:center; padding:20px; opacity:0\.5;">Nenhum lead em negocia(ç|)ão\.<\/td>';/g, 
`const td = document.createElement('td');
td.colSpan = 5;
td.style.cssText = 'text-align:center; padding:20px; opacity:0.5;';
td.textContent = 'Nenhum lead em negociação.';
tr.appendChild(td);`);

// Replace the Commercial table
const commercialRegex = /const tr = document\.createElement\('tr'\);\s*tr\.innerHTML = `[\s\S]*?<td class="safe-status-container"><\/td>\s*`;\s*tr\.querySelector\('\.safe-nome'\)\.textContent = l\.nome;\s*tr\.querySelector\('\.safe-empresa-contato'\)\.textContent = `\$\{l\.empresa\} \/ \$\{l\.contato\}`;\s*tr\.querySelector\('\.safe-origem'\)\.textContent = l\.origem;\s*tr\.querySelector\('\.safe-servico'\)\.textContent = l\.servico_interesse;\s*tr\.querySelector\('\.safe-resp'\)\.textContent = l\.responsavel;/g;

const newCommercial = `const tr = document.createElement('tr');
                    
                    const td1 = document.createElement('td');
                    td1.className = 'cell-primary';
                    const divNome = document.createElement('div');
                    divNome.textContent = l.nome;
                    const divEmpresa = document.createElement('div');
                    divEmpresa.style.cssText = 'font-size: 0.7rem; color: var(--os-text-muted);';
                    divEmpresa.textContent = \`\${l.empresa} / \${l.contato}\`;
                    td1.appendChild(divNome);
                    td1.appendChild(divEmpresa);
                    tr.appendChild(td1);

                    const td2 = document.createElement('td');
                    td2.textContent = l.origem;
                    tr.appendChild(td2);

                    const td3 = document.createElement('td');
                    const spanServ = document.createElement('span');
                    spanServ.style.cssText = 'font-size: 0.7rem; border: 1px solid var(--os-border); padding: 2px 6px; border-radius: 4px;';
                    spanServ.textContent = l.servico_interesse;
                    td3.appendChild(spanServ);
                    tr.appendChild(td3);

                    const td4 = document.createElement('td');
                    td4.textContent = l.responsavel;
                    tr.appendChild(td4);

                    const td5 = document.createElement('td');
                    td5.className = 'safe-status-container';
                    tr.appendChild(td5);`;

content = content.replace(commercialRegex, newCommercial);

fs.writeFileSync('os/js/modules/executive-center.js', content, 'utf8');
