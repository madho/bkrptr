import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

interface ExpediteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookTitle: string;
}

export function ExpediteModal({ open, onClose, onConfirm, bookTitle }: ExpediteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#FEF3C7] rounded-full flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <DialogTitle className="text-2xl">Expedite to Priority Processing</DialogTitle>
          </div>
          <DialogDescription className="text-[#6B7280]">
            Upgrade "{bookTitle}" to expedited processing
          </DialogDescription>
        </DialogHeader>

        {/* Cost Comparison Table */}
        <div className="my-6">
          <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F9FAFB]">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-[#374151]"></th>
                  <th className="text-left py-3 px-4 font-medium text-[#374151]">Batch</th>
                  <th className="text-left py-3 px-4 font-medium text-[#374151]">Expedited</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                <tr>
                  <td className="py-3 px-4 text-[#6B7280]">Processing time</td>
                  <td className="py-3 px-4">~24 hours</td>
                  <td className="py-3 px-4 font-medium text-[#F59E0B]">~9 minutes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-[#6B7280]">Cost</td>
                  <td className="py-3 px-4">$0.03</td>
                  <td className="py-3 px-4 font-medium text-[#F59E0B]">$0.06</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-[#6B7280]">Priority</td>
                  <td className="py-3 px-4">Standard</td>
                  <td className="py-3 px-4 font-medium text-[#F59E0B]">High</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Highlight Box */}
        <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚡</span>
            <div>
              <h3 className="font-semibold text-[#B45309] mb-2">Upgrade to Expedited Processing</h3>
              <ul className="space-y-1 text-sm text-[#B45309]">
                <li>Additional cost: <span className="font-semibold">+$0.03</span></li>
                <li>New estimated completion: <span className="font-semibold">9 minutes</span></li>
                <li>You'll be notified when complete</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Note */}
        <p className="text-sm text-[#6B7280] mb-6">
          This will move your analysis to the priority queue. Processing will begin immediately.
        </p>

        {/* Footer Buttons */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} className="border-[#D1D5DB]">
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            className="bg-[#F59E0B] hover:bg-[#D97706] text-white"
          >
            Expedite for $0.03
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
