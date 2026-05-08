import axios from 'axios'
import { DashboardSummary, AttackPoint, AlertItem, HistoryEntry, PreventionMethod, PhishingResult } from './types'

const client = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
})

export const fetchDashboard = async (): Promise<{ summary: DashboardSummary; attack_map: AttackPoint[]; alerts: AlertItem[]; top_threats: { name: string; score: number }[] }> => {
  const response = await client.get('/dashboard')
  return response.data
}

export const fetchUrlHistory = async (): Promise<HistoryEntry[]> => {
  const response = await client.get('/url-history')
  return response.data.history
}

export const analyzeUrl = async (
  url: string,
  email?: string,
  senderEmail?: string,
  senderPassword?: string
): Promise<PhishingResult> => {
  const response = await client.post('/analyze-url', {
    url,
    email,
    sender_email: senderEmail,
    sender_password: senderPassword
  })
  return response.data
}

export const fetchEmailAlerts = async (): Promise<AlertItem[]> => {
  const response = await client.get('/email-alerts')
  return response.data.email_alerts
}

export const fetchPrevention = async (): Promise<PreventionMethod[]> => {
  const response = await client.get('/prevention')
  return response.data.methods
}

export const loginAdmin = async (username: string, password: string) => {
  const response = await client.post('/login', { username, password })
  return response.data
}

export const fetchMLMetrics = async () => {
  const response = await client.get('/ml-metrics')
  return response.data
}

export const fetchDatasetStats = async () => {
  const response = await client.get('/dataset-stats')
  return response.data
}
