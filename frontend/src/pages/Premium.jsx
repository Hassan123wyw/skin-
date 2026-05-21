import { motion } from 'framer-motion';
import { ArrowLeft, Check, Zap, Brain, LineChart, Shield, Infinity, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
  { icon: Brain, text: 'Unlimited AI deep scans' },
  { icon: LineChart, text: 'Advanced analytics & trends' },
  { icon: Infinity, text: 'Unlimited AI Coach sessions' },
  { icon: Shield, text: 'Priority dermatologist access' },
  { icon: Crown, text: 'Exclusive product discounts' },
  { icon: Zap, text: 'Real-time AR skin scanner' },
];

const plans = [
  { period: 'Weekly', price: '$4.99', perWeek: '$4.99/wk', popular: false },
  { period: 'Monthly', price: '$12.99', perWeek: '$3.25/wk', popular: true },
  { period: 'Yearly', price: '$79.99', perWeek: '$1.54/wk', popular: false, save: 'Save 49%' },
];

export default function Premium() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        height: '100%',
        overflowY: 'auto',
        background: 'radial-gradient(ellipse at top, rgba(168,85,247,0.12) 0%, transparent 50%), var(--bg-primary)',
      }}
    >
      {/* Header */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex' }}>
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '0 32px 32px' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            background: 'var(--gradient-warm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 0 60px rgba(249,115,22,0.3)',
          }}
        >
          <Crown size={38} color="white" />
        </motion.div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          Unlock <span className="gradient-text">Premium</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.5 }}>
          Get unlimited access to advanced AI skin analysis and personalized coaching.
        </p>
      </div>

      {/* Features */}
      <div style={{ padding: '0 20px', marginBottom: 32 }}>
        <div className="glass-card" style={{ padding: 20 }}>
          {features.map(({ icon: Icon, text }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 0',
                borderBottom: i < features.length - 1 ? '1px solid var(--border-glass)' : 'none',
              }}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(168,85,247,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Icon size={16} color="var(--accent-purple)" />
              </div>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{text}</span>
              <Check size={16} color="var(--accent-green)" style={{ marginLeft: 'auto' }} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div style={{ padding: '0 20px', marginBottom: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {plans.map((plan, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={plan.popular ? '' : 'glass-card'}
              style={{
                width: '100%',
                padding: 16,
                borderRadius: 16,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: 'inherit',
                color: 'white',
                ...(plan.popular
                  ? {
                      background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.2))',
                      border: '2px solid rgba(168,85,247,0.4)',
                    }
                  : { border: '1px solid var(--border-glass)', background: 'var(--bg-glass)' }),
                position: 'relative',
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: -10,
                  right: 16,
                  background: 'var(--gradient-primary)',
                  padding: '2px 10px',
                  borderRadius: 8,
                  fontSize: 10,
                  fontWeight: 700,
                }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontWeight: 600, fontSize: 16 }}>{plan.period}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{plan.perWeek}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 700, fontSize: 20 }}>{plan.price}</p>
                {plan.save && (
                  <span style={{
                    fontSize: 11,
                    color: 'var(--accent-green)',
                    fontWeight: 600,
                  }}>
                    {plan.save}
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '0 20px 40px' }}>
        <button className="btn-primary" style={{ width: '100%', fontSize: 17 }}>
          Start 7-Day Free Trial
        </button>
        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-tertiary)', marginTop: 12 }}>
          Cancel anytime. No commitment required.
        </p>
      </div>
    </motion.div>
  );
}
