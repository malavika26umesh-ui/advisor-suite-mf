# Google Stitch Design Prompts — Mutual Fund Advisor Intelligence Suite

**Reference:** `DESIGN.md` for full design system (colors, fonts, components)  
**Platform:** Web — Desktop-first (1280px), Mobile-responsive (375px minimum)  
**Total screens covered:** 29 screens across 7 features + design system foundation

\---

## HOW TO USE THESE PROMPTS WITH GOOGLE STITCH

1. Start each prompt session in Stitch with the **Design System Prompt** (Section 0) to establish the visual language.
2. Then use individual screen prompts one at a time.
3. Each prompt is self-contained — include the relevant preamble from Section 0 if starting a new session.

\---

## SECTION 0 — DESIGN SYSTEM FOUNDATION PROMPT

**Use this once per Stitch session to set the visual language before generating any screens.**

\---

> Design a comprehensive UI design system for a web application called \\\*\\\*Mutual Fund Advisor Intelligence Suite\\\*\\\* — an AI-powered Indian fintech platform that helps retail investors get factual information about mutual funds and book appointments with SEBI-registered investment advisors. The platform is built on React + Tailwind CSS.
>
> \\\*\\\*Brand personality:\\\*\\\* Trustworthy, professional, clear, and compliance-forward. This is a regulated financial information platform — not a trading app. The design must convey authority and clarity without being cold or intimidating.
>
> \\\*\\\*Color palette:\\\*\\\*
> - Primary Navy: `#1B3F7E` — headers, nav bar, primary trust elements
> - Secondary Teal: `#0F7B8C` — interactive elements, links, secondary accents
> - Accent Saffron: `#E8922A` — primary CTA buttons, key actions (Indian cultural accent)
> - Background: `#F7F8FA` (off-white)
> - Card background: `#FFFFFF`
> - Primary text: `#1A202C`
> - Secondary text: `#4A5568`
> - Muted text: `#718096`
> - Border: `#E2E8F0`
> - Disclaimer background: `#FFF8E1` (soft amber)
> - Disclaimer border: `#F59E0B`
> - Source badge background: `#EFF6FF`
> - Source badge text: `#1E40AF`
> - Success: `#2D8653`
> - Warning: `#D97706`
> - Error: `#C0392B`
>
> \\\*\\\*Typography:\\\*\\\*
> - Headings: Plus Jakarta Sans (700 Bold for display, 600 SemiBold for sections)
> - Body: Inter (400 Regular)
> - Booking codes: JetBrains Mono (monospace, 700 Bold)
> - Base text: 16px / 1rem
> - H1: 28px, H2: 22px, H3: 18px, Disclaimer text: 13px
>
> \\\*\\\*Key UI components to establish:\\\*\\\*
> 1. Navigation bar: 64px height, `#1B3F7E` background, white logo left, white nav links right
> 2. Cards: white background, 12px border radius, subtle box shadow, 24px padding
> 3. Primary button: `#E8922A` background, white text, 8px border radius, 15px 600-weight text
> 4. Secondary button: `#1B3F7E` outline, navy text, same dimensions
> 5. Source citation badge: `#EFF6FF` background, `#1E40AF` text, 12px 600-weight, pill shape
> 6. Compliance disclaimer block: `#FFF8E1` background, 4px left border `#F59E0B`, 12px-16px padding, ⚠️ icon, 13px text
> 7. Topic selection pill: 32px height, pill border radius, neutral default, navy filled when selected
> 8. Step progress indicator: 3-step horizontal, filled circles for active/complete, connecting line
>
> \\\*\\\*Spacing:\\\*\\\* 8px grid system. Cards: 24px padding. Section gaps: 32–48px. Page max-width: 1280px centered.
>
> \\\*\\\*Accessibility:\\\*\\\* WCAG 2.1 AA. All text meets 4.5:1 contrast. Touch targets 44px minimum.

\---

## SECTION 1 — LANDING / HOME PAGE

### Screen 1.1 — Home Page (Investor Entry Point)

> Design the \\\*\\\*home page\\\*\\\* of the Mutual Fund Advisor Intelligence Suite, an Indian fintech platform for retail investors seeking factual information about mutual funds.
>
> \\\*\\\*Layout (desktop 1280px, two-column hero):\\\*\\\*
>
> \\\*\\\*Navigation bar:\\\*\\\*
> - Full-width, 64px height, `#1B3F7E` (deep navy) background
> - Left: logo — white text wordmark "IntelliSuite MF" with a small abstract bar-chart icon
> - Right: nav links in white — "FAQ Centre" | "Education Hub" | "Book Advisor Call" | (advisor login link in smaller text, right-most)
> - The "Book Advisor Call" link should be styled as a pill button in `#E8922A` (saffron)
>
> \\\*\\\*Hero section:\\\*\\\*
> - Background: `#F7F8FA` (off-white), large section, 80px top/bottom padding
> - Left column (55%): 
>   - Tag chip above headline: "SEBI-Compliant · AMFI-Grounded" — small pill, `#EFF6FF` background, `#1E40AF` text
>   - Headline (H1, 36px, Plus Jakarta Sans Bold, `#1A202C`): "Clear, factual information about mutual funds — no advice, no guesswork."
>   - Subheadline (18px, Inter Regular, `#4A5568`, 2 lines): "Get answers to your mutual fund questions from official AMFI and SEBI sources. Or book a call with a SEBI-registered advisor when you need personalised guidance."
>   - Two buttons horizontally: Primary CTA "Start with a Question" (`#E8922A` button) and Secondary "Browse Education Hub" (navy outline button)
>   - Trust bar below buttons: 3 small items in a row with icons — "📋 Source-cited answers" | "🔒 No investment advice" | "✅ SEBI-compliant"
> - Right column (45%): Clean illustration or abstract graphic — a person looking at a clean dashboard with fund information, minimal flat design, navy and teal color scheme. No real money/cash imagery.
>
> \\\*\\\*"How It Works" section:\\\*\\\*
> - White background, 48px padding
> - Section heading (H2, 22px, navy): "Three ways to get the clarity you need"
> - Three horizontal cards side by side (desktop) / stacked (mobile):
>   1. Card: Teal circle icon (question mark) — "Ask a Specific Question" — "Get factual answers about fees, NAV, exit loads, and processes from official sources."
>   2. Card: Navy circle icon (book) — "Explore and Learn" — "Understand fund categories, fee structures, and investor rights at your own pace."
>   3. Card: Saffron circle icon (calendar) — "Book an Advisor Call" — "When you need personalised guidance, speak to a SEBI-registered investment advisor."
> - Each card: white, 12px border radius, 24px padding, 1px border `#E2E8F0`, hover lifts shadow
>
> \\\*\\\*Featured Topic Strip:\\\*\\\*
> - Light teal background (`#F0FAFB`), 40px padding
> - Label: "This week, investors are asking about:" — 13px, italic, `#4A5568`
> - 4 horizontal pill chips: e.g., "Exit load on ELSS" | "TER explained" | "Direct vs Regular plan" | "How to redeem SIP"
> - Each chip: `#FFFFFF` background, 1px `#0F7B8C` border, `#0F7B8C` text, 13px, clickable → FAQ Centre
>
> \\\*\\\*Compliance footer strip:\\\*\\\*
> - Full-width, `#FFF8E1` (amber) background, 20px padding
> - Centered text (13px, `#6B7280`): "This platform provides factual information only. It does not constitute investment advice. For personalised guidance, speak to a SEBI-registered investment advisor. Mutual fund investments are subject to market risks."
>
> \\\*\\\*Footer:\\\*\\\*
> - `#1B3F7E` background, white text
> - Logo left, links center (FAQ | Education Hub | Book a Call | Privacy Policy | Sources)
> - Bottom: "SEBI-compliant fintech platform · Corpus sourced from AMFI, SEBI, and AMC documents"
>
> \\\*\\\*Mobile (375px):\\\*\\\* Stack hero to single column, text first then illustration. Buttons stack vertically. How-it-works cards stack vertically.

\---

## SECTION 2 — GUIDED QUERY BUILDER (F1)

### Screen 2.1 — Step 1: Intent Classification

> Design \\\*\\\*Step 1 of the Guided Query Builder\\\*\\\* — the entry point where an investor selects their intent before being routed to the right feature.
>
> \\\*\\\*Layout:\\\*\\\* Centered single-column, max-width 640px, 80px top padding, `#F7F8FA` background.
>
> \\\*\\\*Step progress indicator at top:\\\*\\\*
> - 3-step horizontal indicator
> - Step 1 active: filled navy circle with "1", label "What do you need?" below
> - Step 2 inactive: outline circle "2", label "Narrow your topic"
> - Step 3 inactive: outline circle "3", label "Get your answer"
> - Connecting lines between circles, unfilled
>
> \\\*\\\*Heading area (below progress indicator, 32px gap):\\\*\\\*
> - H1 (28px, Plus Jakarta Sans Bold, `#1A202C`): "What brings you here today?"
> - Subtext (16px, Inter, `#4A5568`): "Select the option that best describes what you're looking for — we'll guide you from there."
>
> \\\*\\\*Three intent cards (stacked vertically, 16px gap between):\\\*\\\*
>
> Card 1:
> - White background, 16px border radius, 20px padding, 1.5px border `#E2E8F0`
> - Left: circle icon container (48px, `#EFF6FF` background), Phosphor icon `MagnifyingGlass` in `#0F7B8C`
> - Right: Title (17px, 600 weight, `#1A202C`) "I have a specific question about a fund or fee" | Subtext (13px, `#4A5568`): "Ask about exit loads, NAV, expense ratios, redemption processes, or any scheme detail"
> - Right arrow icon `ArrowRight` in `#9AA5B4`
> - Hover state: border changes to `#0F7B8C`, background `#F0FAFB`, arrow turns teal
>
> Card 2:
> - Same structure
> - Icon: `BookOpen` in `#1B3F7E`, background `#EEF2FF`
> - Title: "I want to learn about mutual funds"
> - Subtext: "Explore fund categories, SIPs, fees, tax implications, and investor rights"
> - Hover: border `#1B3F7E`, background `#F0F4FF`
>
> Card 3:
> - Same structure
> - Icon: `CalendarBlank` in `#E8922A`, background `#FFF7ED`
> - Title: "I need to speak to an investment advisor"
> - Subtext: "Book a slot with a SEBI-registered advisor for personalised guidance"
> - Hover: border `#E8922A`, background `#FFF9F0`
>
> \\\*\\\*Bottom note (below cards, 24px gap):\\\*\\\*
> - 13px, `#718096`, centered: "🔒 No login required · No personal information collected"
>
> \\\*\\\*Mobile (375px):\\\*\\\* Cards full-width, maintain same structure. Reduce horizontal padding to 16px.

\---

### Screen 2.2 — Step 2A: Topic Narrowing (Specific Question Path)

> Design \\\*\\\*Step 2A of the Guided Query Builder\\\*\\\* — topic selection for investors who have a specific question.
>
> \\\*\\\*Same layout as 2.1.\\\*\\\* Progress indicator shows Step 1 complete (green checkmark), Step 2 active.
>
> \\\*\\\*Back button:\\\*\\\* Top-left, ghost style, `←  Back` in `#0F7B8C`, 14px. Returns to Step 1.
>
> \\\*\\\*Heading area:\\\*\\\*
> - H1: "What's your question about?"
> - Subtext: "Select a topic and we'll find the most accurate answer from official sources."
>
> \\\*\\\*Topic pills grid (2 columns on desktop, 1 on mobile):\\\*\\\*
>
> Five topic pill buttons (44px height, border radius 22px, 14px 500-weight text, full horizontal padding):
>
> 1. 💳 "Fees \\\& charges" — TER, exit load, stamp duty, STT
> 2. 📊 "Scheme details" — NAV, lock-in, benchmark, fund manager
> 3. 🔄 "Processes" — How to invest, redeem, download statements
> 4. ⚖️ "Regulatory questions" — SEBI, AMFI, KIM, SID explained
> 5. ✏️ "Something else" — Free text input
>
> \\\*\\\*Default state:\\\*\\\* `#FFFFFF` background, 1.5px `#E2E8F0` border, `#4A5568` text, icon left  
> \\\*\\\*Selected state:\\\*\\\* `#1B3F7E` background, white text, icon white  
> \\\*\\\*Hover:\\\*\\\* `#F7F8FA` background, `#1B3F7E` border
>
> \\\*\\\*"Something else" — when selected:\\\*\\\*
> - Below pills: text input appears with 300ms slide-down animation
> - Input: full-width, 44px height, "Describe what you'd like to know..." placeholder, 1px `#E2E8F0` border, 8px border radius
> - Helper text below: 12px, `#718096`: "Your question will be reviewed to make sure we route you correctly."
>
> \\\*\\\*Continue button:\\\*\\\*
> - Primary `#E8922A` button, full-width, "Continue →", 44px height
> - Disabled until a topic is selected
>
> \\\*\\\*Note strip below button:\\\*\\\*
> - 12px, `#9AA5B4`, centered: "If your question may need personal advice, we'll let you know before routing."

\---

### Screen 2.3 — Step 2B: Topic Narrowing (Learning Path)

> Design \\\*\\\*Step 2B of the Guided Query Builder\\\*\\\* — topic selection for investors who want to learn about mutual funds. Nearly identical layout to Screen 2.2 but different topics.
>
> \\\*\\\*Same layout, progress, and back button as 2.2.\\\*\\\*
>
> \\\*\\\*Heading area:\\\*\\\*
> - H1: "What would you like to learn about?"
> - Subtext: "We'll take you to a clear, source-cited explainer — no jargon, no opinions."
>
> \\\*\\\*Five topic pills (same styling as 2.2):\\\*\\\*
>
> 1. 🗂️ "Types of mutual funds" — Categories, categories, ELSS, index funds, flexi cap
> 2. 📅 "How SIPs work" — Auto-investment mandates, pause, modify, cancel
> 3. 🧾 "Tax implications" — LTCG, STCG, ELSS tax benefit (factual only)
> 4. 💸 "Understanding fees and costs" — TER, exit load, stamp duty, distributor vs direct
> 5. 🛡️ "My rights as an investor" — SEBI grievance, account statements, KYC rights
>
> \\\*\\\*"Continue →" button:\\\*\\\* Same as 2.2, disabled until selection made.

\---

### Screen 2.4 — Step 3: Routing / Transition (with Advice-Seeking Warning)

> Design \\\*\\\*Step 3 of the Guided Query Builder\\\*\\\* — the routing transition screen, showing the advice-seeking warning state (when the triage engine detects a personal advice query in the free-text "Something else" input).
>
> \\\*\\\*Same centered layout, max 640px. Step 3 marked active.\\\*\\\*
>
> \\\*\\\*Advice-seeking warning card (primary state on this screen):\\\*\\\*
> - Border: 1.5px solid `#D97706`
> - Background: `#FFFBEB`
> - Border radius: 12px
> - Padding: 24px
> - Top: warning icon `ShieldCheck` in `#D97706`, 32px
> - Heading (18px, 600, `#92400E`): "This question sounds like it may need personalised guidance"
> - Body (14px, `#78350F`): "Questions about what's suitable for your specific situation — like your age, income, or investment goals — go beyond factual information. A SEBI-registered advisor can help with this."
> - Two action buttons side by side (desktop) / stacked (mobile):
>   - Primary (`#E8922A`): "Book a call with an advisor →" (full-width on mobile)
>   - Secondary (outline navy): "Continue to FAQ anyway"
> - Small note below: "Continuing to FAQ will show you factual information only — it won't answer personal advisory questions."
>
> \\\*\\\*Successful routing state (when not advice-seeking):\\\*\\\*
> - Simple confirmation: animated checkmark circle (`#2D8653`), 48px
> - Text: "Taking you to \\\[FAQ Centre / Education Hub]..." with a thin loading bar
> - This screen is transitional — 1.5s then auto-routes

\---

## SECTION 3 — FAQ CENTRE (F2)

### Screen 3.1 — FAQ Centre Main Page

> Design the \\\*\\\*FAQ Centre main page\\\*\\\* — a RAG-powered Q\\\&A interface for investor questions about mutual funds.
>
> \\\*\\\*Layout:\\\*\\\* Two-column desktop (content 65%, sidebar 35%), single column mobile.
>
> \\\*\\\*Nav bar:\\\*\\\* Same as home page. "FAQ Centre" active in nav.
>
> \\\*\\\*Page header section:\\\*\\\*
> - Background: `#1B3F7E` (navy), 56px padding
> - H1 (28px, white, Plus Jakarta Sans Bold): "Mutual Fund FAQ Centre"
> - Subtext (15px, white at 80% opacity): "Factual answers from official AMFI, SEBI, and AMC sources. Every answer cites its source."
> - Search/query input bar below heading: full-width (max 680px), 52px height, white background, placeholder "Ask a question about fees, schemes, or processes...", search icon left, microphone icon right, `#E8922A` "Ask" button right
>
> \\\*\\\*Main content column (left 65%):\\\*\\\*
>
> If pre-filled from Query Builder — show a "Recent question" card at top:
> - Tag: "Your topic: Fees \\\& Charges" in teal pill
> - Question text displayed
> - Loading skeleton (3 lines) transitioning to answer
>
> \\\*\\\*Answer card (default visible state):\\\*\\\*
> - White card, 12px border radius, 24px padding, shadow level 1
> - Top: User question in a soft `#F7F8FA` background rounded bubble, 14px
> - Answer text block: 16px Inter, `#1A202C`, max 3 sentences, generous line height 1.6
> - Source row: Label "Source:" in `#718096` 12px, then source badge pill(s) — e.g., "AMFI" in `#EFF6FF`/`#1E40AF`, then external link URL in teal underline, `ArrowSquareOut` icon 12px
> - Separator line `#E2E8F0`
> - \\\*\\\*Compliance disclaimer block:\\\*\\\* `#FFF8E1` background, 4px left border `#F59E0B`, 12px padding, "⚠️ This is factual information sourced from official AMFI/SEBI/AMC documents. It does not constitute investment advice. For personalised guidance, speak to a SEBI-registered investment advisor."
> - CTA row below disclaimer: ghost link "Need personalised advice? Book a call with a SEBI-registered advisor →" in `#0F7B8C`, 13px
>
> \\\*\\\*Follow-up question input\\\*\\\* below the answer card:
> - "Have a follow-up question?" label, 13px, `#718096`
> - Same input bar styling, smaller (44px height)
>
> \\\*\\\*Right sidebar (35%):\\\*\\\*
>
> Panel 1 — \\\*\\\*Fee Explainer\\\*\\\* (sticky top):
> - Card: white, teal left accent border (4px, `#0F7B8C`)
> - Heading chip: "📌 Fee Explainer — This Week" in `#EFF6FF`/`#1E40AF`, 12px
> - H3: "What is Exit Load?" (current week's top confusion topic)
> - 6 bullet points, 13px, `#4A5568`, bullet icons as `•` in teal
> - Two source links below: "Source: AMFI · SEBI" — badge style
> - "Last checked: \\\[date]" — 11px, `#9AA5B4`
>
> Panel 2 — \\\*\\\*Covered Schemes\\\*\\\*:
> - Heading: "Schemes we have verified data for" — 13px, 600 weight
> - Expandable list of 20 scheme names, 12px, teal text, scrollable, max-height 200px
> - "Why only 20 schemes?" — ghost link opening info tooltip
>
> \\\*\\\*Mobile (375px):\\\*\\\* Sidebar panels collapse to accordions below the main answer area.

\---

### Screen 3.2 — FAQ Centre: Compliance Deflection State (Advice-Seeking Query)

> Design the \\\*\\\*FAQ Centre compliance deflection view\\\*\\\* — shown when the triage engine classifies an investor's query as advice-seeking (e.g., "Should I invest in ELSS or index funds?").
>
> \\\*\\\*Same overall layout as Screen 3.1.\\\*\\\*
>
> \\\*\\\*Question input area:\\\*\\\* Shows the investor's typed question grayed out (non-editable display).
>
> \\\*\\\*Deflection card (replaces answer area):\\\*\\\*
> - Full-width in content column
> - Background: `#FEF3C7` (amber-100)
> - Border: 1.5px solid `#D97706`
> - Border radius: 12px
> - Padding: 28px
> - Icon: `ShieldCheck` phosphor icon, 36px, `#D97706`
> - Heading (18px, 600, `#92400E`): "This question needs personalised investment advice"
> - Body text (14px, `#78350F`, 1.6 line height): "Questions like this — about what you should invest in, or what's suitable for your situation — go beyond factual information. SEBI regulations require this to come from a registered investment advisor, not an information platform."
> - Separator
> - "What you CAN find here instead:" — 13px, 600, `#4A5568`
> - Two suggestion chips below: e.g., "What is an ELSS fund? →" and "What is an index fund? →" — clicking routes to relevant FAQ answers
> - Primary CTA button (`#E8922A`): "Book a call with a SEBI-registered advisor"
> - Below button: ghost link "Or browse the Education Hub instead →"
>
> \\\*\\\*Right sidebar unchanged from 3.1.\\\*\\\*

\---

### Screen 3.3 — FAQ Centre: Out-of-Scope Scheme Message

> Design the \\\*\\\*FAQ Centre out-of-scope scheme state\\\*\\\* — shown when an investor asks about a mutual fund scheme NOT in the platform's Top 20 verified corpus.
>
> \\\*\\\*Same layout as 3.1.\\\*\\\*
>
> \\\*\\\*Out-of-scope card (replaces answer area):\\\*\\\*
> - White card, 12px border radius
> - Border: 1.5px dashed `#9AA5B4`
> - Background: `#F7F8FA`
> - Padding: 28px
> - Icon: `ProhibitInset` phosphor icon, 36px, `#9AA5B4`
> - Heading (17px, 500, `#4A5568`): "We don't have verified data for this scheme yet"
> - Body (14px, `#4A5568`): "We currently have verified, source-cited information for a curated list of 20 major mutual fund schemes. \\\[Scheme name] isn't part of that list yet, so we can't give you a verified factual answer here."
> - Two official source links (teal underline, external arrow icon):
>   - "Find this scheme's SID/KIM on the AMC's official website →"
>   - "Search for this scheme on AMFI India →"
> - Separator line
> - "Want help with one of the 20 schemes we do cover?" — 13px, `#4A5568`
> - "View covered schemes" — teal ghost button, opens expandable scheme list in place
>
> \\\*\\\*Important:\\\*\\\* This card uses a neutral/gray visual treatment (dashed border, muted icon). It is a coverage limitation, NOT a compliance refusal — visually distinct from the amber compliance deflection card in Screen 3.2.

\---

### Screen 3.4 — FAQ Centre: Fee Explainer Detail View

> Design the \\\*\\\*Fee Explainer expanded view\\\*\\\* — a full-page view of the weekly automatically-generated fee explainer, accessible from the sidebar panel.
>
> \\\*\\\*Layout:\\\*\\\* Centered single column, max-width 720px, on `#F7F8FA` background.
>
> \\\*\\\*Breadcrumb:\\\*\\\* "FAQ Centre > Fee Explainer" — 13px, `#9AA5B4`, teal active link
>
> \\\*\\\*Header card:\\\*\\\*
> - White, full-width, 24px padding, teal left border 4px
> - "WEEKLY FEE EXPLAINER" — all-caps label chip, `#EFF6FF` background, `#1E40AF` text, 11px
> - H1 (26px, Plus Jakarta Sans Bold, `#1A202C`): e.g., "Understanding Exit Load: What It Is and How It Affects You"
> - Meta row: "Last checked: Monday, \\\[date]" — 12px, `#9AA5B4` | "Version: v4" — 12px, `#9AA5B4`
>
> \\\*\\\*Content card:\\\*\\\*
> - White, 12px border radius, 28px padding
> - 6 bullet points displayed as styled list items:
>   - Left: numbered circle (28px, `#1B3F7E` background, white number)
>   - Right: bullet text (15px, `#1A202C`, 1.6 line height)
>   - 16px gap between items
>   - Each bullet is one concept (no compound sentences)
>
> \\\*\\\*Source row (below bullets):\\\*\\\*
> - "Official Sources:" label, 13px, `#718096`
> - Two source badge pills: "AMFI" and "SEBI" with external link
>
> \\\*\\\*Compliance disclaimer block (full width):\\\*\\\*
> - Standard `#FFF8E1` disclaimer with ⚠️ icon
>
> \\\*\\\*CTA strip at bottom:\\\*\\\*
> - "Still have questions about this fee?" — 14px
> - "Ask in FAQ →" (ghost teal) | "Book a call with an advisor →" (ghost teal)

\---

## SECTION 4 — EDUCATION HUB (F3)

### Screen 4.1 — Education Hub: Home / Category Landing

> Design the \\\*\\\*Asset Discovery \\\& Education Hub home page\\\*\\\* — a structured library of mutual fund education content.
>
> \\\*\\\*Nav bar:\\\*\\\* Same as other pages. "Education Hub" active.
>
> \\\*\\\*Hero section:\\\*\\\*
> - Background: gradient from `#1B3F7E` to `#0F7B8C`, 64px padding
> - H1 (30px, white, Bold): "Understand mutual funds — clearly, completely, from official sources"
> - Subtext (15px, white 80%): "Every article is sourced from SEBI circulars, AMFI data, and fund SID/KIM documents. No opinions. No comparisons. Just facts."
> - Search bar: white background, placeholder "Search topics, concepts, or questions...", 52px height, max-width 560px, centered
>
> \\\*\\\*Content sections (on `#F7F8FA` background):\\\*\\\*
>
> \\\*\\\*Section 1 — Fund Categories:\\\*\\\*
> - Section heading: H2 (22px, navy, Plus Jakarta Sans 600): "Mutual Fund Categories"
> - Section subtext: "SEBI-defined categories explained — regulatory definitions, how each works, and the benchmark type."
> - Grid of 8 category cards (4×2 desktop, 2×4 tablet, 1×8 mobile):
>   - Each card: white, 12px border radius, 20px padding, 1px `#E2E8F0` border
>   - Icon (32px, category color): e.g., 📈 Large Cap, 📊 Mid Cap, 🏗️ Small Cap, 🔀 Flexi Cap, 🗂️ Multi Cap, 💰 ELSS, 🏭 Sectoral, 📋 Index
>   - Card title: 15px, 600, `#1A202C`
>   - Category tag: "Equity" — small pill, `#EFF6FF`, `#1E40AF`, 11px
>   - SEBI circular reference: 11px, `#9AA5B4`
>   - Hover: border `#0F7B8C`, shadow lifts
>
> \\\*\\\*Section 2 — Key Concepts:\\\*\\\*
> - Same section heading style
> - 6 concept cards (3×2 grid desktop): NAV, SIP, SWP/STP, Direct vs Regular, AUM, Risk-o-meter
> - Each: icon, title, one-line description (13px, `#4A5568`)
>
> \\\*\\\*Section 3 — Fees \\\& Costs:\\\*\\\*
> - Same section heading
> - 5 fee topic cards: TER, Exit Load, Stamp Duty, STT, Distributor vs Direct
> - Cards: same style, with "⚠️ Most misunderstood" tag on TER and Exit Load cards (amber pill, 11px)
>
> \\\*\\\*Section 4 — Investor Processes:\\\*\\\*
> - 5 process cards with numbered icon (not category icon): "How to start a SIP", "How to redeem", "Download CG statement", "Update KYC", "File a complaint (SEBI SCORES)"
> - Process cards use a step-flow visual cue — small arrow right icon on card right
>
> \\\*\\\*Section 5 — Investor Rights:\\\*\\\*
> - 4 rights cards: SID/KIM access right, Account statements right, Nomination right, SEBI grievance redressal
> - Cards with a `ShieldCheck` icon in `#2D8653`
>
> \\\*\\\*Full-width compliance strip (above footer):\\\*\\\*
> - `#FFF8E1` background, centered text: "All content on this page is sourced from SEBI circulars, AMFI publications, and AMC-issued SID/KIM documents. This is not investment advice."

\---

### Screen 4.2 — Education Hub: Article / Content View

> Design an \\\*\\\*Education Hub article page\\\*\\\* — shown when an investor clicks a specific topic (e.g., "Total Expense Ratio").
>
> \\\*\\\*Layout:\\\*\\\* Two-column, 70% content / 30% sidebar. Max-width 1200px. `#F7F8FA` background.
>
> \\\*\\\*Breadcrumb:\\\*\\\* "Education Hub > Fees \\\& Costs > Total Expense Ratio" — 13px, teal links, gray separators
>
> \\\*\\\*Article header:\\\*\\\*
> - White background section, 32px padding
> - Category tag pill: "Fees \\\& Costs" — `#EFF6FF`, `#1E40AF`, 12px
> - H1 (28px, Plus Jakarta Sans Bold, `#1A202C`): "Total Expense Ratio (TER): What It Is and How It Affects Your Investment"
> - Meta row: "Source: SEBI TER Circular — October 2018" + "Last reviewed: \\\[date]" — 12px, `#9AA5B4`, with calendar icon
> - Source badge row: \\\["SEBI"] \\\["AMFI"] badges as clickable pills
>
> \\\*\\\*Article body (left 70% column):\\\*\\\*
> - White card, 28px padding, 12px border radius
> - Section headings: H2 style (22px, 600, `#1B3F7E`) for major sections
> - Body text: 16px Inter, `#1A202C`, 1.6 line height, paragraphs with 16px gap
> - Important definitions: teal left border block, `#F0FAFB` background
> - Worked example box (where applicable): `#F7F8FA` background, dashed border, "Example" label in teal — uses a scheme from the Top 20 corpus (e.g., Parag Parikh Flexi Cap Fund)
> - Source citations inline: superscript numbers linking to source list at bottom
> - Every section ends with source reference: "Source: SEBI Circular SEBI/HO/IMD/DF2/CIR/2018/147"
>
> \\\*\\\*Performance data disclaimer (if any NAV data appears):\\\*\\\*
> - Additional disclaimer block in `#FFF8E1`: "Past performance is not indicative of future returns. Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing."
>
> \\\*\\\*CTA strip at end of article:\\\*\\\*
> - Border-top `#E2E8F0`, padding 20px
> - "Still have questions about TER?" — 15px, `#4A5568`
> - Two CTAs side by side: "Ask in FAQ Centre →" (ghost teal) | "Book a call with an advisor →" (ghost teal)
>
> \\\*\\\*Right sidebar (30%):\\\*\\\*
> - "In this article" — sticky table of contents, teal underline on active section
> - "Related articles" — 3 article cards with title and category
> - "This week's Fee Explainer" — mini version of the Fee Explainer panel (same as FAQ sidebar)
>
> \\\*\\\*Mobile:\\\*\\\* Sidebar collapses. Table of contents becomes a sticky top accordion. Related articles move below main content.

\---

## SECTION 5 — VOICE APPOINTMENT SCHEDULER (F5)

### Screen 5.1 — Voice Scheduler: Step 1 — Greeting

> Design \\\*\\\*Step 1 of the Voice Appointment Scheduler\\\*\\\* — the greeting screen with dynamic Product Pulse context.
>
> \\\*\\\*Layout:\\\*\\\* Centered, max-width 640px, full-height section, `#F7F8FA` background. Mobile-responsive.
>
> \\\*\\\*Page heading:\\\*\\\*
> - H1 (26px, Plus Jakarta Sans Bold, `#1A202C`): "Book a Call with a SEBI-Registered Advisor"
> - Subtext (14px, `#4A5568`): "Voice-first booking — describe what you'd like to discuss and we'll find the right slot."
>
> \\\*\\\*Dynamic Pulse theme banner (shown when Pulse is available):\\\*\\\*
> - `#EFF6FF` background, 1px `#93C5FD` border, 12px border radius, 14px padding
> - Icon: `ChartBar` in `#2563EB`, 20px
> - Text (13px, `#1E40AF`): "💡 This week, many investors are asking about: \\\*\\\*Exit load confusion on ELSS funds\\\*\\\*"
> - This references the Product Pulse top theme
>
> \\\*\\\*Voice agent card (centered, white, 24px padding, 16px border radius, shadow level 2):\\\*\\\*
> - Top: Animated avatar — a friendly abstract face or waveform visualization in navy/teal, 80px circle
> - Below avatar: "I'm here to help you book a slot." — 15px, `#4A5568`
> - Quoted greeting text in a speech bubble style:
>   > "Hi, I'm here to help you book a call with a SEBI-registered advisor. This week, many investors have been asking about exit load confusion on ELSS funds. I can book a slot for that or anything else. What would you like to discuss?"
>   - 15px, `#1A202C`, italic, `#F7F8FA` background, rounded-16 bubble, 16px padding
>
> \\\*\\\*Two options below card:\\\*\\\*
> - Large microphone button (72px diameter): white background, `#0F7B8C` microphone icon, `#E2E8F0` border 2px, shadow level 1
> - Label below button: "Tap to speak"
> - Divider: "— or —" in 12px `#9AA5B4`
> - Text input field: "Type your question instead", 44px height, full-width, `#E2E8F0` border
>
> \\\*\\\*Step indicator:\\\*\\\* 6-step horizontal at top of card (small, compact) — Step 1 active.
>
> \\\*\\\*PII Notice (below options, 12px, `#9AA5B4`, centered):\\\*\\\*
> "🔒 Please don't share account numbers, PAN, Aadhaar, or portfolio details here."

\---

### Screen 5.2 — Voice Scheduler: Step 2 — Topic Capture (Active Listening State)

> Design \\\*\\\*Step 2 of the Voice Appointment Scheduler\\\*\\\* — the active listening / topic capture state after the investor taps the microphone button.
>
> \\\*\\\*Same overall layout as Screen 5.1.\\\*\\\*
>
> \\\*\\\*Microphone button (active state):\\\*\\\*
> - Pulsing animation: concentric rings expanding from button, `#0F7B8C` at 20% opacity
> - Button: `#0F7B8C` filled background, white microphone icon
> - Label changes to: "Listening..." in `#0F7B8C`, 14px, with animated dots
>
> \\\*\\\*Waveform visualization:\\\*\\\*
> - Below the button: real-time audio waveform in teal, 40px height, animating bars
> - Label: "We can hear you" in 12px `#0F7B8C`
>
> \\\*\\\*Transcription preview (below waveform, appears as investor speaks):\\\*\\\*
> - `#F7F8FA` card, 12px border radius, 14px padding
> - Live transcription text in 14px `#1A202C` (appearing word by word)
> - Label above: "Transcribing..." in 11px `#9AA5B4`
>
> \\\*\\\*Stop button:\\\*\\\* Secondary red-toned button below waveform: "Stop recording" — 13px, `#C0392B` text, outline style
>
> \\\*\\\*Step indicator:\\\*\\\* Step 2 active.

\---

### Screen 5.3 — Voice Scheduler: Step 2 — FAQ Deflection Offer (Factual Query Detected)

> Design the \\\*\\\*FAQ deflection offer\\\*\\\* shown inside the Voice Scheduler when the triage engine classifies the investor's spoken query as a factual question (not advice-seeking), offering to route to FAQ first.
>
> \\\*\\\*Same layout. Step 2 still active (this is a sub-state).\\\*\\\*
>
> \\\*\\\*Transcription confirmed card:\\\*\\\*
> - `#F7F8FA` background, rounded card, 16px padding
> - "You said:" label, 12px, `#9AA5B4`
> - Transcription text in quotes, 14px, `#1A202C`
>
> \\\*\\\*Triage result card (below):\\\*\\\*
> - `#FFFBEB` background, 1px `#D97706` border, 12px border radius, 16px padding
> - Icon: `MagnifyingGlass` in `#D97706`, 24px
> - Heading (15px, 600, `#92400E`): "This sounds like something our FAQ Centre might be able to answer right now"
> - Body (13px, `#78350F`): "You asked about \\\[transcribed topic]. We have verified, source-cited information that might help — would you like to try that first?"
> - Two buttons: Primary (`#E8922A`) "Take me to FAQ" | Secondary (outline navy) "I'd still like to speak to an advisor"
>
> \\\*\\\*If investor chooses advisor:\\\*\\\* Booking continues from Step 3 regardless.

\---

### Screen 5.4 — Voice Scheduler: Step 3 — Slot Selection

> Design \\\*\\\*Step 3 of the Voice Appointment Scheduler\\\*\\\* — time slot selection for the advisor meeting.
>
> \\\*\\\*Same layout. Step 3 active.\\\*\\\*
>
> \\\*\\\*Voice agent prompt (speech bubble):\\\*\\\*
> "Here are the available slots for this week. You can tap one or say the slot out loud."
>
> \\\*\\\*Available slots list (3 slots, stacked cards):\\\*\\\*
> Each slot card (56px height, white, 12px border radius, 1.5px `#E2E8F0` border, 16px padding, horizontal layout):
> - Left: Calendar icon `CalendarBlank` in `#0F7B8C`
> - Center: Day and date (15px, 600) + Time and timezone (13px, `#4A5568`)
> - Right: Radio button (circular, unselected by default)
> - Selected state: border `#0F7B8C`, background `#F0FAFB`, radio filled teal
> - Hover: border `#0F7B8C`
>
> Example slots:
> - Slot 1: "Thursday, 15 Jan 2026 · 10:00 AM IST"
> - Slot 2: "Friday, 16 Jan 2026 · 3:00 PM IST"
> - Slot 3: "Monday, 19 Jan 2026 · 11:30 AM IST"
>
> \\\*\\\*Voice selection indicator:\\\*\\\* When investor says a slot aloud, the matching card auto-selects with a brief green flash animation.
>
> \\\*\\\*"Continue →" button:\\\*\\\* Primary `#E8922A`, disabled until slot selected.

\---

### Screen 5.5 — Voice Scheduler: Step 4 — Optional Context Capture

> Design \\\*\\\*Step 4 of the Voice Appointment Scheduler\\\*\\\* — optional context input for the advisor's pre-meeting brief.
>
> \\\*\\\*Same layout. Step 4 active.\\\*\\\*
>
> \\\*\\\*Voice agent prompt (speech bubble):\\\*\\\*
> "Would you like to share anything with your advisor before your call? This is completely optional — anything you say will be shared only with your advisor to help them prepare."
>
> \\\*\\\*Optional context input:\\\*\\\*
> - Textarea: 120px height, full-width, placeholder "e.g., I invested in a debt fund in 2023 and I'm confused about the exit load...", 1px `#E2E8F0` border, 8px border radius, 14px text
> - Character counter below right: "0 / 300"
> - Microphone option: small mic icon button right of textarea label for voice input
>
> \\\*\\\*PII warning inline (below textarea):\\\*\\\*
> - `#FFF8E1` background, rounded-8, 10px padding
> - 12px, `#78350F`: "🔒 For your security, please don't share your PAN, Aadhaar, folio number, or account details here. Your advisor will have a secure channel for this during the call."
>
> \\\*\\\*Two buttons:\\\*\\\* "Add context \\\& Continue →" (primary) | "Skip — Continue without context" (ghost teal, 13px)

\---

### Screen 5.6 — Voice Scheduler: Step 5 — Email Capture

> Design \\\*\\\*Step 5 of the Voice Appointment Scheduler\\\*\\\* — email address collection for booking confirmation.
>
> \\\*\\\*Same layout. Step 5 active.\\\*\\\*
>
> \\\*\\\*Voice agent prompt:\\\*\\\*
> "What email address should we send your booking confirmation to?"
>
> \\\*\\\*Email input:\\\*\\\*
> - Label (13px, 500, `#374151`): "Your email address"
> - Input: 44px height, full-width, type email, placeholder "you@example.com"
> - Helper text below (12px, `#9AA5B4`): "We'll only use this to send your confirmation email and a brief feedback request after your call. Not for marketing. Not shared with third parties."
>
> \\\*\\\*Consent note (inline, not separate checkbox):\\\*\\\*
> - 12px, `#9AA5B4`: "By entering your email, you agree to receive your booking confirmation and one post-meeting feedback email."
>
> \\\*\\\*"Confirm Booking →" button:\\\*\\\* Primary `#E8922A`, full-width, 48px height. Disabled until valid email.

\---

### Screen 5.7 — Voice Scheduler: Step 6 — Booking Confirmation

> Design \\\*\\\*Step 6 of the Voice Appointment Scheduler\\\*\\\* — the booking confirmation screen after successful booking.
>
> \\\*\\\*Layout:\\\*\\\* Centered, max-width 540px, full-height section.
>
> \\\*\\\*Success animation (top of card):\\\*\\\*
> - Animated checkmark circle: `#2D8653` fill, white checkmark, 64px diameter
> - Brief scale animation on load
>
> \\\*\\\*Heading:\\\*\\\* "Your booking is confirmed!" — H1, 24px, Plus Jakarta Sans Bold, `#1A202C`
>
> \\\*\\\*Booking details card (white, 16px border radius, 24px padding, border 1.5px `#2D8653`):\\\*\\\*
>
> Details grid (label + value rows):
> - Booking Code: \\\*\\\*MF-K4R2\\\*\\\* in JetBrains Mono, 28px Bold, `#1B3F7E`, with copy icon right
> - Topic: "Fees \\\& Charges" pill tag
> - Date \\\& Time: "Friday, 16 Jan 2026 · 3:00 PM IST"
> - Advisor: "SEBI-registered advisor" (name shown if available)
>
> \\\*\\\*Voice announcement style hint (below code):\\\*\\\*
> - 13px, `#4A5568`, italic: "The advisor will reference this code at the start of your call."
>
> \\\*\\\*Email confirmation notice:\\\*\\\*
> - `#F0FAF4` background, `#2D8653` icon, 12px border radius, 12px padding
> - "📧 A confirmation email has been sent to \\\[email]" — 13px, `#2D8653`
>
> \\\*\\\*Reschedule / Cancel note:\\\*\\\*
> - 13px, `#9AA5B4`: "Need to reschedule? Visit our \\\[reschedule page] with your Booking Code and email."
>
> \\\*\\\*CTA below:\\\*\\\* "Return to Home" (ghost navy button) | "Browse Education Hub while you wait →" (ghost teal)

\---

### Screen 5.8 — Voice Scheduler: Reschedule / Cancel Page

> Design the \\\*\\\*Reschedule and Cancellation page\\\*\\\* for the Voice Appointment Scheduler — accessed independently, no login required.
>
> \\\*\\\*Layout:\\\*\\\* Centered, max-width 540px.
>
> \\\*\\\*Page heading:\\\*\\\* "Manage Your Booking"
> \\\*\\\*Subtext:\\\*\\\* "Enter your Booking Code and email to reschedule or cancel your call."
>
> \\\*\\\*Form card (white, 24px padding, 12px border radius, shadow level 1):\\\*\\\*
> - Field 1: "Booking Code" — input, placeholder "MF-XXXX", monospace font, uppercase forced
> - Field 2: "Email address" — same email as used during booking
> - "Look up my booking" button — primary `#E8922A`, full-width
>
> \\\*\\\*After lookup — shows booking details + two action buttons:\\\*\\\*
> - Booking details summary card (topic, date, time, advisor)
> - "Reschedule" button (secondary outline navy) — expands slot selection
> - "Cancel booking" button (ghost red `#C0392B` text) — requires confirmation dialog
>
> \\\*\\\*Cancellation notice (inline, before cancel button):\\\*\\\*
> - 12px, `#78350F`: "Cancellations must be made at least 2 hours before the scheduled slot. Your advisor will be notified immediately."
>
> \\\*\\\*Confirmation dialog (on cancel):\\\*\\\*
> - Modal overlay, white card, center
> - "Are you sure you want to cancel?" — 18px, 600
> - Booking summary in gray
> - Two buttons: "Yes, cancel booking" (solid `#C0392B`) | "Keep my booking" (outline navy)

\---

## SECTION 6 — ADVISOR DASHBOARD (F6)

### Screen 6.1 — Advisor Login

> Design the \\\*\\\*Advisor Login page\\\*\\\* — email + OTP authentication, no password.
>
> \\\*\\\*Layout:\\\*\\\* Split screen desktop (50% navy brand panel, 50% white form). Mobile: single column form only.
>
> \\\*\\\*Left panel (50%, `#1B3F7E` background):\\\*\\\*
> - Platform logo (white) centered
> - Tagline: "Advisor Intelligence Suite" — 22px, white, Plus Jakarta Sans 600
> - Three value props in white with icons:
>   - "📋 Meeting queue with pre-built briefs"
>   - "📊 Weekly Product Pulse insights"
>   - "📅 Availability calendar management"
> - SEBI note at bottom: "For SEBI-registered Investment Advisors only" — 12px, white 60% opacity
>
> \\\*\\\*Right panel (50%, white):\\\*\\\*
> - "Advisor Log In" — H1, 26px, navy
> - Subtext: "Enter your registered email address. We'll send a one-time password."
> - Form:
>   - Email field: 44px, full-width, label "Registered email address"
>   - "Send OTP" button: primary `#E8922A`, full-width, 48px
>   - (After OTP sent) OTP field: 44px, label "Enter the 6-digit code sent to \\\[email]", monospace font, letter-spacing generous
>   - "Log In" button: primary `#E8922A`, full-width
>   - "Resend OTP" ghost link below: 13px, teal, with 30-second cooldown timer
> - Session note below form: 12px, `#9AA5B4`: "Sessions time out after 30 minutes of inactivity for your security."
>
> \\\*\\\*Mobile:\\\*\\\* Left panel hidden. White form centered with logo at top.

\---

### Screen 6.2 — Advisor Dashboard: Home / Meeting Queue

> Design the \\\*\\\*Advisor Dashboard home page\\\*\\\* — the primary view showing the meeting queue.
>
> \\\*\\\*Layout:\\\*\\\* Fixed left sidebar (240px, `#1B3F7E` navy) + main content area. Max-width 1280px.
>
> \\\*\\\*Left sidebar:\\\*\\\*
> - Platform logo top (white, 24px padding)
> - Separator
> - Navigation items (48px height each, white text 14px, 500, left-aligned, 24px left padding):
>   - 📋 Meeting Queue (active: white background at 20% opacity, left accent 3px white)
>   - 📅 Availability Calendar
>   - 📊 Product Pulse
>   - ⚙️ Settings
> - Bottom: Advisor name + "RIA" badge in green, 13px white, log out ghost link
>
> \\\*\\\*Top bar (main area):\\\*\\\*
> - White, 56px height, border-bottom `#E2E8F0`
> - Left: "Meeting Queue" — H2, 22px, `#1A202C`
> - Right: Today's date, OTP session indicator ("Session: 28 min remaining"), and notification bell
>
> \\\*\\\*Filter bar (below top bar):\\\*\\\*
> - Horizontal filter pills: "All" (selected) | "Today" | "This Week" | "Pending Confirmation" | "Completed"
> - Right: "Filter by topic" dropdown
>
> \\\*\\\*Meeting Queue table (main area, white background, 12px border radius, shadow level 1):\\\*\\\*
>
> Table header row (`#F7F8FA` background, 44px, 12px uppercase labels, `#718096`):
> - Booking Code | Topic Category | Scheduled Time | Status | Actions
>
> Meeting rows (48px height, `#FFFFFF`, bottom border `#F3F4F6`):
> - \\\*\\\*Booking Code:\\\*\\\* `MF-T7Q1` — monospace font, 13px, `#1B3F7E`, 600 weight
> - \\\*\\\*Topic Category:\\\*\\\* pill chip — "Fees \\\& Charges" in `#EFF6FF`/`#1E40AF`
> - \\\*\\\*Scheduled Time:\\\*\\\* "Friday, 16 Jan · 3:00 PM IST" — 14px, `#1A202C`
> - \\\*\\\*Status:\\\*\\\* Colored pill — "Confirmed" in `#F0FAF4`/`#2D8653` | "Pending" in `#FFFBEB`/`#D97706` | "Cancelled" in `#FEF2F2`/`#C0392B` | "Completed" in `#F7F8FA`/`#9AA5B4`
> - \\\*\\\*Actions:\\\*\\\* "View Brief" (teal ghost link) | "Reschedule" (gray ghost) | "Complete" (green outline button)
>
> Three sample rows visible. Pagination below.
>
> \\\*\\\*Product Pulse pinned card (above table, full-width):\\\*\\\*
> - `#EFF6FF` background, 1px `#93C5FD` border, 12px border radius, 16px padding
> - Left: `ChartBar` icon `#2563EB`, 24px
> - "📌 PRODUCT PULSE — This Week" label chip
> - Preview text: "Top theme: Exit load confusion — 112 queries this week. 3 new product recommendations available."
> - "Read full Pulse →" ghost teal link right

\---

### Screen 6.3 — Advisor Dashboard: Pre-Meeting Brief Card

> Design the \\\*\\\*Pre-Meeting Brief view\\\*\\\* — the detailed brief for an upcoming advisor-investor meeting, accessed from the Meeting Queue.
>
> \\\*\\\*Layout:\\\*\\\* Same sidebar nav. Main content: centered single column, max-width 800px.
>
> \\\*\\\*Breadcrumb:\\\*\\\* "Meeting Queue > Pre-Meeting Brief: MF-T7Q1"
>
> \\\*\\\*Brief header card (white, 24px padding, 12px border radius, left border 4px `#E8922A`):\\\*\\\*
> - Top row: Booking Code "MF-T7Q1" (monospace, 18px, `#1B3F7E`) + Status pill "Confirmed" (green)
> - Second row: Topic Category chip "Fees \\\& Charges — Debt Fund" + Time "Friday, 16 Jan · 3:00 PM IST"
> - Warning note if brief opened < 10 min before meeting: amber inline warning "Meeting starts soon — you have 8 minutes"
>
> \\\*\\\*Brief content sections (white card, divided by `#F3F4F6` horizontal rules, 24px padding each section):\\\*\\\*
>
> \\\*\\\*Section 1 — Topic Category:\\\*\\\*
> - Label: "TOPIC CATEGORY" — 11px, uppercase, `#9AA5B4`
> - Value: "Fees \\\& Charges (Debt Fund)" — 16px, 600, `#1A202C`
>
> \\\*\\\*Section 2 — Investor's Stated Context:\\\*\\\*
> - Label: "INVESTOR'S CONTEXT (OPTIONAL — IF SHARED)"
> - Value: "I invested in a debt fund in 2023." — 15px, `#1A202C`, italic, in a speech bubble style
> - OR: "Not shared" in `#9AA5B4` if investor chose not to share
>
> \\\*\\\*Section 3 — FAQ Queries from Session:\\\*\\\*
> - Label: "WHAT THEY ASKED BEFORE BOOKING (THIS SESSION ONLY)"
> - Two question chips: "What is exit load?" | "How is TER deducted?" — pill style, `#F7F8FA`, 13px
> - Note: 11px, `#9AA5B4`: "Session data only — not stored after call"
>
> \\\*\\\*Section 4 — This Week's Pulse Theme:\\\*\\\*
> - Label: "PRODUCT PULSE — TOP THEME THIS WEEK"
> - Content: "Exit load confusion on short-duration debt funds — 112 queries this week. This may indicate SIP maturity-related confusion." — 14px, `#4A5568`
> - Chip: "Common context — not investor-specific" in `#F7F8FA`/`#9AA5B4`
>
> \\\*\\\*Section 5 — Relevant Education Hub Links:\\\*\\\*
> - Label: "RELEVANT ARTICLES"
> - 2 article links: "Exit Load Explainer — v3, updated Monday →" | "TER Explained →" — teal underline, external icon
>
> \\\*\\\*What is NOT shown (explicit note at bottom of brief card):\\\*\\\*
> - Gray box, `#F7F8FA`, `ProhibitInset` icon, 13px `#9AA5B4`:
>   "This brief does not contain: PAN, Aadhaar, folio number, portfolio details, or AI-generated advisory recommendations."
>
> \\\*\\\*Action buttons below card:\\\*\\\*
> - "Mark as Complete" (primary `#E8922A`) | "Reschedule" (secondary outline) | "Back to Queue" (ghost)

\---

### Screen 6.4 — Advisor Dashboard: Availability Calendar

> Design the \\\*\\\*Availability Calendar view\\\*\\\* in the Advisor Dashboard.
>
> \\\*\\\*Same sidebar nav.\\\*\\\*
>
> \\\*\\\*Top bar:\\\*\\\* "Availability Calendar" H2 + "Add time block" primary button (right)
>
> \\\*\\\*Calendar grid (main area):\\\*\\\*
> - 5-day week view (Mon–Fri), current week
> - Time slots in rows (8 AM – 7 PM), 30-min granularity
> - Available blocks: `#F0FAFB` background, `#0F7B8C` left border 3px, label "Open" in teal
> - Booked slots: `#EFF6FF` background, `#1B3F7E` left border 3px, Booking Code label visible "MF-T7Q1"
> - Blocked slots: `#F7F8FA` background, `#9AA5B4` strikethrough pattern, "Blocked" label
> - Hover on open slot: tooltip "Click to block or view"
>
> \\\*\\\*"Add time block" modal (when button clicked):\\\*\\\*
> - Modal overlay, white card, 400px wide
> - Title: "Set Available Slot"
> - Day selector (7 day pills, Mon–Sun), time range picker (from/to), recurring toggle
> - "Save slot" primary button | "Cancel" ghost

\---

### Screen 6.5 — Advisor Dashboard: Product Pulse View

> Design the \\\*\\\*Product Pulse full view\\\*\\\* in the Advisor Dashboard — the weekly intelligence report visible as a pinned card.
>
> \\\*\\\*Same sidebar nav. "Product Pulse" active in sidebar.\\\*\\\*
>
> \\\*\\\*Top bar:\\\*\\\* "Product Pulse" H2 + "Week of \\\[date]" | "Previous Pulse →" (ghost teal link)
>
> \\\*\\\*Pulse report card (white, 12px border radius, 28px padding, shadow level 1):\\\*\\\*
>
> \\\*\\\*Pulse header:\\\*\\\*
> - "WEEKLY PRODUCT PULSE" — all-caps label chip, `#EFF6FF`/`#1E40AF`
> - "Monday, \\\[date] · 9:00 AM IST" — 12px, `#9AA5B4`
> - "Generated automatically from this week's investor query data" — 13px, `#9AA5B4`, italic
>
> \\\*\\\*Section 1 — Top Investor Themes (3 items):\\\*\\\*
> - Section heading: H3 "Top Investor Themes This Week" — `#1B3F7E`
> - Theme cards (3, stacked, left border 4px `#E8922A`):
>   - Rank badge (1, 2, 3) in circle, `#1B3F7E`
>   - Theme text: "Exit load on ELSS post-lock-in period" — 15px, 600
>   - Query count: "112 queries" — `#E8922A`, 13px, 600
>   - Representative question (1 line, 13px, italic, `#4A5568`): "I redeemed after 3 years but still got charged exit load?"
>
> \\\*\\\*Section 2 — Investor Quotes (2–5 anonymised):\\\*\\\*
> - Section heading: H3 "How Investors Are Phrasing Their Confusion"
> - Quote cards: `#F7F8FA` background, left quote mark `"` in 48px `#E2E8F0`, italic text, "\\\[Investor]" labels for PII replacement, 13px, `#4A5568`
>
> \\\*\\\*Section 3 — Key Observation:\\\*\\\*
> - Section heading: H3 "Key Observation"
> - Paragraph text: ≤100 words, 15px, `#1A202C`, 1.6 line height
>
> \\\*\\\*Section 4 — Fee Confusion Spotlight:\\\*\\\*
> - Section heading: H3 "Fee Confusion Spotlight"
> - Highlighted box: `#FFF8E1` background, `#F59E0B` border, single fee term large: "Exit Load" — 22px, `#92400E`, 700
> - "Triggered automatic Fee Explainer update in FAQ corpus" — green success indicator

> \\\*\\\*Section 5 — Product Recommendations (3 items):\\\*\\\*
> - Section heading: H3 "3 Product Recommendations" — `#1B3F7E`
> - Numbered list cards: `#F7F8FA` background, 12px border radius, 16px padding
>   - Number badge: `#1B3F7E` circle, white number
>   - Recommendation text: 15px, `#1A202C`
>   - Supporting data point: 13px, italic, `#4A5568`: "Based on: 34 queries this week"
>
> \\\*\\\*Section 6 — Corpus Refresh Status:\\\*\\\*
> - Success confirmation block: `#F0FAF4` background, `#2D8653` check icon
> - "Fee Explainer updated: 'Exit Load' · Version v4 · Refreshed \\\[date]" — 13px, `#2D8653`

\---

## SECTION 7 — TRIAGE ENGINE STATES (F4 — Visible States)

*F4 operates in the background, but its output is visible through specific UI states in F1, F2, and F5.*

### Screen 7.1 — Triage: Advice-Seeking Deflection (FAQ Centre)

*(Covered in Screen 3.2 — see compliance deflection state)*

### Screen 7.2 — Triage: Edge Case / Escalation State

> Design the \\\*\\\*edge case / escalation message\\\*\\\* shown when the triage engine cannot confidently classify an investor's query.
>
> \\\*\\\*Shown within FAQ Centre or Query Builder, as an inline card.\\\*\\\*
>
> \\\*\\\*Card styling:\\\*\\\*
> - `#F7F8FA` background, 1px `#E2E8F0` border, 12px border radius, 20px padding
> - Icon: `Question` in `#9AA5B4`, 28px
> - Heading (15px, 600, `#4A5568`): "We've routed you based on our best read of your question"
> - Body (13px, `#4A5568`): "We've taken you to \\\[FAQ / Education Hub] based on what you asked. If this isn't quite right, you can also book a call with a SEBI-registered advisor."
> - Ghost link: "Book a call instead →" in teal

\---

## SECTION 8 — SUPPLEMENTARY SCREENS

### Screen 8.1 — Sources / Corpus Transparency Page

> Design the \\\*\\\*Sources page\\\*\\\* — a transparent listing of all data sources used in the platform's FAQ and Education Hub corpus.
>
> \\\*\\\*Layout:\\\*\\\* Standard content page, max-width 900px, `#F7F8FA` background.
>
> \\\*\\\*Header:\\\*\\\*
> - H1: "Our Sources — Transparent Data Corpus"
> - Subtext: "Every factual answer on this platform traces to one of these official, publicly accessible sources."
>
> \\\*\\\*Source categories (accordion sections):\\\*\\\*
>
> 1. "AMFI India" — source list with URLs
> 2. "SEBI" — regulatory circulars with circular numbers
> 3. "Individual AMC Websites" — SID/KIM documents for each of the 20 schemes
> 4. "mfapi.in and mfdata.in" — data provider info
>
> \\\*\\\*Top 20 Schemes section:\\\*\\\*
> - Table: Scheme name, Category, AMC — same as Appendix A
> - Note: "Our FAQ Centre only provides verified answers for these 20 schemes. Queries about other schemes return an out-of-scope message."
>
> \\\*\\\*Source refresh policy:\\\*\\\*
> - Plain-text section: reviewed monthly, broken links replaced within 48h, new SEBI/AMFI circulars added within 7 days.

\---

### Screen 8.2 — Post-Meeting Feedback Email Design

> Design the \\\*\\\*post-meeting feedback email\\\*\\\* sent to investors after their advisor call is marked complete.
>
> \\\*\\\*Email layout (600px fixed width):\\\*\\\*
>
> \\\*\\\*Header:\\\*\\\* `#1B3F7E` background, white logo, "Meeting Feedback" label in white 13px
>
> \\\*\\\*Body (white):\\\*\\\*
> - Greeting: "Hello," (no name — to avoid PII)
> - "Your call with your SEBI-registered advisor is now complete."
> - Single feedback question in large text (20px, 600): "How useful was your call today?"
> - Three button options inline (center-aligned):
>   - "Very useful" — `#2D8653` fill, white text, 8px border radius
>   - "Somewhat useful" — `#F59E0B` fill, dark text
>   - "Not useful" — `#C0392B` fill, white text
> - Note below: 12px, `#9AA5B4`: "Your response is anonymous and helps us improve the platform."
>
> \\\*\\\*Footer:\\\*\\\* `#F7F8FA`, unsubscribe link, "IntelliSuite MF · SEBI-compliant fintech platform", 11px

\---

### Screen 8.3 — Booking Confirmation Email Design

> Design the \\\*\\\*booking confirmation email\\\*\\\* sent immediately after a successful scheduler booking.
>
> \\\*\\\*Email layout (600px):\\\*\\\*
>
> \\\*\\\*Header:\\\*\\\* `#1B3F7E` background, white logo, "Booking Confirmed ✓" in white 16px 600
>
> \\\*\\\*Body:\\\*\\\*
> - Heading: "Your advisor call is booked" — 22px, Plus Jakarta Sans Bold
> - Booking details box (bordered, `#F7F8FA`):
>   - \\\*\\\*Booking Code: MF-K4R2\\\*\\\* — 28px, JetBrains Mono Bold, `#1B3F7E`, inside a bordered box
>   - Topic: "Fees \\\& Charges"
>   - Date/Time: "Friday, 16 Jan 2026 · 3:00 PM IST"
>   - Advisor: "SEBI-registered advisor (name if available)"
> - "Please share this Booking Code with your advisor at the start of your call."
> - Reschedule/Cancel: small ghost link
>
> \\\*\\\*Footer:\\\*\\\* Same as feedback email. Unsubscribe link. Privacy policy link.

\---

## DESIGN PROMPT QUICK REFERENCE

|Screen #|Feature|Screen Name|
|-|-|-|
|1.1|Home|Landing / Home Page|
|2.1|F1|Query Builder — Step 1: Intent|
|2.2|F1|Query Builder — Step 2A: Specific Question Topics|
|2.3|F1|Query Builder — Step 2B: Learning Topics|
|2.4|F1|Query Builder — Step 3: Routing / Advice Warning|
|3.1|F2|FAQ Centre — Main|
|3.2|F2|FAQ Centre — Compliance Deflection|
|3.3|F2|FAQ Centre — Out-of-Scope Scheme|
|3.4|F2|FAQ Centre — Fee Explainer Detail|
|4.1|F3|Education Hub — Home|
|4.2|F3|Education Hub — Article View|
|5.1|F5|Voice Scheduler — Step 1: Greeting|
|5.2|F5|Voice Scheduler — Step 2: Active Listening|
|5.3|F5|Voice Scheduler — Step 2: FAQ Deflection Offer|
|5.4|F5|Voice Scheduler — Step 3: Slot Selection|
|5.5|F5|Voice Scheduler — Step 4: Context Capture|
|5.6|F5|Voice Scheduler — Step 5: Email Capture|
|5.7|F5|Voice Scheduler — Step 6: Confirmation|
|5.8|F5|Voice Scheduler — Reschedule / Cancel|
|6.1|F6|Advisor Login|
|6.2|F6|Advisor Dashboard — Meeting Queue|
|6.3|F6|Advisor Dashboard — Pre-Meeting Brief|
|6.4|F6|Advisor Dashboard — Availability Calendar|
|6.5|F6|Advisor Dashboard — Product Pulse View|
|7.2|F4|Triage — Edge Case State|
|8.1|Supplementary|Sources / Corpus Transparency Page|
|8.2|Supplementary|Post-Meeting Feedback Email|
|8.3|Supplementary|Booking Confirmation Email|

\---

## STITCH WORKFLOW NOTES

1. **Session order:** Start with Section 0 (design system), then generate screens in pillar order — Information (1→3), Operations (5→6), Intelligence (7), Supplementary (8).
2. **Consistency check after each section:** Verify colors, fonts, and component styles match Section 0 before proceeding.
3. **Mobile variants:** For every investor-facing screen (Sections 1–5), request a 375px mobile variant after the desktop version is approved.
4. **Advisor screens** (Section 6) are desktop-first but request a mobile browser variant (not app) after desktop is complete.
5. **Compliance elements** (disclaimer block, source badge, deflection banner) must be visually present in every screen that shows FAQ content — never omit for visual cleanliness.
6. **Don't simplify compliance:** If Stitch de-emphasizes disclaimers for visual polish, explicitly reinstate them — they are regulatory requirements, not optional UI decoration.

\---

*Generated from: `PRD\\\_MutualFund\\\_AdvisorIntelligenceSuite\\\_v1.0.md`*  
*Reference design system: `DESIGN.md`*

