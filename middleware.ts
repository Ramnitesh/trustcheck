import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthUserFromRequest } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const user = await getAuthUserFromRequest(request);
    
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    const user = await getAuthUserFromRequest(request);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
