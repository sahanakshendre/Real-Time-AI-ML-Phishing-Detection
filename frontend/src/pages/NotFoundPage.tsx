import { NavLink } from 'react-router-dom'

const NotFoundPage = () => (
  <div className="panel">
    <h1 className="page-title">Page Not Found</h1>
    <p>The route you are looking for does not exist. Return to the dashboard to continue investigations.</p>
    <NavLink className="primary" to="/">
      Back to Dashboard
    </NavLink>
  </div>
)

export default NotFoundPage
