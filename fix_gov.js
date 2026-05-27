const fs = require('fs');

let content = fs.readFileSync('os/governance-users.html', 'utf8');

const oldKeyDiv = `keyDiv.innerHTML = \`<span style="font-size: 0.7rem; color: var(--os-text-muted);"><i class="fa-solid fa-key"></i> Chave: <span id="pass-\${u.id}" class="mask-password">•••••••••</span></span>\`;`;
const newKeyDiv = `
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
`;
content = content.replace(oldKeyDiv, newKeyDiv);

const oldCaretDiv = `caretDiv.innerHTML = '<i class="fa-solid fa-chevron-down toggle-icon" style="transition: transform 0.3s ease;"></i>';`;
const newCaretDiv = `
                const iCaret = document.createElement('i');
                iCaret.className = 'fa-solid fa-chevron-down toggle-icon';
                iCaret.style.transition = 'transform 0.3s ease';
                caretDiv.appendChild(iCaret);
`;
content = content.replace(oldCaretDiv, newCaretDiv);

const oldBodyBlock = `                body.innerHTML = \` 
                        <!-- Bloco de Credenciais -->  
                        <div class="credentials-box" style="margin-bottom: 20px;">  
                            <div class="credential-row">  
                                <span class="credential-label">Login Operacional</span>  
                                <span class="credential-value safe-email-val" style="font-size: 0.8rem;"></span>  
                            </div>  
                            <div class="credential-row">  
                                <span class="credential-label">Chave de Acesso Externa</span>  
                                <span class="credential-value">  
                                    <button class="btn-credential-action safe-reveal-btn" title="Revelar Senha">  
                                        <i id="eye-icon-\${u.id}" class="fa-solid fa-eye"></i> Revelar  
                                    </button>  
                                    <button class="btn-credential-action safe-copy-btn" title="Copiar Senha">  
                                        <i class="fa-solid fa-copy"></i> Copiar  
                                    </button>  
                                </span>  
                            </div>  
                        </div>  
  
                        <!-- Grade de Módulos Autorizados -->  
                        <div class="permissions-section">  
                            <div class="permissions-title">  
                                <span>Módulos Autorizados (RBAC)</span>  
                            </div>  
                            <div class="safe-grid-container"></div> 
                        </div>  
  
                        <!-- Botões de Ações do Cartão -->  
                        <div class="card-actions">  
                            <button class="btn-card-action btn-card-reset safe-reset-btn" title="Resetar senha para fluxai@2026">  
                                <i class="fa-solid fa-key"></i> Resetar Senha  
                            </button>  
                            <button class="btn-card-action safe-toggle-btn" title="Ativar / Inativar Contrato" style="background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid rgba(245,158,11,0.2);">  
                                <i class="fa-solid fa-toggle-on"></i> Ativar/Inativar  
                            </button>  
                            <button class="btn-card-action btn-card-delete safe-del-btn" title="Excluir Usuário" style="max-width: none;">  
                                <i class="fa-solid fa-trash-can"></i> Excluir  
                            </button>  
                        </div>  
                \`; 
                 
                body.querySelector('.safe-email-val').textContent = u.email; 
                body.querySelector('.safe-grid-container').replaceChildren(gridHtml); 
                 
                body.querySelector('.safe-reveal-btn').onclick = () => window.togglePasswordReveal(u.id, u.password);  
                body.querySelector('.safe-copy-btn').onclick = () => window.copyToClipboard(u.password);  
                body.querySelector('.safe-reset-btn').onclick = () => window.resetUserPassword(u.id);  
                body.querySelector('.safe-toggle-btn').onclick = () => window.toggleContractStatus(u.id, u.email);  
                body.querySelector('.safe-del-btn').onclick = () => window.deleteUser(u.id, u.email); `;

const newBodyBlock = `
                // Credenciais box
                const credBox = document.createElement('div');
                credBox.className = 'credentials-box';
                credBox.style.marginBottom = '20px';

                // Login Operacional
                const row1 = document.createElement('div');
                row1.className = 'credential-row';
                const lbl1 = document.createElement('span');
                lbl1.className = 'credential-label';
                lbl1.textContent = 'Login Operacional';
                const val1 = document.createElement('span');
                val1.className = 'credential-value safe-email-val';
                val1.style.fontSize = '0.8rem';
                val1.textContent = u.email;
                row1.appendChild(lbl1);
                row1.appendChild(val1);

                // Chave de Acesso Externa
                const row2 = document.createElement('div');
                row2.className = 'credential-row';
                const lbl2 = document.createElement('span');
                lbl2.className = 'credential-label';
                lbl2.textContent = 'Chave de Acesso Externa';
                const val2 = document.createElement('span');
                val2.className = 'credential-value';

                const btnRev = document.createElement('button');
                btnRev.className = 'btn-credential-action safe-reveal-btn';
                btnRev.title = 'Revelar Senha';
                const iEye = document.createElement('i');
                iEye.id = 'eye-icon-' + u.id;
                iEye.className = 'fa-solid fa-eye';
                btnRev.appendChild(iEye);
                btnRev.appendChild(document.createTextNode(' Revelar'));
                btnRev.addEventListener('click', () => window.togglePasswordReveal(u.id, u.password));

                const btnCop = document.createElement('button');
                btnCop.className = 'btn-credential-action safe-copy-btn';
                btnCop.title = 'Copiar Senha';
                const iCopy = document.createElement('i');
                iCopy.className = 'fa-solid fa-copy';
                btnCop.appendChild(iCopy);
                btnCop.appendChild(document.createTextNode(' Copiar'));
                btnCop.addEventListener('click', () => window.copyToClipboard(u.password));

                val2.appendChild(btnRev);
                val2.appendChild(btnCop);
                row2.appendChild(lbl2);
                row2.appendChild(val2);

                credBox.appendChild(row1);
                credBox.appendChild(row2);

                // Grade Módulos
                const permSec = document.createElement('div');
                permSec.className = 'permissions-section';
                const pTitle = document.createElement('div');
                pTitle.className = 'permissions-title';
                const pSpan = document.createElement('span');
                pSpan.textContent = 'Módulos Autorizados (RBAC)';
                pTitle.appendChild(pSpan);
                const safeGrid = document.createElement('div');
                safeGrid.className = 'safe-grid-container';
                safeGrid.appendChild(gridHtml); // gridHtml is a DOM element created before this
                permSec.appendChild(pTitle);
                permSec.appendChild(safeGrid);

                // Ações do Cartão
                const cardAct = document.createElement('div');
                cardAct.className = 'card-actions';

                const btnRes = document.createElement('button');
                btnRes.className = 'btn-card-action btn-card-reset safe-reset-btn';
                btnRes.title = 'Resetar senha para fluxai@2026';
                const iKeyCard = document.createElement('i');
                iKeyCard.className = 'fa-solid fa-key';
                btnRes.appendChild(iKeyCard);
                btnRes.appendChild(document.createTextNode(' Resetar Senha'));
                btnRes.addEventListener('click', () => window.resetUserPassword(u.id));

                const btnTog = document.createElement('button');
                btnTog.className = 'btn-card-action safe-toggle-btn';
                btnTog.title = 'Ativar / Inativar Contrato';
                btnTog.style.cssText = 'background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid rgba(245,158,11,0.2);';
                const iTog = document.createElement('i');
                iTog.className = 'fa-solid fa-toggle-on';
                btnTog.appendChild(iTog);
                btnTog.appendChild(document.createTextNode(' Ativar/Inativar'));
                btnTog.addEventListener('click', () => window.toggleContractStatus(u.id, u.email));

                const btnDel = document.createElement('button');
                btnDel.className = 'btn-card-action btn-card-delete safe-del-btn';
                btnDel.title = 'Excluir Usuário';
                btnDel.style.maxWidth = 'none';
                const iDel = document.createElement('i');
                iDel.className = 'fa-solid fa-trash-can';
                btnDel.appendChild(iDel);
                btnDel.appendChild(document.createTextNode(' Excluir'));
                btnDel.addEventListener('click', () => window.deleteUser(u.id, u.email));

                cardAct.appendChild(btnRes);
                cardAct.appendChild(btnTog);
                cardAct.appendChild(btnDel);

                body.appendChild(credBox);
                body.appendChild(permSec);
                body.appendChild(cardAct);
`;

// There might be some encoding differences in the HTML (like Mdulos, Aes). I'll use regex.
content = content.replace(/caretDiv\.innerHTML = '<i class="fa-solid fa-chevron-down toggle-icon" style="transition: transform 0\.3s ease;"><\/i>';/g, newCaretDiv);
content = content.replace(/body\.innerHTML = `[\s\S]*?body\.querySelector\('\.safe-del-btn'\)\.onclick = \(\) => window\.deleteUser\(u\.id, u\.email\);/g, newBodyBlock);

fs.writeFileSync('os/governance-users.html', content, 'utf8');
