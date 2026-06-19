# UX Flow Review Guide — Mutual Fund Advisor Intelligence Suite
# Used when reviewing Google Stitch-generated screen designs

---

## HOW TO USE THIS FILE

When design files are uploaded to this folder:
1. Open each design image alongside this file
2. Work through the checklist for that screen
3. Mark each item **PASS**, **FAIL**, or **N/A**
4. Log every FAIL with a severity rating and a one-line description of the problem
5. After all screens are reviewed, check the **Cross-Screen Consistency** section
6. Finally, walk through all 5 **End-to-End Journey Checks**

**Severity Ratings:**
- **P0 — Blocker:** PRD compliance violation, wrong navigation destination, missing required element (disclaimer, source badge). Must fix before build.
- **P1 — High:** Incorrect layout, wrong component used, confusing UX that would mislead an investor. Fix before Sprint handoff.
- **P2 — Low:** Visual inconsistency, minor spacing issue, cosmetic mismatch with design system. Fix when convenient.

---

## REVIEW TRACKING TABLE

Update status as each screen is reviewed.

| Screen | Name | Status | Issues Found |
|---|---|---|---|
| 1.1 | Home Page | `PASS` | None |
| 2.1 | Query Builder — Step 1: Intent | `PASS (P1)` | NavBar missing full nav links; step labels inconsistent; "matched" language on advisor card |
| 2.2 | Query Builder — Step 2A: Specific Question Topics | `PASS (P1)` | Step labels inconsistent with 2.1/2.3; NavBar missing full nav links |
| 2.3 | Query Builder — Step 2B: Learning Topics | `PASS (P1)` | Layout inconsistent with 2.2 (no card wrapper); step labels inconsistent; NavBar incomplete |
| 2.4 | Query Builder — Step 3: Routing / Advice Warning | `FAIL (P0)` | "Goal Type" / "Risk Profile" context cards imply risk profiling; step labels "Goal → Risk → Routing" |
| 3.1 | FAQ Centre — Main | `PASS (P1)` | "My Portfolio" in NavBar (out of scope); named-advisor sidebar panel |
| 3.2 | FAQ Centre — Compliance Deflection | `FAIL (P0)` | Sidebar text "We exclusively recommend Direct Plans" — direct investment recommendation |
| 3.3 | FAQ Centre — Out-of-Scope Scheme | `FAIL (P0)` | Amber/warning visual treatment — indistinguishable from compliance deflection; "Premium Insights" upsell not in PRD |
| 3.4 | FAQ Centre — Fee Explainer Detail | `FAIL (P0)` | Missing "Last checked" date and version number; disclaimer not in standard amber block format |
| 4.1 | Education Hub — Home | `PASS` | Best-executed investor NavBar in the set; all 5 sections present; confirm TER/Exit Load "most misunderstood" badges |
| 4.2 | Education Hub — Article View (v2) | `PASS (P1)` | Brand reads "Advisor Pro" instead of "Fundwise"; footer structure/branding differs from 4.1 |
| 5.1 | Voice Scheduler — Step 1: Greeting | `FAIL (P0)` | Real human photo as voice agent avatar; generic PII notice (doesn't name PAN/Aadhaar/folio) |
| 5.2 | Voice Scheduler — Step 2: Active Listening | `FAIL (P0)` | Title "Tell us your goals" + suitability tags (Education Fund/Balanced Risk/ESGreen); "Portfolio" in NavBar |
| 5.3 | Voice Scheduler — Step 2: FAQ Deflection Offer | `PASS (P1)` | NavBar inconsistent; only 3 steps shown vs 6-step flow elsewhere |
| 5.4 | Voice Scheduler — Step 3: Slot Selection | `PASS (P1)` | Step count inconsistent (3 vs 6); "curated based on preferences" implies advisor matching |
| 5.5 | Voice Scheduler — Step 4: Context Capture | `PASS (P1)` | Step labels include "KYC"/"Risk Profile"; "tailor your fund selection" language |
| 5.6 | Voice Scheduler — Step 5: Email Capture | `FAIL (P0)` | Named advisor + photo shown before booking confirmed; consent checkbox pre-checked |
| 5.7 | Voice Scheduler — Step 6: Booking Confirmation | `FAIL (P0)` | "Return to Dashboard" CTA — investors have no dashboard; no copy-to-clipboard on code |
| 5.8 | Voice Scheduler — Reschedule / Cancel | `PASS (P1)` | Booking code example "FW-8293-KYC1" doesn't match PRD "MF-XXXX" format |
| 6.1 | Advisor Login | `PASS (P1)` | "Advisor Pro" branding inconsistent with "Fundwise" used elsewhere |
| 6.2 | Advisor Dashboard — Meeting Queue | `FAIL (P0)` | Full investor names shown in queue (privacy violation); "Client Fund Data" link (portfolio access out of scope) |
| 6.3 | Advisor Dashboard — Pre-Meeting Brief | `PASS (P1)` | "Verified Identity" badge not in PRD spec |
| 6.4 | Advisor Dashboard — Availability Calendar | `PASS (P1)` | Booked slot shows partial investor name ("P. Sharma") instead of Booking Code only |
| 6.5 | Advisor Dashboard — Product Pulse | `FAIL (P0)` | "3 Recommended Fund Strategies" with return percentages — prohibited fund recommendation |
| 7.1 | Triage — Edge Case State | `PASS (P1)` | Navy loading card visually heavy for a background process |
| 8.1 | Sources / Corpus Transparency Page (v2) | `FAIL (P0)` | Scheme table now shows 20 rows but list doesn't match PRD Appendix A (wrong names, missing ELSS/Index/Mid-Cap, overwhelmingly Large Cap); brand reads "Fintell" |
| 8.2 | Post-Meeting Feedback Email | `PASS` | None — best-executed screen in the set |
| 8.3 | Booking Confirmation Email | `PASS` | None |

---

## ISSUE LOG

| # | Screen | Severity | Description | Resolution |
|---|---|---|---|---|
| 1 | 2.4 | P0 | "Goal Type" / "Risk Profile" context cards imply prohibited risk profiling (PRD §4.2) | Open |
| 2 | 2.4 | P0 | Step labels "Goal → Risk → Routing" reinforce the suitability-assessment framing | Open |
| 3 | 3.2 | P0 | Sidebar text "We exclusively recommend Direct Plans" — direct investment recommendation | Open |
| 4 | 3.3 | P0 | Amber/warning treatment identical to compliance deflection — must be neutral/gray | Open |
| 5 | 3.4 | P0 | Missing "Last checked" date stamp and version number | Open |
| 6 | 3.4 | P0 | Disclaimer rendered as plain text, not the standard amber disclaimer block | Open |
| 7 | 5.1 | P0 | Real human photograph used as voice agent avatar | Open |
| 8 | 5.2 | P0 | Title "Tell us your goals" + transcript tags (Education Fund/Balanced Risk/ESGreen) imply suitability profiling | Open |
| 9 | 5.2 | P0 | "Portfolio" link in NavBar — portfolio tracking is out of scope (PRD §14) | Open |
| 10 | 5.6 | P0 | Named advisor + photo shown before booking is confirmed | Open |
| 11 | 5.7 | P0 | "Return to Dashboard" CTA — investors have no dashboard (PRD §14) | Open |
| 12 | 6.2 | P0 | Full investor names shown in meeting queue — privacy violation (PRD F6 spec) | Open |
| 13 | 6.2 | P0 | "Client Fund Data" link — portfolio/fund data access out of scope | Open |
| 14 | 6.5 | P0 | "3 Recommended Fund Strategies" with return percentages — prohibited fund recommendation (PRD §4.2) | Open |
| 15 | 8.1 | P0 | **(v2 regen)** Scheme table shows 20 rows but list doesn't match PRD Appendix A — wrong scheme names, missing ELSS/Index Fund/Mid Cap categories, overwhelmingly Large Cap | Open — needs v3 |
| 16 | 2.1–2.4 | P1 | Step progress labels inconsistent across the 3 Query Builder screens | Open |
| 17 | 2.1, 2.2, 2.3, 5.1, 5.2 | P1 | Full investor NavBar (FAQ Centre / Education Hub / Book Advisor Call) missing or incomplete | Open |
| 18 | 3.1 | P1 | "My Portfolio" in NavBar — out of scope | Open |
| 19 | 5.2–5.6 | P1 | Step count inconsistent across Voice Scheduler screens (shows 3, 5, or 6 steps) | Open |
| 20 | 5.5 | P1 | "tailor your fund selection" language — reframes scheduler as a fund-selection tool | Open |
| 21 | 5.6 | P1 | Consent checkbox appears pre-checked — dark pattern | Open |
| 22 | 5.8 | P1 | Booking code example "FW-8293-KYC1" doesn't match PRD format "MF-XXXX" | Open |
| 23 | 6.3 | P1 | "Verified Identity" badge not in PRD spec | Open |
| 24 | 6.4 | P1 | Booked slot shows partial investor name instead of Booking Code only | Open |
| 25 | — | P1 | **(new, cross-screen)** Three different brand names used across the set: "Fundwise" (Home, Query Builder, FAQ Centre, Voice Scheduler, Education Hub Home), "Advisor Pro" (Advisor Login, Advisor Dashboard, Education Hub Article v2), "Fintell" (Sources v2) | Open |
| 26 | 4.2, 8.1 | P1 | **(v2 regen)** Footer column structure and branding differ from Education Hub Home (4.1) — both v2 screens use a different footer style | Open |

---

## SECTION 1 — SCREEN-BY-SCREEN CHECKLISTS

---

### Screen 1.1 — Home Page

**Layout & Structure**
- [ ] Full-width NavBar visible at top, navy (#1B3F7E) background
- [ ] Logo on left of NavBar, nav links on right
- [ ] "Book Advisor Call" is a pill button (saffron #E8922A), not a plain link
- [ ] Advisor login link is smaller text, far right of NavBar
- [ ] Hero is two-column: text left (55%), illustration right (45%)
- [ ] Illustration is abstract/minimal — no photos of money, coins, or trading screens
- [ ] "How It Works" section has exactly 3 cards side by side
- [ ] Featured Topic Strip has light teal background (#F0FAFB) with 4 pill chips
- [ ] Compliance strip is full-width amber (#FFF8E1), not a small card
- [ ] Footer is navy (#1B3F7E), not white or gray

**Content Accuracy**
- [ ] H1 headline reads: "Clear, factual information about mutual funds — no advice, no guesswork."
- [ ] Trust bar shows 3 items: source-cited answers, no investment advice, SEBI-compliant
- [ ] Compliance strip contains the word "does not constitute investment advice"
- [ ] Featured topic pills contain realistic fund-related topics (not placeholder text like "Topic 1")

**Navigation / CTAs**
- [ ] "Start with a Question" CTA → should lead to Query Builder (not FAQ directly)
- [ ] "Browse Education Hub" → should lead to Education Hub
- [ ] "Book Advisor Call" in NavBar → should lead to Voice Scheduler
- [ ] Featured topic pills → should lead to FAQ Centre with topic pre-filled
- [ ] "FAQ Centre" NavBar link → FAQ Centre
- [ ] "Education Hub" NavBar link → Education Hub
- [ ] Advisor login NavBar link → Advisor Login page

**PRD Compliance**
- [ ] No language suggesting a fund is "good", "better", or "recommended"
- [ ] No performance claims anywhere on the page
- [ ] The platform is framed as an information tool, not an advisory service

---

### Screen 2.1 — Query Builder: Step 1 (Intent Classification)

**Layout & Structure**
- [ ] Step progress indicator visible at top with 3 steps labelled
- [ ] Step 1 is active (filled navy circle), Steps 2 and 3 are inactive (outline)
- [ ] Exactly 3 intent cards, stacked vertically
- [ ] Each card has an icon (left), title, subtitle, and right-pointing arrow
- [ ] "No login required · No personal information collected" note visible below cards

**Card Content (exact wording per PRD F1)**
- [ ] Card 1: "I have a specific question about a fund or fee"
- [ ] Card 2: "I want to learn about mutual funds"
- [ ] Card 3: "I need to speak to an investment advisor"

**Card Visual Differentiation**
- [ ] Card 1 icon: teal-tinted (MagnifyingGlass or similar)
- [ ] Card 2 icon: navy-tinted (BookOpen or similar)
- [ ] Card 3 icon: saffron-tinted (CalendarBlank or similar)
- [ ] Each card has a distinct hover/selected border colour matching its icon colour

**Navigation / CTAs**
- [ ] Card 3 ("speak to an advisor") should visually indicate it routes directly — no Step 2 for this path
- [ ] No "Continue" button on this step — card selection triggers navigation
- [ ] Back/Home link available (investor should not get stranded)

**PRD Compliance (F1)**
- [ ] Builder accessible without any login or PII input
- [ ] No fields collecting name, phone, email, or any personal data on this step

---

### Screen 2.2 — Query Builder: Step 2A (Specific Question Topics)

**Layout & Structure**
- [ ] Step progress indicator: Step 1 complete (green checkmark), Step 2 active
- [ ] Back button visible top-left (ghost style, arrow icon)
- [ ] Exactly 5 topic pills/cards
- [ ] "Continue →" button visible below pills (should appear disabled until selection made)

**Topic Content (exact per PRD F1 Step 2A)**
- [ ] "Fees & charges" — with subtext mentioning TER, exit load, stamp duty
- [ ] "Scheme details" — NAV, lock-in, benchmark, fund manager
- [ ] "Processes" — how to invest, redeem, download statements
- [ ] "Regulatory questions" — SEBI, AMFI, KIM, SID
- [ ] "Something else" — free text option

**"Something else" State**
- [ ] If "Something else" is shown selected: a text input area is visible below the pills
- [ ] Helper text explains the query will be reviewed before routing
- [ ] The text input has a clear placeholder ("Describe what you'd like to know...")

**Navigation / CTAs**
- [ ] Back button → returns to Step 1 (Step 1 intent selection preserved, not reset)
- [ ] "Continue →" → routes to FAQ Centre with topic pre-filled

---

### Screen 2.3 — Query Builder: Step 2B (Learning Topics)

**Layout & Structure**
- [ ] Same layout as 2.2 (Step 1 complete checkmark, Step 2 active, back button)
- [ ] Exactly 5 topic pills — different content from 2A

**Topic Content (exact per PRD F1 Step 2B)**
- [ ] "Types of mutual funds"
- [ ] "How SIPs work"
- [ ] "Tax implications"
- [ ] "Understanding fees and costs"
- [ ] "My rights as an investor"

**Visual Distinction from 2A**
- [ ] This step is visually distinguishable from 2A (different heading text at minimum)
- [ ] Heading should reference "learning" not "questions"

**Navigation / CTAs**
- [ ] "Continue →" → routes to Education Hub (not FAQ Centre)

---

### Screen 2.4 — Query Builder: Step 3 (Routing / Advice Warning)

**Layout & Structure**
- [ ] Step progress indicator: Steps 1 and 2 complete, Step 3 active
- [ ] Two distinct visual states should be apparent in the design:
  - **Advice-seeking warning:** amber card prominent
  - **Routing transition:** success/loading state

**Advice-Seeking Warning State (Primary)**
- [ ] Card has amber/warning visual treatment (NOT gray, NOT navy) — amber background, amber/orange border
- [ ] Warning icon (shield or warning symbol) visible
- [ ] Heading clearly states this is about personalised advice
- [ ] Exactly two action buttons: "Book a call with an advisor" (primary, saffron) and "Continue to FAQ anyway" (secondary, outline)
- [ ] Small explanatory note below buttons about what FAQ can/cannot do

**CRITICAL Compliance Check**
- [ ] The warning card does NOT say "you cannot use this platform" — it offers a choice
- [ ] The "Continue to FAQ anyway" option is genuinely visible and accessible (not hidden or de-emphasised so much that the investor feels forced to book)
- [ ] No language implying the investor made a wrong choice

**Navigation / CTAs**
- [ ] "Book a call with an advisor" → routes to Voice Scheduler
- [ ] "Continue to FAQ anyway" → routes to FAQ Centre (investor's choice honoured)

---

### Screen 3.1 — FAQ Centre: Main Page

**Layout & Structure**
- [ ] Two-column layout clearly visible: main content ~65% left, sidebar ~35% right
- [ ] NavBar present ("FAQ Centre" should appear active/highlighted)
- [ ] Page header section with navy background (or navy-teal gradient) visible
- [ ] Search/query input bar prominent — not buried
- [ ] Sidebar has at least 2 visible panels (Fee Explainer + Covered Schemes)

**Answer Card (when answer is shown)**
- [ ] User's question shown at top of answer card (in a distinct bubble or label)
- [ ] Answer text is visually bounded (max 3 sentences implied by short text block)
- [ ] Source badge(s) visible — pill shape, blue (#EFF6FF background, #1E40AF text)
- [ ] Source URL visible as a clickable link with an external arrow icon
- [ ] **[P0] Disclaimer block MUST be present:** amber background (#FFF8E1), amber left border, ⚠️ icon
- [ ] "Book a call" ghost CTA link visible below disclaimer

**Fee Explainer Sidebar Panel**
- [ ] "Fee Explainer — This Week" label/chip visible
- [ ] 6 bullet points visible (not 5, not 7)
- [ ] 2 source badge links at bottom of explainer
- [ ] "Last checked: [date]" stamp visible
- [ ] Version number (e.g., "v4") visible

**Covered Schemes Sidebar Panel**
- [ ] Scheme list panel visible (expandable)
- [ ] "Why only 20 schemes?" link/tooltip accessible

**PRD Compliance (F2)**
- [ ] No "which fund is better" type content anywhere on this page
- [ ] The source badge links appear clickable (external link icon present)
- [ ] Disclaimer text is readable (min 13px, not tiny footnote)

---

### Screen 3.2 — FAQ Centre: Compliance Deflection State

**MOST IMPORTANT SCREEN — Compliance Critical**

**Visual Treatment**
- [ ] **[P0]** Deflection card has AMBER visual treatment (#FEF3C7 background, #D97706 border) — NOT gray, NOT navy, NOT the same style as the out-of-scope card (Screen 3.3)
- [ ] Warning/shield icon visible in amber colour
- [ ] Card appears ABOVE any other content in the main column (not at the bottom)

**Content**
- [ ] Heading clearly states this question needs personalised advice — NOT that the question is "wrong" or "not allowed"
- [ ] Body text explains WHY (SEBI regulations, personalised guidance)
- [ ] Suggestion chips showing related FACTUAL questions the investor COULD ask instead
- [ ] "Book a call with a SEBI-registered advisor" primary CTA (saffron button)
- [ ] Ghost link to Education Hub as an alternative

**PRD Compliance (F2)**
- [ ] **[P0]** This screen must NOT show a partial or full answer to the advice-seeking query — the deflection replaces the answer entirely
- [ ] **[P0]** The advice-seeking query text may be shown (grayed out) but no answer text appears
- [ ] Sidebar still visible (FAQ Centre layout maintained)

---

### Screen 3.3 — FAQ Centre: Out-of-Scope Scheme State

**CRITICAL: Must be visually distinct from Screen 3.2**

**Visual Treatment**
- [ ] **[P0]** Card has NEUTRAL/GRAY visual treatment — dashed border, gray icon, neutral background (#F7F8FA) — NOT amber like the compliance deflection card
- [ ] Information circle icon (NOT a warning icon) — this is a coverage limitation, not a compliance refusal
- [ ] The visual tone communicates "we don't have this yet" not "you asked something wrong"

**Content**
- [ ] Card heading says something like "We don't have verified data for this scheme yet" — not "We cannot answer this"
- [ ] Two links visible: AMC website link + AMFI scheme search link
- [ ] "View covered schemes" link/button present
- [ ] Tone is helpful and informative, not restrictive

**PRD Compliance (F2)**
- [ ] **[P0]** No answer text for the out-of-scope scheme — card replaces the answer entirely
- [ ] The card does NOT use compliance/regulatory language (this is about corpus coverage, not advice rules)

---

### Screen 3.4 — Fee Explainer Detail Page

**Layout & Structure**
- [ ] Breadcrumb visible: "FAQ Centre > Fee Explainer"
- [ ] "WEEKLY FEE EXPLAINER" chip/label visible (pill style, blue)
- [ ] H1 title is a fee term (e.g., "Understanding Exit Load: What It Is and How It Affects You")
- [ ] "Last checked: [date]" and "Version: v[N]" both visible in meta row

**Content**
- [ ] Exactly 6 bullet points (count them)
- [ ] Each bullet has a numbered circle indicator (not plain text bullets)
- [ ] Bullets are short — one concept per bullet, no compound sentences
- [ ] 2 source badge links at bottom (not 1, not 3)
- [ ] **[P0]** Disclaimer block present (amber, with ⚠️ icon)
- [ ] "Ask in FAQ" and "Book a call" CTAs present at bottom

---

### Screen 4.1 — Education Hub: Home Page

**Layout & Structure**
- [ ] Hero section with navy-teal gradient, search bar centered
- [ ] Exactly 5 content sections visible (scroll implied)
- [ ] Section 1 (Fund Categories): card grid — should show 8+ cards
- [ ] Section 3 (Fees & Costs): TER and Exit Load cards have a "Most misunderstood" amber badge
- [ ] Compliance strip visible near footer (amber background, compliance text)

**Section Headings (verify all 5 are present)**
- [ ] Section 1: Fund Categories (or "Mutual Fund Categories")
- [ ] Section 2: Key Concepts
- [ ] Section 3: Fees & Costs (or "Fee & Cost Education")
- [ ] Section 4: Investor Processes
- [ ] Section 5: Investor Rights

**Category Cards (Section 1)**
- [ ] Each card shows: icon, category name, equity/debt/hybrid tag pill, hover state implied
- [ ] At least 8 equity category cards visible (Large Cap, Mid Cap, Small Cap, Flexi Cap, Multi Cap, ELSS, Sectoral, Index)

**PRD Compliance (F3)**
- [ ] No card has a "best" or "recommended" label
- [ ] No performance comparison between fund types implied
- [ ] Compliance strip text matches PRD §4.3 language

---

### Screen 4.2 — Education Hub: Article View

**Layout & Structure**
- [ ] Two-column layout: article content 70% left, sidebar 30% right
- [ ] Breadcrumb visible at top (Education Hub > Section > Article Title)
- [ ] Category tag pill visible in article header
- [ ] Source badge(s) visible in article header
- [ ] "Last reviewed: [date]" meta visible

**Article Body**
- [ ] Definition callout boxes (teal left border, light teal background) present in body
- [ ] Worked example box (dashed border, "Example" label) present — references a real Top 20 scheme name
- [ ] Source citations visible within/after body text
- [ ] **[P0]** Disclaimer block at bottom of article (amber, ⚠️ icon)
- [ ] If article involves NAV/returns data: performance disclaimer also present

**Sidebar**
- [ ] Table of contents (linking to sections within the article) visible
- [ ] "Related articles" section with 2–3 article cards
- [ ] Fee Explainer mini panel visible

**CTAs (Required on every article)**
- [ ] **[P0]** "Ask in FAQ Centre →" CTA present
- [ ] **[P0]** "Book a call with an advisor →" CTA present
- [ ] Both are ghost/text links, not primary buttons

---

### Screen 5.1 — Voice Scheduler: Step 1 (Greeting)

**Layout & Structure**
- [ ] 6-step progress indicator visible at top (Steps 1 active, 2–6 inactive)
- [ ] Product Pulse theme banner visible (blue #EFF6FF background, 💡 icon + theme text)
- [ ] Voice agent card prominent (avatar/icon, speech bubble with greeting text)
- [ ] Microphone button visible (72px circle, prominent position)
- [ ] Text input alternative visible below the microphone button
- [ ] "— or —" divider between mic button and text input

**PII Notice**
- [ ] **[P0]** PII warning visible: "Please don't share account numbers, PAN, Aadhaar, or portfolio details here"
- [ ] Warning is visible without scrolling (not hidden at the bottom)

**Content**
- [ ] Speech bubble contains a greeting that references the Product Pulse theme
- [ ] Greeting text is warm/conversational, not robotic
- [ ] Page heading explains this is for booking a call with a SEBI-registered advisor

**Navigation**
- [ ] Step 1 of 6 clearly indicated
- [ ] Back/Home link available

---

### Screen 5.2 — Voice Scheduler: Step 2 (Active Listening)

**Layout & Structure**
- [ ] Microphone button in ACTIVE state (teal filled background, white icon — different from idle state)
- [ ] Pulsing rings animation implied around the microphone button (concentric circles)
- [ ] Waveform visualization present below the button (5 animated bars, teal colour)
- [ ] "Listening..." label below the button

**Live Transcript Area**
- [ ] Transcript preview card visible below waveform
- [ ] "Transcribing..." or similar label above preview text
- [ ] Sample transcript text shown (not empty)

**Controls**
- [ ] "Stop recording" button visible (secondary, not prominent)
- [ ] Step 2 of 6 active in progress indicator

---

### Screen 5.3 — Voice Scheduler: Step 2 (FAQ Deflection Offer)

**Layout & Structure**
- [ ] Transcript confirmed card visible (showing what the investor said)
- [ ] Triage result card visible below transcript (amber/warning treatment)
- [ ] Two action buttons clearly visible: "Take me to FAQ" (primary) and "I'd still like to speak to an advisor" (secondary)

**Critical UX Check**
- [ ] **[P0]** The "I'd still like to speak to an advisor" option must be clearly visible — not hidden, not de-emphasised. The investor's choice to proceed with booking must be easy to exercise.
- [ ] Deflection is an offer, not a block

---

### Screen 5.4 — Voice Scheduler: Step 3 (Slot Selection)

**Layout & Structure**
- [ ] Exactly 3 slot cards visible
- [ ] Each slot card: calendar icon, day + date, time + timezone
- [ ] One slot shown in selected state (different border/background from unselected)
- [ ] "Continue →" button visible below slots

**Slot Card Selected State**
- [ ] Selected card: teal border (#0F7B8C), light teal background (#F0FAFB)
- [ ] Radio button or checkmark indicator on selected card
- [ ] Unselected cards: neutral border (#E2E8F0), white background

---

### Screen 5.5 — Voice Scheduler: Step 4 (Context Capture — Optional)

**Layout & Structure**
- [ ] Textarea visible (for optional context)
- [ ] Character counter visible (e.g., "0 / 300")
- [ ] PII warning block visible below textarea (amber inline, not a page-level warning)

**PII Warning**
- [ ] **[P0]** PII warning text mentions: PAN, Aadhaar, folio number, account details
- [ ] Warning has amber/warm styling (not red — this is precautionary, not an error)

**Navigation**
- [ ] "Add context & Continue" primary button
- [ ] "Skip — Continue without context" ghost link — genuinely visible and easy to find
- [ ] **[P0]** The skip option must not be hidden or styled to discourage use — context is optional

---

### Screen 5.6 — Voice Scheduler: Step 5 (Email Capture)

**Layout & Structure**
- [ ] Email input field with label "Your email address" (or similar)
- [ ] Consent text visible below input (explaining the limited use of email)
- [ ] "Confirm Booking →" primary button (saffron, #E8922A)

**Consent Text**
- [ ] **[P0]** Consent text must state: confirmation email + feedback request only. NOT for marketing.
- [ ] Consent text must be readable (not 8px fine print)

---

### Screen 5.7 — Voice Scheduler: Step 6 (Booking Confirmation)

**Most Important Output Screen**

**Success Indicators**
- [ ] Checkmark/success icon prominent (green #2D8653)
- [ ] "Your booking is confirmed!" or similar clear confirmation message
- [ ] Booking Code displayed in large monospace font (format: MF-XXXX)
- [ ] Copy-to-clipboard button next to booking code

**Booking Details Card**
- [ ] Booking Code visible in the details card (monospace, large)
- [ ] Topic category shown
- [ ] Date and time shown
- [ ] Advisor name or "SEBI-registered advisor" shown

**Email Confirmation Strip**
- [ ] Green strip confirming email was sent
- [ ] Investor's email address visible (or at least "to [email]")

**PRD Compliance**
- [ ] **[P0]** "Please keep this code — your advisor will reference it at the start of your call" note visible
- [ ] Reschedule/cancel instructions or link available

**Navigation**
- [ ] "Return to Home" button/link
- [ ] "Browse Education Hub" ghost link (something useful to do while waiting)

---

### Screen 5.8 — Voice Scheduler: Reschedule / Cancel

**Layout & Structure**
- [ ] Form with exactly 2 fields: Booking Code + Email address
- [ ] "Look up my booking" button
- [ ] After lookup: booking details card visible
- [ ] "Reschedule" and "Cancel" actions clearly separated

**Cancel UX**
- [ ] Cancel button uses destructive styling (red text or red outline) — clearly different from Reschedule
- [ ] Cancellation within 2h of slot should show a warning (note or disabled state)

**PRD Compliance**
- [ ] **[P0]** Cancellation requires BOTH booking code AND email — not booking code alone
- [ ] "Cancellations must be made at least 2 hours before the scheduled slot" note visible

---

### Screen 6.1 — Advisor Login

**Layout & Structure**
- [ ] Split-screen layout: navy left panel (50%), white right form (50%)
- [ ] Left panel: platform logo, value props (3 items), SEBI note at bottom
- [ ] Right panel: form only — "Advisor Log In" heading, email field, button

**Authentication Flow**
- [ ] **[P0]** No password field anywhere — email + OTP only
- [ ] "Send OTP" button clearly the primary action after email entry
- [ ] OTP input visible (6-digit format implied by field design)
- [ ] "Resend OTP" link visible (smaller, with countdown implication)

**Content**
- [ ] Left panel shows: "For SEBI-registered Investment Advisors only" note
- [ ] Session timeout note visible: "Sessions time out after 30 minutes of inactivity"
- [ ] SEBI registration context establishes this is an advisor-only space

---

### Screen 6.2 — Advisor Dashboard: Meeting Queue

**Layout & Structure**
- [ ] Fixed left sidebar (navy, 240px) clearly separated from main content
- [ ] Sidebar nav: 4 items visible (Meeting Queue, Availability Calendar, Product Pulse, Settings)
- [ ] Active item (Meeting Queue) has visual indicator (left border accent or background highlight)
- [ ] Advisor name + "RIA" badge + logout link at bottom of sidebar
- [ ] Top bar: page title + session timer ("Session: Xm remaining") + notification bell

**Product Pulse Pinned Card**
- [ ] **[P0]** Pulse card visible ABOVE the meeting queue (pinned at top of main area)
- [ ] Pulse card shows: top theme text, query count, "Read full Pulse →" link
- [ ] Pulse card has distinct blue (#EFF6FF) or highlighted styling

**Meeting Queue Table**
- [ ] Table has columns: Booking Code, Topic Category, Scheduled Time, Status, Actions
- [ ] Booking Code column uses monospace font (#1B3F7E)
- [ ] Topic Category shows as a pill chip (coloured tag)
- [ ] Status column shows coloured badges: Confirmed (green), Pending (amber), Cancelled (red), Completed (gray)
- [ ] Actions column has: "View Brief" link, "Reschedule" link, "Complete" button
- [ ] Filter bar above table: status filter pills + date input + topic dropdown

**Navigation**
- [ ] "View Brief" → Pre-Meeting Brief page for that booking
- [ ] Sidebar links navigate to their respective pages
- [ ] Logout link accessible

---

### Screen 6.3 — Advisor Dashboard: Pre-Meeting Brief

**Layout & Structure**
- [ ] Same sidebar as 6.2 (Meeting Queue nav item no longer active — or stays active)
- [ ] Breadcrumb: "Meeting Queue > Pre-Meeting Brief: MF-XXXX"
- [ ] Brief header card: booking code (monospace, large), status badge, date/time
- [ ] 5 content sections with dividers between them

**5 Required Data Sections (all must be present)**
- [ ] **Section 1:** Topic Category — displays the category as a label
- [ ] **Section 2:** Investor's Context — either shows optional context text in italic, OR "Not shared" in muted text
- [ ] **Section 3:** FAQ Queries from Session — shows the questions asked before booking (as chips/pills), OR "None recorded"
- [ ] **Section 4:** Product Pulse Top Theme — this week's top investor theme (aggregate, not investor-specific)
- [ ] **Section 5:** Relevant Education Hub Articles — 2 article links

**PII Absence Note**
- [ ] **[P0]** Gray info box at bottom explicitly stating what the brief does NOT contain: PAN, Aadhaar, folio, portfolio, AI advisory recommendation
- [ ] This note must be visually present — not hidden or removed

**PRD Compliance (F6)**
- [ ] **[P0]** No field labelled "PAN", "Aadhaar", "portfolio value", "folio number" appears anywhere
- [ ] **[P0]** No "AI recommendation" or "suggested action" field appears
- [ ] Session note on FAQ queries: "Session data only — not stored after call"

**Actions**
- [ ] "Mark as Complete" primary button (saffron)
- [ ] "Reschedule" secondary button
- [ ] "Back to Queue" ghost link

---

### Screen 6.4 — Advisor Dashboard: Availability Calendar

**Layout & Structure**
- [ ] Same sidebar as 6.2
- [ ] Calendar is a 5-day week view (Mon–Fri), not a monthly calendar
- [ ] Time slots visible (8AM–7PM, 30-min granularity implied)
- [ ] "Add time block" button visible in top area (primary or secondary style)

**Slot Colour Coding (all 3 states should be visible)**
- [ ] Available slots: teal/light teal treatment with "Open" label
- [ ] Booked slots: navy/blue treatment with Booking Code label visible
- [ ] Blocked slots: striped/gray treatment with "Blocked" label

**"Add Slot" Modal (if shown)**
- [ ] Day selector (7 day pills), time range pickers, recurring toggle
- [ ] "Save slot" and "Cancel" buttons

---

### Screen 6.5 — Advisor Dashboard: Product Pulse

**Layout & Structure**
- [ ] Same sidebar as 6.2, "Product Pulse" nav item active
- [ ] "WEEKLY PRODUCT PULSE" label chip at top of report
- [ ] Report date and "Generated automatically..." subtitle visible
- [ ] "Previous Pulse →" link in top area for accessing history

**6 Required Sections (all must be present)**
- [ ] **Section 1:** Top Investor Themes — exactly 3 theme cards with: rank circle, theme text, query count (in saffron), representative question
- [ ] **Section 2:** Investor Quotes — at least 1 quote card in speech-bubble style; quotes use "[Investor]" and "[Scheme]" placeholders (no real names)
- [ ] **Section 3:** Key Observation — 1 paragraph, short
- [ ] **Section 4:** Fee Confusion Spotlight — highlighted fee term, amber/warm background
- [ ] **Section 5:** Product Recommendations — exactly 3 numbered cards with recommendation text + "Based on: X queries" data point
- [ ] **Section 6:** Corpus Refresh Status — green success block confirming Fee Explainer updated

**PRD Compliance (F7)**
- [ ] **[P0]** No investor names, emails, or identifiable information in any quote
- [ ] **[P0]** "[Investor]" placeholder used for all investor references in quotes
- [ ] **[P0]** "[Scheme]" placeholder used for any scheme names in quotes
- [ ] Exactly 3 product recommendations — not 2, not 4

---

### Screen 7.1 — Triage: Edge Case State

**Layout & Structure**
- [ ] Shown within FAQ Centre layout (2-column, sidebar visible)
- [ ] Edge case card appears in the main content column (where the answer would normally be)
- [ ] Card uses NEUTRAL styling (gray/neutral — NOT amber like compliance deflection, NOT dashed like out-of-scope)

**Content**
- [ ] Message communicates "we've taken our best guess at routing" — not an error
- [ ] Routing destination mentioned (FAQ or Education Hub)
- [ ] "Book a call instead" ghost link available
- [ ] Tone is helpful, not alarming

---

### Screen 8.1 — Sources / Corpus Transparency Page

**Layout & Structure**
- [ ] Full-width page with NavBar
- [ ] Page heading clearly about sources/transparency
- [ ] Source categories listed as sections (AMFI, SEBI, AMC websites, mfapi.in)
- [ ] Top 20 Schemes table visible (scheme name, category, AMC columns)
- [ ] Source refresh policy text visible

**Content**
- [ ] All 20 schemes listed in the table (count them)
- [ ] At least one real AMFI URL shown as an example source
- [ ] "Why only 20 schemes?" explanation present

---

### Screen 8.2 — Post-Meeting Feedback Email

**Layout & Structure**
- [ ] Email is 600px wide, centered on a gray email client background (not a full-width page)
- [ ] Header: navy (#1B3F7E) background, white logo
- [ ] Single question prominent in body: "How useful was your call today?"
- [ ] Exactly 3 clickable button options inline: "Very useful" (green), "Somewhat useful" (amber), "Not useful" (red)

**PRD Compliance**
- [ ] **[P0]** No investor name appears in the greeting (PII protection — "Hello," not "Hello Priya,")
- [ ] Unsubscribe link visible in footer
- [ ] "Your response is anonymous" note present

---

### Screen 8.3 — Booking Confirmation Email

**Layout & Structure**
- [ ] Email is 600px wide, centered on gray email client background
- [ ] Header: navy background, white logo, "Booking Confirmed ✓" label
- [ ] Booking Code displayed LARGE in monospace (JetBrains Mono style) — this is the most important piece of information
- [ ] Booking code is in a bordered/highlighted box
- [ ] Topic, date/time, and advisor all listed below the code

**PRD Compliance**
- [ ] Booking code format visible as MF-XXXX (4 characters after MF-)
- [ ] "Please share this Booking Code with your advisor at the start of your call" note visible
- [ ] Reschedule/cancel link available
- [ ] Unsubscribe or "email preference" link in footer
- [ ] **[P0]** No financial details, portfolio info, or PII beyond the booking itself

---

## SECTION 2 — CROSS-SCREEN CONSISTENCY CHECKS

Run these checks AFTER reviewing all individual screens.

### 2.1 NavBar Consistency
- [ ] NavBar is identical (same height, same navy, same logo placement, same link order) across ALL investor-facing screens: Home, Query Builder, FAQ Centre, Education Hub, Voice Scheduler, Sources page
- [ ] "FAQ Centre" and "Education Hub" links present on all investor pages
- [ ] "Book Advisor Call" saffron pill present on all investor pages
- [ ] Advisor login link present on all investor pages

### 2.2 Disclaimer Block Consistency
- [ ] Disclaimer block has IDENTICAL visual treatment on all screens it appears: amber background, left amber border, ⚠️ icon, same font size
- [ ] Check: FAQ Centre answer card, Education Hub article, Fee Explainer detail page
- [ ] The disclaimer is never styled differently to look less prominent on any screen

### 2.3 Source Badge Consistency
- [ ] Source badges look identical on all screens: same pill shape, same blue (#EFF6FF / #1E40AF), same external link icon
- [ ] Check: FAQ Centre answer card, Education Hub article header, Fee Explainer panel

### 2.4 Button Style Consistency
- [ ] Primary buttons (saffron #E8922A) look identical across all screens
- [ ] Secondary (navy outline) buttons look identical across all screens
- [ ] Ghost/text links (teal) look identical across all screens

### 2.5 Advisor Dashboard Shell Consistency
- [ ] Sidebar is identical (same width, same navy, same nav items, same bottom section) across screens 6.2, 6.3, 6.4, and 6.5
- [ ] Top bar is consistent across all 4 dashboard pages
- [ ] Active nav item indicator is the same visual treatment across all 4 pages

### 2.6 Compliance vs. Out-of-Scope Visual Distinction
- [ ] Screen 3.2 (Compliance Deflection) and Screen 3.3 (Out-of-Scope) look clearly different from each other
- [ ] 3.2 = amber/warning → 3.3 = gray/neutral: there must be no ambiguity
- [ ] If both screens were shown side by side, a user could immediately tell which is a compliance issue and which is a coverage issue

### 2.7 Voice Scheduler Step Progression
- [ ] Step progress indicator advances correctly across screens 5.1→5.2→5.3→5.4→5.5→5.6→5.7
- [ ] The same 6-step indicator is present on all Voice Scheduler screens
- [ ] The card/content area is consistent width and placement across all steps

### 2.8 Typography Consistency
- [ ] H1 headings appear to be the same size and weight across all screens
- [ ] Body text appears to be the same size across all screens
- [ ] Booking codes (MF-XXXX) always appear in monospace font on screens 5.7, 6.2, 6.3, 8.3

---

## SECTION 3 — END-TO-END JOURNEY CHECKS

Walk through each PRD journey using the generated screens. Verify the complete flow makes sense visually and navigationally.

---

### Journey 1: Investor — Factual FAQ Query (PRD §10 Journey 1)

**Screens involved:** 1.1 → 2.1 → 2.2 → 3.1 (answered state)

Walk:
1. Home page (1.1): Can investor clearly find how to ask a specific question? Is the "Start with a Question" CTA obvious?
2. Query Builder Step 1 (2.1): Do the 3 intent cards make it clear which to pick for a fee question?
3. Query Builder Step 2A (2.2): Is "Fees & charges" a clearly available option?
4. FAQ Centre (3.1): Does the answered state show the answer, source badge, and disclaimer together as a coherent unit?

**Journey check:**
- [ ] Each step has a clear "next" action — investor never gets stuck
- [ ] The flow feels like 3 steps, not more
- [ ] The answered FAQ state clearly separates: answer / source / disclaimer / booking CTA (in that visual order)
- [ ] The investor can see the source badge and know where the answer came from

---

### Journey 2: Investor — Education Browsing (PRD §10 Journey 2)

**Screens involved:** 1.1 → 2.1 → 2.3 → 4.1 → 4.2 → (back to 3.1 via CTA)

Walk:
1. Home (1.1): "Browse Education Hub" CTA present?
2. Query Builder Step 1 (2.1): "I want to learn" card clearly different from "I have a question"?
3. Query Builder Step 2B (2.3): Learning topic options clearly educational in tone?
4. Education Hub Home (4.1): Does landing here feel like a library/learning space, not a FAQ search?
5. Education Hub Article (4.2): Does every article end with "Ask in FAQ" and "Book a call" CTAs?

**Journey check:**
- [ ] The Education Hub feels distinct from the FAQ Centre (different visual purpose: proactive discovery vs. reactive Q&A)
- [ ] Every article provides a clear path back to FAQ or to booking
- [ ] The "Ask in FAQ →" CTA on the article would logically carry the article's topic forward to the FAQ Centre

---

### Journey 3: Investor — Voice Appointment Booking (PRD §10 Journey 3)

**Screens involved:** 5.1 → 5.2 → 5.3 (if factual) → 5.4 → 5.5 → 5.6 → 5.7

Walk:
1. Step 1 (5.1): Is the Pulse theme banner helpful context? Is the mic button the obvious first action?
2. Step 2 (5.2): Does the active listening state feel different enough from Step 1 (idle)?
3. Step 2 FAQ offer (5.3): If Stitch generated this, is the offer gentle? Is "speak to advisor anyway" accessible?
4. Step 3 (5.4): Do the 3 slot cards feel like a real choice (not just 3 identical-looking blocks)?
5. Step 4 (5.5): Is "Skip" genuinely easy to find? Is the PII warning present without being alarming?
6. Step 5 (5.6): Is the consent text readable, not tiny?
7. Step 6 (5.7): Does the booking code feel important and memorable? Is the success state satisfying?

**Journey check:**
- [ ] 6 steps feel manageable — not overwhelming for an investor booking their first advisor call
- [ ] Each step has exactly one primary action (mic button, slot card, continue button) — no decision paralysis
- [ ] The booking code in Step 6 is the most prominent element on the confirmation screen
- [ ] The investor ends the journey knowing: their code, their slot, that a confirmation was sent

---

### Journey 4: Advisor — Pre-Meeting Preparation (PRD §10 Journey 4)

**Screens involved:** 6.1 → 6.2 → 6.3 → (mark complete) → back to 6.2

Walk:
1. Login (6.1): Does OTP-only authentication feel secure and easy?
2. Dashboard (6.2): Can the advisor see all upcoming meetings at a glance? Is the Pulse card useful?
3. Pre-Meeting Brief (6.3): Does the brief give the advisor what they need in under 60 seconds of reading?
4. After marking complete: Does the advisor return to the queue with the meeting status updated?

**Journey check:**
- [ ] The Pre-Meeting Brief (6.3) feels like a preparation tool, not a data dump — sections are scannable
- [ ] The "PII not included" note at the bottom of the brief (6.3) does not feel alarming — it reassures the advisor about their liability boundary
- [ ] The advisor can tell at a glance from the queue (6.2) which meetings are today vs. future

---

### Journey 5: Product Pulse — Intelligence Loop (PRD §10 Journey 5)

**Screens involved:** 6.5 (Pulse report) → 3.4 (Fee Explainer updated) → 5.1 (Voice greeting uses theme) → 6.2 (Pulse pinned card)

Walk:
1. Pulse report (6.5): Can the advisor understand the key insights in under 2 minutes of reading?
2. Fee Explainer (3.4): Does the version number (e.g., "v4") and "Last checked" date imply it was recently updated by the Pulse?
3. Voice Scheduler greeting (5.1): Does the Pulse theme banner in Step 1 give the investor helpful context about why they might be booking?
4. Pulse pinned card in dashboard (6.2): Is the pinned card a useful "at a glance" summary, or does it repeat too much?

**Journey check:**
- [ ] The Pulse report (6.5) sections are in a logical order: what happened → what was said → what it means → what to do
- [ ] The Fee Explainer version number/date on screen 3.4 creates a sense of freshness and currency
- [ ] The Pulse theme on screen 5.1 feels helpful to the investor ("ah, others are confused about this too") not like surveillance

---

## SECTION 4 — FINAL SIGN-OFF CHECKLIST

After all screens and journeys are reviewed, confirm:

**Compliance**
- [ ] Every FAQ answer state (Screen 3.1) has a disclaimer block — no exceptions
- [ ] Every Education Hub article (Screen 4.2) has a disclaimer block — no exceptions
- [ ] Compliance deflection (Screen 3.2) never shows an answer to an advice-seeking query
- [ ] Out-of-scope state (Screen 3.3) never shows an answer about a non-corpus scheme
- [ ] Pre-Meeting Brief (Screen 6.3) shows the PII absence note
- [ ] Booking confirmation email (Screen 8.3) shows no PII beyond booking details
- [ ] Feedback email (Screen 8.2) uses no investor name

**UX Flow**
- [ ] All 5 journeys can be walked from start to finish using the generated screens
- [ ] No journey has a dead end (a screen with no clear "next" action)
- [ ] Every screen has a way to exit or go back (except the Booking Confirmation — Step 6 of 5.7)

**Design System**
- [ ] Saffron (#E8922A) is used ONLY for primary CTAs — not for headings, backgrounds, or decorative elements
- [ ] Navy (#1B3F7E) is used for NavBar, Advisor sidebar, and trust elements — not for body text
- [ ] Amber/disclaimer colour (#FFF8E1) is used ONLY for compliance elements — not for general highlighting
- [ ] Dashed borders are used ONLY for the out-of-scope card (3.3) — not elsewhere

**P0 Issues Must Be Resolved Before Build**
- [ ] All items marked [P0] in this document have been reviewed
- [ ] Any [P0] failures are logged in the Issue Log at the top of this file with resolution path

---

*Generated for: Mutual Fund Advisor Intelligence Suite*  
*Reference: PRD §8 (Feature Specs), §10 (User Journeys), §12 (Acceptance Criteria), §4 (Regulatory Framework)*
