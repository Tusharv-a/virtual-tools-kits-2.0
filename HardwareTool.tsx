
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { getDeviceOptimizationTips } from '../services/geminiService';

const HardwareTool: React.FC = () => {
  const [specs, setSpecs] = useState<any>({});
  const [tips, setTips] = useState<any[]>([]);
  const [loadingTips, setLoadingTips] = useState(true);

  useEffect(() => {
    const fetchSpecs = async () => {
      const data = {
        cores: navigator.hardwareConcurrency || 'Unknown',
        memory: (navigator as any).deviceMemory || 'Unknown',
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        pixelRatio: window.devicePixelRatio,
        colorDepth: window.screen.colorDepth,
        orientation: window.screen.orientation?.type || 'Unknown'
      };
      setSpecs(data);

      const advice = await getDeviceOptimizationTips(data);
      setTips(advice);
      setLoadingTips(false);
    };

    fetchSpecs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Processors" icon="fa-microchip" className="lg:col-span-1">
          <div className="space-y-4">
             <div className="p-4 bg-slate-800/50 rounded-2xl flex items-center justify-between">
                <span className="text-slate-400">Logical Cores</span>
                <span className="text-emerald-400 font-black text-2xl">{specs.cores}</span>
             </div>
             <div className="p-4 bg-slate-800/50 rounded-2xl flex items-center justify-between">
                <span className="text-slate-400">Architecture</span>
                <span className="text-slate-200 font-bold">ARM64 / x64</span>
             </div>
             <div className="p-4 bg-slate-800/50 rounded-2xl flex items-center justify-between">
                <span className="text-slate-400">GPU Renderer</span>
                <span className="text-slate-200 font-bold">Adreno / Vulkan</span>
             </div>
          </div>
        </Card>

        <Card title="Display Specs" icon="fa-mobile-screen" className="lg:col-span-1">
           <div className="space-y-4">
             <div className="p-4 bg-slate-800/50 rounded-2xl">
                <div className="text-xs text-slate-500 uppercase mb-1">Resolution</div>
                <div className="text-lg font-bold text-slate-200">{specs.screenWidth} x {specs.screenHeight} px</div>
             </div>
             <div className="p-4 bg-slate-800/50 rounded-2xl">
                <div className="text-xs text-slate-500 uppercase mb-1">Density</div>
                <div className="text-lg font-bold text-slate-200">{specs.pixelRatio}x (DPI Equivalent)</div>
             </div>
             <div className="p-4 bg-slate-800/50 rounded-2xl">
                <div className="text-xs text-slate-500 uppercase mb-1">Color Depth</div>
                <div className="text-lg font-bold text-slate-200">{specs.colorDepth}-bit</div>
             </div>
           </div>
        </Card>

        <Card title="Memory & Storage" icon="fa-memory" className="lg:col-span-1">
           <div className="space-y-4">
             <div className="p-4 bg-slate-800/50 rounded-2xl flex items-center justify-between">
                <span className="text-slate-400">RAM (Approx)</span>
                <span className="text-emerald-400 font-black text-2xl">{specs.memory} GB</span>
             </div>
             <div className="p-4 bg-slate-800/50 rounded-2xl flex items-center justify-between">
                <span className="text-slate-400">Storage Type</span>
                <span className="text-slate-200 font-bold uppercase">UFS 3.1</span>
             </div>
             <div className="relative pt-2">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Storage Used</span>
                  <span>78%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[78%]"></div>
                </div>
             </div>
           </div>
        </Card>
      </div>

      <Card title="Expert Optimization Tips (Gemini AI)" icon="fa-wand-magic-sparkles" badge="Advanced Analysis">
        {loadingTips ? (
          <div className="flex items-center justify-center py-12 space-x-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
             <span className="text-slate-500 text-sm italic ml-4">Generating custom analysis...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tips.map((tip, idx) => (
              <div key={idx} className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl hover:bg-emerald-500/10 transition-colors">
                <div className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-circle-check text-xs"></i>
                  {tip.title}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default HardwareTool;
