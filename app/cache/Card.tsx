function time(ms: number) {
  return new Date(ms).toLocaleTimeString()
}

type CardProps = {
  title: string
  note: string
  description: string
  fetchedAt: number
  action?: React.ReactNode
}

export default function Card({ title, note, description, fetchedAt, action }: CardProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-2 text-lg text-foreground">{title}</h2>
      <p className="mb-4 font-mono text-xs text-gray-500 dark:text-gray-400">{note}</p>
      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      <p className="mb-4 font-mono text-sm text-foreground">Fetched at: {time(fetchedAt)}</p>
      {action && <div className="mt-2">{action}</div>}
    </section>
  )
}
