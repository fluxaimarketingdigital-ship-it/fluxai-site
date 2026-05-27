# SONAR_P0_P1_DIAGNOSTICO_FASE_03_2

Data: 27/05/2026
Projeto: FluxAI OS™
Fase: Diagnóstico de Issues P0/P1 do Sonar (Fase 03.2)

## 1. `os/js/os-core.js` - Linha 316

**Trecho do Código:**
```javascript
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = html;
```

**Diagnóstico Sonar:**
O Sonar classifica a atribuição direta via `innerHTML` como uma vulnerabilidade potencial de *Cross-Site Scripting (XSS)* (Regra: S5131). O motor estático não consegue rastrear que as variáveis injetadas no template `html` (como `data.trend` e `data.meta`) já estão sendo previamente sanitizadas através da função de segurança estrutural `window.escapeHTML()`.

**Classificação de Risco:** 
*Falso positivo*. O uso do `innerHTML` aqui é consciente para montar templates DOM de componentes estáticos, e a sanitização já ocorre internamente antes da injeção. Não exige correção arquitetural, apenas possível marcação de *False Positive* no painel do Sonar.

---

## 2. `os/js/modules/cliente-detalhe.js` - Linha 114

**Trecho do Código:**
```javascript
function saveClientConfigs(configs) {
    localStorage.setItem('fluxai_client_configs', JSON.stringify(configs));
}
```

**Diagnóstico Sonar:**
O Sonar levanta um *Security Hotspot* sobre o uso de APIs de Web Storage (Regra: S5696), que alerta sobre o armazenamento inseguro de informações sensíveis no `localStorage` ou `sessionStorage`. O dado armazenado (`fluxai_client_configs`) refere-se apenas a configurações não-sensíveis de UI (filtros, estados de acordeão e layouts de tabela) aplicados ao portal do cliente, não constituindo dados de autenticação (JWT, senhas ou Roles) que foram previamente blindados pelo CodeQL.

**Classificação de Risco:** 
*Falso positivo provável / Risco Baixo*. Trata-se de estado visual.

---

## 3. `os/governance-users.html` - Linhas 459, 460, 461, 480, 737, 814

**Trecho do Código:**
```javascript
{ id: 'u1', full_name: 'Admin FluxAI', email: 'admin@fluxai.com', password: 'fluxai@2026', role: 'ADMIN', ... }
{ id: 'u2', full_name: 'Kassia Gomes', email: 'kassia@fluxai.com', password: 'fluxai@2026', role: 'OPERATOR', ... }
mockUsers[index].password = 'fluxai@2026';
```

**Diagnóstico Sonar:**
O Sonar identifica a string explícita `password: 'fluxai@2026'` como uma vulnerabilidade grave de credencial codificada (Regra: S2098 - *Hardcoded Credentials*). No contexto deste arquivo administrativo, esses são placeholders e mocks locais para pré-preencher cadastros dummy ou testar o fluxo de "Reset de Senha" no frontend sem afetar o Supabase. Não são credenciais ativas em banco de dados ou chaves criptográficas.

**Classificação de Risco:** 
*Falso positivo*. São strings puramente didáticas (mocks) usadas como fallback ou demonstração visual no painel.

---

## 4. `os/js/onboarding.js` - Linha 684

**Trecho do Código:**
```javascript
        mockUsers.push({
            id: userId,
            project_id: projectId,
            full_name: raw.responsible_name,
            email: email,
            password: "fluxai@2026",
            role: "CLIENT",
            // ...
```

**Diagnóstico Sonar:**
Igualmente à *Issue 3*, o Sonar ativa o *Hardcoded Credentials* (S2098). A engine visualiza uma string sendo atribuída a uma chave `password` dentro de um payload JSON. Novamente, essa matriz `mockUsers.push()` destina-se a preencher o `localStorage` com dados fakes durante o bypass ou testes offline da fase de Onboarding.

**Classificação de Risco:** 
*Falso positivo*. Credencial inócua (mock).

---

## 5. Security Hotspots

Os 4 Security Hotspots detectados pelo SonarCloud em código ativo são exatamente os diagnosticados acima, listados a seguir:

1. **Arquivo:** `os/js/os-core.js` | **Linha:** ~316 | **Regra:** javascript:S5131 (Cross-Site Scripting via `innerHTML`) - *Ativo*
2. **Arquivo:** `os/js/modules/cliente-detalhe.js` | **Linha:** ~114 | **Regra:** javascript:S5696 (Using Web Storage is security-sensitive) - *Ativo*
3. **Arquivo:** `os/governance-users.html` | **Linha:** ~459 | **Regra:** javascript:S2098 (Hardcoded Passwords) - *Ativo (Mock)*
4. **Arquivo:** `os/js/onboarding.js` | **Linha:** ~684 | **Regra:** javascript:S2098 (Hardcoded Passwords) - *Ativo (Mock)*

---

## 6. Conclusão

Com base na auditoria aprofundada pós-CodeQL já consolidada e nos resultados apontados pelo SonarCloud, a resolução recomendada para a triagem é a seguinte:

**Corrigir imediatamente:**
- *Nenhum.* Todas as chamadas relatadas são benignas dentro do contexto do front-end do projeto. A base deve permanecer estritamente congelada.

**Exige decisão humana (Revisão manual):**
- O `innerHTML` no `os-core.js` requer uma avaliação visual de quem for aprovar os hotspots no painel do Sonar para atestar que `window.escapeHTML` fornece cobertura suficiente para este *widget*.

**Aceitar como falso positivo (Resolve as False Positive):**
- As credenciais estáticas (`fluxai@2026`) no Onboarding e Governance.
- O Web Storage do `cliente-detalhe.js` que trafega unicamente configs visuais de tela.

**Mover para backlog / Excluir da análise:**
- Caso o volume de mocks continue a sobrecarregar os hotspots, convém criar regras no `.properties` exilando esses blocos, ou separar oficialmente os mocks de usuários em arquivos `.data.js` alocados na diretiva de ignorados.
