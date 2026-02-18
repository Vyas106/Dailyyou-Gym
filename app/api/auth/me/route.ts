import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await import('@/lib/firebaseAdmin').then(m => m.auth.verifyIdToken(token));
        const uid = decodedToken.uid;

        const userDoc = await db.collection('App_user').doc(uid).get();

        if (!userDoc.exists) {
            return NextResponse.json({ message: 'User profile not found' }, { status: 404 });
        }

        const userData = userDoc.data();

        // Return user data matching AuthContext interface
        return NextResponse.json({
            user: {
                userId: uid,
                name: userData?.name,
                email: userData?.email,
                gymId: userData?.gymId,
                role: userData?.role
            }
        });

    } catch (error: any) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ message: 'Error fetching user', error: error.message }, { status: 500 });
    }
}
