import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

// GET: List members of the gym
export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await import('@/lib/firebaseAdmin').then(m => m.auth.verifyIdToken(token));
        const ownerId = decodedToken.uid;

        // Find Owner's Gym
        const gymsSnapshot = await db.collection('Gym').where('ownerId', '==', ownerId).limit(1).get();
        if (gymsSnapshot.empty) {
            return NextResponse.json({ message: 'Gym not found' }, { status: 404 });
        }
        const gymDoc = gymsSnapshot.docs[0];

        // Fetch Members from Subcollection
        const membersSnapshot = await gymDoc.ref.collection('Members').get();
        const members = membersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({ members });

    } catch (error: any) {
        console.error('Error fetching members:', error);
        return NextResponse.json({ message: 'Error fetching members', error: error.message }, { status: 500 });
    }
}

// POST: Add a member using connection code
export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await import('@/lib/firebaseAdmin').then(m => m.auth.verifyIdToken(token));
        const ownerId = decodedToken.uid;

        const { connectionCode } = await req.json();
        if (!connectionCode) {
            return NextResponse.json({ message: 'Connection code is required' }, { status: 400 });
        }

        // Find Owner's Gym
        const gymsSnapshot = await db.collection('Gym').where('ownerId', '==', ownerId).limit(1).get();
        if (gymsSnapshot.empty) {
            return NextResponse.json({ message: 'Gym not found' }, { status: 404 });
        }
        const gymDoc = gymsSnapshot.docs[0];

        // Find User by Connection Code (still searching globally in App_user if that's where codes are stored)
        // Assumption: connection codes are still stored in the main user profile
        const usersSnapshot = await db.collection('App_user').where('gymConnectionCode', '==', connectionCode).limit(1).get();

        if (usersSnapshot.empty) {
            return NextResponse.json({ message: 'Invalid connection code' }, { status: 404 });
        }

        const memberDoc = usersSnapshot.docs[0];
        const memberData = memberDoc.data();
        const memberId = memberDoc.id;

        // Check if already a member in subcollection
        const existingMember = await gymDoc.ref.collection('Members').doc(memberId).get();
        if (existingMember.exists) {
            return NextResponse.json({ message: 'User is already a member' }, { status: 400 });
        }

        // Add to Gym Members Subcollection
        // Store basic info for quick access
        await gymDoc.ref.collection('Members').doc(memberId).set({
            userId: memberId,
            name: memberData.name,
            email: memberData.email,
            joinedAt: new Date().toISOString(),
            status: 'active'
        });

        // Clear connection code from user profile
        await db.collection('App_user').doc(memberId).update({
            gymConnectionCode: null
        });

        return NextResponse.json({ message: 'Member added successfully', memberId });

    } catch (error: any) {
        console.error('Error adding member:', error);
        return NextResponse.json({ message: 'Error adding member', error: error.message }, { status: 500 });
    }
}
