-- Create knowledge_resources table
CREATE TABLE IF NOT EXISTS public.knowledge_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('PDF', 'WEBSITE', 'ARTICLE', 'VIDEO', 'GUIDE', 'GOVERNMENT_DOCUMENT', 'RESEARCH_PUBLICATION')),
  category TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT,
  document_url TEXT,
  thumbnail_url TEXT,
  content TEXT,
  state TEXT DEFAULT 'PAN_INDIA',
  scope TEXT DEFAULT 'PAN_INDIA',
  crop TEXT,
  language TEXT DEFAULT 'English',
  tags TEXT[],
  author TEXT,
  published_date TIMESTAMP WITH TIME ZONE,
  updated_date TIMESTAMP WITH TIME ZONE,
  page_count INTEGER,
  duration TEXT,
  read_time TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.knowledge_resources ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to knowledge_resources"
  ON public.knowledge_resources
  FOR SELECT
  USING (true);
