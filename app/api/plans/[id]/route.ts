import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebaseAdmin';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
        const { id: planId } = await params;
        const body = await req.json();

        // Fields to update
        const updates: any = {};
        if (body.name) updates.name = body.name;
        if (body.price) updates.price = Number(body.price);
        if (body.duration) updates.duration = body.duration;
        if (body.description !== undefined) updates.description = body.description;
        updates.updatedAt = new Date().toISOString();

        await db.collection('App_user').doc('gyms').collection('gyms').doc(gymId).collection('plans').doc(planId).update(updates);

        return NextResponse.json({
            success: true,
            message: 'Plan updated successfully'
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error updating plan:', error);
        return NextResponse.json({ message: 'Error updating plan', error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
        const { id: planId } = await params;

        await db.collection('App_user').doc('gyms').collection('gyms').doc(gymId).collection('plans').doc(planId).delete();

        return NextResponse.json({
            success: true,
            message: 'Plan deleted successfully'
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error deleting plan:', error);
        return NextResponse.json({ message: 'Error deleting plan', error: error.message }, { status: 500 });
    }
}
