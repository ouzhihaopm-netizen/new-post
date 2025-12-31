
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, X, RotateCcw } from 'lucide-react';

interface Props {
  onCapture: (base64: string, file: File) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<Props> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsReady(true);
      setError(null);
    } catch (err) {
      console.error("相机访问错误:", err);
      setError("无法访问相机。请确保已授予相关权限。");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      const base64 = dataUrl.split(',')[1];
      
      const blob = dataURItoBlob(dataUrl);
      const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
      
      onCapture(base64, file);
    }
  };

  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl overflow-hidden w-full max-w-2xl shadow-2xl relative flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-bold text-slate-700">实时相机</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Preview */}
        <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="text-white text-center p-8 space-y-4">
              <Camera className="w-12 h-12 mx-auto text-slate-500" />
              <p className="font-medium">{error}</p>
              <button 
                onClick={startCamera}
                className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-bold"
              >
                重试访问
              </button>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`w-full h-full object-cover transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'}`}
              />
              {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <RotateCcw className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls */}
        <div className="p-6 bg-slate-50 flex items-center justify-center space-x-8">
          <button 
            onClick={onClose}
            className="flex flex-col items-center space-y-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <div className="p-3 bg-white rounded-full shadow-sm border border-slate-200">
              <X className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">取消</span>
          </button>

          <button 
            onClick={capturePhoto}
            disabled={!isReady}
            className={`
              relative flex items-center justify-center w-20 h-20 rounded-full border-4 border-white shadow-xl transition-all active:scale-95
              ${isReady ? 'bg-indigo-600' : 'bg-slate-300'}
            `}
          >
            <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center">
               <Camera className="w-8 h-8 text-white" />
            </div>
          </button>

          <div className="flex flex-col items-center space-y-1 text-slate-400 opacity-20">
            <div className="p-3 bg-white rounded-full shadow-sm border border-slate-200">
              <RotateCcw className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">切换</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
