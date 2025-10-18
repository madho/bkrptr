import React from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Clock, AlertCircle } from 'lucide-react';
import type { Analysis } from '../lib/mockData';

interface AnalysisCardProps {
  analysis: Analysis;
  onViewDetails: () => void;
  onExpedite?: () => void;
  onCancel?: () => void;
  onRetry?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
}

export function AnalysisCard({ 
  analysis, 
  onViewDetails,
  onExpedite,
  onCancel,
  onRetry,
  onDownload,
  onDelete
}: AnalysisCardProps) {
  const getStatusBadge = () => {
    switch (analysis.status) {
      case 'processing-batch':
        return (
          <Badge className="bg-[#DCFCE7] text-[#15803D] hover:bg-[#DCFCE7] border-0">
            Batch Processing
          </Badge>
        );
      case 'processing-expedited':
        return (
          <Badge className="bg-[#FEF3C7] text-[#B45309] hover:bg-[#FEF3C7] border-0">
            Expedited Processing
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-[#DCFCE7] text-[#15803D] hover:bg-[#DCFCE7] border-0">
            Completed
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-md hover:border-[#D1D5DB] transition-all duration-150">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xl">📚</span>
            <h3 className="text-xl font-semibold text-[#111827]">{analysis.title}</h3>
          </div>
          <p className="text-[#6B7280] ml-8">by {analysis.author}</p>
          <div className="flex gap-2 ml-8 mt-1">
            {analysis.genres.map((genre) => (
              <span key={genre} className="text-sm text-[#9CA3AF]">{genre}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {getStatusBadge()}
          <p className="text-sm font-medium text-[#374151]">${analysis.cost.toFixed(2)}</p>
        </div>
      </div>

      {/* Progress Bar */}
      {(analysis.status === 'processing-batch' || analysis.status === 'processing-expedited') && (
        <div className="my-4">
          <Progress 
            value={analysis.progress} 
            className="h-2"
            indicatorClassName={analysis.processingMode === 'batch' ? 'bg-[#22C55E]' : 'bg-[#F59E0B]'}
          />
          <p className="text-xs text-[#6B7280] mt-1">{analysis.progress}% complete</p>
        </div>
      )}

      {/* Status Information */}
      <div className="my-4 space-y-1">
        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
          <Clock className="w-4 h-4" />
          <span>Submitted: {formatTime(analysis.submittedAt)}</span>
        </div>
        {analysis.estimatedCompletion && (
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <Clock className="w-4 h-4" />
            <span>Est. completion: {analysis.estimatedCompletion}</span>
          </div>
        )}
        {analysis.completedAt && (
          <div className="flex items-center gap-2 text-sm text-[#22C55E]">
            <Clock className="w-4 h-4" />
            <span>Completed {formatTime(analysis.completedAt)}</span>
          </div>
        )}
        {analysis.errorMessage && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span>{analysis.errorMessage}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-[#E5E7EB]">
        {analysis.status === 'processing-batch' && (
          <>
            <Button variant="outline" size="sm" onClick={onViewDetails}>
              View Details
            </Button>
            {onExpedite && (
              <Button 
                size="sm"
                className="bg-[#F59E0B] hover:bg-[#D97706] text-white"
                onClick={onExpedite}
              >
                Expedite → $0.03
              </Button>
            )}
            {onCancel && (
              <Button variant="ghost" size="sm" onClick={onCancel} className="ml-auto text-[#6B7280]">
                Cancel
              </Button>
            )}
          </>
        )}
        {analysis.status === 'processing-expedited' && (
          <>
            <Button variant="outline" size="sm" onClick={onViewDetails}>
              View Details
            </Button>
            {onCancel && (
              <Button variant="ghost" size="sm" onClick={onCancel} className="ml-auto text-[#6B7280]">
                Cancel
              </Button>
            )}
          </>
        )}
        {analysis.status === 'completed' && (
          <>
            <Button 
              size="sm" 
              onClick={onViewDetails}
              className="bg-[#0EA5E9] hover:bg-[#0284C7]"
            >
              View Analysis
            </Button>
            {onDownload && (
              <Button variant="outline" size="sm" onClick={onDownload}>
                Download ↓
              </Button>
            )}
            <Button variant="ghost" size="sm" className="text-[#6B7280]">
              Share
            </Button>
          </>
        )}
        {analysis.status === 'failed' && (
          <>
            {onRetry && (
              <Button 
                size="sm"
                className="bg-[#0EA5E9] hover:bg-[#0284C7]"
                onClick={onRetry}
              >
                Retry
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onViewDetails}>
              View Details
            </Button>
            {onDelete && (
              <Button variant="ghost" size="sm" onClick={onDelete} className="ml-auto text-red-600">
                Delete
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
