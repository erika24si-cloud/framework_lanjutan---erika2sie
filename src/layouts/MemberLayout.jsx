import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { MdDashboard, MdShoppingCart, MdReceipt, MdLogout } from "react-icons/md";
import { useAuth } from "@/contexts/AuthContext";

export default function MemberLayout() {
    const { profile, signOut } = useAuth();
    const navigate = useNavigate();

    const menuClass = ({ isActive }) =>
        `flex cursor-pointer items-center rounded-xl p-4 space-x-2
        ${isActive
            ? "bg-green-200 text-hijau font-extrabold"
            : "text-gray-600 hover:text-hijau hover:bg-green-200 hover:font-extrabold"
        }`;

    const tierColors = {
        Bronze: "bg-orange-100 text-orange-700",
        Silver: "bg-gray-200 text-gray-700",
        Gold: "bg-yellow-100 text-yellow-700",
        Platinum: "bg-purple-100 text-purple-700",
    };

    const handleLogout = async () => {
        try {
            await signOut();
            navigate("/login");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex">
            {/* Sidebar */}
            <div className="flex min-h-screen w-80 flex-col bg-white p-10 shadow-lg">
                <div className="flex flex-col">
                    <span className="font-poppins text-[48px] font-bold text-gray-900 leading-tight">
                        Sedap <b className="text-hijau">.</b>
                    </span>
                    <span className="text-gray-400 text-sm">Member Portal</span>
                </div>

                {/* Member Info */}
                <div className="mt-8 bg-gray-50 rounded-2xl p-4">
                    <p className="font-bold text-gray-800 text-sm truncate">
                        {profile?.full_name || "Member"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${tierColors[profile?.tier] || tierColors.Bronze}`}>
                            {profile?.tier || "Bronze"}
                        </span>
                        <span className="text-xs text-gray-500">
                            {profile?.points || 0} pts
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-8">
                    <ul className="space-y-3">
                        <li>
                            <NavLink to="/member" end className={menuClass}>
                                <MdDashboard className="mr-4 text-xl" />
                                <span>Dashboard</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/member/checkout" className={menuClass}>
                                <MdShoppingCart className="mr-4 text-xl" />
                                <span>Checkout</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/member/orders" className={menuClass}>
                                <MdReceipt className="mr-4 text-xl" />
                                <span>My Orders</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>

                {/* Logout */}
                <div className="mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex w-full cursor-pointer items-center rounded-xl p-4 space-x-2 text-red-500 hover:bg-red-50 hover:font-extrabold transition-all"
                    >
                        <MdLogout className="mr-4 text-xl" />
                        <span>Logout</span>
                    </button>

                    <p className="font-light text-gray-400 text-sm mt-4">
                        &copy; 2025 Sedap Restaurant
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4">
                <Outlet />
            </div>
        </div>
    );
}
