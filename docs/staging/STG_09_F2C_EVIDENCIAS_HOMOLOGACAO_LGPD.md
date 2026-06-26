# Evidências de Homologação: Conformidade LGPD (F2C)

Este documento atesta, com evidências técnicas, a conclusão e validação do hardening de LGPD, habilitando o avanço do projeto de acordo com o protocolo da Fase de Homologação.

## 1. Commit de Integração
- **Hash do Commit:** `404ab05`
- **Mensagem:** `fix(legal): adere a lgpd bloqueando trackers e add checkbox`
- **Autor:** FluxAI OS (Agente)

## 2. Testes Funcionais Executados (Ambiente Local - `http://localhost:3000`)

**A. Validação do Consentimento de Tracking (GTM e Clarity):**
- Acesso inicial ao site com cache limpo: Nenhum payload do GTM/Clarity foi disparado na aba de `Network` ou `Console` (Injeção estritamente bloqueada por padrão).
- Interação: Usuário clica no botão **"Recusar"** (id `lgpd-reject`).
- Resultado: Banner desaparece e o script atualiza o `localStorage` com consentimento negado. O sistema de tracking manteve-se inativo durante toda a rolagem de tela e cliques subsequentes.

**B. Validação do Formulário Comercial (`#diagnostico`):**
- Preenchimento do formulário de ponta-a-ponta.
- Checkbox `aceite_lgpd` deliberadamente deixado em branco.
- Ação: Clique em "Enviar para avaliação".
- Resultado: O envio foi interceptado a nível de DOM. O navegador bloqueou o submit silencioso e focou no checkbox exigindo o aceite.

## 3. Evidências Visuais (Geradas por Automação)

Abaixo constam as capturas de tela e vídeo do teste que validou a presença do botão "Recusar" e o bloqueio de rastreio:

- **Banner com Botão Recusar Ativo (Carregamento Inicial):**
![Banner LGPD Ativo](file:///C:/Users/BRENDA/.gemini/antigravity-ide/brain/b0732a8c-ec13-4a9a-a325-5e54adf06307/lgpd_banner_visible_1782493478844.png)

- **Comportamento Pós-Rejeição (Tracking bloqueado com sucesso):**
![Pós Rejeição](file:///C:/Users/BRENDA/.gemini/antigravity-ide/brain/b0732a8c-ec13-4a9a-a325-5e54adf06307/page_after_rejection_1782493555182.png)

- **Gravação em Vídeo (Teste E2E do Banner LGPD):**
![Gravação Funcional LGPD](file:///C:/Users/BRENDA/.gemini/antigravity-ide/brain/b0732a8c-ec13-4a9a-a325-5e54adf06307/lgpd_banner_verification_1782493176480.webp)

> [!NOTE]
> Durante os testes automatizados, foi identificada uma falha crítica que estava quebrando o banner: o hash de `integrity` do script do CDN do **Supabase** estava obsoleto (`sha384-4Cjkyy...`), causando falha fatal no carregamento e bloqueando todos os scripts subsequentes. Esse erro foi corrigido nesta mesma branch para garantir que o banner funcionasse perfeitamente e o tracking fosse testado.

## 4. Diff dos Arquivos Alterados
O Diff completo foi gerado via comando `git diff HEAD~1 HEAD` no último commit integrado. Abaixo o resumo das alterações core em HTML/JS:

```diff
--- a/index.html
+++ b/index.html
@@ -702,6 +702,11 @@
                 <textarea id="desafio" name="internal_notes" placeholder="Descreva brevemente seu cenário atual" required></textarea>
               </div>
 
+              <div style="margin-bottom: 15px; display: flex; align-items: start; gap: 10px; text-align: left;">
+                <input type="checkbox" id="aceite_lgpd" name="aceite_lgpd" required style="width:auto; margin-top: 4px;">
+                <label for="aceite_lgpd" style="font-size: 0.85rem; color: #cbd5e1;">Li e aceito a <a href="#" onclick="document.getElementById('privacy-modal').classList.add('active');" style="color: #6b7a45; text-decoration: underline;">Política de Privacidade</a>.</label>
+              </div>
+
               <button type="submit" class="btn btn-primary btn-full">
                 Enviar para avaliação <i class="fa-solid fa-paper-plane"></i>
               </button>
@@ -810,6 +810,7 @@
       // 1. Loader de Analytics Híbrido
       const loadTracking = () => {
         if (trackingLoaded) return;
+        if (localStorage.getItem('lgpd_consent_2026') !== 'true') return;
         trackingLoaded = true;
         // GTM
@@ -824,6 +824,7 @@
             y=l.getElementsByTagName(r)[0];if(y) y.parentNode.insertBefore(t,y);
         })(window, document, "clarity", "script", "n72q8vcl9y");
       };
+      window.loadFluxAITracking = loadTracking;
 
       // Carregar Analytics na 1ª interação ou Fallback de 10s
       let fallbackTimer = setTimeout(loadTracking, 10000);
@@ -847,7 +848,7 @@
         supabaseLoaded = true;
         const script = document.createElement('script');
         script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.106.2/dist/umd/supabase.min.js";
-        script.integrity = "sha384-4Cjkyy4cE1EgIS0C+Y3xzGmJ2noQFRRU91yKAW8IxtPfVtbQXPMqadSc3sYnjwou";
+        script.integrity = "sha384-nWa0WrJ8Dl90YqhjSU0vNB8IxSO54t6AmEmV83LMTb/Img+Af2MfK7XJE54mwpSR";
         script.crossOrigin = "anonymous";
         script.defer = true;
         document.head.appendChild(script);
@@ -883,7 +884,10 @@
           <p class="lgpd-cookie-banner-text">
               Utilizamos cookies necessários para o funcionamento do site. Leia nossa <a id="openPrivacyLink">Política de Privacidade</a>.
           </p>
-          <button id="lgpd-accept" class="lgpd-cookie-banner-btn">Aceitar e Prosseguir</button>
+          <div style="display: flex; gap: 10px;">
+              <button id="lgpd-reject" class="lgpd-cookie-banner-btn" style="background: transparent; border: 1px solid rgba(255,255,255,0.2);">Recusar</button>
+              <button id="lgpd-accept" class="lgpd-cookie-banner-btn">Aceitar e Prosseguir</button>
+          </div>
       </div>
   </div>
 
@@ -947,6 +951,15 @@
             acceptBtn.addEventListener('click', () => {
                 localStorage.setItem('lgpd_consent_2026', 'true');
                 if (banner) banner.classList.remove('active');
+                if (window.loadFluxAITracking) window.loadFluxAITracking();
+            });
+        }
+
+        const rejectBtn = document.getElementById('lgpd-reject');
+        if (rejectBtn) {
+            rejectBtn.addEventListener('click', () => {
+                localStorage.setItem('lgpd_consent_2026', 'false');
+                if (banner) banner.classList.remove('active');
             });
         }
```
