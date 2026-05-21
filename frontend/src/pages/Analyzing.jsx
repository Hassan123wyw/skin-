import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const stages = [
  { label: 'Detecting face', icon: '👤' },
  { label: 'Extracting landmarks', icon: '📍' },
  { label: 'Segmenting skin', icon: '🔬' },
  { label: 'Analyzing texture', icon: '🧬' },
  { label: 'Classifying conditions', icon: '🧪' },
  { label: 'Computing scores', icon: '📊' },
  { label: 'Generating report', icon: '✨' },
];

export default function Analyzing() {
  const { capturedImage } = useApp();

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
        padding: 32,
        background: 'radial-gradient(ellipse at center, rgba(79,124,255,0.08) 0%, transparent 70%), var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background scan effect */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          border: '1px solid rgba(79,124,255,0.1)',
          borderTop: '2px solid rgba(79,124,255,0.4)',
        }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          border: '1px solid rgba(168,85,247,0.08)',
          borderBottom: '2px solid rgba(168,85,247,0.3)',
        }}
      />

      {/* Image preview */}
      {capturedImage && (
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 0.95, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid rgba(79,124,255,0.4)',
            boxShadow: '0 0 40px rgba(79,124,255,0.2)',
            marginBottom: 40,
          }}
        >
          <img src={capturedImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <motion.div
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, transparent 0%, rgba(79,124,255,0.3) 50%, transparent 100%)',
              height: '30%',
            }}
          />
        </motion.div>
      )}

      <motion.h2
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="gradient-text"
        style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}
      >
        Analyzing Your Skin
      </motion.h2>

      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 40 }}>
        AI is processing 14+ skin metrics...
      </p>

      {/* Pipeline stages */}
      <div style={{ width: '100%', maxWidth: 280 }}>
        {stages.map((stage, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.2, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.4, duration: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '8px 0',
            }}
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.4 + 0.1, type: 'spring' }}
              style={{ fontSize: 18 }}
            >
              {stage.icon}
            </motion.span>
            <span style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 400 }}>
              {stage.label}
            </span>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: i * 0.4, duration: 0.4 }}
              style={{
                flex: 1,
                height: 2,
                background: 'var(--gradient-primary)',
                borderRadius: 1,
              }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
