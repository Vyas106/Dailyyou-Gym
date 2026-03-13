import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebaseAdmin';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
});

async function getSignedImageUrl(s3Url: string | null): Promise<string | null> {
    if (!s3Url || !s3Url.includes('amazonaws.com')) return s3Url;
    try {
        const urlParts = s3Url.split('.com/');
        if (urlParts.length < 2) return s3Url;
        const key = decodeURIComponent(urlParts[1]);
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME || 'dailyyou',
            Key: key,
        });
        return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } catch (error) {
        console.error('Error signing URL:', error);
        return s3Url;
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized: Missing or invalid token' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        try {
            await auth.verifyIdToken(token);
        } catch (error) {
            console.error('Token verification failed:', error);
            return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
        }

        const { id: memberId } = await params;
        const { searchParams } = new URL(req.url);
        const dateParam = searchParams.get('date'); // Expects YYYY-MM-DD
        const rangeParam = searchParams.get('range') || '24h';

        const mealsRef = db.collection('App_user').doc(memberId).collection('meals');

        let startDate: Date;
        let endDate: Date = new Date();

        if (rangeParam === '24h' && dateParam) {
            // Fix: Create date from YYYY-MM-DD in LOCAL time of the server/user intent
            const [year, month, day] = dateParam.split('-').map(Number);
            startDate = new Date(year, month - 1, day, 0, 0, 0, 0);

            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 1);
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
            startDate = new Date();
            startDate.setHours(0, 0, 0, 0);
        }

        // Query using ISO strings for comparison
        const snapshot = await mealsRef
            .where('createdAt', '>=', startDate.toISOString())
            .where('createdAt', '<', endDate.toISOString())
            .get();

        const mealsList = await Promise.all(snapshot.docs.map(async (doc) => {
            const data = doc.data();
            const imageUrl = await getSignedImageUrl(data.imageUrl);
            return {
                mealId: doc.id,
                ...data,
                imageUrl
            };
        }));

        // Calculate totals
        const totals = mealsList.reduce((acc, meal: any) => ({
            calories: acc.calories + (Number(meal.calories) || 0),
            protein: acc.protein + (Number(meal.protein) || 0),
            carbohydrates: acc.carbohydrates + (Number(meal.carbohydrates) || 0),
            fats: acc.fats + (Number(meal.fats) || 0),
            mealCount: acc.mealCount + 1
        }), { calories: 0, protein: 0, carbohydrates: 0, fats: 0, mealCount: 0 });

        if (rangeParam !== '24h') {
            const days = rangeParam === '7d' ? 7 : rangeParam === '15d' ? 15 : 30;
            totals.calories /= days;
            totals.protein /= days;
            totals.carbohydrates /= days;
            totals.fats /= days;
        }

        return NextResponse.json({ mealsList, totals }, { status: 200 });

    } catch (error: any) {
        console.error('Error fetching member nutrition:', error);
        return NextResponse.json({ message: 'Error fetching member nutrition', error: error.message }, { status: 500 });
    }
}
