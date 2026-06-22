# STG-F: MATRIZ DE BACKUP E ROLLBACK PRELIMINAR

| Componente | Tipo Backup | Destino | Retenção | Validação | Procedimento Restauração (Rollback) |
|---|---|---|---|---|---|
| Repositório Frontend | Git Versioning | GitHub Central | Ilimitado | Checksums | `git revert` ou Deploy de Tag segura (Fail-closed) |
| Vercel Proxy | Histórico Deploy | Nuvem Vercel | Padrão | Rollback Inst. | Acionar "Rollback" via painel Vercel para versão segura sem rotas bypass. |
| Supabase Schema/Roles | Dump SQL | Arquivo/Drive | N/A | PgAdmin/CLI | Rodar `.sql` limpo no banco. NUNCA restaurar `USING (true)`. |
| Make Blueprints | Exportação JSON | Drive (Cenário AUX_01) | Arquivístico| Manual Visual | Importar Blueprint sobre arquivo legado, testar rotas com IDs inertes. |
| Google Sheets | Versionamento Nativo | Nuvem Google | Ilimitado | Histórico UI | Restaurar Versão pelo relógio ou apagar linhas manuais. |

*Critério Base de Rollback:* O rollback deve ser obrigatoriamente *Fail-Closed*. Um cenário instável será bloqueado e não revertido a um estado vulnerável (ex: webhooks legados, ou Auth bypass).
