-- Update the get_tier_icon function to match frontend tier system
CREATE OR REPLACE FUNCTION public.get_tier_icon(xp_amount integer)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  CASE 
    WHEN xp_amount >= 10000 THEN RETURN '👑'; -- King Chad
    WHEN xp_amount >= 9000 THEN RETURN '💪'; -- Giga Chad
    WHEN xp_amount >= 8000 THEN RETURN '👊'; -- Chad
    WHEN xp_amount >= 7000 THEN RETURN '⭐'; -- Superstar
    WHEN xp_amount >= 6000 THEN RETURN '🏆'; -- Champ
    WHEN xp_amount >= 5000 THEN RETURN '🥊'; -- Pro
    WHEN xp_amount >= 4000 THEN RETURN '⚔️'; -- Fighter
    WHEN xp_amount >= 3000 THEN RETURN '🏃'; -- Athlete
    WHEN xp_amount >= 2000 THEN RETURN '✊'; -- Sparrer
    WHEN xp_amount >= 1000 THEN RETURN '🎯'; -- Trainee
    ELSE RETURN '👤'; -- Recruit (0-999 XP)
  END CASE;
END;
$function$