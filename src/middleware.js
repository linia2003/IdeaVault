import { NextResponse } from "next/server";

export function middleware(request) {
  // Read our standard cookie string natively without triggering any database handshakes
  const token = request.cookies.get("better-auth.session_token")?.value;

  // List of paths that require authentication matching your assignment criteria
  const protectedRoutes = ["/add-idea", "/my-ideas", "/my-interactions"];
  const isProtected = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  if (isProtected && !token) {
    // Save target path location in parameter memory and redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Capture all routes except core app files
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};