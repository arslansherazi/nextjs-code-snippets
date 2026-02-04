import { User } from "./types"

type Props = {
  users: User[]
}

export default function UserList({ users }: Props) {
  if (users.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400">No users found</p>
  }

  return (
    <ul className="divide-y divide-gray-200 rounded-md border border-gray-200 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
      {users.map(user => (
        <li key={user.id} className="px-4 py-3 text-foreground">
          <span className="font-medium">{user.name}</span>
          <span className="text-gray-500 dark:text-gray-400"> — {user.email}</span>
        </li>
      ))}
    </ul>
  )
}
