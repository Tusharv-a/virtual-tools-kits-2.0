
import React, { useState, useEffect } from 'react';
import { ToolCategory } from './types';
import BatteryTool from './views/BatteryTool';
import SensorTool from './views/SensorTool';
import HardwareTool from './views/HardwareTool';
import DiagnosticTool from './views/DiagnosticTool';
import NetworkTool from './views/NetworkTool';
import Card from './components/Card';

const Android14StatusBar: React.FC = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-14 w-full flex items-center justify-between px-8 pt-4 select-none bg-black">
      <div className="text-[13px] font-bold text-white tracking-wide">{time}</div>
      <div className="flex items-center gap-3 text-white/90 text-[12px]">
        <i className="fa-solid fa-wifi"></i>
        <i className="fa-solid fa-signal"></i>
        <div className="flex items-center gap-1.5 ml-1">
          <span className="font-bold">85%</span>
          <div className="w-5 h-2.5 border border-white/30 rounded-[2px] relative">
            <div className="absolute top-0 left-0 h-full bg-emerald-400" style={{ width: '85%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ComposeDashboard: React.FC = () => (
  <div className="space-y-6 pb-28 animate-fadeIn">
    {/* Local Database Status Header */}
    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] p-8 relative overflow-hidden group">
       <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
             <i className="fa-solid fa-database text-xl"></i>
          </div>
          <div>
             <h2 className="text-xl font-black text-white">Local Storage</h2>
             <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Repository Source: Room DB</p>
          </div>
       </div>
       <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/5">
             <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Last Sync</div>
             <div className="text-white font-black text-lg">Just Now</div>
          </div>
          <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/5">
             <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">DB Integrity</div>
             <div className="text-emerald-500 font-black text-lg">Healthy</div>
          </div>
       </div>
    </div>

    <Card title="Offline Repository" icon="fa-box-archive" badge="Primary Source">
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Offline-First Logic</span>
            <span className="text-blue-400 font-bold">Enabled</span>
         </div>
         <div className="w-full h-1.5 bg-slate-800 rounded-full">
            <div className="h-full bg-blue-500 w-[100%] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
         </div>
         <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Worker (Sync)</span>
            <span className="text-emerald-400 font-bold">Idle / Monitoring</span>
         </div>
      </div>
    </Card>

    <Card title="System Metrics" icon="fa-microchip">
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">CPU Thermal</span>
            <span className="text-blue-400 font-bold">32°C</span>
         </div>
         <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Background Threads</span>
            <span className="text-emerald-400 font-bold">4 Active</span>
         </div>
      </div>
    </Card>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ToolCategory>(ToolCategory.DASHBOARD);

  const renderContent = () => {
    switch (activeTab) {
      case ToolCategory.DASHBOARD: return <ComposeDashboard />;
      case ToolCategory.BATTERY: return <BatteryTool />;
      case ToolCategory.SENSORS: return <SensorTool />;
      case ToolCategory.HARDWARE: return <HardwareTool />;
      case ToolCategory.NETWORK: return <NetworkTool />;
      case ToolCategory.DIAGNOSTIC: return <DiagnosticTool />;
      default: return <ComposeDashboard />;
    }
  };

  const navItems = [
    { id: ToolCategory.DASHBOARD, icon: 'fa-house-chimney', label: 'Home' },
    { id: ToolCategory.BATTERY, icon: 'fa-bolt', label: 'Battery' },
    { id: ToolCategory.SENSORS, icon: 'fa-microchip', label: 'Sensors' },
    { id: ToolCategory.NETWORK, icon: 'fa-wifi', label: 'Network' },
    { id: ToolCategory.DIAGNOSTIC, icon: 'fa-stethoscope', label: 'Test' }
  ];

  return (
    <div className="fixed inset-0 bg-black flex flex-col overflow-hidden font-sans">
      <Android14StatusBar />

      <header className="px-8 py-6">
        <h1 className="text-4xl font-black text-white tracking-tight">
          {activeTab === ToolCategory.DASHBOARD ? 'Hardware' : 
           activeTab.charAt(0) + activeTab.slice(1).toLowerCase()}
        </h1>
        <div className="h-1 w-12 bg-emerald-500 mt-3 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.4)]"></div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 custom-scrollbar pb-32">
        {renderContent()}
      </main>

      {/* Material 3 Styled Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0f0f0f]/95 backdrop-blur-3xl border-t border-white/5 px-2 pt-3 pb-8 flex justify-around items-center z-50">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center transition-all duration-300 relative w-full ${
              activeTab === item.id ? 'text-white' : 'text-slate-500'
            }`}
          >
            <div className={`absolute top-0 h-8 w-16 rounded-full transition-all duration-300 -z-10 ${
              activeTab === item.id ? 'bg-emerald-500/20 scale-100 opacity-100' : 'scale-75 opacity-0'
            }`}></div>
            
            <div className="h-8 flex items-center justify-center">
                <i className={`fa-solid ${item.icon} text-lg transition-colors ${
                  activeTab === item.id ? 'text-emerald-400' : ''
                }`}></i>
            </div>
            
            <span className={`text-[10px] font-bold mt-1 tracking-tight transition-all ${
              activeTab === item.id ? 'opacity-100' : 'opacity-70'
            }`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 0px; }
        body { background: black; overscroll-behavior-y: contain; }
      `}</style>
    </div>
  );
};

export default App;
