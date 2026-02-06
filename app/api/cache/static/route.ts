const DELAY_MS = 2000

export async function GET() {
  await new Promise(r => setTimeout(r, DELAY_MS))
  return Response.json({
    strategy: "static",
    fetchedAt: Date.now(),
    description: "Default fetch (cached). First load slow, refresh fast.",
  })
}
