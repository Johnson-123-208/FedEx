import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null); // 'employee', 'manager', or null
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            // 1. Check LocalStorage (Fastest) for Mock Session or Persisted Supabase Session
            const storedSession = localStorage.getItem('fedex_auth_session');
            if (storedSession) {
                try {
                    const parsed = JSON.parse(storedSession);
                    // Check expiry (e.g., 24 hours) - simplified here
                    if (parsed.user) {
                        console.log("Restoring session from local storage...");
                        setUser(parsed.user);
                        setRole(parsed.role);
                        setLoading(false);
                        return; // Exit early if local session found
                    }
                } catch (e) {
                    console.error("Invalid local session", e);
                    localStorage.removeItem('fedex_auth_session');
                }
            }

            // 2. Check Supabase Session (Real Auth) - Only if no local mock session
            try {
                // Safety timeout: If Supabase doesn't respond in 3s, proceed causing error/timeout
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Auth timeout')), 3000)
                );

                const sessionPromise = supabase.auth.getSession();

                const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]);

                if (session?.user) {
                    setUser(session.user);
                    await fetchUserRole(session.user.id);
                } else {
                    // No session found
                    setUser(null);
                }
            } catch (err) {
                console.warn('Auth check failed or timed out:', err);

                // Final Check: If we failed Supabase but had no local session, we are truly logged out.
                // UNLESS we want to auto-login as guest/demo? No, keep as logged out.
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        // Listen for Supabase changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                setUser(session.user);
                await fetchUserRole(session.user.id);
                // Also update local storage
                localStorage.setItem('fedex_auth_session', JSON.stringify({
                    user: session.user,
                    role: 'pending' // Role typically fetched async, handled by fetchUserRole
                }));
            } else if (!localStorage.getItem('fedex_auth_session')) {
                // Only clear if not using a mock session override
                setUser(null);
                setRole(null);
            }
            // NOTE: We don't necessarily set loading=false here because initializeAuth handles the initial load.
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserRole = async (userId) => {
        try {
            // Add timeout for role fetch
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Role fetch timeout')), 2000)
            );

            const fetchPromise = supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            const { data } = await Promise.race([fetchPromise, timeoutPromise]);

            if (data) {
                setRole(data.role);
                // Update local storage with role
                const currentSession = localStorage.getItem('fedex_auth_session');
                if (currentSession) {
                    const parsed = JSON.parse(currentSession);
                    localStorage.setItem('fedex_auth_session', JSON.stringify({ ...parsed, role: data.role }));
                }
            }
        } catch (error) {
            console.error('Error fetching role:', error);
            // Default to employee if role fetch fails
            setRole('employee');
        }
    };

    // New Helper for Mock Login
    const manualLogin = (mockUser, mockRole) => {
        const sessionData = { user: mockUser, role: mockRole };
        setUser(mockUser);
        setRole(mockRole);
        localStorage.setItem('fedex_auth_session', JSON.stringify(sessionData));
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('fedex_auth_session');
        setUser(null);
        setRole(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
                <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, role, loading, signOut, manualLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
