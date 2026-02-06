"use server"

export async function likePost(postId: string): Promise<void> {
  // simulate backend latency
  await new Promise(resolve => setTimeout(resolve, 800))

  // simulate rare failure (only fails if postId contains "fail" for testing)
  if (postId.includes("fail")) {
    throw new Error("Failed to like post")
  }

  // real app:
  // await fetch("backend/like", { method: "POST", body: ... })
}
