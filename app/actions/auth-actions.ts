'use server';

import { auth, db } from '@/lib/firebaseAdmin';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

/**
 * Generates a 6-digit OTP and sends it via AWS SES.
 * Saves the OTP in Firestore with an expiration time.
 */
export async function requestPasswordReset(email: string) {
    try {
        // 1. Check if user exists in Firebase Auth
        try {
            await auth.getUserByEmail(email);
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                return { success: false, error: "No user found with this email address." };
            }
            throw error;
        }

        // 2. Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

        // 3. Store OTP in Firestore
        await db.collection('password_resets').doc(email).set({
            otp,
            expiresAt,
            createdAt: new Date()
        });

        // 4. Send Email via SES
        const subject = "Reset Your DailyYou Gym Password";
        const body = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                <h2 style="color: #FF4D00;">DailyYou Gym</h2>
                <p>You requested to reset your password. Use the following 6-digit verification code to complete the process:</p>
                <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000;">${otp}</span>
                </div>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't request this, you can safely ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #999;">&copy; 2026 DailyYou Gym. All rights reserved.</p>
            </div>
        `;

        await sendEmail(email, subject, body);

        return { success: true };
    } catch (error: any) {
        console.error("Password reset request error:", error);
        return { success: false, error: "Failed to send reset code. Please try again later." };
    }
}

/**
 * Verifies OTP and updates password using Firebase Admin SDK.
 */
export async function resetPassword(email: string, otp: string, newPassword: string) {
    try {
        // 1. Verify OTP from Firestore
        const doc = await db.collection('password_resets').doc(email).get();
        if (!doc.exists) {
            return { success: false, error: "Invalid or expired reset request." };
        }

        const data = doc.data();
        if (data?.otp !== otp) {
            return { success: false, error: "Incorrect verification code." };
        }

        if (new Date() > data.expiresAt.toDate()) {
            return { success: false, error: "Verification code has expired." };
        }

        // 2. Update Firebase Auth Password
        const firebaseUser = await auth.getUserByEmail(email);
        await auth.updateUser(firebaseUser.uid, {
            password: newPassword
        });

        // 3. Delete OTP record
        await db.collection('password_resets').doc(email).delete();

        return { success: true };
    } catch (error: any) {
        console.error("Password reset error:", error);
        return { success: false, error: "Failed to reset password. Please try again later." };
    }
}
