import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle, AlertTriangle, ChevronRight, X } from 'lucide-react';
import Button from './Button';
import { useLanguage } from '../contexts/LanguageContext';

interface CameraCaptureProps {
  onCaptureComplete: (photos: { front?: string }) => void;
  onSkip: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCaptureComplete, onSkip }) => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [brightness, setBrightness] = useState<number>(0);
  const [lightingStatus, setLightingStatus] = useState<'bad' | 'ok' | 'good'>('bad');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // Light meter loop
  useEffect(() => {
    if (!stream || capturedImage) return;
    const interval = setInterval(checkLighting, 500);
    return () => clearInterval(interval);
  }, [stream, capturedImage]);

  // Auto-countdown logic
  useEffect(() => {
    if (lightingStatus === 'good' && !countdown && !capturedImage && stream) {
      setCountdown(3);
    } else if (lightingStatus === 'bad' && countdown !== null) {
      setCountdown(null); // Reset if lighting gets bad
    }
  }, [lightingStatus, capturedImage, stream]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c! - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      takePhoto();
      setCountdown(null);
    }
  }, [countdown]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setPermissionError(false);
    } catch (err) {
      console.error("Camera error:", err);
      setPermissionError(true);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const checkLighting = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    context.drawImage(videoRef.current, 0, 0, 100, 100);
    const imageData = context.getImageData(0, 0, 100, 100);
    const data = imageData.data;
    
    let colorSum = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const avg = (r + g + b) / 3;
      colorSum += avg;
    }

    const brightnessValue = Math.floor(colorSum / (100 * 100));
    setBrightness(brightnessValue);

    // Strict gates: <70 is too dark, >220 is blown out
    if (brightnessValue < 70 || brightnessValue > 220) setLightingStatus('bad');
    else if (brightnessValue >= 70 && brightnessValue < 100) setLightingStatus('ok'); // Passable
    else setLightingStatus('good'); // Perfect
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
  };

  const confirmPhoto = () => {
    onCaptureComplete({ front: capturedImage! });
  };

  const getOverlayText = () => {
    if (brightness < 70) return t.camera.tooDark;
    if (brightness > 220) return t.camera.tooBright;
    if (countdown !== null) return t.camera.holdStill;
    return t.camera.good;
  };

  if (permissionError) {
    return (
      <div className="fixed inset-0 bg-charcoal/90 flex items-center justify-center p-6 z-50">
        <div className="bg-cream p-8 rounded-sm max-w-sm text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-gold mb-4" />
          <h3 className="text-xl font-playfair font-bold text-charcoal mb-2">{t.camera.permission}</h3>
          <p className="text-charcoal/70 mb-6 text-sm">Please allow access or continue without photos.</p>
          <Button onClick={onSkip} variant="outline" className="w-full">{t.onboarding.photoNo}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-charcoal flex flex-col">
      {/* Header */}
      <div className="h-16 bg-charcoal border-b border-gold/20 flex items-center justify-between px-6">
        <h3 className="font-playfair font-bold text-cream text-lg">{t.camera.title}</h3>
        <button onClick={onSkip} className="text-gold text-sm hover:text-white uppercase tracking-wider font-medium flex items-center gap-1">
          <X size={16} /> {t.camera.skip}
        </button>
      </div>

      {/* Camera Area */}
      <div className="flex-1 relative bg-black flex flex-col justify-center overflow-hidden">
        {!capturedImage && (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1] opacity-90"
          />
        )}
        
        {capturedImage && (
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" 
          />
        )}

        {/* Guides & Overlays (Only when live) */}
        {!capturedImage && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Oval Face Guide */}
            <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[55%] border-2 rounded-[50%] transition-colors duration-300 ${
              lightingStatus === 'good' ? 'border-gold shadow-[0_0_20px_rgba(203,170,109,0.5)]' : 'border-white/30'
            }`}>
              {/* Crosshairs */}
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20"></div>
              <div className="absolute left-0 right-0 top-1/3 h-px bg-white/20"></div>
            </div>

            {/* Status Badge */}
            <div className="absolute top-8 left-0 right-0 flex justify-center">
              <div className={`px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2 transition-all ${
                lightingStatus === 'good' ? 'bg-gold/90 text-charcoal' : 'bg-charcoal/80 text-cream border border-red-500/50'
              }`}>
                {lightingStatus === 'good' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                <span className="text-xs font-bold uppercase tracking-wider">{getOverlayText()}</span>
              </div>
            </div>

            {/* Countdown Overlay */}
            {countdown !== null && countdown > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <span className="text-9xl font-playfair font-bold text-gold animate-pulse">{countdown}</span>
              </div>
            )}
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Footer Controls */}
      <div className="h-32 bg-charcoal border-t border-gold/20 flex items-center justify-center px-6">
        {!capturedImage ? (
          <div className="flex flex-col items-center gap-3">
             <p className="text-cream/60 text-xs">{t.camera.instruction}</p>
             <button 
              onClick={takePhoto}
              disabled={lightingStatus === 'bad'}
              className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all ${
                lightingStatus !== 'bad' 
                  ? 'border-gold bg-transparent hover:bg-gold/10 scale-100' 
                  : 'border-white/10 bg-transparent cursor-not-allowed opacity-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-full ${lightingStatus !== 'bad' ? 'bg-gold' : 'bg-white/10'}`} />
            </button>
          </div>
        ) : (
          <div className="flex gap-4 w-full max-w-md">
            <Button onClick={() => setCapturedImage(null)} variant="outline" className="flex-1 bg-transparent border-cream text-cream hover:bg-white/10 hover:text-white">
              <RefreshCw size={16} /> {t.camera.retake}
            </Button>
            <Button onClick={confirmPhoto} variant="primary" className="flex-1">
              {t.camera.use} <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;