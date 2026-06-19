# Design System — Mutual Fund Advisor Intelligence Suite

**Version:** 1.0  
**Platform:** Web (Desktop-first, Mobile-responsive, min 375px)  
**Stack:** React + Tailwind CSS  
**Accessibility:** WCAG 2.1 AA minimum

---

## 1. Brand Identity

### Platform Personality
- **Trustworthy** — This platform handles financial information. Every design decision must reinforce reliability and regulatory compliance.
- **Clear** — Retail investors (Priya, 28–42) may be financially literate but are not finance experts. Clarity over cleverness.
- **Professional but not cold** — Advisors (Rahul) need efficiency; investors need warmth. Balance both.
- **Compliance-forward** — Disclaimers and source citations are not afterthoughts; they are first-class UI elements.

---

## 2. Color Palette

### Primary Colors

| Token | Hex | Usage |
|---|---|---|
| `brand-navy` | `#1B3F7E` | Primary brand, headers, key CTAs, nav bar |
| `brand-teal` | `#0F7B8C` | Secondary brand, interactive highlights, links |
| `brand-saffron` | `#E8922A` | Indian accent color, primary CTA buttons, key actions |

### Neutral Colors

| Token | Hex | Usage |
|---|---|---|
| `neutral-50` | `#F7F8FA` | Page background |
| `neutral-100` | `#EEF0F4` | Card hover, section dividers |
| `neutral-200` | `#E2E8F0` | Borders, input fields |
| `neutral-400` | `#9AA5B4` | Placeholder text, disabled states |
| `neutral-600` | `#4A5568` | Secondary body text |
| `neutral-800` | `#1A202C` | Primary body text |
| `neutral-900` | `#0F172A` | Headings |

### Semantic Colors

| Token | Hex | Usage |
|---|---|---|
| `success-500` | `#2D8653` | Confirmed bookings, success states, checkmarks |
| `success-50` | `#F0FAF4` | Success message backgrounds |
| `warning-500` | `#D97706` | Compliance warnings, important notes |
| `warning-50` | `#FFFBEB` | Disclaimer backgrounds, warning cards |
| `error-500` | `#C0392B` | Error states, compliance violations |
| `error-50` | `#FEF2F2` | Error message backgrounds |
| `info-500` | `#2563EB` | Informational badges, source citations |
| `info-50` | `#EFF6FF` | Info card backgrounds |

### Special Purpose

| Token | Hex | Usage |
|---|---|---|
| `disclaimer-bg` | `#FFF8E1` | All compliance disclaimer containers |
| `disclaimer-border` | `#F59E0B` | Left border on disclaimer blocks |
| `source-badge-bg` | `#EFF6FF` | Source citation badge backgrounds |
| `source-badge-text` | `#1E40AF` | Source citation badge text |

---

## 3. Typography

### Font Stack
```css
--font-heading: 'Plus Jakarta Sans', system-ui, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace; /* Booking codes only */
```

> **Google Fonts URLs:**  
> Plus Jakarta Sans: `https://fonts.google.com/specimen/Plus+Jakarta+Sans`  
> Inter: `https://fonts.google.com/specimen/Inter`

### Type Scale

| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `text-display` | 36px / 2.25rem | 700 Bold | 1.2 | Hero headlines |
| `text-h1` | 28px / 1.75rem | 700 Bold | 1.3 | Page titles |
| `text-h2` | 22px / 1.375rem | 600 SemiBold | 1.35 | Section headings |
| `text-h3` | 18px / 1.125rem | 600 SemiBold | 1.4 | Card headings, sub-sections |
| `text-h4` | 16px / 1rem | 600 SemiBold | 1.45 | Labels, small headings |
| `text-body-lg` | 16px / 1rem | 400 Regular | 1.6 | Primary body text |
| `text-body` | 14px / 0.875rem | 400 Regular | 1.6 | Secondary body, form labels |
| `text-small` | 12px / 0.75rem | 400 Regular | 1.5 | Metadata, timestamps, captions |
| `text-disclaimer` | 13px / 0.8125rem | 400 Regular | 1.55 | Compliance disclaimer text |
| `text-code` | 15px / 0.9375rem | 700 Bold | 1.4 | Booking codes (monospace) |

---

## 4. Spacing System

Uses an 8px base grid.

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Icon gaps, micro-spacing |
| `space-2` | 8px | Tight component internal spacing |
| `space-3` | 12px | Input padding, badge padding |
| `space-4` | 16px | Standard component padding |
| `space-5` | 20px | Card padding (mobile) |
| `space-6` | 24px | Card padding (desktop), section gaps |
| `space-8` | 32px | Major section separators |
| `space-10` | 40px | Page section gaps |
| `space-12` | 48px | Hero section padding |
| `space-16` | 64px | Top-level page padding |

---

## 5. Component Library

### 5.1 Navigation Bar
- Height: 64px desktop / 56px mobile
- Background: `brand-navy` (#1B3F7E)
- Logo: Left-aligned, white wordmark + icon
- Nav links (desktop): Right-aligned, white text, 14px, 500 weight
- Mobile: Hamburger menu, full-width slide-in drawer
- Sticky on scroll

### 5.2 Cards

**Standard Card**
- Background: white
- Border radius: 12px
- Box shadow: `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)`
- Padding: 24px
- Hover: shadow elevates to `0 4px 12px rgba(0,0,0,0.12)`

**Feature Intent Card (Query Builder)**
- Width: 280px desktop, full-width mobile
- Border: 1.5px solid `neutral-200`
- Border radius: 16px
- Hover: border color `brand-teal`, background `#F0FAFB`
- Icon: 32px, `brand-teal` tinted circle background
- Title: 17px, 600 weight
- Description: 13px, `neutral-600`

**Pre-Meeting Brief Card (Advisor)**
- Left accent border: 4px solid `brand-saffron`
- Background: white
- Internal sections separated by 1px `neutral-200` dividers

### 5.3 Buttons

**Primary CTA (Saffron)**
- Background: `brand-saffron` (#E8922A)
- Text: white, 15px, 600 weight
- Padding: 12px 24px
- Border radius: 8px
- Hover: `#D97706` (darken 10%)
- Focus ring: 2px offset, `brand-saffron` 40% opacity

**Secondary (Outline Navy)**
- Border: 1.5px solid `brand-navy`
- Text: `brand-navy`, 15px, 600 weight
- Padding: 12px 24px
- Border radius: 8px
- Hover: background `#EEF2FF`

**Tertiary / Ghost**
- No border, no background
- Text: `brand-teal`, 14px, 500 weight, underline
- Hover: text darkens

**Destructive**
- Background: `error-500`
- Text: white
- Use only for Cancel/Delete actions

### 5.4 Source Citation Badge

```
[ AMFI ]  [ SEBI ]  [ SID ]  [ KIM ]  [ AMC Factsheet ]
```
- Background: `source-badge-bg` (#EFF6FF)
- Text: `source-badge-text` (#1E40AF)
- Font: 12px, 600 weight
- Border radius: 4px
- Padding: 3px 8px
- Always renders as a clickable link with external arrow icon

### 5.5 Compliance Disclaimer Block

```
┌─────────────────────────────────────────────────────────┐
│ ⚠️  This is factual information only...                  │
│     For personalised guidance, book a call →            │
└─────────────────────────────────────────────────────────┘
```
- Background: `disclaimer-bg` (#FFF8E1)
- Left border: 4px solid `disclaimer-border` (#F59E0B)
- Border radius: 0 8px 8px 0
- Padding: 12px 16px
- Icon: ⚠️ amber warning icon, 16px
- Text: 13px, `neutral-700`
- CTA link: `brand-teal`, underlined, 13px

### 5.6 Compliance Deflection Banner (Advice-Seeking)

Full-width banner above answer area:
- Background: `#FEF3C7` (amber-100)
- Border: 1px solid `#D97706`
- Border radius: 8px
- Icon: 🔒 or shield icon in `warning-500`
- Heading: "This question needs personalised advice" — 14px, 600
- Body: Standard compliance text — 13px
- CTA: "Book a call with a SEBI-registered advisor →" — `brand-saffron` button

### 5.7 Step Progress Indicator (Query Builder)

- Horizontal, 3 steps
- Active step: filled circle, `brand-navy`, white number
- Completed step: filled circle, `success-500`, checkmark icon
- Inactive step: outline circle, `neutral-400`
- Connecting line: `neutral-200`, fills `brand-teal` on completion

### 5.8 Voice Input Component

- Large circular microphone button, 72px diameter
- Default: white background, `brand-teal` icon, `neutral-200` border
- Active/recording: pulsing animation, `brand-saffron` border, filled icon
- Waveform visualization below button when active
- Text label: "Tap to speak" / "Listening..." / "Processing..."

### 5.9 Booking Code Display

```
Your Booking Code
┌─────────────────┐
│   MF - K4R2    │
└─────────────────┘
```
- Monospace font: JetBrains Mono, 28px, 700 weight
- Background: `neutral-50`
- Border: 2px solid `brand-navy`
- Border radius: 8px
- Padding: 16px 32px
- Copy-to-clipboard icon button (right)

### 5.10 FAQ Answer Card

Structure:
1. Answer text (max 3 sentences) — 16px body
2. Source row: badge + URL
3. Disclaimer block
4. "Book a call" ghost CTA

### 5.11 Out-of-Scope Message Card

- Background: `neutral-50`
- Border: 1px dashed `neutral-400`
- Border radius: 12px
- Icon: information circle, `neutral-500`
- Heading: "We don't have verified data for this scheme yet" — `neutral-800`
- Body text: 14px
- Two action links: official AMFI link, "View covered schemes" link

### 5.12 Form Inputs

- Height: 44px
- Border: 1px solid `neutral-200`
- Border radius: 8px
- Padding: 0 14px
- Focus border: `brand-teal`, shadow `0 0 0 3px rgba(15,123,140,0.15)`
- Label: 13px, 500 weight, `neutral-700`, above input
- Placeholder: `neutral-400`
- Error state: border `error-500`, error text below in 12px `error-500`

### 5.13 Tags / Topic Pills

- Height: 32px
- Border radius: 20px (pill)
- Default: background `neutral-100`, text `neutral-700`, border 1px `neutral-200`
- Selected: background `brand-navy`, text white, no border
- Hover: background `neutral-200`
- Padding: 6px 14px
- Font: 13px, 500 weight

### 5.14 Data Tables (Advisor Dashboard)

- Header: background `neutral-50`, text `neutral-600`, 12px uppercase, 600
- Row: white, 48px height, bottom border `neutral-100`
- Hover: background `neutral-50`
- Alternating rows: not used (keep clean)

---

## 6. Iconography

Use **Phosphor Icons** (phosphoricons.com) — Regular weight as default, Bold for emphasis.

| Context | Icon Name |
|---|---|
| Fees & charges | `CurrencyCircleDollar` or `Receipt` |
| Scheme details | `ChartLine` |
| Processes (how-to) | `ListChecks` |
| Regulatory | `Scales` |
| Education / Learning | `BookOpen` |
| Advisor / Person | `UserCircle` |
| Voice / Microphone | `Microphone` |
| Calendar / Booking | `CalendarBlank` |
| Compliance / Shield | `ShieldCheck` |
| Warning / Disclaimer | `Warning` |
| Source citation | `LinkSimple` |
| Back navigation | `ArrowLeft` |
| Booking confirmed | `CheckCircle` |
| Pulse / Insights | `PulseLogo` or `ChartBar` |
| Search / FAQ | `MagnifyingGlass` |
| Copy to clipboard | `CopySimple` |
| Out-of-scope | `ProhibitInset` |

---

## 7. Elevation & Shadow System

| Level | Shadow | Usage |
|---|---|---|
| 0 | none | Flat elements, table rows |
| 1 | `0 1px 3px rgba(0,0,0,0.08)` | Cards at rest |
| 2 | `0 4px 12px rgba(0,0,0,0.12)` | Cards on hover, dropdowns |
| 3 | `0 8px 24px rgba(0,0,0,0.16)` | Modals, voice scheduler overlay |
| 4 | `0 16px 40px rgba(0,0,0,0.20)` | Full-screen modals |

---

## 8. Motion & Animation

- Transition duration: 150ms (micro), 250ms (standard), 350ms (page transitions)
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` (Material standard)
- Microphone pulse: `scale(1) → scale(1.15)`, 800ms loop, ease-in-out
- Step progress fill: 250ms linear
- Toast/notification: slide up 200ms, fade out 300ms
- Skeleton loading: shimmer animation, `neutral-100` to `neutral-200`

---

## 9. Responsive Breakpoints

| Breakpoint | Width | Layout |
|---|---|---|
| `xs` (mobile) | 375px–639px | Single column, stacked |
| `sm` | 640px–767px | Single column, slightly wider |
| `md` (tablet) | 768px–1023px | 2-column grid |
| `lg` (desktop) | 1024px–1279px | 3-column grid, sidebar |
| `xl` | 1280px+ | Max-width 1280px, centered |

Max content width: `1280px`, centered with auto margins.

---

## 10. Accessibility

- Minimum contrast ratio: 4.5:1 for body text (WCAG AA)
- Interactive focus rings: visible on all focusable elements
- All icons paired with text labels or `aria-label`
- Form inputs: always associated with `<label>`
- Error messages: associated with inputs via `aria-describedby`
- Voice component: keyboard-accessible fallback (text input)
- Disclaimer text: minimum 13px (not smaller)
- Touch targets: minimum 44×44px on mobile

---

## 11. Compliance UI Patterns (Non-Negotiable)

These are design requirements driven by SEBI/AMFI regulations:

1. **Disclaimer block** — Must appear on every FAQ answer. Background `#FFF8E1`, left border amber. Never hidden, never collapsed.
2. **Performance data disclaimer** — Separate, additional disclaimer block whenever NAV or returns data appears. Must be full-width.
3. **Source citation badge** — Required on every FAQ answer and Education Hub article. Clickable with external link icon.
4. **Advice deflection** — The compliance banner must appear ABOVE the answer area, not below it.
5. **"Book a call" CTA** — Present on every FAQ answer and Education Hub article. Not a primary button — ghost or text link.
6. **PII warning** — In voice scheduler, inline text below the input indicating what data is collected and why.
7. **Out-of-scope scheme message** — Clear distinction between "corpus coverage limit" (dashed border, neutral) vs. "compliance refusal" (amber, warning icon). These are different states with different visual treatment.

---

## 12. Page Layout Templates

### Template A — Investor Information Page
```
[Nav bar — brand-navy]
[Hero: page title + subtitle — neutral-50 bg]
[3-column card grid on desktop / 1-column on mobile]
[Full-width disclaimer strip — disclaimer-bg]
[Footer]
```

### Template B — Flow/Multi-step Page (Query Builder, Scheduler)
```
[Nav bar]
[Centered container, max-width 640px]
[Step progress indicator]
[Step content area]
[Back / Next button row]
```

### Template C — Content / Article Page (Education Hub)
```
[Nav bar]
[Breadcrumb]
[2-column: content (70%) + sidebar (30%) on desktop]
[Content area with source citations]
[Full-width disclaimer strip]
[Footer with "Book a call" CTA]
```

### Template D — Advisor Dashboard
```
[Sidebar nav (240px) — brand-navy]
[Main content area]
[Top bar with advisor name + OTP session indicator]
```

---

## 13. Logo & Brand Mark Guidelines

- Primary logo: Wordmark + icon on dark backgrounds (nav bar, email header)
- Reversed logo: Same on light backgrounds
- Minimum size: 120px wide
- Clear space: 16px minimum on all sides
- Brand tagline (optional): "Factual. Regulated. Clear." — under wordmark, 11px, neutral-400

---

## 14. Email Design Tokens (Booking Confirmation, OTP, Post-Meeting Feedback)

- Width: 600px fixed
- Font: System sans-serif (email safe)
- Header: `brand-navy` background, white logo
- Body: white background, `neutral-800` text
- CTA button: `brand-saffron`, white text, 6px border radius
- Booking Code: monospace, large, in a bordered box
- Footer: `neutral-50`, small text, unsubscribe link (legal requirement)

---

*This document is the single source of truth for UI design decisions on this platform.*  
*Last reviewed: [To be updated before design handoff]*
