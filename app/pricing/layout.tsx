import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Pricing Plans",
  description: "Explore our flexible pricing plans for DailyYou Gym management. Choose the perfect tier to scale your fitness business.",
  openGraph: {
    title: "DailyYou Gym Pricing | High-Performance Management",
    description: "Get the elite operating system for your gym. Transparent pricing, no hidden fees.",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
