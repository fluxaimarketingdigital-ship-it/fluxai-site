-- Migração de Enriquecimento Transacional (Bloco 07)
-- Adiciona rastreabilidade granular, metadados e Catálogo Canônico de Observabilidade

ALTER TABLE public.transaction_events
  ADD COLUMN correlation_id text,
  ADD COLUMN event_name text NOT NULL DEFAULT 'unknown',
  ADD COLUMN source_system text,
  ADD COLUMN metadata jsonb DEFAULT '{}'::jsonb;

-- Criação do catálogo canônico de eventos para evitar divergência de nomenclaturas
ALTER TABLE public.transaction_events
  ADD CONSTRAINT chk_event_name CHECK (
    event_name IN (
      'proxy_received',
      'proxy_authenticated',
      'proxy_dispatched',
      'make_received',
      'make_processing',
      'business_completed',
      'business_failed',
      'manual_retry',
      'system_timeout',
      'system_cancelled',
      'unknown'
    )
  );

-- O correlation_id permite buscar a trilha inteira da transação sem precisar fazer JOIN com a tabela `transactions`
-- Vamos indexar o correlation_id em ambas as tabelas para otimizar a investigação de incidentes
CREATE INDEX IF NOT EXISTS idx_transactions_correlation_id ON public.transactions(correlation_id);
CREATE INDEX IF NOT EXISTS idx_transaction_events_correlation_id ON public.transaction_events(correlation_id);
