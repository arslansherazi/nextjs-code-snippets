type CardProps = {
  title: string
  description: string
  data: string
}

export default function Card({ title, description, data }: CardProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-2 text-lg text-foreground">{title}</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      <p className="font-mono text-sm text-foreground">{data}</p>
    </section>
  )
}
