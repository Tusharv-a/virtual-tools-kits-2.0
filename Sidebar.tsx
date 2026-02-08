
import React from 'react';
import { ToolCategory } from '../types';

interface SidebarProps {
  activeTab: ToolCategory;
  setActiveTab: (tab: ToolCategory) => void;
}

const navItems = [
  { id: ToolCategory.DASHBOARD, label: 'Dashboard', icon: 'fa-gauge-high' },
  { id: ToolCategory.BATTERY, label: 'Battery', icon: 'fa-battery-three-quarters' },
  { id: ToolCategory.SENSORS, label: 'Sensors', icon: 'fa-microchip' },
  { id: ToolCategory.HARDWARE, label: 'Hardware', icon: 'fa-memory' },
  { id: ToolCategory.THERMAL, label: 'Thermal', icon: 'fa-temperature-high' },
  { id: ToolCategory.NETWORK, label: 'Network', icon: 'fa-wifi' },
  { id: ToolCategory.DIAGNOSTIC, label: 'Diagnostics', icon: 'fa-stethoscope' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-20 md:w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0 flex flex-col transition-all duration-300 z-50">
      <div className="p-4 md:p-6 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <i className="fa-solid fa-screwdriver-wrench text-white text-xl"></i>
        </div>
        <h1 className="hidden md:block text-xl font-bold tracking-tight text-emerald-400">VTK Suite</h1>
      </div>
      
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-emerald-500/10 text-emerald-400 shadow-sm border border-emerald-500/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg md:mr-4 w-6`}></i>
            <span className="hidden md:block font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 mt-auto">
        <div className="hidden md:block text-xs text-slate-500 uppercase font-bold tracking-widest mb-2">Build v2.4.0</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs text-slate-400">System Secure</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
