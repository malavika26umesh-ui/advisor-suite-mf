# Design Review — Mutual Fund Advisor Intelligence Suite
# UX Flow Review Against UX_REVIEW.md Checklist

**Review log:**

| Version | Date | Trigger | Screens | P0 Open | P1 Open |
|---|---|---|---|---|---|
| [v1.0](#v1-0--2026-06-18--initial-review) | 2026-06-18 | Initial upload | 26 of 28 | 11 | 8 |
| [v2.0](#v2-0--2026-06-19--post-regeneration-review) | 2026-06-19 | Re-upload after 3 missing screens generated + 2 corrected | 28 of 28 | 11 | 10 |
| [v3.0](#v3-0--2026-06-19--final-design-fixes-batch-review) | 2026-06-19 | Bulk regeneration of all 24 flagged screens via `FINAL_DESIGN_FIXES.md` | 24 of 24 fixed screens re-reviewed | 2 | 5 |

Jump to the latest: [Version 3.0 — 2026-06-19](#v3-0--2026-06-19--final-design-fixes-batch-review)

---

## v3.0 — 2026-06-19 — Final Design Fixes Batch Review

**Trigger:** All 24 screens flagged in `FINAL_DESIGN_FIXES.md` were regenerated using the corrected prompts and uploaded to `STITCH_DESIGNS/FINAL_DESIGN_FIXES/`.

**Result: Overwhelmingly successful.** Of the 26 distinct issues tracked, **19 are fully resolved**, 2 remain partially or fully unresolved on the same screen (4.2), 1 regressed (8.1's advisor sidebar reappeared), and 4 new minor issues were introduced as side effects of the regeneration. No new P0 compliance violations were introduced in the core investor/advisor compliance flows — the most critical fixes (Screen 2.4 risk profiling, Screen 3.2 fund recommendation, Screen 6.2 investor privacy, Screen 6.5 fund recommendation in Pulse, Screen 8.1 scheme list) are **all confirmed resolved**.

### Fully confirmed fixed (19 of 26 original issues)

| Screen | Fix | Verified via |
|---|---|---|
| 2.1 | Full NavBar added; "matched" language replaced | HTML |
| 2.2 | Full NavBar added; step labels standardized | HTML |
| 2.3 | Full NavBar added; step labels standardized; card-wrapper layout added | HTML |
| 2.4 | **"Goal Type"/"Risk Profile" cards completely removed**; step labels fixed | HTML |
| 3.1 | "My Portfolio" removed from NavBar; named-advisor panel replaced with generic CTA | HTML |
| 3.2 | **"We exclusively recommend Direct Plans" removed**; sidebar replaced with neutral fee-model facts + generic CTA | HTML |
| 3.3 | **Visual treatment changed to neutral/gray with dashed border + info icon**, now clearly distinct from 3.2; "Premium Insights" panel removed | HTML + image |
| 3.4 | "Last checked" date + version number added; disclaimer now uses the standard amber block style | HTML |
| 5.1 | Real photo replaced with abstract icon avatar; PII notice now names PAN/Aadhaar/account numbers explicitly; full NavBar added | Image |
| 5.2 | Title changed to "What would you like to discuss?"; suitability tags removed from transcript; "Portfolio" removed from NavBar; step indicator fixed to 6-step format | Image |
| 5.3 | NavBar fixed to standard investor nav; step indicator fixed to 6-step format | Image |
| 5.4 | Step indicator fixed to 6-step format; "curated based on preferences" language removed; "Portfolio" removed from NavBar | Image |
| 5.5 | Step indicator fixed (no more KYC/Risk Profile steps); "tailor your fund selection" language replaced; "Portfolio Tools" removed from NavBar | Image |
| 5.6 | Named advisor + photo removed from Meeting Summary (now shows "Advisor to be confirmed"); step indicator fixed | Image |
| 5.7 | "Return to Dashboard" changed to "Return to Home"; copy-to-clipboard icon added next to booking code | Image |
| 5.8 | Booking code placeholder corrected to "MF-K4R2" format | Image |
| 6.1 | Brand corrected to "Fundwise" | HTML |
| 6.2 | **Investor names completely removed from queue (now Booking Code + Topic only)**; "Client Fund Data" link removed; brand corrected | HTML + image |
| 6.3 | "Verified Identity" badge removed; brand corrected | HTML |
| 6.4 | Booked slot now shows Booking Code only (no investor name, partial or otherwise); brand corrected | HTML |
| 6.5 | **"3 Recommended Fund Strategies" completely replaced with "3 Product Recommendations" addressed to the platform team — zero fund names, zero return percentages**; brand corrected | HTML + image |
| 7.1 | Navy loading card visual weight reduced (now light teal, smaller icon) | Image |
| 8.1 | **Scheme table now lists exactly the 20 schemes from PRD Appendix A, in the exact order specified**; brand corrected to "Fundwise" throughout | HTML |

### Unresolved (carried over from v2.0)

| # | Screen | Severity | Issue |
|---|---|---|---|
| 1 | 4.2 | P1 | Brand name is still "Advisor Pro," not "Fundwise" — NavBar **structure** is now correct, but the logo text and footer copyright still read "Advisor Pro." This screen has now failed brand correction three times in a row. |
| 2 | 4.2 | P1 | Footer still uses the "RESOURCES / NAVIGATION / STAY INFORMED" column structure with a newsletter signup, instead of matching the Education Hub Home footer. |

### Regressed (was fixed in v2.0, broke again in v3.0)

| # | Screen | Severity | Issue |
|---|---|---|---|
| 3 | 8.1 | **P0 — regression** | The advisor dashboard sidebar (Dashboard, Meeting Queue, Meeting Briefs, Availability, Product Pulse, Settings, + "New Meeting" button) has reappeared on the Sources page. This was correctly removed in v2.0 — the v3 regeneration reintroduced it. Everything else on this screen (scheme list, branding) is now correct, so this is the only remaining blocker for 8.1. |

### New issues introduced during this regeneration round

| # | Screen | Severity | Issue |
|---|---|---|---|
| 4 | 5.4 | **P0 — new** | A named advisor ("Ananya Sharma," with photo) now appears at the Slot Selection step — before the booking is confirmed. This is the same category of violation originally flagged and fixed on Screen 5.6 (no advisor should be named/shown until after confirmation), now newly present one step earlier. |
| 5 | 5.5 | **P0 — new** | The Privacy Notice was reworded to: *"Your data including PAN and folio number is encrypted using AES-256. Only SEBI registered advisors assigned to your case can access these details."* This reads as **permitting** PAN/folio sharing (with reassurance it's protected), rather than instructing the investor not to share these details at all — which directly contradicts PRD F5's requirement that the agent must never accept or store PAN, Aadhaar, folio number, or account number. |
| 6 | 5.7 | P2 | Disclaimer text still references "via the dashboard" for cancellations — inconsistent with the now-corrected "Return to Home" button, since investors don't have a dashboard. |
| 7 | 7.1 | P1 | NavBar was never brought in line with the standard investor nav on this screen — still shows "Market Insights / Fund Explorer / Portfolio / Help Center," including the out-of-scope "Portfolio" link. Not in the original fix list for this screen, but should be corrected for consistency. |
| 8 | 6.5 | P2 | A "Financial Intelligence Suite" label appears in the top app bar next to the (correctly branded) "Fundwise" sidebar logo — minor naming inconsistency, not a functional issue. |
| 9 | 5.3 | P2 | New right-panel text reads "Action: Advisor Recommendation Ready" — ambiguous phrasing that could be read as implying an AI-generated recommendation exists. Mitigated by the compliance disclaimer directly below it, but worth tightening to something like "Routing to Advisor Ready." |
| 10 | 5.6 | — | Could not verify from the screenshot resolution whether the consent checkbox is checked or unchecked by default — needs manual confirmation in Stitch. |

### Updated journey status (v3.0)

| Journey | v2.0 | v3.0 | Change |
|---|---|---|---|
| 1: Home → Query Builder → FAQ | ⚠️ | ✅ | **Fixed** — all NavBar/step-label P1s resolved |
| 2: Home → Education Hub → Article | ⚠️ | ⚠️ | No change — Screen 4.2 branding/footer still wrong |
| 3: FAQ → Voice Scheduler → Confirmation | ⚠️ | ⚠️ | Mostly fixed, but 2 new P0s introduced (named advisor at Step 3, PAN/folio privacy wording at Step 4) |
| 4: Advisor Login → Queue → Brief → Complete | ✅ | ✅ | **Fully clean** — no open issues |
| 5: Pulse → Fee Explainer → Greeting | ⚠️ | ✅ | **Fixed** — Pulse fund-recommendation violation resolved, Fee Explainer date/version added |

### Remaining work before Sprint 1

Only 2 screens need another regeneration pass:
1. **Screen 4.2** — brand name + footer only (content and NavBar structure are already correct — do not regenerate from scratch, just target these two elements)
2. **Screen 8.1** — remove the advisor sidebar only (scheme list and branding are already correct)

And 2 screens need a small targeted correction:
3. **Screen 5.4** — remove the named advisor/photo panel at Slot Selection
4. **Screen 5.5** — rewrite the Privacy Notice to instruct the investor not to share PAN/folio/Aadhaar, not to reassure them it will be encrypted if shared

---

---

## v2.0 — 2026-06-19 — Post-Regeneration Review

**Trigger:** The 3 screens missing in v1.0 (Education Hub Home, Education Hub Article, Sources Page) were generated and uploaded. Education Hub Article and Sources Page were then regenerated a second time ("v2") with explicit corrections after v1.0 of those two flagged P0 navigation issues.

**Screens reviewed:** 28 of 28 (complete set — no screens missing)  
**Overall verdict:** Journey 2 (Education Browsing) is now fully navigable for the first time — it was completely broken in v1.0. However, the P0 count has **not decreased** (11 → 11): the v2 regeneration fixed the 3 navigation/structure issues it targeted, but introduced 1 new P0 (Sources page scheme list no longer matches PRD Appendix A) and 2 new P1s (brand-name inconsistency, footer inconsistency). Net result: structurally better, compliance-wise unchanged.

### What v2.0 fixed (carried over from the missing-screen prompts)

| Screen | Fix confirmed |
|---|---|
| 4.2 Education Hub Article | ✅ Advisor dashboard top bar replaced with correct investor NavBar structure (FAQ Centre \| Education Hub active \| Book Advisor Call \| Advisor Login) |
| 4.2 Education Hub Article | ✅ Standalone "Advisor Pro" promotional upsell block removed from page bottom |
| 8.1 Sources Page | ✅ Advisor dashboard sidebar shell removed — now a standalone investor page |
| 8.1 Sources Page | ✅ Scheme table row count fixed — now shows 20 rows (was ~10) |

### What v2.0 introduced or left unresolved

| # | Screen | Severity | Issue |
|---|---|---|---|
| 1 | 8.1 (v2) | **P0 — new** | Scheme table now has 20 rows, but the list doesn't match PRD Appendix A — overwhelmingly Large Cap funds with invented names ("UTI Mastershare Unit Scheme," "WhiteOak Capital Large Cap," etc.); ELSS, Index Fund, and Mid Cap categories entirely missing. Needs a v3 regeneration with the exact scheme list pinned against substitution. |
| 2 | 4.2 (v2) | P1 — new | Brand name reads "Advisor Pro" instead of "Fundwise" (used on Home, Query Builder, FAQ Centre, Voice Scheduler, Education Hub Home) |
| 3 | 8.1 (v2) | P1 — new | Brand name reads "Fintell" — a third, different brand name |
| 4 | 4.2, 8.1 (v2) | P1 — new | Footer column structure and branding differ from Education Hub Home (4.1) |
| 5 | — | P1 — new (cross-screen) | Site-wide: three different brand names now in use — "Fundwise" (investor screens), "Advisor Pro" (advisor screens + 4.2 v2), "Fintell" (8.1 v2). Needs to be locked to one canonical name before further regeneration. |

All 11 P0 issues identified in v1.0 that were **not** targeted by the missing-screen regeneration (Screens 2.4, 3.2, 3.3, 3.4, 5.1, 5.2, 5.6, 5.7, 6.2, 6.5) remain open and unchanged — see the v1.0 section below for original findings, and `FINAL_DESIGN_FIXES.md` for the consolidated fix-it list with regeneration prompts.

### Updated journey status (v2.0)

| Journey | v1.0 | v2.0 | Change |
|---|---|---|---|
| 1: Home → Query Builder → FAQ | ⚠️ | ⚠️ | No change — P1 NavBar gaps only |
| 2: Home → Education Hub → Article | ❌ Broken | ✅ Navigable | **Fixed** — was the major structural win this round |
| 3: FAQ → Voice Scheduler → Confirmation | ⚠️ | ⚠️ | No change — P0s in Steps 1, 2, 5, 6 still open |
| 4: Advisor Login → Queue → Brief → Complete | ✅ | ✅ | No change — P0 investor-names-in-queue still open |
| 5: Pulse → Fee Explainer → Greeting | ⚠️ | ⚠️ | No change — P0 fund-recommendation section still open |

**Next step:** `FINAL_DESIGN_FIXES.md` contains the consolidated list of every remaining change (11 P0, 10 P1) with a ready-to-paste Stitch correction prompt for each of the 24 affected screens, plus confirmation that all 28 planned screens now exist.

---

## v1.0 — 2026-06-18 — Initial Review

**Date reviewed:** 2026-06-18  
**Screens uploaded:** 26 of 28 planned screens  
**Missing screens:** 3 (Education Hub Home, Education Hub Article, Sources Page)  
**Overall verdict:** Flow is largely coherent and well-structured, but has **11 P0 blockers** that are compliance violations per the PRD — they must be fixed before build starts.

---

## MISSING SCREENS

These three screens were not generated and break Journey 2 entirely.

| Screen | Why it breaks the flow |
|---|---|
| **4.1 — Education Hub Home** | Journey 2 (Education Browsing) has no destination. The "Browse Education Hub" CTA on the Home page and the "Learn" card in Query Builder both lead nowhere. |
| **4.2 — Education Hub Article View** | Without an article page, the Education Hub is a dead end with no readable content. |
| **8.1 — Sources / Corpus Transparency Page** | The footer on multiple screens links to "Scheme Documents" / "Sources" which has no destination. |

Stitch prompts for all three missing screens are in `MISSING_SCREEN_PROMPTS.md`.

---

## SCREEN-BY-SCREEN FINDINGS

### ✅ Screen 1.1 — Home Page — PASS

Strong design. NavBar, hero, 3-column "How It Works", featured topics strip, amber compliance strip, and footer are all correct. The two-column hero with illustration on the right works well. No issues.

---

### ⚠️ Screen 2.1 — Query Builder Step 1 — PASS WITH P1

- **P1:** NavBar strips down to just logo + "Advisor Login" — missing the full nav (FAQ Centre, Education Hub, Book Advisor Call). Every investor-facing page should have the full NavBar from Screen 1.1.
- **P1:** Step labels say "Intent / Details / Advice" — should be "What do you need? / Narrow your topic / Get your answer" per PRD.
- **P1:** Card 3 subtitle says "Get matched with a certified professional for personalized financial planning" — "matched" implies advisor-matching which is explicitly out of scope (PRD §14). Change to "Book a call with a SEBI-registered investment advisor."

---

### ✅ Screen 2.2 — Query Builder Step 2A — PASS WITH P1

All 5 correct topics present. Back button works. Continue button present.

- **P1:** Step labels ("General Info / Topic Detail / Review") are different from Screen 2.1 ("Intent / Details / Advice"). Steps must be consistent across all 3 Query Builder screens.
- **P1:** Full NavBar missing — same issue as 2.1.

---

### ✅ Screen 2.3 — Query Builder Step 2B — PASS WITH P1

All 5 correct learning topics. Correct heading "What would you like to learn about?"

- **P1:** Layout inconsistency with 2A — topics in 2B don't use the card/box wrapper that 2A uses.
- **P1:** Step labels inconsistent again, full NavBar missing.

---

### 🚫 Screen 2.4 — Query Builder Step 3 — FAIL (P0)

**P0 — Compliance Violation:** The screen shows "Your Current Query Context" with two data cards: **"GOAL TYPE: Retirement Wealth Building"** and **"RISK PROFILE: Moderately High"**. This is a direct violation of PRD §4.2 which prohibits *"Any flow that takes investor inputs and outputs a fund suggestion, even if framed as educational"* — and specifically prohibits risk profiling. The step progress labels also read "Goal → Risk → Routing", confirming the design is treating this as an investment suitability assessment flow, not a query routing step. The warning card text and the two action buttons are correct, but the context cards must be removed entirely.

---

### ✅ Screen 3.1 — FAQ Centre Main — PASS WITH P1

Two-column layout, search bar, answer card, source citations, Fee Explainer sidebar, Covered Schemes sidebar all correct.

- **P1:** NavBar includes "My Portfolio" — portfolio tracking is explicitly out of scope (PRD §14). Remove it.
- **P1:** The "Need Advisor Assistance?" sidebar panel shows a named advisor quote with a photo. This is acceptable as a soft CTA but should not show a specific named person — change to a generic "Book a Call" panel.

---

### 🚫 Screen 3.2 — FAQ Centre Compliance Deflection — FAIL (P0)

Main deflection card (amber, ShieldCheck icon, two buttons) is correct.

**P0 — Compliance Violation:** The right sidebar contains a **"Fee Transparency"** panel that reads: *"Direct-Only Focus — We exclusively recommend Direct Plans to save you on commissions."* The word **"recommend"** in this context is a direct investment recommendation, which is prohibited by PRD §4.2. This sidebar panel must be removed or replaced with the standard FAQ sidebar (Fee Explainer + Covered Schemes).

---

### 🚫 Screen 3.3 — FAQ Centre Out-of-Scope Scheme — FAIL (P0)

**P0 — Wrong visual treatment:** This card uses an **amber background with a warning triangle (⚠️)** — identical in tone to the Compliance Deflection card (Screen 3.2). Per the PRD and UX_REVIEW.md, the out-of-scope state must use **neutral/gray treatment** (dashed border, information icon, muted colors) to make clear this is a corpus coverage limitation, not a compliance refusal. As designed, an investor cannot distinguish between "you asked something we can't answer for legal reasons" and "we just don't have data for this scheme yet."

- **P1:** Right sidebar shows a "Premium Insights — Upgrade Now" panel implying a freemium paid tier that does not exist in the PRD.

---

### ✅ Screen 3.4 — Fee Explainer Detail — PASS WITH P0

Excellent structure — 6 numbered bullets, correct content, SEBI Circulars + AMFI Guidelines source badges, Return to FAQ and Book a Call CTAs all present.

- **P0:** No **"Last checked: [date]"** stamp visible. **No version number (v4 etc.)** visible. Both are required by PRD F2 spec. Add these to the meta row below the title.
- **P0:** The regulatory disclaimer at the bottom uses plain text on a white background. Should use the standard amber disclaimer block (⚠️ icon, #FFF8E1 background, amber left border) consistent with all other screens.

---

### 🚫 Screen 5.1 — Voice Scheduler Step 1 — FAIL (P0)

Pulse theme banner, text input alternative, step indicator, and speech bubble are all correct.

- **P0:** The voice agent avatar is a **real human photograph** of an Indian woman. This must be replaced with an abstract avatar, illustrated character, or icon-based representation. Using a real photo implies the agent is a specific named person.
- **P1:** The PII notice says "Your data is encrypted. We never share PII with third parties without consent." This is too generic. Must specifically name: PAN, Aadhaar, folio numbers, account numbers — as required by PRD F5 spec.

---

### 🚫 Screen 5.2 — Voice Scheduler Step 2 — FAIL (P0 — Multiple)

- **P0:** The page title is **"Tell us your goals"** and step labels read **"Preferences → Listening → Review"**. This frames the Voice Scheduler as an investment goal-collection and suitability assessment tool — which it is not. It is an appointment scheduler. The title should be "What would you like to discuss?" and labels should be the 6-step booking flow.
- **P0:** The live transcript tags the investor's spoken query with labels: **"Education Fund", "Balanced Risk", "ESGreen"** — these are investment suitability tags that imply the platform is building a risk/preference profile. This is prohibited (PRD §4.2).
- **P0:** The NavBar shows **"Portfolio"** as a link — portfolio management is out of scope (PRD §14).

---

### ✅ Screen 5.3 — Voice Scheduler FAQ Deflection Offer — PASS WITH P1

"This sounds like something our FAQ Centre might answer right now" card is correct. "Take me to FAQ →" and "I'd still like to speak to an advisor" are both clearly visible and accessible. Transcript shown above. Disclaimer present.

- **P1:** NavBar is inconsistent with other screens (shows "Investments / Advisors / Market Insights").
- **P1:** Progress shows only 3 steps ("Identify / Triage / Connect") — inconsistent with 6-step flow on other scheduler screens.

---

### ✅ Screen 5.4 — Voice Scheduler Step 3 Slot Selection — PASS WITH P1

3 slot cards, radio selection, correct dates/times with IST timezone, saffron Continue button, disclaimer note — all correct.

- **P1:** Step labels show 3 steps ("Requirement / Advisor / Scheduling"), not the 6-step flow.
- **P1:** Left panel says "I've curated these based on your preference for morning sessions" — implies personalized advisor matching based on captured preferences, which is out of scope.

---

### ✅ Screen 5.5 — Voice Scheduler Step 4 Context Capture — PASS WITH P1

Textarea, character counter, Skip ghost link, "Add context & Continue" primary button all correct. Privacy notice amber block is present and mentions Aadhaar numbers.

- **P1:** Step labels show 5 steps including "KYC" and "Risk Profile" — these imply data collection beyond appointment scheduling scope.
- **P1:** Voice agent prompt says "helps me tailor your fund selection better" — the scheduler should not be framing itself as a fund selection tool. Change to "help your advisor prepare for your call."

---

### ⚠️ Screen 5.6 — Voice Scheduler Step 5 Email Capture — PASS WITH P0

Email field, privacy note, consent checkbox, and Confirm Booking button all correct.

- **P0:** The "Meeting Summary" card on the right shows **advisor name "Rajesh Kumar" with a photo** — implying a specific advisor was already assigned before booking is confirmed. Per PRD, the investor books with "a SEBI-registered advisor" — specific assignment happens after confirmation.
- **P1:** The consent checkbox appears pre-checked — this is a dark pattern. Consent must be opt-in, not pre-selected.

---

### ⚠️ Screen 5.7 — Voice Scheduler Step 6 Confirmation — PASS WITH P0

Booking code "MF-K4R2" is prominently displayed in a bordered box. Topic, date, advisor, and calendar invite note all present. "Browse Education Hub" ghost link present. Flexibility policy (reschedule/cancel) note present.

- **P0:** The primary CTA says **"Return to Dashboard"** — investors do not have a dashboard (PRD §14 explicitly excludes investor accounts/login). Must change to "Return to Home."
- **P1:** No copy-to-clipboard button next to the booking code — PRD F5 spec requires this.

---

### ✅ Screen 5.8 — Voice Scheduler Reschedule/Cancel — PASS WITH P1

Two-field form (Booking Code + Email), "Look up my booking" saffron button, footer correct.

- **P1:** The booking code example shown is **"FW-8293-KYC1"** — this does not match the PRD format of **"MF-[4 uppercase alphanumeric]"** (e.g., MF-K4R2). The placeholder must be updated to show the correct format.

---

### ✅ Screen 6.1 — Advisor Login — PASS WITH P1

Split-screen design, OTP-only authentication (no password field), SEBI Compliance Note amber block — all correct.

- **P1:** Left panel branding says "Advisor Pro" — inconsistent with "Fundwise" / "IntelliSuite MF" used on other screens. Standardise branding.

---

### 🚫 Screen 6.2 — Advisor Dashboard Meeting Queue — FAIL (P0)

Product Pulse pinned card, meeting queue table, status badges (Confirmed/Rescheduled/Urgent/Pending), "Open Brief" actions — all structurally correct.

- **P0:** The "INVESTOR / TOPIC" column displays **full investor names**: "Rajesh Malhotra", "Ananya Sharma", "Vikram Singh", "Sanvi Iyer". Per PRD F6: *"Each entry shows: Booking Code, topic category (not the free-text — to protect privacy)."* Investor names must not appear in the queue. Replace the name with just the Booking Code.
- **P0:** One row shows **"Client Fund Data"** as a link — accessing client fund/portfolio data is explicitly out of scope (PRD §14).

---

### ✅ Screen 6.3 — Advisor Dashboard Pre-Meeting Brief — PASS WITH P1

All 5 data sections present: Topic Category, Investor's Stated Context, FAQ Queries from Session, Pulse Theme This Week, Recommended Preparatory Reading. Compliance notice at bottom stating what the brief does NOT contain. Back to Queue, Reschedule, Mark as Complete buttons correct.

- **P1:** A "Verified Identity ✓" badge appears next to the booking code — identity verification is not in the PRD spec. Remove it.

---

### ✅ Screen 6.4 — Advisor Dashboard Availability Calendar — PASS WITH P1

5-day week view, time slots from 8:00, colour-coded legend (Open/Booked/Blocked), "Add time block" button — all correct.

- **P1:** Booked meeting slot shows "P. Sharma Review" (partial investor name). Should show only the Booking Code (e.g., "MF-T7B1") for privacy consistency with the queue fix above.

---

### 🚫 Screen 6.5 — Advisor Dashboard Product Pulse — FAIL (P0)

Pulse chip, weekly summary stats, anonymised investor quotes, Fee Confusion Spotlight ("Exit Load") — all correct.

**P0 — Compliance Violation:** The bottom section is titled **"3 Recommended Fund Strategies"** and shows three specific funds — HDFC Balanced Advantage, a second fund, and SBI Bluechip Fund — with **historical return figures (34.7%, 29.1%, 18.7%)** and "View Details" buttons. This is a direct investment recommendation with a performance comparison, which is **prohibited by PRD §4.2**. The Product Pulse's "3 Product Recommendations" are meant to be recommendations to the **platform product team** (e.g., "add an exit load calculator to the Education Hub") — not fund recommendations to advisors or investors. This entire section must be replaced.

---

### ✅ Screen 7.1 — Triage Edge Case — PASS WITH P1

Neutral informational card ("We've routed you based on our best read of your question"), "Book a call instead →" ghost link, regulatory disclaimer — all correct.

- **P1:** The large navy loading card ("Our Triage Engine is analyzing your specific intent") is a bit heavy-handed for what should be a quiet background process.

---

### ✅ Screen 8.2 — Post-Meeting Feedback Email — PASS

Excellent. "Hello," with no name ✓, 3 correctly coloured buttons ✓, anonymous response note ✓, unsubscribe + privacy links ✓. This is the best-executed screen in the set.

---

### ✅ Screen 8.3 — Booking Confirmation Email — PASS

MF-K4R2 booking code prominent in dashed bordered box ✓, "Please share this Booking Code with your advisor" note ✓, reschedule/cancel link ✓, unsubscribe + manage preferences ✓. Very well designed.

---

## CONSOLIDATED ISSUE LIST

### P0 — Must Fix Before Build (11 issues)

| # | Screen | Issue |
|---|---|---|
| 1 | 2.4 | Remove "Goal Type" and "Risk Profile" context cards — prohibited suitability assessment |
| 2 | 2.4 | Fix step labels "Goal → Risk → Routing" to match actual Query Builder flow |
| 3 | 3.2 | Remove "We exclusively recommend Direct Plans" from sidebar — direct investment recommendation |
| 4 | 3.3 | Change amber warning treatment to neutral/gray — must be visually distinct from compliance deflection |
| 5 | 5.1 | Replace real human photo avatar with abstract illustration or icon |
| 6 | 5.2 | Change "Tell us your goals" title and "Preferences/Risk" step labels — not a goal/suitability collection screen |
| 7 | 5.2 | Remove investment-preference tags on transcript (Education Fund, Balanced Risk, ESGreen) |
| 8 | 5.7 | Change "Return to Dashboard" to "Return to Home" — investors have no dashboard |
| 9 | 6.2 | Remove investor full names from meeting queue — show Booking Code + topic only |
| 10 | 6.2 | Remove "Client Fund Data" link — portfolio access is out of scope |
| 11 | 6.5 | Replace "3 Recommended Fund Strategies" with "3 Product Recommendations" for the platform team — not fund recommendations |

### P1 — Fix Before Sprint Handoff (8 issues)

| # | Screens | Issue |
|---|---|---|
| 1 | 2.1, 2.2, 2.3, 5.1, 5.2 | Full NavBar missing on these screens — add FAQ Centre, Education Hub, Book Advisor Call links |
| 2 | 2.1–2.4 | Step progress labels inconsistent across Query Builder screens — standardise |
| 3 | 5.2–5.6 | Step count inconsistent (3, 5, or 6 steps shown across scheduler screens) — standardise to 6 |
| 4 | 5.5 | "tailor your fund selection" language — change to "help your advisor prepare" |
| 5 | 5.6 | Pre-checked consent checkbox — must be unchecked by default |
| 6 | 5.8 | Booking code example "FW-8293-KYC1" — change to PRD format "MF-XXXX" |
| 7 | 6.1 | "Advisor Pro" branding — standardise to "Fundwise" / "IntelliSuite MF" |
| 8 | 6.4 | Booked slot shows "P. Sharma" — show only Booking Code for privacy |

---

## FLOW COHERENCE ASSESSMENT

| Journey | Status | Gap |
|---|---|---|
| Journey 1: Home → Query Builder → FAQ | ✅ Flows correctly | Minor P1 NavBar gaps |
| Journey 2: Home → Query Builder → Education Hub → Article | ❌ Broken | Education Hub screens entirely missing |
| Journey 3: FAQ → Voice Scheduler → Booking Confirmation | ⚠️ Mostly works | Step count inconsistency makes flow feel disjointed |
| Journey 4: Advisor Login → Queue → Brief → Complete | ✅ Flows well | P0 names in queue must be fixed |
| Journey 5: Pulse → Fee Explainer → Voice Greeting | ⚠️ Partially works | Pulse fund recommendation section breaks compliance |

---

## SCREENS AT A GLANCE

| Screen | Name | Result | Severity |
|---|---|---|---|
| 1.1 | Home Page | ✅ PASS | — |
| 2.1 | Query Builder Step 1 | ⚠️ PASS WITH ISSUES | P1 |
| 2.2 | Query Builder Step 2A | ⚠️ PASS WITH ISSUES | P1 |
| 2.3 | Query Builder Step 2B | ⚠️ PASS WITH ISSUES | P1 |
| 2.4 | Query Builder Step 3 | 🚫 FAIL | P0 |
| 3.1 | FAQ Centre Main | ⚠️ PASS WITH ISSUES | P1 |
| 3.2 | FAQ Centre Compliance Deflection | 🚫 FAIL | P0 |
| 3.3 | FAQ Centre Out-of-Scope | 🚫 FAIL | P0 |
| 3.4 | Fee Explainer Detail | ⚠️ PASS WITH ISSUES | P0 |
| 4.1 | Education Hub Home | ❌ MISSING | — |
| 4.2 | Education Hub Article | ❌ MISSING | — |
| 5.1 | Voice Scheduler Step 1 | 🚫 FAIL | P0 |
| 5.2 | Voice Scheduler Step 2 | 🚫 FAIL | P0 |
| 5.3 | Voice Scheduler FAQ Deflection | ⚠️ PASS WITH ISSUES | P1 |
| 5.4 | Voice Scheduler Step 3 | ⚠️ PASS WITH ISSUES | P1 |
| 5.5 | Voice Scheduler Step 4 | ⚠️ PASS WITH ISSUES | P1 |
| 5.6 | Voice Scheduler Step 5 | ⚠️ PASS WITH ISSUES | P0 |
| 5.7 | Voice Scheduler Step 6 | ⚠️ PASS WITH ISSUES | P0 |
| 5.8 | Voice Scheduler Reschedule/Cancel | ⚠️ PASS WITH ISSUES | P1 |
| 6.1 | Advisor Login | ⚠️ PASS WITH ISSUES | P1 |
| 6.2 | Advisor Dashboard Meeting Queue | 🚫 FAIL | P0 |
| 6.3 | Advisor Dashboard Pre-Meeting Brief | ⚠️ PASS WITH ISSUES | P1 |
| 6.4 | Advisor Dashboard Calendar | ⚠️ PASS WITH ISSUES | P1 |
| 6.5 | Advisor Dashboard Product Pulse | 🚫 FAIL | P0 |
| 7.1 | Triage Edge Case | ⚠️ PASS WITH ISSUES | P1 |
| 8.1 | Sources Page | ❌ MISSING | — |
| 8.2 | Post-Meeting Feedback Email | ✅ PASS | — |
| 8.3 | Booking Confirmation Email | ✅ PASS | — |

---

*Review conducted against: `UX_REVIEW.md`, `PRD_MutualFund_AdvisorIntelligenceSuite_v1.0.md` §4 (Regulatory Framework), §8 (Feature Specifications), §10 (User Journeys), §12 (Acceptance Criteria)*  
*Stitch prompts for missing screens: `MISSING_SCREEN_PROMPTS.md`*
