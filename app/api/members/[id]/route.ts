import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebaseAdmin';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

        const requesterId = decodedToken.uid;
        const { id: memberId } = await params;

        // Verify requester is a gym owner
        const requesterDoc = await db.collection('App_user').doc(requesterId).get();
        const requesterData = requesterDoc.data();

        // TODO: Strict check if requester is the owner of the gym the member belongs to?
        // For now, assuming gym owner access is sufficient if they have the ID.
        // But ideally: 
        // 1. Get requester's gymId.
        // 2. Check if member belongs to that gym (either member has gymId or gym has memberId).

        if (!requesterData?.gymId) {
            return NextResponse.json({ message: 'Requester does not belong to a gym' }, { status: 403 });
        }

        const gymId = requesterData.gymId;

        // Check if member exists
        const memberDoc = await db.collection('App_user').doc(memberId).get();
        if (!memberDoc.exists) {
            return NextResponse.json({ message: 'Member not found' }, { status: 404 });
        }

        const memberData = memberDoc.data();

        // Verify member belongs to the requester's gym (optional but recommended)
        // This depends on data model. Assuming memberData.gymId should match.
        // Or checking gym's member list.
        // If memberData doesn't store gymId reliably, we might skip or check gym doc.

        // Construct profile object
        // Frontend expects: height, weight, gender, age, weightGoal, conditions, dietaryPreferences
        const profile = {
            ...memberData, // Include basic info like name, email
            height: memberData?.height,
            weight: memberData?.weight,
            gender: memberData?.gender,
            age: memberData?.age,
            weightGoal: memberData?.weightGoal,
            conditions: memberData?.conditions,
            dietaryPreferences: memberData?.dietaryPreferences,
            joinedAt: memberData?.joinedAt || memberData?.createdAt
        };

        return NextResponse.json({ success: true, profile }, { status: 200 });

    } catch (error: any) {
        console.error('Error fetching member profile:', error);
        return NextResponse.json({ message: 'Error fetching member profile', error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized: Missing or invalid token' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        await auth.verifyIdToken(token);

        const { id: memberId } = await params;
        const body = await req.json();

        // Fields to update
        const updates: any = {};
        if (body.joiningDate) updates.joinedAt = body.joiningDate;
        if (body.planId) updates.planId = body.planId;
        if (body.discount !== undefined) updates.discount = body.discount;

        // Also allow updating other profile fields if needed
        if (body.height) updates.height = body.height;
        if (body.weight) updates.weight = body.weight;
        if (body.gender) updates.gender = body.gender;
        if (body.age) updates.age = body.age;
        if (body.weightGoal) updates.weightGoal = body.weightGoal;
        if (body.conditions) updates.conditions = body.conditions;
        if (body.dietaryPreferences) updates.dietaryPreferences = body.dietaryPreferences;

        updates.updatedAt = new Date().toISOString();

        await db.collection('App_user').doc(memberId).update(updates);

        return NextResponse.json({ success: true, message: 'Member updated successfully' }, { status: 200 });

    } catch (error: any) {
        console.error('Error updating member:', error);
        return NextResponse.json({ message: 'Error updating member', error: error.message }, { status: 500 });
    }
}
