// Mock data for bkrptr dashboard prototype

export type ProcessingMode = 'batch' | 'expedited';
export type AnalysisStatus = 'processing-batch' | 'processing-expedited' | 'completed' | 'failed' | 'pending';

export interface Analysis {
  id: string;
  title: string;
  author: string;
  genres: string[];
  status: AnalysisStatus;
  processingMode: ProcessingMode;
  cost: number;
  progress?: number;
  submittedAt: Date;
  estimatedCompletion?: string;
  completedAt?: Date;
  errorMessage?: string;
  targetAudience?: string;
  isbn?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed?: Date;
  requestsThisMonth: number;
  permissions: {
    read: boolean;
    write: boolean;
    expedite: boolean;
    admin: boolean;
  };
  status: 'active' | 'revoked';
}

export const mockAnalyses: Analysis[] = [
  {
    id: '1',
    title: 'Atomic Habits',
    author: 'James Clear',
    genres: ['Business', 'Self-help'],
    status: 'processing-batch',
    processingMode: 'batch',
    cost: 0.03,
    progress: 65,
    submittedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
    estimatedCompletion: '6 hours',
    targetAudience: 'General'
  },
  {
    id: '2',
    title: 'Deep Work',
    author: 'Cal Newport',
    genres: ['Business', 'Productivity'],
    status: 'processing-batch',
    processingMode: 'batch',
    cost: 0.03,
    progress: 30,
    submittedAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
    estimatedCompletion: '14 hours',
    targetAudience: 'Business Professionals'
  },
  {
    id: '3',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    genres: ['Psychology', 'Science'],
    status: 'processing-batch',
    processingMode: 'batch',
    cost: 0.03,
    progress: 15,
    submittedAt: new Date(Date.now() - 22 * 60 * 60 * 1000),
    estimatedCompletion: '18 hours',
    targetAudience: 'General'
  },
  {
    id: '4',
    title: 'Good to Great',
    author: 'Jim Collins',
    genres: ['Business', 'Leadership'],
    status: 'processing-expedited',
    processingMode: 'expedited',
    cost: 0.06,
    progress: 80,
    submittedAt: new Date(Date.now() - 7 * 60 * 1000),
    estimatedCompletion: '4 minutes',
    targetAudience: 'Leadership'
  },
  {
    id: '5',
    title: 'The Hard Thing About Hard Things',
    author: 'Ben Horowitz',
    genres: ['Business', 'Entrepreneurship'],
    status: 'processing-expedited',
    processingMode: 'expedited',
    cost: 0.06,
    progress: 45,
    submittedAt: new Date(Date.now() - 4 * 60 * 1000),
    estimatedCompletion: '6 minutes',
    targetAudience: 'Business Professionals'
  },
  {
    id: '6',
    title: 'Zero to One',
    author: 'Peter Thiel',
    genres: ['Business', 'Technology'],
    status: 'completed',
    processingMode: 'batch',
    cost: 0.03,
    progress: 100,
    submittedAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    targetAudience: 'Business Professionals'
  },
  {
    id: '7',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    genres: ['Business', 'Entrepreneurship'],
    status: 'completed',
    processingMode: 'expedited',
    cost: 0.06,
    progress: 100,
    submittedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    targetAudience: 'Business Professionals'
  },
  {
    id: '8',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    genres: ['History', 'Science'],
    status: 'completed',
    processingMode: 'batch',
    cost: 0.03,
    progress: 100,
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    targetAudience: 'General'
  },
  {
    id: '9',
    title: 'Educated',
    author: 'Tara Westover',
    genres: ['Biography', 'Non-fiction'],
    status: 'completed',
    processingMode: 'batch',
    cost: 0.03,
    progress: 100,
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    targetAudience: 'General'
  },
  {
    id: '10',
    title: 'The Art of War',
    author: 'Sun Tzu',
    genres: ['Strategy', 'Philosophy'],
    status: 'completed',
    processingMode: 'batch',
    cost: 0.03,
    progress: 100,
    submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    targetAudience: 'Business Professionals'
  },
  {
    id: '11',
    title: 'Shoe Dog',
    author: 'Phil Knight',
    genres: ['Biography', 'Business'],
    status: 'failed',
    processingMode: 'batch',
    cost: 0.03,
    progress: 0,
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    errorMessage: 'API error: Rate limit exceeded',
    targetAudience: 'General'
  },
];

export const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Production LMS Integration',
    key: 'bkrptr_live_k3x9mP2n...gH2j',
    createdAt: new Date('2025-10-10'),
    lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
    requestsThisMonth: 1247,
    permissions: {
      read: true,
      write: true,
      expedite: false,
      admin: false
    },
    status: 'active'
  },
  {
    id: '2',
    name: 'Testing Environment',
    key: 'bkrptr_test_xY7zK4m...aB9c',
    createdAt: new Date('2025-09-15'),
    lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    requestsThisMonth: 342,
    permissions: {
      read: true,
      write: true,
      expedite: true,
      admin: false
    },
    status: 'active'
  },
  {
    id: '3',
    name: 'Old Mobile App',
    key: 'bkrptr_live_p9Qs1T8...rE4d',
    createdAt: new Date('2025-06-01'),
    lastUsed: new Date('2025-08-20'),
    requestsThisMonth: 0,
    permissions: {
      read: true,
      write: false,
      expedite: false,
      admin: false
    },
    status: 'revoked'
  },
];

export const userInfo = {
  name: 'Madho Patel',
  initials: 'MP',
  email: 'madho@example.com',
  usageThisMonth: 12.45,
  monthlyBudget: 50.00,
  analysesThisMonth: 48
};

export const genreOptions = [
  'Business',
  'Self-help',
  'Biography',
  'Technology',
  'Fiction',
  'Non-fiction',
  'Science',
  'History',
  'Psychology',
  'Philosophy',
  'Leadership',
  'Entrepreneurship',
  'Productivity',
  'Strategy'
];

export const audienceOptions = [
  'General',
  'Business Professionals',
  'Students',
  'Technical',
  'Leadership'
];

export const analysisDepthOptions = [
  { value: 'quick', label: 'Quick', description: '~15 min processing (batch) or ~5 min (expedited)' },
  { value: 'standard', label: 'Standard', description: '~24 hours (batch) or ~9 min (expedited)' },
  { value: 'comprehensive', label: 'Comprehensive', description: '~36 hours (batch) or ~15 min (expedited)' }
];
