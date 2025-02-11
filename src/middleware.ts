// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";
// export { default } from "next-auth/middleware";
// import { getToken } from "next-auth/jwt";

// export async function middleware(request: NextRequest) {
//   const token = await getToken({ req: request });
//   const url = request.nextUrl;

//   if (
//     (token && url.pathname.startsWith("/sign-in")) ||
//     url.pathname.startsWith("/sign-up") ||
//     url.pathname.startsWith("/verify")
//   ) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }
//   return NextResponse.redirect(new URL("/", request.url));
// }

// export const config = {
//   matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  const isAuthPage =
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/sign-up") ||
    url.pathname.startsWith("/verify");

  // If the user is authenticated and trying to access an auth page, redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If the user is not authenticated and trying to access a protected route, redirect to sign-in
  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Allow other requests to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/verify/:path*", "/dashboard/:path*"],
};