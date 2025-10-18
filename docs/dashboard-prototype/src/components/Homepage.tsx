import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface HomepageProps {
  onSubmitRequest: (bookTitle: string, requesterEmail: string) => void;
}

export function Homepage({ onSubmitRequest }: HomepageProps) {
  const [bookTitle, setBookTitle] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookTitle.trim() && email.trim()) {
      onSubmitRequest(bookTitle, email);
      toast.success('Book request submitted!', {
        description: 'We\'ll review your request and notify you when it\'s ready.'
      });
      setBookTitle('');
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F9FAFB] flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto px-8 py-4 flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-[#0EA5E9]" />
          <span className="text-2xl font-bold text-[#111827]">bkrptr</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-[48px] font-bold text-[#111827] mb-4 leading-tight">
              bkrptr
            </h1>
            <p className="text-[20px] text-[#6B7280]">
              AI-powered book analysis. Request a book and we'll add it to our queue.
            </p>
          </div>

          {/* Request Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
            <h2 className="text-[24px] font-semibold text-[#111827] mb-6">
              Request a Book Analysis
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="bookTitle" className="block text-sm font-medium text-[#374151] mb-2">
                  Book Title
                </label>
                <Input
                  id="bookTitle"
                  type="text"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  placeholder="e.g., Atomic Habits by James Clear"
                  className="w-full bg-white border-[#D1D5DB] text-[16px]"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#374151] mb-2">
                  Your Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white border-[#D1D5DB] text-[16px]"
                  required
                />
                <p className="text-sm text-[#6B7280] mt-1.5">
                  We'll notify you when your analysis is ready
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0EA5E9] hover:bg-[#0284C7] text-white py-6 text-[16px]"
                disabled={!bookTitle.trim() || !email.trim()}
              >
                Submit Request
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-[#9CA3AF] mt-6">
            Typical processing time: 24-48 hours
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-6">
        <div className="max-w-5xl mx-auto px-8 text-center">
          <p className="text-sm text-[#6B7280]">
            Powered by Claude Sonnet 4.5 • © 2025 bkrptr
          </p>
        </div>
      </footer>
    </div>
  );
}
