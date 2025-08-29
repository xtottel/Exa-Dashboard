
// dashboard/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/apps/home", "/home", "/settings/profile"];
const authRoutes = ["/login", "/signup", "/forgot-password"];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const publicRoutes = ["/", "/verify-email", "/reset-password", "/resend-verification"];

// API base URL for backend requests
//const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:2806";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("🔍 Middleware processing:", pathname);

  // ✅ Allow static & image requests
  if (
    pathname.startsWith("/_next") ||
    pathname.includes(".") // skip files
  ) {
    console.log("📁 Static file request, skipping middleware");
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.includes(pathname);

  console.log("📊 Route analysis:", {
    pathname,
    isProtectedRoute,
    isAuthRoute
  });

  // ✅ Get token from cookies or headers
  const token = request.cookies.get("token")?.value || 
                request.cookies.get("sessionToken")?.value;
  console.log("🍪 Token from cookies:", token ? "Present" : "Missing");

  // ✅ For protected routes, verify with backend
  if (isProtectedRoute) {
    console.log("🛡️ Protected route detected, verifying auth...");
    const isAuthenticated = await verifyAuth(token);
    console.log("🔐 Auth verification result:", isAuthenticated);
    
    if (!isAuthenticated) {
      console.log("❌ Not authenticated, redirecting to login");
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    } else {
      console.log("✅ Authenticated, allowing access to:", pathname);
    }
  }

  // ✅ Prevent logged-in users from visiting login/signup
  if (isAuthRoute && token) {
    console.log("🚫 Auth route detected with token, checking if valid...");
    const isAuthenticated = await verifyAuth(token);
    console.log("🔐 Auth verification result for auth route:", isAuthenticated);
    
    if (isAuthenticated) {
      console.log("✅ Already authenticated, redirecting to home");
      return NextResponse.redirect(new URL("/home", request.url));
    } else {
      console.log("❌ Invalid token, allowing access to auth route");
      // Clear invalid tokens
      const response = NextResponse.next();
      response.cookies.delete("token");
      response.cookies.delete("sessionToken");
      return response;
    }
  }

  console.log("➡️ Allowing request to proceed");
  return NextResponse.next();
}

// 🔒 Verify token with backend
async function verifyAuth(token: string | undefined): Promise<boolean> {
  if (!token) {
    console.log("❌ No token provided for verification");
    return false;
  }

  try {
    console.log("🔐 Verifying token with backend...");
    const verifyRes = await fetch(`https://onclick.sendexa.co/api/auth/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    console.log("📨 Verification response:", {
      status: verifyRes.status,
      statusText: verifyRes.statusText,
      ok: verifyRes.ok
    });

    if (verifyRes.ok) {
      try {
        const userData = await verifyRes.json();
        console.log("✅ Token valid, user details:", userData.user?.email);
        return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        console.log("✅ Token valid (no user data in response)");
        return true;
      }
    } else {
      console.log("❌ Token verification failed");
      return false;
    }
  } catch (error) {
    console.error("❌ Auth verification error:", error);
    return false;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};