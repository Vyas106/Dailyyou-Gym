"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ForgotPassword } from "@/components/auth/ForgotPassword";

export default function LoginPage() {
    const [view, setView] = useState<'login' | 'reset'>('login');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    
    const { login, user } = useAuth();
    const router = useRouter();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const success = await login(email, password);
            if (success) {
                toast.success("Welcome back to the gym!");
                router.push("/dashboard");
            } else {
                setError("Invalid email or password.");
                toast.error("Invalid credentials");
            }
        } catch (err: any) {
            console.error(err);
            setError("Something went wrong. Please try again.");
            toast.error("Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    if (user) {
        return null;
    }

    return (
        <div className="flex h-screen w-full bg-black overflow-hidden font-sans">
            {/* Left Panel - Featured Image (50%) */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900 text-white p-12 flex-col justify-between">
                <div className="absolute inset-0 z-0">
                    <Image 
                        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=3840&auto=format&fit=crop" 
                        alt="Gym" 
                        fill 
                        className="object-cover opacity-70"
                        priority
                        quality={100}
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10"></div>

                <div className="relative z-20">
                    <Link href="/">
                        <div className="h-12 w-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 overflow-hidden cursor-pointer hover:bg-white/20 transition-all relative">
                             <Image src="/icon.jpg" alt="DailyYou Gym Logo" fill className="object-cover" />
                        </div>
                    </Link>
                </div>

                <div className="relative z-10 space-y-6 max-w-lg">
                    <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 text-sm font-medium text-white/90">
                        <span className="mr-2 h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
                        Powering 200+ Premium Gyms
                    </div>
                    <blockquote className="space-y-4">
                        <p className="text-3xl font-medium leading-tight tracking-tight">
                            "The best gym management software I've ever used. Simple, sleek, and incredibly powerful."
                        </p>
                        <footer className="pt-4">
                            <div className="inline-flex items-center gap-3 p-2 pr-4 rounded-full bg-white/5 border border-white/10">
                                <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                                        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                                        <line x1="6" y1="1" x2="6" y2="4"></line>
                                        <line x1="10" y1="1" x2="10" y2="4"></line>
                                        <line x1="14" y1="1" x2="14" y2="4"></line>
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">Built For</div>
                                    <div className="text-sm font-semibold text-white">Elite Athletes</div>
                                </div>
                            </div>
                        </footer>
                    </blockquote>
                </div>
            </div>

            {/* Right Panel - Form (50%) */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12 bg-black">
                <div className="w-full max-w-md space-y-8">
                    {view === 'login' ? (
                        <>
                            {/* Header */}
                            <div className="space-y-2 text-center lg:text-left">
                                <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-4 lg:hidden">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                                </Link>
                                <h1 className="text-3xl font-bold tracking-tight text-white">
                                    Welcome back
                                </h1>
                                <p className="text-gray-400">
                                    Enter your credentials to access your gym dashboard.
                                </p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-6">
                                {error && (
                                    <div className="p-3 text-sm text-red-400 bg-red-500/10 rounded-lg border border-red-500/20 flex items-center gap-2">
                                        <span className="block w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium text-gray-200">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="name@example.com"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="pl-10 h-12 border-white/10 bg-white/5 text-white rounded-xl focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:border-orange-500 placeholder:text-gray-600"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="text-sm font-medium text-gray-200">Password</Label>
                                            <button 
                                                type="button"
                                                onClick={() => setView('reset')}
                                                className="text-xs text-orange-500 hover:text-orange-400 font-medium"
                                            >
                                                Forgot password?
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="pl-10 h-12 border-white/10 bg-white/5 text-white rounded-xl focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:border-orange-500 placeholder:text-gray-600 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 z-20"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 bg-white hover:bg-white/90 text-black rounded-xl font-bold transition-all shadow-lg shadow-orange-500/10"
                                >
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign in to Dashboard"}
                                </Button>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-white/10"></span>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-black px-2 text-gray-500 font-medium">Or continue with</span>
                                    </div>
                                </div>

                                <div className="text-center text-sm text-gray-400">
                                    New to DailyYou Gym?{" "}
                                    <Link href="/signup" className="font-bold text-orange-500 hover:text-orange-400">
                                        Create an account
                                    </Link>
                                </div>
                            </form>
                        </>
                    ) : (
                        <ForgotPassword onBack={() => setView('login')} />
                    )}
                </div>
                
                {/* Demo Credentials Footer */}
                <div className="mt-12 text-center text-xs text-gray-500 border border-white/5 p-4 rounded-xl bg-white/[0.02]">
                    <p className="font-semibold text-gray-400 mb-1">Demo Environment</p>
                    <p>Enter any credentials to explore the dashboard</p>
                </div>
            </div>
        </div>
    );
}

