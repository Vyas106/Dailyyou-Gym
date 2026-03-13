'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
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
    // Skip the next onAuthStateChanged profile fetch (used during signup to avoid race condition)
    const skipNextAuthCheck = useRef(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // During signup, skip this check — signup() sets user directly
                if (skipNextAuthCheck.current) {
                    skipNextAuthCheck.current = false;
                    setIsLoading(false);
                    return;
                }

                try {
                    const token = await firebaseUser.getIdToken();
                    const res = await fetch('/api/auth/me', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (res.ok) {
                        const data = await res.json();
                        // Map userId from API to id for frontend consistency
                        setUser({
                            id: data.user.userId || data.user.id,
                            name: data.user.name,
                            email: data.user.email,
                            gymId: data.user.gymId,
                            role: data.user.role,
                            token
                        });
                        localStorage.setItem('gym_auth_token', token);
                    } else if (res.status === 404) {
                        // Profile not found — user exists in Firebase Auth but not in Firestore.
                        // This can happen if signup was interrupted or user was created externally.
                        console.warn('User profile not found in database. Redirecting to create profile.');
                        // Set minimal user so the app can redirect to gym creation or setup
                        setUser({
                            id: firebaseUser.uid,
                            name: firebaseUser.displayName || '',
                            email: firebaseUser.email || '',
                            token
                        });
                        localStorage.setItem('gym_auth_token', token);
                    } else {
                        console.error('Failed to fetch user profile, status:', res.status);
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
            // Tell onAuthStateChanged to skip the next trigger (avoid race condition)
            skipNextAuthCheck.current = true;

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
                // Set user directly from the register response — no race condition
                setUser({
                    id: data.user.userId || userCredential.user.uid,
                    name: data.user.name || name,
                    email: data.user.email || email,
                    gymId: data.user.gymId,
                    role: data.user.role,
                    token
                });
                localStorage.setItem('gym_auth_token', token);
                return { success: true };
            } else {
                console.error("Failed to create profile");
                skipNextAuthCheck.current = false;
                await userCredential.user.delete();
                return { success: false, error: "Failed to create user profile" };
            }
        } catch (error: any) {
            console.error("Signup error", error);
            skipNextAuthCheck.current = false;
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
