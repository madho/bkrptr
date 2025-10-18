# Figma Make Prompt - Usage Guide

## How to Use This Prompt for Production-Ready Prototypes

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Understanding the Prompt Structure](#understanding-the-prompt-structure)
3. [Step-by-Step Usage Instructions](#step-by-step-usage-instructions)
4. [Expected Output](#expected-output)
5. [Iteration & Refinement](#iteration--refinement)
6. [Troubleshooting](#troubleshooting)
7. [Developer Handoff](#developer-handoff)

---

## 🚀 Quick Start

### Prerequisites

- Access to Figma Make (AI design generation tool)
- The complete prompt from `FIGMA-MAKE-PROMPT.md`
- 15-30 minutes for initial generation
- Understanding of bkrptr product (see PRD)

### 3-Step Quick Start

1. **Copy the entire prompt** from `FIGMA-MAKE-PROMPT.md`
2. **Paste into Figma Make** interface
3. **Click Generate** and wait for results

That's it! The prompt is designed to be comprehensive and self-contained.

---

## 📖 Understanding the Prompt Structure

The prompt is organized into **15 major sections**, each serving a specific purpose:

### Section Breakdown

#### 1. Product Context (🎯)
**Purpose**: Establishes what bkrptr is and why design decisions matter

**Key Elements**:
- Product description
- Two processing modes (Batch/Expedited)
- Target users
- Value proposition

**Why It Matters**: Figma Make needs business context to make intelligent design decisions

---

#### 2. Design System Foundation (🎨)
**Purpose**: Provides exact color codes, typography, spacing - the visual DNA

**Key Elements**:
- **Color Palette**: Exact hex codes for all colors
  - Primary (Blue): #0EA5E9
  - Batch (Green): #22C55E ← Critical for cost-effective branding
  - Expedited (Amber): #F59E0B ← Critical for premium branding
  - Semantic colors (success, error, warning, info)
  - Full gray scale (50-900)

- **Typography**: Font families, sizes, weights, line-heights
  - System fonts for performance
  - 8 size scale (12px - 36px)
  - 4 weight options (400-700)

- **Spacing**: 8px base grid (4px - 96px)

- **Border Radius**: 4 options (4px - 9999px for pills)

- **Shadows**: 4 elevation levels + focus rings

**Why It Matters**: These exact values ensure pixel-perfect implementation. Colors are semantic - green ALWAYS means batch/economy, amber ALWAYS means expedited/premium.

---

#### 3. Layout Structure (📐)
**Purpose**: Defines the overall dashboard architecture

**Key Elements**:
- Desktop: Sidebar (240px) + Main content area
- Tablet: Collapsible sidebar
- Mobile: Hamburger menu + bottom nav

**Why It Matters**: Establishes information hierarchy and navigation patterns

---

#### 4. Screen Specifications (🖼️)
**Purpose**: Detailed wireframes for every screen

**Sections**:
- **Screen 1: Main Dashboard** - Analysis queue, stats cards, filter/search
- **Screen 2: New Analysis Form** - Book submission with processing mode selector
- **Screen 3: Analysis Detail View** - Individual book with documents
- **Screen 4: Expedite Modal** - Cost comparison overlay
- **Screen 5: API Keys Management** - Developer tools
- **Screen 6: Bulk Upload** - CSV batch submission

**Format**: ASCII art + detailed descriptions show exact layouts

**Why It Matters**: Removes all ambiguity about what goes where

---

#### 5. Component States (🎭)
**Purpose**: Every possible state of interactive elements

**Key Elements**:
- Button states: Default, Hover, Active, Focus, Disabled
- Input states: Default, Hover, Focus, Error, Disabled
- Card states: Default, Hover, Selected

**Why It Matters**: Users interact with states, not just static designs

---

#### 6. Responsive Breakpoints (📱)
**Purpose**: How design adapts across devices

**Breakpoints**:
- Desktop: 1440px (reference)
- Tablet: 768px
- Mobile: 375px

**Why It Matters**: Mobile-first is critical for busy executives on-the-go

---

#### 7. Interactions & Animations (🎬)
**Purpose**: Motion design and micro-interactions

**Key Elements**:
- Transition durations (150ms - 350ms)
- Easing functions
- Loading states
- Toast notifications

**Why It Matters**: Polished feel comes from thoughtful motion

---

#### 8. Sample Data (📊)
**Purpose**: Real, believable content for prototype

**Key Elements**:
- 11 book titles with real authors
- Mixed processing states
- Realistic timestamps and costs
- User: "Madho Patel" with usage data

**Why It Matters**: Lorem ipsum kills believability. Real data sells the vision.

---

#### 9. Accessibility (♿)
**Purpose**: WCAG 2.1 AA compliance requirements

**Key Elements**:
- Color contrast ratios
- Keyboard navigation
- Screen reader support
- Touch target sizes (44px min on mobile)

**Why It Matters**: Legal compliance + better UX for everyone

---

#### 10. Design Priorities (🎯)
**Purpose**: Non-negotiable visual requirements

**Critical Distinctions**:
1. **Batch vs Expedited** - Green vs Amber, always
2. **Status Clarity** - Color-coded, obvious
3. **Cost Transparency** - Always visible
4. **Progressive Disclosure** - Simple to advanced

**Why It Matters**: These are the product differentiators

---

#### 11. Interactive Flows (🔗)
**Purpose**: Step-by-step user journeys

**5 Flows Defined**:
1. Submit new book (batch)
2. Expedite pending analysis
3. View completed analysis
4. Bulk upload
5. Create API key

**Why It Matters**: Prototype must demonstrate actual usage patterns

---

#### 12. Deliverable Specifications (📦)
**Purpose**: Exact Figma file structure

**Key Elements**:
- 6 pages (Design System, Desktop, Tablet, Mobile, States, Prototype)
- Component library
- Auto-layout requirements
- Typography/color styles

**Why It Matters**: Organized files = reusable components = faster development

---

#### 13. Quality Checklist (✅)
**Purpose**: Verification before calling it "done"

**23 Checkpoints** covering:
- Screen completeness
- State coverage
- Responsiveness
- Accessibility
- Brand consistency

**Why It Matters**: Professional deliverable standard

---

#### 14. Final Notes (🎨)
**Purpose**: Design philosophy and success criteria

**Key Points**:
- Production-ready expectation
- Brand voice
- User success criteria (< 60 seconds to submit book)

**Why It Matters**: Sets quality bar high

---

## 🎯 Step-by-Step Usage Instructions

### Method 1: Full Prompt (Recommended)

**Step 1: Prepare**
1. Open `FIGMA-MAKE-PROMPT.md`
2. Review the prompt to understand scope
3. Note any customizations needed (e.g., brand colors, company name)

**Step 2: Copy Prompt**
```
1. Select ALL text from "# FIGMA MAKE PROMPT: bkrptr Web Dashboard"
2. Copy to clipboard (Cmd+C / Ctrl+C)
3. Prompt is ~12,000 words - that's intentional
```

**Step 3: Paste into Figma Make**
1. Open Figma Make interface
2. Create new design project
3. Paste entire prompt into input field
4. **Do not edit or summarize** - the length provides necessary detail

**Step 4: Generate**
1. Click "Generate Design" (or equivalent)
2. Wait 5-15 minutes for initial generation
3. Figma Make will create:
   - Design system
   - All 6 screens
   - Component library
   - Responsive layouts

**Step 5: Review**
1. Check against quality checklist (Section 13 of prompt)
2. Verify critical distinctions:
   - ✓ Batch processing = GREEN
   - ✓ Expedited processing = AMBER
   - ✓ All screens present
   - ✓ Interactive flows work

---

### Method 2: Iterative Approach (If Tool Has Limits)

Some AI design tools have input length limits. If needed:

**Iteration 1: Design System + Components**
```
Use sections:
- Product Context
- Design System Foundation
- Component Library
- Component States

Output: Complete component library with all states
```

**Iteration 2: Main Screens (Desktop)**
```
Reference: "Use design system from previous iteration"

Use sections:
- Screen 1: Dashboard
- Screen 2: New Analysis Form
- Screen 3: Detail View

Output: 3 core screens at desktop breakpoint
```

**Iteration 3: Secondary Screens + Responsive**
```
Use sections:
- Screen 4: Expedite Modal
- Screen 5: API Keys
- Screen 6: Bulk Upload
- Responsive Breakpoints

Output: Complete screen set + tablet/mobile versions
```

**Iteration 4: Interactions + Polish**
```
Use sections:
- Interactions & Animations
- Interactive Flows
- Sample Data

Output: Linked prototype with real data
```

---

### Method 3: Screen-by-Screen (Maximum Control)

For fine-tuned control, generate each screen individually:

**Template for Individual Screens**:
```
Context: [Copy Product Context section]
Design System: [Copy entire Design System Foundation]
Screen to Generate: [Copy specific screen section]
Sample Data: [Copy relevant data]

Generate: [Screen name] with all component states
```

**Example: Dashboard Only**
```
[Product Context]
[Design System Foundation]
[Screen 1: Main Dashboard specification]
[Sample Data for 11 books]

Generate the main dashboard with sidebar navigation, stats cards,
and analysis queue showing all processing states.
```

---

## 📤 Expected Output

### What You Should Receive

#### 1. Figma File with Pages

**Page 1: Design System**
- Color swatches (all design tokens)
- Typography examples (all 8 sizes)
- Component library:
  - Buttons (4 types × 5 states = 20 variants)
  - Badges (5 status types)
  - Progress bars (2 colors)
  - Form elements (3 types × 4 states)
  - Cards (4 types)
  - Modals
  - Navigation

**Page 2: Desktop Screens (1440px)**
- Dashboard
- New Analysis Form
- Analysis Detail View
- API Keys Management
- Bulk Upload
- Expedite Modal (overlay)

**Page 3: Tablet Screens (768px)**
- All screens adapted for tablet
- Collapsible sidebar
- Adjusted grid (2-column)

**Page 4: Mobile Screens (375px)**
- All screens for mobile
- Hamburger menu
- Single column
- Stacked layouts

**Page 5: Component States**
- Every component with all states visible
- Before/after interactions
- Error states
- Empty states

**Page 6: Interactive Prototype**
- Linked flows (5 flows working)
- Clickable hotspots
- Transitions configured
- Sample user journey

---

#### 2. Component Organization

**Components Panel Structure**:
```
📁 Buttons
  ├─ Primary
  │  ├─ Default
  │  ├─ Hover
  │  ├─ Active
  │  ├─ Focus
  │  └─ Disabled
  ├─ Secondary
  ├─ Batch (Green)
  └─ Expedite (Amber)

📁 Badges
  ├─ Pending
  ├─ Processing Batch
  ├─ Processing Expedited
  ├─ Completed
  └─ Failed

📁 Cards
  ├─ Analysis Card
  ├─ Stats Card
  ├─ Document Card
  └─ Cost Display

📁 Forms
  ├─ Input
  ├─ Select
  ├─ Textarea
  └─ Label

📁 Navigation
  ├─ Sidebar
  ├─ Top Nav
  └─ Mobile Menu
```

---

#### 3. Color & Typography Styles

**Color Styles** (should have 50+ styles):
- Primary/50 through Primary/900
- Batch/50 through Batch/900
- Expedite/50 through Expedite/900
- Gray/50 through Gray/900
- Success, Error, Warning, Info

**Typography Styles** (should have 12+ styles):
- Heading/H1, H2, H3
- Body/Large, Base, Small
- Label
- Caption
- All with proper line-height

---

## 🔄 Iteration & Refinement

### Common Refinement Prompts

After initial generation, you may need to refine:

#### Refinement 1: Adjust Color Intensity

**If colors too bright/dark**:
```
The batch green (#22C55E) feels too bright.
Reduce saturation by 15% while maintaining the "economy/cost-effective" vibe.
Update all batch-related components (badges, buttons, progress bars).
```

#### Refinement 2: Adjust Spacing

**If layout feels cramped**:
```
Increase spacing between analysis cards from 16px to 24px.
Increase card internal padding from 24px to 32px.
Maintain 8px base grid throughout.
```

#### Refinement 3: Enhance Specific Component

**If status badges need work**:
```
Current status badges:
- Too small (hard to read)
- Border not visible enough

Improvements:
- Increase font size from 12px to 13px
- Increase padding from 4px 12px to 6px 14px
- Make border 1.5px instead of 1px
- Increase border radius from full pill to 6px (slightly rounded rectangle)
```

#### Refinement 4: Add Missing State

**If component missing a state**:
```
The "Expedite" button is missing a loading state.

Add loading state:
- Background: amber-500 (same as default)
- Cursor: not-allowed
- Content: Replace text with spinner (20px, amber-700)
- Opacity: 0.7
```

#### Refinement 5: Improve Contrast

**If accessibility fails**:
```
The gray-500 text on white background has 4.2:1 contrast (fails WCAG AA for small text).

Change all secondary text color from gray-500 (#6B7280) to gray-600 (#4B5563).
Verify new contrast ratio is ≥ 4.5:1.
```

---

### Iteration Strategy

**First Pass**: Generate everything
**Second Pass**: Fix critical issues (colors, spacing, missing states)
**Third Pass**: Polish (micro-interactions, animations, edge cases)
**Fourth Pass**: Accessibility audit
**Final Pass**: Developer handoff preparation

---

## 🐛 Troubleshooting

### Problem: Colors Don't Match Spec

**Symptom**: Generated colors are close but not exact

**Solution**:
```
The primary blue should be exactly #0EA5E9, but generated design uses #1DA1F2.

Please update all instances of primary blue to #0EA5E9:
- Primary buttons
- Focus rings
- Links
- Primary-500 color style
- Logo text
```

---

### Problem: Layout Breaks on Tablet

**Symptom**: Tablet view looks squeezed or broken

**Solution**:
```
At 768px breakpoint, the 3-column stats cards don't fit.

Update tablet layout:
- Change stats cards from 3 columns to 2 columns
- Third card wraps to second row
- Maintain 24px gap between cards
- Cards should be equal width (calc(50% - 12px))
```

---

### Problem: Missing Interactive States

**Symptom**: Components only show default state

**Solution**:
```
Buttons need hover/active/focus states.

For each button type (Primary, Secondary, Batch, Expedite):
1. Create hover variant (darker background, elevated shadow)
2. Create active variant (darkest background, reduced shadow, 1px down)
3. Create focus variant (3px ring with 20% opacity)
4. Create disabled variant (gray background, no interactions)

Use component properties to switch between states.
```

---

### Problem: Sample Data is Generic

**Symptom**: Using "Book 1", "Book 2" instead of real titles

**Solution**:
```
Replace generic book titles with real examples from Section 8:

Use these 11 books:
1. "Atomic Habits" by James Clear
2. "Deep Work" by Cal Newport
3. "Thinking, Fast and Slow" by Daniel Kahneman
[... list all 11 ...]

Assign realistic statuses, costs, and timestamps as specified in sample data section.
```

---

### Problem: Responsive Breakpoints Don't Work

**Symptom**: Mobile looks like squished desktop

**Solution**:
```
Mobile layout (375px) needs complete redesign, not just scaling:

Changes required:
1. Sidebar → Hamburger menu (icon only, slides from left)
2. Stats cards → Stack vertically (full width)
3. Analysis cards → Compact layout:
   - Hide secondary metadata
   - Stack action buttons vertically
   - Reduce padding to 16px
4. Form → Full width inputs, larger touch targets (44px min)
5. Processing mode cards → Stack vertically instead of side-by-side
```

---

### Problem: Prototype Links Don't Work

**Symptom**: Clicking doesn't navigate between screens

**Solution**:
```
Set up prototype connections for these 5 flows:

Flow 1: Dashboard → New Analysis
- Hotspot: "New Analysis" button on dashboard
- Action: Navigate to "New Analysis Form" screen
- Transition: Slide from right, 250ms

Flow 2: Expedite Modal
- Hotspot: "Expedite" button on analysis card
- Action: Open overlay "Expedite Modal"
- Transition: Fade in + scale up, 250ms

[... specify all 5 flows ...]
```

---

## 🚀 Developer Handoff

### Preparing Design for Development

Once prototype is finalized, prepare for developer handoff:

#### Step 1: Organize Figma File

**Clean up**:
- Delete unused components
- Rename layers descriptively
- Group related elements
- Lock background layers
- Add comments for complex interactions

**Structure**:
```
📄 Pages
  ├─ 🎨 Design System (developer reference)
  ├─ 🖥️ Desktop Screens (primary specs)
  ├─ 📱 Tablet (responsive reference)
  ├─ 📱 Mobile (responsive reference)
  ├─ 🎭 Component States (implementation guide)
  └─ 🔗 Prototype (demo only)
```

#### Step 2: Create Developer Resources Page

Add new page: "Developer Handoff"

**Include**:
1. **Design Tokens Export**
   - CSS variables
   - JSON tokens file
   - Tailwind config

2. **Component Specifications**
   - Each component with measurements
   - State transition specs
   - Accessibility notes

3. **Responsive Breakpoints**
   - Exact pixel values
   - Grid specifications
   - Behavior notes

4. **Asset Export Guidelines**
   - Icon specifications
   - Image optimization
   - SVG preferences

#### Step 3: Export Design Tokens

**CSS Variables** (copy from UI-UX-DESIGN-SYSTEM.md):
```css
:root {
  /* Colors */
  --color-primary-500: #0EA5E9;
  --color-batch-500: #22C55E;
  --color-expedite-500: #F59E0B;

  /* Typography */
  --text-base: 16px;
  --font-medium: 500;

  /* Spacing */
  --space-4: 16px;
  --space-6: 24px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
}
```

**Tailwind Config** (if using Tailwind):
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1'
        },
        batch: {
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D'
        },
        expedite: {
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309'
        }
      }
    }
  }
}
```

#### Step 4: Annotate Interactions

For each interactive flow:
1. Screenshot the flow
2. Annotate with numbers/arrows
3. Add developer notes:
   ```
   Flow: Submit New Book

   1. Click "New Analysis" → Navigate to form
   2. Fill required fields → Enable submit button
   3. Select processing mode → Update cost display
   4. Submit → Show success toast, redirect to dashboard
   5. New card appears → Animate in from top

   Timing:
   - Navigation: 250ms slide
   - Button enable: immediate
   - Cost update: 150ms fade
   - Toast: 5s auto-dismiss
   - Card animation: 300ms ease-out
   ```

#### Step 5: Create Component Documentation

For each component, document:

**Example: Analysis Card**
```markdown
# Analysis Card Component

## Variants
- Processing Batch (green accent)
- Processing Expedited (amber accent)
- Completed (green badge)
- Failed (red badge)

## Props
- title: string
- author: string
- genre: string
- status: "pending" | "processing_batch" | "processing_expedited" | "completed" | "failed"
- progress: number (0-100) | null
- cost: number
- submittedAt: Date
- estimatedCompletion: Date | null

## States
- Default: border-gray-200, shadow-sm
- Hover: border-gray-300, shadow-md, cursor-pointer
- No disabled/active states

## Accessibility
- Card is <article> element
- Status badge has aria-label
- Progress bar has aria-valuenow, aria-valuemin, aria-valuemax
- Actions are <button> elements with clear labels

## Responsive
- Desktop: Full width, padding 24px
- Tablet: Same
- Mobile: Padding 16px, stack action buttons
```

#### Step 6: Export Assets

**Icons**:
- Export as SVG (individual files)
- Or use Heroicons library (preferred)

**Images** (if any):
- Export @1x, @2x, @3x for retina
- Optimize with ImageOptim or similar
- Provide WebP alternatives

**Logo**:
- SVG (vector)
- PNG @2x for raster contexts

#### Step 7: Create Handoff Document

**Handoff Checklist**:
```markdown
# bkrptr Dashboard - Design Handoff

## Figma File
- [x] Organized and labeled
- [x] Components in library
- [x] All states documented
- [x] Developer notes added

## Design Tokens
- [x] CSS variables exported
- [x] Tailwind config provided
- [x] Color styles documented

## Components
- [x] 15 components fully specified
- [x] All states shown
- [x] Accessibility notes included

## Screens
- [x] 6 screens completed
- [x] Desktop (1440px)
- [x] Tablet (768px)
- [x] Mobile (375px)

## Interactions
- [x] 5 flows documented
- [x] Timing specified
- [x] Transitions defined

## Assets
- [x] Icons exported/specified
- [x] Images optimized
- [x] Fonts identified (system fonts)

## Documentation
- [x] Component specs written
- [x] Responsive behavior documented
- [x] Accessibility requirements listed

## Next Steps
1. Dev reviews Figma file
2. Questions/clarifications meeting
3. Begin implementation (start with design system)
4. Design QA during development
```

---

## 📚 Related Documentation

- **PRD**: `/docs/PRD-Web-Dashboard-API.md` - Product requirements
- **User Stories**: `/docs/USER-STORIES.md` - Detailed user journeys
- **Design System**: `/docs/UI-UX-DESIGN-SYSTEM.md` - Complete design tokens
- **Figma Prompt**: `/docs/FIGMA-MAKE-PROMPT.md` - This prompt source

---

## 💡 Pro Tips

### Tip 1: Start with Design System
Always generate the design system first. Having components before screens ensures consistency.

### Tip 2: Use Real Data Early
Don't wait until the end to add real book titles. Sample data makes the design feel real and helps spot layout issues.

### Tip 3: Test Accessibility from Start
Don't treat accessibility as a final check. Build it in from the beginning by verifying color contrasts and focus states early.

### Tip 4: Prototype Early
Link screens as you build them. Finding navigation issues in prototype mode is much easier than reviewing static screens.

### Tip 5: Mobile is Not Desktop Squished
Design mobile layouts from scratch. If you just scale down desktop, you'll get poor UX.

### Tip 6: Document Decisions
When you make a design decision (e.g., "made this green to indicate savings"), add a comment in Figma. Future-you will thank you.

### Tip 7: Batch vs Expedited Distinction
This is THE most important visual in the entire app. If a user can't instantly tell the difference, the design has failed. Use green/amber religiously.

---

## 🎓 Learning Resources

### Understanding the Business Context
Read these in order:
1. PRD Executive Summary (5 min)
2. User Personas (10 min)
3. Key User Flows (15 min)
4. Full PRD (30 min)

### Design System Mastery
- Study the color system - understand WHY green=batch and amber=expedited
- Review typography scale - memorize common sizes (14px labels, 16px body, 20px headings)
- Learn spacing scale - 8px base grid makes math easy

### Figma Skills Needed
- **Component variants**: For button/badge states
- **Auto-layout**: For responsive components
- **Constraints**: For responsive screens
- **Prototype mode**: For interactive flows
- **Component properties**: For showing/hiding elements

---

## ✅ Success Checklist

Before considering the design "done":

**Completeness**:
- [ ] All 6 screens designed
- [ ] All 15+ components created
- [ ] All component states shown
- [ ] Responsive layouts for 3 breakpoints

**Quality**:
- [ ] Colors match spec exactly (verify hex codes)
- [ ] Typography uses correct sizes/weights
- [ ] Spacing follows 8px grid
- [ ] Shadows/borders consistent

**Functionality**:
- [ ] 5 interactive flows work in prototype mode
- [ ] Transitions feel polished (not too fast/slow)
- [ ] All buttons clickable
- [ ] Forms demonstrate input states

**Accessibility**:
- [ ] Color contrast ratios verified (use Stark plugin)
- [ ] Focus states visible on all interactive elements
- [ ] Touch targets ≥ 44px on mobile
- [ ] Semantic structure (proper heading hierarchy)

**Brand**:
- [ ] Batch processing ALWAYS uses green
- [ ] Expedited processing ALWAYS uses amber
- [ ] Primary actions use blue
- [ ] Cost information prominent and clear

**Developer-Readiness**:
- [ ] Components use auto-layout
- [ ] Layer names descriptive
- [ ] Design tokens exported
- [ ] Measurements annotated

**Polish**:
- [ ] Real book titles used (not lorem ipsum)
- [ ] Realistic user data
- [ ] Empty states designed
- [ ] Error states designed
- [ ] Loading states designed

---

## 🚢 Ship It!

When all checkboxes are ✅:

1. **Export Figma link** (view-only for stakeholders)
2. **Schedule design review** (product, eng, stakeholders)
3. **Present prototype** (use presentation mode, walk through flows)
4. **Collect feedback** (note questions/concerns)
5. **Iterate if needed** (minor tweaks only)
6. **Create developer handoff** (follow handoff section above)
7. **Begin development** (start with design system/components)

---

**You're ready to create a production-ready bkrptr dashboard prototype!**

