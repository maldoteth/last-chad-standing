-- Add Emotes category items to store_items table
INSERT INTO store_items (name, description, price, rarity, category, image_url, is_active)
VALUES 
  ('Flex', 'Show off your strength with this powerful flex emote', 250, 'rare', 'emotes', '/lovable-uploads/placeholder.svg', true),
  ('Shush', 'Quiet your opponents with this legendary silence gesture', 500, 'legendary', 'emotes', '/lovable-uploads/placeholder.svg', true),
  ('Fists Up', 'Raise your fists in victory with this mythical celebration', 1000, 'mythical', 'emotes', '/lovable-uploads/placeholder.svg', true),
  ('Squeaky Dance', 'A unique and quirky dance move to confuse your enemies', 750, 'special', 'emotes', '/lovable-uploads/placeholder.svg', true);