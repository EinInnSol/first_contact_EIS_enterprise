# FIRST CONTACT E.I.S. - DESIGN SYSTEM

**Version 1.0** | Enterprise-Grade Visual Language for Government Infrastructure

---

## DESIGN PHILOSOPHY

**"Confident Minimalism"**

This is infrastructure for government, not a consumer app. Every element earns its place. Every color carries meaning. Every animation serves function.

We communicate: **Trust. Authority. Data Integrity. Clarity. Power. Sophistication.**

---

## COLOR PALETTE

### Primary - Indigo
**Authority. Intelligence. Trust.**

```css
indigo-50:  #eef2ff  /* Backgrounds, subtle highlights */
indigo-600: #4f46e5  /* Primary brand, CTAs, links */
indigo-700: #4338ca  /* Hover states, pressed */
indigo-900: #312e81  /* Deep accents */
```

**Why Indigo?** 
- Associated with government and authority
- Suggests intelligence and technology
- Differentiates from overused SaaS blues
- Accessible contrast ratios

### Neutrals - Slate
**Refined. Cool. Technical.**

```css
slate-50:  #f8fafc  /* Page backgrounds */
slate-100: #f1f5f9  /* Card backgrounds */
slate-200: #e2e8f0  /* Borders, dividers */
slate-300: #cbd5e1  /* Disabled states */
slate-500: #64748b  /* Secondary text */
slate-600: #475569  /* Body text */
slate-700: #334155  /* Emphasized text */
slate-900: #0f172a  /* Headings, primary text */
slate-950: #020617  /* Navigation, dark mode base */
```

**Why Slate?**
- Cooler than pure gray (suggests technology)
- More refined than stark black/white
- Creates clear hierarchy through subtle shifts

### Layer 8 Accent - Cyan
**Data. Intelligence. Hidden Depths.**

```css
cyan-50:  #ecfeff  /* Layer 8 backgrounds */
cyan-500: #06b6d4  /* Layer 8 primary */
cyan-700: #0e7490  /* Layer 8 deep accents */
```

**Why Cyan?**
- Suggests data and analytics
- Represents "hidden intelligence"
- Perfect for the secret accountability layer
- Contrasts beautifully with indigo

### Semantic Colors

```css
/* Success - Emerald */
success-50:  #ecfdf5
success-600: #059669  /* Completion, positive metrics */
success-700: #047857

/* Warning - Amber */
warning-50:  #fffbeb
warning-600: #d97706  /* Caution, moderate risk */
warning-700: #b45309

/* Danger - Rose */
danger-50:  #fff1f2
danger-600: #e11d48  /* Errors, critical issues */
danger-700: #be123c

/* Info - Sky */
info-50:  #f0f9ff
info-600: #0284c7  /* Neutral information */
info-700: #0369a1
```

---

## TYPOGRAPHY

### Font Families

**Display (Headings):** Inter Tight
- Weights: 600, 700, 800, 900
- Line-height: 1.25
- Use for: Page titles, section headers, card titles
- Conveys: Authority, confidence

**Body (Interface):** Inter
- Weights: 400, 500, 600
- Line-height: 1.5-1.625
- Use for: Body text, labels, descriptions
- Conveys: Readability, professionalism

**Data (Metrics):** JetBrains Mono
- Weights: 600, 700
- Tabular numbers enabled
- Use for: Metrics, tables, data displays
- Conveys: Precision, technical authority

### Type Scale

```css
text-xs:   0.75rem   /* 12px - Labels, captions */
text-sm:   0.875rem  /* 14px - Body, table data */
text-base: 1rem      /* 16px - Default body */
text-lg:   1.125rem  /* 18px - Emphasized text */
text-xl:   1.25rem   /* 20px - Small headings */
text-2xl:  1.5rem    /* 24px - Section titles */
text-3xl:  1.875rem  /* 30px - Page titles */
text-4xl:  2.25rem   /* 36px - Hero metrics */
```

---

## SPACING SYSTEM

Based on 4px grid with 8px rhythm

```css
0:    0px
0.5:  2px   (0.125rem)
1:    4px   (0.25rem)
1.5:  6px   (0.375rem)
2:    8px   (0.5rem)   ← Base unit
3:    12px  (0.75rem)
4:    16px  (1rem)
5:    20px  (1.25rem)
6:    24px  (1.5rem)
8:    32px  (2rem)
10:   40px  (2.5rem)
12:   48px  (3rem)
16:   64px  (4rem)
20:   80px  (5rem)
```

---

## COMPONENTS

### Cards

**Purpose:** Container for related content

```css
Background: white (slate-100 in dark mode)
Border: 1px solid slate-200
Border-radius: 12px
Padding: 1.5rem (24px)
Shadow: 0 1px 3px rgba(0,0,0,0.08)
Hover shadow: 0 10px 15px -3px rgba(0,0,0,0.08)
Transition: 200ms ease
```

**Usage:**
- Group related information
- Create visual hierarchy
- Separate distinct sections
- Provide interactive areas

### Buttons

**Primary (CTAs)**
```css
Background: indigo-600
Color: white
Padding: 0.625rem 1.25rem (10px 20px)
Border-radius: 8px
Font-weight: 500
Hover: indigo-700 + translateY(-1px)
Active: indigo-800
```

**Secondary (Supporting actions)**
```css
Background: white
Color: slate-700
Border: 1px solid slate-300
Padding: 0.625rem 1.25rem
Border-radius: 8px
Hover: slate-50 + border-slate-500
```

**Danger (Destructive)**
```css
Background: danger-600
Color: white
Padding: 0.625rem 1.25rem
Border-radius: 8px
Hover: danger-700
```

### Badges

**Purpose:** Status indicators, labels, tags

```css
Padding: 0.25rem 0.75rem (4px 12px)
Border-radius: 9999px (fully rounded)
Font-size: 0.75rem (12px)
Font-weight: 500
Letter-spacing: 0.025em
Text-transform: uppercase
```

**Variants:**
- Success: emerald-50 bg, emerald-700 text
- Warning: amber-50 bg, amber-700 text
- Danger: rose-50 bg, rose-700 text
- Layer 8: cyan-50 bg, cyan-700 text, cyan-500 border

### Tables

**Purpose:** Display structured data

```css
Header:
  Background: slate-50
  Border-bottom: 2px solid slate-200
  Padding: 0.75rem 1rem
  Font-size: 0.75rem
  Font-weight: 600
  Color: slate-600
  Text-transform: uppercase
  Letter-spacing: 0.05em

Row:
  Border-bottom: 1px solid slate-100
  Padding: 1rem
  Font-size: 0.875rem
  Hover: slate-50 background

Data (numbers):
  Font: JetBrains Mono
  Text-align: right
  Font-weight: 600
```

### Metric Cards

**Purpose:** Display key performance indicators

```css
Label:
  Font-size: 0.75rem (12px)
  Font-weight: 600
  Color: slate-600
  Text-transform: uppercase
  Letter-spacing: 0.05em
  Margin-bottom: 0.5rem

Value:
  Font: JetBrains Mono
  Font-size: 2.25rem (36px)
  Font-weight: 700
  Color: slate-900
  Line-height: 1

Trend:
  Font-size: 0.875rem (14px)
  Font-weight: 500
  Color: success-600 (positive) or danger-600 (negative)
  Margin-top: 0.75rem
  Icon: arrow-up or arrow-down
```

---

## LAYOUT PATTERNS

### Dashboard Grid

```
┌────────────────────────────────────────────┐
│  Header (h-16)                             │
├──────────┬─────────────────────────────────┤
│          │                                 │
│ Sidebar  │  Main Content                   │
│ (w-64)   │  (flex-1, p-8)                  │
│          │                                 │
│          │  ┌─────────────────────────┐    │
│          │  │ Summary Metrics (grid)  │    │
│          │  └─────────────────────────┘    │
│          │                                 │
│          │  ┌─────────────────────────┐    │
│          │  │ Primary Content         │    │
│          │  └─────────────────────────┘    │
│          │                                 │
└──────────┴─────────────────────────────────┘
```

### Content Hierarchy

1. **Page Title** (text-3xl, font-display, font-bold, slate-900)
2. **Section Title** (text-2xl, font-display, font-semibold, slate-900, border-b)
3. **Card Title** (text-xl, font-display, font-semibold, slate-900)
4. **Body Text** (text-base, font-body, slate-600)
5. **Caption/Label** (text-xs, font-body, font-medium, slate-500, uppercase)

---

## ANIMATION & MOTION

### Principles
- Subtle, not showy
- Purposeful, not playful
- Fast enough to feel responsive, slow enough to be perceived

### Durations
```css
fast: 100ms   /* Micro-interactions */
base: 200ms   /* Standard transitions */
slow: 300ms   /* Complex animations */
```

### Easings
```css
Default: cubic-bezier(0.4, 0, 0.2, 1)
Hover lift: ease-out
```

### Common Patterns
- **Hover lift:** translateY(-1px) + shadow increase
- **Button press:** Scale(0.98)
- **Card appear:** fadeIn + slideInUp
- **Data load:** Shimmer skeleton

---

## DARK MODE (LAYER 8 THEME)

Applied via `data-theme="layer8"` attribute

```css
Backgrounds:
  Primary: slate-950
  Secondary: slate-900
  Elevated: slate-800

Text:
  Primary: slate-50
  Secondary: slate-400
  Muted: slate-500

Borders:
  Default: slate-800
  Strong: slate-700

Accent:
  Primary: cyan-400
  Hover: cyan-300

Effects:
  Glow: 0 0 20px rgba(6, 182, 212, 0.3)
```

**Usage:** Layer 8 analytics dashboards, city admin views

---

## ACCESSIBILITY

### Contrast Ratios
- Body text: Minimum 4.5:1 (WCAG AA)
- Large text (18px+): Minimum 3:1
- Interactive elements: Minimum 3:1

### Focus States
```css
Outline: 2px solid indigo-600
Outline-offset: 2px
Border-radius: inherit

Dark mode:
  Outline: 2px solid cyan-400
```

### Keyboard Navigation
- All interactive elements focusable
- Logical tab order
- Skip links for main content
- Visible focus indicators

---

## USAGE GUIDELINES

### DO
✓ Use generous whitespace
✓ Maintain consistent spacing (8px grid)
✓ Let data speak (large metrics, clear tables)
✓ Use color purposefully (meaning, not decoration)
✓ Keep hierarchy clear (size, weight, spacing)
✓ Test contrast ratios
✓ Provide loading states
✓ Show empty states

### DON'T
✗ Use rounded corners everywhere (max 12px)
✗ Add drop shadows to everything
✗ Use bright, saturated colors
✗ Animate for no reason
✗ Stack borders on borders
✗ Forget hover states
✗ Hide critical actions
✗ Use emoji or illustrations (data only)

---

## COMPONENT COMPOSITION

### Dashboard Summary
```
[Metric Card] [Metric Card] [Metric Card]
     ↓              ↓              ↓
   Label          Label          Label
   Value          Value          Value
   Trend          Trend          Trend
```

### Vendor Performance Table
```
[Table Card]
  Header Row (sticky)
  Data Rows (hover state)
  Sorted column (indigo-600)
  Rank badges
  Status indicators
```

### Layer 8 Analytics
```
[Dark Card - data-theme="layer8"]
  Cyan accent headers
  Glowing metrics
  Contrast charts
  Hidden insights
```

---

**Design System Owner:** Claude (CTO)
**Last Updated:** December 21, 2025
**Status:** Active - Version 1.0
