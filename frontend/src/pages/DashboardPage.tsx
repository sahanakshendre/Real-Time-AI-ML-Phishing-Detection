import { useEffect, useState } from 'react'
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts'
import MapCard from '../components/MapCard'
import { fetchDashboard, fetchMLMetrics, fetchDatasetStats } from '../api'
import { DashboardSummary, AttackPoint, AlertItem } from '../types'

const DashboardPage = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [attackMap, setAttackMap] = useState<AttackPoint[]>([])
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [topThreats, setTopThreats] = useState<{ name: string; score: number }[]>([])
  const [modelMetrics, setModelMetrics] = useState<any>(null)
  const [datasetStats, setDatasetStats] = useState<any>(null)

  useEffect(() => {
    fetchDashboard().then((data) => {
      setSummary(data.summary)
      setAttackMap(data.attack_map)
      setAlerts(data.alerts)
      setTopThreats(data.top_threats)
    })

    fetchMLMetrics().then((data) => setModelMetrics(data)).catch(() => null)
    fetchDatasetStats().then((data) => setDatasetStats(data)).catch(() => null)
  }, [])

  return (
    <div>
      <h1 className="page-title">AI/ML Operations Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Model Accuracy</h4>
          <strong>{modelMetrics ? `${(modelMetrics.accuracy * 100).toFixed(2)}%` : '...'}</strong>
        </div>
        <div className="stat-card">
          <h4>Precision</h4>
          <strong>{modelMetrics ? `${(modelMetrics.precision * 100).toFixed(2)}%` : '...'}</strong>
        </div>
        <div className="stat-card">
          <h4>Recall</h4>
          <strong>{modelMetrics ? `${(modelMetrics.recall * 100).toFixed(2)}%` : '...'}</strong>
        </div>
        <div className="stat-card">
          <h4>F1 Score</h4>
          <strong>{modelMetrics ? `${(modelMetrics.f1_score * 100).toFixed(2)}%` : '...'}</strong>
        </div>
      </div>

      <div className="stats-grid" style={{ marginTop: '16px' }}>
        <div className="stat-card">
          <h4>Phishing Samples</h4>
          <strong>{datasetStats ? datasetStats.phishing_samples : '...'}</strong>
        </div>
        <div className="stat-card">
          <h4>Legitimate Samples</h4>
          <strong>{datasetStats ? datasetStats.legitimate_samples : '...'}</strong>
        </div>
        <div className="stat-card">
          <h4>Train/Test Split</h4>
          <strong>{datasetStats ? `${datasetStats.training_samples}/${datasetStats.test_samples}` : '...'}</strong>
        </div>
        <div className="stat-card">
          <h4>Feature Count</h4>
          <strong>{datasetStats ? datasetStats.features_count : '...'}</strong>
        </div>
      </div>

      <div className="grid-two">
        <MapCard points={attackMap} />
        <div className="panel">
          <h3>Threat Intelligence Feed</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topThreats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: '#c7d0f0', fontSize: 12 }} />
                <Tooltip wrapperStyle={{ backgroundColor: '#121a33', borderRadius: '12px' }} />
                <Bar dataKey="score" fill="#6f5bff" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: '22px' }}>
        <h3>AI Model Summary</h3>
        <p style={{ color: '#9fb4dd', marginTop: '12px' }}>
          This section summarizes model performance and dataset characteristics used in the phishing detection pipeline.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginTop: '18px' }}>
          <div style={{ padding: '18px', borderRadius: '16px', background: 'rgba(95, 241, 135, 0.08)', border: '1px solid rgba(95, 241, 135, 0.18)' }}>
            <div style={{ color: '#5ff187', fontWeight: '700', fontSize: '24px' }}>{datasetStats ? `${datasetStats.phishing_percentage.toFixed(1)}%` : '...'}</div>
            <div style={{ color: '#9fb4dd', marginTop: '8px' }}>Phishing Sample Ratio</div>
          </div>
          <div style={{ padding: '18px', borderRadius: '16px', background: 'rgba(109, 179, 242, 0.08)', border: '1px solid rgba(109, 179, 242, 0.18)' }}>
            <div style={{ color: '#6db3f2', fontWeight: '700', fontSize: '24px' }}>{datasetStats ? `${datasetStats.legitimate_percentage.toFixed(1)}%` : '...'}</div>
            <div style={{ color: '#9fb4dd', marginTop: '8px' }}>Legitimate Sample Ratio</div>
          </div>
          <div style={{ padding: '18px', borderRadius: '16px', background: 'rgba(255, 160, 20, 0.08)', border: '1px solid rgba(255, 160, 20, 0.18)' }}>
            <div style={{ color: '#ffa014', fontWeight: '700', fontSize: '24px' }}>{datasetStats ? `${datasetStats.class_balance_ratio}` : '...'}</div>
            <div style={{ color: '#9fb4dd', marginTop: '8px' }}>Class Balance Ratio</div>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: '22px' }}>
        <h3>Active incident alerts</h3>
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
                <td>{alert.source ?? alert.sender}</td>
                <td>{alert.subject}</td>
                <td>
                  <span className={`badge ${alert.severity?.toLowerCase()}`}>{alert.severity ?? alert.status}</span>
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

export default DashboardPage
