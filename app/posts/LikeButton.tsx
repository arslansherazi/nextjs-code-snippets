"use client"

import { useOptimistic, useTransition, useState } from "react"
import { likePost } from "./actions"

type Props = {
  postId: string
  initialLikes: number
}

export default function LikeButton({ postId, initialLikes }: Props) {
  // Track actual likes count (updates when action succeeds)
  const [actualLikes, setActualLikes] = useState(initialLikes)

  // Use optimistic state based on actual likes
  const [optimisticLikes, updateOptimisticLikes] = useOptimistic(
    actualLikes,
    (current, delta: number) => current + delta
  )

  const [, startTransition] = useTransition()

  function handleLike() {
    // Run server action in background with optimistic update
    startTransition(async () => {
      // Optimistically update UI immediately
      updateOptimisticLikes(1)

      try {
        await likePost(postId)
        // Success - update actual likes count to match optimistic state
        setActualLikes(prev => prev + 1)
      } catch (error) {
        // Rollback on failure - optimistic state will revert automatically
        updateOptimisticLikes(-1)
        console.error("Failed to like post:", error)
      }
    })
  }

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-foreground transition hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
    >
      <span className="text-lg">❤️</span>
      <span>{optimisticLikes}</span>
    </button>
  )
}
