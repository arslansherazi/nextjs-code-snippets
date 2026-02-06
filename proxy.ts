import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  const pathname = request.nextUrl.pathname

  // Protect /users routes - require authentication
  if (pathname.startsWith("/users")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect authenticated users away from /login
  if (pathname.startsWith("/login")) {
    if (token) {
      const usersUrl = new URL("/users", request.url)
      return NextResponse.redirect(usersUrl)
    }
  }

  // Allow request to continue
  return NextResponse.next()
}

export const config = {
  // Define which routes this middleware should run on
  // Only runs on matching paths, improving performance by skipping unnecessary routes
  matcher: [
    "/users/:path*", // Matches /users and all sub-paths (e.g., /users, /users/123, /users/profile)
    "/login", // Matches exactly /login route
  ],
}
