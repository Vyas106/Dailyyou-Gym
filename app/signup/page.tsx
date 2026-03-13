"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, Mail, Lock, User, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    
    const { signup, user } = useAuth();
    const router = useRouter();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    const getPasswordStrength = (pass: string) => {
        if (pass.length === 0) return { strength: 0, label: '', color: '' };
        if (pass.length < 6) return { strength: 33, label: 'Weak', color: 'bg-red-500' };
        if (pass.length < 10) return { strength: 66, label: 'Medium', color: 'bg-yellow-500' };
        return { strength: 100, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            setIsLoading(false);
            return;
        }

        try {
            const result = await signup(formData.name, formData.email, formData.password);
            if (result.success) {
                toast.success("Account created! Welcome to the squad.");
                router.push("/dashboard");
            } else {
                setError(result.error || "Failed to create account.");
                toast.error("Registration failed");
            }
        } catch (err: any) {
            console.error(err);
            setError("Something went wrong. Please try again.");
            toast.error("Signup failed");
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
                        src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop" 
                        alt="Gym" 
                        fill 
                        className="object-cover opacity-60"
                        priority
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
                        <span className="mr-2 h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        Join 10,000+ Athletes Worldwide
                    </div>
                    <blockquote className="space-y-4">
                        <p className="text-3xl font-medium leading-tight tracking-tight">
                            "Transform your gym operations and member experience with our state-of-the-art dashboard."
                        </p>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <CheckCircle2 className="h-4 w-4 text-green-500" /> Member Management
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <CheckCircle2 className="h-4 w-4 text-green-500" /> Automated Billing
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <CheckCircle2 className="h-4 w-4 text-green-500" /> Growth Analytics
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <CheckCircle2 className="h-4 w-4 text-green-500" /> Mobile App Access
                            </div>
                        </div>
                    </blockquote>
                </div>
            </div>

            {/* Right Panel - Form (50%) */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12 bg-black overflow-y-auto">
                <div className="w-full max-w-md space-y-8 py-8">
                    {/* Header */}
                    <div className="space-y-2 text-center lg:text-left">
                        <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-4 lg:hidden">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Create an account
                        </h1>
                        <p className="text-gray-400">
                            Start your 14-day free trial. No credit card required.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 text-sm text-red-400 bg-red-500/10 rounded-lg border border-red-500/20 flex items-center gap-2">
                                <span className="block w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium text-gray-200">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="pl-10 h-11 border-white/10 bg-white/5 text-white rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 placeholder:text-gray-600"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-200">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="pl-10 h-11 border-white/10 bg-white/5 text-white rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 placeholder:text-gray-600"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-200">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min. 6 characters"
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="pl-10 h-11 border-white/10 bg-white/5 text-white rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 placeholder:text-gray-600 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 z-20"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {formData.password && (
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold">
                                            <span className="text-gray-500">Security</span>
                                            <span className={passwordStrength.color.replace('bg-', 'text-')}>
                                                {passwordStrength.label}
                                            </span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${passwordStrength.color} transition-all duration-500`} 
                                                style={{ width: `${passwordStrength.strength}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-200">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Repeat password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="pl-10 h-11 border-white/10 bg-white/5 text-white rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 placeholder:text-gray-600"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 bg-white hover:bg-white/90 text-black rounded-xl font-bold transition-all mt-2"
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create free account"}
                        </Button>

                        <p className="text-[10px] text-center text-gray-500 mt-4 leading-relaxed">
                            By clicking "Create free account", you agree to our{" "}
                            <Link href="#" className="underline hover:text-gray-300">Terms of Service</Link> and{" "}
                            <Link href="#" className="underline hover:text-gray-300">Privacy Policy</Link>.
                        </p>

                        <div className="text-center text-sm text-gray-400 mt-6 pt-6 border-t border-white/5">
                            Already using DailyYou?{" "}
                            <Link href="/login" className="font-bold text-white hover:text-blue-500 transition-colors">
                                Log in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

