import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Start your 14-day free trial with DailyYou Gym. Join thousands of elite athletes and gym owners today.",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
