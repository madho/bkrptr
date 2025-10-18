import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ProcessingModeCard } from './ProcessingModeCard';
import { ArrowLeft } from 'lucide-react';
import { genreOptions, audienceOptions, analysisDepthOptions } from '../lib/mockData';
import type { ProcessingMode } from '../lib/mockData';

interface NewAnalysisFormProps {
  onBack: () => void;
  onSubmit: (data: any) => void;
}

export function NewAnalysisForm({ onBack, onSubmit }: NewAnalysisFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    targetAudience: '',
    processingMode: 'batch' as ProcessingMode,
    analysisDepth: 'standard',
    additionalContext: ''
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateCost = () => {
    return formData.processingMode === 'batch' ? 0.03 : 0.06;
  };

  const isFormValid = () => {
    return formData.title.trim() && formData.author.trim();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="flex-1 bg-[#F9FAFB] p-8 overflow-auto">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        {/* Page Header */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#111827] mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-[30px] font-bold text-[#111827] mb-1">New Analysis</h1>
            <p className="text-[#6B7280]">Submit a book for AI-powered analysis</p>
          </div>
        </div>

        {/* Section 1: Book Details */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#111827] mb-6">Book Details</h2>
          
          <div className="space-y-5">
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-[#374151]">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g., Atomic Habits"
                className="mt-1.5 bg-white border-[#D1D5DB]"
                required
              />
            </div>

            <div>
              <Label htmlFor="author" className="text-sm font-medium text-[#374151]">
                Author <span className="text-red-500">*</span>
              </Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => updateField('author', e.target.value)}
                placeholder="e.g., James Clear"
                className="mt-1.5 bg-white border-[#D1D5DB]"
                required
              />
            </div>

            <div>
              <Label htmlFor="isbn" className="text-sm font-medium text-[#374151]">
                ISBN <span className="text-[#9CA3AF]">(optional)</span>
              </Label>
              <Input
                id="isbn"
                value={formData.isbn}
                onChange={(e) => updateField('isbn', e.target.value)}
                placeholder="e.g., 978-0735211292"
                className="mt-1.5 bg-white border-[#D1D5DB]"
              />
              <p className="text-xs text-[#6B7280] mt-1.5">
                Optional - helps with metadata accuracy
              </p>
            </div>

            <div>
              <Label htmlFor="genre" className="text-sm font-medium text-[#374151]">
                Genre
              </Label>
              <Select value={formData.genre} onValueChange={(value) => updateField('genre', value)}>
                <SelectTrigger className="mt-1.5 bg-white border-[#D1D5DB]">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {genreOptions.map(genre => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="audience" className="text-sm font-medium text-[#374151]">
                Target Audience
              </Label>
              <Select value={formData.targetAudience} onValueChange={(value) => updateField('targetAudience', value)}>
                <SelectTrigger className="mt-1.5 bg-white border-[#D1D5DB]">
                  <SelectValue placeholder="Select target audience" />
                </SelectTrigger>
                <SelectContent>
                  {audienceOptions.map(audience => (
                    <SelectItem key={audience} value={audience}>{audience}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Section 2: Processing Options */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#111827] mb-6">Processing Options</h2>
          
          <div className="flex gap-4 mb-6">
            <ProcessingModeCard
              mode="batch"
              selected={formData.processingMode === 'batch'}
              onSelect={() => updateField('processingMode', 'batch')}
            />
            <ProcessingModeCard
              mode="expedited"
              selected={formData.processingMode === 'expedited'}
              onSelect={() => updateField('processingMode', 'expedited')}
            />
          </div>

          <div>
            <Label htmlFor="depth" className="text-sm font-medium text-[#374151]">
              Analysis Depth
            </Label>
            <Select value={formData.analysisDepth} onValueChange={(value) => updateField('analysisDepth', value)}>
              <SelectTrigger className="mt-1.5 bg-white border-[#D1D5DB]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {analysisDepthOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div>{option.label}</div>
                      <div className="text-xs text-[#6B7280]">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Section 3: Additional Context */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#111827] mb-6">
            Additional Context <span className="text-[#9CA3AF] font-normal text-base">(optional)</span>
          </h2>
          
          <Textarea
            value={formData.additionalContext}
            onChange={(e) => updateField('additionalContext', e.target.value)}
            placeholder="Any specific aspects you'd like the analysis to focus on? (optional)"
            className="min-h-[100px] bg-white border-[#D1D5DB]"
          />
        </div>

        {/* Cost Preview */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#111827] text-center mb-4">Cost Estimate</h2>
          
          <div className="space-y-2 text-[#374151]">
            <div className="flex justify-between">
              <span>Analysis type:</span>
              <span className="font-medium capitalize">{formData.analysisDepth}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing:</span>
              <span className="font-medium capitalize">{formData.processingMode}</span>
            </div>
            <div className="flex justify-between">
              <span>Cost per book:</span>
              <span className="font-medium">${calculateCost().toFixed(2)}</span>
            </div>
            
            <div className="border-t border-[#E5E7EB] my-3" />
            
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-[#111827]">${calculateCost().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="border-[#D1D5DB]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid()}
            className="bg-[#0EA5E9] hover:bg-[#0284C7] disabled:bg-[#D1D5DB] disabled:text-[#9CA3AF]"
          >
            Submit Analysis
          </Button>
        </div>
      </form>
    </div>
  );
}