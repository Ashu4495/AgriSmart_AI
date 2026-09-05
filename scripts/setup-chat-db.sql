-- Setup chat tracking tables
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid, -- Optional for anonymous guests
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role text NOT NULL, -- 'user' or 'assistant'
  content text NOT NULL,
  timestamp timestamp with time zone DEFAULT now() NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Note: We are using a simple table structure without strict RLS for this demo.
-- If RLS is enabled on these tables, we should add policies to allow anonymous inserts from the API.
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous or authenticated API roles to insert and select their own sessions based on session_id
CREATE POLICY "Enable insert for all" ON public.chat_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for all" ON public.chat_sessions FOR SELECT USING (true);
CREATE POLICY "Enable update for all" ON public.chat_sessions FOR UPDATE USING (true);

CREATE POLICY "Enable insert for all" ON public.chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for all" ON public.chat_messages FOR SELECT USING (true);
