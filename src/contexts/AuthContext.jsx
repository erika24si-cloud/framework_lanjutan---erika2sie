import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileError, setProfileError] = useState(null);

    // Fetch the profile row for the current user
    const fetchProfile = async (userId) => {
        setProfileError(null);

        // Small delay to allow trigger to finish creating the profile row
        await new Promise((resolve) => setTimeout(resolve, 500));

        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (error || !data) {
            const msg = error?.message || "Profile row not found in database. Please re-run the SQL schema in Supabase Dashboard.";
            console.error("fetchProfile error:", msg);
            setProfileError(msg);
            return null;
        }
        setProfile(data);
        return data;
    };

    // Re-fetch profile (used after points/tier changes)
    const refreshProfile = async () => {
        if (user) {
            await fetchProfile(user.id);
        }
    };

    // Listen for auth state changes
    useEffect(() => {
        // Get initial session
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                await fetchProfile(session.user.id);
            }
            setLoading(false);
        };
        getSession();

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session?.user) {
                    setUser(session.user);
                    await fetchProfile(session.user.id);
                } else {
                    setUser(null);
                    setProfile(null);
                }
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // Sign in with email and password
    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;

        // Explicitly fetch profile here (don't rely only on onAuthStateChange)
        if (data.user) {
            setUser(data.user);
            await fetchProfile(data.user.id);
        }
        return data;
    };

    // Sign up with email, password, and full name
    const signUp = async (email, password, fullName) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: "member",
                },
            },
        });
        if (error) throw error;
        return data;
    };

    // Sign out
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
        setProfile(null);
        setProfileError(null);
    };

    const value = {
        user,
        profile,
        loading,
        profileError,
        signIn,
        signUp,
        signOut,
        refreshProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
