import { supabase } from "@/lib/supabase";

// ============================================================
// PRODUCTS
// ============================================================
export async function fetchProducts() {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
}

export async function fetchProductById(id) {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
    if (error) throw error;
    return data;
}

export async function createProduct(product) {
    const { data, error } = await supabase
        .from("products")
        .insert([product])
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function updateProduct(id, product) {
    const { data, error } = await supabase
        .from("products")
        .update(product)
        .eq("id", id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function deleteProduct(id) {
    const { error } = await supabase.rpc("admin_delete_product", { p_id: id });
    if (error) throw error;
}

// ============================================================
// PROFILES (Customers) — use SECURITY DEFINER RPC to bypass RLS
// ============================================================
export async function fetchProfiles() {
    const { data, error } = await supabase.rpc("admin_get_profiles");
    if (error) throw error;
    return data;
}

export async function fetchMyProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
    if (error) throw error;
    return data;
}

export async function updateProfile(id, updates) {
    const { error } = await supabase.rpc("admin_update_profile", {
        p_id: id,
        p_full_name: updates.full_name,
        p_role: updates.role,
        p_tier: updates.tier,
        p_points: updates.points,
    });
    if (error) throw error;
}

export async function deleteProfile(id) {
    // No direct delete — admin can change role instead
    console.warn("deleteProfile not implemented via RLS. Use admin panel in Supabase.");
}

// ============================================================
// ORDERS — use SECURITY DEFINER RPC for admin operations
// ============================================================
export async function fetchOrders() {
    const { data, error } = await supabase.rpc("admin_get_orders");
    if (error) throw error;
    return data;
}

export async function fetchOrdersByMember(memberId) {
    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("member_id", memberId)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
}

export async function fetchOrderWithItems(orderId) {
    const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(name))")
        .eq("id", orderId)
        .single();
    if (error) throw error;
    return data;
}

export async function updateOrderStatus(id, status) {
    const { error } = await supabase.rpc("admin_update_order_status", {
        p_id: id,
        p_status: status,
    });
    if (error) throw error;
}

// ============================================================
// CHECKOUT (calls the process_checkout RPC function)
// ============================================================
export async function createCheckout(memberId, items) {
    const { data, error } = await supabase.rpc("process_checkout", {
        p_member_id: memberId,
        p_items: items,
    });
    if (error) throw error;
    return data; // returns the order UUID
}

// ============================================================
// DASHBOARD STATS — use SECURITY DEFINER RPC
// ============================================================
export async function fetchDashboardStats() {
    const { data, error } = await supabase.rpc("admin_dashboard_stats");
    if (error) throw error;
    const stats = data?.[0] || {};
    return {
        totalOrders: stats.total_orders || 0,
        totalProducts: stats.total_products || 0,
        totalMembers: stats.total_members || 0,
        totalRevenue: parseFloat(stats.total_revenue) || 0,
    };
}

export async function fetchRecentOrders(limit = 5) {
    const { data, error } = await supabase.rpc("admin_recent_orders", {
        p_limit: limit,
    });
    if (error) throw error;
    return data;
}

export async function fetchLowStockProducts(limit = 5) {
    const { data, error } = await supabase.rpc("admin_low_stock", {
        p_limit: limit,
    });
    if (error) throw error;
    return data;
}
