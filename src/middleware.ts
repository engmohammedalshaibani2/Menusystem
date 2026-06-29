import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

function addCorsHeaders(response: NextResponse, origin: string) {
  const allowOrigin = origin && origin !== "null" ? origin : "*";
  response.headers.set("Access-Control-Allow-Origin", allowOrigin);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Vary", "Origin");
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get("origin") || "";

  // CORS preflight
  if (request.method === "OPTIONS") {
    return addCorsHeaders(new NextResponse(null, { status: 204 }), origin);
  }

  // Routes that never require auth
  const publicPaths = ["/_next", "/uploads", "/favicon.ico", "/api/auth/login"];
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));
  if (isPublic || pathname === "/admin/login") {
    return addCorsHeaders(NextResponse.next(), origin);
  }

  // Determine if this route needs authentication
  const needsAuth =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/categories") ||
    pathname.startsWith("/api/menu-items") ||
    pathname.startsWith("/api/offers") ||
    pathname.startsWith("/api/users") ||
    pathname.startsWith("/api/settings") ||
    pathname.startsWith("/api/uploads");

  if (needsAuth) {
    const token = request.cookies.get("session")?.value;
    if (!token) {
      if (pathname.startsWith("/api/")) {
        return addCorsHeaders(
          NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }),
          origin
        );
      }
      return addCorsHeaders(
        NextResponse.redirect(new URL("/admin/login", request.url)),
        origin
      );
    }
    const payload = await verifyToken(token);
    if (!payload) {
      if (pathname.startsWith("/api/")) {
        return addCorsHeaders(
          NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }),
          origin
        );
      }
      return addCorsHeaders(
        NextResponse.redirect(new URL("/admin/login", request.url)),
        origin
      );
    }
  }

  return addCorsHeaders(NextResponse.next(), origin);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
