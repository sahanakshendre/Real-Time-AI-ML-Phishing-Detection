import { Route, Routes, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import DashboardPage from './pages/DashboardPage'
import UrlHistoryPage from './pages/UrlHistoryPage'
import AiDetectionPage from './pages/AiDetectionPage'
import EmailAlertPage from './pages/EmailAlertPage'
import PreventionPage from './pages/PreventionPage'
import SettingsPage from './pages/SettingsPage'
import AdminPanelPage from './pages/AdminPanelPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import MLAnalyticsPage from './pages/MLAnalyticsPage'
import FeatureAnalysisPage from './pages/FeatureAnalysisPage'
import DatasetStatsPage from './pages/DatasetStatsPage'

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'URL History', path: '/url-history' },
  { label: 'AI/ML Detection', path: '/ai-detection' },
  { label: 'ML Model Analytics', path: '/ml-analytics' },
  { label: 'Feature Analysis', path: '/feature-analysis' },
  { label: 'Dataset Statistics', path: '/dataset-stats' },
  { label: 'Email Alert', path: '/email-alerts' },
  { label: 'Prevention', path: '/prevention' },
  { label: 'Settings', path: '/settings' },
  { label: 'Admin Panel', path: '/admin' }
]

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('phishing-auth')
    setAuthenticated(Boolean(token))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('phishing-auth')
    setAuthenticated(false)
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <Sidebar items={navItems} authenticated={authenticated} onLogout={handleLogout} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/url-history" element={<UrlHistoryPage />} />
          <Route path="/ai-detection" element={<AiDetectionPage />} />
          <Route path="/ml-analytics" element={<MLAnalyticsPage />} />
          <Route path="/feature-analysis" element={<FeatureAnalysisPage />} />
          <Route path="/dataset-stats" element={<DatasetStatsPage />} />
          <Route path="/email-alerts" element={<EmailAlertPage />} />
          <Route path="/prevention" element={<PreventionPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/admin" element={<AdminPanelPage authenticated={authenticated} />} />
          <Route path="/login" element={<LoginPage onLogin={() => setAuthenticated(true)} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
