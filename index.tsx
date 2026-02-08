
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * Android Studio Style Developer View
 * Simulation of the brief Network Status dialog on startup.
 */
const AndroidStudioPreview: React.FC = () => {
  const [activeView, setActiveView] = useState<'DEVICE' | 'SOURCE'>('DEVICE');
  const [showNetworkOverlay, setShowNetworkOverlay] = useState(false);

  useEffect(() => {
    // Simulate the Kotlin init { triggerNetworkDialog() }
    const timer = setTimeout(() => {
      setShowNetworkOverlay(true);
      setTimeout(() => setShowNetworkOverlay(false), 3500);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-full bg-[#1e1e1e] flex flex-col font-sans overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-10 bg-[#2d2d2d] flex items-center px-4 justify-between border-b border-black">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">VTK Project [Kotlin + Room]</span>
          </div>
        </div>
        <div className="flex bg-[#3d3d3d] rounded-md overflow-hidden">
          <button 
            onClick={() => setActiveView('DEVICE')}
            className={`px-4 py-1 text-[10px] font-bold transition-all ${activeView === 'DEVICE' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}
          >
            RUN APP
          </button>
          <button 
            onClick={() => setActiveView('SOURCE')}
            className={`px-4 py-1 text-[10px] font-bold transition-all ${activeView === 'SOURCE' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}
          >
            VtkRepository.kt
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Project Explorer (Sidebar) */}
        <div className="w-64 bg-[#252526] border-r border-black p-4 hidden lg:block overflow-y-auto">
          <div className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Project Files</div>
          <div className="space-y-2">
            {[
              { name: 'DeviceLog.kt', icon: 'fa-database', color: 'text-emerald-400' },
              { name: 'LogDao.kt', icon: 'fa-file-code', color: 'text-purple-400' },
              { name: 'VtkRepository.kt', icon: 'fa-folder-tree', color: 'text-blue-400' },
              { name: 'VtkViewModel.kt', icon: 'fa-gears', color: 'text-orange-400' },
              { name: 'SyncWorker.kt', icon: 'fa-clock-rotate-left', color: 'text-blue-400' },
              { name: 'HistoryScreen.kt', icon: 'fa-laptop-code', color: 'text-purple-400' },
            ].map(f => (
              <div key={f.name} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 text-slate-300 cursor-default hover:bg-white/10">
                <i className={`fa-solid ${f.icon} ${f.color} text-xs`}></i>
                <span className="text-[11px] font-mono">{f.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 bg-black relative flex items-center justify-center p-4">
          {activeView === 'DEVICE' ? (
             <div className="w-[380px] h-[800px] bg-[#121212] rounded-[3rem] border-[8px] border-[#222] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden relative">
                <App />
                
                {/* Simulated Kotlin Compose Overlay */}
                <div className={`absolute top-16 left-4 right-4 z-50 transition-all duration-500 transform ${showNetworkOverlay ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'}`}>
                   <div className="bg-[#2a2a2a] border border-white/10 rounded-[1.5rem] p-4 shadow-2xl flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                        <i className="fa-solid fa-wifi text-sm"></i>
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Network Status</div>
                        <div className="text-white font-black text-sm leading-tight">Verizon Wireless (5G)</div>
                        <div className="text-[10px] text-slate-400">Signal: -85 dBm • 192.168.1.104</div>
                      </div>
                   </div>
                </div>

                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full"></div>
             </div>
          ) : (
            <div className="w-full h-full bg-[#1e1e1e] p-8 font-mono text-sm overflow-auto text-slate-300">
              <div className="max-w-4xl mx-auto space-y-8">
                <div>
                   <span className="text-purple-400 font-bold">package</span> com.vtk.data.repository<br/><br/>
                   <span className="text-purple-400 font-bold">import</span> com.vtk.data.local.dao.LogDao<br/>
                   <span className="text-purple-400 font-bold">import</span> kotlinx.coroutines.flow.Flow<br/><br/>
                   <span className="text-slate-500 italic">/** Offline-First Repository Pattern Implementation */</span><br/>
                   <span className="text-purple-400 font-bold">class</span> <span className="text-blue-300 font-bold">VtkRepository</span>(private val logDao: LogDao) {"{"}<br/>
                   &nbsp;&nbsp;<span className="text-slate-500">// Fetching flow from Room Local Database</span><br/>
                   &nbsp;&nbsp;<span className="text-purple-400 font-bold">val</span> historyLogs: Flow&lt;List&lt;DeviceLog&gt;&gt; = logDao.getAllLogs()<br/><br/>
                   &nbsp;&nbsp;<span className="text-purple-400 font-bold">suspend fun</span> <span className="text-blue-300 font-bold">saveDiagnostic</span>(type: String, value: String) {"{"}<br/>
                   &nbsp;&nbsp;&nbsp;&nbsp;logDao.insertLog(DeviceLog(type = type, value = value))<br/>
                   &nbsp;&nbsp;{"}"}<br/>
                   {"}"}<br/><br/>
                   <span className="text-slate-500">// DAO Interface</span><br/>
                   <span className="text-emerald-500">@Dao</span><br/>
                   <span className="text-purple-400 font-bold">interface</span> <span className="text-blue-300 font-bold">LogDao</span> {"{"}<br/>
                   &nbsp;&nbsp;<span className="text-emerald-500">@Query</span>(<span className="text-yellow-300">"SELECT * FROM device_logs"</span>)<br/>
                   &nbsp;&nbsp;<span className="text-purple-400 font-bold">fun</span> <span className="text-blue-300 font-bold">getAllLogs</span>(): Flow&lt;List&lt;DeviceLog&gt;&gt;<br/>
                   {"}"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<AndroidStudioPreview />);
}
