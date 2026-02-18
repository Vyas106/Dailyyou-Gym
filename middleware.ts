import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get auth status from cookie/header (in our case, we rely on client-side checks)
    // Since we're using localStorage, middleware can't check auth directly
    // So we'll just allow all routes and handle redirects client-side

    return NextResponse.next();
}

// Note: With client-side auth (localStorage), middleware can't directly check auth status
// Auth checks are handled in each page component using useAuth hook
// For production, consider using cookies or server-side session management

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
