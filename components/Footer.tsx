'use client';

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Instagram, Twitter, Linkedin, Facebook, MapPin, Mail, Phone, Globe, Zap } from "lucide-react";
import { useRef } from "react";

export default function Footer() {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "end end"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [-100, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

    return (
        <footer
            ref={container}
            className="relative bg-zinc-950 text-white overflow-hidden rounded-t-[3rem]"
        >
            {/* GRAIN & GRID BACKGROUND */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0" style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }}></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

            {/* MAIN CONTENT */}
            <div className="relative z-10 pt-24 pb-12 px-6 md:px-12 max-w-[1600px] mx-auto">

                {/* CTA Section */}
                <div className="flex flex-col items-center justify-center min-h-[40vh] mb-20 relative">
                    <motion.div style={{ opacity }} className="text-center relative">
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-500/20 blur-[100px] rounded-full pointer-events-none"></div>

                        <h2 className="text-[10vw] md:text-[8vw] leading-[0.8] font-black tracking-tighter uppercase text-white mix-blend-overlay">
                            DailyYou Gym.
                        </h2>
                        <h2 className="text-[10vw] md:text-[8vw] leading-[0.8] font-black tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-transparent absolute top-0 left-0 w-full">
                            DailyYou Gym.
                        </h2>
                    </motion.div>

                    <Link href="/signup" className="mt-12 group">
                        <button className="relative px-10 py-5 bg-zinc-900 rounded-full border border-zinc-800 text-white font-bold text-lg flex items-center gap-4 overflow-hidden transition-all hover:scale-105 hover:border-orange-400/50 hover:shadow-[0_0_40px_rgba(249,115,22,0.2)]">
                            <span className="relative z-10 group-hover:text-orange-400 transition-colors uppercase tracking-widest">Ignite Your Potential</span>
                            <div className="relative z-10 bg-orange-500 text-black p-2 rounded-full group-hover:rotate-45 transition-transform">
                                <ArrowUpRight size={20} />
                            </div>
                        </button>
                    </Link>
                </div>

                {/* BENTO GRID FOOTER INFO */}
                <motion.div style={{ y }} className="grid grid-cols-1 md:grid-cols-12 gap-6 border-t border-zinc-800/60 pt-16">

                    {/* Brand & Description */}
                    <div className="md:col-span-5 flex flex-col justify-between gap-8">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <div className="w-10 h-10 relative rounded-[5px] overflow-hidden shadow-xl ring-1 ring-white/10">
                                    <Image src="/icon.png" alt="DailyYou" fill className="object-cover" />
                                </div>
                                DailyYou Gym.
                            </h3>
                            <p className="text-zinc-400 max-w-md leading-relaxed text-lg">
                                Redefining the fitness landscape through digital orchestration. Empowering gyms, inspiring members.
                            </p>
                        </div>

                        {/* Location Badge */}
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg w-fit">
                            <MapPin className="text-orange-400 w-4 h-4" />
                            <span className="text-zinc-300 text-sm font-mono uppercase tracking-wide">Ahmedabad, IN</span>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="md:col-span-2 space-y-4">
                        <h4 className="text-sm font-mono text-zinc-500 uppercase tracking-wider mb-2">Platform</h4>
                        {["Dashboard", "Pricing", "Analytics", "Exercises", "Contact"].map((item) => (
                            <Link key={item} href={item === "Pricing" ? "/pricing" : "/login"} className="block text-zinc-300 hover:text-orange-400 hover:translate-x-2 transition-all duration-300">
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-3 space-y-6">
                        <h4 className="text-sm font-mono text-zinc-500 uppercase tracking-wider mb-2">Connect</h4>

                        <a href="mailto:info@dailyyou.in" className="flex items-center gap-4 group p-3 rounded-xl hover:bg-zinc-900 transition-colors border border-transparent hover:border-zinc-800">
                            <div className="p-2 bg-zinc-800 rounded-lg group-hover:bg-orange-500 group-hover:text-black transition-colors">
                                <Mail size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-zinc-500 uppercase">Email</span>
                                <span className="text-zinc-200">info@dailyyou.in</span>
                            </div>
                        </a>

                        <a href="tel:+919274043301" className="flex items-center gap-4 group p-3 rounded-xl hover:bg-zinc-900 transition-colors border border-transparent hover:border-zinc-800">
                            <div className="p-2 bg-zinc-800 rounded-lg group-hover:bg-orange-500 group-hover:text-black transition-colors">
                                <Phone size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-zinc-500 uppercase">Mobile</span>
                                <span className="text-zinc-200">+91 9274043301</span>
                            </div>
                        </a>
                    </div>

                    {/* CREDITS SECTION */}
                    <div className="md:col-span-2 flex flex-col justify-end">
                        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 hover:border-orange-500/30 transition-colors group">
                            <span className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3 block">Crafted By</span>

                            <Link href="https://goonlinetoday.store" className="flex items-center gap-2 mb-2 hover:text-orange-400 transition-colors">
                                <Globe size={14} />
                                <span className="font-bold text-sm">GoOnlineToday</span>
                            </Link>

                            <div className="h-px w-full bg-zinc-800 my-2"></div>

                            <div className="flex items-center justify-between">
                                <span className="text-xs text-zinc-400">Founder</span>
                                <span className="text-xs font-mono text-orange-400">Vyas Vishal</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom Bar */}
                <div className="mt-20 flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-zinc-900 text-zinc-500 text-sm">
                    <p>© {new Date().getFullYear()} DailyYou Gym Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
                            <Link key={i} href="#" className="hover:text-orange-400 hover:scale-125 transition-all duration-300">
                                <Icon size={20} />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
