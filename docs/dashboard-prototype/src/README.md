# bkrptr Dashboard

A complete, production-ready web dashboard prototype for **bkrptr** - an AI-powered book analysis platform.

## Overview

bkrptr helps busy professionals transform books into actionable insights using Claude Sonnet 4.5 AI. The platform offers two processing modes:

- **Batch Processing** (24 hours, $0.03 per book) - Economy option with green branding
- **Expedited Processing** (9 minutes, $0.06 per book) - Premium option with amber branding

## Features

### ✅ Implemented Screens

1. **Dashboard** - Main analysis queue with stats cards, filtering, and search
2. **New Analysis Form** - Single book submission with processing mode selection
3. **Analysis Detail View** - Detailed view of individual analyses with documents
4. **Expedite Modal** - Upgrade batch analyses to expedited processing
5. **API Keys Manager** - Manage API keys for programmatic access
6. **Bulk Upload** - CSV upload for submitting multiple books at once

### 🎨 Design System

- **Brand Colors**: Blue (#0EA5E9) for primary actions
- **Batch Mode**: Green (#22C55E) indicating economy/cost-effective
- **Expedited Mode**: Amber (#F59E0B) indicating premium/urgent
- **Typography**: System fonts with precise sizing (30px, 24px, 20px, 16px, 14px, 12px)
- **Spacing**: 8px base grid system
- **Shadows**: Four levels (sm, md, lg, xl)
- **Border Radius**: 4px (small), 8px (medium), 12px (large)

### 🎯 Key Components

- **StatsCard** - Dashboard statistics display
- **AnalysisCard** - Book analysis cards with status-based styling
- **ProcessingModeCard** - Visual selection for batch vs expedited
- **Sidebar** - Navigation with usage tracking
- **TopNav** - Header with branding and user menu
- **ExpediteModal** - Interactive upgrade dialog

### 📊 Mock Data

- 11 sample book analyses in various states (processing batch, processing expedited, completed, failed)
- 3 API keys with different permissions and statuses
- User information with monthly budget tracking
- Real book titles (Atomic Habits, Deep Work, Zero to One, etc.)

## User Flows

### Flow 1: Submit New Book (Batch)
1. Click "New Analysis" → Form appears
2. Fill in title and author → Select genre
3. Batch mode selected by default (green)
4. Submit → Success toast → Redirect to dashboard with new card

### Flow 2: Expedite Pending Analysis
1. Find pending batch analysis
2. Click "Expedite" → Modal opens with cost comparison
3. Confirm → Card updates to amber, ETA changes to 9 minutes
4. Success toast notification

### Flow 3: View Completed Analysis
1. Click completed analysis card
2. See 4 document types (MADHO Summary, Detailed Analysis, Executive Summary, Quick Reference)
3. View/download individual documents
4. Access metadata and sharing options

### Flow 4: Bulk Upload
1. Navigate to bulk upload
2. Drag & drop CSV or browse
3. Preview table with validation
4. Select processing mode → Submit multiple books

### Flow 5: Manage API Keys
1. View existing keys with usage stats
2. Copy keys to clipboard
3. View permissions (Read, Write, Expedite, Admin)
4. Rotate or revoke keys

## Interactive Features

- ✅ Real-time progress bars with color coding (green for batch, amber for expedited)
- ✅ Search and filter analyses by status
- ✅ Toast notifications for user actions
- ✅ Hover states on cards and buttons
- ✅ Modal dialogs with backdrop
- ✅ Form validation with disabled states
- ✅ Cost calculations and savings display
- ✅ Copy to clipboard for API keys
- ✅ Responsive status badges
- ✅ Dynamic timestamp formatting

## Color-Coded Status System

- **Batch Processing**: Green badges, green progress bars, green buttons
- **Expedited Processing**: Amber badges, amber progress bars, amber buttons
- **Completed**: Green success indicators
- **Failed**: Red error indicators

## Typography Scale

- **Headings**: 30px (H1), 24px (H2), 20px (H3)
- **Body**: 18px (large), 16px (base), 14px (small)
- **Labels**: 14px medium weight
- **Captions**: 12px

## Accessibility

- Semantic HTML elements
- ARIA labels for icons
- Keyboard navigation support
- Focus indicators (3px ring)
- Sufficient color contrast
- Touch-friendly targets (minimum 44px on mobile)

## Technical Stack

- **React** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **Lucide React** for icons
- **Sonner** for toast notifications
- **Radix UI** primitives

## Project Structure

```
/
├── App.tsx                      # Main application with routing
├── components/
│   ├── Dashboard.tsx            # Main dashboard screen
│   ├── NewAnalysisForm.tsx      # Single book submission form
│   ├── AnalysisDetailView.tsx   # Individual analysis details
│   ├── ExpediteModal.tsx        # Upgrade to expedited modal
│   ├── APIKeysManager.tsx       # API key management
│   ├── BulkUpload.tsx           # CSV bulk upload
│   ├── Sidebar.tsx              # Navigation sidebar
│   ├── TopNav.tsx               # Top navigation bar
│   ├── StatsCard.tsx            # Statistics card component
│   ├── AnalysisCard.tsx         # Book analysis card
│   ├── ProcessingModeCard.tsx   # Batch/Expedited selector
│   └── ui/                      # Shadcn/ui components
├── lib/
│   └── mockData.ts              # Sample data and types
└── styles/
    └── globals.css              # Design system tokens
```

## Design Priorities

1. **Clear visual distinction** between Batch (green) and Expedited (amber)
2. **Cost transparency** - always show prices and savings
3. **Status clarity** - color-coded badges and progress indicators
4. **Progressive disclosure** - common actions prominent, details expandable
5. **Professional polish** - smooth transitions, proper spacing, attention to detail

## Next Steps (Future Enhancements)

- Implement actual backend integration
- Add user authentication
- Enable real-time progress updates via WebSockets
- Add data visualization (charts for usage trends)
- Implement dark mode
- Add mobile-responsive layouts
- Enable document preview/viewer
- Add advanced filtering and sorting
- Implement export to multiple formats
- Add team collaboration features

---

Built with attention to detail for production-ready deployment.
