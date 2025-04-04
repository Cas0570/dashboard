import { NextRequest, NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/server/appwrite";

export default async function middleware(req: NextRequest) {
  // Define the protected routes and public auth routes
  const isAdminAuthRoute = req.nextUrl.pathname.startsWith('/admin/signin') || 
                          req.nextUrl.pathname.startsWith('/admin/signup') ||
                          req.nextUrl.pathname.startsWith('/admin/await-verification');
  
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/') &&
                          !req.nextUrl.pathname.startsWith('/admin/signin') &&
                          !req.nextUrl.pathname.startsWith('/admin/signup') &&
                          !req.nextUrl.pathname.startsWith('/admin/await-verification');
  
  // Check for auth session
  const user = await getLoggedInUser();
  const isVerified = user?.emailVerification;
  
  // If accessing a protected route without a session, redirect to signin
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/admin/signin', req.url));
  }

  // If accessing a protected route without being verified, redirect to waiting page
  if (isProtectedRoute && user && !isVerified) {
    return NextResponse.redirect(new URL('/admin/await-verification', req.url));
  }
  
  // If accessing auth routes with a session, redirect to dashboard
  if (isAdminAuthRoute && user && isVerified) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  return NextResponse.next();
}

// Paths to exclude from middleware processing
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$).*)']
};