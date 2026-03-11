
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase } from '../services/supabase';

interface AuthContextType {
    user: UserProfile | null;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUserFromSupabase = async (): Promise<UserProfile | null> => {
        try {
            const {
                data: { user: authUser },
                error,
            } = await supabase.auth.getUser();

            if (error || !authUser) {
                return null;
            }

            const { data: profileRows, error: profileError } = await supabase
                .from('profiles')
                .select('id, full_name, role')
                .eq('id', authUser.id)
                .limit(1);

            if (profileError) {
                console.error('Error loading user profile:', profileError);
            }

            const profile = Array.isArray(profileRows) ? profileRows[0] : null;

            const roleValue = (profile?.role as UserRole) ?? UserRole.ADMIN;

            const userProfile: UserProfile = {
                id: authUser.id,
                email: authUser.email ?? '',
                role: roleValue,
                fullName: profile?.full_name ?? authUser.email ?? 'Administrator',
            };

            sessionStorage.setItem('user', JSON.stringify(userProfile));
            setUser(userProfile);
            return userProfile;
        } catch (err) {
            console.error('Failed to load user from Supabase:', err);
            return null;
        }
    };

    // Mock auth state change listener
    useEffect(() => {
        // Hydrate from session first for snappy UI, then verify with Supabase
        const sessionUser = sessionStorage.getItem('user');
        if (sessionUser) {
            try {
                setUser(JSON.parse(sessionUser));
            } catch {
                sessionStorage.removeItem('user');
            }
        }

        const init = async () => {
            setLoading(true);
            await loadUserFromSupabase();
            setLoading(false);
        };

        void init();
    }, []);

    const login = async (email: string, pass: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password: pass,
            });

            if (error || !data.user) {
                throw new Error(error?.message ?? 'Invalid credentials');
            }

            const profile = await loadUserFromSupabase();

            if (!profile) {
                await supabase.auth.signOut();
                throw new Error('Unable to load user profile.');
            }

            if (profile.role !== UserRole.ADMIN) {
                await supabase.auth.signOut();
                sessionStorage.removeItem('user');
                setUser(null);
                throw new Error('You are not authorized to access this dashboard.');
            }
        } finally {
            setLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        setLoading(true);
        try {
            await supabase.auth.signOut();
        } catch (err) {
            console.error('Error during logout:', err);
        } finally {
            sessionStorage.removeItem('user');
            setUser(null);
            setLoading(false);
        }
    };

    const refreshUser = async () => {
        setLoading(true);
        try {
            await loadUserFromSupabase();
        } finally {
            setLoading(false);
        }
    };

    const value = { user, login, logout, loading, refreshUser };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
