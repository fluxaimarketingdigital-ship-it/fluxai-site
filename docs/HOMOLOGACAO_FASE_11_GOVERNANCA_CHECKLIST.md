# ☑️ CHECKLIST DE TESTE PÓS-APLICAÇÃO: MITIGAÇÃO RLS (FASE 11)

**Objetivo:** Validar se a aplicação da migration final blindou o banco de dados sem quebrar a operação do sistema FluxAI OS.

Instruções: Após rodar o script `20260708000001_phase11_rls_mitigation_FINAL.sql` no SQL Editor do Supabase, siga este roteiro de testes. Se algum item falhar (retornar erro onde não devia), você deve aplicar o script de **Rollback**.

## 1. Testes de Administração (ADMIN / OPERATOR)
- [ ] **Login Admin:** Acesse `kassiadgomes@hotmail.com` (ou outro admin). O login deve ocorrer com sucesso.
- [ ] **Acesso Global:** Navegue até "Command Center" e "Contratos & Financeiro". Todas as listas de todos os clientes devem carregar normalmente. Nenhuma grid deve estar vazia (a menos que realmente não existam dados).
- [ ] **Criação de Dados (Insert):** Adicione uma nova demanda ou aprove um contrato. O Supabase deve aceitar o `INSERT`/`UPDATE` sem erro de *RLS policy violation*.
- [ ] **Verificação de Perfil:** Abra a aba *Network* no navegador e verifique a requisição para `governance_users`. Ela deve retornar o perfil da Kássia normalmente.

## 2. Testes de Cliente (CLIENT)
- [ ] **Login Cliente:** Acesse com uma conta que seja apenas `CLIENT` (cujo e-mail está na `governance_users` atrelado a um `scoped_project_id`).
- [ ] **Portal do Cliente Limitado:** A tela do Portal do Cliente deve carregar **apenas** os Contratos, Demandas e Faturas pertencentes ao `project_id` ou `client_id` atrelado ao perfil.
- [ ] **Tentativa de Invasão (IDOR):** Com o cliente logado, abra o Console do navegador (F12) e tente buscar projetos usando a chave pública do Supabase, passando um ID diferente do projeto do cliente. Exemplo de query via rede:
  - Resultado esperado: A requisição não falha tecnicamente (HTTP 200), mas retorna um array vazio `[]`, pois o banco de dados filtrou pela RLS.
- [ ] **Bloqueio de Mutação de Perfil:** Se o cliente tentar disparar um `UPDATE` na tabela `governance_users` para tentar se tornar 'ADMIN', o Supabase deve bloquear (Policy Violation).

## 3. Testes do Motor de Logs e Governança
- [ ] **Inserção de Logs (Geração Frontend):** Navegue pelo painel fazendo ações simples. Abra a aba Network e confira se a tabela `operational_events` e `audit_logs` está recebendo os `INSERTS` com HTTP 201 (Created). O RLS deve permitir a inserção.
- [ ] **Proteção de Logs (Imutabilidade):**
  - Vá no Supabase Studio (SQL Editor).
  - Tente forçar um update ou delete de um `audit_log` simulando ser um usuário autenticado (ou mesmo como você pelo portal, via API).
  - Resultado esperado: Qualquer `UPDATE` ou `DELETE` vindo da API deve falhar, pois a RLS proíbe mutações pós-criação. Apenas contas service_role podem deletar no Supabase.

---

### Decisão pós-teste
✅ Se **TODOS** os testes acima passarem: A Fase 11 foi implementada com 100% de sucesso e a infraestrutura está segura contra vazamentos de dados entre clientes.
❌ Se algum teste quebrar o uso normal (ex: Admin não ver nada): Vá ao Supabase SQL Editor e rode o `20260708000001_phase11_rls_rollback.sql` imediatamente para restaurar o sistema.
