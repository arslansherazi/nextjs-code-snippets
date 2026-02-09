const API_BASE = "http://localhost:3000"

export async function getFastData() {
  const res = await fetch(`${API_BASE}/api/suspense/fast`)
  return res.json()
}

export async function getSlowData() {
  const res = await fetch(`${API_BASE}/api/suspense/slow`)
  return res.json()
}
