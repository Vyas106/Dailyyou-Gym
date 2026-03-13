"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Building2, Phone, MapPin, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const WORKING_DAYS_OPTIONS = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

export default function CreateGymPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        contactNumber: "",
        logo: "",
    });
    const [workingDays, setWorkingDays] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Protect route
    useEffect(() => {
        if (!user) {
            router.push("/login");
        } else if (user.gymId) {
            router.push("/dashboard");
        }
    }, [user, router]);

    const toggleDay = (day: string) => {
        setWorkingDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.address || !formData.contactNumber || workingDays.length === 0) {
            setError("Please fill in all required fields and select working days");
            return;
        }

        setIsLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("gym_auth_token");
            const payload = { ...formData, workingDays };

            const res = await fetch("/api/gyms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Gym setup completed successfully!");
                // Update user in localStorage with gymId if needed
                const storedUser = localStorage.getItem("gym_user");
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    userData.gymId = data.gym.id;
                    localStorage.setItem("gym_user", JSON.stringify(userData));
                }
                window.location.href = "/dashboard";
            } else {
                if (data.message?.includes("already owns or belongs to a gym")) {
                    toast.info("You already have a gym dashboard.");
                    window.location.href = "/dashboard";
                } else {
                    setError(data.message || "Failed to create gym. Please try again.");
                }
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!user || user.gymId) return null;

    return (
        <div className="flex h-screen w-full bg-black overflow-hidden font-sans">
            {/* Left Panel - Premium Imagery (50%) */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900 text-white p-12 flex-col justify-between">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto=format&fit=crop')] bg-cover bg-center opacity-60"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90"></div>

                <div className="relative z-10">
                    <Link href="/">
                        <div className="h-12 w-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 overflow-hidden cursor-pointer hover:bg-white/20 transition-all">
                            <img src="/icon.jpg" alt="DailyYou Gym Logo" className="h-full w-full object-cover" />
                        </div>
                    </Link>
                </div>

                <div className="relative z-10 space-y-6 max-w-lg">
                    <div className="inline-flex items-center rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-500/20 px-3 py-1 text-sm font-medium text-blue-400">
                        <span className="mr-2 h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Next Step: Dashboard Setup
                    </div>
                    <blockquote className="space-y-4">
                        <p className="text-3xl font-medium leading-tight tracking-tight">
                            "Setting up your digital headquarters is the first step toward scaling your fitness brand."
                        </p>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <CheckCircle2 className="h-4 w-4 text-blue-500" /> Professional Presence
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <CheckCircle2 className="h-4 w-4 text-blue-500" /> Operational Efficiency
                            </div>
                        </div>
                    </blockquote>
                </div>
            </div>

            {/* Right Panel - Setup Form (50%) */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12 bg-black overflow-y-auto">
                <div className="w-full max-w-md ">
                    {/* Header */}
                    <div className="space-y-2 text-center lg:text-left">
                        <Link href="/login" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-4 lg:hidden">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                        </Link>
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/20 text-blue-500 mb-2">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Setup Your Gym
                        </h1>
                        <p className="text-gray-400">
                            Tell us about your fitness center to get started.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 text-sm text-red-400 bg-red-500/10 rounded-lg border border-red-500/20 flex items-center gap-2">
                                <span className="block w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-gray-400">Gym Name</Label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-blue-500 transition-colors z-10" />
                                        <Input
                                            id="name"
                                            placeholder="e.g. Iron Paradise"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="pl-10 h-12 border-white/10 bg-white/5 text-white rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 placeholder:text-gray-500 hover:border-white/20 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contactNumber" className="text-xs font-semibold uppercase tracking-wider text-gray-400">Contact Number</Label>
                                    <div className="relative group">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-blue-500 transition-colors z-10" />
                                        <Input
                                            id="contactNumber"
                                            placeholder="+91 98765 43210"
                                            required
                                            value={formData.contactNumber}
                                            onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                                            className="pl-10 h-12 border-white/10 bg-white/5 text-white rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 placeholder:text-gray-500 hover:border-white/20 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-xs font-semibold uppercase tracking-wider text-gray-400">Business Address</Label>
                                <div className="relative group">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-blue-500 transition-colors z-10" />
                                    <Input
                                        id="address"
                                        placeholder="123 Fitness St, Gym City"
                                        required
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        className="pl-10 h-12 border-white/10 bg-white/5 text-white rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 placeholder:text-gray-500 hover:border-white/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="logo" className="text-xs font-semibold uppercase tracking-wider text-gray-400">Logo Asset URL (Optional)</Label>
                                <div className="relative group">
                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-blue-500 transition-colors z-10" />
                                    <Input
                                        id="logo"
                                        placeholder="https://example.com/logo.png"
                                        value={formData.logo}
                                        onChange={e => setFormData({ ...formData, logo: e.target.value })}
                                        className="pl-10 h-12 border-white/10 bg-white/5 text-white rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 placeholder:text-gray-500 hover:border-white/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Operating Schedule</Label>
                                <div className="flex flex-wrap gap-2">
                                    {WORKING_DAYS_OPTIONS.map(day => {
                                        const isSelected = workingDays.includes(day);
                                        return (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => toggleDay(day)}
                                                className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${isSelected
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.2)]'
                                                    : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:bg-white/10'
                                                    }`}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-white hover:bg-white/90 text-black rounded-xl font-bold transition-all mt-4 text-sm uppercase tracking-widest"
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Complete Setup"}
                        </Button>

                        <div className="text-center text-xs text-gray-500 mt-2 pt-2 border-t border-white/5">
                            Need help? <Link href="#" className="font-bold text-white hover:text-blue-400 transition-colors">Contact Support</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
