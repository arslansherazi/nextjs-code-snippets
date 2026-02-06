export default function Home() {
  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-2xl font-semibold text-foreground md:text-3xl">
          Next JS Code Snippets
        </h1>
        <p className="mb-8 text-gray-500 dark:text-gray-400">
          Test projects &amp; demos — pick one to open.
        </p>

        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Links
          </h2>
          <ul className="space-y-2">
            <li>
              <a
                href="/posts"
                className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-foreground transition hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
              >
                Optimistic UI
              </a>
            </li>
            <li>
              <a
                href="/login"
                className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-foreground transition hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
              >
                Auth
              </a>
            </li>
          </ul>
        </section>
      </div>
    </main>
  )
}
