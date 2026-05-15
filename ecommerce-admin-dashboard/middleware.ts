import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseJwtRole(token: string | null) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
    return decoded.role || null;
  } catch (e) {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // public paths
  if (pathname.startsWith('/login') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // protect admin paths
  const adminPaths = ['/dashboard', '/products', '/categories', '/orders', '/users', '/settings', '/cart'];
  const isAdminPath = adminPaths.some(p => pathname === p || pathname.startsWith(p + '/'));
  if (!isAdminPath) return NextResponse.next();

  const token = req.cookies.get('accessToken')?.value || null;
  const role = parseJwtRole(token);

  if (!token || role !== 'admin') {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/(dashboard|products|categories|orders|users|settings|cart)(/:path*)'],
};
