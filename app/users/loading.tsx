export default function Loading() {
  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 h-8 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-10 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-4 space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
      </div>
    </main>
  )
}
