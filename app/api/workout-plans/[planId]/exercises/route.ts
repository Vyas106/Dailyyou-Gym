import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest, { params }: { params: Promise<{ planId: string }> }) {
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
        const { planId } = await params;
        const exercise = await req.json();

        // Verify gym owner
        const userDoc = await db.collection('App_user').doc(userId).get();
        const userData = userDoc.data();
        if (!userData?.gymId) {
            return NextResponse.json({ message: 'You must own a gym to modify workout plans' }, { status: 403 });
        }

        const gymId = userData.gymId;

        // Find the plan (inefficient search since we don't know memberId, but following backend logic which had getById fallback)
        // Ideally pass memberId in URL or body. But backend route structure was /workout-plans/:planId/exercises
        // Backend `getById` searched all users if memberID wasn't known. 
        // Here we can assume we might need to find which member calls this.
        // Or we can search across collection group if we had indexes.
        // For now, let's try to find the plan by iterating gym members?

        // BETTER: Retrieve gym members and check their subcollections.
        const gymDoc = await db.collection('App_user').doc('gyms').collection('gyms').doc(gymId).get();
        if (!gymDoc.exists) return NextResponse.json({ message: 'Gym not found' }, { status: 404 });

        const members = gymDoc.data()?.members || [];
        let foundPlanDoc = null;
        let memberId = null;

        for (const mId of members) {
            const doc = await db.collection('App_user').doc(mId).collection('workout_plans').doc(planId).get();
            if (doc.exists) {
                foundPlanDoc = doc;
                memberId = mId;
                break;
            }
        }

        if (!foundPlanDoc || !memberId) {
            return NextResponse.json({ message: 'Workout plan not found' }, { status: 404 });
        }

        const planData = foundPlanDoc.data();
        if (planData?.gymId !== gymId) {
            return NextResponse.json({ message: 'This plan does not belong to your gym' }, { status: 403 });
        }

        const exercises = planData.exercises || [];
        exercises.push({
            exerciseId: exercise.exerciseId,
            exerciseName: exercise.exerciseName,
            sets: exercise.sets,
            reps: exercise.reps,
            duration: exercise.duration,
            restTime: exercise.restTime,
            notes: exercise.notes || '',
            order: exercises.length + 1
        });

        await db.collection('App_user').doc(memberId).collection('workout_plans').doc(planId).update({
            exercises,
            updatedAt: new Date().toISOString()
        });

        const updatedDoc = await db.collection('App_user').doc(memberId).collection('workout_plans').doc(planId).get();

        return NextResponse.json({
            message: 'Exercise added to plan successfully',
            plan: updatedDoc.data()
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error adding exercise to plan:', error);
        return NextResponse.json({ message: 'Error adding exercise to plan', error: error.message }, { status: 500 });
    }
}
