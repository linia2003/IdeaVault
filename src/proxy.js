import { NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  // Target route matchers matched for IdeaVault requirements
  matcher: ["/my-ideas", "/add-idea", "/my-interactions"],
};