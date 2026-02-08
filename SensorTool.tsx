import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SensorTool: React.FC = () => {
  const [accel, setAccel] = useState({ x: 0, y: 0, z: 0 });
  const [gyro, setGyro] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [history, setHistory] = useState<any[]>([]);
  const [light, setLight] = useState<number | null>(null);

  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
      const accelData = event.accelerationIncludingGravity;
      const x = accelData?.x ?? 0;
      const y = accelData?.y ?? 0;
      const z = accelData?.z ?? 0;

      const fixedX = Number(Number(x).toFixed(2));
      const fixedY = Number(Number(y).toFixed(2));
      const fixedZ = Number(Number(z).toFixed(2));

      setAccel({ x: fixedX, y: fixedY, z: fixedZ });
      
      setHistory(prev => {
        const next = [...prev, { 
          time: Date.now(), 
          x: fixedX, 
          y: fixedY, 
          z: fixedZ 
        }];
        return next.slice(-30);
      });
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      setGyro({
        alpha: Number((event.alpha ?? 0).toFixed(2)),
        beta: Number((event.beta ?? 0).toFixed(2)),
        gamma: Number((event.gamma ?? 0).toFixed(2)),
      });
    };

    // Note: Requesting permissions for motion/orientation is required on some mobile browsers
    const DeviceMotionRequest = (DeviceMotionEvent as any);
    if (typeof DeviceMotionRequest?.requestPermission === 'function') {
      DeviceMotionRequest.requestPermission().catch(console.error);
    }

    window.addEventListener('devicemotion', handleMotion);
    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Accelerometer" icon="fa-arrows-up-down-left-right">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-slate-800/50 rounded-2xl text-center">
              <div className="text-xs text-slate-500 mb-1">X-AXIS</div>
              <div className="text-xl font-mono font-bold text-red-400">{accel.x}</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-2xl text-center">
              <div className="text-xs text-slate-500 mb-1">Y-AXIS</div>
              <div className="text-xl font-mono font-bold text-green-400">{accel.y}</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-2xl text-center">
              <div className="text-xs text-slate-500 mb-1">Z-AXIS</div>
              <div className="text-xl font-mono font-bold text-blue-400">{accel.z}</div>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis hide dataKey="time" />
                <YAxis domain={[-15, 15]} stroke="#64748b" fontSize={10} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="x" stroke="#f87171" dot={false} strokeWidth={2} isAnimationActive={false} />
                <Line type="monotone" dataKey="y" stroke="#4ade80" dot={false} strokeWidth={2} isAnimationActive={false} />
                <Line type="monotone" dataKey="z" stroke="#60a5fa" dot={false} strokeWidth={2} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Orientation" icon="fa-compass">
           <div className="flex flex-col items-center justify-center space-y-8 py-4">
              <div className="relative w-48 h-48 rounded-full border-4 border-slate-800 flex items-center justify-center shadow-2xl shadow-emerald-500/5">
                <div 
                  className="absolute inset-0 flex items-center justify-center transition-transform duration-100"
                  style={{ transform: `rotate(${gyro.alpha}deg)` }}
                >
                  <div className="w-1 h-32 bg-gradient-to-t from-transparent via-emerald-500 to-transparent relative">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
                  </div>
                </div>
                <div className="text-3xl font-black text-white">{Math.round(gyro.alpha)}°</div>
                <div className="absolute top-2 font-bold text-slate-500">N</div>
                <div className="absolute bottom-2 font-bold text-slate-500">S</div>
              </div>

              <div className="w-full grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <span className="text-xs text-slate-500 block mb-1 uppercase tracking-wider">Pitch</span>
                  <span className="text-lg font-bold text-slate-200">{gyro.beta}°</span>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <span className="text-xs text-slate-500 block mb-1 uppercase tracking-wider">Roll</span>
                  <span className="text-lg font-bold text-slate-200">{gyro.gamma}°</span>
                </div>
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default SensorTool;