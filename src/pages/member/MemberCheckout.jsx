import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchProducts, createCheckout } from "@/services/supabaseAPI";

const tierDiscounts = {
    Bronze: 5,
    Silver: 10,
    Gold: 15,
    Platinum: 20,
};

export default function MemberCheckout() {
    const { profile, refreshProfile } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState({}); // { productId: quantity }
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProducts()
            .then((data) => setProducts(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleQtyChange = (productId, qty) => {
        const q = parseInt(qty) || 0;
        setCart((prev) => {
            const updated = { ...prev };
            if (q <= 0) {
                delete updated[productId];
            } else {
                updated[productId] = q;
            }
            return updated;
        });
    };

    // Calculate cart totals
    const cartItems = Object.entries(cart).map(([productId, quantity]) => {
        const product = products.find((p) => p.id === productId);
        return { product, quantity };
    }).filter((item) => item.product);

    const subtotal = cartItems.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity, 0
    );

    const tier = profile?.tier || "Bronze";
    const discountRate = (tierDiscounts[tier] || 5) / 100;
    const discountAmount = Math.round(subtotal * discountRate);
    const finalPrice = subtotal - discountAmount;
    const pointsEarned = Math.floor(finalPrice / 10000);

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) {
            setError("Your cart is empty");
            return;
        }

        setError("");
        setSubmitting(true);

        try {
            const items = cartItems.map((item) => ({
                product_id: item.product.id,
                quantity: item.quantity,
            }));

            const orderId = await createCheckout(profile.id, items);

            setSuccess({
                orderId,
                subtotal,
                discountAmount,
                finalPrice,
                pointsEarned,
                itemCount: cartItems.length,
            });
            setCart({});
            await refreshProfile();

            // Refresh product list (stock was deducted)
            const refreshed = await fetchProducts();
            setProducts(refreshed);
        } catch (err) {
            setError(err.message || "Failed to place order");
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="p-5">
                <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
                    <div className="text-5xl mb-4">&#10003;</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h2>
                    <p className="text-gray-500 mb-6">
                        Your order #{success.orderId?.slice(0, 8)} has been created successfully.
                    </p>
                    <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2 mb-6">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Items</span>
                            <span className="font-medium">{success.itemCount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-medium">Rp {success.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-red-500">
                            <span>Discount ({tier} {tierDiscounts[tier]}%)</span>
                            <span>- Rp {success.discountAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-hijau border-t pt-2">
                            <span>Final Price</span>
                            <span>Rp {success.finalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-purple-600">
                            <span>Points Earned</span>
                            <span className="font-bold">+{success.pointsEarned} pts</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setSuccess(null)}
                        className="bg-hijau text-white px-6 py-3 rounded-xl hover:opacity-90 font-semibold"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Checkout</h1>
            <p className="text-sm text-gray-400 mb-6">
                Your tier: <b>{tier}</b> — You get <b>{tierDiscounts[tier]}%</b> discount!
            </p>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl mb-4 text-sm">
                    {error}
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Product List */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-800 mb-4">Products</h3>

                    {loading ? (
                        <div className="py-4 text-center text-gray-500">Loading products...</div>
                    ) : products.length === 0 ? (
                        <div className="py-4 text-center text-gray-500">No products available</div>
                    ) : (
                        <div className="space-y-3">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{product.name}</p>
                                        <p className="text-sm text-gray-500">
                                            Rp {Number(product.price).toLocaleString()}
                                            <span className="ml-2 text-xs text-gray-400">
                                                Stock: {product.stock}
                                            </span>
                                        </p>
                                    </div>
                                    <input
                                        type="number"
                                        min="0"
                                        max={product.stock}
                                        value={cart[product.id] || ""}
                                        onChange={(e) => handleQtyChange(product.id, e.target.value)}
                                        className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-center text-sm"
                                        placeholder="Qty"
                                        disabled={product.stock === 0}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Cart Summary */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-4">
                    <h3 className="font-bold text-gray-800 mb-4">Cart Summary</h3>

                    {cartItems.length === 0 ? (
                        <p className="text-sm text-gray-400 py-4 text-center">Cart is empty</p>
                    ) : (
                        <div className="space-y-3 mb-4">
                            {cartItems.map((item) => (
                                <div key={item.product.id} className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        {item.product.name} x{item.quantity}
                                    </span>
                                    <span className="font-medium">
                                        Rp {(Number(item.product.price) * item.quantity).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="border-t pt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-medium">Rp {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-red-500">
                            <span>Discount ({tierDiscounts[tier]}%)</span>
                            <span>- Rp {discountAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-hijau border-t pt-2">
                            <span>Final Price</span>
                            <span>Rp {finalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-purple-600 text-xs">
                            <span>Points you'll earn</span>
                            <span className="font-bold">+{pointsEarned} pts</span>
                        </div>
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={submitting || cartItems.length === 0}
                        className={`w-full mt-6 py-3 rounded-xl font-semibold text-white transition-all ${
                            submitting || cartItems.length === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-hijau hover:opacity-90"
                        }`}
                    >
                        {submitting ? "Processing..." : "Place Order"}
                    </button>
                </div>
            </div>
        </div>
    );
}
