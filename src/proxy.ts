
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/utils/session';

export async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define protected routes
    const isAdminRoute = path.startsWith('/admin');
    const isSellerRoute = path.startsWith('/dashboard') || path.startsWith('/sellers/dashboard');
    const isDeliveryRoute = path.startsWith('/delivery') || path.startsWith('/delivery/dashboard');
    const isBuyerRoute = path.startsWith('/orders') || path.startsWith('/account');

    // Define public auth routes (to redirect if already logged in)
    const isAuthRoute = path.startsWith('/auth');

    // Get Session
    const session = await getSession();

    // 1. Redirect if accessing auth pages while logged in
    if (isAuthRoute && session) {
        if (session.role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        if (session.role === 'seller') return NextResponse.redirect(new URL('/dashboard', request.url));
        if (session.role === 'delivery_manager') return NextResponse.redirect(new URL('/delivery/dashboard', request.url));
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 2. Protect Admin Routes
    if (isAdminRoute) {
        if (!session) return NextResponse.redirect(new URL('/auth/signin', request.url));
        if (session.role !== 'admin') return NextResponse.redirect(new URL('/', request.url));
    }

    // 3. Protect Seller Routes
    if (isSellerRoute) {
        if (!session) return NextResponse.redirect(new URL('/auth/signin', request.url));
        if (session.role !== 'seller' && session.role !== 'admin') return NextResponse.redirect(new URL('/', request.url));
    }

    // 4. Protect Delivery Routes
    if (isDeliveryRoute) {
        if (!session) return NextResponse.redirect(new URL('/auth/signin', request.url));
        if (session.role !== 'delivery_manager' && session.role !== 'admin') return NextResponse.redirect(new URL('/', request.url));
    }

    // 5. Protect Buyer Routes
    if (isBuyerRoute) {
        if (!session) return NextResponse.redirect(new URL('/auth/signin', request.url));
        // Any role can access basic account/orders usually, or just buyers? 
        // Admins/Sellers also have "Buyer" capabilities usually? 
        // For now, allow logged in users.
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files if any
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
