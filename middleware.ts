import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // Not logged in — redirect to auth
  if (!session && pathname !== '/auth') {
    if (
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/applications') ||
      pathname.startsWith('/profile') ||
      pathname.startsWith('/notifications') ||
      pathname.startsWith('/saved-jobs')
    ) {
      return NextResponse.redirect(new URL('/auth', req.url));
    }
  }

  // Logged in — protect admin routes
  if (session && pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/applications/:path*',
    '/profile/:path*',
    '/notifications/:path*',
    '/saved-jobs/:path*',
  ],
};
