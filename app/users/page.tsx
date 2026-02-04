import { User } from "./types"
import SearchBox from "./SearchBox"

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
        <h1 className="mb-6 text-2xl font-semibold text-foreground">Users</h1>
        <SearchBox users={users} />
      </div>
    </main>
  )
}
