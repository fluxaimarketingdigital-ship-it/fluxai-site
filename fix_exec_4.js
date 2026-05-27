const fs = require('fs');
let content = fs.readFileSync('os/js/modules/executive-center.js', 'utf8');

// Table 3
const oldT3 = `                    const tr = document.createElement('tr');  
                    tr.innerHTML = \`  
                        <td class="cell-primary">  
                            <div class="safe-nome"></div>  
                            <div class="safe-empresa-contato" style="font-size: 0.7rem; color: var(--os-text-muted);"></div>  
                        </td>  
                        <td class="safe-origem"></td>  
                        <td><span class="safe-servico" style="font-size: 0.7rem; border: 1px solid var(--os-border); padding: 2px 6px; border-radius: 4px;"></span></td>  
                        <td class="safe-resp"></td>  
                        <td class="safe-status-container"></td>  
                    \`;  
                    tr.querySelector('.safe-nome').textContent = l.nome_lead;  
                    tr.querySelector('.safe-empresa-contato').textContent = \`\${l.empresa} - \${l.contato}\`;  
                    tr.querySelector('.safe-origem').textContent = l.origem;  
                    tr.querySelector('.safe-servico').textContent = l.servico_interesse;  
                    tr.querySelector('.safe-resp').textContent = l.responsavel;  
                    tr.querySelector('.safe-status-container').appendChild(statusSpan); 
                    tableCommercialBody.appendChild(tr); `;

const newT3 = `                    const tr = document.createElement('tr');
                    
                    const td1 = document.createElement('td');
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
                    tr.appendChild(td5);

                    tableCommercialBody.appendChild(tr);`;

content = content.replace(oldT3, newT3);

// Table 4
const oldT4 = `                const tr = document.createElement('tr'); 
                tr.innerHTML = \` 
                    <td class="cell-primary safe-name"></td>  
                    <td class="safe-value"></td>  
                    <td class="safe-severity-container"></td>  
                    <td class="safe-status" style="font-size: 0.75rem; color: var(--os-text-muted);"></td>  
                \`; 
                tr.querySelector('.safe-name').textContent = ind.name; 
                tr.querySelector('.safe-value').textContent = ind.value; 
                 
                const sevSpan = document.createElement('span'); 
                sevSpan.style.cssText = 'display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 5px;'; 
                if (i === 1) sevSpan.style.background = 'var(--os-warning)'; 
                else if (i === 2) sevSpan.style.background = 'var(--os-danger)'; 
                else sevSpan.style.background = 'var(--os-success)'; 
                 
                tr.querySelector('.safe-severity-container').appendChild(sevSpan); 
                tr.querySelector('.safe-status').textContent = ind.status; 
                tableOperationsBody.appendChild(tr); `;

const newT4 = `                const tr = document.createElement('tr');
                
                const td1 = document.createElement('td');
                td1.className = 'cell-primary';
                td1.textContent = ind.name;
                tr.appendChild(td1);

                const td2 = document.createElement('td');
                td2.textContent = ind.value;
                tr.appendChild(td2);

                const sevSpan = document.createElement('span');
                sevSpan.style.cssText = 'display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 5px;';
                if (i === 1) sevSpan.style.background = 'var(--os-warning)';
                else if (i === 2) sevSpan.style.background = 'var(--os-danger)';
                else sevSpan.style.background = 'var(--os-success)';
                
                const td3 = document.createElement('td');
                td3.appendChild(sevSpan);
                tr.appendChild(td3);

                const td4 = document.createElement('td');
                td4.style.cssText = 'font-size: 0.75rem; color: var(--os-text-muted);';
                td4.textContent = ind.status;
                tr.appendChild(td4);

                tableOperationsBody.appendChild(tr);`;

content = content.replace(oldT4, newT4);

// KPI Grid
const oldKPI = `        const kpiGrid = document.querySelector('.kpi-grid'); 
        if (kpiGrid) { 
            kpiGrid.replaceChildren(); 
            kpiGrid.innerHTML = \` 
                <div class="kpi-card"> 
                    <div class="kpi-title">Receita Mensal Recorrente (MRR Estimado)</div> 
                    <div class="kpi-value" style="color: var(--os-success);">R$ \${(mockFinancialStats.mrr_total).toLocaleString('pt-BR', {minimumFractionDigits:2})}</div> 
                    <div class="kpi-subtitle">Com base em contratos ativos no OS</div> 
                </div> 
                <div class="kpi-card"> 
                    <div class="kpi-title">Contratos Ativos</div> 
                    <div class="kpi-value">\${activeClientsCount} <span style="font-size:0.9rem; color:var(--os-text-muted); font-weight:normal;">/ \${mockProjects.length} Total</span></div> 
                    <div class="kpi-subtitle">Saǧde de Retenǜo: \${activeClientsCount > 0 ? ((activeClientsCount/mockProjects.length)*100).toFixed(0) : 0}%</div> 
                </div> 
                <div class="kpi-card"> 
                    <div class="kpi-title">Atrasos Financeiros CR?TICOS</div> 
                    <div class="kpi-value" style="\${lateCount > 0 ? 'color: var(--os-danger);' : 'color: var(--os-success);'}">\${lateCount} OcorrǦncia(s)</div> 
                    <div class="kpi-subtitle">\${lateCount > 0 ? 'Requer Aǜo de Bloqueio Imediata' : 'Fluxo Saudǭvel'}</div> 
                </div> 
                <div class="kpi-card"> 
                    <div class="kpi-title">Projeǜo de Novos Leads</div> 
                    <div class="kpi-value" style="color: var(--os-primary);">\${localLeads.filter(l => l.status === 'proposta_enviada').length} Propostas</div> 
                    <div class="kpi-subtitle">Aguardando Fechamento</div> 
                </div> 
            \`; 
        } `;

const newKPI = `        const kpiGrid = document.querySelector('.kpi-grid');
        if (kpiGrid) {
            kpiGrid.replaceChildren();
            
            const kpi1 = document.createElement('div');
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
            kpiGrid.appendChild(kpi4);
        }`;

// Replace using regex for KPI because of special characters (like ã, é, í)
const kpiRegex = /const kpiGrid = document\.querySelector\('\.kpi-grid'\);\s*if \(kpiGrid\) \{\s*kpiGrid\.replaceChildren\(\);\s*kpiGrid\.innerHTML = `[\s\S]*?`\s*;\s*\}/g;
content = content.replace(kpiRegex, newKPI);

fs.writeFileSync('os/js/modules/executive-center.js', content, 'utf8');
