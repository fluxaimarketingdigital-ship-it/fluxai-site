const fs = require('fs');

let lines = fs.readFileSync('os/js/contracts-finance.js', 'utf8').split('\n');
const startIndex = lines.findIndex(l => l.includes("const td2 = document.createElement('td');"));
const endIndex = lines.findIndex(l => l.includes("tr.querySelector('.safe-next-action').textContent = nextAction;"));

if (startIndex !== -1 && endIndex !== -1) {
    const replacement = `        const td2 = document.createElement('td');
        const healthSpan = document.createElement('span');
        healthSpan.className = \`health-pill \${healthClass}\`;
        healthSpan.textContent = health;
        td2.appendChild(healthSpan);
        tr.appendChild(td2);

        const td3 = document.createElement('td');
        td3.style.cssText = 'font-size: 0.7rem;';
        td3.style.color = finRisk === 'Nulo' ? 'var(--os-success)' : 'var(--os-warning)';
        td3.textContent = finRisk;
        tr.appendChild(td3);

        const td4 = document.createElement('td');
        td4.style.cssText = 'font-size: 0.7rem; color: var(--os-success);';
        td4.textContent = opRisk;
        tr.appendChild(td4);

        const td5 = document.createElement('td');
        td5.style.cssText = 'font-size: 0.7rem; color: var(--os-success);';
        td5.textContent = 'Em Conformidade';
        tr.appendChild(td5);

        const td6 = document.createElement('td');
        td6.style.cssText = 'font-size: 0.75rem; font-weight: 700; color: var(--os-primary);';
        td6.textContent = nextAction;
        tr.appendChild(td6);
`;
    lines.splice(startIndex, endIndex - startIndex + 1, replacement);
    fs.writeFileSync('os/js/contracts-finance.js', lines.join('\n'), 'utf8');
}
