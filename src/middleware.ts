import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.href.endsWith(".html")) {
    return NextResponse.redirect(
      request.nextUrl.href.replaceAll(".html", ""),
      { status: 301 }
    );
  }

  return NextResponse.next();
}
