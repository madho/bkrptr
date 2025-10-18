import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, Download, Share2, Star } from 'lucide-react';
import type { Analysis } from '../lib/mockData';

interface AnalysisDetailViewProps {
  analysis: Analysis;
  onBack: () => void;
  onExpedite?: () => void;
}

export function AnalysisDetailView({ analysis, onBack, onExpedite }: AnalysisDetailViewProps) {
  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getProcessingTime = () => {
    if (analysis.completedAt && analysis.submittedAt) {
      const diff = analysis.completedAt.getTime() - analysis.submittedAt.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours} hours ${minutes} minutes`;
    }
    return null;
  };

  const documents = [
    {
      id: '1',
      title: 'MADHO Summary',
      description: 'Personal, actionable breakdown',
      icon: '📄',
      words: 2450,
      readTime: 8,
      isPrimary: true
    },
    {
      id: '2',
      title: 'Detailed Analysis',
      description: 'Comprehensive chapter breakdown',
      icon: '📄',
      words: 12800,
      readTime: 35,
      isPrimary: false
    },
    {
      id: '3',
      title: 'Executive Summary',
      description: 'High-level strategic insights',
      icon: '📊',
      words: 1200,
      readTime: 4,
      isPrimary: false
    },
    {
      id: '4',
      title: 'Quick Reference',
      description: 'Key frameworks & checklists',
      icon: '⚡',
      words: 800,
      readTime: 2,
      isPrimary: false
    }
  ];

  return (
    <div className="flex-1 bg-[#F9FAFB] p-8 overflow-auto">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#111827] mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="text-sm text-[#9CA3AF] mb-6">
          Dashboard &gt; Analyses &gt; {analysis.title}
        </div>

        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📚</span>
            <h1 className="text-[30px] font-bold text-[#111827]">{analysis.title}</h1>
          </div>
          <p className="text-lg text-[#6B7280] ml-12 mb-3">by {analysis.author}</p>
          <div className="flex gap-2 ml-12">
            {analysis.genres.map(genre => (
              <Badge key={genre} variant="secondary" className="bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]">
                {genre}
              </Badge>
            ))}
          </div>
        </div>

        {/* Status Banner */}
        {analysis.status === 'processing-batch' && (
          <div className="bg-[#DCFCE7] border border-[#86EFAC] rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏳</span>
                <h2 className="text-xl font-semibold text-[#15803D]">Batch Processing</h2>
              </div>
            </div>
            
            <div className="mb-4">
              <Progress value={analysis.progress} className="h-2" indicatorClassName="bg-[#22C55E]" />
              <p className="text-sm text-[#15803D] mt-2">{analysis.progress}% complete</p>
            </div>

            <div className="space-y-1 text-sm text-[#15803D] mb-4">
              <p>Started: {formatTime(analysis.submittedAt)}</p>
              <p>Estimated completion: {analysis.estimatedCompletion}</p>
            </div>

            <div className="flex gap-3">
              {onExpedite && (
                <Button 
                  onClick={onExpedite}
                  className="bg-[#F59E0B] hover:bg-[#D97706] text-white"
                >
                  Expedite to Priority ($0.03 more)
                </Button>
              )}
              <Button variant="outline" className="border-[#86EFAC] text-[#15803D] hover:bg-[#86EFAC]/20">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {analysis.status === 'processing-expedited' && (
          <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <h2 className="text-xl font-semibold text-[#B45309]">Expedited Processing</h2>
              </div>
            </div>
            
            <div className="mb-4">
              <Progress value={analysis.progress} className="h-2" indicatorClassName="bg-[#F59E0B]" />
              <p className="text-sm text-[#B45309] mt-2">{analysis.progress}% complete</p>
            </div>

            <div className="space-y-1 text-sm text-[#B45309] mb-4">
              <p>Started: {formatTime(analysis.submittedAt)}</p>
              <p>Estimated completion: {analysis.estimatedCompletion}</p>
            </div>

            <Button variant="outline" className="border-[#FCD34D] text-[#B45309] hover:bg-[#FCD34D]/20">
              Cancel
            </Button>
          </div>
        )}

        {analysis.status === 'completed' && (
          <div className="bg-[#DCFCE7] border border-[#86EFAC] rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">✓</span>
              <h2 className="text-xl font-semibold text-[#15803D]">Analysis Complete</h2>
            </div>
            
            <div className="space-y-1 text-sm text-[#15803D]">
              <p>Completed: {analysis.completedAt ? formatTime(analysis.completedAt) : ''}</p>
              {getProcessingTime() && <p>Processing time: {getProcessingTime()}</p>}
              <p>Cost: ${analysis.cost.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Documents Section */}
        {analysis.status === 'completed' && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-[#111827] mb-6">Analysis Documents</h2>
            
            <div className="grid grid-cols-2 gap-6">
              {documents.map(doc => (
                <div 
                  key={doc.id}
                  className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-md hover:border-[#D1D5DB] transition-all duration-150"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{doc.icon}</span>
                      <h3 className="font-semibold text-[#111827]">{doc.title}</h3>
                    </div>
                    {doc.isPrimary && (
                      <div className="bg-[#FEF3C7] p-1 rounded">
                        <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-[#6B7280] mb-4">{doc.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-[#9CA3AF] mb-4">
                    <span>📊</span>
                    <span>{doc.words.toLocaleString()} words • {doc.readTime} min read</span>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="bg-[#0EA5E9] hover:bg-[#0284C7] flex-1">
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="border-[#D1D5DB]">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata Section */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] mb-6">
          <h2 className="text-xl font-semibold text-[#111827] mb-4">Details</h2>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[#6B7280]">Submitted by</p>
              <p className="text-[#111827] font-medium">you</p>
            </div>
            <div>
              <p className="text-[#6B7280]">Submitted at</p>
              <p className="text-[#111827] font-medium">{formatTime(analysis.submittedAt)}</p>
            </div>
            <div>
              <p className="text-[#6B7280]">Processing mode</p>
              <Badge className={`mt-1 ${
                analysis.processingMode === 'batch' 
                  ? 'bg-[#DCFCE7] text-[#15803D]' 
                  : 'bg-[#FEF3C7] text-[#B45309]'
              } hover:bg-opacity-100`}>
                {analysis.processingMode === 'batch' ? 'Batch' : 'Expedited'}
              </Badge>
            </div>
            <div>
              <p className="text-[#6B7280]">Analysis depth</p>
              <p className="text-[#111827] font-medium">Standard</p>
            </div>
            <div>
              <p className="text-[#6B7280]">Total cost</p>
              <p className="text-[#111827] font-medium">${analysis.cost.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {analysis.status === 'completed' && (
          <div className="flex gap-3 items-center">
            <Button variant="outline" className="border-[#D1D5DB]">
              <Download className="w-4 h-4 mr-2" />
              Download All (ZIP)
            </Button>
            <Button variant="outline" className="border-[#D1D5DB]">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="ghost" className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-50">
              Delete Analysis
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}