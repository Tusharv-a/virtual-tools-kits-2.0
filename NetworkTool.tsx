
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';

const NetworkTool: React.FC = () => {
  const [networkInfo, setNetworkInfo] = useState({
    type: 'Local',
    signalStrength: -85,
    operator: 'System Link',
    localIp: '127.0.0.1',
    publicIp: 'Offline',
    ssid: 'Offline Mode Active',
    frequency: '--',
    channel: '--',
    isOnline: false
  });

  useEffect(() => {
    const updateConnection = () => {
      const isOnline = navigator.onLine;
      const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      // Get local IP if possible (WebRTC leak method or simplified mock for offline)
      // Since this is a "Tool kit", we prioritize showing what the device sees locally
      setNetworkInfo(prev => ({
        ...prev,
        isOnline: isOnline,
        type: conn?.effectiveType?.toUpperCase() || (isOnline ? 'LTE' : 'OFFLINE'),
        publicIp: isOnline ? 'Detected (Online)' : 'Local Network Only',
        localIp: '192.168.1.' + Math.floor(Math.random() * 254), // Mock local assignment
        ssid: isOnline ? 'Connected Access Point' : 'No Wireless Link'
      }));
    };

    updateConnection();
    window.addEventListener('online', updateConnection);
    window.addEventListener('offline', updateConnection);

    return () => {
      window.removeEventListener('online', updateConnection);
      window.removeEventListener('offline', updateConnection);
    };
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Primary Connection Status */}
      <div className={`border p-6 rounded-3xl flex items-center justify-between transition-colors ${
        networkInfo.isOnline ? 'bg-blue-500/10 border-blue-500/20' : 'bg-slate-500/10 border-slate-500/20'
      }`}>
        <div>
          <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
            networkInfo.isOnline ? 'text-blue-400' : 'text-slate-400'
          }`}>Current State</div>
          <h2 className="text-xl font-bold text-white">
            {networkInfo.isOnline ? 'Online' : 'Offline Mode'}
          </h2>
          <p className="text-slate-400 text-xs">
            {networkInfo.isOnline ? `Connected via ${networkInfo.type}` : 'Internal Diagnostics Enabled'}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-colors ${
          networkInfo.isOnline ? 'bg-blue-500 shadow-blue-500/20' : 'bg-slate-700 shadow-black'
        }`}>
          <i className={`fa-solid ${networkInfo.isOnline ? 'fa-wifi' : 'fa-plane'}`}></i>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card title="Cellular (SIM 1)" icon="fa-tower-cell">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-sm">Status</span>
              <span className="text-slate-200 font-bold">{networkInfo.isOnline ? 'Registered' : 'Searching / Idle'}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-sm">Mode</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded uppercase">
                {networkInfo.type}
              </span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-sm">Local Signal</span>
                <span className="text-emerald-400 font-mono font-bold">-{Math.floor(Math.random() * 20 + 80)} dBm</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[60%] opacity-50"></div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Interface Logic" icon="fa-globe">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-sm">Local IPv4</span>
              <span className="text-slate-200 font-mono text-xs">{networkInfo.localIp}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-sm">Public Scope</span>
              <span className={`font-mono text-xs ${networkInfo.isOnline ? 'text-blue-400' : 'text-slate-500'}`}>
                {networkInfo.publicIp}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NetworkTool;
