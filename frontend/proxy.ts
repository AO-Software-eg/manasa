import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export default function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  console.log(url);
  return NextResponse.rewrite(url);
}

export const config = {};
