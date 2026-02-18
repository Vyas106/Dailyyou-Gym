import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebaseAdmin';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized: Missing or invalid token' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        await auth.verifyIdToken(token);

        const { id: memberId } = await params;
        const { searchParams } = new URL(req.url);
        const date = searchParams.get('date');

        if (!date) {
            return NextResponse.json({ message: 'Date parameter is required' }, { status: 400 });
        }

        // Fetch workouts for the user on specific date
        const workoutsSnapshot = await db.collection('App_user').doc(memberId).collection('workouts')
            .where('date', '==', date)
            .get();

        const workouts = workoutsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({ success: true, workouts }, { status: 200 });

    } catch (error: any) {
        console.error('Error fetching member workouts:', error);
        return NextResponse.json({ message: 'Error fetching workouts', error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized: Missing or invalid token' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await auth.verifyIdToken(token);
        const assignedBy = decodedToken.uid;

        const { id: memberId } = await params;
        const { date, exerciseId, exerciseName, sets, reps, weight, notes } = await req.json();

        if (!date || !exerciseId) {
            return NextResponse.json({ message: 'Date and Exercise ID are required' }, { status: 400 });
        }

        const workoutData = {
            date,
            exerciseId,
            exerciseName: exerciseName || 'Unknown Exercise',
            sets: sets ? Number(sets) : 0,
            reps: reps ? Number(reps) : 0,
            weight: weight ? Number(weight) : 0,
            notes: notes || '',
            assignedBy, // Trainer/Admin ID
            completed: false,
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('App_user').doc(memberId).collection('workouts').add(workoutData);

        return NextResponse.json({
            success: true,
            message: 'Exercise assigned successfully',
            workout: { id: docRef.id, ...workoutData }
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error assigning exercise:', error);
        return NextResponse.json({ message: 'Error assigning exercise', error: error.message }, { status: 500 });
    }
}
