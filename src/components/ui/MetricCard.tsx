import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  onClick?: () => void;
}

function MetricCard({ title, value, icon, onClick }: MetricCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-slate-900 rounded-2xl border border-slate-800 p-5 md:p-6 relative transition-all duration-300 shadow-xl min-h-35 flex flex-col justify-between
        ${
          onClick
            ? "cursor-pointer hover:bg-slate-800/80 hover:border-indigo-500/50 active:scale-95"
            : ""
        }`}
    >
      {icon && <div className="absolute top-5 right-5">{icon}</div>}
      <div>
        <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-2">
          {title}
        </p>

        <p className="text-lg md:text-xl font-black text-white leading-tight pr-12 wrap-break-word">
          {value}
        </p>
      </div>

      <div className="mt-4 text-[9px] text-slate-600 font-bold uppercase tracking-wider">
        {onClick ? "● Click for details" : "● Live system"}
      </div>
    </div>
  );
}

export default MetricCard;
