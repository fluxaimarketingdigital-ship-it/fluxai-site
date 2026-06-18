-- Modelo de Dados Transacional e Máquina de Estados
-- STG-08 Gate 2 e Gate 7

CREATE TYPE transaction_status AS ENUM (
  'received', 'accepted', 'processing', 'partially_completed', 
  'completed', 'failed', 'rejected', 'blocked', 
  'rollback_pending', 'rolled_back', 'unknown'
);

CREATE TABLE public.transactions (
  transaction_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id text NOT NULL UNIQUE,
  correlation_id text NOT NULL,
  business_id text,
  idempotency_key text NOT NULL,
  payload_hash text NOT NULL,
  route_name text NOT NULL,
  client_id text,
  user_id uuid REFERENCES auth.users(id),
  role text,
  status transaction_status DEFAULT 'received',
  attempt_count int DEFAULT 1,
  error_code text,
  received_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.transaction_events (
  event_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id uuid REFERENCES public.transactions(transaction_id),
  from_status transaction_status,
  to_status transaction_status NOT NULL,
  actor_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Somente backend/admin podem inserir ou alterar
CREATE POLICY "Admin full access" ON public.transactions
  USING (public.current_user_role(auth.uid()) = 'ADMIN');
