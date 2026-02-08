
import React from 'react';

interface CardProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
  badge?: string;
}

const Card: React.FC<CardProps> = ({ title, icon, children, className = '', badge }) => {
  return (
    <div className={`bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 shadow-2xl transition-all active:bg-slate-900/60 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-8 h-8 rounded-xl bg-slate-800/50 flex items-center justify-center text-emerald-400 text-xs">
              <i className={`fa-solid ${icon}`}></i>
            </div>
          )}
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide">{title}</h3>
        </div>
        {badge && (
          <span className="px-2 py-0.5 rounded-lg text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
};

export default Card;
