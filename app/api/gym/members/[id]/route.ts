import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

// GET: Fetch detailed member profile
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: memberId } = await params;

        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await import('@/lib/firebaseAdmin').then(m => m.auth.verifyIdToken(token));
        const ownerId = decodedToken.uid;

        // Verify Owner's Gym exists
        const gymsSnapshot = await db.collection('Gym').where('ownerId', '==', ownerId).limit(1).get();
        if (gymsSnapshot.empty) {
            return NextResponse.json({ message: 'Gym not found' }, { status: 404 });
        }
        const gymDoc = gymsSnapshot.docs[0];

        // Verify Member belongs to this Gym (check subcollection)
        const memberRef = gymDoc.ref.collection('Members').doc(memberId);
        const memberSnapshot = await memberRef.get();

        if (!memberSnapshot.exists) {
            return NextResponse.json({ message: 'Member not found in this gym' }, { status: 403 });
        }

        // Fetch detailed profile from App_user (User Profile)
        const userDoc = await db.collection('App_user').doc(memberId).get();

        if (!userDoc.exists) {
            return NextResponse.json({ message: 'User profile not found' }, { status: 404 });
        }

        const userData = userDoc.data();

        // Sanitize sensitive data
        const { password, otp, otpExpiresAt, googleId, ...safeProfile } = userData || {};

        return NextResponse.json({
            success: true,
            profile: safeProfile
        });

    } catch (error: any) {
        console.error('Error fetching member profile:', error);
        return NextResponse.json({ message: 'Error fetching member profile', error: error.message }, { status: 500 });
    }
}
