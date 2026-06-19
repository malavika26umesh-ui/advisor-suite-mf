# Missing Screen Prompts — Mutual Fund Advisor Intelligence Suite
# Google Stitch prompts for the 3 screens not generated in the initial batch

**Context:** These 3 screens were identified as missing during the UX flow review (DESIGN_REVIEW.md).  
**Reference design system:** DESIGN.md  
**Before pasting:** Set your Stitch canvas to Desktop — 1280px wide frame.

---

## Screen 4.1 — Education Hub Home Page

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

Design the desktop Education Hub home page for the Mutual Fund Advisor Intelligence Suite, a SEBI-compliant Indian fintech platform. This is a structured content library where investors can learn about mutual funds — not a Q&A or booking tool. It is proactive and discovery-oriented, unlike the reactive FAQ Centre.

Navigation bar (full-width, 64px height, #1B3F7E navy background):
- Left: "Fundwise" logo with bar-chart icon in white
- Right nav links in white: "FAQ Centre" | "Education Hub" (active — white underline indicator) | "Book Advisor Call" (#E8922A saffron pill button) | "Advisor Login" (13px, far right)

Hero section (navy #1B3F7E to teal #0F7B8C gradient, 64px top/bottom padding, full-width):
- H1 (30px, Plus Jakarta Sans Bold, white, centered): "Understand mutual funds — clearly, completely, from official sources"
- Subtext (15px, white 80% opacity, centered, max-width 600px): "Every article is sourced from SEBI circulars, AMFI data, and fund SID/KIM documents. No opinions. No comparisons. Just facts."
- Search bar (white background, 52px height, max-width 560px, centered, 8px border radius, placeholder "Search topics, concepts, or questions...", search icon on left)

Page background: #F7F8FA (off-white). Max content width 1280px centered, 64px left/right padding.

Section 1 — "Mutual Fund Categories" (white background, 48px top/bottom padding):
- Section H2 (22px, #1B3F7E, Plus Jakarta Sans 600): "Mutual Fund Categories"
- Section subtext (14px, #4A5568): "SEBI-defined categories — regulatory definitions, how each works, and typical investor profile."
- 4-column card grid of 8 equity fund category cards. Each card: white background, 12px border radius, 20px padding, 1px #E2E8F0 border. Card contents: icon (32px circle with coloured bg) top-left, category name (15px, 600 weight, #1A202C), "Equity" tag pill (#EFF6FF background, #1E40AF text, 11px, 600 weight), SEBI circular reference (11px, #9AA5B4 italic). Hover state: border changes to #0F7B8C.
  8 cards: Large Cap (📈 icon, teal bg), Mid Cap (📊, navy bg), Small Cap (🏗️, teal bg), Flexi Cap (🔀, navy bg), Multi Cap (🗂️, teal bg), ELSS (💰, saffron #E8922A bg — special: add "Tax benefit" sub-tag), Sectoral/Thematic (🏭, teal bg), Index Funds/ETFs (📋, navy bg)

Section 2 — "Key Concepts" (#F7F8FA background, 48px top/bottom padding):
- Section H2: "Key Concepts Explained"
- 3-column grid of 6 concept cards (same card style as Section 1, smaller):
  NAV (what it is and what it isn't), SIP (auto-investment mandates), SWP & STP (systematic withdrawal and transfer), Direct vs Regular Plan (cost difference), AUM (what it measures), Risk-o-meter (SEBI's 6 risk categories)
- Each card: icon, title (15px, 600), one-line description (13px, #4A5568)

Section 3 — "Fees & Costs" (white background, 48px top/bottom padding):
- Section H2: "Understanding Fees & Costs"
- Introductory line (14px, #4A5568): "Fee confusion is the #1 source of investor questions. These articles explain every charge in plain language."
- 3-column grid of 5 fee topic cards: TER (Total Expense Ratio), Exit Load, Stamp Duty, STT (Securities Transaction Tax), Distributor vs Direct Cost
- IMPORTANT: TER card and Exit Load card must each have a small amber badge in the top-right corner of the card that reads "⚠️ Most misunderstood" — amber pill, #FFFBEB background, #D97706 text, 11px, 600 weight

Section 4 — "Investor Processes" (#F7F8FA background, 48px top/bottom padding):
- Section H2: "Step-by-Step Investor Guides"
- 3-column grid of 5 process guide cards: How to Start a SIP, How to Redeem Mutual Fund Units, Download Capital Gains Statement, Update KYC, File a Complaint (SEBI SCORES Portal)
- Each card: numbered badge (01, 02, 03...) in top-left in #1B3F7E circle, title (15px, 600), short description (13px, #4A5568), right-pointing ArrowRight icon (#0F7B8C) at card right — implies a step-by-step guide inside

Section 5 — "Investor Rights" (white background, 48px top/bottom padding):
- Section H2: "Your Rights as an Investor"
- 4-column grid of 4 rights cards: Right to access SID/KIM before investing, Right to receive account statements, Right to nominate, SEBI Grievance Redressal (SCORES portal)
- Each card: ShieldCheck icon in #2D8653 (green, 32px), title (15px, 600), short description (13px, #4A5568)

Full-width compliance strip (above footer, #FFF8E1 amber background, 1px top border #F59E0B, 20px top/bottom padding):
- Centered text (13px, #6B7280): "All content on this page is sourced from SEBI circulars, AMFI publications, and AMC-issued SID/KIM documents. This is factual information only and does not constitute investment advice. For personalised guidance, speak to a SEBI-registered investment advisor."

Footer (#1B3F7E navy background, white text):
- Logo left, nav links center (FAQ Centre | Education Hub | Book a Call | Privacy Policy | Sources), right side empty or social links
- Bottom strip: "SEBI-compliant fintech platform · Content sourced from AMFI, SEBI, and AMC documents"
```

---

## Screen 4.2 — Education Hub Article View (REGENERATE — v2, corrected)

**Why regenerating:** The first version rendered with the advisor dashboard's top bar ("Financial Intelligence Suite | Overview | Reports | Analytics") instead of the investor NavBar, and included an "Advisor Pro" promotional block at the bottom — both wrong for an investor-facing page. See `DESIGN_REVIEW.md` Screen 4.2 (P0 + P1).

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

CRITICAL CORRECTION — READ FIRST: This is an investor-facing education page. Use the standard investor NavBar (#1B3F7E navy, full-width, with links: FAQ Centre | Education Hub (active) | Book Advisor Call (saffron pill) | Advisor Login). Do NOT use a dashboard or analytics navigation, and do NOT show any sidebar. This page must look identical in navigation and footer to the Education Hub Home page — it is a sub-page of that same site, not part of the Advisor Pro / Financial Intelligence Suite product. Remove any "Advisor Pro" promotional section from the bottom of the page entirely.

Design the desktop Education Hub article page for the Mutual Fund Advisor Intelligence Suite. The article shown is "Total Expense Ratio (TER): What It Is and How It Affects You" — a factual education article from the Fees & Costs section.

Navigation bar: Same as Education Hub Home (full-width #1B3F7E navy, "Education Hub" active in nav with white underline). This is an investor-facing NavBar — FAQ Centre | Education Hub (active) | Book Advisor Call (saffron pill) | Advisor Login. Never substitute this with an advisor dashboard top bar.

Breadcrumb (16px below NavBar, 14px text, #9AA5B4):
"Education Hub  ›  Fees & Costs  ›  Total Expense Ratio (TER)"
Breadcrumb links are #0F7B8C teal, separators are #9AA5B4, current page (#1A202C, not a link).

Page layout (1280px wide, #F7F8FA background, 48px top padding):
Two-column below breadcrumb with 32px gap:
- Left column: 70% width — article content
- Right column: 30% width — sticky sidebar

LEFT COLUMN — Article content (white card, 12px border radius, 28px padding):

Article header area:
- Category tag pill: "Fees & Costs" — #EFF6FF background, #1E40AF text, 12px, 600 weight, pill shape
- H1 (28px, Plus Jakarta Sans Bold, #1A202C): "Total Expense Ratio (TER): What It Is and How It Affects You"
- Meta row (12px, #9AA5B4, icon-prefixed): CalendarBlank icon + "Last reviewed: 14 Jan 2026" | LinkSimple icon + "Source: SEBI Circular SEBI/HO/IMD/DF2/CIR/2018/147"
- Source badges row (below meta, 8px gap): Two clickable pill badges — [SEBI] and [AMFI] — each #EFF6FF background, #1E40AF text, 12px 600 weight, with ArrowSquareOut external link icon on right

Horizontal separator line (#E2E8F0, full width of card)

Article body (16px Inter, #1A202C, 1.6 line height, sections separated by 24px gaps):

Section heading H2 (22px, 600 weight, #1B3F7E): "What is TER?"
Body paragraph (2 sentences, factual, no opinion): Explains TER as the annual fee expressed as a percentage of AUM, deducted daily from the fund's NAV.

Definition callout box: #F0FAFB background, 4px solid left border #0F7B8C, 12px border radius, 16px padding. Label "Definition" in #0F7B8C 12px 600 weight above. Body: plain-language definition of TER in 1 sentence.

Section heading H2: "How is TER Calculated?"
Body paragraph: Explains daily deduction from NAV.

Worked example box: #F7F8FA background, 1.5px dashed #9AA5B4 border, 12px border radius, 16px padding. Top-left label "Example" in #0F7B8C 13px 600 weight. Body text: "The Parag Parikh Flexi Cap Fund (Direct Plan) has a TER of approximately 0.59% per annum (as disclosed in its SID). On a ₹1,00,000 investment, this means roughly ₹590 is deducted annually from the fund corpus — not separately charged to you." Below body: small italic note in #9AA5B4 12px: "Source: PPFAS Mutual Fund SID — verified Jan 2026"

Section heading H2: "SEBI's Maximum TER Caps"
Simple 2-column table (full card width): Column 1 "Fund Category", Column 2 "Maximum TER". Table header: #F7F8FA background, 12px uppercase #718096. Rows (alternating white/#F9FAFB): Equity funds | 2.25%, Debt funds | 2.00%, Index funds/ETFs | 1.00%. After table: superscript "¹" inline source note in teal linking to SEBI circular.

CTA strip (border-top 1px #E2E8F0, 20px padding top, flex row):
- Left text (14px, #4A5568): "Still have questions about TER?"
- Right: two ghost links — "Ask in FAQ Centre →" (#0F7B8C, underline) and "Book a call with an advisor →" (#0F7B8C, underline), 16px gap between them

Compliance disclaimer block (full card width, below CTA strip, 8px gap):
- #FFF8E1 background, 4px solid left border #F59E0B, border-radius 0 8px 8px 0, 12px padding
- ⚠️ icon (amber, 16px) + text (13px, #6B7280): "This is factual information sourced from official SEBI/AMFI/AMC documents. It does not constitute investment advice. For personalised guidance, speak to a SEBI-registered investment advisor."

RIGHT SIDEBAR (30%, sticky top):

Panel 1 — Table of Contents (white card, 12px border radius, 20px padding):
- Heading "In this article" (13px, 600 weight, #1A202C)
- List items (13px, #0F7B8C teal, underline): What is TER? | How is TER Calculated? | SEBI's Maximum TER Caps
- Active section item: #1B3F7E navy, 600 weight, left border 2px navy

Panel 2 — Related Articles (white card, 12px border radius, 20px padding, 16px margin-top):
- Heading "Related articles" (13px, 600 weight, #1A202C)
- 3 article link rows (each: title 13px teal + category pill 11px + ArrowRight icon right):
  "Exit Load: When It Applies and How to Check It" — Fees & Costs
  "Direct vs Regular Plan: The Real Cost Difference" — Fees & Costs
  "How to Read a Scheme Information Document (SID)" — Investor Processes

Panel 3 — Fee Explainer This Week (white card, 4px solid left border #0F7B8C, 20px padding, 16px margin-top):
- Chip: "📌 Fee Explainer — This Week" — #EFF6FF background, #1E40AF text, 12px
- H3 (18px, 600, #1A202C): "Exit Load"
- 3 bullet points preview (13px, #4A5568), teal bullet dots
- "View full explainer →" ghost link (#0F7B8C, underline, 13px)
- Meta (11px, #9AA5B4): "Last checked: 14 Jan 2026 · Version v4"

Footer: Same as Education Hub Home page. This is the investor-facing footer (Logo | FAQ Centre | Education Hub | Book a Call | Privacy Policy | Sources, plus the SEBI-compliant platform note) — not the "Advisor Pro" footer with Platform/Governance links.
```

---

## Screen 8.1 — Sources / Corpus Transparency Page (REGENERATE — v2, corrected)

**Why regenerating:** The first version rendered inside the advisor dashboard shell (full advisor sidebar nav visible — Dashboard, Meeting Queue, Meeting Briefs, Availability, Product Pulse, Settings), used "Advisor Pro" branding, listed only ~10 of the required 20 schemes, and included two scheme names not in the PRD's Top 20 list ("HDFC Top 100 Fund", "Kotak Standard Multicap"). See `DESIGN_REVIEW.md` Screen 8.1 (P0 + P1).

```
CANVAS: Desktop web browser — 1280px wide frame. Do not generate a mobile layout.

CRITICAL CORRECTION — READ FIRST: This is a standalone investor-facing page, not part of the advisor dashboard. Use the standard investor NavBar (#1B3F7E navy, full-width, with links: FAQ Centre | Education Hub | Book Advisor Call (saffron pill) | Advisor Login). Do NOT show a sidebar navigation, an "Advisor Pro" or "Financial Intelligence Suite" header, or any dashboard chrome. Show all 20 schemes from the list below in the table — not 10, and not substitutes for them. Use the investor-facing footer identical to the Education Hub Home page (Logo | FAQ Centre | Education Hub | Book a Call | Privacy Policy | Sources + SEBI-compliant platform note) — not an "Advisor Pro" footer.

Design the desktop Sources and Corpus Transparency page for the Mutual Fund Advisor Intelligence Suite. This is a trust and transparency page — it shows investors exactly where all the platform's content comes from. The tone is factual, open, and institutional.

Navigation bar: Same as all investor pages (full-width #1B3F7E navy, investor links FAQ Centre | Education Hub | Book Advisor Call (saffron pill) | Advisor Login — no active nav item highlighted since Sources is in the footer). Never substitute this with an advisor dashboard sidebar or top bar.

Page header (white background, 48px top/bottom padding, centered):
- Breadcrumb (14px, #9AA5B4): "Home  ›  Sources"
- H1 (28px, Plus Jakarta Sans Bold, #1A202C): "Our Sources — Full Transparency"
- Subtext (16px, #4A5568, max-width 640px centered): "Every factual answer on this platform traces back to one of these official, publicly accessible sources. Nothing is sourced from blogs, opinions, or unverified content."

Page body (max-width 900px centered on #F7F8FA background, 48px top padding, 48px left/right auto margin):

Section 1 — "Primary Regulatory Sources" (white card, 12px border radius, 28px padding):
- Section H2 (22px, #1B3F7E, 600 weight): "Regulatory & Data Sources"
- Section subtext (14px, #4A5568): "All scheme-specific facts and regulatory content traces to one of these official sources."
- Table (full card width):
  Header row (#F7F8FA bg, 12px uppercase #718096): Source | Content Type | URL | Auth Required
  Row 1: AMFI India | NAV data, scheme codes, investor education | amfiindia.com (teal link + ArrowSquareOut) | None (green "None" text)
  Row 2: SEBI | Regulatory circulars, investor rights, fee caps | sebi.gov.in (teal link) | None
  Row 3: Individual AMC Websites | SID and KIM documents for each scheme | Per AMC (teal link) | None
  Row 4: mfapi.in | NAV history and scheme metadata | mfapi.in (teal link) | None
  Row 5: mfdata.in | NAV, expense ratio, holdings | mfdata.in (teal link) | None
  Row styling: white rows, 48px height, bottom border #F3F4F6, 14px body text

Section 2 — "The 20 Schemes We Cover" (white card, 12px border radius, 28px padding, 16px margin-top):
- Section H2: "Verified Scheme Corpus — Top 20 by AUM"
- Introductory text (14px, #4A5568, max-width 700px): "Our FAQ Centre provides verified, source-cited answers only for these 20 equity-oriented mutual fund schemes. Queries about other schemes return a clear 'not in our corpus' message — we never guess or approximate."
- Table (full card width). MUST show all 20 rows below — do not truncate to 10, do not substitute different scheme names, and do not abbreviate the list with "+ X more":
  Header: # | Scheme Name | Category | AMC
  Exactly these 20 rows, in this order:
  1 | Parag Parikh Flexi Cap Fund | Flexi Cap | PPFAS Mutual Fund
  2 | SBI Bluechip Fund | Large Cap | SBI Mutual Fund
  3 | ICICI Prudential Bluechip Fund | Large Cap | ICICI Prudential
  4 | HDFC Flexi Cap Fund | Flexi Cap | HDFC Mutual Fund
  5 | ICICI Prudential Value Discovery Fund | Value / Flexi Cap | ICICI Prudential
  6 | Nippon India Large Cap Fund | Large Cap | Nippon India
  7 | Nippon India Small Cap Fund | Small Cap | Nippon India
  8 | SBI Small Cap Fund | Small Cap | SBI Mutual Fund
  9 | HDFC Mid-Cap Opportunities Fund | Mid Cap | HDFC Mutual Fund
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
  Table styling: alternating white/#F9FAFB rows, 44px height, 14px body text, #F7F8FA header
- Below table: teal-bordered info box (#F0FAFB bg, 4px left border #0F7B8C, 12px border radius, 12px padding): "Why only 20 schemes? To ensure every fact is manually verified against the source SID/KIM before being added to our knowledge base. Full scheme universe coverage is planned for a future version."

Section 3 — "Source Refresh Policy" (white card, 12px border radius, 28px padding, 16px margin-top):
- Section H2: "How We Keep Sources Current"
- 3-column stat card row (each stat card: white, 1px #E2E8F0 border, 12px border radius, 16px padding, centered):
  Stat 1: "Monthly" (20px, #E8922A saffron, 700 weight) + "Full source review cycle" (13px, #4A5568)
  Stat 2: "48 hours" (20px, #E8922A, 700 weight) + "Broken link replacement SLA" (13px, #4A5568)
  Stat 3: "7 days" (20px, #E8922A, 700 weight) + "New SEBI/AMFI circulars added" (13px, #4A5568)
- Body paragraph below stats (14px, #4A5568): "Sources are reviewed monthly and re-validated. Broken or outdated links are identified and replaced within 48 hours. When SEBI or AMFI publish new circulars relevant to retail investors, they are added to our corpus within 7 days of publication."

Full-width compliance strip (#FFF8E1 amber, 1px top border #F59E0B, 20px padding, above footer):
- Centered text (13px, #6B7280): "All sources listed above are publicly accessible official documents. This platform does not use analyst reports, news articles, fund manager commentary, or any source that expresses a view on which fund to buy or avoid."

Footer: Same as all investor pages — Logo | FAQ Centre | Education Hub | Book a Call | Privacy Policy | Sources, #1B3F7E navy background, white text, SEBI-compliant platform note at bottom. This is the investor footer used on Education Hub Home and Home page — not an "Advisor Pro" or "Financial Intelligence Suite" footer with Platform/Governance link columns.
```

---

*These prompts are self-contained. Paste each one individually into Google Stitch with the canvas set to 1280px desktop.*  
*Reference: DESIGN_REVIEW.md (review findings), DESIGN.md (full design system), PRD_MutualFund_AdvisorIntelligenceSuite_v1.0.md §3 F3 and §9 (Education Hub and corpus specs)*
