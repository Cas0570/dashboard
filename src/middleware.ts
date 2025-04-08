import { NextRequest, NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/server/appwrite";

export default async function middleware(req: NextRequest) {
  // Extract the pathname for easier checks
  const { pathname } = req.nextUrl;

  // Check for auth session
  const user = await getLoggedInUser();
  const isVerified = user?.emailVerification;

  // Define route categories
  const isAuthRoute = pathname.startsWith('/admin/signin') || 
                      pathname.startsWith('/admin/signup');
  
  const isVerificationRoute = pathname.startsWith('/admin/await-verification');
  
  const isAdminRoute = pathname.startsWith('/admin') && 
                       !isAuthRoute && 
                       !isVerificationRoute;

  // Handle admin routes - require verified user
  if (isAdminRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/signin', req.url));
    }
    
    if (user && !isVerified) {
      return NextResponse.redirect(new URL('/admin/await-verification', req.url));
    }
  }

  // Handle auth routes - only accessible without session
  if (isAuthRoute && user) {
    // If user exists but is not verified, redirect to verification page
    if (!isVerified) {
      return NextResponse.redirect(new URL('/admin/await-verification', req.url));
    }
    // If user exists and is verified, redirect to dashboard
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  // Handle verification route - only accessible with unverified session
  if (isVerificationRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/signin', req.url));
    }
    
    if (user && isVerified) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

// Paths to exclude from middleware processing
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$).*)']
};