const API_BASE = "http://localhost:3000"

export async function getStatic() {
  const res = await fetch(`${API_BASE}/api/cache/static`)
  return res.json()
}

export async function getDynamic() {
  const res = await fetch(`${API_BASE}/api/cache/dynamic`, { cache: "no-store" })
  return res.json()
}

export async function getTimeBased() {
  const res = await fetch(`${API_BASE}/api/cache/revalidate`, { next: { revalidate: 5 } })
  return res.json()
}

export async function getOnDemand() {
  const res = await fetch(`${API_BASE}/api/cache/on-demand`, { cache: "force-cache" })
  return res.json()
}

export async function getTagBased() {
  const res = await fetch(`${API_BASE}/api/cache/tag`, {
    cache: "force-cache",
    next: { tags: ["cache-demo"] },
  })
  return res.json()
}
