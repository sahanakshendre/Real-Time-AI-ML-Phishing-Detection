import { useEffect, useState } from 'react'
import { fetchUrlHistory } from '../api'
import { HistoryEntry } from '../types'

const UrlHistoryPage = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([])

  useEffect(() => {
    fetchUrlHistory().then(setHistory)
  }, [])

  return (
    <div>
      <h1 className="page-title">URL History</h1>
      <div className="panel">
        <h3>Recent URL risk assessments</h3>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>URL</th>
              <th>Status</th>
              <th>Detected at</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.id}</td>
                <td>{entry.url}</td>
                <td>
                  <span className={`badge ${entry.status === 'Phishing' ? 'high' : 'safe'}`}>{entry.status}</span>
                </td>
                <td>{entry.detected_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UrlHistoryPage
