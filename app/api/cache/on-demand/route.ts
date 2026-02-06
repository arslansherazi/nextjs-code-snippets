const DELAY_MS = 2000

export async function GET() {
  await new Promise(r => setTimeout(r, DELAY_MS))
  return Response.json({
    strategy: "on-demand",
    fetchedAt: Date.now(),
    description: "Cached until revalidatePath(). Slow once, then fast until you click Revalidate.",
  })
}
