import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const quickTopics = [
  { label: 'Acne', concern: 'acne' },
  { label: 'Dark Circles', concern: 'dark_circles' },
  { label: 'Wrinkles', concern: 'wrinkles' },
  { label: 'General Tips', concern: 'general' },
];

export default function Coach() {
  const navigate = useNavigate();
  const { getCoachAdvice, analysisResult } = useApp();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI Skin Coach 💎\n\nI can help you understand your skin better and create personalized routines. What would you like to know about?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const formatAdvice = (advice) => {
    let text = `**${advice.explanation}**\n\n`;
    text += '**Common Causes:**\n';
    advice.causes.forEach(c => { text += `• ${c}\n`; });
    text += '\n**Recommended Routine:**\n';
    advice.routine.forEach(r => { text += `→ ${r}\n`; });
    text += '\n**Pro Tips:**\n';
    advice.tips.forEach(t => { text += `💡 ${t}\n`; });
    text += `\n**Lifestyle:**\n🌙 Sleep: ${advice.lifestyle.sleep}\n💧 Water: ${advice.lifestyle.water}\n🥗 Diet: ${advice.lifestyle.diet}`;
    return text;
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);

    const concern = text.toLowerCase().includes('acne') ? 'acne'
      : text.toLowerCase().includes('dark circle') ? 'dark_circles'
      : text.toLowerCase().includes('wrinkle') ? 'wrinkles'
      : 'general';

    try {
      const data = await getCoachAdvice(
        concern,
        analysisResult?.skin_type || 'combination',
        'moderate'
      );
      setMessages(prev => [...prev, { role: 'assistant', content: formatAdvice(data.advice) }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
      }]);
    }
    setLoading(false);
  };

  const renderMessage = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} style={{ fontWeight: 600, marginTop: i > 0 ? 8 : 0, marginBottom: 4 }}>{line.replace(/\*\*/g, '')}</p>;
      }
      return <p key={i} style={{ margin: '2px 0', lineHeight: 1.5 }}>{line}</p>;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: '1px solid var(--border-glass)',
      }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex' }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          background: 'var(--gradient-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Sparkles size={18} color="white" />
        </div>
        <div>
          <p style={{ fontWeight: 600, fontSize: 15 }}>AI Skin Coach</p>
          <p style={{ fontSize: 11, color: 'var(--accent-green)' }}>● Online</p>
        </div>
      </div>

      {/* Quick Topics */}
      <div style={{ padding: '12px 20px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {quickTopics.map(topic => (
          <button
            key={topic.concern}
            onClick={() => sendMessage(topic.label)}
            className="btn-secondary"
            style={{ whiteSpace: 'nowrap', fontSize: 12, padding: '8px 16px' }}
          >
            {topic.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          paddingBottom: 80,
        }}
      >
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              maxWidth: '85%',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              background: msg.role === 'user'
                ? 'var(--gradient-primary)'
                : 'var(--bg-glass)',
              border: msg.role === 'assistant' ? '1px solid var(--border-glass)' : 'none',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              padding: '12px 16px',
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {renderMessage(msg.content)}
          </motion.div>
        ))}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              alignSelf: 'flex-start',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-glass)',
              borderRadius: '16px 16px 16px 4px',
              padding: '12px 16px',
            }}
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ display: 'flex', gap: 4 }}
            >
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--accent-blue)',
                  animationDelay: `${i * 0.2}s`,
                }} />
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 20px',
        paddingBottom: 84,
        borderTop: '1px solid var(--border-glass)',
        display: 'flex',
        gap: 8,
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder="Ask about your skin..."
          style={{
            flex: 1,
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-glass)',
            borderRadius: 12,
            padding: '12px 16px',
            color: 'var(--text-primary)',
            fontSize: 14,
            outline: 'none',
          }}
        />
        <button
          onClick={() => sendMessage(input)}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'var(--gradient-primary)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Send size={18} color="white" />
        </button>
      </div>
    </motion.div>
  );
}
