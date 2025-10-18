import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { BookOpen } from 'lucide-react';

interface LoginProps {
  onLogin: (password: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple password check (in production, this would be server-side with proper auth)
    if (password === 'admin123') {
      onLogin(password);
      setError('');
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-12 h-12 text-[#0EA5E9]" />
            <span className="text-3xl font-bold text-[#111827]">bkrptr</span>
          </div>
          <h1 className="text-[30px] font-bold text-[#111827] mb-2">Admin Login</h1>
          <p className="text-[#6B7280]">Enter your password to access the dashboard</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-[#374151]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="mt-2 bg-white border-[#D1D5DB]"
                required
                autoFocus
              />
              {error && (
                <p className="text-sm text-red-500 mt-2">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#0EA5E9] hover:bg-[#0284C7]"
            >
              Login
            </Button>
          </form>

          <p className="text-xs text-[#9CA3AF] mt-6 text-center">
            Demo password: admin123
          </p>
        </div>
      </div>
    </div>
  );
}
