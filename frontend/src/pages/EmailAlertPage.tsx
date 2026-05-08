import { useEffect, useState } from 'react'
import { fetchEmailAlerts } from '../api'
import { AlertItem } from '../types'

const EmailAlertPage = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([])

  useEffect(() => {
    fetchEmailAlerts().then(setAlerts)
  }, [])

  return (
    <div>
      <h1 className="page-title">Email Alert</h1>
      <div className="panel">
        <h3>Security email alerts triggered by phishing detections</h3>
        <p>These alerts are automatically sent when suspicious URLs or phishing attempts are detected by the AI/ML system.</p>
        <table className="table">
          <thead>
            <tr>
              <th>Source</th>
              <th>Subject</th>
              <th>Severity</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id}>
                <td>{alert.source}</td>
                <td>{alert.subject}</td>
                <td>
                  <span className={`badge ${alert.severity?.toLowerCase()}`}>{alert.severity}</span>
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

export default EmailAlertPage
