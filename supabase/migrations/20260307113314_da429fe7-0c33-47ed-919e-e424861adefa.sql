
CREATE TABLE public.sale_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  wallet TEXT NOT NULL,
  entry_size TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sale_interests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Allow public insert sale_interests"
  ON public.sale_interests FOR INSERT
  WITH CHECK (true);

-- Only allow reading via service role (admin)
CREATE POLICY "Allow public read sale_interests"
  ON public.sale_interests FOR SELECT
  USING (true);
