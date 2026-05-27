const fs = require('fs');

let content = fs.readFileSync('os/js/contracts-finance.js', 'utf8');

const regex1 = /const tr = document\.createElement\('tr'\);\s*tr\.innerHTML = `\s*<td>\s*<div class="safe-company" style="font-weight: 700;"><\/div>\s*<div class="safe-client" style="font-size: 0\.7rem; color: var\(--os-text-muted\);"><\/div>\s*<\/td>[\s\S]*?<td class="safe-renewal"><\/td>\s*<td>\s*<div class="action-btns" style="justify-content: flex-end;">\s*<a class="safe-portal btn-mini"[\s\S]*?<i class="fa-solid fa-pen-to-square"><\/i>\s*<\/button>\s*<\/div>\s*<\/td>\s*`;/g;

const new1 = `const tr = document.createElement('tr');
        
        const td1 = document.createElement('td');
        const divComp = document.createElement('div');
        divComp.className = 'safe-company';
        divComp.style.fontWeight = '700';
        const divClient = document.createElement('div');
        divClient.className = 'safe-client';
        divClient.style.cssText = 'font-size: 0.7rem; color: var(--os-text-muted);';
        td1.appendChild(divComp);
        td1.appendChild(divClient);
        tr.appendChild(td1);

        const td2 = document.createElement('td');
        td2.style.cssText = 'font-size: 0.7rem; font-weight: 700; color: var(--os-primary);';
        td2.textContent = 'ENGENHARIA DE CONTEÚDO';
        tr.appendChild(td2);

        const td3 = document.createElement('td');
        td3.className = 'safe-deliv-container';
        td3.style.fontSize = '0.75rem';
        tr.appendChild(td3);

        const td4 = document.createElement('td');
        td4.className = 'safe-val';
        td4.style.cssText = 'font-family: var(--os-font-mono); font-weight: 600;';
        tr.appendChild(td4);

        const td5 = document.createElement('td');
        const spanStatus = document.createElement('span');
        spanStatus.className = 'status-badge safe-status';
        spanStatus.style.background = 'rgba(255,255,255,0.05)';
        td5.appendChild(spanStatus);
        tr.appendChild(td5);

        const td6 = document.createElement('td');
        td6.className = 'safe-start';
        tr.appendChild(td6);

        const td7 = document.createElement('td');
        td7.className = 'safe-renewal';
        tr.appendChild(td7);

        const td8 = document.createElement('td');
        const actionDiv = document.createElement('div');
        actionDiv.className = 'action-btns';
        actionDiv.style.justifyContent = 'flex-end';
        
        const btnPortal = document.createElement('a');
        btnPortal.className = 'safe-portal btn-mini';
        btnPortal.style.cssText = 'display:inline-flex; align-items:center; justify-content:center; text-decoration:none;';
        btnPortal.title = 'Ver Portal Cliente';
        const iPortal = document.createElement('i');
        iPortal.className = 'fa-solid fa-briefcase';
        btnPortal.appendChild(iPortal);
        actionDiv.appendChild(btnPortal);

        const btnPdf = document.createElement('button');
        btnPdf.className = 'btn-mini safe-pdf';
        btnPdf.title = 'Abrir Contrato';
        const iPdf = document.createElement('i');
        iPdf.className = 'fa-solid fa-file-pdf';
        btnPdf.appendChild(iPdf);
        actionDiv.appendChild(btnPdf);

        const btnEdit = document.createElement('button');
        btnEdit.className = 'btn-mini safe-edit';
        btnEdit.title = 'Editar';
        const iEdit = document.createElement('i');
        iEdit.className = 'fa-solid fa-pen-to-square';
        btnEdit.appendChild(iEdit);
        actionDiv.appendChild(btnEdit);

        td8.appendChild(actionDiv);
        tr.appendChild(td8);`;

content = content.replace(regex1, new1);

const regex2 = /const tr = document\.createElement\('tr'\);\s*tr\.innerHTML = `\s*<td class="safe-name" style="font-weight: 600;"><\/td>\s*<td class="safe-desc" style="font-size: 0\.8rem; color: var\(--os-text-muted\);"><\/td>\s*<td class="safe-sev-container"><\/td>\s*<td class="safe-action-container"><\/td>\s*`;/g;

const new2 = `const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        td1.className = 'safe-name';
        td1.style.fontWeight = '600';
        tr.appendChild(td1);

        const td2 = document.createElement('td');
        td2.className = 'safe-desc';
        td2.style.cssText = 'font-size: 0.8rem; color: var(--os-text-muted);';
        tr.appendChild(td2);

        const td3 = document.createElement('td');
        td3.className = 'safe-sev-container';
        tr.appendChild(td3);

        const td4 = document.createElement('td');
        td4.className = 'safe-action-container';
        tr.appendChild(td4);`;

content = content.replace(regex2, new2);

fs.writeFileSync('os/js/contracts-finance.js', content, 'utf8');
