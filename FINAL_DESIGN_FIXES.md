# Final Design Fixes — Mutual Fund Advisor Intelligence Suite
# Consolidated change list + screen-wise Stitch regeneration prompts

**Document version:** 1.0 — 2026-06-19  
**Based on:** `DESIGN_REVIEW.md` v2.0 (2026-06-19)  
**Purpose:** This is the last design pass before implementation (`ImplementationPlan.md` Sprint 1). Every item below must be fixed and re-reviewed before Sprint 1 starts.

> ⚠️ **Two screens require a v3 regeneration, not a v1 or v2 prompt:**
> - **Screen 4.2 — Education Hub Article (TER)** → use the prompt under **"Screen 4.2 — Education Hub Article (TER) — v3"** below. Output folder should be saved as `education_hub_ter_article_desktop_v3`.
> - **Screen 8.1 — Sources / Corpus Transparency Page** → use the prompt under **"Screen 8.1 — Sources / Corpus Transparency Page — v3"** below. Output folder should be saved as `sources_corpus_transparency_desktop_v3`.
>
> Do **not** reuse the prompts from `MISSING_SCREEN_PROMPTS.md` for these two screens — those were the v1/v2 prompts and are now superseded. Only the prompts in **this file** contain the brand-name fix ("Fundwise") and, for 8.1, the locked 20-scheme list.

---

## SCREEN INVENTORY — CONFIRMING NO MISSING SCREENS

All 28 planned screens exist in `STITCH_DESIGNS`. None are missing.

| # | Screen | Folder | Needs fix? |
|---|---|---|---|
| 1.1 | Home Page | `home_page_desktop` | No — clean |
| 2.1 | Query Builder Step 1: Intent | `step_1_intent_selection_desktop` | Yes |
| 2.2 | Query Builder Step 2A: Specific Question Topics | `step_2a_topic_narrowing_faq_desktop` | Yes |
| 2.3 | Query Builder Step 2B: Learning Topics | `step_2b_topic_narrowing_learning_desktop` | Yes |
| 2.4 | Query Builder Step 3: Routing/Advice Warning | `step_3_routing_compliance_desktop` | Yes — P0 |
| 3.1 | FAQ Centre Main | `faq_centre_main_page_desktop` | Yes |
| 3.2 | FAQ Centre Compliance Deflection | `faq_centre_compliance_deflection_desktop` | Yes — P0 |
| 3.3 | FAQ Centre Out-of-Scope Scheme | `faq_centre_out_of_scope_scheme_desktop` | Yes — P0 |
| 3.4 | Fee Explainer Detail | `faq_centre_fee_explainer_detail_desktop` | Yes — P0 |
| 4.1 | Education Hub Home | `education_hub_home_page_desktop` | No — clean |
| 4.2 | Education Hub Article (v2) | `education_hub_ter_article_desktop_v2` | Yes — needs v3 |
| 5.1 | Voice Scheduler Step 1: Greeting | `voice_scheduler_step_1_greeting_desktop` | Yes — P0 |
| 5.2 | Voice Scheduler Step 2: Topic Capture | `voice_scheduler_step_2_topic_capture_desktop` | Yes — P0 |
| 5.3 | Voice Scheduler FAQ Deflection Offer | `voice_scheduler_faq_deflection_desktop` | Yes |
| 5.4 | Voice Scheduler Step 3: Slot Selection | `voice_scheduler_step_3_slot_selection_desktop` | Yes |
| 5.5 | Voice Scheduler Step 4: Context Capture | `voice_scheduler_step_4_context_capture_desktop` | Yes |
| 5.6 | Voice Scheduler Step 5: Email Capture | `voice_scheduler_step_5_email_capture_desktop` | Yes — P0 |
| 5.7 | Voice Scheduler Step 6: Confirmation | `voice_scheduler_step_6_confirmation_desktop` | Yes — P0 |
| 5.8 | Voice Scheduler Reschedule/Cancel | `voice_scheduler_manage_booking_desktop` | Yes |
| 6.1 | Advisor Login | `advisor_login_desktop` | Yes |
| 6.2 | Advisor Dashboard Meeting Queue | `advisor_dashboard_meeting_queue_desktop` | Yes — P0 |
| 6.3 | Advisor Dashboard Pre-Meeting Brief | `advisor_dashboard_pre_meeting_brief_desktop` | Yes |
| 6.4 | Advisor Dashboard Availability Calendar | `advisor_dashboard_availability_calendar_desktop` | Yes |
| 6.5 | Advisor Dashboard Product Pulse | `advisor_dashboard_product_pulse_desktop` | Yes — P0 |
| 7.1 | Triage Edge Case | `triage_edge_case_escalation_desktop` | Yes — minor |
| 8.1 | Sources / Corpus Transparency (v2) | `sources_corpus_transparency_desktop_v2` | Yes — needs v3, P0 |
| 8.2 | Post-Meeting Feedback Email | `post_meeting_feedback_email_desktop` | No — clean |
| 8.3 | Booking Confirmation Email | `booking_confirmation_email_desktop` | No — clean |

**24 of 28 screens need at least one fix. 4 screens (1.1, 4.1, 8.2, 8.3) are clean and require no further action.**

---

## CANONICAL DECISION — BRAND NAME

Three different brand names currently exist across the set: **"Fundwise"** (Home, Query Builder, FAQ Centre, Voice Scheduler, Education Hub Home), **"Advisor Pro"** (Advisor Login, Advisor Dashboard screens, Education Hub Article v2), and **"Fintell"** (Sources v2).

**Decision: standardize on "Fundwise" everywhere** — it's already used on the majority of screens (8 of 28) including the Home page, which sets the brand identity. Every prompt below that touches branding instructs Stitch to use "Fundwise."

---

## FULL CHANGE LIST (21 distinct issues, 24 screens affected)

| # | Severity | Screen(s) | Change |
|---|---|---|---|
| 1 | P0 | 2.4 | Remove "Goal Type" / "Risk Profile" context cards — prohibited risk profiling |
| 2 | P0 | 2.4 | Fix step labels — currently "Goal → Risk → Routing" |
| 3 | P0 | 3.2 | Remove "We exclusively recommend Direct Plans" — prohibited recommendation |
| 4 | P0 | 3.3 | Change amber/warning treatment to neutral/gray |
| 5 | P0 | 3.4 | Add "Last checked" date + version number; fix disclaimer to standard amber block |
| 6 | P0 | 5.1 | Replace real human photo avatar with abstract icon |
| 7 | P0 | 5.2 | Remove "Tell us your goals" framing + suitability tags on transcript |
| 8 | P0 | 5.6 | Remove pre-assigned named advisor before booking confirmation |
| 9 | P0 | 5.7 | Change "Return to Dashboard" → "Return to Home" |
| 10 | P0 | 6.2 | Remove investor names from queue; remove "Client Fund Data" link |
| 11 | P0 | 6.5 | Replace "3 Recommended Fund Strategies" with platform-team recommendations |
| 12 | P0 | 8.1 | v3: Lock scheme table to exact PRD Appendix A list |
| 13 | P1 | 2.1, 2.2, 2.3, 5.1, 5.2, 5.3, 5.4, 5.5 | Add/fix full investor NavBar consistently |
| 14 | P1 | 2.1, 2.2, 2.3, 2.4 | Standardize step progress labels within Query Builder |
| 15 | P1 | 5.2, 5.3, 5.4, 5.5, 5.6, 5.7 | Standardize step count to 6 throughout Voice Scheduler |
| 16 | P1 | 2.1 | Fix "matched" language on Advisor intent card |
| 17 | P1 | 3.1 | Remove "My Portfolio" from NavBar; remove named-advisor sidebar panel |
| 18 | P1 | 5.4 | Remove "curated based on preferences" language |
| 19 | P1 | 5.5 | Remove "KYC"/"Risk Profile" step labels; fix "tailor your fund selection" language |
| 20 | P1 | 5.6 | Un-check pre-checked consent checkbox |
| 21 | P1 | 5.8 | Fix booking code example format to "MF-XXXX" |
| 22 | P1 | 6.1, 6.2, 6.3, 6.4, 6.5, 4.2, 8.1 | Standardize brand name to "Fundwise" everywhere |
| 23 | P1 | 6.3 | Remove "Verified Identity" badge |
| 24 | P1 | 6.4 | Show Booking Code only on booked slots, not investor name |
| 25 | P1 | 4.2, 8.1 | Fix footer to match Education Hub Home (4.1) |
| 26 | P1 | 7.1 | Soften the navy loading card visual weight |

---

## SCREEN-WISE REGENERATION PROMPTS

Each prompt below is self-contained for pasting into Stitch. Canvas: Desktop, 1280px wide.

---

### Screen 2.1 — Query Builder Step 1: Intent

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

Regenerate the desktop Query Builder Step 1 (Intent Classification) screen for the Mutual Fund Advisor Intelligence Suite, an Indian fintech platform called "Fundwise."

CORRECTIONS TO APPLY:
1. NavBar must be the full investor NavBar: #1B3F7E navy, 64px height, "Fundwise" logo with bar-chart icon on left, and on the right: "FAQ Centre" | "Education Hub" | "Book Advisor Call" (saffron #E8922A pill button) | "Advisor Login" (smaller, far right). Do not show a NavBar with only the logo and Advisor Login — all 4 links must be present.
2. Step progress indicator labels must read: Step 1 "What do you need?" (active, filled navy circle), Step 2 "Narrow your topic" (inactive, outline circle), Step 3 "Get your answer" (inactive, outline circle).
3. The third intent card's subtitle must read "Book a call with a SEBI-registered investment advisor" — remove any language suggesting the platform "matches" the investor to an advisor.

KEEP UNCHANGED:
- Page heading "What brings you here today?" with subtext
- Three intent cards: Card 1 "Specific Question" (teal icon, question mark) with subtitle about specific fund/tax/market questions, Card 2 "Learn" (teal icon, graduation cap) about basics of investing/diversification/SIPs, Card 3 "Advisor" (teal icon, two people)
- "No login required" note below cards
- Amber compliance disclaimer strip at bottom with market risk text
- Navy footer with Scheme Documents, Privacy Policy, Grievance Redressal, Compliance Disclosures links
```

---

### Screen 2.2 — Query Builder Step 2A: Specific Question Topics

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

Regenerate the desktop Query Builder Step 2A (Topic Narrowing — Specific Question) screen for Fundwise.

CORRECTIONS TO APPLY:
1. NavBar must be the full investor NavBar: #1B3F7E navy, "Fundwise" logo left, "FAQ Centre" | "Education Hub" | "Book Advisor Call" (saffron pill) | "Advisor Login" on the right. Do not reduce to logo + Advisor Login only.
2. Step progress indicator labels must exactly match Screen 2.1's labelling scheme: Step 1 "What do you need?" (complete, green checkmark), Step 2 "Narrow your topic" (active, filled navy circle), Step 3 "Get your answer" (inactive). Do not use "General Info / Topic Detail / Review" — those labels are inconsistent with the rest of the Query Builder flow.

KEEP UNCHANGED:
- Back button top-left
- Heading "What's your question about?" with subtext about narrowing down topic
- 5 topic options in a card: "Fees & charges", "Scheme details", "Processes", "Regulatory questions", "Something else"
- Saffron "Continue" button
- Amber "Regulatory Disclosure" note at bottom
- Navy footer with Scheme Documents, Privacy Policy, Grievance Redressal, Compliance Disclosures links
```

---

### Screen 2.3 — Query Builder Step 2B: Learning Topics

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

Regenerate the desktop Query Builder Step 2B (Topic Narrowing — Learning) screen for Fundwise.

CORRECTIONS TO APPLY:
1. NavBar must be the full investor NavBar: #1B3F7E navy, "Fundwise" logo left, "FAQ Centre" | "Education Hub" | "Book Advisor Call" (saffron pill) | "Advisor Login" on the right.
2. Step progress indicator labels must exactly match Screens 2.1 and 2.2: Step 1 "What do you need?" (complete), Step 2 "Narrow your topic" (active), Step 3 "Get your answer" (inactive). Use the same circle/checkmark/line styling as 2.2.
3. Wrap the 5 topic options inside a white card container with padding (12px border radius, 24px padding) — matching the card-wrapper layout used in Screen 2.2's topic grid. Currently the topics sit directly on the page background with no card wrapper, which is visually inconsistent with 2.2.

KEEP UNCHANGED:
- Back button top-left
- Heading "What would you like to learn about?" with subtext
- 5 topic options: "Types of mutual funds", "How SIPs work", "Tax implications", "Understanding fees and costs", "My rights as an investor"
- Saffron "Continue" button
- Amber disclosure note at bottom with SEBI registration number
- Navy footer
```

---

### Screen 2.4 — Query Builder Step 3: Routing / Advice Warning (P0)

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

Regenerate the desktop Query Builder Step 3 (Routing / Advice Warning) screen for Fundwise.

CRITICAL CORRECTIONS — COMPLIANCE REQUIRED:
1. COMPLETELY REMOVE the "Your Current Query Context" section and its two cards ("Goal Type: Retirement Wealth Building" and "Risk Profile: Moderately High"). This platform must never display or imply that it has collected or assessed an investor's financial goals or risk profile — doing so constitutes prohibited investment suitability profiling under SEBI regulations. This entire section must not appear anywhere on the page.
2. Fix the step progress indicator. It must NOT read "Goal → Risk → Routing." It should read: Step 1 "What do you need?" (complete, green checkmark), Step 2 "Narrow your topic" (complete, green checkmark), Step 3 "Get your answer" / "Routing" (active, filled navy circle) — consistent with Screens 2.1–2.3.
3. Remove the "SEBI Registered Investment Advisor (RIA) Process" chip/badge below the (now-removed) context section, since the section it referred to no longer exists.

KEEP UNCHANGED:
- The amber warning card: "Regulatory Advice Warning" heading, warning triangle icon, body text about personalised investment advice requiring a human advisor
- Two action buttons: "Book a call with an advisor" (saffron, primary) and "Continue to FAQ anyway" (navy outline, secondary)
- Navy footer with compliance links

Page should now be visually simpler — just the step indicator, the amber warning card, and the footer. No personal data summary of any kind.
```

---

### Screen 3.1 — FAQ Centre Main

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

Regenerate the desktop FAQ Centre main page for Fundwise.

CORRECTIONS TO APPLY:
1. Remove "My Portfolio" from the NavBar entirely. The platform does not offer portfolio tracking (out of scope). NavBar should read: "Fundwise" logo | "Home" | "FAQ Centre" (active) | "Advisor Login" | "Book Advisor Call" (saffron pill) — no portfolio link of any kind.
2. Replace the "Need Advisor Assistance?" sidebar panel — currently shows a named advisor's photo and a personal quote ("Ananya Sharma... Next slot available at 3:00 PM today"). Replace with a generic, unnamed CTA panel: heading "Need personalised guidance?", body text "Speak to a SEBI-registered investment advisor about your specific situation.", and a saffron "Book a Call" button. No individual advisor name or photo should appear on this page.

KEEP UNCHANGED:
- Two-column layout: main content (65%) + sidebar (35%)
- Search bar with example question and answer card showing source citation and disclaimer
- Redemption Timeframes and Taxation on Gains topic cards
- Fee Explainer sidebar panel with Flat Fee Model / Direct-Only Focus content — but see Screen 3.2 correction regarding "exclusively recommend" language if this panel is reused there
- Verified Schemes counter panel (120+ Equity, 85+ Debt, etc.)
- Footer
```

---

### Screen 3.2 — FAQ Centre Compliance Deflection (P0)

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

Regenerate the desktop FAQ Centre compliance deflection screen for Fundwise — shown when an investor's query is classified as advice-seeking (e.g., "Should I invest in ELSS or index funds?").

CRITICAL CORRECTION — COMPLIANCE REQUIRED:
1. Remove the "Fee Transparency" sidebar panel entirely, specifically the text "Direct-Only Focus — We exclusively recommend Direct Plans to save you on commissions." The word "recommend" applied to any investment product or plan type is a prohibited investment recommendation under SEBI regulations — this platform may never state a preference for one plan type, fund, or category over another, even framed as a cost-saving tip.
2. Replace that sidebar panel with the standard FAQ sidebar used on Screen 3.1: a Fee Explainer panel (factual, no plan-type preference) and a Covered Schemes panel.
3. Remove the named advisor quote/photo panel ("Ananya Sharma... Next slot available at 3:00 PM today") for the same reason as Screen 3.1 — replace with a generic unnamed "Book a Call" CTA panel.

KEEP UNCHANGED:
- The main amber deflection card: "This question needs personalised investment advice" heading, body text about SEBI regulations, two suggestion chips ("What is an ELSS fund?" / "What is an index fund?"), and the two buttons "Speak with a professional for tailored advice" / "Book a call with a SEBI-registered advisor" (saffron primary)
- "Compliance Review Active" badge in NavBar area
- Breadcrumb and original question display at top
- Disclaimer text at the very bottom
- Footer
```

---

### Screen 3.3 — FAQ Centre Out-of-Scope Scheme (P0)

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

Regenerate the desktop FAQ Centre out-of-scope scheme screen for Fundwise — shown when an investor asks about a scheme NOT in the platform's verified Top 20 corpus.

CRITICAL CORRECTION — VISUAL DISTINCTION REQUIRED:
1. This screen currently uses an amber background with a warning triangle icon — visually identical to the Compliance Deflection screen (3.2). This is wrong. This state is a CORPUS COVERAGE LIMITATION, not a compliance refusal, and must look completely different. Change the card to: light gray/neutral background (#F7F8FA), a dashed border (1.5px dashed #9AA5B4) instead of a solid amber border, and an information circle icon (ⓘ) in neutral gray instead of a warning triangle. The overall tone should read as "we just don't have this yet," not "you asked something we can't answer."
2. Remove the "Premium Insights — Upgrade Now" sidebar panel entirely. There is no premium/paid tier on this platform — this implies a freemium model that doesn't exist in the product.

KEEP UNCHANGED:
- The card content: "We don't have verified data for this scheme yet" heading, body explaining the Top 20 corpus limitation, "View covered schemes" and "Notify me when added" buttons
- "Access official data directly" section with AMFI India Official Website and PPFAS AMC Investor Portal links
- Verification Status panel (Data Integrity Unverified, Market Cap Coverage 82.4%, Last Index Update)
- Footer
```

---

### Screen 3.4 — Fee Explainer Detail (P0)

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

Regenerate the desktop Fee Explainer detail page for Fundwise — the "Understanding Exit Load" article.

CORRECTIONS TO APPLY:
1. Add a meta line directly below the H1 heading that reads: "Last checked: 18 Jun 2026  ·  Version: v4" — 12px, muted gray text, positioned where the "WEEKLY FEE EXPLAINER" chip currently sits or directly beside it. This is a required field per the platform's spec — the explainer must show when it was last verified and which version is live.
2. Replace the plain-text regulatory disclaimer at the bottom of the page with the standard disclaimer block style used elsewhere on the platform: #FFF8E1 amber background, 4px solid left border in #F59E0B, a ⚠️ warning icon, and 13px text. Currently it renders as unstyled plain text on a white background, which is inconsistent with every other disclaimer on the platform.

KEEP UNCHANGED:
- "WEEKLY FEE EXPLAINER" label chip
- H1 "Understanding Exit Load"
- All 6 numbered bullet points (Definition of Exit Load, "Discouragement" Logic, Calculation Methodology, Holding Period Requirements, FIFO Rule, Taxation Interaction)
- "Verified Sources" SEBI Circulars + AMFI Guidelines badge links
- "Return to FAQ Centre" and "Book a Call with Advisor" buttons
- Footer
```

---

### Screen 4.2 — Education Hub Article (TER) — ⚠️ REGENERATE AS V3 ⚠️

**Save output as:** `education_hub_ter_article_desktop_v3`

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

Regenerate the desktop Education Hub article page for Fundwise (v3) — the "Total Expense Ratio (TER)" article. This is the third generation of this screen; the previous version fixed the NavBar structure but introduced a wrong brand name and inconsistent footer.

CORRECTIONS TO APPLY:
1. The logo/brand name in the NavBar must read "Fundwise" — not "Advisor Pro." This is an investor-facing education article and must use the exact same brand as the Education Hub Home page, FAQ Centre, and Home page.
2. The footer must be IDENTICAL in structure and branding to the Education Hub Home page footer: "Fundwise" logo, and columns for navigation links (FAQ Centre, Education Hub, Book a Call, Privacy Policy, Terms of Service, Sources) and the standard SEBI-compliant platform note at the bottom. Remove the "RESOURCES / NAVIGATION / STAY INFORMED" column structure and the newsletter signup form — these do not appear on any other investor-facing footer in this platform.

KEEP UNCHANGED (this content was excellent in the prior version):
- NavBar structure: FAQ Centre | Education Hub (active) | Book Advisor Call (saffron pill) | Advisor Login
- Breadcrumb: Education Hub > Fees & Costs > TER
- "Fees & Costs" category tag, H1 "Total Expense Ratio (TER): What It Is and How It Affects You"
- Meta row with date, SEBI circular reference, and read time
- Right sidebar: "In this article" TOC and "Related topics" panel
- "What is TER?" section with Definition callout box
- "How is TER Calculated?" section with the worked Calculation Example box (₹1,800 Crores assets, ₹15 Crores expense, TER = 1.58% formula)
- "SEBI's Maximum TER Caps" table with AUM-slab tiered structure
- "Need more clarity on fees?" CTA strip with "Ask in FAQ Centre" and "Book a call" buttons
- "Compliance & Regulatory Disclosure" amber disclaimer box
```

---

### Screen 5.1 — Voice Scheduler Step 1: Greeting (P0)

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

Regenerate the desktop Voice Appointment Scheduler Step 1 (Greeting) screen for Fundwise.

CRITICAL CORRECTIONS:
1. Replace the voice agent avatar — currently a real human photograph — with an abstract, illustrated representation: a simple circular icon containing a stylized waveform, microphone glyph, or abstract assistant icon in the platform's navy/teal palette. Do NOT use a photograph of a real or realistic-looking person anywhere on this screen. The agent should read as a software assistant, not a specific named individual.
2. Expand the PII notice at the bottom from the generic "Your data is encrypted. We never share PII with third parties without consent." to specifically name the prohibited data types: "🔒 Please don't share account numbers, PAN, Aadhaar, or portfolio details here." This must explicitly list PAN, Aadhaar, account numbers, and folio/portfolio details — generic language is not sufficient.
3. Add the full investor NavBar: "Fundwise" logo left, and on the right "FAQ Centre" | "Education Hub" | "Advisor Login". Currently the NavBar shows only the logo and "Advisor Login."

KEEP UNCHANGED:
- "Book a Call with a SEBI-Registered Advisor" page heading
- Amber Pulse theme banner: "This week, many investors are asking about: Exit load confusion on ELSS funds"
- "STEP 1 OF 6: GREETING" progress indicator
- Speech bubble greeting text
- Saffron microphone button "Tap to speak"
- "Or type your response" text input alternative
- Footer
```

---

### Screen 5.2 — Voice Scheduler Step 2: Topic Capture (P0)

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

Regenerate the desktop Voice Appointment Scheduler Step 2 (Topic Capture / Active Listening) screen for Fundwise.

CRITICAL CORRECTIONS:
1. Change the page heading from "Tell us your goals" to "Tell us what you'd like to discuss" or "What would you like to discuss?" This is an appointment scheduler, not an investment goal-collection tool, and the heading must not imply otherwise.
2. Remove the investment-suitability tags currently shown below the live transcript ("Education Fund", "Balanced Risk", "ESGreen"). These tags imply the platform is classifying the investor's risk profile and investment preferences, which is prohibited. Show the transcript as plain text only, with no categorization tags beneath it.
3. Remove "Portfolio" from the NavBar. NavBar should read: "Fundwise" logo | "Dashboard" or no extra links | "Advisor Voice" — but no "Portfolio" link, since portfolio tracking is out of scope for this platform.
4. Fix the step progress indicator. It currently reads "Preferences → Listening → Review" (3 steps). It must instead reflect Step 2 of the platform's standard 6-step booking flow: "STEP 2 OF 6: LISTENING" — matching the format used in Screen 5.1.

KEEP UNCHANGED:
- Live transcript box showing the investor's spoken words
- Microphone button in active/listening state with pulsing animation
- Waveform visualization
- "We can hear you" indicator
- "Stop recording" button
- Regulatory disclosure note at the bottom about voice data being used only for intent extraction
- Footer
```

---

### Screen 5.3 — Voice Scheduler FAQ Deflection Offer

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

Regenerate the desktop Voice Scheduler FAQ Deflection Offer screen for Fundwise — shown when the triage engine detects the spoken query is factual rather than advice-seeking.

CORRECTIONS TO APPLY:
1. Fix the NavBar to match the standard investor NavBar used in Screen 5.1: "Fundwise" logo left, "FAQ Centre" | "Education Hub" | "Advisor Login" on the right. Remove "Investments / Advisors / Market Insights" — these are not links used elsewhere on the platform.
2. Fix the step progress indicator. It currently shows a 3-step flow ("Identify → Triage → Connect"). It must instead show the platform's standard 6-step booking flow with Step 2 active: "STEP 2 OF 6" — matching Screens 5.1 and 5.2.

KEEP UNCHANGED:
- "YOU SAID" transcript display showing the investor's query
- Amber card: "This sounds like something our FAQ Centre might be able to answer right now" with the matched guide reference
- Two buttons: "Take me to FAQ →" (saffron primary) and "I'd still like to speak to an advisor" (navy outline secondary) — both must remain equally visible and accessible
- Disclaimer note at the bottom about automated triage being keyword-based
- Footer
```

---

### Screen 5.4 — Voice Scheduler Step 3: Slot Selection

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

Regenerate the desktop Voice Appointment Scheduler Step 3 (Slot Selection) screen for Fundwise.

CORRECTIONS TO APPLY:
1. Fix the step progress indicator. It currently shows a 3-step flow ("Requirement → Advisor → Scheduling"). It must instead show the platform's standard 6-step booking flow with Step 3 active: "STEP 3 OF 6" — matching Screens 5.1, 5.2, and 5.3.
2. Change the "Advisor Match" panel's speech text from "I've curated these based on your preference for morning sessions" to a neutral statement that doesn't imply personalized matching based on captured preferences — e.g., "Here are the next available consultation slots this week. Which one works best for you?"
3. Remove "Portfolio" from the NavBar — same correction as Screen 5.2.

KEEP UNCHANGED:
- Three available slot cards with calendar icon, date, and time (IST)
- Radio selection mechanism on each slot
- "Continue" button (saffron, disabled until a slot is selected) and "Back to Advisor Info" button
- Disclaimer note about slots being subject to advisor confirmation
- Footer
```

---

### Screen 5.5 — Voice Scheduler Step 4: Context Capture

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

Regenerate the desktop Voice Appointment Scheduler Step 4 (Context Capture) screen for Fundwise.

CORRECTIONS TO APPLY:
1. Fix the step progress indicator. It currently shows 5 steps including "KYC" and "Risk Profile" labels. Remove those entirely — this platform does not collect KYC or risk profile data through the scheduler. The indicator must show the platform's standard 6-step flow with Step 4 active: "STEP 4 OF 6" — matching the format on Screens 5.1–5.4.
2. Change the voice agent's prompt text from "...helps me tailor your fund selection better" to "...helps your advisor prepare for your call." The scheduler must never frame itself as a fund-selection or recommendation tool.
3. Remove "Portfolio Tools" from the NavBar — same correction as Screens 5.2 and 5.4.

KEEP UNCHANGED:
- "Additional Context (Optional)" textarea with placeholder examples
- Character counter (0/500)
- Privacy Notice amber block mentioning bank account numbers, passwords, Aadhaar numbers — also add "PAN" and "folio number" to this list for completeness
- "Skip" ghost link and "Add context & Continue →" saffron button
- Footer
```

---

### Screen 5.6 — Voice Scheduler Step 5: Email Capture (P0)

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

Regenerate the desktop Voice Appointment Scheduler Step 5 (Email Capture) screen for Fundwise.

CRITICAL CORRECTIONS:
1. Remove the named advisor and photo from the "Meeting Summary" card (currently shows "Rajesh Kumar" with a photo and "Mutual Fund Strategy · Oct 24, 11:30 AM"). At this stage in the flow, a specific advisor has NOT yet been assigned — only the topic and proposed time should be shown, with no advisor name or photo: e.g., "Mutual Fund Strategy · Oct 24, 11:30 AM · Advisor to be confirmed."
2. The consent checkbox ("I agree to receive the meeting link...") must be UNCHECKED by default. It currently renders as pre-checked, which is a non-compliant default — consent must always be an active opt-in action by the investor, never a default state.
3. Fix the step progress indicator to show the platform's standard 6-step flow with Step 5 active: "STEP 5 OF 6" — matching Screens 5.1–5.4. Remove any "Strategy / Advisor / Schedule / Summary / Confirm" 5-step labelling.

KEEP UNCHANGED:
- Voice agent prompt: "What email address should we send your booking confirmation to?"
- "Contact Information" card with email input field
- Privacy note "We prioritize your privacy. No spam, only transaction-related updates."
- Regulatory note about the automated booking assistant
- Saffron "Confirm Booking →" button
- Footer
```

---

### Screen 5.7 — Voice Scheduler Step 6: Booking Confirmation (P0)

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

Regenerate the desktop Voice Appointment Scheduler Step 6 (Booking Confirmation) screen for Fundwise.

CORRECTIONS TO APPLY:
1. Change the primary button text from "Return to Dashboard" to "Return to Home." Investors do not have an account or dashboard on this platform — only advisors do. The investor-facing confirmation screen must never reference a "dashboard."
2. Add a copy-to-clipboard icon button immediately to the right of the booking code "MF-K4R2," so the investor can copy the code with one click. Include a small checkmark or "Copied!" confirmation state shown briefly after clicking.

KEEP UNCHANGED:
- "Your booking is confirmed!" heading with success animation
- Booking reference card: code, Consultation Topic, Date & Time, Assigned Advisor, "Check your inbox" note
- Amber "Flexibility Policy" note about rescheduling/cancelling
- "Browse Education Hub" and "Share Invite" secondary links
- Footer
```

---

### Screen 5.8 — Voice Scheduler Reschedule/Cancel

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

Regenerate the desktop Voice Scheduler Reschedule/Cancel page for Fundwise.

CORRECTIONS TO APPLY:
1. Fix the example/placeholder value shown in the Booking Code field. It currently shows "FW-8293-KYC1," which does not match the platform's booking code format. The correct format is "MF-" followed by exactly 4 uppercase alphanumeric characters, e.g., "MF-K4R2." Update the placeholder/example text to this format throughout.

KEEP UNCHANGED:
- "Manage Your Booking" heading and subtext
- Booking Code and Email Address input fields
- "Look up my booking" saffron button
- Footer
```

---

### Screen 6.1 — Advisor Login

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

Regenerate the desktop Advisor Login screen for Fundwise.

CORRECTIONS TO APPLY:
1. Change the brand name shown in the left panel from "Advisor Pro" to "Fundwise." This must be the same brand used across the entire platform — investor-facing and advisor-facing screens both belong to one product, Fundwise, with the advisor side simply being a different login context.

KEEP UNCHANGED:
- Split-screen layout: navy left panel (50%), white right form (50%)
- Left panel: 3 value props (Meeting Queue, Product Pulse, Availability), "Enterprise Grade Security" note
- Right panel: "Advisor Log In" heading, "Official Email ID" field, "Send OTP →" button, "Trouble logging in? Contact Support" link
- "SEBI COMPLIANCE NOTE" amber block at the bottom of the right panel
```

---

### Screen 6.2 — Advisor Dashboard Meeting Queue (P0)

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

Regenerate the desktop Advisor Dashboard Meeting Queue screen for Fundwise.

CRITICAL CORRECTIONS:
1. Remove all investor full names from the "Investor / Topic" column ("Rajesh Malhotra," "Ananya Sharma," "Vikram Singh," "Sanvi Iyer"). This column must show ONLY the topic category (e.g., "Equity Portfolio Rebalancing," "Retirement Planning," "Debt Fund Fees," "New KYC Onboarding") with no investor name attached anywhere in the row. The Booking Code column already provides the unique reference — that combination of Booking Code + Topic Category is sufficient and required for privacy; investor names must never appear in the queue view.
2. Remove the "Client Fund Data" link entirely from any row. This platform does not provide advisor access to client fund/portfolio holdings data — that is out of scope.
3. Change the brand name shown in the sidebar from "Advisor Pro" to "Fundwise."

KEEP UNCHANGED:
- Fixed left sidebar with nav items: Dashboard, Meeting Queue, Meeting Briefs, Availability, Product Pulse, Settings
- Product Pulse pinned card at top with market volatility summary
- Meeting queue table columns: Booking Code, Topic, Time, Status, Actions
- Status badges: Confirmed (green), Rescheduled (amber), Urgent Action (red), Pending (gray)
- "Open Brief" action link
- Portfolio AUM Managed, Conversion %, Client Health stat cards at the bottom — these are advisor-level aggregate business metrics, not individual client data, so they may remain
- Footer
```

---

### Screen 6.3 — Advisor Dashboard Pre-Meeting Brief

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

Regenerate the desktop Advisor Dashboard Pre-Meeting Brief screen for Fundwise.

CORRECTIONS TO APPLY:
1. Remove the "Verified Identity ✓" badge next to the booking code. This platform does not perform identity verification as part of the booking flow — this badge implies a feature that doesn't exist and should not appear.
2. Change the brand name shown in the sidebar from "Advisor Pro" to "Fundwise."

KEEP UNCHANGED:
- Breadcrumb: Meeting Queue > Pre-Meeting Brief
- Booking code header with status badge and scheduled time
- 5 content sections: Topic Category, Investor's Stated Context, FAQ Queries from Session, Pulse Theme This Week, Recommended Preparatory Reading
- Compliance Notice amber block at the bottom stating the brief does not contain PII or specific fund numbers
- "Back to Queue," "Reschedule," "Mark as Complete" buttons
- Footer
```

---

### Screen 6.4 — Advisor Dashboard Availability Calendar

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

Regenerate the desktop Advisor Dashboard Availability Calendar screen for Fundwise.

CORRECTIONS TO APPLY:
1. Change the booked meeting slot label from "P. Sharma Review" (a partial investor name) to show only the Booking Code, e.g., "MF-T7B1." No investor name — even partial or abbreviated — should appear on the calendar, consistent with the same privacy requirement applied to the Meeting Queue (Screen 6.2).
2. Change the brand name shown in the sidebar from "Advisor Pro" to "Fundwise."

KEEP UNCHANGED:
- 5-day week view (Mon–Fri) with 30-minute time slots from 08:00
- Color-coded legend: Open Slot (teal), Booked Meeting (navy), Blocked / Personal/Out (striped/gray)
- "Advisor Slot" available slot labels
- "+ Add time block" button
- Sidebar navigation (Dashboard, Meeting Queue, Meeting Briefs, Availability active, Product Pulse, Settings)
- Footer
```

---

### Screen 6.5 — Advisor Dashboard Product Pulse (P0)

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

Regenerate the desktop Advisor Dashboard Product Pulse screen for Fundwise.

CRITICAL CORRECTION — COMPLIANCE REQUIRED:
1. Completely replace the "3 Recommended Fund Strategies" section at the bottom of the page (currently shows specific funds — HDFC Balanced Advantage, a second fund, SBI Bluechip Fund — with historical return percentages and "View Details" buttons). This section directly recommends specific investment products and compares their performance, which is strictly prohibited under SEBI regulations (no fund recommendations, no performance comparisons implying one fund is superior).

   Replace it with a section titled "3 Product Recommendations" addressed to the PLATFORM'S internal product team, not to advisors or investors. These are operational suggestions for improving the platform itself, each tied to a data point from this week's investor queries. Example format (use similar structure, 3 cards, numbered 1/2/3, each with a recommendation sentence + a "Based on: X queries this week" data point):
   - "Add an exit load calculator to the Education Hub — 'how much exit load will I pay' was asked 34 times this week with no direct FAQ answer available."
   - "Add a dedicated FAQ entry: 'Does exit load apply if I only redeem part of my SIP?' — asked 21 times this week."
   - "Create a 'First Redemption Guide' article in the Education Hub — redemption-related queries rose 40% this week, suggesting a cohort of investors reaching SIP maturity for the first time."

   No fund names, no return percentages, and no "View Details" buttons should appear in this section.
2. Change the brand name shown in the sidebar from "Advisor Pro" to "Fundwise."

KEEP UNCHANGED:
- "WEEKLY PRODUCT PULSE" header chip and date
- Top Investor Themes section with query volume metrics
- Investor Voice Bubbles (anonymised quotes)
- Fee Confusion Spotlight: "Exit Load" highlighted section
- "Export PDF" and "Share with Team" buttons
- Footer
```

---

### Screen 7.1 — Triage Edge Case

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

Regenerate the desktop Triage Edge Case / Escalation screen for Fundwise.

CORRECTIONS TO APPLY:
1. Reduce the visual weight of the navy "Our Triage Engine is analyzing your specific intent" card. This represents a quiet background process, not a major event, so it should not be the most visually dominant element on the page. Make it smaller, use a lighter background (e.g., a light gray or pale teal card instead of solid navy), and reduce the icon size — it should read as a brief, low-key loading state, not an alert.

KEEP UNCHANGED:
- "YOUR QUERY" display showing the investor's question
- "We've routed you based on our best read of your question" neutral informational card
- "Book a call instead →" ghost link
- Skeleton loading placeholder cards below
- "Regulatory Disclaimer" amber note at the bottom
- Footer
```

---

### Screen 8.1 — Sources / Corpus Transparency Page — ⚠️ REGENERATE AS V3 ⚠️ (P0, highest priority)

**Save output as:** `sources_corpus_transparency_desktop_v3`

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

Regenerate the desktop Sources and Corpus Transparency page for Fundwise (v3). This is the third generation of this screen. The first version showed the advisor dashboard shell; the second fixed that but listed an invented scheme list that does not match the platform's actual verified corpus.

CRITICAL CORRECTION — DO NOT INVENT OR SUBSTITUTE SCHEME NAMES:
The "20 Schemes We Cover" table MUST list exactly these 20 schemes, in exactly this order, with exactly these category and AMC values. Do not add, remove, reorder, rename, or substitute any entry — even if you believe a different real-world fund is more prominent or higher-AUM. This table is supposed to represent this specific platform's locked, verified knowledge base, not a general list of large Indian mutual funds:

1  | Parag Parikh Flexi Cap Fund | Flexi Cap | PPFAS Mutual Fund
2  | SBI Bluechip Fund | Large Cap | SBI Mutual Fund
3  | ICICI Prudential Bluechip Fund | Large Cap | ICICI Prudential
4  | HDFC Flexi Cap Fund | Flexi Cap | HDFC Mutual Fund
5  | ICICI Prudential Value Discovery Fund | Value / Flexi Cap | ICICI Prudential
6  | Nippon India Large Cap Fund | Large Cap | Nippon India
7  | Nippon India Small Cap Fund | Small Cap | Nippon India
8  | SBI Small Cap Fund | Small Cap | SBI Mutual Fund
9  | HDFC Mid-Cap Opportunities Fund | Mid Cap | HDFC Mutual Fund
10 | Kotak Emerging Equity Fund | Mid Cap | Kotak Mahindra
11 | Axis Bluechip Fund | Large Cap | Axis Mutual Fund
12 | Mirae Asset Large Cap Fund | Large Cap | Mirae Asset
13 | Aditya Birla Sun Life Flexi Cap Fund | Flexi Cap | Aditya Birla Sun Life
14 | UTI Nifty 50 Index Fund | Index Fund | UTI Mutual Fund
15 | HDFC Nifty 50 Index Fund | Index Fund | HDFC Mutual Fund
16 | Axis Long Term Equity Fund | ELSS | Axis Mutual Fund
17 | Mirae Asset Tax Saver Fund | ELSS | Mirae Asset
18 | DSP Flexi Cap Fund | Flexi Cap | DSP Mutual Fund
19 | Quant Small Cap Fund | Small Cap | Quant Mutual Fund
20 | Motilal Oswal Midcap Fund | Mid Cap | Motilal Oswal

Notice this list deliberately spans 7 categories (Large Cap, Flexi Cap, Mid Cap, Small Cap, ELSS, Index Fund, Value) across 11 different AMCs — render the table exactly as given, including this category diversity. Do not render a list dominated by one category (e.g., do not make most rows "Large Cap").

OTHER CORRECTIONS:
1. Change the brand name from "Fintell" to "Fundwise" in the NavBar and footer.
2. Fix the footer to be IDENTICAL to the Education Hub Home page footer: "Fundwise" logo, navigation columns (FAQ Centre, Education Hub, Book a Call, Privacy Policy, Sources), and the standard SEBI-compliant platform note. Remove the "RESOURCES / LEGAL / CONNECT" column structure used in the prior version.

KEEP UNCHANGED:
- Standalone investor page layout — no advisor sidebar (this was correctly fixed in v2)
- "Our Sources — Full Transparency" H1 and subtext
- "Regulatory & Data Sources" table (AMFI India, SEBI, AMC Websites, mfapi.in, mfdata.in)
- "Coverage Methodology" info box and "Top 20 by AUM" badge
- "Source Refresh Policy" section with Monthly / 48 Hours / 7 Days stat cards
- "Statutory Compliance Note" amber box with SEBI/AMFI registration numbers
```

---

## AFTER REGENERATION — RE-REVIEW CHECKLIST

Once all 24 screens above are regenerated:

1. Re-upload every regenerated screen to `STITCH_DESIGNS`, replacing the old versions (or adding clearly versioned folders, e.g., `_v2`, `_v3`)
2. Run a fresh pass against `UX_REVIEW.md` — focus particularly on:
   - Cross-Screen Consistency §2 (NavBar, brand name, step indicator, disclaimer block — these touch nearly every screen in this fix list)
   - The 5 End-to-End Journey Checks in §3
3. Confirm the brand name "Fundwise" appears with zero exceptions across all 28 screens
4. Confirm Screen 8.1's scheme table exactly matches `corpus/sources/top20_schemes.json` (once Sprint 1 creates that file) — this transparency page must always mirror the real corpus, not a design-time guess
5. Once all P0s clear and P1s are either fixed or explicitly accepted as known minor issues, proceed to **Sprint 1** per `STARTING_PROMPTS.md`

---

*Reference: `DESIGN_REVIEW.md` v2.0, `UX_REVIEW.md`, `DESIGN.md`, `PRD_MutualFund_AdvisorIntelligenceSuite_v1.0.md`*
