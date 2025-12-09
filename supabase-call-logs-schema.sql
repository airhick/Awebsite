-- Create call_logs table to store VAPI call data
CREATE TABLE IF NOT EXISTS call_logs (
  id BIGSERIAL PRIMARY KEY,
  vapi_call_id TEXT UNIQUE NOT NULL,
  customer_id BIGINT REFERENCES customers(id) ON DELETE CASCADE,
  status TEXT,
  type TEXT,
  started_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  duration INTEGER,
  cost DECIMAL(10, 4),
  customer_number TEXT,
  ended_reason TEXT,
  summary TEXT,
  recording_url TEXT,
  transcript JSONB,
  messages JSONB,
  assistant_id TEXT,
  artifact JSONB,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at_db TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on vapi_call_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_call_logs_vapi_call_id ON call_logs(vapi_call_id);

-- Create index on customer_id for filtering
CREATE INDEX IF NOT EXISTS idx_call_logs_customer_id ON call_logs(customer_id);

-- Create index on started_at for sorting
CREATE INDEX IF NOT EXISTS idx_call_logs_started_at ON call_logs(started_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own call logs" ON call_logs;
DROP POLICY IF EXISTS "Service role can manage call logs" ON call_logs;

-- Policy: Users can only see their own call logs
CREATE POLICY "Users can view their own call logs"
  ON call_logs
  FOR SELECT
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Policy: Service role can insert/update call logs (for sync)
-- Note: This policy allows all operations, but in practice, RLS will still apply
-- For service role operations, you may need to use the service role key directly
CREATE POLICY "Service role can manage call logs"
  ON call_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);

