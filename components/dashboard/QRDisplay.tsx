'use client';

import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, QrCode, Copy, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface QRDisplayProps {
    gymId: string;
    gymName: string;
}

export default function QRDisplay({ gymId, gymName }: QRDisplayProps) {
    const qrRef = useRef<SVGSVGElement>(null);
    const [copied, setCopied] = React.useState(false);
    const baseUrl = 'https://dailyyou.in';
    const connectUrl = `${baseUrl}/connect/${gymId}`;

    const downloadQR = () => {
        if (!qrRef.current) return;

        const svg = qrRef.current;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = 1000;
            canvas.height = 1000;
            if (ctx) {
                // Background white for PNG
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 50, 50, 900, 900);

                const pngFile = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.download = `${gymName.replace(/\s+/g, '_')}_QR.png`;
                downloadLink.href = pngFile;
                downloadLink.click();
                toast.success('QR Code downloaded successfully!');
            }
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    const copyLink = async () => {
        const link = connectUrl;

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(link);
            } else {
                // Fallback for non-secure contexts or older browsers
                const textArea = document.createElement("textarea");
                textArea.value = link;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                } catch (err) {
                    console.error('Fallback copy failed', err);
                }
                document.body.removeChild(textArea);
            }

            setCopied(true);
            toast.success('Connect link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Copy failed', error);
            toast.error('Failed to copy link');
        }
    };

    return (
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                        <QrCode className="w-4 h-4 text-orange-500" />
                    </div>
                    <h3 className="font-semibold text-lg">Gym Connect QR</h3>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={downloadQR} className="h-8 w-8 rounded-lg" title="Download PNG">
                        <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => window.print()} className="h-8 w-8 rounded-lg" title="Print QR">
                        <Printer className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="relative group">
                <div className="absolute -inset-4 bg-orange-500/5 rounded-2xl blur-xl group-hover:bg-orange-500/10 transition-colors"></div>
                <div className="relative bg-white p-4 rounded-xl shadow-2xl">
                    <QRCodeSVG
                        ref={qrRef}
                        value={connectUrl}
                        size={200}
                        level="H"
                        includeMargin={false}
                        imageSettings={{
                            src: "/logo.png", // Attempt to use app logo if available
                            x: undefined,
                            y: undefined,
                            height: 40,
                            width: 40,
                            excavate: true,
                        }}
                    />
                </div>
            </div>

            <div className="mt-8 w-full space-y-4">
                <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Scan to Join</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Members can scan this QR using the DailyYou App to instantly join your gym.
                    </p>
                </div>

                <Button
                    variant="secondary"
                    className="w-full h-10 rounded-lg text-xs gap-2"
                    onClick={copyLink}
                >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied ? "Copied Link" : "Copy Web Link"}
                </Button>
            </div>
        </div>
    );
}
