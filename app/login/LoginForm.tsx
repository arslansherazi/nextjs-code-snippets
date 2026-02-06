"use client"

import { login } from "../actions/auth"
import { useFormStatus } from "react-dom"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-offset-gray-900"
    >
      {pending ? "Logging in..." : "Login"}
    </button>
  )
}

export default function LoginForm() {
  return (
    <form action={login} className="space-y-4">
      <div>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-foreground placeholder:text-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:placeholder:text-gray-400 dark:focus:border-gray-400 dark:focus:ring-gray-400"
        />
      </div>
      <div>
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-foreground placeholder:text-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:placeholder:text-gray-400 dark:focus:border-gray-400 dark:focus:ring-gray-400"
        />
      </div>
      <SubmitButton />
    </form>
  )
}
