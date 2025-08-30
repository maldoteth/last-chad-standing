-- Update tier icon function to use "King Chad" instead of "God Mode"
CREATE OR REPLACE FUNCTION public.get_tier_icon(xp_amount integer)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  CASE 
    WHEN xp_amount >= 50000 THEN RETURN '👑'; -- King Chad
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
$function$;