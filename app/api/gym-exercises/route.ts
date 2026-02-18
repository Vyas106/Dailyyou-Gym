import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebaseAdmin';

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

        // Verify gym owner
        const userDoc = await db.collection('App_user').doc(userId).get();
        if (!userDoc.exists) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const userData = userDoc.data();
        if (!userData?.gymId) {
            return NextResponse.json({ message: 'Gym not found for this user' }, { status: 404 });
        }

        const gymId = userData.gymId;

        // Fetch exercises for this gym
        const exercisesSnapshot = await db.collection('App_user').doc('gyms').collection('gyms').doc(gymId).collection('exercises').get();

        const exercises = exercisesSnapshot.docs.map(doc => ({
            exerciseId: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({ exercises }, { status: 200 });

    } catch (error: any) {
        console.error('Error fetching exercises:', error);
        return NextResponse.json({ message: 'Error fetching exercises', error: error.message }, { status: 500 });
    }
}

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
        const exerciseData = await req.json();

        // Verify gym owner
        const userDoc = await db.collection('App_user').doc(userId).get();
        const userData = userDoc.data();

        if (!userData?.gymId) {
            return NextResponse.json({ message: 'You do not own a gym' }, { status: 404 });
        }

        const gymId = userData.gymId;

        // Add exercise
        const newExercise = {
            ...exerciseData,
            createdAt: new Date().toISOString(),
            createdBy: userId
        };

        const docRef = await db.collection('App_user').doc('gyms').collection('gyms').doc(gymId).collection('exercises').add(newExercise);

        return NextResponse.json({
            message: 'Exercise added successfully',
            exercise: { exerciseId: docRef.id, ...newExercise }
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error adding exercise:', error);
        return NextResponse.json({ message: 'Error adding exercise', error: error.message }, { status: 500 });
    }
}
