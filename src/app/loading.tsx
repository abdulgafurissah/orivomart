
export default function Loading() {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    border: '5px solid rgba(52, 152, 219, 0.2)',
                    borderTopColor: '#3498db',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 20px'
                }}></div>
                <h2 style={{
                    color: '#2c3e50',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    animation: 'pulse 1.5s ease-in-out infinite'
                }}>
                    OrivoMart
                </h2>
                <style>{`
                    @keyframes spin { to { transform: rotate(360deg); } }
                    @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
                `}</style>
            </div>
        </div>
    );
}
