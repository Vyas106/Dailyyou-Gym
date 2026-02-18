import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebaseAdmin';
import { getStorage } from 'firebase-admin/storage';

// Helper to get buffer from request body (which might be FormData)
// Since Next.js App Router Request is standard Web Request, we can use formData()
export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized: Missing or invalid token' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        try {
            await auth.verifyIdToken(token);
        } catch (error) {
            return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;

        const bucket = getStorage().bucket();
        const fileRef = bucket.file(`uploads/${filename}`);

        await fileRef.save(buffer, {
            metadata: {
                contentType: file.type,
            },
        });

        await fileRef.makePublic();

        // Construct public URL. 
        // Note: verify your bucket public access settings or use signed URLs if preferred.
        // publicUrl() method returns specific format, or we can construct it manually.
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileRef.name}`;

        return NextResponse.json({ url: publicUrl }, { status: 200 });

    } catch (error: any) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ message: 'Error uploading file', error: error.message }, { status: 500 });
    }
}
