import { useState } from 'react'
import { analyzeUrl } from '../api'
import { PhishingResult } from '../types'

interface FeatureAnalysis {
  url: string
  features: {
    name: string
    value: string | number
    importance: number
    impact: 'high' | 'medium' | 'low'
  }[]
  confidence: number
  prediction: string
}

const FeatureAnalysisPage = () => {
  const [url, setUrl] = useState('')
  const [analysis, setAnalysis] = useState<FeatureAnalysis | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setLoading(true)
    setError('')
    try {
      const result = await analyzeUrl(url)
      
      // Extract features from URL for visualization
      const features = [
        {
          name: 'Domain Reputation',
          value: result.confidence > 70 ? 'Suspicious' : 'Legitimate',
          importance: 0.25,
          impact: (result.confidence > 70 ? 'high' : 'low') as 'high' | 'low'
        },
        {
          name: 'URL Length',
          value: url.length,
          importance: 0.15,
          impact: (url.length > 50 ? 'medium' : 'low') as 'medium' | 'low'
        },
        {
          name: 'Special Characters',
          value: (url.match(/[-_.]/g) || []).length,
          importance: 0.2,
          impact: ((url.match(/[-_.]/g) || []).length > 3 ? 'high' : 'low') as 'high' | 'low'
        },
        {
          name: 'Subdomains',
          value: (url.match(/\./g) || []).length - 1,
          importance: 0.18,
          impact: ((url.match(/\./g) || []).length > 3 ? 'high' : 'low') as 'high' | 'low'
        },
        {
          name: 'HTTPS Protocol',
          value: url.startsWith('https') ? 'Yes' : 'No',
          importance: 0.12,
          impact: (url.startsWith('https') ? 'low' : 'high') as 'low' | 'high'
        },
        {
          name: 'IP Address Usage',
          value: /\d{1,3}\.\d{1,3}/.test(url) ? 'Yes' : 'No',
          importance: 0.1,
          impact: (/\d{1,3}\.\d{1,3}/.test(url) ? 'high' : 'low') as 'high' | 'low'
        }
      ]

      setAnalysis({
        url,
        features: features.sort((a, b) => b.importance - a.importance),
        confidence: result.confidence,
        prediction: result.prediction
      })
    } catch (err) {
      setError('Failed to analyze URL features')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="page-title">Feature Analysis & Importance</h1>

      <div className="panel form-card">
        <h3>Analyze URL Features</h3>
        <p>Extract and visualize feature importance that influence phishing detection predictions</p>
        <form onSubmit={handleAnalyze}>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter URL to analyze features" />
          <button className="primary" type="submit" disabled={loading || !url}>
            {loading ? 'Analyzing Features...' : 'Analyze Features'}
          </button>
        </form>
      </div>

      {error && <div className="alert-banner">{error}</div>}

      {analysis && (
        <>
          <div className="panel" style={{ marginTop: '24px' }}>
            <h3>URL: <code style={{ color: '#5ff187', wordBreak: 'break-all' }}>{analysis.url}</code></h3>
            <div style={{ marginTop: '12px', display: 'flex', gap: '16px' }}>
              <div>
                <span style={{ color: '#9fb4dd' }}>Prediction:</span>
                <span className={`badge ${analysis.prediction === 'phishing' ? 'high' : 'safe'}`} style={{ marginLeft: '8px' }}>
                  {analysis.prediction}
                </span>
              </div>
              <div>
                <span style={{ color: '#9fb4dd' }}>Confidence:</span>
                <span style={{ marginLeft: '8px', color: '#5ff187', fontWeight: 'bold' }}>{analysis.confidence}%</span>
              </div>
            </div>
          </div>

          <div className="panel" style={{ marginTop: '24px', padding: '20px' }}>
            <h3>Feature Importance Ranking</h3>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {analysis.features.map((feature, idx) => (
                <div key={idx} style={{ borderBottom: '1px solid rgba(109, 179, 242, 0.2)', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <div style={{ color: '#9fb4dd', fontWeight: 'bold' }}>
                        {idx + 1}. {feature.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#7a8fb0', marginTop: '4px' }}>
                        Value: {feature.value}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: feature.impact === 'high' ? '#ff5274' : feature.impact === 'medium' ? '#ffa014' : '#5ff187', fontWeight: 'bold' }}>
                        {(feature.importance * 100).toFixed(1)}%
                      </div>
                      <div style={{ fontSize: '11px', color: '#7a8fb0' }}>Impact: {feature.impact.toUpperCase()}</div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(109, 179, 242, 0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ background: feature.impact === 'high' ? '#ff5274' : feature.impact === 'medium' ? '#ffa014' : '#5ff187', height: '100%', width: `${feature.importance * 100}%`, borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel" style={{ marginTop: '24px', padding: '20px' }}>
            <h3>Feature Impact Summary</h3>
            <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div style={{ background: 'rgba(255, 82, 116, 0.1)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255, 82, 116, 0.3)' }}>
                <div style={{ color: '#ff5274', fontWeight: 'bold' }}>{analysis.features.filter(f => f.impact === 'high').length}</div>
                <div style={{ color: '#9fb4dd', fontSize: '12px' }}>High Impact Features</div>
              </div>
              <div style={{ background: 'rgba(255, 160, 20, 0.1)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255, 160, 20, 0.3)' }}>
                <div style={{ color: '#ffa014', fontWeight: 'bold' }}>{analysis.features.filter(f => f.impact === 'medium').length}</div>
                <div style={{ color: '#9fb4dd', fontSize: '12px' }}>Medium Impact Features</div>
              </div>
              <div style={{ background: 'rgba(95, 241, 135, 0.1)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(95, 241, 135, 0.3)' }}>
                <div style={{ color: '#5ff187', fontWeight: 'bold' }}>{analysis.features.filter(f => f.impact === 'low').length}</div>
                <div style={{ color: '#9fb4dd', fontSize: '12px' }}>Low Impact Features</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default FeatureAnalysisPage
