import React from 'react';
import { LayoutDashboard, Plus, BookOpen, Key, FileText, Settings, Inbox } from 'lucide-react';
import { Progress } from './ui/progress';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  usageAmount: number;
  usageBudget: number;
  analysesCount: number;
  requestsCount?: number;
}

export function Sidebar({ currentPage, onNavigate, usageAmount, usageBudget, analysesCount, requestsCount = 0 }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-analysis', label: 'New Analysis', icon: Plus },
    { id: 'analyses', label: 'Analyses', icon: BookOpen },
    { id: 'requests', label: 'Requests', icon: Inbox, badge: requestsCount },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'api-docs', label: 'API Docs', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const usagePercentage = (usageAmount / usageBudget) * 100;

  return (
    <div className="w-60 bg-white border-r border-[#E5E7EB] h-screen flex flex-col">
      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-150 relative
                ${isActive
                  ? 'bg-[#DBEAFE] text-[#0369A1] border-l-4 border-[#0EA5E9] font-medium'
                  : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]'
                }
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
              {'badge' in item && item.badge > 0 && (
                <span className="ml-auto px-2 py-0.5 bg-[#F59E0B] text-white text-xs rounded-full font-medium">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Usage Summary */}
      <div className="p-4 border-t border-[#E5E7EB]">
        <div className="bg-[#F9FAFB] p-4 rounded-lg">
          <p className="text-xs text-[#6B7280] mb-2">This month</p>
          <p className="text-sm font-semibold text-[#111827] mb-2">
            ${usageAmount.toFixed(2)} / ${usageBudget.toFixed(2)}
          </p>
          <Progress value={usagePercentage} className="h-1.5 mb-3" indicatorClassName="bg-[#22C55E]" />
          <p className="text-xs text-[#6B7280]">{analysesCount} analyses</p>
        </div>
      </div>
    </div>
  );
}
