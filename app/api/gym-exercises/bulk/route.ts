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
        const { exercises } = await req.json();

        if (!Array.isArray(exercises)) {
            return NextResponse.json({ message: 'Invalid data format: exercises must be an array' }, { status: 400 });
        }

        // Verify gym owner
        const userDoc = await db.collection('App_user').doc(userId).get();
        const userData = userDoc.data();

        if (!userData?.gymId) {
            return NextResponse.json({ message: 'You do not own a gym' }, { status: 404 });
        }

        const gymId = userData.gymId;
        const exercisesRef = db.collection('App_user').doc('gyms').collection('gyms').doc(gymId).collection('exercises');

        // Use batch for better performance (Firestore limits batches to 500 operations)
        const batches = [];
        let currentBatch = db.batch();
        let operationCount = 0;

        for (const exerciseData of exercises) {
            const docRef = exercisesRef.doc();
            const newExercise = {
                ...exerciseData,
                createdAt: new Date().toISOString(),
                createdBy: userId
            };
            currentBatch.set(docRef, newExercise);
            operationCount++;

            if (operationCount === 500) {
                batches.push(currentBatch.commit());
                currentBatch = db.batch();
                operationCount = 0;
            }
        }

        if (operationCount > 0) {
            batches.push(currentBatch.commit());
        }

        await Promise.all(batches);

        return NextResponse.json({
            message: `Successfully added ${exercises.length} exercises`,
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error batch adding exercises:', error);
        return NextResponse.json({ message: 'Error batch adding exercises', error: error.message }, { status: 500 });
    }
}
