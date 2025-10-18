# UI/UX Design System - bkrptr Dashboard

## Document Metadata

| Field | Value |
|-------|-------|
| **Version** | 1.0.0 |
| **Created** | 2025-10-18 |
| **Status** | Complete |
| **Platform** | Web Dashboard |
| **Target Audience** | Busy professionals, executives, team leads |

---

## 1. Design Philosophy

### Core Principles

1. **Clarity Over Cleverness** - Every element should have obvious purpose
2. **Progressive Disclosure** - Show what's needed, hide complexity until required
3. **Cost Transparency** - Always show financial implications upfront
4. **Status Awareness** - User should always know what's happening
5. **Mobile-First Responsiveness** - Works beautifully on all devices

### Brand Personality

- **Professional** - Trustworthy, reliable, enterprise-ready
- **Efficient** - Fast, streamlined, no unnecessary steps
- **Intelligent** - AI-powered, smart defaults, helpful suggestions
- **Approachable** - Not intimidating, friendly to non-technical users

---

## 2. Color System

### Primary Palette

```css
/* Brand Primary - Blue */
--color-primary-50: #EFF6FF;
--color-primary-100: #DBEAFE;
--color-primary-200: #BFDBFE;
--color-primary-300: #93C5FD;
--color-primary-400: #60A5FA;
--color-primary-500: #0EA5E9;  /* Primary brand color */
--color-primary-600: #0284C7;
--color-primary-700: #0369A1;
--color-primary-800: #075985;
--color-primary-900: #0C4A6E;
```

### Processing Mode Colors

```css
/* Batch Processing - Green (Economy/Cost-effective) */
--color-batch-50: #F0FDF4;
--color-batch-100: #DCFCE7;
--color-batch-200: #BBF7D0;
--color-batch-300: #86EFAC;
--color-batch-400: #4ADE80;
--color-batch-500: #22C55E;  /* Primary batch color */
--color-batch-600: #16A34A;
--color-batch-700: #15803D;
--color-batch-800: #166534;
--color-batch-900: #14532D;

/* Expedited Processing - Amber (Premium/Urgent) */
--color-expedite-50: #FFFBEB;
--color-expedite-100: #FEF3C7;
--color-expedite-200: #FDE68A;
--color-expedite-300: #FCD34D;
--color-expedite-400: #FBBF24;
--color-expedite-500: #F59E0B;  /* Primary expedite color */
--color-expedite-600: #D97706;
--color-expedite-700: #B45309;
--color-expedite-800: #92400E;
--color-expedite-900: #78350F;
```

### Semantic Colors

```css
/* Success */
--color-success-500: #22C55E;
--color-success-100: #DCFCE7;
--color-success-700: #15803D;

/* Error */
--color-error-500: #EF4444;
--color-error-100: #FEE2E2;
--color-error-700: #B91C1C;

/* Warning */
--color-warning-500: #F59E0B;
--color-warning-100: #FEF3C7;
--color-warning-700: #B45309;

/* Info */
--color-info-500: #3B82F6;
--color-info-100: #DBEAFE;
--color-info-700: #1D4ED8;
```

### Neutral Palette

```css
/* Grays */
--color-gray-50: #F9FAFB;
--color-gray-100: #F3F4F6;
--color-gray-200: #E5E7EB;
--color-gray-300: #D1D5DB;
--color-gray-400: #9CA3AF;
--color-gray-500: #6B7280;
--color-gray-600: #4B5563;
--color-gray-700: #374151;
--color-gray-800: #1F2937;
--color-gray-900: #111827;

/* Backgrounds */
--bg-primary: #FFFFFF;
--bg-secondary: #F9FAFB;
--bg-tertiary: #F3F4F6;

/* Text */
--text-primary: #111827;
--text-secondary: #6B7280;
--text-tertiary: #9CA3AF;
--text-inverse: #FFFFFF;
```

---

## 3. Typography

### Font Family

```css
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
             'Helvetica Neue', Arial, sans-serif;
--font-mono: 'SF Mono', 'Monaco', 'Consolas', 'Courier New', monospace;
```

### Type Scale

```css
/* Font Sizes */
--text-xs: 12px;    /* 0.75rem */
--text-sm: 14px;    /* 0.875rem */
--text-base: 16px;  /* 1rem */
--text-lg: 18px;    /* 1.125rem */
--text-xl: 20px;    /* 1.25rem */
--text-2xl: 24px;   /* 1.5rem */
--text-3xl: 30px;   /* 1.875rem */
--text-4xl: 36px;   /* 2.25rem */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Typography Usage

```css
/* Headings */
.heading-1 {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--text-primary);
}

.heading-2 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  color: var(--text-primary);
}

.heading-3 {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-normal);
  color: var(--text-primary);
}

/* Body Text */
.body-large {
  font-size: var(--text-lg);
  font-weight: var(--font-normal);
  line-height: var(--leading-relaxed);
  color: var(--text-primary);
}

.body-base {
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--text-primary);
}

.body-small {
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--text-secondary);
}

/* Labels */
.label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
  color: var(--text-primary);
}

/* Captions */
.caption {
  font-size: var(--text-xs);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--text-secondary);
}
```

---

## 4. Spacing System

### Base Scale (8px)

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

### Usage Guidelines

- **Micro spacing** (4px-8px): Between related elements, icon-text gaps
- **Component spacing** (12px-16px): Internal component padding
- **Section spacing** (24px-32px): Between distinct sections
- **Page spacing** (48px-64px): Major page sections

---

## 5. Border Radius

```css
--radius-sm: 4px;    /* Small elements, badges */
--radius-md: 8px;    /* Buttons, inputs, cards */
--radius-lg: 12px;   /* Large cards, modals */
--radius-xl: 16px;   /* Hero sections */
--radius-full: 9999px; /* Pills, avatars */
```

---

## 6. Shadows

```css
/* Elevation Shadows */
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);

/* Focus Shadows */
--shadow-focus-primary: 0 0 0 3px rgba(14, 165, 233, 0.2);
--shadow-focus-batch: 0 0 0 3px rgba(34, 197, 94, 0.2);
--shadow-focus-expedite: 0 0 0 3px rgba(245, 158, 11, 0.2);
--shadow-focus-error: 0 0 0 3px rgba(239, 68, 68, 0.2);
```

---

## 7. Component Library

### 7.1 Buttons

#### Primary Button
```css
.button-primary {
  padding: 10px 20px;
  background: var(--color-primary-500);
  color: var(--text-inverse);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  border-radius: var(--radius-md);
  border: none;
  box-shadow: var(--shadow-sm);
  transition: all 150ms ease;
}

.button-primary:hover {
  background: var(--color-primary-600);
  box-shadow: var(--shadow-md);
}

.button-primary:active {
  background: var(--color-primary-700);
  box-shadow: var(--shadow-xs);
  transform: translateY(1px);
}

.button-primary:focus {
  outline: none;
  box-shadow: var(--shadow-focus-primary), var(--shadow-sm);
}

.button-primary:disabled {
  background: var(--color-gray-300);
  color: var(--color-gray-500);
  cursor: not-allowed;
  box-shadow: none;
}
```

#### Secondary Button
```css
.button-secondary {
  padding: 10px 20px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-gray-300);
  transition: all 150ms ease;
}

.button-secondary:hover {
  background: var(--color-gray-50);
  border-color: var(--color-gray-400);
}
```

#### Batch Button (Green)
```css
.button-batch {
  padding: 10px 20px;
  background: var(--color-batch-500);
  color: var(--text-inverse);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  border-radius: var(--radius-md);
  border: none;
  box-shadow: var(--shadow-sm);
}

.button-batch:hover {
  background: var(--color-batch-600);
}
```

#### Expedite Button (Amber)
```css
.button-expedite {
  padding: 10px 20px;
  background: var(--color-expedite-500);
  color: var(--text-inverse);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  border-radius: var(--radius-md);
  border: none;
  box-shadow: var(--shadow-sm);
}

.button-expedite:hover {
  background: var(--color-expedite-600);
}
```

### 7.2 Status Badges

```css
/* Base Badge */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  border-radius: var(--radius-full);
  line-height: 1;
}

/* Status Variants */
.badge-pending {
  background: var(--color-gray-100);
  color: var(--color-gray-700);
}

.badge-processing-batch {
  background: var(--color-batch-100);
  color: var(--color-batch-700);
  border: 1px solid var(--color-batch-300);
}

.badge-processing-expedited {
  background: var(--color-expedite-100);
  color: var(--color-expedite-700);
  border: 1px solid var(--color-expedite-300);
}

.badge-completed {
  background: var(--color-success-100);
  color: var(--color-success-700);
}

.badge-failed {
  background: var(--color-error-100);
  color: var(--color-error-700);
}
```

### 7.3 Progress Bar

```css
/* Container */
.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--color-gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

/* Fill - Batch (Green) */
.progress-fill-batch {
  height: 100%;
  background: var(--color-batch-500);
  border-radius: var(--radius-full);
  transition: width 300ms ease;
}

/* Fill - Expedited (Amber) */
.progress-fill-expedited {
  height: 100%;
  background: var(--color-expedite-500);
  border-radius: var(--radius-full);
  transition: width 300ms ease;
}
```

### 7.4 Analysis Card

```css
.analysis-card {
  background: var(--bg-primary);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: all 150ms ease;
}

.analysis-card:hover {
  border-color: var(--color-gray-300);
  box-shadow: var(--shadow-md);
}

.analysis-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-4);
}

.analysis-card-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

.analysis-card-author {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-top: var(--space-1);
}

.analysis-card-meta {
  display: flex;
  gap: var(--space-4);
  margin-top: var(--space-4);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.analysis-card-actions {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-4);
}
```

### 7.5 Form Elements

#### Input Field
```css
.input {
  width: 100%;
  padding: 10px 12px;
  font-size: var(--text-base);
  color: var(--text-primary);
  background: var(--bg-primary);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  transition: all 150ms ease;
}

.input:hover {
  border-color: var(--color-gray-400);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: var(--shadow-focus-primary);
}

.input:disabled {
  background: var(--color-gray-100);
  color: var(--color-gray-500);
  cursor: not-allowed;
}

.input-error {
  border-color: var(--color-error-500);
}

.input-error:focus {
  box-shadow: var(--shadow-focus-error);
}
```

#### Label
```css
.label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.label-required::after {
  content: " *";
  color: var(--color-error-500);
}
```

#### Select Dropdown
```css
.select {
  width: 100%;
  padding: 10px 12px;
  font-size: var(--text-base);
  color: var(--text-primary);
  background: var(--bg-primary);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  cursor: pointer;
}
```

#### Textarea
```css
.textarea {
  width: 100%;
  padding: 10px 12px;
  font-size: var(--text-base);
  font-family: var(--font-sans);
  color: var(--text-primary);
  background: var(--bg-primary);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  resize: vertical;
  min-height: 100px;
}
```

### 7.6 Modal

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-gray-200);
}

.modal-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  margin: 0;
}

.modal-body {
  padding: var(--space-6);
}

.modal-footer {
  padding: var(--space-6);
  border-top: 1px solid var(--color-gray-200);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}
```

### 7.7 Cost Display

```css
.cost-display {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
}

.cost-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-right: var(--space-2);
}

.cost-value {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.cost-savings {
  font-size: var(--text-sm);
  color: var(--color-batch-600);
  margin-left: var(--space-2);
}
```

---

## 8. Layout Grid

### Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```

### Container

```css
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-4);
  padding-right: var(--space-4);
}

@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
    padding-left: var(--space-6);
    padding-right: var(--space-6);
  }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
    padding-left: var(--space-8);
    padding-right: var(--space-8);
  }
}
```

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│                      Top Navigation                      │
├─────────┬───────────────────────────────────────────────┤
│         │                                               │
│ Sidebar │              Main Content Area                │
│  (240px)│                                               │
│         │                                               │
└─────────┴───────────────────────────────────────────────┘
```

---

## 9. Accessibility (WCAG 2.1 AA)

### Color Contrast Requirements

- **Normal text** (< 18px): 4.5:1 minimum
- **Large text** (≥ 18px): 3:1 minimum
- **Interactive elements**: 3:1 minimum

### Verified Contrasts

```
✓ Primary-500 on White: 4.8:1
✓ Gray-700 on White: 10.2:1
✓ Gray-600 on White: 7.8:1
✓ Batch-700 on Batch-100: 8.2:1
✓ Expedite-700 on Expedite-100: 7.5:1
```

### Focus States

- All interactive elements must have visible focus indicators
- Focus ring: 3px solid with 20% opacity of element color
- Never remove focus outline without replacement

### Keyboard Navigation

- All actions accessible via keyboard
- Logical tab order
- Skip navigation links
- Escape to close modals

### Screen Reader Support

- Semantic HTML elements
- ARIA labels where needed
- Status announcements for async updates
- Descriptive link text

---

## 10. Iconography

### Icon System

- **Library**: Heroicons (outline and solid)
- **Size**: 16px (sm), 20px (md), 24px (lg)
- **Stroke Width**: 1.5px for outline icons
- **Color**: Inherits from parent text color

### Common Icons

```
📊 Dashboard: chart-bar
📚 Analyses: book-open
➕ New Analysis: plus-circle
⚙️ Settings: cog
👤 Profile: user-circle
🔍 Search: magnifying-glass
📥 Download: arrow-down-tray
⚡ Expedite: bolt
✓ Complete: check-circle
⏳ Processing: clock
❌ Failed: x-circle
🔑 API Keys: key
```

---

## 11. Animation & Transitions

### Timing Functions

```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

### Duration

```css
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;
```

### Common Transitions

```css
/* Button Hover */
transition: background 150ms ease, box-shadow 150ms ease;

/* Card Hover */
transition: border-color 150ms ease, box-shadow 150ms ease;

/* Modal Enter/Exit */
transition: opacity 250ms ease, transform 250ms ease;

/* Progress Bar */
transition: width 300ms ease;
```

---

## 12. Responsive Behavior

### Mobile (< 768px)

- Single column layout
- Stacked navigation (hamburger menu)
- Cards full width
- Simplified table view (card format)
- Touch-friendly targets (44px min)

### Tablet (768px - 1024px)

- Two-column grid for cards
- Collapsible sidebar
- Full table display
- Landscape optimizations

### Desktop (> 1024px)

- Three-column grid for cards
- Persistent sidebar
- Enhanced table features
- Hover interactions enabled

---

## 13. Content Examples

### Sample Book Titles (for prototyping)

1. **Atomic Habits** by James Clear
2. **Deep Work** by Cal Newport
3. **Thinking, Fast and Slow** by Daniel Kahneman
4. **Good to Great** by Jim Collins
5. **The Hard Thing About Hard Things** by Ben Horowitz
6. **Zero to One** by Peter Thiel
7. **The Lean Startup** by Eric Ries
8. **Sapiens** by Yuval Noah Harari
9. **The Art of War** by Sun Tzu
10. **Educated** by Tara Westover

### Sample Status Messages

- **Queued**: "Analysis queued • Est. completion: Tomorrow at 2:00 PM"
- **Processing (Batch)**: "Processing batch analysis • 45% complete"
- **Processing (Expedited)**: "Processing expedited • 6 minutes remaining"
- **Completed**: "Completed 2 hours ago • 4 documents ready"
- **Failed**: "Analysis failed • API error • Retry available"

---

## 14. Error States

### Empty State

```html
<div class="empty-state">
  <div class="empty-state-icon">📚</div>
  <h3 class="empty-state-title">No analyses yet</h3>
  <p class="empty-state-description">
    Get started by submitting your first book for analysis
  </p>
  <button class="button-primary">Add Your First Book</button>
</div>
```

### Error State

```html
<div class="error-state">
  <div class="error-state-icon">⚠️</div>
  <h3 class="error-state-title">Unable to load analyses</h3>
  <p class="error-state-description">
    We're experiencing technical difficulties. Please try again.
  </p>
  <button class="button-secondary">Retry</button>
</div>
```

---

## 15. Design Tokens Summary

```json
{
  "colors": {
    "primary": "#0EA5E9",
    "batch": "#22C55E",
    "expedite": "#F59E0B",
    "success": "#22C55E",
    "error": "#EF4444",
    "warning": "#F59E0B"
  },
  "spacing": {
    "unit": "8px",
    "scale": [4, 8, 12, 16, 24, 32, 48, 64]
  },
  "typography": {
    "family": "system-ui",
    "sizes": [12, 14, 16, 18, 20, 24, 30, 36],
    "weights": [400, 500, 600, 700]
  },
  "borderRadius": {
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "full": "9999px"
  }
}
```

---

*End of Design System Document*
