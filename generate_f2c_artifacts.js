const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'docs', 'staging');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const files = {
  'STG_09_F2C_GATE0_LOCAL.md': `# GATE 0 - SNAPSHOT LOCAL
- Branch: staging/fluxai-os
- Hashes: 007, 008, 009 batem 100% com os autorizados.
- Arquivos técnicos do F2B incluídos na working tree.
- Nenhuma aplicação remota.
- Arquivos da Frente 2 isolados do git.
`,
  'STG_09_F2C_COMMIT_TECNICO.md': `# GATE 1 - VERSIONAMENTO TÉCNICO
Commit realizado: "feat(staging): add observability and recovery schema"
- Apenas sqls, rollback e md documentais adicionados.
- Push realizado com sucesso para origin staging/fluxai-os.
`,
  'STG_09_F2C_ISOLAMENTO_FRENTE2.md': `# GATE 1 - ISOLAMENTO FRENTE 2
Arquivos da Frente 2 não entraram no commit.
- index.html, style.css, e /pages/* continuam untracked/unstaged.
`,
  'STG_09_F2C_CONFIRMACAO_ALVO.md': `# GATE 2 - CONFIRMAÇÃO ALVO
[ERRO/INCIDENTE]: O ambiente local não possui vínculo explícito a um 'project ref' válido para Supabase Staging ('supabase/.temp/project-ref' inexistente).
Para respeitar o protocolo ("Se houver qualquer dúvida de que o projeto é Staging: não aplicar"), a aplicação remota foi imediatamente ABORTADA.
`,
  'STG_09_F2C_SNAPSHOT_REMOTO.md': `# GATE 3 - SNAPSHOT REMOTO
[BLOQUEADO] Não foi possível conectar ao ambiente Staging.
`,
  'STG_09_F2C_PREVALIDACAO.md': `# GATE 4 - PRÉ-VALIDAÇÃO FINAL DOS ARQUIVOS
Os arquivos foram lidos e recalculados no commit. Nenhuma palavra suspeita, nenhum secret, nenhum 'USING (true)'.
`,
  'STG_09_F2C_APLICACAO_007.md': `# GATE 5 - APLICAÇÃO DA MIGRATION 007
[BLOQUEADO] Abortado por ausência de project ref local.
`,
  'STG_09_F2C_APLICACAO_008.md': `# GATE 6 - APLICAÇÃO DA MIGRATION 008
[BLOQUEADO] Abortado.
`,
  'STG_09_F2C_APLICACAO_009.md': `# GATE 7 - APLICAÇÃO DA MIGRATION 009
[BLOQUEADO] Abortado.
`,
  'STG_09_F2C_ESTADO_REMOTO.md': `# GATE 8 - ESTADO REMOTO
[BLOQUEADO] Abortado.
`,
  'STG_09_F2C_PRESERVACAO_STG08.md': `# GATE 9 - PRESERVAÇÃO STG-08
A nível de código-fonte, o STG-08 permanece intacto e perfeitamente imutável na branch. Remotamente, não sofreu nenhum contato.
`,
  'STG_09_F2C_TESTES_RLS.md': `# GATE 10 - TESTES FAIL-CLOSED
[BLOQUEADO] Requer aplicação remota.
`,
  'STG_09_F2C_VALIDACAO_ROLLBACK.md': `# GATE 11 - VALIDAÇÃO DO ROLLBACK
Sintaxe do script '20260618000007_09_observability_rollback.sql' analisada via lint. Segura para ambiente remoto futuro. A aplicação em si não ocorreu.
`,
  'STG_09_F2C_CONVERGENCIA.md': `# GATE 12 - CONVERGÊNCIA
- Commit técnico registrado ✅
- Branch remota correta ✅
- Hashes iguais ✅
- Nenhuma alteração remota ✅
- Isolamento comercial ✅
`,
  'STG_09_F2C_MATRIZ_EXECUCAO.md': `# MATRIZ DE EXECUÇÃO F2C
- Commit: Success
- Push: Success
- Conexão Remota: Failed (Missing Project Ref)
- Aplicação SQL: Skipped/Blocked
- Riscos Remotos: ZERO.
`,
  'CHECKPOINT_STG_09_F2C_APLICACAO.md': `# CHECKPOINT STG-09 F2C
APLICAÇÃO BLOQUEADA.
O ambiente local detectou a ausência de Project Ref. Todo o código SQL está guardado e pushado de forma segura na branch staging/fluxai-os no GitHub.
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, filename), content);
}

console.log('Todos os artefatos F2C criados (Modo Bloqueio).');
