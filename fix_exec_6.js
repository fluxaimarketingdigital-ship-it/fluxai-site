const fs = require('fs');

let lines = fs.readFileSync('os/js/modules/executive-center.js', 'utf8').split('\n');

// 1. Replace Commercial table row
let trComStart = lines.findIndex(l => l.includes('tr.innerHTML = `') && lines[l+1] && lines[l+1].includes('<td class="cell-primary">'));
if (trComStart !== -1) {
    // Look back to const tr = ...
    let startIdx = trComStart - 1;
    // Look forward to tableCommercialBody.appendChild(tr);
    let endIdx = trComStart;
    while (!lines[endIdx].includes('tableCommercialBody.appendChild(tr);') && endIdx < lines.length) endIdx++;
    
    const newCom = `                    const tr = document.createElement('tr');
                    const td1 = document.createElement('td');
                    td1.className = 'cell-primary';
                    const divNome = document.createElement('div');
                    divNome.textContent = l.nome_lead;
                    const divEmpresa = document.createElement('div');
                    divEmpresa.style.cssText = 'font-size: 0.7rem; color: var(--os-text-muted);';
                    divEmpresa.textContent = l.empresa + ' - ' + l.contato;
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
                    td5.appendChild(statusSpan);
                    tr.appendChild(td5);

                    tableCommercialBody.appendChild(tr);`;
    lines.splice(startIdx, endIdx - startIdx + 1, newCom);
}

// 2. Replace Operations table row
let trOpsStart = lines.findIndex(l => l.includes('tr.innerHTML = `') && lines[l+1] && lines[l+1].includes('<td class="cell-primary safe-name"></td>'));
if (trOpsStart !== -1) {
    let startIdx = trOpsStart - 1;
    let endIdx = trOpsStart;
    while (!lines[endIdx].includes('tr.querySelector(\'.safe-severity-container\').appendChild(sevSpan);') && endIdx < lines.length) endIdx++;
    
    const newOps = `                const tr = document.createElement('tr');
                const td1 = document.createElement('td');
                td1.className = 'cell-primary';
                td1.textContent = ind.name;
                tr.appendChild(td1);

                const td2 = document.createElement('td');
                td2.textContent = ind.value;
                tr.appendChild(td2);
                 
                const sevSpan = document.createElement('span'); 
                if (i === 0) { 
                    if (Number(avgLoad) > 4) { sevSpan.className = 'os-badge os-badge-danger'; sevSpan.textContent = 'Sobrecarga'; } 
                    else if (Number(avgLoad) > 2) { sevSpan.className = 'os-badge os-badge-warning'; sevSpan.textContent = 'Moderada'; }
                    else { sevSpan.className = 'os-badge os-badge-success'; sevSpan.textContent = 'Tranquila'; }
                } else if (i === 1) {
                    if (iaQueue > 5) { sevSpan.className = 'os-badge os-badge-danger'; sevSpan.textContent = 'Atrasada'; }
                    else if (iaQueue > 0) { sevSpan.className = 'os-badge os-badge-warning'; sevSpan.textContent = 'Em Fila'; }
                    else { sevSpan.className = 'os-badge os-badge-success'; sevSpan.textContent = 'Livre'; }
                } else if (i === 2) {
                    if (pendingDemands > 10) { sevSpan.className = 'os-badge os-badge-danger'; sevSpan.textContent = 'Crítica'; }
                    else if (pendingDemands > 0) { sevSpan.className = 'os-badge os-badge-warning'; sevSpan.textContent = 'Ativa'; }
                    else { sevSpan.className = 'os-badge os-badge-success'; sevSpan.textContent = 'Resolvida'; }
                } else {
                    sevSpan.className = 'os-badge os-badge-info'; sevSpan.textContent = 'Verificado';
                }
                
                const td3 = document.createElement('td');
                td3.appendChild(sevSpan);
                tr.appendChild(td3);

                const td4 = document.createElement('td');
                td4.style.cssText = 'font-size: 0.75rem; color: var(--os-text-muted);';
                td4.textContent = ind.status;
                tr.appendChild(td4);`;
    lines.splice(startIdx, endIdx - startIdx + 1, newOps);
}

fs.writeFileSync('os/js/modules/executive-center.js', lines.join('\n'), 'utf8');
