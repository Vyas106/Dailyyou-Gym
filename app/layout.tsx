import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "DailyYou Gym | Elite Gym Management System",
    template: "%s | DailyYou Gym"
  },
  description: "DailyYou Gym is the ultimate operating system for modern fitness centers. Manage members, trainers, workouts, and analytics in one cinematic ecosystem.",
  keywords: [
    "gym management software", 
    "fitness tracking", 
    "personal trainer dashboard", 
    "gym membership system", 
    "workout planner", 
    "DailyYou Gym", 
    "health and wellness",
    "fitness business tools",
    "gym analytics"
  ],
  authors: [{ name: "DailyYou Team" }],
  creator: "DailyYou",
  publisher: "DailyYou Gym",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gym.dailyyou.in", // Updated to correct domain
    siteName: "DailyYou Gym",
    title: "DailyYou Gym | Elite Gym Management",
    description: "The high-performance operating system for modern gyms. Elevate your standard with real-time analytics and member engagement.",
    images: [
      {
        url: "/og-image.jpg", // Ensure this exists or I should create it
        width: 1200,
        height: 630,
        alt: "DailyYou Gym Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DailyYou Gym | Elite Gym Management",
    description: "The high-performance operating system for modern gyms.",
    images: ["/og-image.jpg"],
    creator: "@dailyyou",
  },
  icons: {
    icon: "/icon.jpg",
    apple: "/icon.jpg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
