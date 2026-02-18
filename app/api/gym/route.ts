import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

// GET: Fetch Gym details for the owner
export async function GET(req: NextRequest) {
    try {
        const gymOwnerId = req.headers.get('x-user-id'); // Assuming middleware sets this or we parse token here
        // For this migration, we'll assume the request comes with a valid Authorization header
        // and we might need to verify the token again or rely on middleware.
        // Simplified for this step: expecting a gymOwnerId passed possibly via header or we need to decode token.

        // Let's assume the frontend passes the token and we decode it.
        // For serverless, we should ideally verify the token in each route or use middleware.
        // To keep it simple and consistent with previous Express logic:

        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        // verify token... (omitted for brevity, assume we have a way or trust calls for now/use admin sdk to verify)
        // detailed token verification would require 'firebase-admin' verifyIdToken.

        const decodedToken = await import('@/lib/firebaseAdmin').then(m => m.auth.verifyIdToken(token));
        const ownerId = decodedToken.uid;

        // Query Root "Gym" collection where ownerId == userId
        const gymsSnapshot = await db.collection('Gym').where('ownerId', '==', ownerId).limit(1).get();

        if (gymsSnapshot.empty) {
            return NextResponse.json({ message: 'Gym not found' }, { status: 404 });
        }

        const gymDoc = gymsSnapshot.docs[0];
        const gymData = gymDoc.data();

        // Fetch members detailed info from subcollection
        const membersSnapshot = await gymDoc.ref.collection('Members').get();
        const membersWithDetails = membersSnapshot.docs.map(doc => doc.data());

        return NextResponse.json({
            gym: {
                id: gymDoc.id,
                ...gymData,
                membersWithDetails
            }
        });

    } catch (error: any) {
        console.error('Error fetching gym:', error);
        return NextResponse.json({ message: 'Error fetching gym', error: error.message }, { status: 500 });
    }
}

// POST: Create a new Gym
export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await import('@/lib/firebaseAdmin').then(m => m.auth.verifyIdToken(token));
        const ownerId = decodedToken.uid;

        const body = await req.json();
        const { name, logo, address, workingDays, contactNumber } = body;

        // Check if user already owns a gym
        const existingGym = await db.collection('Gym').where('ownerId', '==', ownerId).limit(1).get();
        if (!existingGym.empty) {
            return NextResponse.json({ message: 'User already owns a gym' }, { status: 400 });
        }

        const gymData = {
            name,
            logo,
            address,
            workingDays,
            contactNumber,
            ownerId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const gymRef = await db.collection('Gym').add(gymData);

        // Initialize Members subcollection with owner (optional, or just keep it empty)
        // await gymRef.collection('Members').doc(ownerId).set({ ...ownerProfile?, role: 'owner' });

        return NextResponse.json({
            message: 'Gym created successfully',
            gym: { id: gymRef.id, ...gymData }
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error creating gym:', error);
        return NextResponse.json({ message: 'Error creating gym', error: error.message }, { status: 500 });
    }
}
