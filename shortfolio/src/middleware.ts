import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import authServiceObject from './app/appwrite';
import { useEffect } from 'react';


export async function middleware(request: NextRequest) {

    // GETTING THE CURRENT PATH OF THE USER
    const currentPath = request.nextUrl.pathname;

    // WRITING DOWN ALL THE PUBLIC PATHS WHICH CAN BE ACCESSED DIRECTLY
    const publicPaths = ['/', '/login', '/signup'];

    // LOGIN TOKEN OF THE USER TO CHECK IF THE USER IS LOGGED IN OR NOT
    const token = request.cookies.get("a_session_669e6a90003e0c39529c")?.value;

    console.log('Current Path:', currentPath);
    console.log('Login Token:', token);
    

    // CHECK IF THE CURRENT PATH IS A PUBLIC PATH
    const isPublicPath = publicPaths.includes(currentPath);

    // IF USER IS TRYING TO GO TO A PUBLIC PATH AND IF HE IS LOGGED IN, THEN REDIRECT HIM AGAIN TO THE USER PROFILE PAGE
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/user', request.url));
    }

    // IF USER IS TRYING TO ACCESS A PROTECTED PATH AND THEY ARE NOT LOGGED IN, REDIRECT TO THE HOME PAGE
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/', request.url));
    }


    const userProfilePathPattern = /^\/user\/.*$/;

    if (userProfilePathPattern.test(currentPath) && !token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  
}


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