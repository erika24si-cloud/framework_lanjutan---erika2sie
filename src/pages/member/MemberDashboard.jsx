import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchOrdersByMember } from "@/services/supabaseAPI";

const tierThresholds = {
    Bronze: { next: "Silver", points: 1000 },
    Silver: { next: "Gold", points: 5000 },
    Gold: { next: "Platinum", points: 10000 },
    Platinum: { next: null, points: null },
};

const tierDiscounts = {
    Bronze: 5,
    Silver: 10,
    Gold: 15,
    Platinum: 20,
};

const tierColors = {
    Bronze: "bg-orange-100 text-orange-700 border-orange-200",
    Silver: "bg-gray-200 text-gray-700 border-gray-300",
    Gold: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Platinum: "bg-purple-100 text-purple-700 border-purple-200",
};

export default function MemberDashboard() {
    const { profile } = useAuth();
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (profile) {
            fetchOrdersByMember(profile.id)
                .then((data) => setRecentOrders(data.slice(0, 5)))
                .catch((err) => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [profile]);

    const currentTier = profile?.tier || "Bronze";
    const currentPoints = profile?.points || 0;
    const tierInfo = tierThresholds[currentTier];
    const discount = tierDiscounts[currentTier] || 5;

    // Calculate progress to next tier
    let progressPercent = 100;
    let progressLabel = "Max tier reached!";
    if (tierInfo.next) {
        const prevThreshold = currentTier === "Bronze" ? 0
            : currentTier === "Silver" ? 1000
            : currentTier === "Gold" ? 5000 : 0;
        const range = tierInfo.points - prevThreshold;
        const current = currentPoints - prevThreshold;
        progressPercent = Math.min(Math.round((current / range) * 100), 100);
        progressLabel = `${currentPoints} / ${tierInfo.points} points to ${tierInfo.next}`;
    }

    return (
        <div className="p-5">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Member Dashboard</h1>
                    <p className="text-sm text-gray-400">Welcome back, {profile?.full_name || "Member"}!</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className={`flex items-center space-x-5 rounded-2xl shadow-sm border p-5 ${tierColors[currentTier]}`}>
                    <div>
                        <span className="text-2xl font-bold">{currentTier}</span>
                        <p className="text-xs font-medium uppercase tracking-wider mt-1">Current Tier</p>
                    </div>
                </div>

                <div className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="bg-hijau rounded-2xl p-4">
                        <span className="text-2xl font-bold text-white">{currentPoints}</span>
                    </div>
                    <div>
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Points</span>
                    </div>
                </div>

                <div className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="bg-blue-500 rounded-2xl p-4">
                        <span className="text-2xl font-bold text-white">{discount}%</span>
                    </div>
                    <div>
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Your Discount</span>
                    </div>
                </div>
            </div>

            {/* Tier Progress */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Tier Progress</h3>
                <p className="text-sm text-gray-500 mb-3">{progressLabel}</p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className="bg-hijau h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <Link
                    to="/member/checkout"
                    className="bg-hijau text-white rounded-2xl shadow-sm p-6 hover:opacity-90 transition-all"
                >
                    <h3 className="text-lg font-bold">Start Shopping</h3>
                    <p className="text-sm opacity-80">Browse products and place an order</p>
                </Link>
                <Link
                    to="/member/orders"
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:bg-gray-50 transition-all"
                >
                    <h3 className="text-lg font-bold text-gray-800">My Orders</h3>
                    <p className="text-sm text-gray-500">View your order history</p>
                </Link>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
                    <Link to="/member/orders" className="text-hijau font-bold text-sm hover:underline">
                        View All
                    </Link>
                </div>

                {loading ? (
                    <div className="py-4 text-center text-gray-500">Loading...</div>
                ) : recentOrders.length === 0 ? (
                    <div className="py-4 text-center text-gray-500">No orders yet. Start shopping!</div>
                ) : (
                    <div className="space-y-3">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex justify-between items-center p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
                                <div>
                                    <span className="font-medium text-sm text-gray-700">
                                        Order #{order.id.slice(0, 8)}
                                    </span>
                                    <p className="text-xs text-gray-400">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs font-bold capitalize ${
                                        order.status === "completed" ? "text-green-500"
                                        : order.status === "pending" ? "text-yellow-500"
                                        : "text-red-500"
                                    }`}>
                                        {order.status}
                                    </span>
                                    <p className="text-sm font-semibold text-gray-700">
                                        Rp {Number(order.final_price).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
