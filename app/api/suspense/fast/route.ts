const DELAY_MS = 500

export async function GET() {
  await new Promise(r => setTimeout(r, DELAY_MS))
  return Response.json({
    message: "Fast data loaded! This appears quickly.",
  })
}
