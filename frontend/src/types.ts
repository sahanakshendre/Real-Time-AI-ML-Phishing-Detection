export interface DashboardSummary {
  detected_threats: number
  resolved_incidents: number
  blocked_emails: number
  live_attacks: number
}

export interface AttackPoint {
  city: string
  lat: number
  lng: number
  threat_level: number
  active_attacks: number
}

export interface AlertItem {
  id: number
  source?: string
  sender?: string
  subject: string
  severity?: string
  status?: string
  timestamp: string
}

export interface HistoryEntry {
  id: number
  url: string
  status: string
  detected_at: string
}

export interface PreventionMethod {
  title: string
  description: string
}

export interface PhishingResult {
  url: string
  prediction: string
  confidence: number
  reasons: string[]
}
