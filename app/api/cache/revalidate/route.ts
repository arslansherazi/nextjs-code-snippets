export const revalidate = 5

const DELAY_MS = 2000

export async function GET() {
  await new Promise(r => setTimeout(r, DELAY_MS))
  return Response.json({
    strategy: "time-based",
    fetchedAt: Date.now(),
    description: "next: { revalidate: 5 }. Slow, then fast for 5s, then slow again.",
  })
}
