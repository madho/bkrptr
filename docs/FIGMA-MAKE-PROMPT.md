# Master Figma Make Prompt - bkrptr Dashboard

## Complete Production-Ready Prototype Specification

---

# FIGMA MAKE PROMPT: bkrptr Web Dashboard

Create a complete, production-ready web dashboard prototype for **bkrptr** - an AI-powered book analysis platform. Generate a pixel-perfect, fully interactive prototype with all screens, components, and user flows.

---

## 🎯 PRODUCT CONTEXT

**bkrptr** is a web application for busy professionals that generates comprehensive book analyses using Claude Sonnet 4.5 AI. The platform offers two processing modes:

1. **Batch Processing** (DEFAULT): ~24 hours processing, $0.03 per book (economy option - GREEN)
2. **Expedited Processing**: ~9 minutes processing, $0.06 per book (premium option - AMBER)

**Target Users**: Executives, team leads, busy professionals reading 5-20 books/month

**Key Value Proposition**: Transform books into actionable insights with transparent pricing and flexible processing speeds

---

## 🎨 DESIGN SYSTEM FOUNDATION

### Color Palette (EXACT HEX CODES)

**Brand Primary (Blue)**
- Primary-500: #0EA5E9 (main brand color)
- Primary-600: #0284C7 (hover states)
- Primary-700: #0369A1 (active states)
- Primary-100: #DBEAFE (light backgrounds)

**Batch Processing (Green - represents economy/cost-effective)**
- Batch-500: #22C55E (primary green)
- Batch-600: #16A34A (hover)
- Batch-700: #15803D (active/dark text)
- Batch-100: #DCFCE7 (light backgrounds)
- Batch-300: #86EFAC (borders)

**Expedited Processing (Amber - represents premium/urgent)**
- Expedite-500: #F59E0B (primary amber)
- Expedite-600: #D97706 (hover)
- Expedite-700: #B45309 (active/dark text)
- Expedite-100: #FEF3C7 (light backgrounds)
- Expedite-300: #FCD34D (borders)

**Semantic Colors**
- Success: #22C55E
- Error: #EF4444
- Warning: #F59E0B
- Info: #3B82F6

**Neutrals (Grays)**
- Gray-50: #F9FAFB (page background)
- Gray-100: #F3F4F6 (card backgrounds)
- Gray-200: #E5E7EB (borders)
- Gray-300: #D1D5DB (borders hover)
- Gray-400: #9CA3AF (placeholder text)
- Gray-500: #6B7280 (secondary text)
- Gray-700: #374151 (primary text)
- Gray-900: #111827 (headings)

### Typography

**Font Family**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

**Font Sizes**:
- Heading 1: 30px, bold (700), line-height 1.25
- Heading 2: 24px, semibold (600), line-height 1.25
- Heading 3: 20px, semibold (600), line-height 1.5
- Body Large: 18px, normal (400), line-height 1.75
- Body Base: 16px, normal (400), line-height 1.5
- Body Small: 14px, normal (400), line-height 1.5
- Label: 14px, medium (500), line-height 1.5
- Caption: 12px, normal (400), line-height 1.5

**Text Colors**:
- Primary text: #111827
- Secondary text: #6B7280
- Tertiary text: #9CA3AF
- Inverse text: #FFFFFF

### Spacing (8px base unit)

- 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

### Border Radius

- Small: 4px (badges)
- Medium: 8px (buttons, inputs, cards)
- Large: 12px (large cards, modals)
- Full: 9999px (pills, status badges)

### Shadows

- Small: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)
- Medium: 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)
- Large: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)
- Extra Large: 0 20px 25px rgba(0,0,0,0.1), 0 8px 10px rgba(0,0,0,0.04)

**Focus Ring**: 3px solid ring with 20% opacity of element color, 2px offset

---

## 📐 LAYOUT STRUCTURE

### Desktop Layout (1440px viewport)

```
┌──────────────────────────────────────────────────────────────────┐
│  Top Navigation Bar (64px height, white bg, shadow-sm)          │
├──────────┬───────────────────────────────────────────────────────┤
│          │                                                       │
│ Sidebar  │              Main Content Area                        │
│ (240px)  │           (padding: 32px, bg: gray-50)                │
│          │                                                       │
│ bg:white │                                                       │
│ border-r │                                                       │
│          │                                                       │
│          │                                                       │
└──────────┴───────────────────────────────────────────────────────┘
```

### Tablet Layout (768px viewport)

- Collapsible sidebar (icon only when collapsed)
- Two-column card grid
- Adjusted padding (24px)

### Mobile Layout (375px viewport)

- Hamburger menu (sidebar becomes overlay)
- Single column layout
- Touch-friendly targets (44px minimum)
- Bottom navigation bar option

---

## 🖼️ SCREEN SPECIFICATIONS

### SCREEN 1: Main Dashboard (Analysis Queue)

**Layout**: Sidebar + Main content area

**Top Navigation (64px height)**:
- Left: bkrptr logo (custom text, 24px, bold, primary-500)
- Center: Empty
- Right:
  - Notifications icon (bell, 20px, gray-500)
  - User avatar (32px circle, initials "MP")
  - Dropdown caret

**Sidebar Navigation (240px width)**:
- Background: white
- Border right: 1px solid gray-200
- Padding: 24px 16px

Items (with icons on left, 20px size):
1. 📊 **Dashboard** (active state: bg-primary-50, text-primary-700, border-l-4 primary-500)
2. ➕ **New Analysis**
3. 📚 **Analyses**
4. 🔑 **API Keys**
5. 📖 **API Docs**
6. ⚙️ **Settings**

Bottom of sidebar:
- Divider line (gray-200)
- Usage summary card:
  - "This month"
  - "$12.45 / $50.00" (progress bar below, green)
  - "48 analyses"

**Main Content Area**:

**Page Header**:
- Heading: "Dashboard" (30px, bold, gray-900)
- Subtitle: "Manage your book analyses" (16px, gray-500)
- Right side: Button "New Analysis" (primary blue, with + icon)
- Margin bottom: 32px

**Stats Cards Row** (3 cards, equal width, gap: 24px):

Card 1 - Processing:
- Background: white
- Padding: 24px
- Border: 1px gray-200
- Border-radius: 12px
- Shadow: shadow-sm
- Icon: ⏳ (32px, in amber-100 circle, 48px)
- Label: "Processing" (14px, gray-500)
- Value: "12" (30px, bold, gray-900)
- Subtext: "5 batch • 7 expedited" (12px, gray-400)

Card 2 - Completed:
- Icon: ✓ (green-100 circle)
- Label: "Completed"
- Value: "156"
- Subtext: "This month: 48"

Card 3 - Cost Savings:
- Icon: 💰 (green-100 circle)
- Label: "Cost Savings"
- Value: "$127.50"
- Subtext: "Using batch mode"

**Filter/Search Bar** (margin-top: 32px):
- Left: Search input (icon + "Search books..." placeholder, 320px width)
- Right: Filter buttons:
  - "All" (active: bg-gray-100)
  - "Processing" (count badge: 12)
  - "Completed" (count badge: 156)
  - "Failed" (count badge: 2)

**Analysis Cards List** (margin-top: 24px, gap: 16px):

**Card Example 1 - Processing Batch**:
- Background: white
- Padding: 24px
- Border: 1px solid gray-200
- Border-radius: 12px
- Shadow: shadow-sm
- Hover: border-gray-300, shadow-md

Layout:
```
┌────────────────────────────────────────────────────────┐
│ 📚 Atomic Habits                    [Batch Processing] │ ← Badge: green-100 bg, green-700 text
│     by James Clear                           $0.03     │
│     Business • Self-help                               │
│                                                        │
│ [Progress Bar: 65%] ▓▓▓▓▓▓▓░░░                       │ ← Green bar
│                                                        │
│ ⏰ Submitted: 18 hours ago                            │
│ ⏱️ Est. completion: 6 hours                           │
│                                                        │
│ [View Details] [Expedite → $0.03] [Cancel]           │
│  ^gray btn      ^amber btn          ^text link        │
└────────────────────────────────────────────────────────┘
```

**Card Example 2 - Processing Expedited**:
Same layout but:
- Badge: amber-100 bg, amber-700 text "Expedited Processing"
- Progress bar: amber-500
- Cost: "$0.06"
- Est. completion: "4 minutes"
- Actions: [View Details] [Cancel] (no expedite option)

**Card Example 3 - Completed**:
- Badge: green-100 bg, green-700 text "Completed"
- No progress bar
- Timestamp: "Completed 2 hours ago"
- Actions: [View Analysis] [Download ↓] [Share]

**Card Example 4 - Failed**:
- Badge: red-100 bg, red-700 text "Failed"
- Error message: "⚠️ API error: Rate limit exceeded"
- Actions: [Retry] [View Details] [Delete]

---

### SCREEN 2: New Analysis Form

**Page Header**:
- Back arrow ← "New Analysis" (30px, bold)
- Subtitle: "Submit a book for AI-powered analysis"

**Form Layout** (max-width: 720px, centered):

**Section 1: Book Details**
- Heading: "Book Details" (20px, semibold)
- Margin-bottom: 24px

Fields:
1. **Title** (required red asterisk)
   - Label: 14px, medium
   - Input: full width, 16px text, 10px padding, border gray-300
   - Placeholder: "e.g., Atomic Habits"

2. **Author** (required)
   - Input with placeholder: "e.g., James Clear"

3. **ISBN** (optional)
   - Input with placeholder: "e.g., 978-0735211292"
   - Helper text: "Optional - helps with metadata accuracy" (12px, gray-500)

4. **Genre** (dropdown)
   - Options: Business, Self-help, Biography, Technology, Fiction, Non-fiction, Science, History
   - Auto-suggest as user types

5. **Target Audience** (dropdown)
   - Options: General, Business Professionals, Students, Technical, Leadership

**Section 2: Processing Options** (margin-top: 40px)
- Heading: "Processing Options" (20px, semibold)

**Processing Mode Selector** (important visual distinction):

Two large option cards side-by-side:

**Batch Mode Card (LEFT - DEFAULT, green accent)**:
```
┌──────────────────────────────────────┐
│ ● Batch Processing        [SELECTED] │ ← Radio selected, green-500
│                                      │
│ 💰 $0.03 per book                    │ ← 24px, semibold
│ ⏱️ ~24 hours                         │ ← 16px
│ 🌱 50% cost savings                  │
│                                      │
│ Best for: Regular reading lists     │
│                                      │
│ [Border: 2px solid green-500]       │
│ [Background: green-50]              │
└──────────────────────────────────────┘
```

**Expedited Mode Card (RIGHT - amber accent)**:
```
┌──────────────────────────────────────┐
│ ○ Expedited Processing               │ ← Radio unselected
│                                      │
│ ⚡ $0.06 per book                     │ ← 24px, semibold
│ ⏱️ ~9 minutes                         │ ← 16px
│ 🚀 Priority processing               │
│                                      │
│ Best for: Urgent needs              │
│                                      │
│ [Border: 1px solid gray-300]        │
│ [Background: white]                 │
└──────────────────────────────────────┘
```

When expedited is selected:
- Border: 2px solid amber-500
- Background: amber-50

**Analysis Depth** (dropdown below):
- Options: Quick, Standard (default), Comprehensive
- Each option shows estimated time

**Section 3: Additional Context** (optional, margin-top: 24px)
- Textarea (100px min-height)
- Placeholder: "Any specific aspects you'd like the analysis to focus on? (optional)"

**Cost Preview Card** (margin-top: 32px):
```
┌────────────────────────────────────────────────┐
│                 Cost Estimate                  │
│                                                │
│  Analysis type: Standard                       │
│  Processing: Batch                             │
│  Cost per book: $0.03                          │
│  ────────────────────────────────              │
│  Total: $0.03                                  │
│                                                │
│  💡 Save $0.03 with batch processing          │ ← Green text
└────────────────────────────────────────────────┘
```

**Action Buttons** (margin-top: 32px):
- [Cancel] (secondary, left)
- [Submit Analysis] (primary blue, right) ← disabled until required fields filled

---

### SCREEN 3: Analysis Detail View

**Breadcrumb**: Dashboard > Analyses > Atomic Habits

**Page Header**:
- Book title: "Atomic Habits" (30px, bold)
- Author: "by James Clear" (18px, gray-500)
- Genre tag: [Business] [Self-help] (small pills, gray-100)

**Status Banner** (full width, colored bg):

If Processing Batch (green-50 bg, green-700 text):
```
┌─────────────────────────────────────────────────────────┐
│ ⏳ Batch Processing                                     │
│                                                         │
│ [Progress Bar 65%] ▓▓▓▓▓▓▓░░░                         │
│                                                         │
│ Started: 18 hours ago                                  │
│ Estimated completion: 6 hours                          │
│                                                         │
│ [Expedite to Priority ($0.03 more)]  [Cancel]         │
└─────────────────────────────────────────────────────────┘
```

If Processing Expedited (amber-50 bg):
- Same layout, amber colors
- "Estimated completion: 4 minutes"

If Completed (green-50 bg):
```
┌─────────────────────────────────────────────────────────┐
│ ✓ Analysis Complete                                    │
│                                                         │
│ Completed: 2 hours ago                                 │
│ Processing time: 22 hours 15 minutes                   │
│ Cost: $0.03                                            │
└─────────────────────────────────────────────────────────┘
```

**Documents Section** (margin-top: 32px):

Heading: "Analysis Documents" (24px, semibold)

4 Document Cards (2x2 grid on desktop, gap: 24px):

**Card: MADHO Summary** (primary output):
```
┌────────────────────────────────────┐
│ 📄 MADHO Summary            [⭐]   │ ← Star badge
│                                    │
│ Personal, actionable breakdown    │ ← 14px, gray-500
│                                    │
│ 📊 2,450 words • 8 min read       │
│                                    │
│ [View] [Download ↓]               │
└────────────────────────────────────┘
```

**Card: Detailed Analysis**:
- 📄 icon
- "Detailed Analysis"
- "Comprehensive chapter breakdown"
- "12,800 words • 35 min read"
- [View] [Download]

**Card: Executive Summary**:
- 📊 icon
- "Executive Summary"
- "High-level strategic insights"
- "1,200 words • 4 min read"

**Card: Quick Reference**:
- ⚡ icon
- "Quick Reference"
- "Key frameworks & checklists"
- "800 words • 2 min read"

**Metadata Section** (margin-top: 32px):
- Submitted by: "you"
- Submitted at: "Oct 17, 2025 at 2:34 PM"
- Processing mode: "Batch" (green pill)
- Analysis depth: "Standard"
- Total cost: "$0.03"

**Actions** (margin-top: 24px):
- [Download All (ZIP)] (secondary button)
- [Share] (secondary button)
- [Delete Analysis] (text link, red-600)

---

### SCREEN 4: Expedite Modal (Overlay)

**Modal Overlay**: rgba(0, 0, 0, 0.5)

**Modal Box**:
- Width: 500px
- Background: white
- Border-radius: 12px
- Shadow: extra large
- Padding: 32px

**Header**:
- Icon: ⚡ (amber-500, 40px)
- Title: "Expedite to Priority Processing" (24px, semibold)
- Close X (top right)

**Body**:

**Cost Comparison Table**:
```
┌─────────────────┬─────────────┬─────────────┐
│                 │ Batch       │ Expedited   │
├─────────────────┼─────────────┼─────────────┤
│ Processing time │ ~24 hours   │ ~9 minutes  │
│ Cost            │ $0.03       │ $0.06       │
│ Priority        │ Standard    │ High        │
└─────────────────┴─────────────┴─────────────┘
```

**Highlight Box** (amber-50 bg, padding: 16px, border-radius: 8px):
```
⚡ Upgrade to Expedited Processing

Additional cost: +$0.03
New estimated completion: 9 minutes
You'll be notified when complete
```

**Note** (gray-500, 14px):
"This will move your analysis to the priority queue. Processing will begin immediately."

**Footer Buttons**:
- [Cancel] (secondary, left)
- [Expedite for $0.03] (amber button, right)

---

### SCREEN 5: API Keys Management

**Page Header**:
- Title: "API Keys" (30px, bold)
- Subtitle: "Manage API keys for programmatic access"
- Button: [Create New Key] (primary blue)

**Info Banner** (blue-50 bg, blue-700 text, padding: 16px, border-radius: 8px):
```
ℹ️ API keys allow you to integrate bkrptr with your applications.
Keep your keys secure and never share them publicly.
[View API Documentation →]
```

**Keys List** (margin-top: 32px):

**Key Card**:
```
┌──────────────────────────────────────────────────────────┐
│ 🔑 Production LMS Integration                            │
│                                                          │
│ Key: bkrptr_live_k3x9mP2n...gH2j  [Copy]               │ ← Masked, gray mono font
│                                                          │
│ Created: Oct 10, 2025                                   │
│ Last used: 2 hours ago                                  │
│ Requests this month: 1,247                              │
│                                                          │
│ Permissions: ● Read  ● Write  ○ Expedite  ○ Admin      │ ← Green checkmarks
│                                                          │
│ [View Usage] [Rotate Key] [Revoke]                     │
│                      ^gray btn    ^red text             │
└──────────────────────────────────────────────────────────┘
```

Multiple key cards with different statuses:
- Active (normal)
- Revoked (red badge, grayed out)
- Never used (gray badge)

**Empty State** (if no keys):
```
┌────────────────────────────────────┐
│          🔑                         │
│                                    │
│    No API Keys Yet                 │
│                                    │
│  Create your first API key to     │
│  integrate bkrptr with your apps  │
│                                    │
│  [Create Your First Key]          │
└────────────────────────────────────┘
```

---

### SCREEN 6: Bulk Upload (CSV)

**Page Header**:
- Title: "Bulk Upload" (30px, bold)
- Subtitle: "Upload multiple books at once via CSV"

**Upload Area**:
```
┌──────────────────────────────────────────────┐
│                                              │
│              📁 (48px icon)                  │
│                                              │
│      Drag and drop CSV file here            │
│           or click to browse                 │
│                                              │
│  Supported format: CSV (max 10MB)           │
│  Up to 1,000 books per upload               │
│                                              │
│          [Browse Files]                      │
│                                              │
└──────────────────────────────────────────────┘
```

Border: 2px dashed gray-300
Hover: border blue-500
Padding: 64px

**Download Template Link** (below upload):
"📥 Download CSV template with example data"

**After File Selected**:

Preview table showing first 5 rows:
```
┌─────────────────────┬──────────────┬──────────┬──────────┐
│ Title               │ Author       │ Genre    │ Audience │
├─────────────────────┼──────────────┼──────────┼──────────┤
│ Atomic Habits       │ James Clear  │ Business │ General  │
│ Deep Work           │ Cal Newport  │ Business │ Business │
│ ...                 │              │          │          │
└─────────────────────┴──────────────┴──────────┴──────────┘
```

**Validation Messages**:
✓ "25 valid books found"
⚠️ "2 rows have missing required fields (highlighted in yellow)"

**Settings**:
- Processing mode: [Batch ●] [Expedited ○]
- Analysis depth: [Standard ▼]

**Cost Summary**:
```
┌────────────────────────────────────┐
│  25 books × $0.03 = $0.75         │
│  Estimated completion: 24 hours   │
│                                    │
│  💡 Save $0.75 with batch mode    │
└────────────────────────────────────┘
```

**Actions**:
- [Cancel]
- [Submit 25 Books] (primary, shows count)

---

## 🎭 COMPONENT STATES

### Button States

**Primary Button**:
- Default: bg-blue-500, shadow-sm
- Hover: bg-blue-600, shadow-md
- Active: bg-blue-700, shadow-xs, translateY(1px)
- Focus: 3px ring blue-500/20
- Disabled: bg-gray-300, text-gray-500, no shadow

**Batch Button (Green)**:
- Default: bg-green-500
- Hover: bg-green-600
- Active: bg-green-700
- Focus: 3px ring green-500/20

**Expedite Button (Amber)**:
- Default: bg-amber-500
- Hover: bg-amber-600
- Active: bg-amber-700
- Focus: 3px ring amber-500/20

### Input States

- Default: border-gray-300
- Hover: border-gray-400
- Focus: border-blue-500, 3px ring blue-500/20
- Error: border-red-500, 3px ring red-500/20
- Disabled: bg-gray-100, text-gray-500

### Card States

- Default: border-gray-200, shadow-sm
- Hover: border-gray-300, shadow-md
- Active/Selected: border-blue-500 2px

---

## 📱 RESPONSIVE BREAKPOINTS

### Desktop (1440px) - Default shown above

### Tablet (768px)
- Sidebar: Collapsible (shows icons only when collapsed)
- Stats cards: 3 across → 2 across, third wraps
- Analysis cards: Full width
- Form: Max-width 100%, padding reduced to 24px
- Modal: Width 90vw max

### Mobile (375px)
- Sidebar: Hamburger menu (slides from left)
- Top nav: Logo left, hamburger right, user menu in hamburger
- Stats cards: Stack vertically
- Analysis cards:
  - Compact layout
  - Actions stack vertically
  - Hide secondary metadata
- Form inputs: Full width, larger touch targets (44px min)
- Processing mode cards: Stack vertically
- Bottom fixed action bar for forms

---

## 🎬 INTERACTIONS & ANIMATIONS

### Page Transitions
- Duration: 250ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

### Button Interactions
- Hover: 150ms background/shadow transition
- Active: Slight translateY(1px) with reduced shadow

### Card Interactions
- Hover: 150ms border/shadow transition
- Click: Navigate to detail view

### Modal Interactions
- Enter: Fade in overlay (250ms), scale modal from 0.95 to 1
- Exit: Reverse animation
- Backdrop click: Close modal

### Progress Bar
- Width transition: 300ms ease

### Loading States
- Skeleton screens with shimmer effect (gray-100 → gray-200 → gray-100, 1.5s loop)
- Spinner: Rotating circle, blue-500, 24px

### Toast Notifications
- Slide in from top-right
- Auto-dismiss after 5 seconds
- Success: green-500, Error: red-500, Info: blue-500

---

## 📊 SAMPLE DATA FOR PROTOTYPE

### Books in Queue

**Processing Batch (3 items)**:
1. "Atomic Habits" by James Clear - 65% complete - $0.03
2. "Deep Work" by Cal Newport - 30% complete - $0.03
3. "Thinking, Fast and Slow" by Daniel Kahneman - 15% complete - $0.03

**Processing Expedited (2 items)**:
4. "Good to Great" by Jim Collins - 80% complete - 4 min remaining - $0.06
5. "The Hard Thing About Hard Things" by Ben Horowitz - 45% complete - 6 min remaining - $0.06

**Completed (5 items)**:
6. "Zero to One" by Peter Thiel - Completed 2 hours ago - $0.03
7. "The Lean Startup" by Eric Ries - Completed 5 hours ago - $0.06
8. "Sapiens" by Yuval Noah Harari - Completed 1 day ago - $0.03
9. "Educated" by Tara Westover - Completed 2 days ago - $0.03
10. "The Art of War" by Sun Tzu - Completed 3 days ago - $0.03

**Failed (1 item)**:
11. "Shoe Dog" by Phil Knight - Failed 1 hour ago - "API rate limit exceeded"

### User Info
- Name: "Madho Patel"
- Avatar: "MP" initials
- Email: "madho@example.com"
- Usage: $12.45 / $50.00 monthly budget
- Analyses this month: 48

---

## ♿ ACCESSIBILITY REQUIREMENTS

### WCAG 2.1 AA Compliance

**Color Contrast**:
- All text meets 4.5:1 minimum (normal text)
- Large text meets 3:1 minimum
- Interactive elements meet 3:1 minimum

**Keyboard Navigation**:
- All interactive elements focusable
- Logical tab order
- Visible focus indicators (3px ring)
- Skip to main content link
- Esc key closes modals

**Screen Readers**:
- Semantic HTML elements (<nav>, <main>, <article>)
- ARIA labels for icons
- ARIA live regions for status updates
- Descriptive link text (no "click here")

**Touch Targets**:
- Minimum 44x44px on mobile
- Adequate spacing between targets

---

## 🎯 DESIGN PRIORITIES

### Critical Visual Distinctions

1. **Batch vs Expedited** MUST be immediately obvious:
   - Batch = Green everywhere (badges, progress, buttons)
   - Expedited = Amber everywhere (badges, progress, buttons)
   - Never mix these colors

2. **Status Clarity**:
   - Color-coded badges
   - Progress bars for processing
   - Clear timestamps and ETAs

3. **Cost Transparency**:
   - Always show costs
   - Highlight savings with green
   - Show comparisons side-by-side

4. **Progressive Disclosure**:
   - Common actions prominent
   - Advanced features in menus
   - Details expand on demand

---

## 🔗 INTERACTIVE PROTOTYPE FLOWS

### Flow 1: Submit New Book (Batch)
1. Dashboard → Click "New Analysis" button
2. Form appears → Fill in: "Atomic Habits", "James Clear"
3. Genre auto-suggests → Select "Business"
4. Batch mode selected by default (green card highlighted)
5. Cost shows "$0.03"
6. Click "Submit Analysis" → Success toast appears
7. Redirect to Dashboard → New card appears at top with "Pending" status

### Flow 2: Expedite Pending Analysis
1. Dashboard → Find pending batch analysis card
2. Click "Expedite" button on card → Modal opens
3. Modal shows cost comparison table
4. Click "Expedite for $0.03" → Modal closes
5. Card updates: badge changes to amber "Expedited Processing"
6. Progress bar changes to amber
7. ETA updates to "9 minutes"
8. Toast: "Analysis upgraded to expedited processing"

### Flow 3: View Completed Analysis
1. Dashboard → Click on completed analysis card
2. Navigate to detail view
3. See 4 document cards
4. Click "View" on "MADHO Summary"
5. Document opens in new view with markdown rendering
6. Back arrow returns to detail view

### Flow 4: Bulk Upload
1. Dashboard → Click "New Analysis" → Select "Bulk Upload"
2. Bulk upload page appears
3. Drag CSV file onto upload area
4. Preview table appears showing 25 books
5. Validation: "✓ 25 valid books found"
6. Batch mode selected, cost shows "$0.75"
7. Click "Submit 25 Books"
8. Success message, redirect to Dashboard
9. 25 new cards appear in queue

### Flow 5: Create API Key
1. Sidebar → Click "API Keys"
2. Empty state (if first time) or list of keys
3. Click "Create New Key" → Modal opens
4. Form: Name: "Production LMS", Permissions: Read + Write
5. Click "Create Key" → New key displayed (only once)
6. Copy button highlighted
7. Toast: "Key created. Copy now - won't be shown again"
8. Key card appears in list

---

## 📦 DELIVERABLE SPECIFICATIONS

### Figma File Structure

**Pages**:
1. 🎨 Design System (all components, color swatches, typography)
2. 🖥️ Desktop Screens (1440px artboards)
3. 📱 Tablet Screens (768px artboards)
4. 📱 Mobile Screens (375px artboards)
5. 🎭 Component States (all variations)
6. 🔗 Interactive Prototype (linked flows)

**Components to Create**:
- Button (Primary, Secondary, Batch, Expedite with all states)
- Status Badge (Pending, Processing Batch, Processing Expedited, Completed, Failed)
- Progress Bar (Batch green, Expedited amber)
- Analysis Card (all status variations)
- Form Input (Text, Select, Textarea with states)
- Modal (base component)
- Navigation (Sidebar, Top Nav)
- Document Card
- Stats Card
- Cost Display
- Empty State
- Error State

**Auto-layout**:
- Use auto-layout for all components
- Properly constrained for responsiveness
- Spacing tokens used consistently

**Typography Styles**:
- Heading 1, 2, 3
- Body Large, Base, Small
- Label, Caption
- All with proper line-height and letter-spacing

**Color Styles**:
- All colors from design system as styles
- Named semantically (primary-500, batch-500, etc.)

**Effects**:
- Shadow Small, Medium, Large, XL
- Focus rings for each color

---

## ✅ QUALITY CHECKLIST

Before considering prototype complete, verify:

- [ ] All 6 main screens designed (Dashboard, New Analysis, Detail View, Expedite Modal, API Keys, Bulk Upload)
- [ ] All component states shown (default, hover, active, focus, disabled)
- [ ] Responsive layouts for 3 breakpoints (desktop, tablet, mobile)
- [ ] Interactive prototype flows work (5 flows minimum)
- [ ] Color system implemented exactly (blue, green, amber, grays)
- [ ] Typography scale correct (12px to 36px)
- [ ] Spacing consistent (8px base grid)
- [ ] All interactive elements have focus states
- [ ] Status badges color-coded correctly (green=batch, amber=expedited)
- [ ] Cost information visible and accurate
- [ ] Progress bars animated
- [ ] Real book titles used (not lorem ipsum)
- [ ] Accessibility contrast ratios met
- [ ] Shadows and border radius consistent
- [ ] Icons from Heroicons library
- [ ] Empty states and error states included

---

## 🎨 FINAL NOTES

### Design Intent

This is a **production-ready prototype** meant to be handed directly to developers. Every pixel matters. Every interaction should feel polished. The visual distinction between Batch (green/economy) and Expedited (amber/premium) is CRITICAL - users must instantly understand the difference.

### Brand Voice

Professional but approachable. Intelligent but not intimidating. Cost-transparent and user-first. Think: "Stripe meets notion meets Superhuman" - clean, modern, purposeful.

### Success Criteria

A non-technical user should be able to:
1. Submit a book for analysis in under 60 seconds
2. Understand the cost difference between batch and expedited immediately
3. Monitor processing status at a glance
4. Access completed analyses with 1 click

---

**This prompt is complete and ready for Figma Make. Generate the full prototype with all screens, components, states, and interactions as specified above.**

