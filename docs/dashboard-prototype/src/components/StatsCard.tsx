import React from 'react';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  iconBg?: string;
}

export function StatsCard({ icon, label, value, subtext, iconBg = 'bg-[#FEF3C7]' }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow duration-150">
      <div className="flex items-start gap-4">
        <div className={`${iconBg} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[#6B7280] mb-1">{label}</p>
          <p className="text-[30px] font-bold text-[#111827] leading-none">{value}</p>
          {subtext && (
            <p className="text-xs text-[#9CA3AF] mt-2">{subtext}</p>
          )}
        </div>
      </div>
    </div>
  );
}
