import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebaseAdmin';

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
        const { id: exerciseId } = await params;

        // Verify gym owner
        const userDoc = await db.collection('App_user').doc(userId).get();
        const userData = userDoc.data();

        if (!userData?.gymId) {
            return NextResponse.json({ message: 'You do not own a gym' }, { status: 404 });
        }

        const gymId = userData.gymId;
        const exerciseRef = db.collection('App_user').doc('gyms').collection('gyms').doc(gymId).collection('exercises').doc(exerciseId);

        const exerciseDoc = await exerciseRef.get();
        if (!exerciseDoc.exists) {
            return NextResponse.json({ message: 'Exercise not found' }, { status: 404 });
        }

        await exerciseRef.delete();

        return NextResponse.json({ message: 'Exercise deleted successfully' }, { status: 200 });

    } catch (error: any) {
        console.error('Error deleting exercise:', error);
        return NextResponse.json({ message: 'Error deleting exercise', error: error.message }, { status: 500 });
    }
}
