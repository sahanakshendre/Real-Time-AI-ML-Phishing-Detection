import { NavLink } from 'react-router-dom'

interface SidebarProps {
  items: { label: string; path: string }[]
  authenticated: boolean
  onLogout: () => void
}

const Sidebar = ({ items, authenticated, onLogout }: SidebarProps) => {
  return (
    <aside className="sidebar">
      <h2>Phishing System</h2>
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}
        >
          {item.label}
        </NavLink>
      ))}
      <div style={{ marginTop: '24px' }}>
        {authenticated ? (
          <button className="primary" type="button" onClick={onLogout}>
            Logout
          </button>
        ) : (
          <NavLink to="/login" className="menu-item">
            Admin Login
          </NavLink>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
