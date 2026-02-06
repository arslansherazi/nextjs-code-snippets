export const dynamic = "force-dynamic"

const DELAY_MS = 2000

export async function GET() {
  await new Promise(r => setTimeout(r, DELAY_MS))
  return Response.json({
    strategy: "dynamic",
    fetchedAt: Date.now(),
    description: "No cache (cache: 'no-store'). Every refresh is slow.",
  })
}
