import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log(session);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = session.user.role;

  //   Cek akses route
  if (request.nextUrl.pathname.startsWith("/opd") && role !== "OPD") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/admin") && role !== "Admin") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/admin/:path*", "/opd/:path*"],
};
