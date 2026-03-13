import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
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
        const userDoc = await db.collection('App_user').doc(userId).get();
        const userData = userDoc.data();

        if (!userData?.gymId) {
            return NextResponse.json({ message: 'Gym not found for this user' }, { status: 404 });
        }

        const gymId = userData.gymId;
        const { weeklyPlan } = await req.json();

        if (!weeklyPlan) {
            return NextResponse.json({ message: 'Missing weekly plan data' }, { status: 400 });
        }

        const planData = {
            weeklyPlan,
            gymId,
            updatedAt: new Date().toISOString()
        };

        await db.collection('App_user').doc('gyms').collection('gyms').doc(gymId).collection('weekly_workout').doc('current').set(planData);

        return NextResponse.json({
            success: true,
            message: 'Weekly workout plan updated successfully'
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error updating weekly workout:', error);
        return NextResponse.json({ message: 'Error updating weekly workout', error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
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
        const userDoc = await db.collection('App_user').doc(userId).get();
        const userData = userDoc.data();

        if (!userData?.gymId) {
            return NextResponse.json({ message: 'Gym not found for this user' }, { status: 404 });
        }

        const gymId = userData.gymId;
        const planDoc = await db.collection('App_user').doc('gyms').collection('gyms').doc(gymId).collection('weekly_workout').doc('current').get();

        if (!planDoc.exists) {
            return NextResponse.json({ success: true, weeklyPlan: null }, { status: 200 });
        }

        return NextResponse.json({ success: true, weeklyPlan: planDoc.data()?.weeklyPlan }, { status: 200 });

    } catch (error: any) {
        console.error('Error fetching weekly workout:', error);
        return NextResponse.json({ message: 'Error fetching weekly workout', error: error.message }, { status: 500 });
    }
}
