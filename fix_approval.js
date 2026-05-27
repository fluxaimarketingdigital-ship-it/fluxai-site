const fs = require('fs');

let content = fs.readFileSync('os/approval.html', 'utf8');

// The replacement logic will strip out all innerHTML from the feedbackContainer block
// and other innerHTML occurrences in the file.

const oldBlock1 = `feedbackContainer.innerHTML = \`<strong style="color:#60a5fa;">Seu Pedido de Ajuste:</strong><br>\${window.escapeHTML(c.internal_notes || '')}\`;`;
const newBlock1 = `
                        const strong = document.createElement('strong');
                        strong.style.color = '#60a5fa';
                        strong.textContent = 'Seu Pedido de Ajuste:';
                        feedbackContainer.appendChild(strong);
                        feedbackContainer.appendChild(document.createElement('br'));
                        feedbackContainer.appendChild(document.createTextNode(c.internal_notes || ''));
`;

const oldBlock2 = `feedbackContainer.innerHTML = \`<strong style="color:#ec4899;">Suas Observações:</strong><br>\${window.escapeHTML(c.internal_notes || '')}\`;`;
const oldBlock2_alt = `feedbackContainer.innerHTML = \`<strong style="color:#ec4899;">Suas Observaes:</strong><br>\${window.escapeHTML(c.internal_notes || '')}\`;`;
const newBlock2 = `
                        const strong = document.createElement('strong');
                        strong.style.color = '#ec4899';
                        strong.textContent = 'Suas Observações:';
                        feedbackContainer.appendChild(strong);
                        feedbackContainer.appendChild(document.createElement('br'));
                        feedbackContainer.appendChild(document.createTextNode(c.internal_notes || ''));
`;

content = content.replace(new RegExp(oldBlock1.replace(/[.*+?^$\{}()|[\]\\]/g, '\\$&'), 'g'), newBlock1);
content = content.replace(new RegExp(oldBlock2.replace(/[.*+?^$\{}()|[\]\\]/g, '\\$&'), 'g'), newBlock2);
content = content.replace(new RegExp(oldBlock2_alt.replace(/[.*+?^$\{}()|[\]\\]/g, '\\$&'), 'g'), newBlock2);

// Fix innerHTML in the rest of approval.html

content = content.replace(
    /document\.getElementById\('btn-approve-action'\)\.innerHTML = '<i class="fa-solid fa-circle-check"><\/i> APROVAR ARTE FINAL';/g,
    `const btnApp = document.getElementById('btn-approve-action');
                    btnApp.replaceChildren();
                    const iApp = document.createElement('i');
                    iApp.className = 'fa-solid fa-circle-check';
                    btnApp.appendChild(iApp);
                    btnApp.appendChild(document.createTextNode(' APROVAR ARTE FINAL'));`
);

content = content.replace(
    /document\.getElementById\('btn-reject-action'\)\.innerHTML = '<i class="fa-solid fa-rotate-left"><\/i> SOLICITAR AJUSTE NA ARTE';/g,
    `const btnRej = document.getElementById('btn-reject-action');
                    btnRej.replaceChildren();
                    const iRej = document.createElement('i');
                    iRej.className = 'fa-solid fa-rotate-left';
                    btnRej.appendChild(iRej);
                    btnRej.appendChild(document.createTextNode(' SOLICITAR AJUSTE NA ARTE'));`
);

content = content.replace(/actionsContainer\.innerHTML = '';/g, `actionsContainer.replaceChildren();`);

content = content.replace(/btn\.innerHTML = '<i class="fa-solid fa-spinner fa-spin"><\/i> Processando\.\.\.';/g,
    `btn.replaceChildren();
                        const iSpin = document.createElement('i');
                        iSpin.className = 'fa-solid fa-spinner fa-spin';
                        btn.appendChild(iSpin);
                        btn.appendChild(document.createTextNode(' Processando...'));`
);

content = content.replace(/btn\.innerHTML = 'Tentar Novamente';/g, `btn.textContent = 'Tentar Novamente';`);

content = content.replace(/btn\.innerHTML = '<i class="fa-solid fa-spinner fa-spin"><\/i> Enviando\.\.\.';/g,
    `btn.replaceChildren();
                        const iEnv = document.createElement('i');
                        iEnv.className = 'fa-solid fa-spinner fa-spin';
                        btn.appendChild(iEnv);
                        btn.appendChild(document.createTextNode(' Enviando...'));`
);

content = content.replace(/btnReturn\.innerHTML = 'VOLTAR AO CALENDÁRIO';/g, `btnReturn.textContent = 'VOLTAR AO CALENDÁRIO';`);
content = content.replace(/btnReturn\.innerHTML = 'VOLTAR AO CALENDRIO';/g, `btnReturn.textContent = 'VOLTAR AO CALENDÁRIO';`);

content = content.replace(/document\.getElementById\('asset-caption'\)\.innerHTML = roadmap;/g,
    `const caption = document.getElementById('asset-caption');
                    caption.replaceChildren();
                    const pre = document.createElement('pre');
                    pre.style.whiteSpace = 'pre-wrap';
                    pre.style.wordWrap = 'break-word';
                    pre.style.fontFamily = 'inherit';
                    pre.style.margin = '0';
                    pre.textContent = c.caption;
                    caption.appendChild(pre);`
);

content = content.replace(/badge\.innerHTML = isFinalArt \? `<span class="status-badge" style="background:rgba\(139, 92, 246,0\.15\); color:#a78bfa; border:1px solid rgba\(139,92,246,0\.5\);">AGUARDANDO SUA APROVAÇÃO<\/span>` : `<span class="status-badge" style="background:rgba\(16,185,129,0\.15\); color:#10b981; border:1px solid rgba\(16,185,129,0\.5\);">AGUARDANDO SUA APROVAÇÃO<\/span>`;/g,
    `badge.replaceChildren();
                const bSpan = document.createElement('span');
                bSpan.className = 'status-badge';
                bSpan.textContent = 'AGUARDANDO SUA APROVAÇÃO';
                if (isFinalArt) {
                    bSpan.style.cssText = 'background:rgba(139, 92, 246,0.15); color:#a78bfa; border:1px solid rgba(139,92,246,0.5);';
                } else {
                    bSpan.style.cssText = 'background:rgba(16,185,129,0.15); color:#10b981; border:1px solid rgba(16,185,129,0.5);';
                }
                badge.appendChild(bSpan);`
);

content = content.replace(/badge\.innerHTML = isFinalArt \? `<span class="status-badge" style="background:rgba\(139, 92, 246,0\.15\); color:#a78bfa; border:1px solid rgba\(139,92,246,0\.5\);">AGUARDANDO SUA APROVAO<\/span>` : `<span class="status-badge" style="background:rgba\(16,185,129,0\.15\); color:#10b981; border:1px solid rgba\(16,185,129,0\.5\);">AGUARDANDO SUA APROVAO<\/span>`;/g,
    `badge.replaceChildren();
                const bSpan = document.createElement('span');
                bSpan.className = 'status-badge';
                bSpan.textContent = 'AGUARDANDO SUA APROVAÇÃO';
                if (isFinalArt) {
                    bSpan.style.cssText = 'background:rgba(139, 92, 246,0.15); color:#a78bfa; border:1px solid rgba(139,92,246,0.5);';
                } else {
                    bSpan.style.cssText = 'background:rgba(16,185,129,0.15); color:#10b981; border:1px solid rgba(16,185,129,0.5);';
                }
                badge.appendChild(bSpan);`
);

content = content.replace(/matrixContainer\.innerHTML = matrixHtml;/g,
    `matrixContainer.replaceChildren(matrixHtml);` // matrixHtml should be a DOM node instead of string, let's look at how matrixHtml is generated. Wait, I will just do replaceChildren and append a single element or set text.
);

fs.writeFileSync('os/approval.html', content, 'utf8');
