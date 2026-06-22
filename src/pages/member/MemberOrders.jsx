import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchOrdersByMember, fetchOrderWithItems } from "@/services/supabaseAPI";

export default function MemberOrders() {
    const { profile } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [expandedData, setExpandedData] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        if (profile) {
            fetchOrdersByMember(profile.id)
                .then((data) => setOrders(data))
                .catch((err) => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [profile]);

    const handleToggleDetail = async (orderId) => {
        if (expandedId === orderId) {
            setExpandedId(null);
            setExpandedData(null);
            return;
        }

        setExpandedId(orderId);
        setDetailLoading(true);
        try {
            const data = await fetchOrderWithItems(orderId);
            setExpandedData(data);
        } catch (err) {
            console.error(err);
        } finally {
            setDetailLoading(false);
        }
    };

    const statusColor = (status) => {
        switch (status) {
            case "completed": return "bg-green-100 text-green-700";
            case "pending": return "bg-yellow-100 text-yellow-700";
            case "cancelled": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">My Orders</h1>
            <p className="text-sm text-gray-400 mb-6">View your order history</p>

            {loading ? (
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-500">
                    Loading orders...
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-500">
                    You haven't placed any orders yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                        >
                            {/* Order Header */}
                            <div
                                className="p-5 cursor-pointer hover:bg-gray-50 transition-all"
                                onClick={() => handleToggleDetail(order.id)}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">
                                            Order #{order.id.slice(0, 8)}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(order.created_at).toLocaleDateString("id-ID", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${statusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-4 mt-4 text-sm">
                                    <div>
                                        <p className="text-xs text-gray-400">Total</p>
                                        <p className="font-medium text-gray-700">
                                            Rp {Number(order.total_price).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Discount</p>
                                        <p className="font-medium text-red-500">
                                            - Rp {Number(order.discount_amount).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Final Price</p>
                                        <p className="font-bold text-hijau">
                                            Rp {Number(order.final_price).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Points Earned</p>
                                        <p className="font-medium text-purple-600">
                                            +{order.points_earned}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-400 mt-2">
                                    {expandedId === order.id ? "Click to collapse" : "Click to see items"}
                                </p>
                            </div>

                            {/* Order Items (expandable) */}
                            {expandedId === order.id && (
                                <div className="border-t bg-gray-50 p-5">
                                    {detailLoading ? (
                                        <p className="text-sm text-gray-500 text-center py-2">
                                            Loading details...
                                        </p>
                                    ) : expandedData?.order_items ? (
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-4 text-xs font-bold text-gray-500 uppercase tracking-wider pb-2 border-b">
                                                <span className="col-span-2">Product</span>
                                                <span>Qty</span>
                                                <span className="text-right">Subtotal</span>
                                            </div>
                                            {expandedData.order_items.map((item) => (
                                                <div key={item.id} className="grid grid-cols-4 text-sm py-2">
                                                    <span className="col-span-2 text-gray-700">
                                                        {item.products?.name || "Product"}
                                                    </span>
                                                    <span className="text-gray-600">
                                                        {item.quantity}
                                                    </span>
                                                    <span className="text-right text-gray-700 font-medium">
                                                        Rp {(Number(item.price) * item.quantity).toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 text-center py-2">
                                            No items found
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
