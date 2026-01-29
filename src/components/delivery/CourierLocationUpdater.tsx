'use client';

import { useState, useEffect } from 'react';
import { updateLocation } from '@/app/actions/location-actions';

export default function CourierLocationUpdater() {
    const [isSharing, setIsSharing] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let watchId: number;

        if (isSharing) {
            if (!navigator.geolocation) {
                setError('Geolocation is not supported by your browser');
                return;
            }

            watchId = navigator.geolocation.watchPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    await updateLocation(latitude, longitude);
                    setLastUpdate(new Date());
                    setError(null);
                },
                (err) => {
                    setError('Unable to retrieve location: ' + err.message);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        }

        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, [isSharing]);

    return (
        <div className="glass-panel" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem' }}>
            <div>
                <h3 style={{ marginBottom: '0.5rem' }}>Live Location Tracking</h3>
                <p style={{ fontSize: '0.9rem', color: isSharing ? '#2ecc71' : 'var(--text-secondary)' }}>
                    {isSharing ? 'Sharing location live...' : 'Location sharing is paused'}
                </p>
                {lastUpdate && <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Last update: {lastUpdate.toLocaleTimeString()}</p>}
                {error && <p style={{ fontSize: '0.8rem', color: '#e74c3c' }}>{error}</p>}
            </div>

            <button
                onClick={() => setIsSharing(!isSharing)}
                className={`btn ${isSharing ? 'btn-danger' : 'btn-primary'}`}
                style={{
                    background: isSharing ? '#e74c3c' : 'var(--primary)',
                    minWidth: '150px'
                }}
            >
                {isSharing ? 'Stop Sharing' : 'Start Sharing'}
            </button>
        </div>
    );
}
