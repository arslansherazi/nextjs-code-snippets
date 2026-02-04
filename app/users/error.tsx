"use client"

type Props = {
  error: Error
  reset: () => void
}

export default function Error({error, reset}: Props) {
  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-2xl rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950/30">
        <p className="mb-4 font-medium text-red-800 dark:text-red-200">Error: {error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          Retry
        </button>
      </div>
    </main>
  )
}
