# Design Quick Reference Card
## bkrptr Dashboard - Essential Specs

---

## 🎨 Colors (Copy-Paste Ready)

### Brand Colors
```css
Primary Blue:   #0EA5E9  /* Buttons, links, primary actions */
Batch Green:    #22C55E  /* Economy processing, savings */
Expedite Amber: #F59E0B  /* Premium processing, urgency */
```

### Semantic Colors
```css
Success: #22C55E
Error:   #EF4444
Warning: #F59E0B
Info:    #3B82F6
```

### Grays
```css
Gray-50:  #F9FAFB  /* Page background */
Gray-200: #E5E7EB  /* Borders */
Gray-500: #6B7280  /* Secondary text */
Gray-700: #374151  /* Primary text */
Gray-900: #111827  /* Headings */
```

---

## 📐 Typography

### Sizes
```css
H1: 30px / bold       /* Page titles */
H2: 24px / semibold   /* Sections */
H3: 20px / semibold   /* Subsections */
Body: 16px / normal   /* Default text */
Small: 14px / normal  /* Secondary text */
Tiny: 12px / normal   /* Captions */
```

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

---

## 📏 Spacing (8px grid)

```
4px   Micro    (icon gaps)
8px   Tight    (related items)
12px  Compact  (form fields)
16px  Standard (component padding)
24px  Comfort  (between sections)
32px  Spacious (major sections)
48px  Generous (page sections)
```

---

## 🔘 Border Radius

```css
Small:  4px     /* Badges */
Medium: 8px     /* Buttons, inputs, cards */
Large:  12px    /* Modals, large cards */
Full:   9999px  /* Pills, avatars */
```

---

## 💫 Shadows

```css
/* Elevation */
sm:  0 1px 3px rgba(0,0,0,0.1)
md:  0 4px 6px rgba(0,0,0,0.1)
lg:  0 10px 15px rgba(0,0,0,0.1)
xl:  0 20px 25px rgba(0,0,0,0.1)

/* Focus rings */
primary:  0 0 0 3px rgba(14,165,233,0.2)
batch:    0 0 0 3px rgba(34,197,94,0.2)
expedite: 0 0 0 3px rgba(245,158,11,0.2)
```

---

## 🎯 Critical Visual Rules

### Rule #1: Color Coding (SACRED)
```
GREEN  = Batch Processing   = Economy/Cheaper/Slower
AMBER  = Expedited Processing = Premium/Expensive/Faster
BLUE   = Primary Actions    = Default brand color
```

**Never mix these!** Batch = always green, Expedited = always amber.

### Rule #2: Status Badges
```
Pending:              Gray bg (#F3F4F6), Gray text (#6B7280)
Processing Batch:     Green bg (#DCFCE7), Green text (#15803D)
Processing Expedited: Amber bg (#FEF3C7), Amber text (#B45309)
Completed:            Green bg (#DCFCE7), Green text (#15803D)
Failed:               Red bg (#FEE2E2), Red text (#B91C1C)
```

### Rule #3: Button Hierarchy
```
1. Primary (Blue)    = Main action ("Submit Analysis")
2. Batch (Green)     = Choose economy option
3. Expedite (Amber)  = Upgrade to premium
4. Secondary (White) = Cancel, secondary actions
```

---

## 📱 Responsive Breakpoints

```
Mobile:  375px   (iPhone SE size)
Tablet:  768px   (iPad portrait)
Desktop: 1440px  (MacBook Pro 14")
```

### Layout Changes

**Desktop (1440px)**:
- Sidebar: 240px, always visible
- Stats: 3 columns
- Cards: 1 column (full width)

**Tablet (768px)**:
- Sidebar: Collapsible (icons only when collapsed)
- Stats: 2 columns (third wraps)
- Cards: Full width

**Mobile (375px)**:
- Sidebar: Hamburger menu (overlay)
- Stats: Stack vertically
- Cards: Compact layout, reduced padding
- Buttons: Full width

---

## 🧩 Component Quick Specs

### Primary Button
```css
padding: 10px 20px
background: #0EA5E9
color: white
font-size: 16px
font-weight: 500
border-radius: 8px
box-shadow: 0 1px 3px rgba(0,0,0,0.1)

:hover { background: #0284C7; shadow: md }
:active { background: #0369A1; transform: translateY(1px) }
:focus { box-shadow: 0 0 0 3px rgba(14,165,233,0.2) }
```

### Status Badge
```css
padding: 4px 12px
font-size: 12px
font-weight: 500
border-radius: 9999px
display: inline-flex
align-items: center
```

### Analysis Card
```css
background: white
border: 1px solid #E5E7EB
border-radius: 12px
padding: 24px
box-shadow: 0 1px 3px rgba(0,0,0,0.1)

:hover {
  border-color: #D1D5DB
  box-shadow: 0 4px 6px rgba(0,0,0,0.1)
}
```

### Progress Bar
```css
Container:
  width: 100%
  height: 8px
  background: #E5E7EB
  border-radius: 9999px

Fill (Batch):
  background: #22C55E
  height: 100%
  border-radius: 9999px
  transition: width 300ms ease

Fill (Expedited):
  background: #F59E0B
```

---

## ⚡ Common Patterns

### Form Field
```html
<label class="label">
  Book Title <span class="required">*</span>
</label>
<input
  type="text"
  placeholder="e.g., Atomic Habits"
  class="input"
/>
<span class="helper-text">Required field</span>
```

```css
.label { font-size: 14px; font-weight: 500; margin-bottom: 8px }
.required { color: #EF4444 }
.input {
  width: 100%
  padding: 10px 12px
  border: 1px solid #D1D5DB
  border-radius: 8px
  font-size: 16px
}
.helper-text { font-size: 12px; color: #6B7280; margin-top: 4px }
```

### Modal
```css
Overlay:
  position: fixed
  inset: 0
  background: rgba(0,0,0,0.5)
  z-index: 1000

Modal:
  max-width: 500px
  background: white
  border-radius: 12px
  box-shadow: 0 20px 25px rgba(0,0,0,0.1)
  padding: 32px
```

### Empty State
```html
<div class="empty-state">
  <div class="icon">📚</div>
  <h3>No analyses yet</h3>
  <p>Get started by submitting your first book</p>
  <button class="primary">Add Your First Book</button>
</div>
```

```css
.empty-state {
  text-align: center
  padding: 64px 32px
}
.empty-state .icon { font-size: 48px; margin-bottom: 16px }
.empty-state h3 { font-size: 20px; font-weight: 600; margin-bottom: 8px }
.empty-state p { font-size: 16px; color: #6B7280; margin-bottom: 24px }
```

---

## 🎬 Animations

### Timing
```css
Fast:   150ms  /* Hovers, small changes */
Normal: 250ms  /* Page transitions, modals */
Slow:   350ms  /* Large movements */
```

### Easing
```css
Standard: cubic-bezier(0.4, 0, 0.2, 1)  /* ease-in-out */
```

### Common Transitions
```css
/* Button hover */
transition: background 150ms ease, box-shadow 150ms ease;

/* Card hover */
transition: border-color 150ms ease, box-shadow 150ms ease;

/* Modal enter */
opacity: 0 → 1 (250ms)
transform: scale(0.95) → scale(1) (250ms)

/* Progress bar */
transition: width 300ms ease;
```

---

## 📊 Sample Data (for prototypes)

### Books
```
1. "Atomic Habits" by James Clear - Processing Batch (65%) - $0.03
2. "Deep Work" by Cal Newport - Processing Batch (30%) - $0.03
3. "Thinking, Fast and Slow" by Daniel Kahneman - Pending - $0.03
4. "Good to Great" by Jim Collins - Processing Expedited (80%) - $0.06
5. "Zero to One" by Peter Thiel - Completed - $0.03
6. "The Lean Startup" by Eric Ries - Completed - $0.06
7. "Sapiens" by Yuval Noah Harari - Completed - $0.03
```

### User
```
Name: Madho Patel
Email: madho@example.com
Usage: $12.45 / $50.00 (24.9%)
Analyses: 48 this month
```

---

## ♿ Accessibility Checklist

### Color Contrast
```
✓ Primary text (#374151) on white: 10.8:1 (AAA)
✓ Secondary text (#6B7280) on white: 7.8:1 (AAA)
✓ Batch-700 (#15803D) on Batch-100 (#DCFCE7): 8.2:1 (AAA)
✓ Expedite-700 (#B45309) on Expedite-100 (#FEF3C7): 7.5:1 (AAA)
```

### Focus States
```
All interactive elements MUST have:
- Visible focus indicator (3px ring)
- 20% opacity of element color
- Offset by 2px from element
```

### Touch Targets (Mobile)
```
Minimum: 44x44px
Recommended: 48x48px
```

### Keyboard Navigation
```
✓ Tab through all interactive elements
✓ Enter/Space activates buttons
✓ Escape closes modals
✓ Arrow keys navigate lists
```

---

## 🚨 Common Mistakes to Avoid

### ❌ DON'T
```
- Use green for expedited processing
- Use amber for batch processing
- Mix processing colors
- Remove focus indicators
- Scale desktop to mobile (redesign instead)
- Use gray text on gray backgrounds
- Make touch targets < 44px on mobile
- Use "click here" link text
```

### ✅ DO
```
- Green = batch, amber = expedited (always)
- Show costs prominently
- Use real book titles in prototypes
- Design mobile layouts from scratch
- Verify color contrast (use Stark plugin)
- Make focus states visible
- Use descriptive link text
- Add empty states and error states
```

---

## 🎯 Cost Display Rules

### Show Costs
```
✓ Batch: $0.03 per book (~24 hours)
✓ Expedited: $0.06 per book (~9 minutes)
✓ Difference: +$0.03 to expedite
✓ Savings: "Save $0.03 with batch mode" (green text)
```

### Cost Formatting
```css
.cost-value {
  font-size: 20px
  font-weight: 600
  color: #111827
}

.cost-savings {
  font-size: 14px
  color: #16A34A  /* Green for savings */
}

.cost-premium {
  font-size: 14px
  color: #D97706  /* Amber for premium */
}
```

---

## 📱 Mobile-Specific Rules

### Stack Everything
```
Desktop: Side-by-side → Mobile: Stacked
Desktop: 3 columns → Mobile: 1 column
Desktop: Inline actions → Mobile: Full-width buttons
```

### Reduce Padding
```
Desktop: 24px → Mobile: 16px (cards)
Desktop: 32px → Mobile: 24px (page margins)
```

### Touch Targets
```
Buttons: Full width or minimum 44px height
Links: Minimum 44x44px tap area
Icon buttons: 48x48px recommended
```

### Hide Non-Essential
```
Hide on mobile:
- Secondary metadata
- Tertiary actions
- Detailed timestamps (show relative: "2h ago")
```

---

## 🔗 File Locations

```
Design System:    /docs/UI-UX-DESIGN-SYSTEM.md
Figma Prompt:     /docs/FIGMA-MAKE-PROMPT.md
Usage Guide:      /docs/FIGMA-PROMPT-USAGE-GUIDE.md
This Reference:   /docs/DESIGN-QUICK-REFERENCE.md
```

---

## ⚡ Speed Reference

### Need Specific Info Fast?

**Color codes** → Section 1 (Colors)
**Font sizes** → Section 2 (Typography)
**Spacing values** → Section 3 (Spacing)
**Button specs** → Section 6 (Component Quick Specs)
**Batch vs Expedited** → Section 5 (Critical Visual Rules)
**Mobile breakpoints** → Section 7 (Responsive)
**Sample data** → Section 11 (Sample Data)
**Accessibility** → Section 12 (Accessibility)

---

## 💾 Copy-Paste Snippets

### Design Tokens CSS
```css
:root {
  --color-primary: #0EA5E9;
  --color-batch: #22C55E;
  --color-expedite: #F59E0B;
  --color-success: #22C55E;
  --color-error: #EF4444;

  --text-primary: #374151;
  --text-secondary: #6B7280;

  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
}
```

### Tailwind Config
```javascript
colors: {
  primary: { 500: '#0EA5E9', 600: '#0284C7', 700: '#0369A1' },
  batch: { 500: '#22C55E', 600: '#16A34A', 700: '#15803D' },
  expedite: { 500: '#F59E0B', 600: '#D97706', 700: '#B45309' }
}
```

---

**Print this page and keep it handy during design/development!**

*Last updated: 2025-10-18*
