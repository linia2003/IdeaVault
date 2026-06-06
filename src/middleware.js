import { NextResponse } from "next/server";

export function middleware(request) {
  // Direct token lookup allows the middleware to pass without loading database clients
  const token = 
    request.cookies.get("better-auth.session_token") || 
    request.cookies.get("__secure-better-auth.session_token");

  if (!token) {
    // Redirect unauthenticated visitors straight to the login route with a redirect parameter
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/add-idea", "/my-ideas", "/my-interactions"],
};