'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

export default function Navbar() {
    const [showBottomNav, setShowBottomNav] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBottomNav(window.scrollY > 100);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {showBottomNav && (
                <div className="fixed bottom-6 md:bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none px-4 md:px-0">
                    <motion.div
                        initial={{ y: 100, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 100, opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="pointer-events-auto relative"
                    >
                        {/* THE CAPSULE CONTAINER */}
                        <div className="flex items-center gap-1 md:gap-2 pl-3 md:pl-5 pr-1.5 py-1.5 bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl ring-1 ring-black/50">

                            {/* 1. Left: Brand */}
                            <Link href="/" className="flex items-center gap-2 md:gap-3 pr-2 md:pr-4 group">
                                <div className="w-8 h-8 md:w-10 md:h-10 relative rounded-[5px] overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
                                    <Image src="/icon.png" alt="DailyYou Logo" fill className="object-cover" />
                                </div>
                                <span className="font-bold text-white tracking-wide text-sm md:text-base hidden sm:block">
                                    DailyYou<span className="text-orange-500">Gym</span>
                                </span>
                            </Link>

                            {/* 2. Divider */}
                            <div className="w-px h-4 md:h-6 bg-white/10 mx-1 md:mx-2" />

                            {/* 3. Right: Contextual Actions */}
                            <div className="flex items-center gap-1 md:gap-2">
                                <Link
                                    href="/pricing"
                                    className="px-2 md:px-4 text-[10px] md:text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-wider"
                                >
                                    Pricing
                                </Link>

                                <Link
                                    href="/login"
                                    className="px-2 md:px-4 text-[10px] md:text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-wider"
                                >
                                    Log in
                                </Link>

                                <Link
                                    href="/signup"
                                    className="relative group px-4 py-2 md:px-6 md:py-2.5 bg-white text-black rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest overflow-hidden hover:scale-105 transition-transform"
                                >
                                    <span className="relative z-10">Get Started</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-100 to-transparent opacity-0 group-hover:opacity-50 -translate-x-full group-hover:translate-x-full transition-all duration-500" />
                                </Link>
                            </div>
                        </div>

                        {/* Outer Glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-white/10 to-orange-500/20 blur-xl opacity-50 -z-10 rounded-full" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
