'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { QrCode, Smartphone, Download } from 'lucide-react';

export default function ConnectGymPage() {
    const params = useParams();
    const gymId = params.gymId as string;
    const [status, setStatus] = useState<'redirecting' | 'fallback'>('redirecting');

    useEffect(() => {
        if (!gymId) return;

        const deepLink = `dailyyou://gym/${gymId}`;
        const playStoreLink = "https://play.google.com/store/apps/details?id=com.vishalvyas.dev778.dailyyou";

        // Attempt to open the app
        window.location.href = deepLink;

        // Fallback to Play Store after a timeout
        const timeout = setTimeout(() => {
            // Check if the page is still visible (if app opened, page might be hidden)
            if (document.visibilityState === 'visible') {
                setStatus('fallback');
                window.location.href = playStoreLink;
            }
        }, 3000);

        return () => clearTimeout(timeout);
    }, [gymId]);

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-orange-500/10 rounded-3xl flex items-center justify-center mb-8 animate-pulse">
                <QrCode className="w-12 h-12 text-orange-500" />
            </div>

            <h1 className="text-2xl font-bold mb-4">
                {status === 'redirecting' ? 'Opening DailyYou App...' : 'Redirecting to Play Store...'}
            </h1>
            
            <p className="text-gray-400 max-w-sm mb-12">
                {status === 'redirecting' 
                    ? "We're connecting you to your gym. If the app doesn't open automatically, we'll take you to the Play Store."
                    : "It looks like you don't have the DailyYou app installed yet. Redirecting you to download it now."}
            </p>

            <div className="flex flex-col gap-4 w-full max-w-xs">
                <button 
                    onClick={() => window.location.href = `dailyyou://gym/${gymId}`}
                    className="flex items-center justify-center gap-3 bg-white text-black font-bold py-4 px-6 rounded-2xl hover:bg-gray-200 transition-all"
                >
                    <Smartphone className="w-5 h-5" />
                    Open in App
                </button>
                
                <a 
                    href="https://play.google.com/store/apps/details?id=com.vishalvyas.dev778.dailyyou"
                    className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white font-bold py-4 px-6 rounded-2xl hover:bg-white/10 transition-all"
                >
                    <Download className="w-5 h-5" />
                    Download App
                </a>
            </div>

            <div className="mt-16 text-gray-600 text-sm">
                &copy; {new Date().getFullYear()} DailyYou. All rights reserved.
            </div>
        </div>
    );
}
