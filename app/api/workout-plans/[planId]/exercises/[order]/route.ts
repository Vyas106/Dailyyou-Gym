import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebaseAdmin';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ planId: string, order: string }> }) {
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
        const { planId, order } = await params;
        const exerciseOrder = parseInt(order);

        // Verify gym owner
        const userDoc = await db.collection('App_user').doc(userId).get();
        const userData = userDoc.data();
        if (!userData?.gymId) {
            return NextResponse.json({ message: 'You must own a gym to modify workout plans' }, { status: 403 });
        }

        const gymId = userData.gymId;

        // Find the plan (same search strategy as POST)
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

        let exercises = planData.exercises || [];
        exercises = exercises.filter((ex: any) => ex.order !== exerciseOrder);
        exercises.forEach((ex: any, index: number) => {
            ex.order = index + 1;
        });

        await db.collection('App_user').doc(memberId).collection('workout_plans').doc(planId).update({
            exercises,
            updatedAt: new Date().toISOString()
        });

        const updatedDoc = await db.collection('App_user').doc(memberId).collection('workout_plans').doc(planId).get();

        return NextResponse.json({
            message: 'Exercise removed from plan successfully',
            plan: updatedDoc.data()
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error removing exercise from plan:', error);
        return NextResponse.json({ message: 'Error removing exercise from plan', error: error.message }, { status: 500 });
    }
}
