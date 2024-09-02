import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

    const currentPath = request.nextUrl.pathname;

    const publicPaths = ['/', '/login', '/signup'];

    const isPublicPath = publicPaths.includes(currentPath);

    const cookieToken = request.cookies.get("userCookie")?.value || '';

    // IF USER IS TRYING TO GO TO A PUBLIC PATH AND IF HE IS LOGGED IN, THEN REDIRECT HIM AGAIN TO THE USER PROFILE PAGE
    if (isPublicPath && cookieToken) {
        return NextResponse.redirect(new URL('/user/:path*', request.url));
    }

    // IF USER IS TRYING TO ACCESS A PROTECTED PATH AND THEY ARE NOT LOGGED IN, REDIRECT TO THE HOME PAGE
    if (!isPublicPath && !cookieToken) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    const userProfilePathPattern = /^\/user\/.*$/;

    if (userProfilePathPattern.test(currentPath) && !cookieToken) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();

}
 
// See "Matching Paths" below to learn more
export const config = {
    matcher: [
      '/',
      '/login',
      '/signup',
      '/enterDetails',
      '/signupComplete',
      '/user/:path*'
    ]
  }
