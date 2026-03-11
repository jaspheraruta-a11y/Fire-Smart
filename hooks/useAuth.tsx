
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
    user: UserProfile | null;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Mock auth state change listener
    useEffect(() => {
        // In a real app, this would be supabase.auth.onAuthStateChange
        const sessionUser = sessionStorage.getItem('user');
        if (sessionUser) {
            setUser(JSON.parse(sessionUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, pass: string) => {
        setLoading(true);
        // Mock login logic
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (email === 'admin@bfp.gov' && pass === 'password123') {
            const mockUser: UserProfile = {
                id: '12345',
                email: 'admin@bfp.gov',
                role: UserRole.BFP_ADMIN,
                fullName: 'Admin Officer',
            };
            sessionStorage.setItem('user', JSON.stringify(mockUser));
            setUser(mockUser);
        } else {
             throw new Error('Invalid credentials');
        }
        setLoading(false);
    };

    const logout = async () => {
        setLoading(true);
        // Mock logout
        await new Promise(resolve => setTimeout(resolve, 500));
        sessionStorage.removeItem('user');
        setUser(null);
        setLoading(false);
    };

    const value = { user, login, logout, loading };

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
