interface AdminPanelPageProps {
  authenticated: boolean
}

const AdminPanelPage = ({ authenticated }: AdminPanelPageProps) => {
  if (!authenticated) {
    return (
      <div className="panel">
        <h1 className="page-title">Admin Panel</h1>
        <p>Access denied. Please sign in using the admin login page.</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="page-title">Admin Panel</h1>
      <div className="grid-two">
        <div className="panel">
          <h3>System status</h3>
          <p>All sensors are operational. Real-time threat correlation is active and AI scoring is updating every 4 seconds.</p>
        </div>
        <div className="panel">
          <h3>Administrator controls</h3>
          <p>Use the sidebar to inspect phishing URLs, manage alerts, and review prevention best practices. Elevated operations can be extended with a secure policy management module.</p>
        </div>
      </div>
    </div>
  )
}

export default AdminPanelPage
