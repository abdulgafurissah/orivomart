'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default marker icons in Next.js
const icon = L.icon({
    iconUrl: '/location-pin.png', // We might need a custom icon or use default
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

// Using a simple workaround for missing marker icons if we don't have images
// We can use a colored div icon or similar.
const CourierIcon = L.divIcon({
    className: 'custom-icon',
    html: '<div style="background-color: #e74c3c; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white;"></div>',
    iconSize: [20, 20],
});

const DestinationIcon = L.divIcon({
    className: 'custom-icon',
    html: '<div style="background-color: #2ecc71; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white;"></div>',
    iconSize: [20, 20],
});

function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng, map]);
    return null;
}

interface MapProps {
    courierPos?: { lat: number; lng: number; name?: string } | null;
    destPos?: { lat: number; lng: number; address?: string } | null;
}

export default function Map({ courierPos, destPos }: MapProps) {
    // Default center (e.g., Accra, Ghana) if no positions
    const defaultCenter: [number, number] = [5.6037, -0.1870];
    const center = courierPos ? [courierPos.lat, courierPos.lng] : (destPos ? [destPos.lat, destPos.lng] : defaultCenter) as [number, number];

    return (
        <MapContainer
            center={center}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {courierPos && (
                <>
                    <Marker position={[courierPos.lat, courierPos.lng]} icon={CourierIcon}>
                        <Popup>
                            Courier: {courierPos.name || 'Driver'}
                            <br />
                            (Live Location)
                        </Popup>
                    </Marker>
                    <MapRecenter lat={courierPos.lat} lng={courierPos.lng} />
                </>
            )}

            {destPos && (
                <Marker position={[destPos.lat, destPos.lng]} icon={DestinationIcon}>
                    <Popup>
                        Destination
                        <br />
                        {destPos.address}
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    );
}
