import { NextRequest, NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/server/appwrite";

export default async function middleware(req: NextRequest) {
  // Define the protected routes and public auth routes
  const isAdminAuthRoute = req.nextUrl.pathname.startsWith('/admin/signin') || 
                          req.nextUrl.pathname.startsWith('/admin/signup');
  
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/') &&
                          !req.nextUrl.pathname.startsWith('/admin/signin') &&
                          !req.nextUrl.pathname.startsWith('/admin/signup');
  
  // Check for auth session
  const user = await getLoggedInUser();
  
  // If accessing a protected route without a session, redirect to signin
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/admin/signin', req.url));
  }
  
  // If accessing auth routes with a session, redirect to dashboard
  if (isAdminAuthRoute && user) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  return NextResponse.next();
}

// Paths to exclude from middleware processing
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$).*)']
};