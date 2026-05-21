import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/onboarding'), 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, rgba(79,124,255,0.12) 0%, transparent 70%), var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated rings */}
      {[1, 2, 3].map(i => (
        <motion.div
          key={i}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.5, 1.5, 2], opacity: [0.3, 0.1, 0] }}
          transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: '50%',
            border: '1px solid rgba(79,124,255,0.3)',
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        style={{
          width: 100,
          height: 100,
          borderRadius: 28,
          background: 'var(--gradient-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
          boxShadow: '0 0 60px rgba(79,124,255,0.3)',
        }}
      >
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
          <path d="M25 5C13.95 5 5 13.95 5 25s8.95 20 20 20 20-8.95 20-20S36.05 5 25 5z" stroke="white" strokeWidth="2" fill="none" />
          <circle cx="18" cy="22" r="2" fill="white" />
          <circle cx="32" cy="22" r="2" fill="white" />
          <path d="M18 32c2 3 5 4 7 4s5-1 7-4" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M10 15l5 3M40 15l-5 3M25 5v5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="gradient-text"
        style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em' }}
      >
        DermaVision
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 8, fontWeight: 300 }}
      >
        AI-Powered Skin Intelligence
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ delay: 1, duration: 1.5, repeat: Infinity }}
        style={{
          position: 'absolute',
          bottom: 60,
          width: 30,
          height: 3,
          borderRadius: 2,
          background: 'var(--gradient-primary)',
        }}
      />
    </motion.div>
  );
}
