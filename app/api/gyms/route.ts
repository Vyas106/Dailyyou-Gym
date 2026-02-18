import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebaseAdmin';



export async function GET(req: NextRequest) {
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

        // Check if user exists (mocking User.getById)
        const userDoc = await db.collection('App_user').doc(userId).get();
        if (!userDoc.exists) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const userData = userDoc.data();
        if (!userData?.gymId) {
            return NextResponse.json({ message: 'Gym not found for this user' }, { status: 404 });
        }

        const gymId = userData.gymId;
        const gymDoc = await db.collection('App_user').doc('gyms').collection('gyms').doc(gymId).get();

        if (!gymDoc.exists) {
            return NextResponse.json({ message: 'Gym document not found' }, { status: 404 });
        }

        const gymData = gymDoc.data() || {};

        // Fetch member details
        let membersWithDetails = [];
        if (gymData.members && Array.isArray(gymData.members) && gymData.members.length > 0) {
            const memberPromises = gymData.members.map(async (memberId: string) => {
                try {
                    const memberDoc = await db.collection('App_user').doc(memberId).get();
                    if (memberDoc.exists) {
                        const memberData = memberDoc.data();
                        return {
                            userId: memberId,
                            name: memberData?.name || 'Unknown',
                            email: memberData?.email || 'N/A',
                            joinedAt: memberData?.createdAt || null
                        };
                    }
                    return null;
                } catch (error) {
                    console.error(`Error fetching member ${memberId}:`, error);
                    return null;
                }
            });

            const results = await Promise.all(memberPromises);
            membersWithDetails = results.filter(m => m !== null);
        }

        return NextResponse.json({
            gym: {
                id: gymDoc.id,
                ...gymData,
                membersWithDetails
            }
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error fetching gym:', error);
        return NextResponse.json({ message: 'Error fetching gym', error: error.message }, { status: 500 });
    }
}

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

        const userId = decodedToken.uid;
        const { name, logo, address, workingDays, contactNumber } = await req.json();

        // Check if user exists in App_user (logic from backend User.getById)
        const userDoc = await db.collection('App_user').doc(userId).get();
        if (!userDoc.exists) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const userData = userDoc.data();
        if (userData?.gymId) {
            return NextResponse.json({ message: 'User already owns or belongs to a gym' }, { status: 400 });
        }

        const gymData = {
            name,
            logo: logo || '',
            address,
            workingDays, // Array of days
            contactNumber,
            ownerId: userId,
            members: [userId],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Create Gym in Firestore
        const gymRef = await db.collection('App_user').doc('gyms').collection('gyms').add(gymData);

        // Update user with gymId in DynamoDB (replicated here as Firestore update)
        await db.collection('App_user').doc(userId).update({
            gymId: gymRef.id,
            role: 'gym_owner',
            updatedAt: new Date().toISOString()
        });

        return NextResponse.json({
            message: 'Gym created successfully',
            gym: { id: gymRef.id, ...gymData }
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error creating gym:', error);
        return NextResponse.json({ message: 'Error creating gym', error: error.message }, { status: 500 });
    }
}
