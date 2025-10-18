import React, { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { Homepage } from './components/Homepage';
import { Login } from './components/Login';
import { TopNav } from './components/TopNav';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { NewAnalysisForm } from './components/NewAnalysisForm';
import { AnalysisDetailView } from './components/AnalysisDetailView';
import { ExpediteModal } from './components/ExpediteModal';
import { APIKeysManager } from './components/APIKeysManager';
import { BulkUpload } from './components/BulkUpload';
import { mockAnalyses, mockApiKeys, userInfo } from './lib/mockData';
import type { Analysis } from './lib/mockData';

type Route = 'home' | 'admin-login' | 'admin-dashboard';
type AdminPage = 'dashboard' | 'new-analysis' | 'analyses' | 'api-keys' | 'api-docs' | 'settings' | 'bulk-upload' | 'requests';

interface BookRequest {
  id: string;
  bookTitle: string;
  requesterEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
}

function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAdminPage, setCurrentAdminPage] = useState<AdminPage>('dashboard');
  const [analyses, setAnalyses] = useState<Analysis[]>(mockAnalyses);
  const [bookRequests, setBookRequests] = useState<BookRequest[]>([]);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);
  const [expediteModalOpen, setExpediteModalOpen] = useState(false);
  const [expediteAnalysisId, setExpediteAnalysisId] = useState<string | null>(null);

  // Update document meta tags based on route
  useEffect(() => {
    const metaRobots = document.querySelector('meta[name="robots"]');

    if (currentRoute === 'admin-login' || (currentRoute === 'admin-dashboard' && isAuthenticated)) {
      // Add no-index for admin pages
      if (metaRobots) {
        metaRobots.setAttribute('content', 'noindex, nofollow');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex, nofollow';
        document.head.appendChild(meta);
      }
    } else {
      // Remove no-index for public pages
      if (metaRobots) {
        metaRobots.setAttribute('content', 'index, follow');
      }
    }
  }, [currentRoute, isAuthenticated]);

  // Handle URL routing
  useEffect(() => {
    const path = window.location.pathname;

    if (path.startsWith('/admin')) {
      if (isAuthenticated) {
        setCurrentRoute('admin-dashboard');
      } else {
        setCurrentRoute('admin-login');
      }
    } else {
      setCurrentRoute('home');
    }
  }, [isAuthenticated]);

  const handleLogin = (password: string) => {
    setIsAuthenticated(true);
    setCurrentRoute('admin-dashboard');
    window.history.pushState({}, '', '/admin');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentRoute('home');
    window.history.pushState({}, '', '/');
  };

  const handleBookRequest = (bookTitle: string, requesterEmail: string) => {
    const newRequest: BookRequest = {
      id: `req-${Date.now()}`,
      bookTitle,
      requesterEmail,
      status: 'pending',
      submittedAt: new Date()
    };

    setBookRequests(prev => [newRequest, ...prev]);
  };

  const handleAdminNavigate = (page: string) => {
    setCurrentAdminPage(page as AdminPage);
    setSelectedAnalysisId(null);
  };

  const handleNewAnalysis = () => {
    setCurrentAdminPage('new-analysis');
  };

  const handleViewDetails = (id: string) => {
    setSelectedAnalysisId(id);
  };

  const handleExpedite = (id: string) => {
    setExpediteAnalysisId(id);
    setExpediteModalOpen(true);
  };

  const handleConfirmExpedite = () => {
    if (expediteAnalysisId) {
      setAnalyses(prev => prev.map(analysis => {
        if (analysis.id === expediteAnalysisId && analysis.status === 'processing-batch') {
          return {
            ...analysis,
            status: 'processing-expedited' as const,
            processingMode: 'expedited' as const,
            cost: analysis.cost + 0.03,
            estimatedCompletion: '9 minutes'
          };
        }
        return analysis;
      }));

      toast.success('Analysis upgraded to expedited processing', {
        description: 'Your book will be ready in approximately 9 minutes'
      });
    }

    setExpediteModalOpen(false);
    setExpediteAnalysisId(null);
  };

  const handleSubmitAnalysis = (formData: any) => {
    const newAnalysis: Analysis = {
      id: (analyses.length + 1).toString(),
      title: formData.title,
      author: formData.author,
      genres: formData.genre ? [formData.genre] : ['General'],
      status: 'processing-batch',
      processingMode: formData.processingMode,
      cost: formData.processingMode === 'batch' ? 0.03 : 0.06,
      progress: 5,
      submittedAt: new Date(),
      estimatedCompletion: formData.processingMode === 'batch' ? '24 hours' : '9 minutes',
      targetAudience: formData.targetAudience || 'General',
      isbn: formData.isbn
    };

    setAnalyses(prev => [newAnalysis, ...prev]);

    toast.success('Analysis submitted successfully', {
      description: `"${formData.title}" has been added to the queue`
    });

    setCurrentAdminPage('dashboard');
  };

  const handleCreateApiKey = () => {
    toast.success('API Key created', {
      description: 'Your new API key has been created. Make sure to copy it now.'
    });
  };

  const selectedAnalysis = selectedAnalysisId
    ? analyses.find(a => a.id === selectedAnalysisId)
    : null;

  const expediteAnalysis = expediteAnalysisId
    ? analyses.find(a => a.id === expediteAnalysisId)
    : null;

  // Render Homepage
  if (currentRoute === 'home') {
    return (
      <>
        <Homepage onSubmitRequest={handleBookRequest} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Render Admin Login
  if (currentRoute === 'admin-login') {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Render Admin Dashboard
  const renderAdminContent = () => {
    // If viewing a specific analysis
    if (selectedAnalysis) {
      return (
        <AnalysisDetailView
          analysis={selectedAnalysis}
          onBack={() => setSelectedAnalysisId(null)}
          onExpedite={
            selectedAnalysis.status === 'processing-batch'
              ? () => handleExpedite(selectedAnalysis.id)
              : undefined
          }
        />
      );
    }

    // Otherwise render based on current page
    switch (currentAdminPage) {
      case 'dashboard':
      case 'analyses':
        return (
          <Dashboard
            analyses={analyses}
            onNewAnalysis={handleNewAnalysis}
            onViewDetails={handleViewDetails}
            onExpedite={handleExpedite}
          />
        );

      case 'new-analysis':
        return (
          <NewAnalysisForm
            onBack={() => setCurrentAdminPage('dashboard')}
            onSubmit={handleSubmitAnalysis}
          />
        );

      case 'api-keys':
        return (
          <APIKeysManager
            apiKeys={mockApiKeys}
            onCreateKey={handleCreateApiKey}
          />
        );

      case 'bulk-upload':
        return (
          <BulkUpload onBack={() => setCurrentAdminPage('dashboard')} />
        );

      case 'requests':
        return (
          <div className="flex-1 bg-[#F9FAFB] p-8 overflow-auto">
            <h1 className="text-[30px] font-bold text-[#111827] mb-1">Book Requests</h1>
            <p className="text-[#6B7280] mb-8">Review and approve requests from users</p>

            <div className="space-y-4">
              {bookRequests.length === 0 ? (
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
                  <p className="text-[#6B7280]">No book requests yet</p>
                </div>
              ) : (
                bookRequests.map((request) => (
                  <div key={request.id} className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-[#111827] mb-2">{request.bookTitle}</h3>
                        <p className="text-sm text-[#6B7280]">Requested by: {request.requesterEmail}</p>
                        <p className="text-xs text-[#9CA3AF] mt-1">
                          {request.submittedAt.toLocaleDateString()} at {request.submittedAt.toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-lg text-sm">
                          Approve
                        </button>
                        <button className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg text-sm">
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'api-docs':
        return (
          <div className="flex-1 bg-[#F9FAFB] p-8 overflow-auto">
            <h1 className="text-[30px] font-bold text-[#111827] mb-1">API Documentation</h1>
            <p className="text-[#6B7280] mb-8">Learn how to integrate bkrptr into your applications</p>
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-8">
              <p className="text-[#6B7280]">API documentation coming soon...</p>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="flex-1 bg-[#F9FAFB] p-8 overflow-auto">
            <h1 className="text-[30px] font-bold text-[#111827] mb-1">Settings</h1>
            <p className="text-[#6B7280] mb-8">Manage your account and preferences</p>
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-8">
              <p className="text-[#6B7280]">Settings coming soon...</p>
              <button
                onClick={handleLogout}
                className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <TopNav userInitials={userInfo.initials} onLogout={handleLogout} />

      <div className="flex">
        <Sidebar
          currentPage={currentAdminPage}
          onNavigate={handleAdminNavigate}
          usageAmount={userInfo.usageThisMonth}
          usageBudget={userInfo.monthlyBudget}
          analysesCount={userInfo.analysesThisMonth}
          requestsCount={bookRequests.filter(r => r.status === 'pending').length}
        />

        {renderAdminContent()}
      </div>

      {/* Expedite Modal */}
      {expediteAnalysis && (
        <ExpediteModal
          open={expediteModalOpen}
          onClose={() => {
            setExpediteModalOpen(false);
            setExpediteAnalysisId(null);
          }}
          onConfirm={handleConfirmExpedite}
          bookTitle={expediteAnalysis.title}
        />
      )}

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
