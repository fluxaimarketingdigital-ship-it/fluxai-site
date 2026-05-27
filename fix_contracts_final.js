const fs = require('fs');

let lines = fs.readFileSync('os/js/contracts-finance.js', 'utf8').split(/\r?\n/);

// Line 324 is index 323. Wait, lines in JS split are 0-indexed.
// But to be sure, I'll search for the `tr.innerHTML = \`` exact index.
const finStart = lines.findIndex((l, i) => i > 300 && l.includes('tr.innerHTML = `') && lines[i+2] && lines[i+2].includes('<div class="safe-client"'));
if (finStart !== -1) {
    let finEnd = finStart;
    while (!lines[finEnd].includes('`;') && finEnd < lines.length) finEnd++;
    let qEnd = finEnd + 1;
    while (lines[qEnd] && lines[qEnd].includes('tr.querySelector')) qEnd++;

    const finContent = `        const tr = document.createElement('tr');
        
        const td1 = document.createElement('td');
        const divClient = document.createElement('div');
        divClient.className = 'safe-client';
        divClient.style.fontWeight = '700';
        divClient.textContent = p.contracts?.client_name || 'Desconhecido';
        const divCompany = document.createElement('div');
        divCompany.className = 'safe-company';
        divCompany.style.cssText = 'font-size: 0.7rem; color: var(--os-text-muted);';
        divCompany.textContent = p.contracts?.company_name || '';
        td1.appendChild(divClient);
        td1.appendChild(divCompany);
        tr.appendChild(td1);

        const td2 = document.createElement('td');
        td2.className = 'safe-amount';
        td2.style.cssText = 'font-family: var(--os-font-mono); font-weight: 600;';
        td2.textContent = formatCurrency(p.amount_due);
        tr.appendChild(td2);

        const td3 = document.createElement('td');
        td3.className = 'safe-duedate';
        td3.textContent = dueDate.toLocaleDateString('pt-BR');
        tr.appendChild(td3);

        const td4 = document.createElement('td');
        td4.className = 'safe-method';
        td4.style.cssText = 'font-size: 0.7rem; text-transform: uppercase;';
        td4.textContent = p.payment_method || 'Pix';
        tr.appendChild(td4);

        const td5 = document.createElement('td');
        const spanStatus = document.createElement('span');
        spanStatus.className = 'status-badge ' + statusClass;
        spanStatus.textContent = p.status;
        td5.appendChild(spanStatus);
        tr.appendChild(td5);

        const td6 = document.createElement('td');
        td6.className = 'safe-delay';
        td6.style.fontSize = '0.75rem';
        td6.style.cssText += delayClass;
        td6.textContent = delayText;
        if (diffDays >= 0 && p.status !== 'PAGO') {
            td6.style.color = 'var(--os-text-muted)';
        } else if (diffDays < 0 && p.status !== 'PAGO') {
            td6.style.color = 'var(--os-danger)';
            td6.style.fontWeight = '700';
        }
        tr.appendChild(td6);

        const td7 = document.createElement('td');
        const actionDiv = document.createElement('div');
        actionDiv.className = 'action-btns';
        actionDiv.style.justifyContent = 'flex-end';
        
        const btnWpp = document.createElement('button');
        btnWpp.className = 'btn-mini btn-whatsapp safe-wpp';
        btnWpp.title = 'Lembrar WhatsApp';
        btnWpp.style.display = 'none';
        btnWpp.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
        actionDiv.appendChild(btnWpp);

        const btnPay = document.createElement('button');
        btnPay.className = 'btn-mini safe-pay';
        btnPay.title = 'Marcar Recebido';
        btnPay.style.display = 'none';
        btnPay.innerHTML = '<i class="fa-solid fa-check"></i>';
        actionDiv.appendChild(btnPay);

        const btnRec = document.createElement('button');
        btnRec.className = 'btn-mini safe-receipt';
        btnRec.title = 'Gerar Recibo';
        btnRec.style.display = 'none';
        btnRec.innerHTML = '<i class="fa-solid fa-file-invoice"></i>';
        actionDiv.appendChild(btnRec);

        const btnDoc = document.createElement('button');
        btnDoc.className = 'btn-mini safe-doc';
        btnDoc.title = 'Abrir Contrato';
        btnDoc.innerHTML = '<i class="fa-solid fa-file-pdf"></i>';
        btnDoc.onclick = () => window.generateContractDoc(p.contract_id);
        actionDiv.appendChild(btnDoc);

        const btnWork = document.createElement('button');
        btnWork.className = 'btn-mini safe-work';
        btnWork.title = 'Abrir Workspace';
        btnWork.innerHTML = '<i class="fa-solid fa-briefcase"></i>';
        btnWork.onclick = () => window.open('/os/content-engine.html?project=' + p.contracts?.project_id, '_blank');
        actionDiv.appendChild(btnWork);

        td7.appendChild(actionDiv);
        tr.appendChild(td7);
        
        // Atribuições posteriores feitas no script original (onclicks e ifs de display já estão aplicados dinamicamente depois)
        // Isso resolve completamente a injeção do tr.
        tr.className = 'fluxai-finance-row'; // Apenas para debug / marcacao
`;
    // We only replace `tr.innerHTML` and the `tr.querySelector` calls
    // The `const tr = document.createElement('tr')` is at finStart - 1
    lines.splice(finStart - 1, qEnd - (finStart - 1), finContent);
}

// Search again because indices changed
const delivStart = lines.findIndex((l, i) => l.includes('deliverablesHtmlNode.innerHTML = `') && lines[i+1] && lines[i+1].includes('<div class="safe-base"'));
if (delivStart !== -1) {
    let delivEnd = delivStart;
    while (!lines[delivEnd].includes('`;') && delivEnd < lines.length) delivEnd++;
    let qEnd = delivEnd + 1;
    while (lines[qEnd] && lines[qEnd].includes('deliverablesHtmlNode.querySelector')) qEnd++;

    const delivContent = `            const divBase = document.createElement('div');
            divBase.className = 'safe-base';
            divBase.style.fontWeight = '500';
            divBase.textContent = baseDeliverables;
            const divExtraContainer = document.createElement('div');
            divExtraContainer.style.cssText = 'margin-top: 6px; display: inline-flex; align-items: center; gap: 6px; background: rgba(142, 158, 104, 0.12); border: 1px dashed var(--os-primary); padding: 4px 8px; border-radius: 4px; font-size: 0.65rem; color: #fff; line-height: 1.2;';
            const iconExtra = document.createElement('i');
            iconExtra.className = 'fa-solid fa-wand-magic-sparkles';
            iconExtra.style.cssText = 'color: var(--os-primary); font-size: 0.65rem;';
            const spanText = document.createElement('span');
            const strongTag = document.createElement('strong');
            strongTag.textContent = 'EXTRA: ';
            const spanExtra = document.createElement('span');
            spanExtra.className = 'safe-extra';
            spanExtra.textContent = extraDetails;
            spanText.appendChild(strongTag);
            spanText.appendChild(spanExtra);
            divExtraContainer.appendChild(iconExtra);
            divExtraContainer.appendChild(spanText);
            
            deliverablesHtmlNode.appendChild(divBase);
            deliverablesHtmlNode.appendChild(divExtraContainer);`;
    lines.splice(delivStart, qEnd - delivStart, delivContent);
}

const delivStart2 = lines.findIndex(l => l.includes('deliverablesHtmlNode.innerHTML = `<div class="safe-base"'));
if (delivStart2 !== -1) {
    let qEnd2 = delivStart2 + 1;
    while (lines[qEnd2] && lines[qEnd2].includes('deliverablesHtmlNode.querySelector')) qEnd2++;
    
    const delivContent2 = `            const divBase = document.createElement('div');
            divBase.className = 'safe-base';
            divBase.style.fontWeight = '500';
            divBase.textContent = deliverables;
            deliverablesHtmlNode.appendChild(divBase);`;
    lines.splice(delivStart2, qEnd2 - delivStart2, delivContent2);
}

// Active Contracts Table (around line 430)
const actStart = lines.findIndex((l, i) => l.includes('tr.innerHTML = `') && lines[i+1] && lines[i+1].includes('<td class="safe-company"'));
if (actStart !== -1) {
    let actEnd = actStart;
    while (!lines[actEnd].includes('`;') && actEnd < lines.length) actEnd++;
    let qEnd = actEnd + 1;
    while (lines[qEnd] && lines[qEnd].includes('tr.querySelector')) qEnd++;

    const actContent = `        const tr = document.createElement('tr');
        
        const td1 = document.createElement('td');
        const divComp = document.createElement('div');
        divComp.className = 'safe-company';
        divComp.style.fontWeight = '700';
        divComp.textContent = c.company_name;
        const divClient = document.createElement('div');
        divClient.className = 'safe-client';
        divClient.style.cssText = 'font-size: 0.7rem; color: var(--os-text-muted);';
        divClient.textContent = c.client_name;
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
        td3.appendChild(deliverablesHtmlNode);
        tr.appendChild(td3);

        const td4 = document.createElement('td');
        td4.className = 'safe-val';
        td4.style.cssText = 'font-family: var(--os-font-mono); font-weight: 600;';
        td4.textContent = formatCurrency(val);
        tr.appendChild(td4);

        const td5 = document.createElement('td');
        const spanStatus = document.createElement('span');
        spanStatus.className = 'status-badge safe-status';
        spanStatus.style.background = 'rgba(255,255,255,0.05)';
        spanStatus.textContent = c.status;
        td5.appendChild(spanStatus);
        tr.appendChild(td5);

        const td6 = document.createElement('td');
        td6.className = 'safe-start';
        td6.textContent = startDate;
        tr.appendChild(td6);

        const td7 = document.createElement('td');
        td7.className = 'safe-renewal';
        td7.textContent = renewalDate;
        tr.appendChild(td7);

        const td8 = document.createElement('td');
        const actionDiv = document.createElement('div');
        actionDiv.className = 'action-btns';
        actionDiv.style.justifyContent = 'flex-end';
        
        const btnPortal = document.createElement('a');
        btnPortal.className = 'safe-portal btn-mini';
        btnPortal.style.cssText = 'display:inline-flex; align-items:center; justify-content:center; text-decoration:none;';
        btnPortal.title = 'Ver Portal Cliente';
        btnPortal.href = '/os/client-portal.html?project_id=' + c.project_id;
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
        
    lines.splice(actStart - 1, qEnd - (actStart - 1), actContent);
}

// Operational Alerts (around 864)
const opsStart = lines.findIndex((l, i) => l.includes('tr.innerHTML = `') && lines[i+1] && lines[i+1].includes('<td class="safe-name"></td>'));
if (opsStart !== -1) {
    let opsEnd = opsStart;
    while (!lines[opsEnd].includes('`;') && opsEnd < lines.length) opsEnd++;
    let qEnd = opsEnd + 1;
    while (lines[qEnd] && lines[qEnd].includes('tr.querySelector')) qEnd++;

    const opsContent = `        const tr = document.createElement('tr');
        
        const td1 = document.createElement('td');
        td1.className = 'safe-name';
        td1.style.fontWeight = '600';
        td1.textContent = a.title;
        tr.appendChild(td1);

        const td2 = document.createElement('td');
        td2.className = 'safe-desc';
        td2.style.cssText = 'font-size: 0.8rem; color: var(--os-text-muted);';
        td2.textContent = a.description;
        tr.appendChild(td2);

        const td3 = document.createElement('td');
        const spanBadge = document.createElement('span');
        spanBadge.className = 'os-badge ' + (a.severity === 'high' ? 'os-badge-danger' : (a.severity === 'medium' ? 'os-badge-warning' : 'os-badge-info'));
        spanBadge.textContent = a.severity === 'high' ? 'Crítico' : (a.severity === 'medium' ? 'Atenção' : 'Aviso');
        td3.appendChild(spanBadge);
        tr.appendChild(td3);

        const td4 = document.createElement('td');
        const btnAct = document.createElement('button');
        btnAct.className = 'os-btn os-btn-sm';
        btnAct.style.padding = '4px 8px';
        btnAct.textContent = 'Resolver';
        btnAct.onclick = a.action;
        td4.appendChild(btnAct);
        tr.appendChild(td4);`;
        
    lines.splice(opsStart - 1, qEnd - (opsStart - 1), opsContent);
}

fs.writeFileSync('os/js/contracts-finance.js', lines.join('\n'), 'utf8');
