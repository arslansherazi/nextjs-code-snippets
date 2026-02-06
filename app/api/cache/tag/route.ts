const DELAY_MS = 2000

export async function GET() {
  await new Promise(r => setTimeout(r, DELAY_MS))
  return Response.json({
    strategy: "tag-based",
    fetchedAt: Date.now(),
    description: "next: { tags: ['cache-demo'] }. Slow once, then fast until you click Revalidate tag.",
  })
}
