import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');
  const isPublicPage = !isAuthPage && !isDashboardPage;

  // Redirect ke login jika mencoba akses dashboard tanpa token
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Redirect ke dashboard jika sudah login tapi mencoba akses halaman auth
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Lanjutkan untuk halaman publik atau request yang valid
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
    '/',
  ],
};