import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useApp } from '../context/AppContext';

const metrics = [
  { key: 'overall', label: 'Overall', color: '#4f7cff' },
  { key: 'hydration', label: 'Hydration', color: '#06b6d4' },
  { key: 'acne', label: 'Acne', color: '#10b981' },
  { key: 'glow', label: 'Glow', color: '#f97316' },
  { key: 'aging', label: 'Aging', color: '#a855f7' },
];

export default function History() {
  const { fetchHistory } = useApp();
  const [history, setHistory] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('overall');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchHistory();
        setHistory(data.history);
      } catch {
        setHistory(null);
      }
      setLoading(false);
    };
    load();
  }, [fetchHistory]);

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ width: 32, height: 32, border: '2px solid var(--border-glass)', borderTop: '2px solid var(--accent-blue)', borderRadius: '50%' }}
        />
      </motion.div>
    );
  }

  const chartData = history?.map(h => ({
    date: h.date.slice(5),
    value: h.scores[selectedMetric],
  })) || [];

  const latestScores = history?.[history.length - 1]?.scores;
  const prevScores = history?.[history.length - 8]?.scores;

  const getTrend = (key) => {
    if (!latestScores || !prevScores) return 0;
    return latestScores[key] - prevScores[key];
  };

  const metricColor = metrics.find(m => m.key === selectedMetric)?.color || '#4f7cff';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ height: '100%', overflowY: 'auto', paddingBottom: 100 }}
    >
      <div style={{ padding: '16px 20px' }}>
        <h1 className="gradient-text" style={{ fontSize: 22, fontWeight: 700 }}>Progress</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
          <Calendar size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
          Last 30 days
        </p>
      </div>

      {/* Metric tabs */}
      <div style={{ padding: '0 20px', display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 20 }}>
        {metrics.map(m => (
          <button
            key={m.key}
            onClick={() => setSelectedMetric(m.key)}
            style={{
              padding: '8px 14px',
              borderRadius: 20,
              border: selectedMetric === m.key ? 'none' : '1px solid var(--border-glass)',
              background: selectedMetric === m.key ? m.color + '22' : 'transparent',
              color: selectedMetric === m.key ? m.color : 'var(--text-secondary)',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontFamily: 'inherit',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ padding: '0 12px', marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: '20px 8px 8px' }}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.15)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.15)" fontSize={10} tickLine={false} axisLine={false} width={25} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(18,18,26,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  fontSize: 12,
                  color: 'white',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={metricColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: metricColor }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend Cards */}
      <div style={{ padding: '0 20px' }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Weekly Trends</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {metrics.map((m, i) => {
            const trend = getTrend(m.key);
            const isUp = trend >= 0;
            return (
              <motion.div
                key={m.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="glass-card"
                style={{ padding: 14 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{m.label}</span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    color: isUp ? '#10b981' : '#ef4444',
                    fontSize: 11,
                    fontWeight: 600,
                  }}>
                    {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(trend)}
                  </div>
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: m.color }}>
                  {latestScores?.[m.key] ?? '—'}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Insight */}
      {latestScores && (
        <div style={{ padding: '20px 20px 0' }}>
          <div className="glass-card" style={{
            padding: 16,
            background: 'linear-gradient(135deg, rgba(79,124,255,0.08), rgba(168,85,247,0.08))',
            border: '1px solid rgba(79,124,255,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <TrendingUp size={16} color="var(--accent-blue)" />
              <span style={{ fontWeight: 600, fontSize: 14 }}>Weekly Insight</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {getTrend('overall') > 0
                ? `Your skin score improved by ${getTrend('overall')} points this week. Keep up the great routine!`
                : 'Focus on hydration and consistent skincare to boost your scores next week.'}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
