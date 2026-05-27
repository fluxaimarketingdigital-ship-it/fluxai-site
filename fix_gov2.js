const fs = require('fs');
let content = fs.readFileSync('os/governance-users.html', 'utf8');

// Use replace with string search for keyDiv since the regex didn't match perfectly.
const regexKeyDiv = /keyDiv\.innerHTML = `([^`]*)`;/;
content = content.replace(regexKeyDiv, `
                const kSpan = document.createElement('span');
                kSpan.style.cssText = 'font-size: 0.7rem; color: var(--os-text-muted);';
                const iKey = document.createElement('i');
                iKey.className = 'fa-solid fa-key';
                kSpan.appendChild(iKey);
                kSpan.appendChild(document.createTextNode(' Chave: '));
                const maskSpan = document.createElement('span');
                maskSpan.id = 'pass-' + u.id;
                maskSpan.className = 'mask-password';
                maskSpan.textContent = '•••••••••';
                kSpan.appendChild(maskSpan);
                keyDiv.appendChild(kSpan);
`);

fs.writeFileSync('os/governance-users.html', content, 'utf8');
