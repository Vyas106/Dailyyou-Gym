"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, ArrowLeft, CheckCircle, Key, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { requestPasswordReset, resetPassword } from "@/app/actions/auth-actions";

interface ForgotPasswordProps {
    onBack: () => void;
}

export function ForgotPassword({ onBack }: ForgotPasswordProps) {
    const [step, setStep] = useState<"email" | "otp" | "success">("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        setLoading(true);
        try {
            const result = await requestPasswordReset(email);
            if (result.success) {
                setStep("otp");
                toast.success("Verification code sent to your email.");
            } else {
                toast.error(result.error || "Failed to send code.");
            }
        } catch (error: any) {
            toast.error("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp || otp.length !== 6) {
            toast.error("Enter a valid 6-digit code");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            const result = await resetPassword(email, otp, newPassword);
            if (result.success) {
                setStep("success");
                toast.success("Password reset successfully!");
            } else {
                toast.error(result.error || "Reset failed.");
            }
        } catch (error: any) {
            toast.error("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    if (step === "success") {
        return (
            <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="mx-auto h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">All Set!</h3>
                    <p className="text-gray-400">
                        Your password has been changed successfully. Use your new credentials to log in.
                    </p>
                </div>
                <Button
                    onClick={onBack}
                    className="w-full h-12 bg-white hover:bg-white/90 text-black rounded-xl font-bold transition-all"
                >
                    Back to Login
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                    <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <ArrowLeft className="h-4 w-4 text-gray-500" />
                    </button>
                    <span className="text-sm font-medium text-gray-400">Back</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                    {step === "email" ? "Reset Password" : "Verification"}
                </h1>
                <p className="text-gray-400 text-sm">
                    {step === "email"
                        ? "Enter your email to receive a 6-digit verification code."
                        : `We've sent a code to ${email}.`}
                </p>
            </div>

            <form onSubmit={step === "email" ? handleSendOTP : handleResetPassword} className="space-y-5">
                {step === "email" ? (
                    <div className="space-y-2">
                        <Label htmlFor="reset-email" className="text-sm font-medium text-gray-200">Email Address</Label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-orange-500 transition-colors z-10" />
                            <Input
                                id="reset-email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 h-12 border-white/10 bg-white/5 text-white rounded-xl focus:border-orange-500 focus:ring-0 placeholder:text-gray-600 transition-all font-medium"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="otp" className="text-sm font-medium text-gray-200">6-Digit Code</Label>
                            <div className="relative group">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-orange-500 transition-colors z-10" />
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="123456"
                                    maxLength={6}
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                    className="pl-10 h-12 border-white/10 bg-white/5 text-white rounded-xl focus:border-orange-500 focus:ring-0 tracking-[0.5em] text-center font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="new-password" className="text-sm font-medium text-gray-200">New Password</Label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-orange-500 transition-colors z-10" />
                                <Input
                                    id="new-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="px-10 h-12 border-white/10 bg-white/5 text-white rounded-xl focus:border-orange-500 focus:ring-0 placeholder:text-gray-600 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-500 ml-1">Must be at least 6 characters</p>
                        </div>
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-white hover:bg-white/90 text-black rounded-xl font-bold transition-all shadow-lg shadow-orange-500/5 active:scale-[0.98]"
                >
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        step === "email" ? "Send Code" : "Reset Password"
                    )}
                </Button>
            </form>

            {step === "otp" && (
                <div className="text-center">
                    <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={loading}
                        className="text-xs font-bold text-orange-500 hover:text-orange-400 transition-all uppercase tracking-widest"
                    >
                        Resend Code
                    </button>
                </div>
            )}
        </div>
    );
}
