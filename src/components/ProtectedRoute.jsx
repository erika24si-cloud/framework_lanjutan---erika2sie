import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
    const { user, profile, loading, profileError, signOut } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            </div>
        );
    }

    // Not authenticated -> redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Authenticated but profile fetch failed
    if (!profile && profileError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
                    <div className="text-red-500 text-4xl mb-4">!</div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Profile Not Found</h2>
                    <p className="text-gray-500 text-sm mb-4">{profileError}</p>
                    <p className="text-gray-500 text-sm mb-6">
                        Make sure you have run <strong>supabase-schema.sql</strong> in Supabase Dashboard SQL Editor.
                    </p>
                    <button
                        onClick={() => signOut()}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition"
                    >
                        Sign Out & Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Authenticated but profile not loaded yet
    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            </div>
        );
    }

    // Authenticated but wrong role
    if (allowedRoles && !allowedRoles.includes(profile.role)) {
        if (profile.role === "admin") {
            return <Navigate to="/" replace />;
        }
        if (profile.role === "member") {
            return <Navigate to="/member" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
