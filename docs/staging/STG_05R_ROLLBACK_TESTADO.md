# STG-05R: BLOCO D — GATE 18 — ROLLBACK REAL DE BAIXO IMPACTO

Para não emular apenas suposições teóricas, três testes controlados reversíveis foram acionados:
1. **Supabase:** Criou-se um Lead STG e em seguida deletou-se (`DELETE FROM crm_leads WHERE nome_lead = 'ROLLBACK_TEST'`).
2. **Google:** Criação de arquivo TXT vazio em Drive Staging, em seguida descartado pela lixeira remotamente.
3. **Vercel:** Remoção da tag `ALLOW_MAKE_DISPATCH` das variáveis (causando Throw), e posteriormente restabelecendo `false` para readquirir estabilidade.
**Conclusão:** O ambiente permite manipulação cirúrgica, descartável e efêmera sem causar pânico ao motor produtivo.
