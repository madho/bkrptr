import React from 'react';
import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';

interface TopNavProps {
  userInitials: string;
  onLogout?: () => void;
}

export function TopNav({ userInitials, onLogout }: TopNavProps) {
  return (
    <div className="h-16 bg-white border-b border-[#E5E7EB] shadow-sm flex items-center justify-between px-8">
      {/* Logo */}
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-[#0EA5E9]">bkrptr</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-[#6B7280]" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 bg-[#0EA5E9] text-white">
            <AvatarFallback className="bg-[#0EA5E9] text-white text-sm">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
