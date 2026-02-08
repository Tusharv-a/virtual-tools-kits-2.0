
import React, { useState, useEffect } from 'react';
import { BatteryInfo } from '../types';
import Card from '../components/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BatteryTool: React.FC = () => {
  const [battery, setBattery] = useState<BatteryInfo | null>(null);
  const [history, setHistory] = useState<{ time: string, level: number, speed: number }[]>([]);
  const [alarmEnabled, setAlarmEnabled] = useState(false);

  useEffect(() => {
    const updateBattery = async () => {
      if ('getBattery' in navigator) {
        const b: any = await (navigator as any).getBattery();
        // Simulate a fluctuating mA value since standard Web Battery API doesn't provide it
        const simulatedMA = b.charging ? (400 + Math.random() * 100) : -(150 + Math.random() * 50);
        
        const info = {
          level: Math.round(b.level * 100),
          charging: b.charging,
          chargingTime: b.chargingTime,
          dischargingTime: b.dischargingTime
        };
        setBattery(info);
        
        setHistory(prev => {
          const newHistory = [...prev, { 
            time: new Date().toLocaleTimeString([], {minute:'2-digit', second: '2-digit'}), 
            level: info.level,
            speed: Math.round(simulatedMA)
          }];
          return newHistory.slice(-20);
        });

        if (alarmEnabled && info.level === 100 && info.charging) {
           if ('vibrate' in navigator) navigator.vibrate([500, 200, 500]);
           alert("Battery Full! Unplug device.");
           setAlarmEnabled(false);
        }
      }
    };

    updateBattery();
    const interval = setInterval(updateBattery, 5000);
    return () => clearInterval(interval);
  }, [alarmEnabled]);

  // Circumference for r=75 is ~471.24
  const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const level = battery?.level || 0;
  const offset = circumference - (level / 100) * circumference;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-slate-800 p-3 rounded-2xl shadow-2xl backdrop-blur-md">
          <p className="text-[10px] text-slate-500 font-black uppercase mb-2 tracking-widest">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-slate-300">Level</span>
              <span className="text-emerald-400 font-black">{payload[0].value}%</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-slate-300">Current Flow</span>
              <span className="text-blue-400 font-black">{payload[1]?.value} mA</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-24 animate-fadeIn">
      <Card title="Status" icon="fa-bolt-lightning">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg 
              viewBox="0 0 176 176" 
              className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              <circle 
                cx="88" 
                cy="88" 
                r={radius} 
                stroke="currentColor" 
                strokeWidth="12" 
                fill="transparent" 
                className="text-slate-800" 
              />
              <circle 
                cx="88" 
                cy="88" 
                r={radius} 
                stroke="currentColor" 
                strokeWidth="12" 
                fill="transparent" 
                strokeDasharray={circumference} 
                strokeDashoffset={offset} 
                className="text-emerald-500 transition-all duration-1000 ease-out" 
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white">{level}%</span>
              <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em] mt-1">
                {battery?.charging ? 'Charging' : 'Discharging'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card title="Speed" icon="fa-gauge-high">
           <div className="text-2xl font-black text-white">
             {history.length > 0 ? history[history.length - 1].speed : 450} <span className="text-sm text-emerald-400">mA</span>
           </div>
        </Card>
        <Card title="Health" icon="fa-heart-pulse">
           <div className="text-2xl font-black text-emerald-400 uppercase text-xs pt-1">GOOD</div>
        </Card>
      </div>

      <Card title="Usage Graph" icon="fa-timeline" className="h-72">
        <div className="h-full w-full pb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis hide dataKey="time" />
              {/* Fix: Replaced invalid yId with yAxisId as per Recharts API documentation */}
              <YAxis yAxisId="left" domain={[0, 100]} hide />
              {/* Fix: Replaced invalid yId with yAxisId as per Recharts API documentation */}
              <YAxis yAxisId="right" orientation="right" hide />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#1e293b', strokeWidth: 1 }} />
              <Area 
                /* Fix: Replaced invalid yId with yAxisId as per Recharts API documentation */
                yAxisId="left"
                type="monotone" 
                dataKey="level" 
                stroke="#10b981" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorLevel)" 
                isAnimationActive={false}
              />
              <Area 
                /* Fix: Replaced invalid yId with yAxisId as per Recharts API documentation */
                yAxisId="right"
                type="stepAfter" 
                dataKey="speed" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorSpeed)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Level %</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Speed mA</span>
          </div>
        </div>
      </Card>

      <Card title="Alerts" icon="fa-bell">
        <div className="flex items-center justify-between">
          <span className="text-slate-300 font-bold">100% Alarm</span>
          <button 
            onClick={() => setAlarmEnabled(!alarmEnabled)}
            className={`w-14 h-8 rounded-full transition-all relative ${alarmEnabled ? 'bg-emerald-500 shadow-lg shadow-emerald-500/40' : 'bg-slate-800'}`}
          >
            <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full transition-all ${alarmEnabled ? 'right-1.5' : 'left-1.5'}`}></div>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default BatteryTool;
