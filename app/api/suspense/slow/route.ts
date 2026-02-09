const DELAY_MS = 2000

export async function GET() {
  await new Promise(r => setTimeout(r, DELAY_MS))
  return Response.json({
    message: "Slow data loaded! This took 2 seconds.",
  })
}
