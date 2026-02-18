import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebaseAdmin';

export async function GET(req: NextRequest, { params }: { params: Promise<{ memberId: string }> }) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized: Missing or invalid token' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        let decodedToken;
        try {
            decodedToken = await auth.verifyIdToken(token);
        } catch (error) {
            console.error('Token verification failed:', error);
            return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
        }

        const userId = decodedToken.uid;
        const { memberId } = await params;
        const { searchParams } = new URL(req.url);
        const date = searchParams.get('date');

        if (!date) {
            return NextResponse.json({ message: 'Date parameter required' }, { status: 400 });
        }

        // Permission check
        const userDoc = await db.collection('App_user').doc(userId).get();
        const userData = userDoc.data();

        if (userId !== memberId) {
            if (!userData?.gymId) {
                return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
            }
            // If gym owner, could check if member belongs to gym
        }

        const logsSnapshot = await db.collection('App_user').doc(memberId).collection('workout_logs')
            .where('date', '==', date)
            .limit(1)
            .get();

        if (logsSnapshot.empty) {
            return NextResponse.json({ log: null }, { status: 200 });
        }

        return NextResponse.json({ log: logsSnapshot.docs[0].data() }, { status: 200 });

    } catch (error: any) {
        console.error('Error fetching workout log:', error);
        return NextResponse.json({ message: 'Error fetching workout log', error: error.message }, { status: 500 });
    }
}
