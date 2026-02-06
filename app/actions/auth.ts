"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const TEST_EMAIL = "test@example.com"
const TEST_PASSWORD = "password123"

export async function login(formData: FormData) {
  const email = formData.get("email")
  const password = formData.get("password")

  if (email !== TEST_EMAIL || password !== TEST_PASSWORD) {
    throw new Error("Invalid credentials")
  }

  // simulate token
  const cookieStore = await cookies()
  cookieStore.set("auth_token", "mock-token", {
    httpOnly: true, // Prevents JavaScript access (XSS protection)
    secure: true, // Only sent over HTTPS connections
    sameSite: "lax", // CSRF protection: sent with same-site requests and top-level navigations
    path: "/", // Cookie available across entire site
  })

  redirect("/users")
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("auth_token")
  redirect("/login")
}
