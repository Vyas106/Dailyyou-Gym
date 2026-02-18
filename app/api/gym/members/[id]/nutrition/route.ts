import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebaseAdmin';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await auth.verifyIdToken(token);
        const gymOwnerId = decodedToken.uid;
        const memberId = params.id;

        const { searchParams } = new URL(req.url);
        const date = searchParams.get('date');
        const range = searchParams.get('range');

        // Verify gym owner
        const ownerDoc = await db.collection('App_user').doc(gymOwnerId).get();
        if (!ownerDoc.exists || !ownerDoc.data()?.gymId) {
            return NextResponse.json({ message: 'You do not own a gym' }, { status: 404 });
        }

        const gymId = ownerDoc.data()?.gymId;
        const gymDoc = await db.collection('App_user').doc('gyms').collection('gyms').doc(gymId).get();

        if (!gymDoc.exists) {
            return NextResponse.json({ message: 'Gym not found' }, { status: 404 });
        }

        // Verify member belongs to this gym
        const gymMembers = gymDoc.data()?.members || [];
        if (!gymMembers.includes(memberId)) {
            return NextResponse.json({ message: 'This member does not belong to your gym' }, { status: 403 });
        }

        // Calculate Date Range
        let startDateStr = date || new Date().toISOString().split('T')[0];
        let endDateStr = date || new Date().toISOString().split('T')[0];
        let daysCount = 1;

        if (range) {
            const endDate = new Date();
            const startDate = new Date();
            const days = parseInt(range) || 1;

            if (range === '24h') {
                daysCount = 1;
                const today = new Date().toISOString().split('T')[0];
                startDateStr = today;
                endDateStr = today;
            } else {
                daysCount = days;
                startDate.setDate(startDate.getDate() - days + 1);
                startDateStr = startDate.toISOString().split('T')[0];
                endDateStr = endDate.toISOString().split('T')[0];
            }
        }

        const startTimestamp = `${startDateStr}T00:00:00.000Z`;
        const endTimestamp = `${endDateStr}T23:59:59.999Z`;

        // Fetch Meals
        const mealsSnapshot = await db.collection('App_user').doc(memberId)
            .collection('meals')
            .where('createdAt', '>=', startTimestamp)
            .where('createdAt', '<=', endTimestamp)
            .get();

        const meals = mealsSnapshot.docs.map(doc => doc.data());

        // Calculate totals
        const totals = meals.reduce((acc, meal) => ({
            calories: acc.calories + (meal.calories || 0),
            protein: acc.protein + (meal.protein || 0),
            carbohydrates: acc.carbohydrates + (meal.carbohydrates || 0),
            fats: acc.fats + (meal.fats || 0),
            mealCount: acc.mealCount + 1
        }), {
            calories: 0,
            protein: 0,
            carbohydrates: 0,
            fats: 0,
            mealCount: 0
        });

        // Averages
        if (daysCount > 1) {
            const memberDoc = await db.collection('App_user').doc(memberId).get();
            let adjustedDivisor = daysCount;

            if (memberDoc.exists && memberDoc.data()?.createdAt) {
                const joinedAt = new Date(memberDoc.data()?.createdAt);
                const today = new Date();
                const daysSinceJoined = Math.floor((today.getTime() - joinedAt.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                adjustedDivisor = Math.max(1, Math.min(daysCount, daysSinceJoined));
            }

            totals.calories = totals.calories / adjustedDivisor;
            totals.protein = totals.protein / adjustedDivisor;
            totals.carbohydrates = totals.carbohydrates / adjustedDivisor;
            totals.fats = totals.fats / adjustedDivisor;
            totals.isAverage = true;
        }

        // Fetch Latest Progress (Weight) - Optional but good for UI
        // Assuming 'progress' subcollection exists, logic similar to 'meals'
        // For now, skip or implement if needed. 
        // GymController fetched it.
        let latestProgress = null;
        // implementation for progress reserved for later if needed.

        return NextResponse.json({
            memberId,
            date: startDateStr,
            range: range || '24h',
            meals: range && range !== '24h' ? [] : meals,
            mealsList: !range || range === '24h' ? meals : [],
            totals
        });

    } catch (error: any) {
        console.error('Error fetching member nutrition:', error);
        return NextResponse.json({ message: 'Error fetching member nutrition', error: error.message }, { status: 500 });
    }
}
