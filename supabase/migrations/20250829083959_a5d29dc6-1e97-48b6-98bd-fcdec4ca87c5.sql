-- Add function to generate random usernames
CREATE OR REPLACE FUNCTION generate_random_username()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  adjectives TEXT[] := ARRAY['Mighty', 'Swift', 'Fierce', 'Bold', 'Strong', 'Quick', 'Sharp', 'Wild', 'Brave', 'Cool', 'Epic', 'Fire', 'Ice', 'Steel', 'Storm', 'Lightning', 'Thunder', 'Shadow', 'Ghost', 'Cyber', 'Neon', 'Plasma', 'Turbo', 'Mega', 'Ultra', 'Super', 'Alpha', 'Beta', 'Omega', 'Prime'];
  nouns TEXT[] := ARRAY['Warrior', 'Fighter', 'Champion', 'Hero', 'Legend', 'Beast', 'Tiger', 'Eagle', 'Wolf', 'Lion', 'Dragon', 'Phoenix', 'Viper', 'Panther', 'Hawk', 'Bear', 'Shark', 'Storm', 'Blade', 'Fist', 'Strike', 'Bolt', 'Flash', 'Fury', 'Rage', 'Force', 'Power', 'Spirit', 'Soul', 'Mind'];
  random_adj TEXT;
  random_noun TEXT;
  random_num INTEGER;
BEGIN
  random_adj := adjectives[floor(random() * array_length(adjectives, 1)) + 1];
  random_noun := nouns[floor(random() * array_length(nouns, 1)) + 1];
  random_num := floor(random() * 9999) + 1;
  
  RETURN random_adj || random_noun || random_num::TEXT;
END;
$$;

-- Update existing profiles to have auto-generated usernames if they don't have one
UPDATE user_profiles 
SET username = generate_random_username() 
WHERE username IS NULL OR username = '';

-- Add function to get tier icon based on XP
CREATE OR REPLACE FUNCTION get_tier_icon(xp_amount INTEGER)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  CASE 
    WHEN xp_amount >= 50000 THEN RETURN '👑'; -- God Mode
    WHEN xp_amount >= 25000 THEN RETURN '💪'; -- Giga Chad
    WHEN xp_amount >= 15000 THEN RETURN '🔥'; -- Chad
    WHEN xp_amount >= 10000 THEN RETURN '⭐'; -- Superstar
    WHEN xp_amount >= 7000 THEN RETURN '🏆'; -- Champ
    WHEN xp_amount >= 4000 THEN RETURN '🥊'; -- Pro
    WHEN xp_amount >= 2000 THEN RETURN '⚔️'; -- Fighter
    WHEN xp_amount >= 1000 THEN RETURN '🏃'; -- Athlete
    WHEN xp_amount >= 500 THEN RETURN '🤝'; -- Sparrer
    WHEN xp_amount >= 100 THEN RETURN '🎯'; -- Trainee
    ELSE RETURN '👤'; -- Recruit
  END CASE;
END;
$$;

-- Create trigger function to auto-generate username on profile creation
CREATE OR REPLACE FUNCTION auto_generate_username()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.username IS NULL OR NEW.username = '' THEN
    NEW.username := generate_random_username();
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for auto-generating usernames
DROP TRIGGER IF EXISTS auto_username_trigger ON user_profiles;
CREATE TRIGGER auto_username_trigger
  BEFORE INSERT OR UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_username();