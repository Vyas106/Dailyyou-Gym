import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await import('@/lib/firebaseAdmin').then(m => m.auth.verifyIdToken(token));
        const uid = decodedToken.uid;

        const { name, email } = await req.json();

        // Check if profile exists
        const userDoc = await db.collection('App_user').doc(uid).get();
        if (userDoc.exists) {
            return NextResponse.json({ message: 'User profile already exists' }, { status: 400 });
        }

        const newUser = {
            userId: uid,
            email,
            name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'LOGGED_IN'
        };

        await db.collection('App_user').doc(uid).set(newUser);

        return NextResponse.json({
            message: 'User registered successfully',
            user: newUser
        });

    } catch (error: any) {
        console.error('Error registering user:', error);
        return NextResponse.json({ message: 'Error registering user', error: error.message }, { status: 500 });
    }
}
