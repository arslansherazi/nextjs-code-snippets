"use client"

import { revalidateCachePage, revalidateByTag } from "./actions"

export function RevalidatePathButton() {
  return (
    <form action={revalidateCachePage}>
      <button
        type="submit"
        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-foreground transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
      >
        Revalidate page
      </button>
    </form>
  )
}

export function RevalidateTagButton() {
  return (
    <form action={revalidateByTag}>
      <button
        type="submit"
        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-foreground transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
      >
        Revalidate tag
      </button>
    </form>
  )
}
