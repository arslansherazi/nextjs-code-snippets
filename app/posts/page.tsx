import LikeButton from "./LikeButton"

export default function PostsPage() {
  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-semibold text-foreground md:text-3xl">
          Optimistic UI Demo
        </h1>

        <div className="space-y-6">
          {/* Working Post */}
          <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-3 text-xl font-semibold text-foreground">Working Post</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              This post will successfully update the like count. The optimistic update will persist
              after the server responds.
            </p>

            <div className="flex items-center gap-4">
              <LikeButton postId="post-1" initialLikes={10} />
              <span className="text-sm text-green-600 dark:text-green-400">
                ✓ Will succeed
              </span>
            </div>
          </article>

          {/* Failing Post */}
          <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-3 text-xl font-semibold text-foreground">Failing Post</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              This post will fail on the server. Watch how the optimistic update rolls back when
              the error occurs.
            </p>

            <div className="flex items-center gap-4">
              <LikeButton postId="post-fail-2" initialLikes={5} />
              <span className="text-sm text-red-600 dark:text-red-400">
                ✗ Will fail and rollback
              </span>
            </div>
          </article>
        </div>
      </div>
    </main>
  )
}
