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

        const gymOwnerId = decodedToken.uid;
        const { connectionCode } = await req.json();

        if (!connectionCode) {
            return NextResponse.json({ message: 'Connection code is required' }, { status: 400 });
        }

        // Find owner's gym
        const ownerDoc = await db.collection('App_user').doc(gymOwnerId).get();
        if (!ownerDoc.exists) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        const ownerData = ownerDoc.data();

        if (!ownerData?.gymId) {
            return NextResponse.json({ message: 'You do not own a gym' }, { status: 404 });
        }

        const gymId = ownerData.gymId;
        const gymRef = db.collection('App_user').doc('gyms').collection('gyms').doc(gymId);
        const gymDoc = await gymRef.get();

        if (!gymDoc.exists) {
            return NextResponse.json({ message: 'Gym not found' }, { status: 404 });
        }

        // Find user by connection code
        // Note: In backend it was scanning all users, which is inefficient. 
        // Ideally we should have a query. Firestore requires an index for this.
        // For now, let's try a collection group query or just query App_user if connectionCode is indexed.
        // Assuming 'App_user' collection contains all users.

        const usersSnapshot = await db.collection('App_user')
            .where('gymConnectionCode', '==', connectionCode)
            .limit(1)
            .get();

        if (usersSnapshot.empty) {
            return NextResponse.json({ message: 'Invalid connection code' }, { status: 404 });
        }

        const memberDoc = usersSnapshot.docs[0];
        const memberId = memberDoc.id;

        // Check if already a member
        const gymData = gymDoc.data() || {};
        const currentMembers: string[] = gymData.members || [];

        if (currentMembers.includes(memberId)) {
            return NextResponse.json({ message: 'User is already a member of this gym' }, { status: 400 });
        }

        // Add member to gym
        await gymRef.update({
            members: [...currentMembers, memberId],
            updatedAt: new Date().toISOString()
        });

        // Clear the connection code and SET gymId on member profile
        await db.collection('App_user').doc(memberId).update({
            gymConnectionCode: null,
            gymId: gymId,
            updatedAt: new Date().toISOString()
        });

        return NextResponse.json({ message: 'Member added successfully', memberId }, { status: 200 });

    } catch (error: any) {
        console.error('Error adding member:', error);
        return NextResponse.json({ message: 'Error adding member', error: error.message }, { status: 500 });
    }
}
