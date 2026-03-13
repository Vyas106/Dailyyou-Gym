import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your DailyYou Gym dashboard to manage members, tracks analytics, and oversee your gym operations.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
