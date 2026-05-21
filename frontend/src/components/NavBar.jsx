import { useLocation, useNavigate } from 'react-router-dom';
import { Scan, MessageCircle, BarChart3, Settings, Sparkles } from 'lucide-react';

const tabs = [
  { path: '/scan', icon: Scan, label: 'Scan' },
  { path: '/results', icon: Sparkles, label: 'Results' },
  { path: '/coach', icon: MessageCircle, label: 'Coach' },
  { path: '/history', icon: BarChart3, label: 'History' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 72,
      background: 'rgba(10, 10, 15, 0.9)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 8px',
      zIndex: 100,
    }}>
      {tabs.map(({ path, icon: Icon, label }) => {
        const active = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: 12,
              transition: 'all 0.2s',
            }}
          >
            <Icon
              size={22}
              color={active ? '#4f7cff' : 'rgba(255,255,255,0.35)'}
              strokeWidth={active ? 2.5 : 1.5}
            />
            <span style={{
              fontSize: 10,
              fontWeight: active ? 600 : 400,
              color: active ? '#4f7cff' : 'rgba(255,255,255,0.35)',
              letterSpacing: '0.02em',
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
