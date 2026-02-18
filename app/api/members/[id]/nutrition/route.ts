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

        const { id: memberId } = await params;
        const { searchParams } = new URL(req.url);
        const dateParam = searchParams.get('date');
        const rangeParam = searchParams.get('range') || '24h';

        // Simplify nutrition fetching logic
        // Assuming meals are stored in 'meals' subcollection under user
        const mealsRef = db.collection('App_user').doc(memberId).collection('meals');

        let query: FirebaseFirestore.Query = mealsRef;
        let startDate: Date;
        let endDate: Date = new Date(); // Current time

        if (rangeParam === '24h' && dateParam) {
            startDate = new Date(dateParam);
            startDate.setHours(0, 0, 0, 0);

            const nextDay = new Date(startDate);
            nextDay.setDate(startDate.getDate() + 1);
            endDate = nextDay;
        } else if (rangeParam === '7d') {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
        } else if (rangeParam === '15d') {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 15);
        } else if (rangeParam === '30d') {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
        } else {
            // Default to today
            startDate = new Date();
            startDate.setHours(0, 0, 0, 0);
        }

        query = query.where('createdAt', '>=', startDate.toISOString()).where('createdAt', '<', endDate.toISOString());

        const snapshot = await query.get();
        const mealsList = snapshot.docs.map(doc => ({
            mealId: doc.id,
            ...doc.data()
        }));

        // Calculate totals
        const totals = mealsList.reduce((acc, meal: any) => ({
            calories: acc.calories + (Number(meal.calories) || 0),
            protein: acc.protein + (Number(meal.protein) || 0),
            carbohydrates: acc.carbohydrates + (Number(meal.carbohydrates) || 0),
            fats: acc.fats + (Number(meal.fats) || 0),
            mealCount: acc.mealCount + 1
        }), { calories: 0, protein: 0, carbohydrates: 0, fats: 0, mealCount: 0 });

        // If range > 24h, calculate averages
        if (rangeParam !== '24h') {
            const days = rangeParam === '7d' ? 7 : rangeParam === '15d' ? 15 : 30;
            totals.calories /= days;
            totals.protein /= days;
            totals.carbohydrates /= days;
            totals.fats /= days;
            // mealCount usually stays as total count or avg? Frontend label says "Avg", keeping consistent with that.
        }

        return NextResponse.json({ mealsList, totals }, { status: 200 });

    } catch (error: any) {
        console.error('Error fetching member nutrition:', error);
        return NextResponse.json({ message: 'Error fetching member nutrition', error: error.message }, { status: 500 });
    }
}
