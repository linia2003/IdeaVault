import { NextResponse } from "next/server";

export function middleware(request) {
  
  const sessionToken = 
    request.cookies.get("better-auth.session_token") || 
    request.cookies.get("__secure-better-auth.session_token");

  if (!sessionToken) {
   
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  
  matcher: ["/add-idea", "/my-ideas", "/my-interactions"],
};