'use client';

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
    Users,
    BarChart3,
    Clock,
    Zap,
    Smartphone,
    ArrowRight,
    Play,
    CheckCircle2,
    Activity
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black text-white"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                onAnimationComplete={() => setTimeout(onComplete, 800)}
                className="text-center"
            >
                <div className="flex flex-col items-center gap-6">
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-[5px] overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.3)] animate-pulse">
                        <Image
                            src="/icon.png"
                            alt="DailyYou Logo"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div>
                        <div className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
                            Welcome to <span className="text-orange-500">DailyYou</span>
                        </div>
                        <p className="text-sm text-white/40 mt-3 tracking-[0.3em] uppercase font-bold">
                            Operating System for Gyms
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default function Home() {
    const { user } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);

    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }

        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [user, router]);

    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "DailyYou Gym",
        "operatingSystem": "Web",
        "applicationCategory": "HealthApplication, BusinessApplication",
        "description": "Premium gym management system with real-time analytics and member engagement tools.",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "245"
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="min-h-screen bg-[#000000] text-white selection:bg-orange-500/30 selection:text-orange-500 overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <AnimatePresence mode="wait">
                {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
            </AnimatePresence>

            {/* Navbar (Dashboard Style Dock) */}
            {!isLoading && <Navbar />}

            <div className={`relative transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                {/* Static Header (Top only) */}
                {!isLoading && (
                    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-100 py-8'}`}>
                        <div className="container mx-auto px-6 flex justify-between items-center">
                            <div className="flex items-center gap-2 group cursor-pointer">
                                <div className="w-10 h-10 relative rounded-[5px] overflow-hidden shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                                    <Image src="/icon.png" alt="DailyYou" fill className="object-cover" />
                                </div>
                                <span className="text-2xl font-black tracking-tighter">
                                    DailyYou<span className="text-orange-500">Gym</span>
                                </span>
                            </div>

                            <div className="flex items-center gap-4">
                                <Link href="/login">
                                    <button className="px-6 py-2.5 text-sm font-bold text-white hover:text-orange-500 transition-colors uppercase tracking-widest">
                                        Sign In
                                    </button>
                                </Link>
                                <Link href="/signup">
                                    <button className="px-6 py-2.5 bg-white text-black text-sm font-black rounded-full hover:bg-orange-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl uppercase tracking-widest">
                                        Join
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </nav>
                )}

                {/* Hero Section */}
                <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-[#000000] z-10" />
                        <motion.div style={{ opacity, scale }} className="w-full h-full relative">
                            <Image 
                                src="/hero-bg.png" 
                                alt="Luxury Gym" 
                                fill 
                                className="object-cover grayscale-[0.2]"
                                priority 
                            />
                        </motion.div>
                    </div>

                    <div className="container relative z-20 mx-auto px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 1.0 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest mb-8">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                </span>
                                Future of Gym Management
                            </div>

                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.85] uppercase">
                                Elevate Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-400 to-white animate-gradient">Standard.</span>
                            </h1>

                            <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 mb-12 font-medium leading-relaxed">
                                A high-performance operating system for modern gyms. Seamlessly connect trainers, members, and data in one cinematic ecosystem.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Link href="/signup">
                                    <button className="group relative px-10 py-5 bg-orange-500 text-black font-black text-lg rounded-2xl hover:bg-orange-600 transition-all flex items-center gap-3 overflow-hidden text-center">
                                        <div className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
                                        Get Started Free
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                                <button className="px-10 py-5 bg-white/5 border border-white/10 backdrop-blur-md text-white font-bold text-lg rounded-2xl hover:bg-white/10 transition-all flex items-center gap-3 uppercase tracking-tighter">
                                    <Play className="w-5 h-5 fill-current" />
                                    Watch Demo
                                </button>
                            </div>
                        </motion.div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent z-30 pointer-events-none" />
                </section>

                {/* Feature Mockup Section */}
                <section id="analytics" className="py-32 relative">
                    <div className="container mx-auto px-6">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-white opacity-20 blur-3xl group-hover:opacity-30 transition duration-1000"></div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1 }}
                                className="relative bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl"
                            >
                                <div className="p-4 border-b border-white/5 bg-black/40 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                    </div>
                                    <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Dashboard Preview</div>
                                    <div className="w-8 h-8 rounded-lg bg-white/5" />
                                </div>
                                <div className="relative w-full aspect-[16/9]">
                                    <Image 
                                        src="/dash-mock.png" 
                                        alt="Dashboard Preview" 
                                        fill 
                                        className="object-contain opacity-90 group-hover:opacity-100 transition-opacity" 
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Core Features Bento Grid */}
                <section id="features" className="py-32 bg-[#050505]">
                    <div className="container mx-auto px-6">
                        <div className="mb-24 text-center">
                            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase">ENGINEERED FOR EXCELLENCE</h2>
                            <p className="text-white/50 max-w-xl mx-auto uppercase tracking-widest text-sm font-bold">Everything you need to scale your fitness business.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 group p-10 rounded-[2rem] bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 hover:border-orange-500/30 transition-all">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-orange-500/10 transition-all">
                                    <Users className="w-7 h-7 text-orange-500" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4 uppercase tracking-tighter">Live Member Insights</h3>
                                <p className="text-white/40 leading-relaxed mb-8 max-w-md font-medium">Track attendance, membership status, and performance metrics in real-time. Know exactly who is on your floor at any moment.</p>
                                <div className="flex gap-4">
                                    <div className="px-4 py-2 rounded-xl bg-orange-500/5 border border-orange-500/10 text-[10px] font-bold text-orange-400 uppercase tracking-widest">Analytics Ready</div>
                                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest">Automated OTP</div>
                                </div>
                            </div>

                            <div className="group p-10 rounded-[2rem] bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 hover:border-orange-500/30 transition-all">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-orange-500/10 transition-all">
                                    <Clock className="w-7 h-7 text-orange-500" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4 uppercase tracking-tighter">24/7 Control</h3>
                                <p className="text-white/40 leading-relaxed font-medium">Manage staff shifts, class schedules, and opening hours with an intuitive visual calendar built for speed.</p>
                            </div>

                            <div className="group p-10 rounded-[2rem] bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 hover:border-orange-500/30 transition-all">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-orange-500/10 transition-all">
                                    <Zap className="w-7 h-7 text-orange-500" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4 uppercase tracking-tighter">Plan Architect</h3>
                                <p className="text-white/40 leading-relaxed font-medium">Build premium workout plans with a massive library of 100+ exercises. Assign directly to members\' apps instantly.</p>
                            </div>

                            <div className="md:col-span-2 group p-10 rounded-[2rem] bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 hover:border-orange-500/30 transition-all flex flex-col md:flex-row gap-10 items-center">
                                <div className="flex-1">
                                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-orange-500/10 transition-all">
                                        <BarChart3 className="w-7 h-7 text-orange-500" />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4 uppercase tracking-tighter">Revenue Engine</h3>
                                    <p className="text-white/40 leading-relaxed font-medium">Advanced financial reporting. Track subscription renewals, merchandise sales, and PT bookings with military precision.</p>
                                </div>
                                <div className="w-full md:w-1/3 bg-black/40 border border-white/5 p-6 rounded-2xl">
                                    <div className="space-y-4">
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full w-[80%] bg-orange-500" />
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full w-[60%] bg-orange-400" />
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full w-[90%] bg-white/20" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mobile App Sync */}
                <section id="mobile" className="py-32 relative overflow-hidden">
                    <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
                                Unified Ecosystem
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter uppercase">MEMBERS SYNC <br />IN REAL-TIME.</h2>
                            <p className="text-xl text-white/50 mb-10 leading-relaxed max-w-xl font-medium">
                                Our seamless bridge connects your dashboard to the <span className="text-white font-bold underline decoration-orange-500 underline-offset-4">DailyYou Consumer App</span>. Updates to plans or notifications reflect instantly on your members\' devices.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "In-app workout logging for members",
                                    "Direct push notifications for reminders",
                                    "One-click QR gym check-ins",
                                    "Progress tracking and bio-data syncing"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-white/70 font-bold uppercase tracking-tight text-sm">
                                        <CheckCircle2 className="w-6 h-6 text-orange-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1 relative">
                            <div className="absolute inset-0 bg-blue-500/20 blur-[120px] rounded-full animate-pulse" />
                            <motion.div initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} className="relative flex justify-center">
                                <div className="w-[300px] aspect-[9/19] bg-white/5 border-[8px] border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative text-center">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-zinc-800 rounded-b-2xl z-10" />
                                    <div className="w-full h-full p-6 flex flex-col justify-center gap-4">
                                        <div className="w-full h-32 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
                                            <Smartphone className="w-12 h-12 text-orange-400" />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="h-3 w-[60%] bg-white/20 rounded-full mx-auto" />
                                            <div className="h-3 w-full bg-white/10 rounded-full" />
                                            <div className="h-3 w-full bg-white/10 rounded-full" />
                                        </div>
                                        <div className="mt-8 p-4 bg-orange-500 rounded-xl text-black font-black text-center text-xs">
                                            CONNECTED
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Download App Section */}
                <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#050505] to-[#000000]">
                    <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
                    <div className="container mx-auto px-6">
                        <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 md:p-16 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                                <div className="flex-1 text-center lg:text-left">
                                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-black uppercase tracking-[0.2em] mb-8">
                                        <Smartphone className="w-4 h-4" />
                                        Mobile Experience
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase leading-[0.9]">
                                        One Centralized Platform <br />
                                        <span className="text-orange-500">To Track Your Health.</span>
                                    </h2>
                                    <p className="text-xl text-white/50 mb-10 max-w-xl font-medium leading-relaxed">
                                        Download the DailyYou app to seamlessly sync your gym workouts, track vital biometrics, and manage your nutrition—all in one high-performance ecosystem.
                                    </p>
                                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                        <a href="https://play.google.com/store/apps/details?id=com.vishalvyas.dev778.dailyyou" target="_blank" rel="noopener noreferrer" className="group relative flex items-center gap-4 bg-white text-black px-8 py-4 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                            <div className="w-8 h-8 flex items-center justify-center">
                                                <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                                                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L18.66,14.05C20.44,13.01 20.44,10.99 18.66,9.95L16.81,8.88L14.4,11.29L16.81,15.12M4.69,2.42L15.3,8.55L12.78,11.07L4.69,2.42M12.78,12.93L15.3,15.45L4.69,21.58L12.78,12.93Z" />
                                                </svg>
                                            </div>
                                            <div className="text-left">
                                                <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 leading-none">Get it on</div>
                                                <div className="text-xl leading-none mt-1">Google Play</div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                <div className="flex-1 relative w-full max-w-sm">
                                    <div className="absolute inset-0 bg-orange-500/20 blur-[80px] rounded-full animate-pulse" />
                                    <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="relative">
                                        <div className="aspect-[9/18] bg-zinc-900 border-[8px] border-zinc-800 rounded-[3rem] p-4 shadow-2xl overflow-hidden">
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-zinc-800 rounded-b-2xl z-10" />
                                            <div className="w-full h-full bg-black rounded-2xl overflow-hidden relative">
                                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent" />
                                                <div className="p-6 h-full flex flex-col justify-end">
                                                    <div className="w-12 h-12 relative rounded-xl overflow-hidden mb-4">
                                                        <Image src="/icon.png" alt="Logo" fill className="object-cover" />
                                                    </div>
                                                    <div className="h-2 w-20 bg-orange-500 rounded-full mb-2" />
                                                    <div className="h-2 w-full bg-white/10 rounded-full mb-1" />
                                                    <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute -right-8 top-1/4 bg-zinc-900 border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl animate-bounce-slow">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                                    <Activity className="w-4 h-4 text-orange-500" />
                                                </div>
                                                <div>
                                                    <div className="text-[8px] font-bold text-white/40 uppercase">Daily Progress</div>
                                                    <div className="text-sm font-black text-white">92% COMPLETED</div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer Section */}
                {!isLoading && <Footer />}
            </div>

            <style jsx global>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 4s ease-in-out infinite;
                }
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    background-size: 200% auto;
                    animation: gradient 5s linear infinite;
                }
            `}</style>
        </div>
    );
}
