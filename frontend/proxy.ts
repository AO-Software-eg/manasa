import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isLoggedIn(request: NextRequest): boolean {
  return !!request.cookies.get('user_token');
}

export default function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const loggedIn = isLoggedIn(request);

  if (url.pathname === '/login' || url.pathname === '/signup') {
    if (loggedIn) {
      url.pathname = '/user';
      return NextResponse.redirect(url);
    }
  }

  if (url.pathname.startsWith('/user')) {
    if (!loggedIn) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/signup', '/user/:path*'],
};