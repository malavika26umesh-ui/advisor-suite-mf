# Product Requirements Document
# Mutual Fund Advisor Intelligence Suite

---

| Field | Detail |
|---|---|
| **Version** | 1.1 — Draft (Scoped to Top 20 Schemes) |
| **Platform** | Web (Desktop-first, Mobile-responsive) |
| **Audience** | Engineering · Design · Compliance · Leadership |
| **Regulatory Jurisdiction** | India — SEBI / AMFI |
| **Scale Target** | ~1,000 DAU (Investors) · 30 Advisors |
| **Corpus Scope (v1)** | Top 20 equity-oriented mutual fund schemes by AUM — see Appendix A |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Context & Background](#3-context--background)
4. [Regulatory Framework](#4-regulatory-framework)
5. [User Personas](#5-user-personas)
6. [Pain Points](#6-pain-points)
7. [Solution Overview](#7-solution-overview)
8. [Feature Specifications](#8-feature-specifications)
   - 8.1 Guided Query Builder
   - 8.2 FAQ Centre
   - 8.3 Asset Discovery & Education Hub
   - 8.4 Triage & Routing Engine
   - 8.5 Voice Appointment Scheduler
   - 8.6 Advisor Dashboard & Pre-Meeting Brief
   - 8.7 Product Pulse
9. [Data Sources & Corpus](#9-data-sources--corpus)
10. [User Flows & Journeys](#10-user-flows--journeys)
11. [Success Metrics & KPIs](#11-success-metrics--kpis)
12. [Acceptance Criteria](#12-acceptance-criteria)
13. [Technical Constraints & Architecture Notes](#13-technical-constraints--architecture-notes)
14. [Out of Scope](#14-out-of-scope)
15. [Risks & Open Questions](#15-risks--open-questions)
16. [Appendix A: Top 20 Schemes — v1 Corpus Scope](#appendix-a-top-20-schemes--v1-corpus-scope)

---

## 1. Executive Summary

The **Mutual Fund Advisor Intelligence Suite** is an AI-powered web platform for Indian retail investors and SEBI-registered investment advisors. It is built by a fintech startup that provides advice but does not manage customer money.

The platform solves two interconnected problems: investors cannot easily access clear, factual information about mutual funds; and advisors are overwhelmed by query volume while lacking the tools to contextualise individual client sessions.

The platform consists of seven features across three functional pillars:

- **Information Pillar** — Guided Query Builder, FAQ Centre, Asset Discovery & Education Hub
- **Operations Pillar** — Triage & Routing Engine, Voice Appointment Scheduler, Advisor Dashboard & Pre-Meeting Brief
- **Intelligence Pillar** — Product Pulse

All features comply strictly with SEBI and AMFI guidelines. The platform provides **factual information only** — it never constitutes investment advice. Personalised advice is the exclusive domain of the SEBI-registered advisors operating through the platform.

**Scope Constraint (v1):** To enable rapid build and rigorous fact-verification within capstone timelines, the FAQ Centre and Education Hub's scheme-specific content is scoped to a curated corpus of the **Top 20 equity-oriented mutual fund schemes in India by AUM** (see Appendix A for the full list and selection methodology). This is a deliberate constraint on corpus breadth, not on architecture — the RAG pipeline, triage logic, and all seven features are designed to scale to the full scheme universe in a later phase. See Section 14 for the v2 expansion path.

---

## 2. Problem Statement

### For Investors

Indian retail investors face meaningful barriers to participating in mutual fund investing — not because financial products are inaccessible, but because the **information environment is confusing, fragmented, and often unreliable.**

Investors cannot easily:
- Understand the fees embedded in the products they hold
- Discover what types of mutual fund schemes exist and how they work
- Know the right questions to ask, or who to ask them to
- Distinguish between factual education and investment advice

When investors do reach out for help, they frequently receive inconsistent answers, anecdotal guidance, or unregulated recommendations — all of which erodes trust in the system and leaves the investor worse off.

### For Advisors

SEBI-registered investment advisors operating independently (as RIAs) face a different problem: **they are receiving more queries than they can meaningfully handle**, and the queries they receive are often undifferentiated — a mix of factual questions the investor could have answered themselves, genuine advisory needs, and misdirected requests.

Because advisors lack a structured intake system and any context about the investor before a meeting, they spend disproportionate time on low-value interactions and go into advisory sessions with no preparation material.

### The Gap Between Them

The two problems are structurally related. If investors could get reliable factual answers without involving an advisor, advisors would receive only the queries that genuinely require their expertise. This platform is designed to close that gap.

---

## 3. Context & Background

### Market Context

India's mutual fund industry has grown significantly, with AMFI reporting over 16 crore investor folios as of 2024. The growth has been driven primarily by SIP adoption and digital distribution, yet investor literacy has not kept pace. AMFI's own investor education data shows that fee structures, scheme categorisation, and redemption processes remain major areas of confusion.

### Platform Context

This platform is built by a fintech startup that:
- Provides investment advisory services through SEBI-registered external RIAs
- Does **not** manage or hold customer money
- Does **not** have a trading or transaction layer
- Operates as a connector and information layer between investors and licensed advisors

This positioning means the platform's liability is structured differently from a fund house or broker: it is responsible for the accuracy and regulatory compliance of the information it presents, but **advisory liability sits entirely with the individual SEBI-registered advisors.**

### Design Principles

The following principles govern every product and design decision on this platform:

1. **Compliance-first** — No feature is built that could constitute investment advice under SEBI's Investment Advisers Regulations, 2013.
2. **Source-grounded** — Every factual claim traces back to an official, publicly accessible source.
3. **Investor clarity** — If an answer cannot be given clearly and accurately, the system says so explicitly rather than approximating.
4. **Advisor respect** — Advisors' time is a resource. The platform should route only genuinely advice-needing investors to them.
5. **No dark patterns** — The platform does not use urgency, social proof, or speculative content to influence investor behaviour.

---

## 4. Regulatory Framework

This section defines the compliance boundary that governs all content and AI output on the platform. **Engineering and AI teams must treat these as hard constraints, not guidelines.**

### 4.1 What the Platform CAN Do

| Category | Permitted Content |
|---|---|
| Scheme facts | NAV, expense ratio (TER), exit load, lock-in period, benchmark index, AUM, fund category, ISIN, fund manager name |
| Process information | How to start a SIP, how to redeem units, how to download a capital gains statement, how to submit a complaint to SEBI |
| Fee education | Plain-language explanations of TER, exit load, stamp duty, STT, direct vs. regular plan cost difference |
| Scheme definitions | What is an ELSS fund, what is a flexi cap fund, what is a liquid fund — factual category definitions |
| Regulatory information | What is a KIM, what is a SID, what is AMFI, what is a SEBI-registered RIA, what are investor rights |
| Performance disclosure | Historical NAV data with mandatory disclaimer (see below) |

### 4.2 What the Platform CANNOT Do

| Category | Prohibited |
|---|---|
| Recommendations | Suggesting, implying, or ranking any fund or fund category as suitable for any investor |
| Comparisons leading to preference | Comparing two funds in a way that implies one is superior to another |
| Risk profiling → recommendation | Any flow that takes investor inputs and outputs a fund suggestion, even if framed as educational |
| Performance claims | Stating that a fund "has done well" or "is expected to grow" — any forward-looking statement |
| Portfolio assessment | Reviewing or opining on an investor's existing holdings, even if they volunteer this information |
| PII handling | Collecting, storing, or transmitting personally identifiable financial information (Aadhaar, PAN, account details, folio numbers) |

### 4.3 Mandatory Disclaimers

The following disclaimers must appear on every FAQ answer and every piece of content in the Education Hub:

**Primary disclaimer (every FAQ answer):**
> *"This is factual information sourced from official AMFI/SEBI/AMC documents. It does not constitute investment advice. For personalised guidance, speak to a SEBI-registered investment advisor."*

**Performance data disclaimer (whenever NAV or returns data is displayed):**
> *"Past performance is not indicative of future returns. Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing."*

**Advisor referral text (on every FAQ response):**
> *"Need personalised advice? Book a call with a SEBI-registered advisor on this platform."*

### 4.4 Regulatory References

- SEBI Investment Advisers Regulations, 2013
- AMFI Code of Ethics for Mutual Fund Distributors
- SEBI Circular on Total Expense Ratio (TER) — October 2018
- SEBI Circular on Risk-o-Meter — January 2021
- AMFI Best Practices Guidelines Circular No. 135 (Investor Communication Standards)

---

## 5. User Personas

### Persona A — The Retail Investor

**Name:** Priya  
**Age:** 28–42  
**Location:** Tier 1 / Tier 2 Indian city  
**Digital literacy:** Moderate to high — uses UPI, mobile banking, and occasionally investment apps  
**Investment experience:** Beginner to intermediate — may have one or two SIPs but doesn't deeply understand the products  
**Relationship with advisors:** Has never consulted a SEBI-registered RIA; either self-directed or relying on informal advice  

**What Priya needs from this platform:**
- Answers to specific factual questions, stated in plain language
- Enough education to know what she doesn't know
- A low-friction way to get to a qualified person when she's genuinely stuck
- Confidence that the information she's receiving is accurate and regulated

**What Priya does NOT want:**
- To be sold something
- To feel talked down to
- To repeat herself when she finally gets on a call with an advisor
- To receive a generic answer that doesn't address her actual question

---

### Persona B — The SEBI-Registered Investment Advisor

**Name:** Rahul  
**Profile:** External SEBI-registered RIA (Registration Number: INA...)  
**Clients:** Manages 80–120 investor relationships independently  
**Operating context:** Works independently or as part of a small RIA firm; uses the platform to receive new investor meetings  
**Relationship to platform:** He is not an employee of the fintech startup; he is an external advisor who receives investor referrals through the platform  

**What Rahul needs from this platform:**
- A queue of only genuinely advice-needing investor meetings — not factual question calls
- Context before each meeting: what did the investor ask, why are they booking, what's confusing investors broadly this week
- A clean, mobile-accessible dashboard he can check between client sessions
- Reliable booking management — no double-bookings, clear cancellation/reschedule workflow

**What Rahul does NOT want:**
- To spend the first 10 minutes of every call asking the investor what they need
- A flood of low-quality bookings from investors who just had a factual question
- To be held accountable for the platform's content — he advises, the platform informs

---

## 6. Pain Points

### Investor Pain Points

| # | Pain Point | Severity | Current Workaround |
|---|---|---|---|
| IP-1 | Does not know what mutual fund schemes or categories are available | High | Google search — results are often biased or non-official |
| IP-2 | Cannot understand fees (TER, exit load, stamp duty) or how they impact returns | High | Either ignores or calls AMC helpline — long wait times |
| IP-3 | Does not know how to invest in or redeem from a scheme | Medium | YouTube tutorials — often outdated or misleading |
| IP-4 | Cannot understand how macroeconomic events (RBI rate changes, inflation) affect their investments | Medium | Financial news — too complex for most retail investors |
| IP-5 | Cannot articulate what they need help with — doesn't know what to ask | High | Either abandons the task or asks overly broad questions |
| IP-6 | Does not know whether to seek factual information or personal advice | High | No current mechanism to distinguish these |

### Advisor Pain Points

| # | Pain Point | Severity | Current Workaround |
|---|---|---|---|
| AP-1 | High volume of incoming queries, many of which are factual rather than advisory | High | Manually triages by reading each query — time-consuming |
| AP-2 | Cannot decide in advance whether a query needs human intervention or FAQ deflection | High | All meetings are treated equally regardless of complexity |
| AP-3 | No context before a client meeting — goes in blind | High | Asks the investor to re-explain during the call |
| AP-4 | Cannot personalise advice easily because there's no client history visible | Medium | Manual note-keeping outside the platform |
| AP-5 | No aggregate visibility into what investors are confused about as a category | Medium | Anecdotal pattern recognition from individual calls |

---

## 7. Solution Overview

The platform is structured around **three functional pillars**, with each pillar containing specific features:

```
┌─────────────────────────────────────────────────────────────┐
│                    INVESTOR ENTRY POINT                     │
│                  Guided Query Builder (F1)                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
              Triage & Routing Engine (F4)
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌─────────────┐ ┌────────────┐ ┌──────────────────┐
    │  FAQ Centre │ │ Education  │ │ Voice Appointment │
    │    (F2)     │ │  Hub (F3)  │ │  Scheduler (F5)  │
    └─────────────┘ └────────────┘ └────────┬─────────┘
                                            │
                                            ▼
                                  ┌──────────────────────┐
                                  │  Advisor Dashboard   │
                                  │  + Pre-Meeting Brief │
                                  │       (F6)           │
                                  └──────────┬───────────┘
                                             │
                                             ▼
                                  ┌──────────────────────┐
                                  │   Product Pulse      │
                                  │       (F7)           │
                                  │  (feeds back into    │
                                  │   F2 FAQ corpus)     │
                                  └──────────────────────┘
```

### Feature Map

| Feature ID | Feature Name | Pillar | User |
|---|---|---|---|
| F1 | Guided Query Builder | Information | Investor |
| F2 | FAQ Centre | Information | Investor |
| F3 | Asset Discovery & Education Hub | Information | Investor |
| F4 | Triage & Routing Engine | Operations | System |
| F5 | Voice Appointment Scheduler | Operations | Investor |
| F6 | Advisor Dashboard & Pre-Meeting Brief | Operations | Advisor |
| F7 | Product Pulse | Intelligence | Advisor / Product Team |

### Scope Note: Corpus Boundary for v1

All scheme-specific facts surfaced through the FAQ Centre (F2) and all worked examples in the Education Hub (F3) are grounded exclusively in the **Top 20 equity-oriented mutual fund schemes by AUM** (Appendix A). This boundary exists so that every fact in the corpus can be manually verified against the source SID/KIM during build — a prerequisite for the RAG faithfulness and citation accuracy evals in Section 11. Regulatory and process content (fees, SEBI rules, how-to guides) remains scheme-agnostic and is not subject to this constraint. Queries about schemes outside this list are explicitly declined rather than answered — see F2 and F4 below.

---

## 8. Feature Specifications

---

### F1 — Guided Query Builder

#### Purpose
The entry point for all investors. Designed specifically for Investor Pain Point IP-5: the investor doesn't know what to ask or where to start. The builder classifies investor intent in 3 steps and routes them to the correct platform feature without requiring them to know the platform's structure.

#### User Flow

**Step 1 — Intent Classification**
The investor sees three visual cards:
- "I have a specific question about a fund or fee" → Routes to Step 2A
- "I want to learn about mutual funds" → Routes to Step 2B
- "I need to speak to an investment advisor" → Routes directly to F5 (Voice Appointment Scheduler)

**Step 2A — Topic Narrowing (Specific Question)**
Investor selects from:
- Fees & charges (TER, exit load, stamp duty, STT)
- Scheme details (NAV, lock-in, benchmark, fund manager)
- Processes (how to invest, redeem, download statements)
- Regulatory questions (SEBI, AMFI, KIM, SID)
- Something else (free text input)

**Step 2B — Topic Narrowing (Learning)**
Investor selects from:
- Types of mutual funds
- How SIPs work
- Tax implications (factual only — no advice)
- Understanding fees and costs
- My rights as an investor

**Step 3 — Routing**
- Steps 2A → F2 (FAQ Centre) with topic pre-filled
- Steps 2B → F3 (Education Hub) with relevant category pre-selected

#### Behaviour Rules
- Maximum 3 steps to reach the destination; no dead ends
- If the investor selects "Something else" and types a free-text query, the Triage Engine (F4) classifies it before routing
- If the query is classified as advice-seeking, the system shows: *"This sounds like it may need personalised guidance. Would you like to book a call with a SEBI-registered advisor?"* and presents two options: Book a call (→ F5) or Continue to FAQ (investor chooses)
- The builder does not collect any PII

#### Edge Cases
- If the investor clicks "Back" mid-flow, they return to the previous step without losing their selection
- If the free-text query is ambiguous, the system makes a best-effort routing decision and displays a message: *"We've routed you to [FAQ/Education Hub] based on your question. If this isn't what you needed, you can also [book a call with an advisor]."*

---

### F2 — FAQ Centre

#### Purpose
A RAG-powered (Retrieval-Augmented Generation) factual Q&A engine grounded exclusively in official Indian mutual fund sources. Designed to answer investor questions about scheme details, fee structures, and processes — with no investment advice under any circumstance.

#### Core Behaviour

**Answer Format (all FAQ responses must follow this structure):**

```
[Answer — maximum 3 sentences, plain language]

Source: [Clickable source badge: AMFI / SEBI / AMC Factsheet / SID / KIM]
Link: [Direct URL to source document or page]

⚠️ This is factual information only. It does not constitute investment advice.
For personalised guidance, book a call with a SEBI-registered advisor →
```

**Query Processing Rules:**
- Before any other check, the system identifies whether the query names a specific scheme. If it does, the system checks the scheme against the v1 corpus (Appendix A — Top 20 schemes). If the named scheme is **not** in this list, the system does not attempt to answer and returns the Out-of-Scope message (below) — this check happens before Triage classification (F4) and before retrieval.
- Every remaining query is checked by the Triage Engine (F4) before generating an answer
- If a query is classified as advice-seeking, the system does not attempt an answer; it shows the compliance deflection message and offers to book a call
- Clarifying questions are permitted only when the scheme name is ambiguous (e.g., investor says "the HDFC fund" without specifying which scheme). Maximum 1 clarifying question; maximum 1 follow-up.
- If the FAQ corpus does not contain the answer, the system must explicitly say: *"We don't have verified information about this in our knowledge base. Please refer directly to the scheme's SID or call the AMC helpline."* — no approximation or hallucination is permitted.

**Out-of-Scope Scheme Message (when a named scheme is not in the Top 20 corpus):**

```
We currently have verified, source-cited information for a curated list of 20
major mutual fund schemes. [Scheme name] isn't part of that list yet, so we
can't give you a verified factual answer here.

You can find this information directly from:
→ The scheme's SID/KIM on the AMC's official website
→ AMFI's scheme search at amfiindia.com

Want help with a question about one of the 20 schemes we do cover instead?
[View covered schemes]
```

This is a corpus-coverage limitation, not a compliance refusal — it should read as a transparent boundary, not a deflection of a sensitive question.

**Query Types the FAQ Centre Handles:**

| Query Type | Example | Permitted |
|---|---|---|
| Exit load | "What is the exit load for Parag Parikh Flexi Cap Fund?" | ✅ |
| Minimum SIP | "What is the minimum SIP amount for SBI Bluechip?" | ✅ |
| Lock-in period | "What is the lock-in for an ELSS fund?" | ✅ |
| Fee explanation | "What does TER mean and how is it calculated?" | ✅ |
| Process | "How do I redeem my SIP?" | ✅ |
| Regulatory | "What is the difference between direct and regular plans?" | ✅ |
| Performance | "Which fund has the best returns?" | ❌ → Compliance deflection |
| Recommendation | "Should I invest in ELSS or index funds?" | ❌ → Compliance deflection |
| Portfolio advice | "Is my current SIP enough for retirement?" | ❌ → Compliance deflection |
| Out-of-scope scheme | "What is the exit load for [a scheme not in the Top 20 list]?" | ❌ → Out-of-scope message (corpus coverage limit, not a compliance refusal) |

#### Fee Explainer Sub-Feature

The Fee Explainer is a dedicated component within the FAQ Centre, generated weekly from the Product Pulse output (F7). It provides a plain-language explanation of the fee term or concept that generated the most investor confusion in the previous week.

**Fee Explainer Format:**
- Exactly 6 bullets
- One concept per bullet — no compound sentences
- Neutral, jargon-free language
- Must include:
  - What the fee is
  - How it is calculated
  - When it applies
  - Who charges it
  - How the investor can check it
  - What official source to refer to
- 2 official source links (AMFI or SEBI or SID)
- Last checked: [date] stamp

**Corpus Refresh Mechanism:**
When the weekly Product Pulse is generated, the top fee confusion topic triggers a new Fee Explainer. This explainer is automatically injected into the FAQ retrieval corpus within 24 hours of generation, so that future investor queries about that fee term return the improved explanation. The refresh must be versioned (v1, v2, etc.) and auditable.

---

### F3 — Asset Discovery & Education Hub

#### Purpose
A structured, SEBI-compliant library of mutual fund education content. Addresses IP-1 (investor doesn't know what opportunities exist) and IP-4 (investor doesn't understand macro context). The Hub is proactive — it helps investors discover what they didn't know to ask, unlike the FAQ which is reactive.

#### Content Architecture

**Section 1: Fund Categories (Factual definitions — sourced from SEBI category circular)**
- Equity funds: Large Cap, Mid Cap, Small Cap, Multi Cap, Flexi Cap, ELSS, Sectoral/Thematic, Index Funds/ETFs
- Debt funds: Liquid, Ultra Short Duration, Short Duration, Corporate Bond, Gilt, Dynamic Bond
- Hybrid funds: Aggressive Hybrid, Conservative Hybrid, Balanced Advantage (BAAF)
- Solution-oriented: Retirement Fund, Children's Fund
- For each: regulatory definition, how it works, benchmark type, typical investor profile (factual — NOT a recommendation)
- *Worked examples within each category (e.g., "here's what a Flexi Cap fund's SID typically discloses") are illustrated using schemes from the Top 20 corpus (Appendix A) wherever a representative scheme from that category exists in the list, so that every example used in the Hub is independently fact-checked against a real, indexed SID.*

**Section 2: Key Concepts (Explained in plain language)**
- NAV — what it is, what it is not
- SIP — how auto-investment mandates work, pause/modify/cancel
- SWP and STP — systematic withdrawal and transfer plans
- Direct vs. Regular plan — cost difference explained factually
- AUM — what it measures and what it doesn't
- Riskometer — the six risk categories per SEBI circular

**Section 3: Fee & Cost Education (Critical for investor trust)**
- Total Expense Ratio (TER) — how it is deducted, SEBI's maximum caps by fund category
- Exit load — when it applies, how to check, examples
- Stamp duty — flat rate on purchase transactions
- STT (Securities Transaction Tax) — applicable on equity fund redemptions
- Distributor vs. Direct cost difference

**Section 4: Investor Processes**
- How to start a SIP — step-by-step, platform-agnostic
- How to redeem mutual fund units
- How to download a capital gains statement
- How to update KYC
- How to file a complaint — SEBI SCORES portal, AMFI helpline

**Section 5: Investor Rights**
- Right to access SID/KIM before investing
- Right to receive account statements
- Right to nominate
- SEBI grievance redressal mechanism

#### Content Rules
- Every piece of content must cite its source (SEBI circular number, AMFI page, SID reference)
- No comparisons between fund houses or schemes that imply preference
- No forward-looking performance statements of any kind
- All content reviewed and approved by a SEBI-registered compliance officer before publishing
- Content versioned with last-reviewed date visible to investors

---

### F4 — Triage & Routing Engine

#### Purpose
The invisible layer that classifies every incoming investor query and routes it to the appropriate platform feature. This protects advisor time, maintains compliance, and ensures investors reach the right destination without having to understand the platform's structure. Not visible as a feature to the investor — it operates transparently in the background.

#### Classification Logic

Every investor query (typed or spoken) first passes a **scheme scope check**: if the query names a specific scheme, the engine checks it against the Top 20 corpus (Appendix A). A query about a scheme outside this list is routed to the Out-of-Scope response (see F2) regardless of how the rest of the query would otherwise classify. This check runs before the four-bucket classification below.

Every investor query is then classified into one of four buckets:

| Bucket | Description | Route |
|---|---|---|
| **Factual** | Query has a definitive, source-traceable answer | → FAQ Centre (F2) |
| **Educational** | Query requires understanding context rather than a specific fact | → Education Hub (F3) |
| **Advice-seeking** | Query requires personalised judgment about an investor's situation | → Compliance deflection + Offer to book call (F5) |
| **Unclassifiable / Edge** | Query is ambiguous, out of scope, or mixed | → Manual escalation flag to platform admin |

#### Compliance Classification Rules (Hard-coded, not LLM-discretionary)

The following signal patterns **always** trigger the Advice-Seeking classification, regardless of LLM confidence:

- Query contains: "should I", "is it good", "recommend", "best for me", "what should I do", "will it give returns", "is this safe for me"
- Query references the investor's personal situation: "I have ₹50,000 to invest", "I'm 35 years old", "I'm saving for retirement"
- Query compares two specific funds with intent to choose: "HDFC vs Axis — which one?"
- Query asks about someone else's portfolio: "my father has this fund, what should he do"

#### Output

For each classified query, the engine outputs:
1. Classification bucket
2. Confidence score (for logging / eval purposes — not shown to investor)
3. Routing destination
4. Escalation flag if confidence is below threshold (0.75)

#### Scale Expectations

| Bucket | Expected % of 1K DAU | Volume/day |
|---|---|---|
| Factual → FAQ | 35% | ~350 |
| Educational → Education Hub | 50% | ~500 |
| Advice-seeking → Booking | 10% | ~100 |
| Edge / Escalation | 5% | ~50 |

The triage engine is the primary mechanism by which advisor meetings are quality-controlled. At 10% conversion to bookings, 100 meetings/day across 30 advisors = ~3–4 meetings per advisor per day, which is a sustainable and appropriately filtered load.

---

### F5 — Voice Appointment Scheduler

#### Purpose
Enables investors to book a meeting with a SEBI-registered advisor via a voice-first interaction. Designed for IP-5 (investors who struggle to articulate their problem) — voice is more natural than form-filling when someone doesn't know what to ask. The scheduler also collects lightweight context that informs the Pre-Meeting Brief (F6).

#### Booking Flow

**Step 1 — Greeting (Dynamic)**
The voice agent opens with a greeting that references the top theme from the current week's Product Pulse:

*"Hi, I'm here to help you book a call with a SEBI-registered advisor. This week, many investors have been asking about [top theme from Pulse, e.g., exit load confusion on ELSS funds]. I can book a slot for that or anything else. What would you like to discuss?"*

If the Pulse has not yet been generated for the current week, the agent uses a generic opening.

**Step 2 — Topic Capture (Voice)**
The agent asks the investor to briefly describe what they want to discuss. The response is:
- Transcribed (STT)
- Classified by the Triage Engine
- If classified as a factual question, the agent gently offers: *"That sounds like something our FAQ Centre might be able to answer right now — would you like to try that first, or would you still prefer to speak to an advisor?"*
- If the investor confirms they want an advisor, booking proceeds regardless

**Step 3 — Slot Selection**
The agent reads available time slots (pulled from advisor availability calendar) and the investor selects by voice or on-screen tap.

**Step 4 — Optional Context**
*"Would you like to share anything else with the advisor before your call? This is optional — anything you say will be shared only with your advisor to help them prepare."*
- This is where the investor may voluntarily share portfolio details, specific funds, or context
- The agent acknowledges without storing PII in any persistent database beyond the meeting brief

**Step 5 — Email Capture**
*"What email address should we send your booking confirmation to?"*
- Email is the only identifier collected
- Used for: booking confirmation delivery + one post-meeting feedback prompt
- Explicitly stated to the investor at capture: *"We'll only use this to send your confirmation and a brief feedback request after your call."*
- Not used for marketing; not shared with third parties

**Step 6 — Booking Confirmation**
The agent reads the Booking Code aloud and displays it on screen:
*"Your booking is confirmed. Your Booking Code is [MF-XXXX]. Please keep this — your advisor will reference it at the start of your call."*

A confirmation email is sent immediately containing: Booking Code, topic, time slot, advisor name, and a reminder of what they said they'd discuss.

#### Booking Code Format
- Format: `MF-[4 alphanumeric characters]` (e.g., MF-K4R2)
- Generated at confirmation; unique per booking
- Stored server-side linked to: topic category, slot, advisor ID, investor email (hashed), session context
- Never linked to folio number, PAN, Aadhaar, or any financial identifier

#### PII Handling Rules
- The agent must not accept or store: PAN, Aadhaar, folio number, account number, or portfolio value
- If the investor volunteers such information, the agent responds: *"For security, please don't share account or identity details here. Your advisor will have a secure channel for that during your call."*
- Voice transcripts are stored for 7 days only, for Quality Assurance purposes, then deleted

#### Rescheduling & Cancellation
- Investor provides Booking Code + email to reschedule or cancel
- Available via voice or a minimal web form (no login required)
- Cancellations must be made at least 2 hours before the scheduled slot
- Advisor is notified immediately via dashboard and email on any change

---

### F6 — Advisor Dashboard & Pre-Meeting Brief

#### Purpose
Gives SEBI-registered advisors a single view to manage their meeting queue, review investor context before each session, and track their availability. Addresses AP-1, AP-2, AP-3, and AP-4.

#### Dashboard Components

**1. Meeting Queue**
- List of upcoming meetings, sorted by time
- Each entry shows: Booking Code, topic category (not the free-text — to protect privacy), scheduled time, status (Confirmed / Pending / Cancelled)
- Advisors can: Confirm, Reschedule (with reason), or Mark as Completed
- Filter by date, status, topic category

**2. Availability Calendar**
- Advisor sets their own available slots (time blocks, recurring or one-off)
- Platform displays only pre-set availability to investors during booking
- Advisor can block slots at any time; existing bookings in blocked periods trigger automatic re-booking notification to investor

**3. Pre-Meeting Brief Card**

Displayed for each upcoming meeting, accessible from the Meeting Queue. Contains:

| Field | Source | Notes |
|---|---|---|
| Booking Code | F5 output | Reference only |
| Topic Category | F5 classification | Broad category — not free text |
| Investor's stated context | F5 voice intake (optional) | Only if investor chose to share |
| FAQ queries from session | F2 session log | What factual questions did they ask before booking? (session-only, not persistent) |
| This week's top Pulse theme | F7 output | Aggregate context — not investor-specific |
| Relevant Education Hub articles | F3 auto-link | Based on topic category |

**What the Brief Does NOT Include:**
- Portfolio details (unless investor volunteered them)
- PAN, Aadhaar, or any financial identifiers
- NAV or holdings data
- Any AI-generated advisory suggestion

**4. Post-Meeting Completion**
After the advisor marks a meeting as Complete, the platform sends the investor a one-question feedback email:
*"How useful was your call with your advisor today? [Very useful / Somewhat useful / Not useful]"*
This data feeds into the Product Pulse (F7) but is not visible to the individual advisor.

#### Access & Authentication
- Advisors log in with email + OTP (no password)
- Session timeout: 30 minutes of inactivity
- Dashboard is accessible on desktop and mobile browser
- No native app in v1

---

### F7 — Product Pulse

#### Purpose
A weekly AI-generated intelligence report for advisors and the platform's internal product team. Aggregates investor query data to surface what's confusing investors, what topics are trending, and what product improvements are recommended. Addresses AP-5 and provides the intelligence layer that makes the rest of the platform smarter over time.

#### Inputs

The Pulse ingests:
- FAQ queries from the past 7 days (volume, topic distribution, unanswered queries)
- Voice booking transcripts (topic categories and frequency)
- Post-meeting feedback scores (aggregated, anonymous)
- Fee Explainer query frequency (which fee terms were most searched)

No PII enters the Pulse pipeline. All data is aggregated and anonymised at ingestion.

#### Weekly Output Format

**Section 1: Top Investor Themes (Required)**
- Top 3 confusion themes this week, ranked by query volume
- Example: "Exit load on ELSS post-lock-in period — 112 queries"
- Each theme accompanied by 1–2 anonymised representative investor questions

**Section 2: User Quotes (Required)**
- Minimum 2, maximum 5 anonymised, representative investor quotes
- Must not include any PII — names, locations, fund names replaced with [Investor] / [Scheme]
- Purpose: give advisors a qualitative feel for how investors are phrasing their confusion

**Section 3: Key Observation (Required)**
- 1 paragraph, ≤ 100 words
- A synthesised insight about investor behaviour this week
- Example: *"Fee confusion continues to dominate investor queries, but this week the confusion has shifted from TER to exit load specifically — suggesting investors may be encountering redemption for the first time. This may indicate SIP maturity-related confusion rather than new investor onboarding questions."*

**Section 4: Fee Confusion Spotlight (Required)**
- The single fee term or concept that generated the most queries this week
- Triggers automatic Fee Explainer refresh in F2 corpus

**Section 5: 3 Product Recommendations (Required)**
- Exactly 3 actionable recommendations for the platform product team
- Each must be specific, feasible, and tied to a data point from the week's queries
- Example: *"Add an exit load calculator to the Education Hub — 'how much exit load will I pay' was asked 34 times this week with no direct FAQ answer available."*

**Section 6: Pulse-to-FAQ Refresh Status**
- Confirmation that the Fee Explainer has been updated in the FAQ corpus
- Version number of the updated explainer
- Date of corpus refresh

#### Format Constraints
- Total word count: ≤ 250 words (Sections 1–4 combined)
- Delivered every Monday by 9:00 AM IST
- Visible in Advisor Dashboard as a pinned weekly card
- Also delivered to internal product team via email

---

## 9. Data Sources & Corpus

### Primary Sources (Mandatory — All FAQ and Education content must trace to these)

| Source | Content Type | URL | Cost | Auth Required |
|---|---|---|---|---|
| AMFI India | NAV data, scheme codes, investor education | amfiindia.com | Free | None |
| SEBI | Regulatory circulars, investor rights, fee caps | sebi.gov.in | Free | None |
| Individual AMC websites | SID and KIM documents for each scheme | Per AMC | Free | None |
| mfapi.in | NAV history and scheme metadata for 14,000+ schemes | mfapi.in | Free | None |
| mfdata.in | NAV, expense ratio, holdings, financial ratios | mfdata.in | Free | None |
| Zerodha Varsity | Plain-language MF education content (conceptual, not advisory) | zerodha.com/varsity | Free | None |

### Minimum Source Corpus Requirements
- Scheme-specific sources: SID, KIM, and current factsheet for each of the **Top 20 schemes** in Appendix A — minimum 3 documents per scheme, ~60 documents total
- Regulatory and educational sources (scheme-agnostic): AMFI investor education pages, SEBI circulars, Zerodha Varsity articles — minimum 30 URLs, in addition to the scheme-specific documents above
- All sources must be publicly accessible — no paywalled or login-gated content
- All sources must be from official or officially-cited educational resources — no personal finance blogs, YouTube channels, or aggregator sites
- The Top 20 scheme list (Appendix A) is locked at project kickoff for build stability; see Section 15 for the refresh policy as AUM rankings shift over time

### Source Manifest Maintenance
- Sources are reviewed and re-validated monthly
- Broken links are flagged and replaced within 48 hours
- New SEBI/AMFI circulars are added within 7 days of publication
- Source manifest (full list of indexed URLs) is visible to investors in the FAQ interface under a "Sources" section

### Data That Is NOT Permitted in the Corpus
- Analyst reports or fund manager commentary
- News articles about fund performance
- Any source that expresses a view on which fund to buy or avoid
- Any source not independently verifiable as official

---

## 10. User Flows & Journeys

### Journey 1: Investor — Factual FAQ Query

```
Investor arrives at platform
        ↓
Guided Query Builder (F1)
→ Selects: "I have a specific question about a fund or fee"
→ Selects topic: "Fees & charges"
        ↓
Triage Engine (F4)
→ Classifies as: Factual
        ↓
FAQ Centre (F2)
→ Investor types: "What is the exit load for Parag Parikh Flexi Cap Fund?"
→ RAG retrieves answer from SID corpus
→ System displays: Answer (≤3 sentences) + Source badge + Compliance disclaimer
        ↓
Investor reads answer
→ Option A: Satisfied → Session ends
→ Option B: Still confused → Taps "Book a call with an advisor" → Journey 3
→ Option C: Asks follow-up factual question → FAQ handles
→ Option D: Asks advice question → Compliance deflection + Offer to book call
```

---

### Journey 2: Investor — Education Browsing

```
Investor arrives at platform
        ↓
Guided Query Builder (F1)
→ Selects: "I want to learn about mutual funds"
→ Selects: "Understanding fees and costs"
        ↓
Education Hub (F3)
→ Lands on Fees & Costs category page
→ Browses: TER explainer, Exit Load explainer, Direct vs Regular plan comparison
→ Each article has source citations and compliance disclaimers
        ↓
After reading:
→ Option A: Satisfied, leaves platform
→ Option B: Has a specific question → "Ask the FAQ" CTA → Journey 1
→ Option C: Needs advisor → "Book a call" CTA → Journey 3
```

---

### Journey 3: Investor — Voice Appointment Booking

```
Investor arrives at Voice Scheduler (F5)
[Can arrive directly, from FAQ deflection, or from Education Hub CTA]
        ↓
Voice Agent Greeting
→ Dynamic reference to this week's top Pulse theme
→ Investor speaks: "I want to ask about why my SIP was charged an exit load
   when I redeemed after one year."
        ↓
Triage Engine (F4)
→ Classifies as: Advice-seeking (personal situation)
→ Booking proceeds
        ↓
Slot Selection
→ Agent reads 3 available slots
→ Investor selects by voice: "The Friday 3pm slot."
        ↓
Optional Context Capture
→ Investor adds: "I invested in a debt fund in 2023."
→ Agent confirms, flags: no PII detected ✓
        ↓
Email Capture
→ Investor provides email address (spoken or typed)
→ System sends confirmation email immediately
        ↓
Booking Confirmation
→ Booking Code generated: MF-T7Q1
→ Agent reads code aloud
→ Investor sees confirmation screen with code, time, topic, advisor name
```

---

### Journey 4: Advisor — Pre-Meeting Preparation

```
Advisor logs into dashboard (F6) — email + OTP
        ↓
Dashboard home: Meeting Queue
→ Sees: 3 upcoming meetings today
→ Meeting #1: MF-T7Q1 | Topic: Debt fund fees | Friday 3:00 PM
        ↓
Advisor opens Pre-Meeting Brief for MF-T7Q1
→ Topic category: Fees & Charges (Debt Fund)
→ Investor context: "I invested in a debt fund in 2023."
→ FAQ queries this session: Investor asked about TER before booking
→ This week's Pulse top theme: Exit load confusion on short-duration debt funds
→ Relevant Education Hub link: [Exit Load Explainer — v3, updated Monday]
        ↓
Advisor joins call prepared
→ Already knows: investor is confused about exit load on a debt fund purchase from 2023
→ Pulse context: this is a common confusion this week, not an isolated case
```

---

### Journey 5: Product Team — Weekly Pulse Review

```
Monday 9:00 AM IST
        ↓
Pulse generated automatically
→ Inputs: FAQ queries (past 7 days) + Booking topics + Feedback scores
        ↓
Pulse Report published to:
→ Advisor Dashboard (pinned card)
→ Internal product team (email)
        ↓
Product team reviews:
→ Top theme: Exit load confusion — 112 queries
→ Key observation: Redemption-related confusion, likely SIP maturity cohort
→ 3 Product Recommendations:
   1. Add exit load calculator to Education Hub
   2. Add FAQ entry: "Does exit load apply if I only redeem part of my SIP?"
   3. Create a dedicated "First Redemption Guide" article in Education Hub
        ↓
Fee Explainer auto-updated in FAQ corpus
→ Topic: Exit load on debt funds
→ Version: v4
→ Corpus refresh confirmed ✓
        ↓
FAQ Centre now returns improved exit load answer for all future queries
```

---

## 11. Success Metrics & KPIs

### Platform-Level Metrics

| Metric | Definition | Target (Month 3) | Target (Month 6) |
|---|---|---|---|
| FAQ Deflection Rate | % of investor sessions that are resolved by FAQ without advisor booking | ≥ 75% | ≥ 85% |
| Compliance Violation Rate | % of FAQ answers that contain investment advice (manual audit sample) | 0% | 0% |
| Source Citation Rate | % of FAQ answers that include a clickable source link | 100% | 100% |
| Advisor Meeting Fill Rate | % of bookings that result in a completed meeting (not cancelled/no-show) | ≥ 70% | ≥ 80% |
| Post-Meeting Satisfaction | % of post-meeting feedback rated "Very useful" | ≥ 60% | ≥ 70% |

---

### Feature-Level Metrics

**F1 — Guided Query Builder**

| Metric | Target |
|---|---|
| Builder completion rate (reaches a feature) | ≥ 80% of sessions that start the builder |
| Drop-off at Step 1 | ≤ 15% |
| Correct routing rate (investor reaches the right feature) | ≥ 85% (measured via post-session feedback: "Did this answer your question?") |

**F2 — FAQ Centre**

| Metric | Target |
|---|---|
| Answer faithfulness (RAG eval) | ≥ 0.80 (automated evaluation against Golden Dataset) |
| Answer relevance (RAG eval) | ≥ 0.80 |
| Citation accuracy (every answer has correct, live source link) | 100% |
| Out-of-scope scheme detection rate (queries about non-corpus schemes correctly identified and deflected, not hallucinated) | 100% |
| Compliance adversarial pass rate | 5/5 adversarial test prompts correctly refused |
| Fee Explainer corpus refresh lag | ≤ 24 hours from Pulse generation |

**F4 — Triage Engine**

| Metric | Target |
|---|---|
| Classification accuracy | ≥ 90% (sampled weekly against manual review) |
| Advice-seeking query that reaches FAQ | 0% — hard constraint |
| Edge case escalation rate | ≤ 5% of total queries |

**F5 — Voice Appointment Scheduler**

| Metric | Target |
|---|---|
| Booking completion rate (voice flow to confirmation) | ≥ 75% |
| Dynamic greeting accuracy (Pulse theme correctly referenced) | 100% when Pulse is available |
| Booking Code delivery (email sent within 2 min of confirmation) | 100% |
| PII flag rate (investor volunteers PII and agent deflects correctly) | 100% deflection |

**F6 — Advisor Dashboard**

| Metric | Target |
|---|---|
| Advisor dashboard DAU (% of 30 advisors logging in on meeting days) | ≥ 90% |
| Pre-Meeting Brief view rate (% of meetings where brief is opened) | ≥ 85% |
| Average advisor prep time (self-reported, post-pilot) | ≤ 5 minutes |

**F7 — Product Pulse**

| Metric | Target |
|---|---|
| On-time delivery (Mondays by 9:00 AM IST) | 100% |
| Word count compliance (≤ 250 words for Sections 1–4) | 100% |
| Exactly 3 product recommendations per Pulse | 100% |
| At least 1 user quote per Pulse | 100% |
| Pulse-to-corpus refresh confirmed | 100% within 24 hours |

---

## 12. Acceptance Criteria

### F1 — Guided Query Builder

- [ ] Investor can complete the intent classification flow in ≤ 3 steps
- [ ] All three intent cards are visible and selectable on mobile (375px viewport minimum)
- [ ] "Something else" free-text input is passed to Triage Engine and routed correctly
- [ ] Advice-seeking queries surfaced during Query Builder trigger the compliance message and advisor booking offer before routing to FAQ
- [ ] Builder is accessible without login, without email, and without any PII input
- [ ] "Back" navigation is available at every step and restores prior selection

### F2 — FAQ Centre

- [ ] Every answer is ≤ 3 sentences
- [ ] Every answer includes exactly one source citation with a live, clickable URL
- [ ] Every answer includes the compliance disclaimer text verbatim
- [ ] When investor asks about a scheme not in the Top 20 list (Appendix A), the system returns the Out-of-Scope message and does not attempt to answer — confirmed with test queries for at least 5 non-corpus schemes
- [ ] The system refuses to answer any query classified as advice-seeking by F4 — confirmed with 5 adversarial test prompts
- [ ] When corpus has no answer, the system explicitly states it cannot answer, with no fabricated content
- [ ] Clarifying questions are limited to 1 per ambiguous scheme query
- [ ] Fee Explainer: exactly 6 bullets, 2 official source links, Last checked stamp present
- [ ] Fee Explainer is retrievable by the FAQ engine within 24 hours of Pulse generation
- [ ] AMFI disclaimer for performance data is displayed whenever NAV data appears in any answer

### F3 — Education Hub

- [ ] Each content article has a source citation (SEBI circular number / AMFI page / SID reference)
- [ ] No content article contains a fund recommendation or fund comparison implying preference
- [ ] No forward-looking performance language exists in any article
- [ ] Last-reviewed date is visible on every article
- [ ] Content is accessible without login
- [ ] Every article has a "Still have questions? Ask the FAQ" and "Book a call with an advisor" CTA

### F4 — Triage & Routing Engine

- [ ] 100% of queries containing hard-coded advice signals are classified as Advice-seeking — no exceptions
- [ ] Classification output (bucket + confidence score) is logged for every query
- [ ] Queries below confidence threshold (0.75) are flagged for manual review
- [ ] Engine routes to the correct destination for 10 test queries covering all 4 buckets

### F5 — Voice Appointment Scheduler

- [ ] Voice agent greeting dynamically references the current week's top Pulse theme when Pulse is available
- [ ] When Pulse is unavailable (first week), a static generic greeting is used — no errors
- [ ] Booking Code is generated, read aloud, and displayed on screen at confirmation
- [ ] Booking confirmation email is sent within 2 minutes of confirmation
- [ ] Agent deflects PII (PAN, Aadhaar, folio, account number) with the correct response — confirmed with 3 test cases
- [ ] Investor can reschedule or cancel using only Booking Code + email
- [ ] Voice transcript is not stored beyond 7 days

### F6 — Advisor Dashboard & Pre-Meeting Brief

- [ ] Advisor can log in with email + OTP only — no password required
- [ ] Meeting Queue shows all upcoming meetings with correct Booking Code, topic, and time
- [ ] Pre-Meeting Brief for each meeting is accessible 1 click from Queue
- [ ] Brief displays: topic category, investor's optional context, session FAQ queries, current Pulse theme, and relevant Education Hub links
- [ ] Brief does NOT display: PAN, Aadhaar, folio, account number, or AI-generated advisory recommendation
- [ ] Advisor can mark a meeting as Complete — triggers post-meeting feedback email to investor
- [ ] Session timeout occurs after 30 minutes of inactivity
- [ ] Dashboard is usable on mobile browser (iOS Safari, Android Chrome)

### F7 — Product Pulse

- [ ] Pulse is generated and published every Monday by 9:00 AM IST
- [ ] Total word count for Sections 1–4 is ≤ 250 words
- [ ] Exactly 3 product recommendations are included
- [ ] At least 1 anonymised user quote is included
- [ ] No PII appears anywhere in the Pulse output
- [ ] Fee Confusion Spotlight triggers a Fee Explainer refresh in F2 corpus
- [ ] Corpus refresh is confirmed and versioned within 24 hours of Pulse delivery
- [ ] Pulse is visible as a pinned card in Advisor Dashboard

---

## 13. Technical Constraints & Architecture Notes

### Frontend
- React (single-page application) with Tailwind CSS
- Mobile-responsive minimum breakpoint: 375px (iPhone SE)
- Voice input: Web Speech API (browser-native) with Whisper API fallback for accuracy
- Accessibility: WCAG 2.1 AA minimum compliance

### Backend
- Python + FastAPI
- RAG pipeline: LangChain or LlamaIndex with vector store (Pinecone or Weaviate — free tier sufficient at this scale)
- LLM: GPT-4o or Claude Sonnet via API (OpenAI or Anthropic — choose based on cost model)
- Voice STT: Whisper API
- Voice TTS: ElevenLabs or Google Cloud TTS for agent voice output

### Data Pipeline
- AMFI NAV data: Fetched nightly from amfiindia.com and mfapi.in
- SID/KIM documents: PDF extraction pipeline; re-indexed weekly or on AMC update
- Corpus refresh (Fee Explainer): Automated trigger from Pulse pipeline
- No real-time trading data required

### Storage
- No persistent investor data beyond: hashed email (for booking), session FAQ logs (7 days), booking records
- Advisor data: email, OTP credentials, availability settings, meeting records
- All storage India-resident (AWS Mumbai or Google Cloud Mumbai region) for data residency compliance

### Email
- Transactional email: SendGrid or AWS SES
- Uses: Booking confirmation, post-meeting feedback, advisor OTP, Pulse delivery

### Deployment
- Frontend: Vercel (or equivalent)
- Backend: Railway or Render (free tier sufficient for 1K DAU)
- CI/CD: GitHub Actions

### Cost Estimate (Monthly, at 1K DAU)
| Service | Estimated Cost |
|---|---|
| LLM API (FAQ queries, Triage, Pulse) | ₹8,000–₹15,000 |
| STT (Whisper API — voice bookings) | ₹2,000–₹4,000 |
| Vector store (Pinecone free tier) | ₹0 |
| Email (SendGrid free tier: 100/day) | ₹0 |
| Hosting (Vercel + Railway free tier) | ₹0 |
| **Total (approximate)** | **₹10,000–₹20,000/month** |

---

## 14. Out of Scope (v1)

The following are explicitly excluded from v1 of this platform:

| Item | Reason for Exclusion |
|---|---|
| Investor account / login | No portfolio linkage; session-based model chosen for v1 |
| Portfolio analysis or tracking | Requires SEBI regulatory clearance; out of scope for advice-only model |
| Mutual fund transactions (buy/sell/SIP setup) | Requires AMC partnerships, payment infrastructure, and AMFI ARN registration |
| Equities, ETFs, bonds, or any asset class other than mutual funds | Scope decision; adds compliance and data complexity |
| Advisor-to-investor messaging within platform | Avoids PII transmission liability; advisors communicate through their own secure channels |
| Advisor performance rating / review system | Regulatory sensitivity; advisors are independent RIAs |
| Native mobile app (iOS/Android) | v1 is web-only; mobile app considered for v2 |
| Multilingual support | v1 is English-only; Hindi and regional language support in v2 roadmap |
| Integration with Zerodha Kite MCP / Groww MCP | Account-linked MCPs are not compatible with the no-account investor model; competitor dependency risk |
| Schemes outside the Top 20 by AUM (Appendix A) | v1 corpus is intentionally bounded to enable manual fact verification and rigorous eval; full-universe coverage (14,000+ schemes) is a v2 roadmap item once the pipeline is proven |
| Automated advisor matching / recommendation | Would constitute a service recommendation — regulatory complexity |

---

## 15. Risks & Open Questions

### Risks

| Risk | Severity | Likelihood | Mitigation |
|---|---|---|---|
| LLM hallucination in FAQ answers | High | Medium | RAG grounding + source citation requirement + weekly adversarial eval |
| Triage misclassification routes advice-seeking query to FAQ | High | Medium | Hard-coded signal rules for advice-seeking; manual audit sampling weekly |
| SEBI regulatory change affecting permitted content | High | Low | Monthly compliance review; content versioned and auditable |
| Advisor no-shows or low availability | Medium | Medium | Minimum availability SLA in advisor onboarding agreement |
| mfapi.in or mfdata.in downtime (free third-party service) | Medium | Low | AMFI direct as primary fallback; cached data for 24-hour resilience |
| Investor volunteers PII on voice call | Medium | High | Agent deflection logic; no PII stored in transcript |
| Fee Explainer corpus refresh failure (Pulse → F2 pipeline break) | Medium | Low | Automated confirmation check; alert to platform admin on failure |
| Top 20 scheme list becomes stale as AUM rankings shift month-to-month | Low | High | List is locked at project kickoff for build stability (not auto-updated); reviewed quarterly against fresh AMFI monthly data; corpus expansion is a planned v2 activity, not a reactive patch |
| Low advisor dashboard adoption | Low | Medium | Pilot with 2–3 advisors first; iterate dashboard UX before full rollout |

### Open Questions

| # | Question | Owner | Resolution Needed By |
|---|---|---|---|
| OQ-1 | Which SEBI-registered RIAs will be onboarded at launch, and what is their onboarding process and agreement structure? | Business / Legal | Before F5/F6 build |
| OQ-2 | Is Zerodha Varsity content licensable for use in our Education Hub corpus, or should we only link out to it? | Legal | Before F3 content build |
| OQ-3 | What is the SID/KIM extraction strategy for AMC PDFs — manual curation or automated scraping? | Engineering | Before F2 corpus build |
| OQ-4 | What is the data retention policy for voice transcripts — is 7 days sufficient under applicable Indian data protection norms? | Legal / Compliance | Before F5 build |
| OQ-5 | Will the Product Pulse be visible to all 30 advisors equally, or only to advisors relevant to the queried topic areas? | Product | Before F7 build |
| OQ-6 | Does the post-meeting feedback email require an unsubscribe link under India's data protection framework? | Legal | Before F6 build |
| OQ-7 | Which LLM provider (Anthropic vs. OpenAI) offers the better cost-compliance tradeoff for India-specific financial content at this scale? | Engineering | Before RAG build |
| OQ-8 | Should the Top 20 scheme list (Appendix A) be locked permanently for the capstone duration, or re-validated against live AMFI monthly data at each milestone checkpoint? | Product | Before F2 corpus build |

---

## Appendix A: Top 20 Schemes — v1 Corpus Scope

### Selection Methodology

The v1 corpus is bounded to the 20 equity-oriented mutual fund schemes with the highest Assets Under Management (AUM) in India, as a proxy for "most invested in." This list should be sourced and locked at project kickoff using the following process:

1. Pull the latest **AMFI Monthly Report** (available as official PDF/Excel at `amfiindia.com/research-information/amfi-monthly`) — this is the canonical, regulator-recognised source for scheme-level AUM data.
2. Filter to equity-oriented categories only (Large Cap, Mid Cap, Small Cap, Flexi Cap, Multi Cap, ELSS, Large & Mid Cap, Index Funds/ETFs) — debt, liquid, and hybrid schemes are excluded from this list, consistent with the "Indian equities market" framing.
3. Rank by AUM and select the top 20.
4. Re-validate the list quarterly; do not silently swap schemes mid-build, since every scheme in the corpus requires a manually verified SID/KIM extraction.

**Important note on data currency:** AUM rankings shift monthly with market movements and fund flows, and AMFI's official scheme-level data is published as PDF/Excel rather than a queryable API. The list below is therefore **illustrative** — built from well-established, large, category-representative schemes across major AMCs (SBI, ICICI Prudential, HDFC, Nippon India, Kotak, Aditya Birla Sun Life, Axis, UTI, Mirae Asset, Parag Parikh, DSP) based on recent public reporting. It is not a substitute for pulling the live AMFI monthly ranking at kickoff. Treat the table below as a working draft to be confirmed, not a final locked list.

### Illustrative Top 20 (to be confirmed against live AMFI data at kickoff)

| # | Scheme Name (illustrative) | Category | AMC |
|---|---|---|---|
| 1 | Parag Parikh Flexi Cap Fund | Flexi Cap | PPFAS Mutual Fund |
| 2 | SBI Bluechip Fund | Large Cap | SBI Mutual Fund |
| 3 | ICICI Prudential Bluechip Fund | Large Cap | ICICI Prudential |
| 4 | HDFC Flexi Cap Fund | Flexi Cap | HDFC Mutual Fund |
| 5 | ICICI Prudential Value Discovery Fund | Value / Flexi Cap | ICICI Prudential |
| 6 | Nippon India Large Cap Fund | Large Cap | Nippon India |
| 7 | Nippon India Small Cap Fund | Small Cap | Nippon India |
| 8 | SBI Small Cap Fund | Small Cap | SBI Mutual Fund |
| 9 | HDFC Mid-Cap Opportunities Fund | Mid Cap | HDFC Mutual Fund |
| 10 | Kotak Emerging Equity Fund | Mid Cap | Kotak Mahindra |
| 11 | Axis Bluechip Fund | Large Cap | Axis Mutual Fund |
| 12 | Mirae Asset Large Cap Fund | Large Cap | Mirae Asset |
| 13 | Aditya Birla Sun Life Flexi Cap Fund | Flexi Cap | Aditya Birla Sun Life |
| 14 | UTI Nifty 50 Index Fund | Index Fund | UTI Mutual Fund |
| 15 | HDFC Nifty 50 Index Fund | Index Fund | HDFC Mutual Fund |
| 16 | Axis Long Term Equity Fund (ELSS) | ELSS | Axis Mutual Fund |
| 17 | Mirae Asset Tax Saver Fund | ELSS | Mirae Asset |
| 18 | DSP Flexi Cap Fund | Flexi Cap | DSP Mutual Fund |
| 19 | Quant Small Cap Fund | Small Cap | Quant Mutual Fund |
| 20 | Motilal Oswal Midcap Fund | Mid Cap | Motilal Oswal |

### Why This Composition

The illustrative list deliberately spans 7 equity categories (Large Cap, Flexi Cap, Mid Cap, Small Cap, ELSS, Index Fund, Value) across 11 different AMCs, rather than clustering around one fund house. This matters for two downstream requirements:

- **Golden Dataset construction (Section 11):** the RAG evaluation requires 5 questions spanning both scheme facts and fee logic; category diversity ensures these questions can probe different exit load structures, lock-in rules (especially ELSS), and benchmark types rather than testing the same pattern 5 times.
- **Education Hub worked examples (F3):** each fund category section in the Hub can reference a real, source-verified scheme from this list rather than a generic or hypothetical example.

### What Changes Elsewhere in This PRD Because of This Appendix

- F2 (FAQ Centre) checks every scheme-specific query against this list before attempting an answer
- F4 (Triage Engine) runs this check before its four-bucket classification
- F3 (Education Hub) draws illustrative examples from this list where possible
- Section 9 source corpus is now ~60 scheme-specific documents (SID/KIM/factsheet × 20) plus 30+ scheme-agnostic regulatory/educational URLs
- Section 11 Golden Dataset and adversarial eval sets should be constructed using only schemes from this list
- v2 roadmap (Section 14) is where full-universe (14,000+ scheme) coverage is planned, once the curated-corpus pipeline is proven

---

*End of Document — Version 1.1 Draft (Updated: Scoped to Top 20 Schemes)*
*Next Review: [To be scheduled with Engineering, Design, and Compliance leads]*
