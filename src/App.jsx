import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Error400 from "./pages/main/Error400";
import Error401 from "./pages/main/Error401";
import Error403 from "./pages/main/Error403";

const MainLayout = React.lazy(() => import("./layouts/MainLayout"));
const AuthLayout = React.lazy(() => import("./layouts/AuthLayout"));
const MemberLayout = React.lazy(() => import("./layouts/MemberLayout"));

const Dashboard = React.lazy(() => import("./pages/main/Dashboard"));
const Orders = React.lazy(() => import("./pages/main/Orders"));
const Customers = React.lazy(() => import("./pages/main/Customers"));
const Note = React.lazy(() => import("./pages/main/Note"));
const Produk = React.lazy(() => import("./pages/main/Produk"));
const ProductDetail = React.lazy(() => import("./pages/main/ProductDetail"));
const Components = React.lazy(() => import("./pages/main/Components"));
const FiturXyz = React.lazy(() => import("./pages/main/FiturXyz"));
const NotFound = React.lazy(() => import("./pages/main/NotFound"));

const Register = React.lazy(() => import("./pages/auth/Register"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Loading = React.lazy(() => import("./components/Loading"));

const MemberDashboard = React.lazy(() => import("./pages/member/MemberDashboard"));
const MemberCheckout = React.lazy(() => import("./pages/member/MemberCheckout"));
const MemberOrders = React.lazy(() => import("./pages/member/MemberOrders"));

// Redirect authenticated users away from auth pages
function GuestRoute({ children }) {
    const { user, profile, loading, profileError, signOut } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (user && profile) {
        return <Navigate to={profile.role === "admin" ? "/" : "/member"} replace />;
    }

    // User is logged in but profile fetch failed
    if (user && !profile && profileError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
                    <div className="text-red-500 text-4xl mb-4">!</div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Profile Not Found</h2>
                    <p className="text-gray-500 text-sm mb-4">{profileError}</p>
                    <p className="text-gray-500 text-sm mb-6">
                        Make sure you have run <strong>supabase-schema.sql</strong> in Supabase Dashboard SQL Editor, then register again.
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

    // User logged in, waiting for profile fetch
    if (user && !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return children;
}

export default function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                {/* Auth routes (guest only) */}
                <Route element={<GuestRoute><AuthLayout /></GuestRoute>}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot" element={<Forgot />} />
                </Route>

                {/* Admin routes */}
                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/products" element={<Produk />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/components" element={<Components />} />
                        <Route path="/fitur-xyz" element={<FiturXyz />} />
                        <Route path="/notes" element={<Note />} />
                        <Route path="/error-400" element={<Error400 />} />
                        <Route path="/error-401" element={<Error401 />} />
                        <Route path="/error-403" element={<Error403 />} />
                    </Route>
                </Route>

                {/* Member routes */}
                <Route element={<ProtectedRoute allowedRoles={["member"]} />}>
                    <Route element={<MemberLayout />}>
                        <Route path="/member" element={<MemberDashboard />} />
                        <Route path="/member/checkout" element={<MemberCheckout />} />
                        <Route path="/member/orders" element={<MemberOrders />} />
                    </Route>
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
}