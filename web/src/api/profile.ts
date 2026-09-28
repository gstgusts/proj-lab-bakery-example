export interface UserProfile {
  id: number
  name: string
  surname: string
  email: string
}

export async function getProfile(token?: string): Promise<UserProfile> {
  const res = await fetch('/api/profile', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.detail ?? `Failed to load profile (${res.status})`)
  }
  return res.json()
}
