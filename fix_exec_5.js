const fs = require('fs');

let lines = fs.readFileSync('os/js/modules/executive-center.js', 'utf8').split('\n');

// Replace kpiGrid block (lines 68-87 approximately)
let kpiStart = lines.findIndex(l => l.includes('kpiGrid.innerHTML = `'));
let kpiEnd = kpiStart;
if (kpiStart !== -1) {
    while (!lines[kpiEnd].includes('`;') && kpiEnd < lines.length) kpiEnd++;
    
    const newKPI = `            const kpi1 = document.createElement('div');
            kpi1.className = 'kpi-card';
            const t1 = document.createElement('div');
            t1.className = 'kpi-title';
            t1.textContent = 'Receita Mensal Recorrente (MRR Estimado)';
            const v1 = document.createElement('div');
            v1.className = 'kpi-value';
            v1.style.color = 'var(--os-success)';
            v1.textContent = 'R$ ' + (mockFinancialStats.mrr_total).toLocaleString('pt-BR', {minimumFractionDigits:2});
            const s1 = document.createElement('div');
            s1.className = 'kpi-subtitle';
            s1.textContent = 'Com base em contratos ativos no OS';
            kpi1.appendChild(t1);
            kpi1.appendChild(v1);
            kpi1.appendChild(s1);

            const kpi2 = document.createElement('div');
            kpi2.className = 'kpi-card';
            const t2 = document.createElement('div');
            t2.className = 'kpi-title';
            t2.textContent = 'Contratos Ativos';
            const v2 = document.createElement('div');
            v2.className = 'kpi-value';
            v2.textContent = activeClientsCount + ' ';
            const spanV2 = document.createElement('span');
            spanV2.style.cssText = 'font-size:0.9rem; color:var(--os-text-muted); font-weight:normal;';
            spanV2.textContent = '/ ' + mockProjects.length + ' Total';
            v2.appendChild(spanV2);
            const s2 = document.createElement('div');
            s2.className = 'kpi-subtitle';
            s2.textContent = 'Saúde de Retenção: ' + (activeClientsCount > 0 ? ((activeClientsCount/mockProjects.length)*100).toFixed(0) : 0) + '%';
            kpi2.appendChild(t2);
            kpi2.appendChild(v2);
            kpi2.appendChild(s2);

            const kpi3 = document.createElement('div');
            kpi3.className = 'kpi-card';
            const t3 = document.createElement('div');
            t3.className = 'kpi-title';
            t3.textContent = 'Atrasos Financeiros CRÍTICOS';
            const v3 = document.createElement('div');
            v3.className = 'kpi-value';
            v3.style.color = lateCount > 0 ? 'var(--os-danger)' : 'var(--os-success)';
            v3.textContent = lateCount + ' Ocorrência(s)';
            const s3 = document.createElement('div');
            s3.className = 'kpi-subtitle';
            s3.textContent = lateCount > 0 ? 'Requer Ação de Bloqueio Imediata' : 'Fluxo Saudável';
            kpi3.appendChild(t3);
            kpi3.appendChild(v3);
            kpi3.appendChild(s3);

            const kpi4 = document.createElement('div');
            kpi4.className = 'kpi-card';
            const t4 = document.createElement('div');
            t4.className = 'kpi-title';
            t4.textContent = 'Projeção de Novos Leads';
            const v4 = document.createElement('div');
            v4.className = 'kpi-value';
            v4.style.color = 'var(--os-primary)';
            v4.textContent = localLeads.filter(l => l.status === 'proposta_enviada').length + ' Propostas';
            const s4 = document.createElement('div');
            s4.className = 'kpi-subtitle';
            s4.textContent = 'Aguardando Fechamento';
            kpi4.appendChild(t4);
            kpi4.appendChild(v4);
            kpi4.appendChild(s4);

            kpiGrid.appendChild(kpi1);
            kpiGrid.appendChild(kpi2);
            kpiGrid.appendChild(kpi3);
            kpiGrid.appendChild(kpi4);`;
            
    lines.splice(kpiStart, kpiEnd - kpiStart + 1, newKPI);
}

// Re-search because indices changed
let trComStart = lines.findIndex(l => l.includes('tr.innerHTML = `') && lines[l+1] && lines[l+1].includes('<td class="cell-primary">'));
if (trComStart !== -1) {
    let trComEnd = trComStart;
    while (!lines[trComEnd].includes('`;') && trComEnd < lines.length) trComEnd++;
    // And remove the querySelector assignments that follow
    while (lines[trComEnd+1] && lines[trComEnd+1].includes('tr.querySelector')) trComEnd++;
    
    const newCom = `                    const td1 = document.createElement('td');
                    td1.className = 'cell-primary';
                    const divNome = document.createElement('div');
                    divNome.textContent = l.nome_lead;
                    const divEmpresa = document.createElement('div');
                    divEmpresa.style.cssText = 'font-size: 0.7rem; color: var(--os-text-muted);';
                    divEmpresa.textContent = \`\${l.empresa} - \${l.contato}\`;
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
                    tr.appendChild(td5);`;
    lines.splice(trComStart, trComEnd - trComStart + 1, newCom);
}

// Re-search because indices changed
let trOpsStart = lines.findIndex(l => l.includes('tr.innerHTML = `') && lines[l+1] && lines[l+1].includes('<td class="cell-primary safe-name"></td>'));
if (trOpsStart !== -1) {
    let trOpsEnd = trOpsStart;
    while (!lines[trOpsEnd].includes('`;') && trOpsEnd < lines.length) trOpsEnd++;
    // And remove the querySelector assignments
    while (lines[trOpsEnd+1] && lines[trOpsEnd+1].includes('tr.querySelector')) {
        if (lines[trOpsEnd+1].includes('safe-name') || lines[trOpsEnd+1].includes('safe-value')) {
            trOpsEnd++;
        } else {
            break;
        }
    }
    
    const newOps = `                const td1 = document.createElement('td');
                td1.className = 'cell-primary';
                td1.textContent = ind.name;
                tr.appendChild(td1);

                const td2 = document.createElement('td');
                td2.textContent = ind.value;
                tr.appendChild(td2);`;
    lines.splice(trOpsStart, trOpsEnd - trOpsStart + 1, newOps);
}

// Also replace the remaining querySelectors for ops
let trOpsSev = lines.findIndex(l => l.includes('tr.querySelector(\'.safe-severity-container\')'));
if (trOpsSev !== -1) {
    lines.splice(trOpsSev, 2, `                const td3 = document.createElement('td');
                td3.appendChild(sevSpan);
                tr.appendChild(td3);

                const td4 = document.createElement('td');
                td4.style.cssText = 'font-size: 0.75rem; color: var(--os-text-muted);';
                td4.textContent = ind.status;
                tr.appendChild(td4);`);
}

fs.writeFileSync('os/js/modules/executive-center.js', lines.join('\n'), 'utf8');
