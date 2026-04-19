import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { api } from './app/(marketing)/hooks/api';

export default async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();

  const cookie = request.cookies.get('connect.sid');
  if (cookie) {
    // The cookie could be for an invalid session, check /me to know if we are logged in
    try {
      const res = await api.get('/me', { headers: {
        'Cookie': `connect.sid=${cookie.value}`
      }});

      console.log(res.data);
      url.pathname = '/';
      return NextResponse.redirect(url);
    } catch (err: any) {
      console.log(err);
    }
  }

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: '/login',
};
