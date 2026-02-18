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
        const { name, price, duration, description } = await req.json();

        if (!name || !price || !duration) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const planData = {
            name,
            price: Number(price),
            duration, // e.g., '1 month', '3 months', '1 year'
            description: description || '',
            gymId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const planRef = await db.collection('App_user').doc('gyms').collection('gyms').doc(gymId).collection('plans').add(planData);

        return NextResponse.json({
            success: true,
            plan: { id: planRef.id, ...planData }
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error creating plan:', error);
        return NextResponse.json({ message: 'Error creating plan', error: error.message }, { status: 500 });
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
        const snapshot = await db.collection('App_user').doc('gyms').collection('gyms').doc(gymId).collection('plans').get();

        const plans = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({ success: true, plans }, { status: 200 });

    } catch (error: any) {
        console.error('Error fetching plans:', error);
        return NextResponse.json({ message: 'Error fetching plans', error: error.message }, { status: 500 });
    }
}
