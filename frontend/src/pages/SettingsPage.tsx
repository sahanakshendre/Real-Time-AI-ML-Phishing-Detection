import { useState, useEffect } from 'react'

const SettingsPage = () => {
  const [email, setEmail] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [senderPassword, setSenderPassword] = useState('')
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const storedEmail = localStorage.getItem('user-email')
    const storedSender = localStorage.getItem('sender-email')
    const storedPassword = localStorage.getItem('sender-password')
    const storedNotifications = localStorage.getItem('notifications-enabled')
    if (storedEmail) setEmail(storedEmail)
    if (storedSender) setSenderEmail(storedSender)
    if (storedPassword) setSenderPassword(storedPassword)
    setNotificationsEnabled(storedNotifications === 'true')
  }, [])

  const handleSave = () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid recipient email address.')
      return
    }
    if (!senderEmail || !senderEmail.includes('@')) {
      alert('Please enter a valid sender email address.')
      return
    }
    if (!senderPassword) {
      alert('Please enter your sender app password.')
      return
    }

    localStorage.setItem('user-email', email)
    localStorage.setItem('sender-email', senderEmail)
    localStorage.setItem('sender-password', senderPassword)
    localStorage.setItem('notifications-enabled', notificationsEnabled.toString())
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <h1 className="page-title">Settings</h1>
      <div className="panel form-card" style={{ maxWidth: '600px' }}>
        <h3>Email & Notification Settings</h3>
        <p>Configure your email alerts and browser notifications for phishing detection.</p>
        
        <h4>Email Alerts</h4>
        <label>
          Recipient Email Address (where alerts are sent)
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your-email@gmail.com"
          />
        </label>
        <label>
          Sender Email Address (Gmail account)
          <input
            type="email"
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
            placeholder="sender-account@gmail.com"
          />
        </label>
        <label>
          Sender App Password
          <input
            type="password"
            value={senderPassword}
            onChange={(e) => setSenderPassword(e.target.value)}
            placeholder="Gmail app password"
          />
        </label>

        <h4 style={{ marginTop: '20px' }}>Browser Notifications</h4>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
          />
          Enable browser notifications for instant alerts
        </label>

        <button className="primary" type="button" onClick={handleSave} style={{ marginTop: '20px' }}>
          Save All Settings
        </button>
        {saved && (
          <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(95, 241, 135, 0.15)', borderRadius: '8px', color: '#a4ffba' }}>
            ✓ Settings saved successfully. Both email and browser alerts are now configured.
          </div>
        )}
        <p style={{ color: '#9fb4dd', marginTop: '14px' }}>
          Use a Gmail app password for the sender. Enable 2FA on your Gmail account first, then generate an app password.
        </p>
      </div>
    </div>
  )
}

export default SettingsPage
