import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Key, Copy, Check, AlertCircle } from 'lucide-react';
import type { ApiKey } from '../lib/mockData';

interface APIKeysManagerProps {
  apiKeys: ApiKey[];
  onCreateKey: () => void;
}

export function APIKeysManager({ apiKeys, onCreateKey }: APIKeysManagerProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (key: string, keyId: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="flex-1 bg-[#F9FAFB] p-8 overflow-auto">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[30px] font-bold text-[#111827] mb-1">API Keys</h1>
          <p className="text-[#6B7280]">Manage API keys for programmatic access</p>
        </div>
        <Button 
          onClick={onCreateKey}
          className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white shadow-sm"
        >
          Create New Key
        </Button>
      </div>

      {/* Info Banner */}
      <div className="bg-[#DBEAFE] border border-[#0EA5E9]/30 rounded-lg p-4 mb-8 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#0369A1] flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-[#0369A1] mb-2">
            API keys allow you to integrate bkrptr with your applications.
            Keep your keys secure and never share them publicly.
          </p>
          <button className="text-[#0369A1] font-medium hover:underline">
            View API Documentation →
          </button>
        </div>
      </div>

      {/* Keys List */}
      {apiKeys.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-16 text-center">
          <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-[#6B7280]" />
          </div>
          <h2 className="text-xl font-semibold text-[#111827] mb-2">No API Keys Yet</h2>
          <p className="text-[#6B7280] mb-6">
            Create your first API key to integrate bkrptr with your apps
          </p>
          <Button 
            onClick={onCreateKey}
            className="bg-[#0EA5E9] hover:bg-[#0284C7]"
          >
            Create Your First Key
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {apiKeys.map((key) => (
            <div 
              key={key.id}
              className={`bg-white p-6 rounded-xl border shadow-sm transition-all duration-150 ${
                key.status === 'revoked' 
                  ? 'border-[#E5E7EB] opacity-60' 
                  : 'border-[#E5E7EB] hover:shadow-md hover:border-[#D1D5DB]'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#DBEAFE] rounded-full flex items-center justify-center">
                    <Key className="w-5 h-5 text-[#0EA5E9]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#111827]">{key.name}</h3>
                    {key.status === 'revoked' && (
                      <Badge className="mt-1 bg-red-100 text-red-700 hover:bg-red-100 border-0">
                        Revoked
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-[#F9FAFB] px-4 py-2 rounded border border-[#E5E7EB] text-sm text-[#374151] font-mono">
                    {key.key}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(key.key, key.id)}
                    className="border-[#D1D5DB]"
                  >
                    {copiedKey === key.id ? (
                      <Check className="w-4 h-4 text-[#22C55E]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <p className="text-[#9CA3AF]">Created</p>
                  <p className="text-[#374151] font-medium">{formatDate(key.createdAt)}</p>
                </div>
                <div>
                  <p className="text-[#9CA3AF]">Last used</p>
                  <p className="text-[#374151] font-medium">
                    {key.lastUsed ? formatRelativeTime(key.lastUsed) : 'Never'}
                  </p>
                </div>
                <div>
                  <p className="text-[#9CA3AF]">Requests this month</p>
                  <p className="text-[#374151] font-medium">{key.requestsThisMonth.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4 text-sm">
                <span className="text-[#6B7280]">Permissions:</span>
                <div className="flex gap-3">
                  <span className={key.permissions.read ? 'text-[#22C55E]' : 'text-[#D1D5DB]'}>
                    {key.permissions.read ? '●' : '○'} Read
                  </span>
                  <span className={key.permissions.write ? 'text-[#22C55E]' : 'text-[#D1D5DB]'}>
                    {key.permissions.write ? '●' : '○'} Write
                  </span>
                  <span className={key.permissions.expedite ? 'text-[#22C55E]' : 'text-[#D1D5DB]'}>
                    {key.permissions.expedite ? '●' : '○'} Expedite
                  </span>
                  <span className={key.permissions.admin ? 'text-[#22C55E]' : 'text-[#D1D5DB]'}>
                    {key.permissions.admin ? '●' : '○'} Admin
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-[#E5E7EB]">
                <Button variant="outline" size="sm" className="border-[#D1D5DB]">
                  View Usage
                </Button>
                {key.status === 'active' && (
                  <>
                    <Button variant="outline" size="sm" className="border-[#D1D5DB]">
                      Rotate Key
                    </Button>
                    <Button variant="ghost" size="sm" className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-50">
                      Revoke
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
