import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../api'

interface LoginPageProps {
  onLogin: () => void
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    try {
      const data = await loginAdmin(username, password)
      if (data.success) {
        localStorage.setItem('phishing-auth', data.token)
        onLogin()
        navigate('/admin')
      } else {
        setError(data.message || 'Login failed.')
      }
    } catch (err) {
      setError('Unable to authenticate. Please try again.')
    }
  }

  return (
    <div className="login-panel panel">
      <h2>Admin Authentication</h2>
      <p>Enter administrator credentials to access the threat control panel.</p>
      {error && <div className="alert-banner">{error}</div>}
      <form className="form-card" onSubmit={handleSubmit}>
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="SecurePass123"
          />
        </label>
        <button className="primary" type="submit">
          Sign in
        </button>
      </form>
      <small>Default credentials are admin / SecurePass123.</small>
    </div>
  )
}

export default LoginPage
