-- ============================================
-- User Events Table Schema
-- This table receives webhook events from n8n
-- ============================================

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_events (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT NOT NULL,
  event_type TEXT DEFAULT 'n8n.goreview.fr',
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  call_id TEXT NULL,
  call_type TEXT NULL
);

-- Add foreign key constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_events_customer_id_fkey'
  ) THEN
    ALTER TABLE public.user_events 
    ADD CONSTRAINT user_events_customer_id_fkey 
    FOREIGN KEY (customer_id) 
    REFERENCES customers (id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add call_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_events' 
    AND column_name = 'call_id'
  ) THEN
    ALTER TABLE public.user_events 
    ADD COLUMN call_id TEXT NULL;
  END IF;
END $$;

-- Add call_type column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_events' 
    AND column_name = 'call_type'
  ) THEN
    ALTER TABLE public.user_events 
    ADD COLUMN call_type TEXT NULL;
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_user_events_customer ON public.user_events(customer_id);
CREATE INDEX IF NOT EXISTS idx_user_events_call_id ON public.user_events(call_id) WHERE call_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_events_call_type ON public.user_events(call_type) WHERE call_type IS NOT NULL;

-- Enable Realtime for this table (vital for dashboard)
-- Note: This may fail if already added, that's okay
DO $$ 
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE user_events;
EXCEPTION
  WHEN duplicate_object THEN
    -- Already added, ignore
    NULL;
END $$;
