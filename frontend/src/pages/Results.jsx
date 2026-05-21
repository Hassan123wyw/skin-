import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplets, Sun, Sparkles, Clock, Zap, ChevronRight, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const scoreColors = {
  overall: ['#4f7cff', '#a855f7'],
  hydration: ['#06b6d4', '#4f7cff'],
  acne: ['#10b981', '#06b6d4'],
  glow: ['#f97316', '#ec4899'],
  aging: ['#a855f7', '#ec4899'],
};

const scoreIcons = {
  overall: Sparkles,
  hydration: Droplets,
  acne: Sun,
  glow: Zap,
  aging: Clock,
};

const severityColor = (score) => {
  if (score >= 70) return '#10b981';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
};

const regionPositions = {
  forehead: { top: '12%', left: '50%', transform: 'translateX(-50%)' },
  left_cheek: { top: '45%', left: '18%' },
  right_cheek: { top: '45%', right: '18%' },
  nose: { top: '42%', left: '50%', transform: 'translateX(-50%)' },
  chin: { top: '72%', left: '50%', transform: 'translateX(-50%)' },
  under_eyes: { top: '32%', left: '50%', transform: 'translateX(-50%)' },
};

export default function Results() {
  const navigate = useNavigate();
  const { analysisResult, capturedImage } = useApp();

  if (!analysisResult) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, paddingBottom: 100 }}
      >
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>No analysis yet</p>
        <button className="btn-primary" onClick={() => navigate('/scan')}>Start a Scan</button>
      </motion.div>
    );
  }

  const { scores, conditions, face_regions, skin_type, recommendations } = analysisResult;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{
        height: '100%',
        overflowY: 'auto',
        paddingBottom: 100,
      }}
    >
      {/* Header */}
      <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="gradient-text" style={{ fontSize: 22, fontWeight: 700 }}>Analysis</h1>
        <span style={{
          background: 'rgba(16,185,129,0.15)',
          color: '#10b981',
          padding: '4px 12px',
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 600,
          textTransform: 'capitalize',
        }}>
          {skin_type} skin
        </span>
      </div>

      {/* Main Score */}
      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 16px' }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <motion.circle
                cx="70" cy="70" r="60" fill="none"
                stroke="url(#scoreGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 60}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 60 * (1 - scores.overall / 100) }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                transform="rotate(-90 70 70)"
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4f7cff" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ fontSize: 42, fontWeight: 800, lineHeight: 1 }}
              >
                {scores.overall}
              </motion.span>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>SKIN SCORE</span>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            {scores.overall >= 70 ? 'Your skin looks great! Keep up the routine.' :
             scores.overall >= 50 ? 'Room for improvement. Check recommendations below.' :
             'Your skin needs attention. Follow the AI coach advice.'}
          </p>
        </div>
      </div>

      {/* Sub-scores */}
      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {Object.entries(scores).filter(([k]) => k !== 'overall').map(([key, value], i) => {
            const Icon = scoreIcons[key];
            const colors = scoreColors[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="glass-card"
                style={{ padding: 16 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Icon size={16} color={colors[0]} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{key}</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: severityColor(value) }}>{value}</div>
                <div style={{ marginTop: 8, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, delay: 0.2 * i }}
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`,
                      borderRadius: 2,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Face Heatmap */}
      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Face Map</h3>
        <div className="glass-card" style={{ padding: 24, position: 'relative', minHeight: 280 }}>
          {/* Face outline */}
          <div style={{
            width: 180,
            height: 240,
            margin: '0 auto',
            position: 'relative',
            background: 'radial-gradient(ellipse at center, rgba(79,124,255,0.05) 0%, transparent 70%)',
            borderRadius: '50% 50% 45% 45%',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            {Object.entries(face_regions).map(([region, data]) => {
              const pos = regionPositions[region];
              const color = data.health_score >= 70 ? '#10b981' : data.health_score >= 40 ? '#f59e0b' : '#ef4444';
              return (
                <motion.div
                  key={region}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 * Object.keys(regionPositions).indexOf(region), type: 'spring' }}
                  style={{
                    position: 'absolute',
                    ...pos,
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: `${color}22`,
                    border: `2px solid ${color}66`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  title={`${region}: ${data.health_score} - ${data.primary_concern}`}
                >
                  <span style={{ fontSize: 11, fontWeight: 700, color }}>{data.health_score}</span>
                </motion.div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16, fontSize: 11, color: 'var(--text-secondary)' }}>
            <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#10b981', marginRight: 4 }} />Healthy</span>
            <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', marginRight: 4 }} />Moderate</span>
            <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#ef4444', marginRight: 4 }} />Severe</span>
          </div>
        </div>
      </div>

      {/* Conditions */}
      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Detected Conditions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Object.entries(conditions).slice(0, 8).map(([key, data], i) => {
            const val = data.severity ?? data.level ?? data.score ?? 0;
            const label = key.replace(/_/g, ' ');
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="glass-card"
                style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}
              >
                <span style={{ fontSize: 13, textTransform: 'capitalize', flex: 1, fontWeight: 500 }}>{label}</span>
                <div style={{ width: 80, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    width: `${val}%`,
                    height: '100%',
                    background: `${severityColor(100 - val)}`,
                    borderRadius: 2,
                  }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: severityColor(100 - val), width: 30, textAlign: 'right' }}>{val}%</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Product Recommendations */}
      {recommendations && (
        <div style={{ padding: '0 20px', marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Recommended Products</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(recommendations).map(([type, product], i) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="glass-card"
                style={{ padding: 16, cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{
                      fontSize: 10,
                      textTransform: 'uppercase',
                      color: 'var(--accent-blue)',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                    }}>
                      {type}
                    </span>
                    <p style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{product.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{product.why}</p>
                    <div style={{ display: 'flex', gap: 12, marginTop: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-green)' }}>{product.price}</span>
                      <span style={{ fontSize: 11, color: '#f59e0b' }}>★ {product.rating}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} color="var(--text-tertiary)" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* AI Coach CTA */}
      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/coach')}
          style={{
            width: '100%',
            padding: 20,
            background: 'linear-gradient(135deg, rgba(79,124,255,0.15), rgba(168,85,247,0.15))',
            border: '1px solid rgba(79,124,255,0.2)',
            borderRadius: 16,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontFamily: 'inherit',
            color: 'white',
          }}
        >
          <MessageCircle size={24} color="var(--accent-blue)" />
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontWeight: 600, fontSize: 14 }}>Talk to AI Skin Coach</p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Get personalized advice for your skin</p>
          </div>
          <ChevronRight size={16} color="var(--text-tertiary)" style={{ marginLeft: 'auto' }} />
        </motion.button>
      </div>
    </motion.div>
  );
}
