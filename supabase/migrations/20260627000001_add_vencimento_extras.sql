-- Migration SQL para adicionar Data de Vencimento em Serviços Extras
-- Data: 2026-06-27

ALTER TABLE public."SERVICOS_EXTRAS_CLIENTES" 
ADD COLUMN IF NOT EXISTS data_vencimento text;
