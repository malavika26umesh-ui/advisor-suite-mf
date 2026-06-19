# Surgical Fixes — Mutual Fund Advisor Intelligence Suite
# Narrow, targeted corrections for the 4 remaining issues from DESIGN_REVIEW.md v3.0

**Document version:** 1.0 — 2026-06-19  
**Based on:** `DESIGN_REVIEW.md` v3.0 — "Remaining work before Sprint 1" section  
**Why this file exists:** Screen 4.2 has failed full-prompt regeneration three times in a row, and Screens 8.1, 5.4, 5.5 picked up regressions/new issues during a full regeneration pass. Rather than regenerating these 4 screens wholesale again, each prompt below asks Stitch to change **one specific element only** and leave everything else pixel-identical to the current version. This is intentionally narrower than the prompts in `FINAL_DESIGN_FIXES.md`.

**Status:** Not yet applied — queued for later.

---

## Fix 1 — Screen 4.2 (Education Hub Article, TER): Brand name + footer only

**Current file:** `STITCH_DESIGNS/FINAL_DESIGN_FIXES/education_hub_ter_article_desktop_v2/`  
**Save as:** `education_hub_ter_article_desktop_v4`  
**What NOT to touch:** NavBar structure, breadcrumb, article body, calculation example, TER caps table, CTA strip, compliance disclaimer box — all of this is already correct and must not change.

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

This is a SURGICAL EDIT to an existing screen, not a full regeneration. Take the current Education Hub TER article page exactly as it is and change ONLY the following two things. Do not alter, restyle, resize, or rearrange anything else on the page — the NavBar links, breadcrumb, H1, article body, definition callout, calculation example box, TER caps table, CTA strip, and compliance disclaimer are all already correct and must remain pixel-identical.

CHANGE 1 — Brand name in the NavBar logo:
The NavBar logo currently reads "Advisor Pro." Change this text to "Fundwise." Do not change the logo's icon, position, size, or font — only the text string.

CHANGE 2 — Footer:
Replace the entire footer with this exact structure (this matches the footer already used on the Education Hub Home page and must be identical to it):
- Left: "Fundwise" wordmark logo (same style as the NavBar logo)
- Center: a single row of links — "FAQ Centre" | "Education Hub" | "Book a Call" | "Privacy Policy" | "Sources"
- Bottom strip: "SEBI-compliant fintech platform · Content sourced from AMFI, SEBI, and AMC documents"
- Background: #1B3F7E navy, white text throughout
- Remove entirely: the "RESOURCES / NAVIGATION / STAY INFORMED" three-column layout, the newsletter email signup form, and any "Advisor Pro" or "Advisor Pro Wealth Management" text anywhere in the footer or copyright line

Do not generate any other changes. This is a two-element fix only.
```

---

## Fix 2 — Screen 8.1 (Sources / Corpus Transparency): Remove the advisor sidebar only

**Current file:** `STITCH_DESIGNS/FINAL_DESIGN_FIXES/sources_corpus_transparency_desktop_v3_refined/`  
**Save as:** `sources_corpus_transparency_desktop_v4`  
**What NOT to touch:** The 20-scheme table (already exactly correct — do not regenerate or reorder it), "Fundwise" branding (already correct), Regulatory & Data Sources table, Source Refresh Policy stat cards, Statutory Compliance Note, footer.

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

This is a SURGICAL EDIT to an existing screen, not a full regeneration. Take the current Sources & Corpus Transparency page exactly as it is and change ONLY the following one thing. Do not alter, restyle, resize, or regenerate anything else — the "Fundwise" branding, the "Our Sources — Full Transparency" header, the Regulatory & Data Sources table, the 20-scheme table (with its exact existing list and order), the Source Refresh Policy stat cards, the Statutory Compliance Note, and the footer are all already correct and must remain pixel-identical.

CHANGE — Remove the advisor dashboard sidebar:
The page currently renders with a fixed left sidebar containing "Dashboard," "Meeting Queue," "Meeting Briefs," "Availability," "Product Pulse," "Settings," a "New Meeting" button, "Support," and "Logout." This is the advisor dashboard's navigation shell and must not appear on this page — this is a standalone, investor-facing transparency page, not part of the advisor product.

Remove the sidebar entirely. The page content (header, tables, stat cards, compliance note, footer) should expand to use the full 1280px page width that the sidebar was previously occupying space alongside. Add the standard investor NavBar at the top instead (full-width, #1B3F7E navy, "Fundwise" logo left, "FAQ Centre" | "Education Hub" | "Book Advisor Call" (saffron pill) | "Advisor Login" on the right) if no NavBar is present once the sidebar is removed.

Do not generate any other changes. This is a one-element fix only.
```

---

## Fix 3 — Screen 5.4 (Voice Scheduler Step 3, Slot Selection): Remove the named advisor panel

**Current file:** `STITCH_DESIGNS/FINAL_DESIGN_FIXES/voice_scheduler_step_3_slot_selection_desktop_refined/`  
**Save as:** `voice_scheduler_step_3_slot_selection_desktop_v2`  
**What NOT to touch:** NavBar, "STEP 3 OF 6" indicator, the three slot cards, "Continue to Confirmation" button, "Previous Step" link, footer, the neutral disclaimer strip at the top.

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

This is a SURGICAL EDIT to an existing screen, not a full regeneration. Take the current Voice Scheduler Step 3 (Slot Selection) screen exactly as it is and change ONLY the following one thing. Do not alter, restyle, resize, or regenerate anything else — the NavBar, the "STEP 3 OF 6" progress indicator, the three available slot cards, the "Continue to Confirmation" button, the "Previous Step" link, and the footer are all already correct and must remain pixel-identical.

CHANGE — Remove the named advisor panel:
The left side of the page currently shows a card with a named advisor — "Ananya Sharma, Senior Investment Consultant" — including a photo and a "SEBI Registered" badge, with a speech-bubble quote: "Here are the next available consultation slots this week. Which one works best for you?"

A specific advisor must NOT be named or shown with a photo at this stage of the booking flow — at Step 3, no advisor has been assigned yet; assignment happens only after the booking is confirmed (Step 6). Replace this card with a generic, unnamed version: keep the same card position, size, and the same speech-bubble quote text ("Here are the next available consultation slots this week. Which one works best for you?"), but replace the named advisor's photo and name/title with a generic abstract assistant icon (matching the style used on Screen 5.1's greeting avatar) and no name or title text at all — just the icon and the quote.

Do not generate any other changes. This is a one-element fix only.
```

---

## Fix 4 — Screen 5.5 (Voice Scheduler Step 4, Context Capture): Rewrite the Privacy Notice only

**Current file:** `STITCH_DESIGNS/FINAL_DESIGN_FIXES/voice_scheduler_step_4_context_capture_desktop_refined/`  
**Save as:** `voice_scheduler_step_4_context_capture_desktop_v2`  
**What NOT to touch:** NavBar, "STEP 4 OF 6" indicator, "Contextual Analysis" panel, "Additional Notes" textarea, "Previous Step" / "Add context & Continue" buttons, the "SOURCE CITATION" and "END-TO-END ENCRYPTED" tags at the bottom, footer.

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

This is a SURGICAL EDIT to an existing screen, not a full regeneration. Take the current Voice Scheduler Step 4 (Context Capture) screen exactly as it is and change ONLY the following one thing. Do not alter, restyle, resize, or regenerate anything else — the NavBar, the "STEP 4 OF 6" progress indicator, the "Contextual Analysis" panel, the "Additional Notes" textarea, the buttons, the bottom tags, and the footer are all already correct and must remain pixel-identical.

CRITICAL CORRECTION — Rewrite the Privacy Notice text only:
The "Privacy Notice" panel currently reads: "Your data including PAN and folio number is encrypted using AES-256. Only SEBI registered advisors assigned to your case can access these details."

This wording is wrong and must be replaced. It currently reads as PERMITTING the investor to share PAN and folio number, with reassurance that it will be protected. That is incorrect — this platform must never accept, store, or process PAN, Aadhaar, folio numbers, or account numbers at all, under any circumstance, encrypted or not.

Replace the Privacy Notice text with: "For your security, please don't include your PAN, Aadhaar number, folio number, or bank account details in this field. If you share these by mistake, our system will not store them. Your advisor will collect any necessary identity details through a secure, verified channel during your call."

Keep the same panel styling, icon, and position — change only the text content of this one notice.

Do not generate any other changes. This is a one-element fix only.
```

---

## After applying these 4 fixes

1. Save each output with the `_v4` / `_v2` suffix noted under each fix above (so it's easy to tell these apart from the prior failed/regressed attempts)
2. Re-run the relevant checks from `UX_REVIEW.md` for just these 4 screens (no need to re-review the other 24 — they're already confirmed clean in `DESIGN_REVIEW.md` v3.0)
3. Update `DESIGN_REVIEW.md` with a v3.1 (or v4.0) entry once these are verified
4. Once all 4 are clean, every screen in the project is compliant and consistent — proceed to Sprint 1 per `STARTING_PROMPTS.md`

---

*Reference: `DESIGN_REVIEW.md` v3.0 ("Remaining work before Sprint 1" section), `FINAL_DESIGN_FIXES.md`, `DESIGN.md`*
