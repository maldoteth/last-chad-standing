DROP POLICY "Allow public insert sale_interests" ON public.sale_interests;
CREATE POLICY "Allow public insert sale_interests" ON public.sale_interests FOR INSERT WITH CHECK (true);