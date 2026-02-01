-- Atomic deduction with row locking
CREATE OR REPLACE FUNCTION public.deduct_coins_atomic(
    p_user_id UUID, p_amount BIGINT, p_xp_gain BIGINT DEFAULT 0
) RETURNS TABLE(new_coins BIGINT, new_xp BIGINT) AS $$
DECLARE v_coins BIGINT; v_xp BIGINT;
BEGIN
    SELECT coins, xp INTO v_coins, v_xp FROM public."Users" WHERE id = p_user_id FOR UPDATE;
    IF v_coins IS NULL THEN RAISE EXCEPTION 'User not found'; END IF;
    IF v_coins < p_amount THEN RAISE EXCEPTION 'Insufficient coins'; END IF;
    UPDATE public."Users" SET coins = v_coins - p_amount, xp = COALESCE(v_xp,0) + p_xp_gain WHERE id = p_user_id;
    new_coins := v_coins - p_amount; new_xp := COALESCE(v_xp,0) + p_xp_gain;
    RETURN NEXT;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atomic credit with row locking
CREATE OR REPLACE FUNCTION public.credit_coins_atomic(
    p_user_id UUID, p_amount BIGINT, p_xp_gain BIGINT DEFAULT 0
) RETURNS TABLE(new_coins BIGINT, new_xp BIGINT) AS $$
DECLARE v_coins BIGINT; v_xp BIGINT;
BEGIN
    SELECT coins, xp INTO v_coins, v_xp FROM public."Users" WHERE id = p_user_id FOR UPDATE;
    IF v_coins IS NULL THEN RAISE EXCEPTION 'User not found'; END IF;
    UPDATE public."Users" SET coins = COALESCE(v_coins,0) + p_amount, xp = COALESCE(v_xp,0) + p_xp_gain WHERE id = p_user_id;
    new_coins := COALESCE(v_coins,0) + p_amount; new_xp := COALESCE(v_xp,0) + p_xp_gain;
    RETURN NEXT;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;
