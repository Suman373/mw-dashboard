import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DEFAULT_LAT, DEFAULT_LONG } from '../utils/constants';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import PolygonCreator from './PolygonCreator';


const MapView = () => {
    return (
        <div className="h-full w-full rounded-lg">
            <MapContainer
                center={[DEFAULT_LAT, DEFAULT_LONG]}
                zoom={16}
                zoomControl={false}
                scrollWheelZoom={false}
                dragging={true}
                className="h-full w-full z-1"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                <PolygonCreator />
            </MapContainer>
        </div>
    )
}

export default MapView;
