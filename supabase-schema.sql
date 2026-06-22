-- ============================================================
-- SUPABASE SQL DDL SCRIPT
-- ============================================================
-- Run STEP 1 first (cleanup). If it succeeds, run STEP 2+.
-- ============================================================

-- ============================================================
-- STEP 1: CLEANUP
-- ============================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_member_tier(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.process_checkout(UUID, JSONB) CASCADE;
DROP FUNCTION IF EXISTS public.is_admin(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.is_order_owner(UUID, UUID) CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================================
-- STEP 2: TABLES
-- ============================================================

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    points INTEGER NOT NULL DEFAULT 0,
    tier TEXT NOT NULL DEFAULT 'Bronze' CHECK (tier IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    sku TEXT UNIQUE,
    price NUMERIC NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    total_price NUMERIC NOT NULL CHECK (total_price >= 0),
    discount_amount NUMERIC NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
    final_price NUMERIC NOT NULL CHECK (final_price >= 0),
    points_earned INTEGER NOT NULL DEFAULT 0 CHECK (points_earned >= 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    quantity INTEGER NOT NULL CHECK (quantity >= 1),
    price NUMERIC NOT NULL CHECK (price >= 0)
);

CREATE INDEX idx_orders_member_id ON public.orders(member_id);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);

-- ============================================================
-- STEP 3: HELPER FUNCTIONS (SECURITY DEFINER bypasses RLS)
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles WHERE id = p_user_id AND role = 'admin'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_order_owner(p_order_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.orders WHERE id = p_order_id AND member_id = p_user_id
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- STEP 4: ENABLE RLS
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 5: RLS POLICIES
-- IMPORTANT: profiles policies ONLY use auth.uid() = id
-- No self-referential SELECT to avoid infinite recursion
-- Admin write operations use SECURITY DEFINER functions
-- ============================================================

-- PROFILES (simple, no recursion)
CREATE POLICY profiles_select_own ON public.profiles
    FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY profiles_insert_own ON public.profiles
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY profiles_update_own ON public.profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- PRODUCTS (everyone reads, only admins write via API functions)
CREATE POLICY products_select_all ON public.products
    FOR SELECT TO authenticated USING (true);

CREATE POLICY products_insert_authenticated ON public.products
    FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY products_update_authenticated ON public.products
    FOR UPDATE TO authenticated
    USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY products_delete_authenticated ON public.products
    FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- ORDERS
CREATE POLICY orders_select_own ON public.orders
    FOR SELECT TO authenticated USING (
        member_id = auth.uid() OR public.is_admin(auth.uid())
    );

CREATE POLICY orders_insert_own ON public.orders
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = member_id);

CREATE POLICY orders_update_admin ON public.orders
    FOR UPDATE TO authenticated
    USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ORDER ITEMS
CREATE POLICY order_items_select ON public.order_items
    FOR SELECT TO authenticated USING (
        public.is_order_owner(order_id, auth.uid()) OR public.is_admin(auth.uid())
    );

CREATE POLICY order_items_insert ON public.order_items
    FOR INSERT TO authenticated
    WITH CHECK (public.is_order_owner(order_id, auth.uid()));

-- ============================================================
-- STEP 6: TRIGGER (auto-create profile on signup)
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role, tier)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'member'),
        'Bronze'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- STEP 7: ADMIN FUNCTIONS (bypass RLS via SECURITY DEFINER)
-- Use these for admin operations that RLS would block
-- ============================================================

-- Admin: fetch all profiles
CREATE OR REPLACE FUNCTION public.admin_get_profiles()
RETURNS SETOF public.profiles AS $$
    SELECT * FROM public.profiles ORDER BY created_at DESC;
$$ LANGUAGE sql SECURITY DEFINER;

-- Admin: update a profile (role, tier, points, full_name)
CREATE OR REPLACE FUNCTION public.admin_update_profile(
    p_id UUID, p_full_name TEXT, p_role TEXT, p_tier TEXT, p_points INTEGER
)
RETURNS VOID AS $$
    UPDATE public.profiles
    SET full_name = p_full_name, role = p_role, tier = p_tier, points = p_points
    WHERE id = p_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Admin: fetch all orders with member name
CREATE OR REPLACE FUNCTION public.admin_get_orders()
RETURNS TABLE (
    id UUID, member_id UUID, member_name TEXT,
    total_price NUMERIC, discount_amount NUMERIC, final_price NUMERIC,
    points_earned INTEGER, status TEXT, created_at TIMESTAMPTZ
) AS $$
    SELECT o.id, o.member_id, p.full_name,
        o.total_price, o.discount_amount, o.final_price,
        o.points_earned, o.status, o.created_at
    FROM public.orders o
    LEFT JOIN public.profiles p ON p.id = o.member_id
    ORDER BY o.created_at DESC;
$$ LANGUAGE sql SECURITY DEFINER;

-- Admin: update order status
CREATE OR REPLACE FUNCTION public.admin_update_order_status(p_id UUID, p_status TEXT)
RETURNS VOID AS $$
    UPDATE public.orders SET status = p_status WHERE id = p_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Admin: delete product
CREATE OR REPLACE FUNCTION public.admin_delete_product(p_id UUID)
RETURNS VOID AS $$
    DELETE FROM public.products WHERE id = p_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Dashboard stats
CREATE OR REPLACE FUNCTION public.admin_dashboard_stats()
RETURNS TABLE (total_products BIGINT, total_orders BIGINT, total_members BIGINT, total_revenue NUMERIC) AS $$
    SELECT
        (SELECT COUNT(*) FROM public.products) AS total_products,
        (SELECT COUNT(*) FROM public.orders) AS total_orders,
        (SELECT COUNT(*) FROM public.profiles WHERE role = 'member') AS total_members,
        (SELECT COALESCE(SUM(final_price), 0) FROM public.orders WHERE status != 'cancelled') AS total_revenue;
$$ LANGUAGE sql SECURITY DEFINER;

-- Recent orders
CREATE OR REPLACE FUNCTION public.admin_recent_orders(p_limit INTEGER DEFAULT 5)
RETURNS TABLE (
    id UUID, member_name TEXT, final_price NUMERIC, status TEXT, created_at TIMESTAMPTZ
) AS $$
    SELECT o.id, p.full_name, o.final_price, o.status, o.created_at
    FROM public.orders o
    LEFT JOIN public.profiles p ON p.id = o.member_id
    ORDER BY o.created_at DESC LIMIT p_limit;
$$ LANGUAGE sql SECURITY DEFINER;

-- Low stock products
CREATE OR REPLACE FUNCTION public.admin_low_stock(p_limit INTEGER DEFAULT 5)
RETURNS SETOF public.products AS $$
    SELECT * FROM public.products WHERE stock <= 10 ORDER BY stock ASC LIMIT p_limit;
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================================
-- STEP 8: BUSINESS LOGIC FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_member_tier(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
    v_points INTEGER;
    v_new_tier TEXT;
BEGIN
    SELECT points INTO v_points FROM public.profiles WHERE id = p_user_id;
    IF v_points IS NULL THEN RETURN; END IF;
    IF v_points >= 10000 THEN v_new_tier := 'Platinum';
    ELSIF v_points >= 5000 THEN v_new_tier := 'Gold';
    ELSIF v_points >= 1000 THEN v_new_tier := 'Silver';
    ELSE v_new_tier := 'Bronze';
    END IF;
    UPDATE public.profiles SET tier = v_new_tier WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.process_checkout(p_member_id UUID, p_items JSONB)
RETURNS UUID AS $$
DECLARE
    v_order_id UUID;
    v_total NUMERIC := 0;
    v_discount_rate NUMERIC;
    v_discount NUMERIC;
    v_final NUMERIC;
    v_points INTEGER;
    v_tier TEXT;
    v_item JSONB;
    v_product_price NUMERIC;
    v_product_stock INTEGER;
BEGIN
    SELECT tier INTO v_tier FROM public.profiles WHERE id = p_member_id;
    IF v_tier IS NULL THEN RAISE EXCEPTION 'Member profile not found'; END IF;

    CASE v_tier
        WHEN 'Platinum' THEN v_discount_rate := 0.20;
        WHEN 'Gold'     THEN v_discount_rate := 0.15;
        WHEN 'Silver'   THEN v_discount_rate := 0.10;
        ELSE                 v_discount_rate := 0.05;
    END CASE;

    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        SELECT price, stock INTO v_product_price, v_product_stock
        FROM public.products WHERE id = (v_item->>'product_id')::UUID;
        IF NOT FOUND THEN RAISE EXCEPTION 'Product % not found', (v_item->>'product_id'); END IF;
        IF v_product_stock < (v_item->>'quantity')::INTEGER THEN
            RAISE EXCEPTION 'Insufficient stock for product %', (v_item->>'product_id');
        END IF;
        v_total := v_total + (v_product_price * (v_item->>'quantity')::INTEGER);
    END LOOP;

    v_discount := ROUND(v_total * v_discount_rate, 2);
    v_final := v_total - v_discount;
    v_points := FLOOR(v_final / 10000)::INTEGER;

    INSERT INTO public.orders (member_id, total_price, discount_amount, final_price, points_earned, status)
    VALUES (p_member_id, v_total, v_discount, v_final, v_points, 'pending') RETURNING id INTO v_order_id;

    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        SELECT price INTO v_product_price FROM public.products WHERE id = (v_item->>'product_id')::UUID;
        INSERT INTO public.order_items (order_id, product_id, quantity, price)
        VALUES (v_order_id, (v_item->>'product_id')::UUID, (v_item->>'quantity')::INTEGER, v_product_price);
        UPDATE public.products SET stock = stock - (v_item->>'quantity')::INTEGER
        WHERE id = (v_item->>'product_id')::UUID;
    END LOOP;

    UPDATE public.profiles SET points = points + v_points WHERE id = p_member_id;
    PERFORM public.update_member_tier(p_member_id);
    RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- DONE!
-- 1. Register at /register
-- 2. Promote to admin:
--    UPDATE public.profiles SET role = 'admin'
--    WHERE id = (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1);
-- ============================================================
