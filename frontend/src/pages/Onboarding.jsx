import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Brain, TrendingUp, Shield } from 'lucide-react';

const slides = [
  {
    icon: Scan,
    title: 'AI Skin Scanner',
    description: 'Advanced computer vision analyzes 14+ skin conditions from a single selfie in seconds.',
    gradient: 'linear-gradient(135deg, #4f7cff, #06b6d4)',
  },
  {
    icon: Brain,
    title: 'Smart Analysis',
    description: 'Deep learning maps your face into zones and provides medical-grade insights for each region.',
    gradient: 'linear-gradient(135deg, #a855f7, #ec4899)',
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'Daily scans build your skin health timeline. Watch your scores improve over time.',
    gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your images are analyzed locally and encrypted. We never share your biometric data.',
    gradient: 'linear-gradient(135deg, #f97316, #ef4444)',
  },
];

export default function Onboarding() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (current < slides.length - 1) setCurrent(current + 1);
    else navigate('/scan');
  };

  const slide = slides[current];
  const Icon = slide.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '60px 32px 40px',
        position: 'relative',
      }}
    >
      <button
        onClick={() => navigate('/scan')}
        style={{
          position: 'absolute',
          top: 16,
          right: 20,
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          fontSize: 14,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        Skip
      </button>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
          >
            <div style={{
              width: 120,
              height: 120,
              borderRadius: 32,
              background: slide.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 48,
              boxShadow: `0 0 60px ${slide.gradient.includes('#4f7cff') ? 'rgba(79,124,255,0.3)' : 'rgba(168,85,247,0.3)'}`,
            }}>
              <Icon size={52} color="white" strokeWidth={1.5} />
            </div>

            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, letterSpacing: '-0.02em' }}>
              {slide.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.6, maxWidth: 300 }}>
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
        {slides.map((_, i) => (
          <div key={i} style={{
            width: i === current ? 24 : 6,
            height: 6,
            borderRadius: 3,
            background: i === current ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.15)',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>

      <button className="btn-primary" onClick={next} style={{ width: '100%' }}>
        {current === slides.length - 1 ? 'Start Scanning' : 'Continue'}
      </button>
    </motion.div>
  );
}
