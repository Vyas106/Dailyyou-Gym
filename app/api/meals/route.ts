import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;
        
        const userDoc = await db.collection('App_user').doc(userId).get();
        const userData = userDoc.data();
        if (!userData?.gymId) {
            return NextResponse.json({ message: 'Gym not found' }, { status: 404 });
        }

        const gymId = userData.gymId;
        const { name, calories, protein, carbs, fats, servingSize, category, imageUrl } = await req.json();

        if (!name || !calories || !category) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const mealData = {
            name,
            calories: Number(calories),
            protein: Number(protein || 0),
            carbs: Number(carbs || 0),
            fats: Number(fats || 0),
            servingSize: servingSize || '1 serving',
            category, // breakfast, lunch, dinner, snack
            imageUrl: imageUrl || null,
            gymId,
            createdAt: new Date().toISOString()
        };

        const mealRef = await db.collection('App_user').doc('gyms').collection('gyms').doc(gymId).collection('meals').add(mealData);

        return NextResponse.json({
            success: true,
            meal: { id: mealRef.id, ...mealData }
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;
        
        const userDoc = await db.collection('App_user').doc(userId).get();
        const userData = userDoc.data();
        if (!userData?.gymId) {
            return NextResponse.json({ message: 'Gym not found' }, { status: 404 });
        }

        const gymId = userData.gymId;
        const snapshot = await db.collection('App_user').doc('gyms').collection('gyms').doc(gymId).collection('meals').get();

        const meals = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({ success: true, meals }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });
    }
}
