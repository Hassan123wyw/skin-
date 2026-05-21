import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function AppProvider({ children }) {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [isPremium, setIsPremium] = useState(false);

  const analyzeImage = useCallback(async (file) => {
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Analysis failed');
      const data = await res.json();
      setAnalysisResult(data);
      setScanHistory(prev => [{ ...data, id: Date.now() }, ...prev].slice(0, 50));
      return data;
    } catch (err) {
      console.error('Analysis error:', err);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const getCoachAdvice = useCallback(async (concern, skinType, severity) => {
    try {
      const res = await fetch(`${API_BASE}/api/coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concern, skin_type: skinType, severity }),
      });
      if (!res.ok) throw new Error('Coach request failed');
      return await res.json();
    } catch (err) {
      console.error('Coach error:', err);
      throw err;
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/history`);
      if (!res.ok) throw new Error('History fetch failed');
      return await res.json();
    } catch (err) {
      console.error('History error:', err);
      throw err;
    }
  }, []);

  return (
    <AppContext.Provider value={{
      analysisResult, setAnalysisResult,
      isAnalyzing, capturedImage, setCapturedImage,
      scanHistory, isPremium, setIsPremium,
      analyzeImage, getCoachAdvice, fetchHistory,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
