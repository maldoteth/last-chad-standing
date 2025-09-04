-- Add first_release_date and total_purchased to store_items table
ALTER TABLE public.store_items 
ADD COLUMN first_release_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN total_purchased INTEGER DEFAULT 0;

-- Create trigger function to increment total_purchased when item is purchased
CREATE OR REPLACE FUNCTION public.increment_total_purchased()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.store_items 
  SET total_purchased = total_purchased + NEW.quantity
  WHERE id = NEW.item_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger on user_inventory to increment total_purchased
CREATE TRIGGER trigger_increment_total_purchased
  AFTER INSERT ON public.user_inventory
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_total_purchased();