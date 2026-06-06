import { NextResponse } from "next/server";


export async function GET(request) {
  return NextResponse.json({ status: "mock_auth_mode_active", user: null });
}

export async function POST(request) {
  return NextResponse.json({ status: "mock_auth_mode_active", user: null });
}