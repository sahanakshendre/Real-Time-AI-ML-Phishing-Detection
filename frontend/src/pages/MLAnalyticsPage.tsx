import { useState, useEffect } from 'react'
import { fetchMLMetrics } from '../api'

interface MLMetrics {
  accuracy: number
  precision: number
  recall: number
  f1_score: number
  auc_roc: number
  total_predictions: number
  true_positives: number
  false_positives: number
  true_negatives: number
  false_negatives: number
}

const MLAnalyticsPage = () => {
  const [metrics, setMetrics] = useState<MLMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await fetchMLMetrics()
        setMetrics(data)
      } catch (err) {
        console.error('Failed to load ML metrics', err)
      } finally {
        setLoading(false)
      }
    }
    loadMetrics()
  }, [])

  if (loading) return <div className="page-title">Loading ML Metrics...</div>

  return (
    <div>
      <h1 className="page-title">AI/ML Model Analytics</h1>

      {metrics && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div className="panel" style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '32px', color: '#5ff187', fontWeight: 'bold' }}>{(metrics.accuracy * 100).toFixed(2)}%</div>
              <div style={{ color: '#9fb4dd', marginTop: '8px' }}>Model Accuracy</div>
              <div style={{ fontSize: '12px', color: '#7a8fb0', marginTop: '4px' }}>Overall correctness</div>
            </div>

            <div className="panel" style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '32px', color: '#ffa014', fontWeight: 'bold' }}>{(metrics.precision * 100).toFixed(2)}%</div>
              <div style={{ color: '#9fb4dd', marginTop: '8px' }}>Precision</div>
              <div style={{ fontSize: '12px', color: '#7a8fb0', marginTop: '4px' }}>True positive rate</div>
            </div>

            <div className="panel" style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '32px', color: '#ff5274', fontWeight: 'bold' }}>{(metrics.recall * 100).toFixed(2)}%</div>
              <div style={{ color: '#9fb4dd', marginTop: '8px' }}>Recall</div>
              <div style={{ fontSize: '12px', color: '#7a8fb0', marginTop: '4px' }}>Phishing detection rate</div>
            </div>

            <div className="panel" style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '32px', color: '#6db3f2', fontWeight: 'bold' }}>{(metrics.f1_score * 100).toFixed(2)}%</div>
              <div style={{ color: '#9fb4dd', marginTop: '8px' }}>F1 Score</div>
              <div style={{ fontSize: '12px', color: '#7a8fb0', marginTop: '4px' }}>Harmonic mean</div>
            </div>

            <div className="panel" style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '32px', color: '#5ff187', fontWeight: 'bold' }}>{(metrics.auc_roc * 100).toFixed(2)}%</div>
              <div style={{ color: '#9fb4dd', marginTop: '8px' }}>AUC-ROC</div>
              <div style={{ fontSize: '12px', color: '#7a8fb0', marginTop: '4px' }}>Classification performance</div>
            </div>

            <div className="panel" style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '32px', color: '#ffa014', fontWeight: 'bold' }}>{metrics.total_predictions}</div>
              <div style={{ color: '#9fb4dd', marginTop: '8px' }}>Total Predictions</div>
              <div style={{ fontSize: '12px', color: '#7a8fb0', marginTop: '4px' }}>URLs analyzed</div>
            </div>
          </div>

          <div className="panel" style={{ padding: '20px' }}>
            <h3>Confusion Matrix</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div style={{ background: 'rgba(95, 241, 135, 0.1)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(95, 241, 135, 0.3)' }}>
                <div style={{ color: '#5ff187', fontWeight: 'bold', fontSize: '24px' }}>{metrics.true_positives}</div>
                <div style={{ color: '#9fb4dd', fontSize: '12px', marginTop: '4px' }}>True Positives (Phishing Detected ✓)</div>
              </div>

              <div style={{ background: 'rgba(255, 82, 116, 0.1)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255, 82, 116, 0.3)' }}>
                <div style={{ color: '#ff5274', fontWeight: 'bold', fontSize: '24px' }}>{metrics.false_positives}</div>
                <div style={{ color: '#9fb4dd', fontSize: '12px', marginTop: '4px' }}>False Positives (Safe Flagged)</div>
              </div>

              <div style={{ background: 'rgba(109, 179, 242, 0.1)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(109, 179, 242, 0.3)' }}>
                <div style={{ color: '#6db3f2', fontWeight: 'bold', fontSize: '24px' }}>{metrics.true_negatives}</div>
                <div style={{ color: '#9fb4dd', fontSize: '12px', marginTop: '4px' }}>True Negatives (Safe Passed ✓)</div>
              </div>

              <div style={{ background: 'rgba(255, 160, 20, 0.1)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255, 160, 20, 0.3)' }}>
                <div style={{ color: '#ffa014', fontWeight: 'bold', fontSize: '24px' }}>{metrics.false_negatives}</div>
                <div style={{ color: '#9fb4dd', fontSize: '12px', marginTop: '4px' }}>False Negatives (Phishing Missed)</div>
              </div>
            </div>
          </div>

          <div className="panel" style={{ padding: '20px', marginTop: '16px' }}>
            <h3>Model Performance Summary</h3>
            <div style={{ marginTop: '16px', color: '#9fb4dd', lineHeight: '1.8' }}>
              <p><strong>Accuracy:</strong> {(metrics.accuracy * 100).toFixed(2)}% - Overall correctness of predictions</p>
              <p><strong>Precision:</strong> {(metrics.precision * 100).toFixed(2)}% - Of detected phishing, how many are correct</p>
              <p><strong>Recall:</strong> {(metrics.recall * 100).toFixed(2)}% - Of actual phishing, how many are detected</p>
              <p><strong>F1 Score:</strong> {(metrics.f1_score * 100).toFixed(2)}% - Balance between precision and recall</p>
              <p><strong>AUC-ROC:</strong> {(metrics.auc_roc * 100).toFixed(2)}% - Classification ability across thresholds</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default MLAnalyticsPage
