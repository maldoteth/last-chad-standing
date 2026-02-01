CREATE TABLE public.nft_bids (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    bidder_id UUID NOT NULL REFERENCES public."Users"(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES public.store_items(id) ON DELETE CASCADE,
    locker_id UUID NOT NULL REFERENCES public."Locker"(id) ON DELETE CASCADE,
    bid_amount BIGINT NOT NULL CHECK (bid_amount > 0),
    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active','accepted','rejected','cancelled','expired','outbid')),
    accepted_by UUID REFERENCES public."Users"(id),
    accepted_at TIMESTAMPTZ,
    token_id INTEGER,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '3 days'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.nft_bids ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view bids" ON public.nft_bids FOR SELECT USING (true);
-- All writes go through Edge Functions (service role bypasses RLS)

CREATE INDEX idx_nft_bids_item_id ON public.nft_bids(item_id);
CREATE INDEX idx_nft_bids_bidder_id ON public.nft_bids(bidder_id);
CREATE INDEX idx_nft_bids_locker_id ON public.nft_bids(locker_id);
CREATE INDEX idx_nft_bids_status ON public.nft_bids(status);
CREATE INDEX idx_nft_bids_item_status ON public.nft_bids(item_id, status);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_nft_bids_updated_at
BEFORE UPDATE ON public.nft_bids FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Get highest active bid for an item
CREATE OR REPLACE FUNCTION public.get_highest_bid(p_item_id UUID)
RETURNS TABLE(bid_id UUID, bidder_id UUID, bid_amount BIGINT, bidder_name TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT b.id, b.bidder_id, b.bid_amount, u.name
    FROM public.nft_bids b JOIN public."Users" u ON u.id = b.bidder_id
    WHERE b.item_id = p_item_id AND b.status = 'active' AND b.expires_at > now()
    ORDER BY b.bid_amount DESC LIMIT 1;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- Expire stale bids and refund coins
CREATE OR REPLACE FUNCTION public.expire_stale_bids() RETURNS void AS $$
BEGIN
    UPDATE public."Users" u SET coins = u.coins + b.bid_amount
    FROM public.nft_bids b
    WHERE b.bidder_id = u.id AND b.status = 'active' AND b.expires_at < now();

    UPDATE public.nft_bids SET status = 'expired', updated_at = now()
    WHERE status = 'active' AND expires_at < now();
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix marketplace_listings RLS
-- Note: Checking if table exists first just in case
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'marketplace_listings') THEN
        DROP POLICY IF EXISTS "Users can create their own marketplace listings" ON public.marketplace_listings;
        DROP POLICY IF EXISTS "Users can update their own marketplace listings" ON public.marketplace_listings;
        DROP POLICY IF EXISTS "Users can delete their own marketplace listings" ON public.marketplace_listings;
    END IF;
END $$;
