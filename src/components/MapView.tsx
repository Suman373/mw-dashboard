import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = () => {
  return (
    <div className="h-full w-full rounded-lg">
      <MapContainer
        center={[20.5937, 78.9629]} 
        zoom={5}
        scrollWheelZoom={true}
        className="h-full w-full z-1"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
      </MapContainer>
    </div>
  )
}

export default MapView;
