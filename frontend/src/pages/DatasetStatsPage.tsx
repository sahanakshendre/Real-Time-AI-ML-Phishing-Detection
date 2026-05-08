import { useState, useEffect } from 'react'
import { fetchDatasetStats } from '../api'

interface DatasetStats {
  total_samples: number
  phishing_samples: number
  legitimate_samples: number
  phishing_percentage: number
  legitimate_percentage: number
  features_count: number
  training_samples: number
  test_samples: number
  class_balance_ratio: string
}

const DatasetStatsPage = () => {
  const [stats, setStats] = useState<DatasetStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchDatasetStats()
        setStats(data)
      } catch (err) {
        console.error('Failed to load dataset stats', err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) return <div className="page-title">Loading Dataset Statistics...</div>

  return (
    <div>
      <h1 className="page-title">Dataset & Training Statistics</h1>

      {stats && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div className="panel" style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '32px', color: '#6db3f2', fontWeight: 'bold' }}>{stats.total_samples}</div>
              <div style={{ color: '#9fb4dd', marginTop: '8px' }}>Total Samples</div>
              <div style={{ fontSize: '12px', color: '#7a8fb0', marginTop: '4px' }}>URLs in dataset</div>
            </div>

            <div className="panel" style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '32px', color: '#ff5274', fontWeight: 'bold' }}>{stats.phishing_samples}</div>
              <div style={{ color: '#9fb4dd', marginTop: '8px' }}>Phishing URLs</div>
              <div style={{ fontSize: '12px', color: '#7a8fb0', marginTop: '4px' }}>{stats.phishing_percentage.toFixed(1)}% of dataset</div>
            </div>

            <div className="panel" style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '32px', color: '#5ff187', fontWeight: 'bold' }}>{stats.legitimate_samples}</div>
              <div style={{ color: '#9fb4dd', marginTop: '8px' }}>Legitimate URLs</div>
              <div style={{ fontSize: '12px', color: '#7a8fb0', marginTop: '4px' }}>{stats.legitimate_percentage.toFixed(1)}% of dataset</div>
            </div>

            <div className="panel" style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '32px', color: '#ffa014', fontWeight: 'bold' }}>{stats.features_count}</div>
              <div style={{ color: '#9fb4dd', marginTop: '8px' }}>Feature Dimensions</div>
              <div style={{ fontSize: '12px', color: '#7a8fb0', marginTop: '4px' }}>Extracted from URLs</div>
            </div>

            <div className="panel" style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '32px', color: '#5ff187', fontWeight: 'bold' }}>{stats.training_samples}</div>
              <div style={{ color: '#9fb4dd', marginTop: '8px' }}>Training Samples</div>
              <div style={{ fontSize: '12px', color: '#7a8fb0', marginTop: '4px' }}>80% of data</div>
            </div>

            <div className="panel" style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '32px', color: '#6db3f2', fontWeight: 'bold' }}>{stats.test_samples}</div>
              <div style={{ color: '#9fb4dd', marginTop: '8px' }}>Test Samples</div>
              <div style={{ fontSize: '12px', color: '#7a8fb0', marginTop: '4px' }}>20% of data</div>
            </div>
          </div>

          <div className="panel" style={{ padding: '20px' }}>
            <h3>Class Distribution</h3>
            <div style={{ marginTop: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#9fb4dd' }}>Phishing URLs</span>
                  <span style={{ color: '#ff5274', fontWeight: 'bold' }}>{stats.phishing_percentage.toFixed(1)}%</span>
                </div>
                <div style={{ background: 'rgba(109, 179, 242, 0.1)', height: '20px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ background: '#ff5274', height: '100%', width: `${stats.phishing_percentage}%`, borderRadius: '4px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#9fb4dd' }}>Legitimate URLs</span>
                  <span style={{ color: '#5ff187', fontWeight: 'bold' }}>{stats.legitimate_percentage.toFixed(1)}%</span>
                </div>
                <div style={{ background: 'rgba(109, 179, 242, 0.1)', height: '20px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ background: '#5ff187', height: '100%', width: `${stats.legitimate_percentage}%`, borderRadius: '4px' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="panel" style={{ padding: '20px', marginTop: '16px' }}>
            <h3>Training Configuration</h3>
            <div style={{ marginTop: '16px', color: '#9fb4dd', lineHeight: '2' }}>
              <p><strong>Algorithm:</strong> Logistic Regression</p>
              <p><strong>Class Balance Ratio:</strong> {stats.class_balance_ratio}</p>
              <p><strong>Train-Test Split:</strong> 80-20</p>
              <p><strong>Feature Scaling:</strong> StandardScaler</p>
              <p><strong>Optimization Method:</strong> L-BFGS</p>
              <p><strong>Max Iterations:</strong> 1000</p>
            </div>
          </div>

          <div className="panel" style={{ padding: '20px', marginTop: '16px' }}>
            <h3>Dataset Information</h3>
            <div style={{ marginTop: '16px', color: '#9fb4dd', lineHeight: '2', fontSize: '14px' }}>
              <p>
                The dataset contains <strong>{stats.total_samples}</strong> labeled URLs collected from various sources including 
                phishing databases and legitimate website repositories. Each URL is represented by <strong>{stats.features_count}</strong> extracted features.
              </p>
              <p style={{ marginTop: '12px' }}>
                The model was trained on <strong>{stats.training_samples}</strong> samples and tested on <strong>{stats.test_samples}</strong> samples 
                to ensure unbiased performance evaluation. Class imbalance handling was applied during preprocessing.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DatasetStatsPage
