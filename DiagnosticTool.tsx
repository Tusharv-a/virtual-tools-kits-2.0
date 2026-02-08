import React, { useState, useRef, useEffect } from 'react';
import Card from '../components/Card';

const DiagnosticTool: React.FC = () => {
  const [isVibrating, setIsVibrating] = useState(false);
  const [camActive, setCamActive] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isMicRunningRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  const testVibration = () => {
    if ('vibrate' in navigator) {
      setIsVibrating(true);
      navigator.vibrate([200, 100, 200, 100, 500]);
      setTimeout(() => setIsVibrating(false), 1100);
    } else {
      alert("Vibration API not supported on this device.");
    }
  };

  const toggleCamera = async () => {
    if (camActive) {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setCamActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCamActive(true);
        }
      } catch (err) {
        alert("Camera access denied.");
      }
    }
  };

  const toggleMic = async () => {
    if (micActive) {
      isMicRunningRef.current = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      streamRef.current?.getTracks().forEach(track => track.stop());
      setMicActive(false);
      setAudioLevel(0);
    } else {
      try {
        const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
        if (!AudioContextClass) {
          alert("AudioContext not supported on this device.");
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContextClass();
        }
        
        analyserRef.current = audioCtxRef.current.createAnalyser();
        const source = audioCtxRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;
        
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        isMicRunningRef.current = true;
        setMicActive(true);

        const updateLevel = () => {
          if (isMicRunningRef.current && analyserRef.current) {
            analyserRef.current.getByteFrequencyData(dataArray);
            const sum = dataArray.reduce((a, b) => a + b, 0);
            setAudioLevel(Math.round((sum / bufferLength) * 1.5));
            animationFrameRef.current = requestAnimationFrame(updateLevel);
          }
        };
        updateLevel();
      } catch (err) {
        console.error(err);
        alert("Microphone access denied.");
      }
    }
  };

  useEffect(() => {
    return () => {
      isMicRunningRef.current = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      streamRef.current?.getTracks().forEach(track => track.stop());
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24 animate-fadeIn">
      <Card title="Camera Diagnostic" icon="fa-camera">
         <div className="aspect-video bg-slate-800 rounded-2xl overflow-hidden relative group">
           {camActive ? (
             <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
           ) : (
             <div className="absolute inset-0 flex items-center justify-center text-slate-600 flex-col">
               <i className="fa-solid fa-video-slash text-4xl mb-2"></i>
               <span className="text-sm">Camera Offline</span>
             </div>
           )}
           <div className="absolute bottom-4 left-4 right-4 flex justify-center">
             <button 
               onClick={toggleCamera}
               className={`px-6 py-2 rounded-xl font-bold transition-all shadow-lg ${
                 camActive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'
               }`}
             >
               {camActive ? 'Stop Stream' : 'Start Camera'}
             </button>
           </div>
         </div>
      </Card>

      <Card title="Audio & Vibration" icon="fa-volume-high">
         <div className="space-y-6">
           <div className="p-6 bg-slate-800/50 rounded-2xl">
             <div className="flex items-center justify-between mb-4">
               <span className="text-slate-200 font-bold">Microphone Input</span>
               <button 
                 onClick={toggleMic}
                 className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                   micActive ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'
                 }`}
               >
                 <i className={`fa-solid ${micActive ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
               </button>
             </div>
             <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden p-1">
               <div 
                 className="h-full bg-emerald-500 rounded-full transition-all duration-75"
                 style={{ width: `${Math.min(audioLevel, 100)}%` }}
               ></div>
             </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
             <button 
               onClick={testVibration}
               className={`p-6 rounded-2xl flex flex-col items-center gap-2 border border-slate-700 transition-all ${
                 isVibrating ? 'bg-emerald-500 border-emerald-400 text-white' : 'hover:bg-slate-800 text-slate-300'
               }`}
             >
               <i className={`fa-solid fa-mobile-screen-button text-2xl ${isVibrating ? 'animate-bounce' : ''}`}></i>
               <span className="text-sm font-bold">Haptic Test</span>
             </button>

             <button 
               onClick={() => {
                 try {
                   const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
                   const ctx = new AudioContextClass();
                   const osc = ctx.createOscillator();
                   const gain = ctx.createGain();
                   osc.connect(gain);
                   gain.connect(ctx.destination);
                   osc.frequency.setValueAtTime(440, ctx.currentTime);
                   gain.gain.setValueAtTime(0.1, ctx.currentTime);
                   osc.start();
                   gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
                   osc.stop(ctx.currentTime + 0.5);
                 } catch (e) {
                   console.error("Speaker test failed", e);
                 }
               }}
               className="p-6 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-all flex flex-col items-center gap-2 text-slate-300"
             >
               <i className="fa-solid fa-music text-2xl"></i>
               <span className="text-sm font-bold">Speaker Test</span>
             </button>
           </div>
         </div>
      </Card>

      <Card title="Display Test" icon="fa-display">
         <div className="grid grid-cols-4 gap-2 py-4">
            {['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-white', 'bg-black', 'bg-yellow-500', 'bg-cyan-500', 'bg-magenta-500'].map((color, i) => (
              <button 
                key={i} 
                className={`w-full aspect-square ${color} rounded-lg border-2 border-slate-700 hover:scale-105 transition-transform`}
                onClick={() => alert("Calibration block checked.")}
              ></button>
            ))}
         </div>
      </Card>
    </div>
  );
};

export default DiagnosticTool;