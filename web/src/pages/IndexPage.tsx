import { useEffect, useState } from 'react'
import { getProfile, type UserProfile } from '../api/profile.ts'
import { useAuth } from '../auth/AuthContext.tsx'

export default function IndexPage() {
  const { ready, authenticated, user, login, getToken } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authenticated) return
    getToken()
      .then(getProfile)
      .then(setProfile)
      .catch((e: Error) => setError(e.message))
  }, [authenticated, getToken])

  if (!ready) return <p>Loading…</p>

  if (!authenticated) {
    return (
      <>
        <h1>Welcome</h1>
        <p>Please log in to see your profile.</p>
        <button type="button" onClick={login}>
          Log in
        </button>
      </>
    )
  }

  return (
    <>
      <h1>Welcome, {user?.name || user?.username}</h1>
      <section id="profile">
        <h2>User profile</h2>
        {error && <p className="error">{error}</p>}
        {!error && !profile && <p>Loading…</p>}
        {profile && (
          <dl>
            <dt>Name</dt>
            <dd>{profile.name}</dd>
            <dt>Surname</dt>
            <dd>{profile.surname}</dd>
            <dt>Email</dt>
            <dd>{profile.email}</dd>
          </dl>
        )}
      </section>
    </>
  )
}
