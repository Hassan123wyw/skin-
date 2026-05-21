import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Shield, Moon, HelpCircle, Star, LogOut, ChevronRight, Crown } from 'lucide-react';

const sections = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Edit Profile', sub: 'Name, age, skin type' },
      { icon: Crown, label: 'Premium', sub: 'Manage subscription', accent: true },
      { icon: Bell, label: 'Notifications', sub: 'Push, email, reminders' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Moon, label: 'Appearance', sub: 'Dark mode (always on)' },
      { icon: Shield, label: 'Privacy', sub: 'Data, permissions, storage' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help Center', sub: 'FAQs, contact support' },
      { icon: Star, label: 'Rate DermaVision', sub: 'Leave a review' },
    ],
  },
];

export default function Settings() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ height: '100%', overflowY: 'auto', paddingBottom: 100 }}
    >
      <div style={{ padding: '16px 20px' }}>
        <h1 className="gradient-text" style={{ fontSize: 22, fontWeight: 700 }}>Settings</h1>
      </div>

      {/* Profile card */}
      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            fontWeight: 700,
          }}>
            D
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, fontSize: 16 }}>DermaVision User</p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Free Plan</p>
          </div>
          <button
            onClick={() => navigate('/premium')}
            style={{
              background: 'var(--gradient-warm)',
              border: 'none',
              borderRadius: 20,
              padding: '8px 16px',
              color: 'white',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Upgrade
          </button>
        </div>
      </div>

      {/* Sections */}
      {sections.map((section, si) => (
        <div key={si} style={{ padding: '0 20px', marginBottom: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, paddingLeft: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {section.title}
          </p>
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            {section.items.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 16px',
                    background: 'none',
                    border: 'none',
                    borderBottom: i < section.items.length - 1 ? '1px solid var(--border-glass)' : 'none',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                  }}
                  onClick={() => {
                    if (item.label === 'Premium') navigate('/premium');
                  }}
                >
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: item.accent ? 'rgba(249,115,22,0.1)' : 'rgba(255,255,255,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon size={16} color={item.accent ? '#f97316' : 'var(--text-secondary)'} />
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>{item.sub}</p>
                  </div>
                  <ChevronRight size={14} color="var(--text-tertiary)" />
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Version */}
      <div style={{ padding: '0 20px', marginBottom: 20 }}>
        <button
          className="glass-card"
          style={{
            width: '100%',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(239,68,68,0.05)',
            border: '1px solid rgba(239,68,68,0.1)',
            cursor: 'pointer',
            color: '#ef4444',
            fontFamily: 'inherit',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <LogOut size={16} />
          <span style={{ fontSize: 14, fontWeight: 500 }}>Sign Out</span>
        </button>
      </div>

      <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-tertiary)', padding: 20 }}>
        DermaVision AI v1.0.0
      </p>
    </motion.div>
  );
}
