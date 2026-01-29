'use client';

import { useEffect, useState } from 'react';
import MapWrapper from '@/components/MapWrapper';
import { getCourierLocation } from '@/app/actions/location-actions';

interface LiveTrackingMapProps {
    trackingCode: string;
    destLat: number;
    destLng: number;
    destAddress: string;
}

export default function LiveTrackingMap({ trackingCode, destLat, destLng, destAddress }: LiveTrackingMapProps) {
    const [courierPos, setCourierPos] = useState<{ lat: number; lng: number; name?: string } | null>(null);

    useEffect(() => {
        // Initial fetch
        fetchLocation();

        // Poll every 10 seconds
        const interval = setInterval(fetchLocation, 10000);

        return () => clearInterval(interval);
    }, [trackingCode]);

    const fetchLocation = async () => {
        const result = await getCourierLocation(trackingCode);
        if (result.success && result.location && result.location.lat && result.location.lng) {
            setCourierPos({
                lat: result.location.lat,
                lng: result.location.lng,
                name: result.location.name || 'Courier'
            });
        }
    };

    return (
        <div style={{ height: '400px', width: '100%', borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
            <MapWrapper
                courierPos={courierPos}
                destPos={{ lat: destLat, lng: destLng, address: destAddress }}
            />
        </div>
    );
}
