import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Default city center: Nashik, Maharashtra
export const NASHIK_COORDINATES = {
  lat: 19.9975,
  lng: 73.7898,
};

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapClick({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function LocationPickerMap({ latitude, longitude, onChange }) {
  const lat = latitude ?? NASHIK_COORDINATES.lat;
  const lng = longitude ?? NASHIK_COORDINATES.lng;
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      style={{ height: 280, width: '100%', borderRadius: 8 }}
      scrollWheelZoom
    >
      <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClick
        onPick={(la, lo) => {
          onChange(la, lo);
        }}
      />
      {latitude != null && longitude != null && (
        <Marker position={[latitude, longitude]} icon={defaultIcon}>
          <Popup>Selected location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export function IssueMap({ latitude, longitude, title }) {
  const hasCoords = latitude != null && longitude != null && (latitude !== 0 || longitude !== 0);
  const lat = hasCoords ? latitude : NASHIK_COORDINATES.lat;
  const lng = hasCoords ? longitude : NASHIK_COORDINATES.lng;

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={hasCoords ? 15 : 12}
      style={{ height: 260, width: '100%', borderRadius: 8 }}
      scrollWheelZoom={false}
    >
      <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {hasCoords && (
        <Marker position={[lat, lng]} icon={defaultIcon}>
          <Popup>{title}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
