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

        // Check user and gym
        const userDoc = await db.collection('App_user').doc(userId).get();
        if (!userDoc.exists) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const userData = userDoc.data();
        if (!userData?.gymId) {
            return NextResponse.json({ message: 'Gym not found' }, { status: 404 });
        }

        const gymId = userData.gymId;

        // 1. Fetch all plans for this gym
        const plansSnapshot = await db.collection('App_user').doc('gyms').collection('gyms').doc(gymId).collection('plans').get();
        const plans = plansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const plansMap = plans.reduce((acc: any, plan: any) => {
            acc[plan.id] = plan;
            return acc;
        }, {});

        // 2. Fetch all members and their profile details
        const gymDoc = await db.collection('App_user').doc('gyms').collection('gyms').doc(gymId).get();
        const gymData = gymDoc.data();
        const memberIds = gymData?.members || [];

        const membersWithPayments: any[] = [];
        let totalRevenue = 0;
        let activeSubscriptions = 0;

        if (memberIds.length > 0) {
            const memberPromises = memberIds.map(async (mId: string) => {
                const mDoc = await db.collection('App_user').doc(mId).get();
                if (mDoc.exists) {
                    const mData = mDoc.data();
                    const planId = mData?.planId;
                    const discount = mData?.discount || 0;
                    const plan = planId ? plansMap[planId] : null;

                    let amount = 0;
                    if (plan) {
                        const basePrice = Number(plan.price) || 0;
                        amount = basePrice - (basePrice * (discount / 100));
                        totalRevenue += amount;
                        activeSubscriptions++;
                    }

                    return {
                        userId: mId,
                        name: mData?.name || 'Unknown',
                        email: mData?.email || 'N/A',
                        planName: plan ? plan.name : 'No Plan',
                        planPrice: plan ? plan.price : 0,
                        discount: discount,
                        paidAmount: amount,
                        joinedAt: mData?.joinedAt || mData?.createdAt || null
                    };
                }
                return null;
            });

            const results = await Promise.all(memberPromises);
            results.forEach(res => {
                if (res) membersWithPayments.push(res);
            });
        }

        // Mock some growth data for the chart if needed, or just return the totals
        // For a more advanced version, we'd have a 'payments' collection

        return NextResponse.json({
            success: true,
            stats: {
                totalRevenue,
                totalMembers: memberIds.length,
                activeSubscriptions,
                averageRevenuePerMember: memberIds.length > 0 ? totalRevenue / memberIds.length : 0
            },
            members: membersWithPayments,
            plans: plans
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error fetching revenue data:', error);
        return NextResponse.json({ message: 'Error fetching revenue data', error: error.message }, { status: 500 });
    }
}
