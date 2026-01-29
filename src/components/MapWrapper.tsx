'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./Map'), {
    ssr: false,
    loading: () => <div style={{ height: '100%', width: '100%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>Loading Map...</div>
});

export default Map;
