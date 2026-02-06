import { User } from "./types"
import SearchBox from "./SearchBox"
import { logout } from "../actions/auth"

async function getUsers(): Promise<User[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/users", {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch users")
  }

  return res.json()
}

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Users</h1>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-foreground transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
            >
              Logout
            </button>
          </form>
        </div>
        <SearchBox users={users} />
      </div>
    </main>
  )
}
