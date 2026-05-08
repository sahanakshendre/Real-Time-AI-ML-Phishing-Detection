import { useEffect, useState } from 'react'
import { fetchEmailAlerts } from '../api'
import { AlertItem } from '../types'

const GmailAlertPage = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([])

  useEffect(() => {
    fetchEmailAlerts().then(setAlerts)
  }, [])

  return (
    <div>
      <h1 className="page-title">Gmail Alert</h1>
      <div className="panel">
        <h3>Gmail phishing and spoofing detections</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Sender</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id}>
                <td>{alert.sender}</td>
                <td>{alert.subject}</td>
                <td>
                  <span className="badge high">{alert.status}</span>
                </td>
                <td>{alert.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GmailAlertPage
