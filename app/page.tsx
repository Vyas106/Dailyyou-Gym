'use client';

import Link from "next/link";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans text-foreground">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute top-[30%] -right-[10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px]" style={{ animation: 'float 8s ease-in-out infinite' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-8">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight">
            <span className="text-white">DailyYou</span>
            <span className="text-primary">Gym</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login">
              <button className="px-5 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-6 py-2.5 bg-primary text-black font-semibold rounded-full hover:shadow-[0_0_20px_rgba(255,77,0,0.4)] transition-all transform hover:scale-105">
                Get Started
              </button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border border-white/10 fadeIn">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-sm font-medium text-white/80">Now Open in 5 Locations</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1] fadeIn">
            Ignite Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">True Potential</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed fadeIn" style={{ animationDelay: '0.1s' }}>
            Experience fitness reimagined. Integrating advanced biomechanics with holistic wellness for a transformation that goes beyond the mirror.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto fadeIn" style={{ animationDelay: '0.2s' }}>
            <Link href="/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-xl text-lg font-bold hover:bg-gray-200 transition-all transform hover:-translate-y-1">
                Start Free Trial
              </button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 glass text-white border border-white/10 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all">
                View Schedules
              </button>
            </Link>
          </div>

          {/* Feature Grid - Clean & Minimal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full fadeIn" style={{ animationDelay: '0.3s' }}>
            {[
              { title: "Elite Coaching", desc: "Train with champions.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
              { title: "Smart Analytics", desc: "Track every rep.", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
              { title: "24/7 Access", desc: "Train on your terms.", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }
            ].map((item, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-300 text-left">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-black transition-colors">
                  <svg className="w-6 h-6 text-primary group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats Section - Minimal Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-24 mb-12"></div>

          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60">
            {['5000+ Members', '50+ Trainers', '100+ Classes'].map((stat, i) => (
              <span key={i} className="text-sm font-mono tracking-widest text-muted-foreground uppercase">{stat}</span>
            ))}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-black/20 backdrop-blur-sm border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground text-sm">© 2026 DailyYou Gym. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

