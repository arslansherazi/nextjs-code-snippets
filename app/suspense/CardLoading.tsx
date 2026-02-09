export default function CardLoading({ title }: { title: string }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-2 text-lg text-foreground">{title}</h2>
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300" />
        Loading…
      </div>
    </section>
  )
}
