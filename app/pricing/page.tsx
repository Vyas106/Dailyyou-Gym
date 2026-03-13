'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Check, 
    Zap, 
    Star, 
    ArrowRight, 
    ShieldCheck, 
    Infinity as InfinityIcon, 
    TrendingUp,
    Sparkles
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                onAnimationComplete={() => setTimeout(onComplete, 1500)}
                className="text-center"
            >
                <div className="flex flex-col items-center gap-6">
                    <div className="w-20 h-20 rounded-[5px] overflow-hidden shadow-[0_0_40px_rgba(249,115,22,0.4)] animate-pulse">
                        <img src="/icon.png" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-2xl font-black tracking-widest uppercase">Pricing Plans</h2>
                </div>
            </motion.div>
        </motion.div>
    );
};

const PricingCard = ({ 
    plan, 
    price, 
    perMonth, 
    savings, 
    popular, 
    features, 
    delay 
}: { 
    plan: string, 
    price: string, 
    perMonth: string, 
    savings?: string, 
    popular?: boolean, 
    features: string[],
    delay: number
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            className={`relative group p-8 rounded-[2.5rem] border ${popular ? 'bg-gradient-to-b from-white/[0.08] to-white/[0.02] border-orange-500/50 shadow-[0_0_80px_rgba(249,115,22,0.15)]' : 'bg-white/[0.03] border-white/10 hover:border-white/20'} transition-all duration-500`}
        >
            {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-orange-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                    <Star className="w-3 h-3 fill-current" />
                    Most Recommended
                </div>
            )}

            <div className="mb-8">
                <h3 className="text-xl font-bold text-white/60 mb-2 uppercase tracking-tighter">{plan}</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white tracking-tighter">{price}</span>
                    {perMonth !== price && <span className="text-white/40 font-bold">Total</span>}
                </div>
                <div className="mt-2 text-orange-500 font-bold h-6">
                    {savings && <span className="text-xs uppercase tracking-widest">SAVE {savings}</span>}
                </div>
            </div>

            <div className="py-6 border-y border-white/5 space-y-4 mb-8">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-white/40 font-medium">Monthly Effective</span>
                    <span className="text-lg font-bold text-white">{perMonth} <span className="text-[10px] text-white/40">/ mo</span></span>
                </div>
            </div>

            <ul className="space-y-4 mb-10">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white/70 font-medium">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${popular ? 'bg-orange-500/20 text-orange-500' : 'bg-white/10 text-white/40'}`}>
                            <Check className="w-3 h-3" />
                        </div>
                        {feature}
                    </li>
                ))}
            </ul>

            <Link href="/signup">
                <button className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 group/btn ${popular ? 'bg-orange-500 text-black hover:bg-orange-400' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}>
                    GET STARTED
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </Link>
        </motion.div>
    );
};

export default function Pricing() {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-orange-500/30 selection:text-orange-500 overflow-x-hidden">
            <AnimatePresence mode="wait">
                {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
            </AnimatePresence>

            {!isLoading && <Navbar />}

            <main className="relative pt-32 pb-24">
                {/* Background Decorations */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1400px] pointer-events-none opacity-20 overflow-hidden">
                    <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-orange-500/20 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[20%] right-[5%] w-[500px] h-[500px] bg-white/10 blur-[150px] rounded-full" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    {/* Header */}
                    <div className="text-center mb-24 max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-orange-500 text-xs font-black uppercase tracking-[0.4em] mb-4 block">INVEST IN YOUR GROWTH</span>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-8">
                                PRICING <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-white">REINVENTED.</span>
                            </h1>
                            <p className="text-white/50 text-xl font-medium leading-relaxed">
                                Professional gym management at a fraction of the cost. Choose the cycle that fits your ambition.
                            </p>
                        </motion.div>
                    </div>

                    {/* Pricing Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-32">
                        <PricingCard 
                            plan="Monthly"
                            price="₹999"
                            perMonth="₹999"
                            features={[
                                "Full Dashboard Access",
                                "Unlimited Member Sync",
                                "Revenue Analytics",
                                "Exercise Library (100+)",
                                "24/7 Support"
                            ]}
                            delay={0.2}
                        />
                        
                        <PricingCard 
                            plan="6 Months"
                            price="₹5,499"
                            perMonth="₹916"
                            savings="₹500"
                            features={[
                                "Everything in Monthly",
                                "Priority Cloud Sync",
                                "Custom Gym Website",
                                "yourgym.dailyyou.in Domain",
                                "Advanced Plan Architect",
                                "Quarterly Audits"
                            ]}
                            delay={0.4}
                        />

                        <PricingCard 
                            plan="12 Months"
                            price="₹9,999"
                            perMonth="₹833"
                            savings="₹2,000"
                            popular={true}
                            features={[
                                "Everything in 6 Months",
                                "Custom Gym Website",
                                "yourgym.dailyyou.in Domain",
                                "Dedicated Account Manager",
                                "Custom API Access",
                                "Beta Feature Access"
                            ]}
                            delay={0.6}
                        />
                    </div>

                    {/* FAQ / Trust Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-24 max-w-5xl mx-auto text-center md:text-left">
                        <div className="space-y-4 group">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-500/10 transition-all">
                                <ShieldCheck className="w-6 h-6 text-orange-500" />
                            </div>
                            <h4 className="text-xl font-bold uppercase tracking-tighter">Secure Payments</h4>
                            <p className="text-white/40 text-sm leading-relaxed font-medium">PCI compliant transaction gateway with encrypted member data protection.</p>
                        </div>

                        <div className="space-y-4 group">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-500/10 transition-all">
                                <InfinityIcon className="w-6 h-6 text-orange-500" />
                            </div>
                            <h4 className="text-xl font-bold uppercase tracking-tighter">Lifetime Updates</h4>
                            <p className="text-white/40 text-sm leading-relaxed font-medium">Get all future features, optimizations, and app integrations at no extra cost.</p>
                        </div>

                        <div className="space-y-4 group">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-500/10 transition-all">
                                <TrendingUp className="w-6 h-6 text-orange-500" />
                            </div>
                            <h4 className="text-xl font-bold uppercase tracking-tighter">Scalable Architecture</h4>
                            <p className="text-white/40 text-sm leading-relaxed font-medium">Built to handle from 10 to 10,000 members without a single frame drop.</p>
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mt-32 p-12 rounded-[3rem] bg-orange-500 text-black flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/20 blur-[100px] rounded-full" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4 bg-black/10 px-3 py-1 rounded-full w-fit">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Enterprise Ready</span>
                            </div>
                            <h3 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">Need a custom enterprise solution?</h3>
                            <p className="font-bold opacity-70">For gym chains with 5+ locations, we offer custom dedicated infrastructure.</p>
                        </div>
                        <Link href="/login" className="relative z-10 min-w-[200px]">
                            <button className="w-full py-5 bg-black text-white rounded-2xl font-black px-10 hover:scale-105 active:scale-95 transition-all shadow-2xl">
                                CONTACT SALES
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </main>

            {!isLoading && <Footer />}

            <style jsx global>{`
                @keyframes gradient-border {
                    0% { border-color: rgba(249, 115, 22, 0.2); }
                    50% { border-color: rgba(249, 115, 22, 0.8); }
                    100% { border-color: rgba(249, 115, 22, 0.2); }
                }
                .popular-border {
                    animation: gradient-border 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
