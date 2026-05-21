import { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Upload, Zap, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Scanner() {
  const navigate = useNavigate();
  const { analyzeImage, setCapturedImage } = useApp();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState('user');
  const streamRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setCameraActive(true);
    } catch (err) {
      console.error('Camera error:', err);
      alert('Camera access is required. Please allow camera permissions or upload an image instead.');
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    stopCamera();

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
      navigate('/analyzing');
      try {
        await analyzeImage(file);
        navigate('/results');
      } catch {
        navigate('/scan');
        alert('Analysis failed. Please try again.');
      }
    }, 'image/jpeg', 0.9);
  }, [analyzeImage, setCapturedImage, stopCamera, navigate]);

  const handleFileUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setCapturedImage(reader.result);
    reader.readAsDataURL(file);

    navigate('/analyzing');
    try {
      await analyzeImage(file);
      navigate('/results');
    } catch {
      navigate('/scan');
      alert('Analysis failed. Please try again.');
    }
  }, [analyzeImage, setCapturedImage, navigate]);

  const toggleCamera = () => {
    stopCamera();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    setTimeout(startCamera, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-primary)',
      }}
    >
      {/* Header */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="gradient-text" style={{ fontSize: 22, fontWeight: 700 }}>DermaVision</h1>
        <button
          onClick={() => navigate('/premium')}
          style={{
            background: 'var(--gradient-warm)',
            border: 'none',
            borderRadius: 20,
            padding: '6px 14px',
            color: 'white',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontFamily: 'inherit',
          }}
        >
          <Zap size={12} /> PRO
        </button>
      </div>

      {/* Camera viewport */}
      <div style={{
        flex: 1,
        position: 'relative',
        margin: '0 20px',
        borderRadius: 24,
        overflow: 'hidden',
        background: '#1a1a2e',
      }}>
        {cameraActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
            />
            {/* Scan overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: '70%',
                  aspectRatio: '3/4',
                  border: '2px solid rgba(79,124,255,0.5)',
                  borderRadius: 120,
                  boxShadow: '0 0 30px rgba(79,124,255,0.15), inset 0 0 30px rgba(79,124,255,0.05)',
                }}
              />
            </div>
            {/* Scan line */}
            <motion.div
              animate={{ y: ['0%', '100%', '0%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                left: '15%',
                right: '15%',
                height: 2,
                top: '20%',
                background: 'linear-gradient(90deg, transparent, rgba(79,124,255,0.8), transparent)',
                boxShadow: '0 0 20px rgba(79,124,255,0.5)',
              }}
            />
            {/* Corner brackets */}
            {[
              { top: '15%', left: '15%', borderTop: '2px solid', borderLeft: '2px solid' },
              { top: '15%', right: '15%', borderTop: '2px solid', borderRight: '2px solid' },
              { bottom: '15%', left: '15%', borderBottom: '2px solid', borderLeft: '2px solid' },
              { bottom: '15%', right: '15%', borderBottom: '2px solid', borderRight: '2px solid' },
            ].map((style, i) => (
              <div key={i} style={{
                position: 'absolute',
                width: 24,
                height: 24,
                borderColor: 'rgba(79,124,255,0.6)',
                ...style,
                borderRadius: i < 2 ? (i === 0 ? '8px 0 0 0' : '0 8px 0 0') : (i === 2 ? '0 0 0 8px' : '0 0 8px 0'),
              }} />
            ))}
          </>
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
          }}>
            <div style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'rgba(79,124,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(79,124,255,0.2)',
            }}>
              <Camera size={40} color="var(--accent-blue)" strokeWidth={1.5} />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Position your face in the frame
            </p>
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      {/* Controls */}
      <div style={{ padding: '24px 20px 90px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {cameraActive ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
            <button onClick={toggleCamera} className="btn-secondary" style={{ width: 48, height: 48, padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RotateCcw size={20} />
            </button>
            <button
              onClick={capturePhoto}
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                border: '4px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(79,124,255,0.4)',
              }}
            >
              <div style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.5)' }} />
            </button>
            <button onClick={stopCamera} className="btn-secondary" style={{ width: 48, height: 48, padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
              ✕
            </button>
          </div>
        ) : (
          <>
            <button className="btn-primary" onClick={startCamera} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Camera size={20} /> Open Camera
            </button>
            <button
              className="btn-secondary"
              onClick={() => fileInputRef.current?.click()}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <Upload size={18} /> Upload Photo
            </button>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </div>
    </motion.div>
  );
}
