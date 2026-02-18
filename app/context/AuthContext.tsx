'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../lib/firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser
} from 'firebase/auth';

interface User {
    id: string;
    name: string;
    email: string;
    gymId?: string;
    token?: string;
    role?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    isLoading: boolean;
    createGym: (data: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const token = await firebaseUser.getIdToken();
                    // Fetch user profile from our API
                    const res = await fetch('/api/auth/me', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (res.ok) {
                        const data = await res.json();
                        setUser({ ...data.user, token });
                        localStorage.setItem('gym_auth_token', token);
                    } else {
                        // Profile might not exist yet if just signed up (handled in signup)
                        // Or error fetching.
                        console.error('Failed to fetch user profile');
                        // Don't sign out automatically here, maybe retry or let UI handle?
                        // For now, minimal handling.
                    }
                } catch (error) {
                    console.error('Error fetching user profile', error);
                }
            } else {
                setUser(null);
                localStorage.removeItem('gym_auth_token');
                localStorage.removeItem('gym_user');
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // onAuthStateChanged will handle setting user state
            return true;
        } catch (error) {
            console.error("Login error", error);
            return false;
        }
    };

    const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();

            // Create Profile in Firestore via API
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, email })
            });

            if (res.ok) {
                const data = await res.json();
                // We could set user here, but onAuthStateChanged will also trigger
                // However, onAuthStateChanged might fire before profile is created.
                // It's safer to wait for profile creation.
                // But onAuthStateChanged fires immediately on createUser...
                // So the first fetch api/auth/me might fail (404).

                // Let's manually set user to ensure immediate feedback?
                // actually, api/auth/me checks DB. If DB write is slow, it might fail.
                // But await fetch('/api/auth/register') ensures DB write is done (mostly).
                return { success: true };
            } else {
                console.error("Failed to create profile");
                // Cleanup auth user?
                await userCredential.user.delete();
                return { success: false, error: "Failed to create user profile" };
            }
        } catch (error: any) {
            console.error("Signup error", error);
            let errorMessage = "An error occurred during signup.";
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "This email is already in use.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Password should be at least 6 characters.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email address.";
            }
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            router.push('/');
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    const createGym = async (gymData: any): Promise<boolean> => {
        // Placeholder
        return true;
    }

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isLoading, createGym }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
