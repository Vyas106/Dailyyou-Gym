import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;
        
        const userDoc = await db.collection('App_user').doc(userId).get();
        const userData = userDoc.data();
        if (!userData?.gymId) {
            return NextResponse.json({ message: 'Gym not found' }, { status: 404 });
        }

        const gymId = userData.gymId;
        const { id: memberId } = await params;
        const { mealId, customMeal, note } = await req.json();

        let mealDetails = null;
        if (mealId) {
            const mealDoc = await db.collection('App_user').doc('gyms').collection('gyms').doc(gymId).collection('meals').doc(mealId).get();
            if (mealDoc.exists) {
                mealDetails = { id: mealDoc.id, ...mealDoc.data() };
            }
        }

        const suggestionData = {
            gymId,
            coachId: userId,
            memberId,
            mealId: mealId || null,
            mealDetails,
            customMeal: customMeal || null,
            note: note || '',
            createdAt: new Date().toISOString()
        };

        // Store in the individual member's record in the gym's database
        // and also potentially in the member's public profile if they are connected
        await db.collection('App_user').doc('gyms').collection('gyms').doc(gymId).collection('members').doc(memberId).collection('diet_suggestions').add(suggestionData);

        // Also push to the member's private collection if connected
        const memberRef = await db.collection('App_user').doc(memberId).get();
        if (memberRef.exists) {
            await db.collection('App_user').doc(memberId).collection('gym_diet_suggestions').add(suggestionData);
        }

        return NextResponse.json({
            success: true,
            suggestion: suggestionData
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;
        
        const userDoc = await db.collection('App_user').doc(userId).get();
        const userData = userDoc.data();
        if (!userData?.gymId) {
            return NextResponse.json({ message: 'Gym not found' }, { status: 404 });
        }

        const gymId = userData.gymId;
        const { id: memberId } = await params;

        const snapshot = await db.collection('App_user').doc('gyms').collection('gyms').doc(gymId).collection('members').doc(memberId).collection('diet_suggestions').orderBy('createdAt', 'desc').get();

        const suggestions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({ success: true, suggestions }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });
    }
}
