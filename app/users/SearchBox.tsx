"use client"

import { useState } from "react"
import { User } from "./types"
import UserList from "./UserList"

type Props = {
  users: User[]
}

export default function SearchBox({ users }: Props) {
  const [search, setSearch] = useState("")

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <input
        type="search"
        placeholder="Search users"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-foreground placeholder:text-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:placeholder:text-gray-400 dark:focus:border-gray-400 dark:focus:ring-gray-400"
      />
      <UserList users={filteredUsers} />
    </div>
  )
}
