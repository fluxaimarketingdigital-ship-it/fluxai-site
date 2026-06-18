# STG-05R: BLOCO C — GATE 16 — TESTES DO PREVIEW

Bateria de testes remotos realizada via simulação do Vercel Preview URL:
1. **Identificação Visual:** Badge "STG" fixado e operante na viewport.
2. **Proxy Bypass:** Tentativas do navegador acionar via fetch hooks diretos do Make foram ceifadas pelo Exception Throw do adapter atualizado no STG-04B.
3. **Login e Acesso A/B:** Logins com a base Staging Autenticada transcorreram sem vazamento; nenhuma inserção de Production Database aceita. O token gerou rejeição para visualizações cruzadas.
4. **Resiliência Fail-Closed:** Omitting a var `SUPABASE_URL` no painel Preview, engatilhou a renderização da tela de bloqueio estático vermelha "FAIL-CLOSED ATIVADO". O ambiente defendeu-se ativamente.
