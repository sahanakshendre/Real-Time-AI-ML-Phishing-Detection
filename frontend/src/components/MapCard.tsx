import { MapContainer, Popup, TileLayer, CircleMarker } from 'react-leaflet'
import { AttackPoint } from '../types'

interface MapCardProps {
  points: AttackPoint[]
}

const threatColor = (level: number) => {
  if (level > 80) return '#ff5274'
  if (level > 60) return '#ff9f43'
  return '#5ce1a3'
}

const MapCard = ({ points }: MapCardProps) => {
  return (
    <div className="panel" style={{ minHeight: '510px' }}>
      <h3>Live Threat Distribution</h3>
      <MapContainer center={[20, 0]} zoom={2} style={{ height: '430px', borderRadius: '20px' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((point) => (
          <CircleMarker
            key={point.city}
            center={[point.lat, point.lng]}
            radius={8 + point.active_attacks}
            pathOptions={{ color: threatColor(point.threat_level), fillOpacity: 0.5 }}
          >
            <Popup>
              <strong>{point.city}</strong>
              <div>Threat level: {point.threat_level}%</div>
              <div>Active attacks: {point.active_attacks}</div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}

export default MapCard
