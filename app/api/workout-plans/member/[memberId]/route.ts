import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebaseAdmin';
import { randomUUID } from 'crypto';

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

        // Verify user owns a gym
        const userDoc = await db.collection('App_user').doc(userId).get();
        const userData = userDoc.data();
        if (!userData?.gymId) {
            return NextResponse.json({ message: 'You must own a gym to view workout plans' }, { status: 403 });
        }

        const gymId = userData.gymId;

        // Verify member belongs to this gym
        const gymDoc = await db.collection('App_user').doc('gyms').collection('gyms').doc(gymId).get();
        if (!gymDoc.exists) {
            return NextResponse.json({ message: 'Gym not found' }, { status: 404 });
        }

        const gymData = gymDoc.data() || {};
        const gymMembers = gymData.members || [];
        if (!gymMembers.includes(memberId)) {
            return NextResponse.json({ message: 'This member does not belong to your gym' }, { status: 403 });
        }

        const plansSnapshot = await db.collection('App_user').doc(memberId).collection('workout_plans').get();

        const weekPlan: Record<string, any> = {
            0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null
        };

        plansSnapshot.docs.forEach(doc => {
            const plan = doc.data();
            weekPlan[plan.dayOfWeek] = plan;
        });

        return NextResponse.json({ plans: weekPlan }, { status: 200 });

    } catch (error: any) {
        console.error('Error fetching member plans:', error);
        return NextResponse.json({ message: 'Error fetching member plans', error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ memberId: string }> }) {
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
        const { dayOfWeek, dayName, dayPlan, exercises } = await req.json();

        // Verify user owns a gym
        const userDoc = await db.collection('App_user').doc(userId).get();
        const userData = userDoc.data();
        if (!userData?.gymId) {
            return NextResponse.json({ message: 'You must own a gym to create workout plans' }, { status: 403 });
        }

        const gymId = userData.gymId;

        // Verify member belongs to this gym
        const gymDoc = await db.collection('App_user').doc('gyms').collection('gyms').doc(gymId).get();
        if (!gymDoc.exists) {
            return NextResponse.json({ message: 'Gym not found' }, { status: 404 });
        }

        const gymData = gymDoc.data() || {};
        const gymMembers = gymData.members || [];
        if (!gymMembers.includes(memberId)) {
            return NextResponse.json({ message: 'This member does not belong to your gym' }, { status: 403 });
        }

        // Check if plan exists for this day
        const existingPlanSnapshot = await db.collection('App_user').doc(memberId).collection('workout_plans')
            .where('dayOfWeek', '==', dayOfWeek)
            .limit(1)
            .get();

        let plan;
        if (!existingPlanSnapshot.empty) {
            // Update existing plan
            const doc = existingPlanSnapshot.docs[0];
            const planId = doc.id;
            const updateData: any = { updatedAt: new Date().toISOString() };
            if (dayPlan !== undefined) updateData.dayPlan = dayPlan;
            if (exercises !== undefined) updateData.exercises = exercises;

            await doc.ref.update(updateData);
            const updatedDoc = await doc.ref.get();
            plan = updatedDoc.data();
        } else {
            // Create new plan
            const planId = randomUUID();
            const now = new Date().toISOString();
            const newPlan = {
                planId,
                memberId,
                gymId,
                dayOfWeek,
                dayName,
                dayPlan: dayPlan || '',
                exercises: exercises || [],
                createdBy: userId,
                createdAt: now,
                updatedAt: now,
            };

            await db.collection('App_user').doc(memberId).collection('workout_plans').doc(planId).set(newPlan);
            plan = newPlan;
        }

        return NextResponse.json({
            message: existingPlanSnapshot.empty ? 'Workout plan created successfully' : 'Workout plan updated successfully',
            plan
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error creating/updating workout plan:', error);
        return NextResponse.json({ message: 'Error creating/updating workout plan', error: error.message }, { status: 500 });
    }
}
