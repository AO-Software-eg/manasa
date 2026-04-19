import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { api } from './app/(marketing)/hooks/api';
import { ur } from 'zod/v4/locales';
import { requestToBodyStream } from 'next/dist/server/body-streams';

export default async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const sessionCookie = request.cookies.get('connect.sid');

  if (url.pathname == '/login') {
    if (sessionCookie) {
      // The cookie could be for an invalid session, check /me to know if we are logged in
      try {
        const res = await api.get('/me', {
          headers: {
            Cookie: `connect.sid=${sessionCookie.value}`,
          },
        });

        url.pathname = '/';
        return NextResponse.redirect(url);
      } catch (err: any) {
        console.log(err);
      }
    }
  } else if (url.pathname.endsWith('/dashboard')) {
    if (sessionCookie) {
      try {
        const res = await api.get('/me', {
          headers: {
            Cookie: `connect.sid=${sessionCookie.value}`,
          },
        });
        // Logged in, let them access
        console.log(res.status);
      } catch (err: any) {
        console.log(err);

        // Don't let them access the dashboard, redirect
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    } else {
      // Not logged in, redirect

      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/login', '/(.*?)/dashboard'],
};
