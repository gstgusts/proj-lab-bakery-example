import { useAuth } from '../auth/AuthContext.tsx'
import './MainMenu.css'

const items = [
  { label: 'Home', href: '/' },
  { label: 'Profile', href: '/#profile' },
]

export default function MainMenu() {
  const { ready, authenticated, user, login, logout } = useAuth()

  return (
    <nav className="main-menu">
      <span className="main-menu__brand">Example App</span>
      <ul className="main-menu__items">
        {items.map((item) => (
          <li key={item.href}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
      <div className="main-menu__auth">
        {ready && authenticated && (
          <>
            <span className="main-menu__user">{user?.username}</span>
            <button type="button" onClick={logout}>
              Log out
            </button>
          </>
        )}
        {ready && !authenticated && (
          <button type="button" onClick={login}>
            Log in
          </button>
        )}
      </div>
    </nav>
  )
}
