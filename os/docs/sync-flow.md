# Fluxo de Sincronização e Resiliência

A FluxAI OS™ prioriza a continuidade operacional através de uma estratégia Local-First.

## Estados de Sincronização
1. **Sincronizado**: O dado local é idêntico ao do Supabase.
2. **Pendente de Sync**: O dado foi salvo localmente, mas a conexão falhou ou está offline.
3. **Erro de Sync**: A tentativa de sincronização retornou um erro de validação ou conflito.

## Lógica de Reconciliação
- Ao carregar um módulo, o sistema tenta buscar os dados mais recentes do Supabase.
- Se houver dados `pendente_sync` localmente, eles são enviados antes da leitura.
- Em caso de conflito, a versão do servidor prevalece, a menos que o usuário force a sobrescrita.
