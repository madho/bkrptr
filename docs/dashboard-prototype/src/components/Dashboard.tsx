import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { StatsCard } from './StatsCard';
import { AnalysisCard } from './AnalysisCard';
import { Search, Plus } from 'lucide-react';
import type { Analysis } from '../lib/mockData';

interface DashboardProps {
  analyses: Analysis[];
  onNewAnalysis: () => void;
  onViewDetails: (id: string) => void;
  onExpedite: (id: string) => void;
}

type FilterType = 'all' | 'processing' | 'completed' | 'failed';

export function Dashboard({ analyses, onNewAnalysis, onViewDetails, onExpedite }: DashboardProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const processingCount = analyses.filter(a =>
    a.status === 'processing-batch' || a.status === 'processing-expedited'
  ).length;

  const batchCount = analyses.filter(a => a.status === 'processing-batch').length;
  const expeditedCount = analyses.filter(a => a.status === 'processing-expedited').length;
  const completedCount = analyses.filter(a => a.status === 'completed').length;
  const failedCount = analyses.filter(a => a.status === 'failed').length;

  const filteredAnalyses = analyses.filter(analysis => {
    // Apply filter
    if (filter === 'processing' && analysis.status !== 'processing-batch' && analysis.status !== 'processing-expedited') {
      return false;
    }
    if (filter === 'completed' && analysis.status !== 'completed') {
      return false;
    }
    if (filter === 'failed' && analysis.status !== 'failed') {
      return false;
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        analysis.title.toLowerCase().includes(query) ||
        analysis.author.toLowerCase().includes(query) ||
        analysis.genres.some(g => g.toLowerCase().includes(query))
      );
    }

    return true;
  });

  return (
    <div className="flex-1 bg-[#F9FAFB] p-8 overflow-auto">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[30px] font-bold text-[#111827] mb-1">Dashboard</h1>
          <p className="text-[#6B7280]">Manage your book analyses</p>
        </div>
        <Button 
          onClick={onNewAnalysis}
          className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Analysis
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <StatsCard
          icon="⏳"
          label="Processing"
          value={processingCount}
          subtext={`${batchCount} batch • ${expeditedCount} expedited`}
          iconBg="bg-[#FEF3C7]"
        />
        <StatsCard
          icon="✓"
          label="Completed"
          value={completedCount}
          subtext={`This month: ${completedCount}`}
          iconBg="bg-[#DCFCE7]"
        />
      </div>

      {/* Filter/Search Bar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
          <Input
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-[#D1D5DB]"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'secondary' : 'ghost'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-[#F3F4F6]' : ''}
          >
            All
          </Button>
          <Button
            variant={filter === 'processing' ? 'secondary' : 'ghost'}
            onClick={() => setFilter('processing')}
            className={filter === 'processing' ? 'bg-[#F3F4F6]' : ''}
          >
            Processing
            {processingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-[#E5E7EB] text-xs rounded-full">
                {processingCount}
              </span>
            )}
          </Button>
          <Button
            variant={filter === 'completed' ? 'secondary' : 'ghost'}
            onClick={() => setFilter('completed')}
            className={filter === 'completed' ? 'bg-[#F3F4F6]' : ''}
          >
            Completed
            {completedCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-[#E5E7EB] text-xs rounded-full">
                {completedCount}
              </span>
            )}
          </Button>
          <Button
            variant={filter === 'failed' ? 'secondary' : 'ghost'}
            onClick={() => setFilter('failed')}
            className={filter === 'failed' ? 'bg-[#F3F4F6]' : ''}
          >
            Failed
            {failedCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-[#E5E7EB] text-xs rounded-full">
                {failedCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Analysis Cards List */}
      <div className="space-y-4">
        {filteredAnalyses.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
            <p className="text-[#6B7280] mb-4">No analyses found</p>
            <Button onClick={onNewAnalysis} className="bg-[#0EA5E9] hover:bg-[#0284C7]">
              Create your first analysis
            </Button>
          </div>
        ) : (
          filteredAnalyses.map((analysis) => (
            <AnalysisCard
              key={analysis.id}
              analysis={analysis}
              onViewDetails={() => onViewDetails(analysis.id)}
              onExpedite={analysis.status === 'processing-batch' ? () => onExpedite(analysis.id) : undefined}
              onCancel={() => console.log('Cancel', analysis.id)}
              onRetry={() => console.log('Retry', analysis.id)}
              onDownload={() => console.log('Download', analysis.id)}
              onDelete={() => console.log('Delete', analysis.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
