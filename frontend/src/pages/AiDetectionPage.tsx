import { useState, useEffect } from 'react'
import { analyzeUrl } from '../api'
import { PhishingResult } from '../types'

const AiDetectionPage = () => {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<PhishingResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [alertSent, setAlertSent] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [senderPassword, setSenderPassword] = useState('')

  useEffect(() => {
    const storedEmail = localStorage.getItem('user-email')
    const storedSender = localStorage.getItem('sender-email')
    const storedPassword = localStorage.getItem('sender-password')
    if (storedEmail) setUserEmail(storedEmail)
    if (storedSender) setSenderEmail(storedSender)
    if (storedPassword) setSenderPassword(storedPassword)
    
    // Request notification permission on page load
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!userEmail || !senderEmail || !senderPassword) {
      setError('Please complete Settings with recipient email and sender Gmail credentials before analyzing URLs.')
      return
    }
    
    setLoading(true)
    setError('')
    setResult(null)
    setAlertSent(false)
    try {
      const data = await analyzeUrl(url, userEmail, senderEmail, senderPassword)
      setResult(data)
      if (data.prediction === 'phishing') {
        // Show browser notification if enabled
        const notificationsEnabled = localStorage.getItem('notifications-enabled') === 'true'
        if (notificationsEnabled && Notification.permission === 'granted') {
          new Notification('🚨 Phishing Alert Detected!', {
            body: `Suspicious URL: ${url}\nConfidence: ${data.confidence}%\nEmail alert sent to: ${userEmail}`,
            icon: '/favicon.ico'
          })
        }
        setAlertSent(true)
      }
    } catch (err) {
      setError('Unable to analyze the URL. Check the backend server and Gmail credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="page-title">AI/ML Phishing Detection</h1>
      
      {(!userEmail || !senderEmail || !senderPassword) && (
        <div className="alert-banner" style={{ background: 'rgba(255, 160, 20, 0.16)', border: '1px solid rgba(255, 160, 20, 0.3)', color: '#ffd17e' }}>
          ⚠ Configure Settings with Gmail credentials first. Go to Settings to set up email alerts and browser notifications.
        </div>
      )}

      <div className="panel form-card">
        <h3>Analyze a suspicious link</h3>
        <p>Enter a URL to scan for phishing indicators. You'll receive both email alerts and browser notifications.</p>
        <form onSubmit={handleSubmit}>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter URL to inspect" />
          <button className="primary" type="submit" disabled={loading || !url || !userEmail || !senderEmail || !senderPassword}>
            {loading ? 'Scanning...' : 'Analyze URL'}
          </button>
        </form>
      </div>

      {error && <div className="alert-banner">{error}</div>}

      {result && (
        <div className="panel" style={{ marginTop: '18px' }}>
          <h3>Analysis Result</h3>
          <p>
            <strong>URL:</strong> {result.url}
          </p>
          <p>
            <strong>Prediction:</strong>{' '}
            <span className={`badge ${result.prediction === 'phishing' ? 'high' : 'safe'}`}>{result.prediction}</span>
          </p>
          <p>
            <strong>Confidence:</strong> {result.confidence}%
          </p>
          <div>
            <strong>Detected causes:</strong>
            <ul>
              {result.reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>
          {alertSent && (
            <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(95, 241, 135, 0.15)', borderRadius: '8px', color: '#a4ffba' }}>
              ✓ Email alert sent to {userEmail} and browser notification displayed
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AiDetectionPage
