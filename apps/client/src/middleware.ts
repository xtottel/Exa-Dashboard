// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/apps/home", "/home", "/apps/profile"];
const authRoutes = ["/login", "/signup", "/forgot-password"];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const publicRoutes = ["/", "/verify-email", "/reset-password", "/resend-verification"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle CORS for API routes
  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next();
    const origin = request.headers.get("origin");

    if (origin && origin.endsWith("sendexa.co")) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }

    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }

    return response;
  }

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.includes(pathname);
  const token = request.cookies.get("token")?.value;

  // ✅ Shortcut: if token exists and user is going to /home, let them in directly
  if (pathname === "/home" && token) {
    return NextResponse.next();
  }

  // For other protected routes, verify with API
  const isAuthenticated = await verifyAuth(token);

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

// ✅ Verify token via backend
async function verifyAuth(token: string | undefined): Promise<boolean> {
  if (!token) return false;

  try {
    const verifyRes = await fetch("https://onetime.sendexa.co/api/auth/verify", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return verifyRes.ok;
  } catch (error) {
    console.error("Auth verification error:", error);
    return false;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
