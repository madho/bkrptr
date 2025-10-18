import React, { useState } from 'react';
import { Button } from './ui/button';
import { ProcessingModeCard } from './ProcessingModeCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Upload, Download, CheckCircle, AlertCircle } from 'lucide-react';
import type { ProcessingMode } from '../lib/mockData';

interface BulkUploadProps {
  onBack: () => void;
}

export function BulkUpload({ onBack }: BulkUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processingMode, setProcessingMode] = useState<ProcessingMode>('batch');
  const [analysisDepth, setAnalysisDepth] = useState('standard');

  const mockData = {
    validBooks: 25,
    invalidRows: 2,
    books: [
      { title: 'Atomic Habits', author: 'James Clear', genre: 'Business', audience: 'General' },
      { title: 'Deep Work', author: 'Cal Newport', genre: 'Business', audience: 'Business Professionals' },
      { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', genre: 'Psychology', audience: 'General' },
      { title: 'Zero to One', author: 'Peter Thiel', genre: 'Business', audience: 'Business Professionals' },
      { title: 'The Lean Startup', author: 'Eric Ries', genre: 'Business', audience: 'Business Professionals' },
    ]
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const calculateCost = () => {
    const costPerBook = processingMode === 'batch' ? 0.03 : 0.06;
    return (mockData.validBooks * costPerBook).toFixed(2);
  };

  return (
    <div className="flex-1 bg-[#F9FAFB] p-8 overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <h1 className="text-[30px] font-bold text-[#111827] mb-1">Bulk Upload</h1>
        <p className="text-[#6B7280] mb-8">Upload multiple books at once via CSV</p>

        {/* Upload Area */}
        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-xl p-16 text-center transition-all duration-150
              ${isDragging 
                ? 'border-[#0EA5E9] bg-[#DBEAFE]' 
                : 'border-[#D1D5DB] bg-white hover:border-[#0EA5E9]'
              }
            `}
          >
            <div className="w-12 h-12 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-[#6B7280]" />
            </div>
            <h2 className="text-xl font-semibold text-[#111827] mb-2">
              Drag and drop CSV file here
            </h2>
            <p className="text-[#6B7280] mb-4">or click to browse</p>
            <p className="text-sm text-[#9CA3AF] mb-6">
              Supported format: CSV (max 10MB)<br />
              Up to 1,000 books per upload
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button asChild className="bg-[#0EA5E9] hover:bg-[#0284C7]">
                <span className="cursor-pointer">Browse Files</span>
              </Button>
            </label>
          </div>
        ) : (
          <>
            {/* File Selected - Preview */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#DCFCE7] rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#111827]">{file.name}</h3>
                    <p className="text-sm text-[#6B7280]">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setFile(null)}
                  className="text-[#6B7280]"
                >
                  Remove
                </Button>
              </div>

              {/* Preview Table */}
              <div className="border border-[#E5E7EB] rounded-lg overflow-hidden mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-[#F9FAFB]">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-[#374151]">Title</th>
                      <th className="text-left py-3 px-4 font-medium text-[#374151]">Author</th>
                      <th className="text-left py-3 px-4 font-medium text-[#374151]">Genre</th>
                      <th className="text-left py-3 px-4 font-medium text-[#374151]">Audience</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {mockData.books.map((book, index) => (
                      <tr key={index}>
                        <td className="py-3 px-4 text-[#374151]">{book.title}</td>
                        <td className="py-3 px-4 text-[#6B7280]">{book.author}</td>
                        <td className="py-3 px-4 text-[#6B7280]">{book.genre}</td>
                        <td className="py-3 px-4 text-[#6B7280]">{book.audience}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Validation Messages */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#22C55E]">
                  <CheckCircle className="w-4 h-4" />
                  <span>{mockData.validBooks} valid books found</span>
                </div>
                {mockData.invalidRows > 0 && (
                  <div className="flex items-center gap-2 text-sm text-[#F59E0B]">
                    <AlertCircle className="w-4 h-4" />
                    <span>{mockData.invalidRows} rows have missing required fields (highlighted in yellow)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Processing Settings */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-6">
              <h2 className="text-xl font-semibold text-[#111827] mb-6">Processing Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-3">
                    Processing Mode
                  </label>
                  <div className="flex gap-4">
                    <ProcessingModeCard
                      mode="batch"
                      selected={processingMode === 'batch'}
                      onSelect={() => setProcessingMode('batch')}
                    />
                    <ProcessingModeCard
                      mode="expedited"
                      selected={processingMode === 'expedited'}
                      onSelect={() => setProcessingMode('expedited')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Analysis Depth
                  </label>
                  <Select value={analysisDepth} onValueChange={setAnalysisDepth}>
                    <SelectTrigger className="bg-white border-[#D1D5DB]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quick">Quick</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Cost Summary */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-6">
              <h2 className="text-xl font-semibold text-[#111827] text-center mb-4">Cost Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-lg">
                  <span className="text-[#6B7280]">
                    {mockData.validBooks} books × ${processingMode === 'batch' ? '0.03' : '0.06'}
                  </span>
                  <span className="font-bold text-[#111827]">${calculateCost()}</span>
                </div>
                <div className="text-sm text-[#6B7280]">
                  Estimated completion: {processingMode === 'batch' ? '24 hours' : '9 minutes per book'}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={onBack}
                className="border-[#D1D5DB]"
              >
                Cancel
              </Button>
              <Button
                className="bg-[#0EA5E9] hover:bg-[#0284C7]"
              >
                Submit {mockData.validBooks} Books
              </Button>
            </div>
          </>
        )}

        {/* Download Template Link */}
        {!file && (
          <div className="text-center mt-6">
            <button className="text-[#0EA5E9] hover:underline flex items-center gap-2 mx-auto">
              <Download className="w-4 h-4" />
              <span>Download CSV template with example data</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
