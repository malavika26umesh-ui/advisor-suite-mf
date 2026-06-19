"""Seed the education_articles table for the F3 Education Hub (Sprint 9).

Idempotent: re-running upserts by slug instead of duplicating rows.

Usage:
    python corpus/scripts/seed_education.py
"""
import asyncio
import sys
from datetime import date
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(BACKEND_ROOT))

from sqlalchemy import select  # noqa: E402

from app.core.database import async_session_maker  # noqa: E402
from app.models.education_models import EducationArticle  # noqa: E402

TODAY = date.today()

AMFI = {"label": "AMFI", "url": "https://www.amfiindia.com",
        "citation_text": "Association of Mutual Funds in India — official mutual fund industry body."}
MFSH = {"label": "Mutual Funds Sahi Hai", "url": "https://www.mutualfundssahihai.com/en",
        "citation_text": "AMFI's official investor education initiative."}
SEBI = {"label": "SEBI", "url": "https://www.sebi.gov.in",
        "citation_text": "Securities and Exchange Board of India — the mutual fund regulator."}
SCORES = {"label": "SEBI SCORES", "url": "https://scores.sebi.gov.in",
          "citation_text": "SEBI's official online investor grievance redressal portal."}

# (slug, title, body_markdown, citations, scheme_example_id, most_misunderstood)
FUND_CATEGORY_ARTICLES = [
    ("large-cap-funds", "Large Cap Funds",
     "Large cap funds, under SEBI's mutual fund scheme categorization framework, must invest at "
     "least 80% of their assets in equity and equity-related instruments of the top 100 listed "
     "companies by full market capitalization. These are typically well-established, financially "
     "stable companies. Because a large cap fund's portfolio overlaps heavily with broad market "
     "indices, its returns tend to track the broader market more closely than smaller-cap "
     "categories.\n\n"
     "SEBI requires every scheme to follow one specific category definition and prohibits a fund "
     "house from running more than one scheme in the same category (with limited exceptions), so "
     "that investors can compare like-for-like.", [AMFI, SEBI], 2, False),
    ("mid-cap-funds", "Mid Cap Funds",
     "Mid cap funds must invest at least 65% of their assets in equity and equity-related "
     "instruments of companies ranked 101st to 250th by full market capitalization, per SEBI's "
     "categorization norms. These companies are generally larger than small caps but less "
     "established than large caps, which means scheme NAVs in this category can move more sharply "
     "in both directions than large cap schemes.\n\n"
     "The exact list of companies that fall into the mid cap bracket is reconstituted periodically "
     "by AMFI based on updated market capitalization data, so a scheme's holdings can shift over "
     "time even without any change in its stated strategy.", [AMFI, SEBI], 9, False),
    ("small-cap-funds", "Small Cap Funds",
     "Small cap funds must invest at least 65% of their assets in equity and equity-related "
     "instruments of companies ranked 251st and below by full market capitalization. This is the "
     "category with the smallest, least liquid underlying stocks among the equity categories "
     "defined by SEBI, which can mean wider bid-ask spreads and higher day-to-day NAV volatility.\n\n"
     "Because liquidity in the underlying stocks can be limited, fund houses sometimes restrict or "
     "pause fresh lump-sum subscriptions into small cap schemes during periods of high inflows — "
     "this is a scheme-level decision disclosed in the SID/KIM, not a guarantee against volatility.",
     [AMFI, SEBI], 7, False),
    ("flexi-cap-funds", "Flexi Cap Funds",
     "Flexi cap funds must invest a minimum of 65% of their assets in equity and equity-related "
     "instruments, with no mandated minimum allocation to any particular market-cap segment (large, "
     "mid, or small). This gives the fund manager discretion to move the portfolio's market-cap mix "
     "as their view of relative opportunity changes.\n\n"
     "Because allocation across market-cap segments is left to the fund manager's discretion, two "
     "flexi cap schemes can look very different from each other at any given time — the category "
     "label alone does not tell you the current market-cap mix; that is disclosed in the scheme's "
     "monthly factsheet.", [AMFI, SEBI], 1, False),
    ("multi-cap-funds", "Multi Cap Funds",
     "Multi cap funds must invest at least 75% of their total assets in equity, with a SEBI-mandated "
     "minimum of at least 25% each in large cap, mid cap, and small cap stocks. This is the key "
     "structural difference from flexi cap funds, where market-cap allocation is left entirely to "
     "the fund manager.\n\n"
     "Because a fixed minimum must be maintained in each market-cap segment at all times, a multi "
     "cap fund's small- and mid-cap exposure cannot be reduced below the regulatory floor even if "
     "the fund manager's outlook on those segments turns cautious.", [AMFI, SEBI], None, False),
    ("focused-funds", "Focused Funds",
     "A focused fund is permitted to invest in equity and equity-related instruments of a maximum of "
     "30 stocks, as defined under SEBI's scheme categorization. The scheme must specify upfront, in "
     "its SID, the particular market-cap segment (large, mid, small, or multi) it intends to focus "
     "on.\n\n"
     "Concentrating a portfolio into a smaller number of stocks means each individual holding "
     "carries proportionally more weight in the scheme's overall performance than in a "
     "diversified fund holding 60–80 stocks.", [AMFI, SEBI], None, False),
    ("elss-funds", "ELSS (Tax-Saving) Funds",
     "Equity Linked Savings Schemes (ELSS) are equity mutual funds that invest at least 80% of "
     "assets in equity and equity-related instruments, and qualify for a tax deduction under Section "
     "80C of the Income Tax Act up to the prescribed limit. Every ELSS investment, including each "
     "SIP instalment, is subject to a mandatory 3-year lock-in from its date of investment.\n\n"
     "Because each SIP instalment has its own 3-year lock-in clock, units bought through a running "
     "SIP become redeemable in instalments over time, not all at once when the SIP itself completes "
     "3 years.", [AMFI, SEBI], 16, False),
    ("index-funds", "Index Funds",
     "An index fund is a passively managed scheme that aims to replicate the composition and "
     "performance of a specified market index, such as the Nifty 50, by holding the same "
     "constituent stocks in broadly the same proportions. The fund manager does not select stocks "
     "based on individual judgement; the index methodology decides the portfolio.\n\n"
     "Tracking error — the extent to which a scheme's returns deviate from its underlying index — "
     "is a standard, SEBI-mandated disclosure for index funds and is published periodically by the "
     "AMC, since some deviation from the index is normal due to expenses and cash flows.",
     [AMFI, SEBI], 14, False),
    ("liquid-funds", "Liquid Funds",
     "Liquid funds are debt schemes that invest in money market and debt instruments with a "
     "residual maturity of up to 91 days, as defined under SEBI's categorization norms. This short "
     "maturity profile is designed to limit interest-rate sensitivity relative to longer-duration "
     "debt categories.\n\n"
     "SEBI requires liquid funds to hold a minimum of 20% of assets in instruments that can be "
     "readily converted to cash (such as government securities, T-bills, and repo), specifically to "
     "manage redemption requests during stressed market conditions.", [AMFI, SEBI], None, False),
    ("overnight-funds", "Overnight Funds",
     "Overnight funds invest exclusively in overnight securities — debt instruments with a maturity "
     "of one business day. This is the shortest-duration category defined under SEBI's debt fund "
     "classification, and is designed to carry minimal interest-rate and credit risk relative to "
     "other debt categories.\n\n"
     "Because every holding matures within a day, the scheme's portfolio is reconstituted daily, "
     "which is why overnight fund factsheets typically show very high portfolio turnover figures "
     "compared to other debt categories.", [AMFI, SEBI], None, False),
    ("ultra-short-duration-funds", "Ultra Short Duration Funds",
     "Ultra short duration funds invest in debt and money market instruments such that the "
     "Macaulay duration of the portfolio is between 3 and 6 months, as defined by SEBI. Macaulay "
     "duration is a measure of a bond portfolio's average sensitivity to interest-rate changes, not "
     "simply the average maturity of its holdings.\n\n"
     "Two ultra short duration schemes with similar average maturities can still have different "
     "interest-rate sensitivity if their underlying instruments have different cash-flow patterns, "
     "which is what duration — rather than maturity — is meant to capture.", [AMFI, SEBI], None, False),
    ("short-duration-funds", "Short Duration Funds",
     "Short duration funds invest in debt and money market instruments such that the portfolio's "
     "Macaulay duration is between 1 and 3 years, per SEBI's debt fund categorization. This places "
     "them further along the maturity spectrum than liquid, overnight, or ultra short duration "
     "schemes.\n\n"
     "A longer portfolio duration generally means the scheme's NAV is more sensitive to changes in "
     "prevailing interest rates than shorter-duration debt categories — this sensitivity is a "
     "structural feature of the category, not specific to any one scheme.", [AMFI, SEBI], None, False),
    ("corporate-bond-funds", "Corporate Bond Funds",
     "Corporate bond funds must invest a minimum of 80% of total assets in corporate bonds that "
     "carry the highest credit rating, AA+ and above, as defined under SEBI's categorization norms. "
     "This high-credit-quality mandate is a defining, regulator-enforced feature of the category.\n\n"
     "Because the minimum credit-quality bar is fixed by SEBI for the whole category, the SID and "
     "monthly factsheet remain the primary places to check a specific scheme's actual rating "
     "distribution and issuer concentration at any point in time.", [AMFI, SEBI], None, False),
    ("banking-and-psu-funds", "Banking & PSU Funds",
     "Banking and PSU funds must invest at least 80% of total assets in debt instruments issued by "
     "banks, Public Sector Undertakings (PSUs), and Public Financial Institutions (PFIs), as "
     "defined under SEBI's debt categorization framework. This gives the category a distinct "
     "issuer-concentration profile compared to general corporate bond funds.\n\n"
     "Because the category is defined by issuer type rather than by a fixed duration band, the "
     "interest-rate sensitivity of a given Banking & PSU scheme can vary — the scheme's factsheet "
     "discloses its actual average maturity and duration.", [AMFI, SEBI], None, False),
    ("aggressive-hybrid-funds", "Aggressive Hybrid Funds",
     "Aggressive hybrid funds must invest 65–80% of assets in equity and equity-related "
     "instruments, with the remainder in debt instruments, under SEBI's hybrid fund categorization. "
     "This fixed equity-debt band is what distinguishes the category from balanced advantage funds, "
     "where the equity-debt mix can swing more freely.\n\n"
     "Because the equity allocation band is fixed by category definition rather than left fully to "
     "the fund manager's market view, an aggressive hybrid scheme's risk profile stays structurally "
     "closer to a pure equity fund than a balanced advantage scheme's typically does.",
     [AMFI, SEBI], None, False),
    ("balanced-advantage-funds", "Balanced Advantage / Dynamic Asset Allocation Funds",
     "Balanced advantage (or dynamic asset allocation) funds can move their equity-debt mix across "
     "the full 0–100% range based on a pre-disclosed, model-driven or fund-manager-driven asset "
     "allocation strategy, as permitted under SEBI's hybrid categorization. The exact "
     "model/triggers used must be disclosed in the SID.\n\n"
     "Because the allocation strategy itself is scheme-specific, two balanced advantage schemes can "
     "hold very different equity levels at the same point in time depending on what each scheme's "
     "disclosed model signals.", [AMFI, SEBI], None, False),
    ("multi-asset-allocation-funds", "Multi Asset Allocation Funds",
     "Multi asset allocation funds must invest in at least three asset classes — typically equity, "
     "debt, and a third asset class such as gold or other commodities — with a minimum allocation "
     "of at least 10% to each, as defined under SEBI's hybrid fund categorization.\n\n"
     "The minimum-three-asset-class requirement is what separates this category from aggressive "
     "hybrid or balanced advantage funds, which are restricted to a mix of equity and debt only.",
     [AMFI, SEBI], None, False),
    ("retirement-funds", "Retirement Funds",
     "Retirement funds are solution-oriented schemes under SEBI's categorization framework, carrying "
     "a mandatory minimum lock-in of 5 years or until the investor reaches retirement age (whichever "
     "is earlier). A fund house is permitted to offer only one retirement fund scheme.\n\n"
     "The lock-in is a SEBI-mandated structural feature of the solution-oriented category as a "
     "whole, intended to align the product with a long investment horizon — it applies regardless "
     "of the scheme's particular equity-debt mix.", [AMFI, SEBI], None, False),
    ("childrens-funds", "Children's Funds",
     "Children's funds are solution-oriented schemes with a mandatory minimum lock-in of 5 years or "
     "until the child-beneficiary reaches the age of majority (whichever is earlier), as defined "
     "under SEBI's categorization norms. As with retirement funds, a fund house may offer only one "
     "children's fund scheme.\n\n"
     "The lock-in period and minor-beneficiary structure are what legally distinguish this category "
     "from a regular equity or hybrid scheme that an investor might otherwise choose for a "
     "child-related goal.", [AMFI, SEBI], None, False),
]

KEY_CONCEPT_ARTICLES = [
    ("what-is-nav", "What is NAV (Net Asset Value)?",
     "Net Asset Value (NAV) is the per-unit value of a mutual fund scheme, calculated by dividing "
     "the total market value of all the scheme's holdings (minus liabilities) by the number of "
     "outstanding units. AMFI publishes NAVs for all schemes daily after market close.\n\n"
     "NAV reflects the value of the underlying portfolio, not a price set by demand and supply the "
     "way a stock price is — a higher or lower NAV by itself says nothing about whether a scheme has "
     "performed well; it depends entirely on the percentage change in NAV over a given period.",
     [AMFI, MFSH], None, False),
    ("what-is-sip", "What is a SIP (Systematic Investment Plan)?",
     "A Systematic Investment Plan (SIP) is a facility that lets an investor invest a fixed amount "
     "in a mutual fund scheme at regular intervals — typically monthly — instead of investing a "
     "lump sum at once. Each instalment buys units at that day's applicable NAV.\n\n"
     "Because each instalment is invested at a different NAV, a SIP results in units being "
     "purchased at varying price points over time; this is a mechanical effect of periodic "
     "investing, not a guarantee of any particular outcome.", [AMFI, MFSH], None, False),
    ("swp-and-stp-explained", "SWP and STP Explained",
     "A Systematic Withdrawal Plan (SWP) lets an investor redeem a fixed amount or fixed number of "
     "units from a scheme at regular intervals, the reverse mechanism of a SIP. A Systematic "
     "Transfer Plan (STP) moves a fixed amount at regular intervals from one scheme to another "
     "within the same fund house — commonly from a debt scheme into an equity scheme.\n\n"
     "Both SWP and STP transactions are treated as redemptions (from the source scheme) for tax "
     "purposes, and are subject to the same capital gains and exit-load rules as any other "
     "redemption.", [AMFI, SEBI], None, False),
    ("direct-vs-regular-plans", "Direct vs Regular Plans",
     "Every mutual fund scheme is offered in two plan variants: a Direct Plan, purchased straight "
     "from the AMC without an intermediary, and a Regular Plan, purchased through a distributor who "
     "earns a trail commission embedded in the plan's expense ratio. Both plans invest in the same "
     "underlying portfolio.\n\n"
     "Because the Regular Plan's expense ratio includes distributor commission while the Direct "
     "Plan's does not, the two plans of the same scheme report different (separately published) "
     "NAVs over time, even though the portfolio they hold is identical.", [AMFI, SEBI], None, False),
    ("what-is-aum", "What is AUM (Assets Under Management)?",
     "Assets Under Management (AUM) is the total market value of all the investments a mutual fund "
     "scheme — or an entire fund house — currently manages on behalf of its investors. AMFI "
     "publishes industry-wide and scheme-wise AUM data on a periodic basis.\n\n"
     "AUM changes for two separate reasons: net inflows or outflows of investor money, and "
     "appreciation or depreciation in the market value of the scheme's existing holdings — a rising "
     "AUM does not by itself indicate which of these two factors is driving the change.",
     [AMFI], None, False),
    ("understanding-the-riskometer", "Understanding the Riskometer",
     "The Riskometer is a SEBI-mandated, standardised graphic disclosure that every mutual fund "
     "scheme must display, indicating its risk level on a six-point scale from \"Low\" to \"Very "
     "High.\" It is computed using a prescribed methodology based on the scheme's underlying "
     "portfolio (factors such as market-cap mix, credit quality, and volatility).\n\n"
     "The Riskometer is recalculated and disclosed on a monthly basis, since the underlying "
     "portfolio composition — and therefore the computed risk level — can change over time even if "
     "the scheme's stated category and objective do not.", [SEBI, AMFI], None, False),
]

FEE_EDUCATION_ARTICLES = [
    ("what-is-ter", "What is TER (Total Expense Ratio)?",
     "## What TER Includes\n\n"
     "The Total Expense Ratio (TER) is the annual cost of running a mutual fund scheme, expressed "
     "as a percentage of the scheme's average net assets. It includes the fund management fee and "
     "other permitted recurring expenses, and is deducted from the scheme's NAV on a daily basis "
     "rather than billed separately to the investor.\n\n"
     "> **TER** is not a fee you pay upfront or out of pocket — it is built into the scheme's "
     "published NAV every single day, so you never see a separate bill for it.\n\n"
     "## How It's Applied\n\n"
     "SEBI has mandated graded upper limits on TER that fall as a scheme's AUM grows, and the "
     "Direct Plan TER of a scheme is always lower than its Regular Plan TER because Regular Plan "
     "TER additionally includes distributor commission.\n\n"
     "## Worked Example\n\n"
     "```\nWorked example — Parag Parikh Flexi Cap Fund\nIf the scheme's Direct Plan TER is 0.70% "
     "per year and your investment is worth Rs 1,00,000 on a given day, roughly Rs 700 of annual "
     "expense is reflected across that year inside the scheme's NAV — not deducted as a separate "
     "transaction from your bank account or folio.\n```",
     [SEBI, AMFI], None, True),
    ("what-is-exit-load", "What is Exit Load?",
     "## How Exit Load Works\n\n"
     "An exit load is a fee a scheme may charge an investor for redeeming units before a specified "
     "holding period, expressed as a percentage of the redemption value. It is disclosed in the "
     "scheme's SID and KIM, and — where applicable — is deducted directly from the redemption "
     "proceeds, not billed separately.\n\n"
     "> **Exit load** only applies to the units you redeem, and only if you redeem before the "
     "scheme's specified holding period — it is never charged on units you continue to hold.\n\n"
     "## Exit Load Tiers\n\n"
     "Exit load structures vary by scheme and can include multiple tiers (for example, a higher "
     "load for redemptions within the first year, tapering to nil after a longer holding period); "
     "the specific structure and the period after which no exit load applies must always be checked "
     "in that scheme's current SID/KIM rather than assumed.\n\n"
     "## Worked Example\n\n"
     "```\nWorked example — Parag Parikh Flexi Cap Fund\nThis scheme's SID specifies a 2% exit load "
     "for redemption within 365 days, 1% for redemption between 366-730 days, and nil after 730 "
     "days. Redeeming units worth Rs 50,000 after 200 days would attract a 2% exit load of Rs 1,000, "
     "so you would receive Rs 49,000.\n```",
     [SEBI, AMFI], None, True),
    ("stamp-duty-on-mutual-funds", "Stamp Duty on Mutual Fund Transactions",
     "Since July 2020, a stamp duty of 0.005% of the transaction value is levied on the purchase of "
     "mutual fund units (including each SIP instalment and any switch-in), under amendments to the "
     "Indian Stamp Act. It is deducted at the time of unit allotment, before the investment amount "
     "is converted into units.\n\n"
     "Stamp duty applies only on purchase-side transactions (including switch-ins) — it is not "
     "levied on redemptions, switch-outs, or dividend/IDCW payouts.", [SEBI, AMFI], None, False),
    ("what-is-stt", "What is STT (Securities Transaction Tax)?",
     "Securities Transaction Tax (STT) is a tax levied on the sale of equity-oriented mutual fund "
     "units (and equity shares) at the time of redemption, collected by the AMC and deposited with "
     "the government. It does not apply to debt-oriented scheme redemptions.\n\n"
     "STT is charged on the redemption (sell) leg of equity-oriented schemes only, and is separate "
     "from — and in addition to — any exit load and any capital gains tax that may also apply to "
     "the same redemption.", [SEBI, AMFI], None, False),
    ("the-cost-of-using-a-distributor", "The Cost of Using a Distributor (Regular vs Direct)",
     "When an investor buys a Regular Plan through a mutual fund distributor, the distributor earns "
     "a trail commission paid by the AMC out of the scheme's expenses — which is why a Regular "
     "Plan's TER, and therefore its published NAV growth over time, differs from the Direct Plan of "
     "the same scheme.\n\n"
     "Because trail commission compounds as a recurring annual charge on the invested corpus rather "
     "than a one-time fee, its cumulative effect on the difference between Direct and Regular Plan "
     "NAVs grows larger the longer the units are held — the exact gap for any scheme is visible by "
     "comparing its published Direct and Regular Plan NAV history.", [SEBI, AMFI], None, False),
]

INVESTOR_PROCESS_ARTICLES = [
    ("how-to-start-a-sip", "How to Start a SIP",
     "To start a SIP, an investor must first complete KYC (Know Your Customer) verification, then "
     "register the SIP either directly with the AMC (online portal or app) or through a registered "
     "distributor/RTA, specifying the scheme, plan (Direct/Regular), amount, frequency, and start "
     "date. The SIP is processed via a standing instruction (e-mandate, NACH, or auto-debit) on the "
     "investor's bank account.\n\n"
     "Setting up the e-mandate/auto-debit authorization with the investor's bank is a distinct step "
     "from registering the SIP itself, and the first instalment may be delayed if this mandate is "
     "not confirmed by the bank in time.", [AMFI, MFSH], None, False),
    ("how-to-redeem-mutual-fund-units", "How to Redeem Mutual Fund Units",
     "To redeem units, an investor submits a redemption request specifying the scheme and either "
     "the number of units or the amount to be redeemed, through the AMC's online portal/app, the "
     "distributor/RTA platform, or a physical form. The redemption is processed at the NAV "
     "applicable on the day the request is received, subject to the scheme's official cut-off time.\n\n"
     "Redemption proceeds are credited only to the bank account already registered and verified "
     "against the investor's folio — a different, unregistered bank account cannot be used for a "
     "single redemption without first updating the registered bank details on the folio.",
     [AMFI, MFSH], None, False),
    ("how-to-get-your-capital-gains-statement", "How to Get Your Capital Gains Statement",
     "A Capital Gains Statement (CGS) — summarising the gains or losses from all units redeemed "
     "during a financial year, scheme-wise — can be downloaded directly from the AMC's website, "
     "from the RTA's investor portal (CAMS or KFintech), or via AMFI's centralised statement "
     "services, after verifying the investor's PAN and registered folio details.\n\n"
     "If an investor holds folios across multiple fund houses, a single consolidated capital gains "
     "statement covering all of them is typically only available through the RTA portals (CAMS/"
     "KFintech) or AMFI's centralised facility, not from any single AMC's own website.",
     [AMFI], None, False),
    ("how-to-update-kyc", "How to Update Your KYC",
     "KYC (Know Your Customer) details — such as address, mobile number, email, or bank account — "
     "can be updated through a KYC Registration Agency (KRA) portal, the AMC/RTA investor portal, "
     "or by submitting a KYC modification form along with supporting documents at an AMC or "
     "distributor's office.\n\n"
     "Because KYC records are maintained centrally by KRAs and shared across all SEBI-registered "
     "intermediaries, a single KYC update is generally reflected across all of an investor's "
     "mutual fund folios rather than needing to be repeated separately with each AMC.", [SEBI, AMFI], None, False),
    ("how-to-file-a-complaint-on-sebi-scores", "How to File a Complaint via SEBI SCORES",
     "SCORES (SEBI Complaints Redress System) is SEBI's official online portal for investors to "
     "lodge complaints against SEBI-registered intermediaries, including AMCs, distributors, and "
     "RTAs. An investor registers on the portal, files the complaint with supporting details, and "
     "can track its status until resolution.\n\n"
     "SEBI's published process requires the investor to first raise the grievance directly with the "
     "concerned AMC or intermediary; SCORES is meant to be used as the escalation channel if that "
     "complaint is not resolved satisfactorily within the AMC's own grievance-redressal "
     "timeline.", [SCORES, SEBI], None, False),
]

INVESTOR_RIGHTS_ARTICLES = [
    ("right-to-access-sid-and-kim", "Right to Access SID and KIM",
     "Every investor has the right to access a scheme's Scheme Information Document (SID) and Key "
     "Information Memorandum (KIM) — the legal documents disclosing the scheme's investment "
     "objective, risk factors, expenses, and terms — free of charge from the AMC's website at any "
     "time, not only at the time of investment.\n\n"
     "SEBI requires every SID and KIM to be reviewed and updated periodically, so the version an "
     "investor should rely on for current information is always the latest one published on the "
     "AMC's website, not the version that may have been provided at the original time of "
     "investment.", [SEBI, AMFI], None, False),
    ("right-to-account-statements", "Right to Account Statements (CAS)",
     "Investors are entitled to receive a Consolidated Account Statement (CAS) — a single statement "
     "covering holdings across all mutual fund folios linked to the same PAN, across all AMCs — "
     "sent by the RTAs on a monthly basis (or quarterly if the investor's only activity in that "
     "period was via SIP) at no cost.\n\n"
     "If an investor has transacted in any folio in a given month, the CAS for that month covers "
     "every one of that investor's folios across all fund houses, not just the folio where the "
     "transaction occurred.", [SEBI, AMFI], None, False),
    ("right-to-nominate", "Right to Nominate",
     "Every individual mutual fund investor has the right to nominate one or more persons to "
     "receive the units in their folio in the event of the investor's death, by submitting a "
     "nomination form (or opting out in writing) to the AMC or RTA. Nomination can name multiple "
     "nominees with a specified percentage allocation to each.\n\n"
     "SEBI requires investors who choose not to nominate to explicitly record that choice in "
     "writing — leaving the nomination section simply blank is not treated as a valid opt-out under "
     "the regulator's framework.", [SEBI, AMFI], None, False),
    ("right-to-grievance-redressal", "Right to Grievance Redressal",
     "Every mutual fund investor has the right to a timely, fair resolution of any complaint against "
     "an AMC, distributor, or RTA, first through that entity's own investor grievance mechanism, "
     "and — if unresolved — through escalation to SEBI's SCORES portal. AMFI also operates a "
     "subsidiary process for industry-level grievance escalation in certain cases.\n\n"
     "SEBI requires registered intermediaries to resolve investor complaints within prescribed "
     "timelines published in SEBI's grievance-redressal circulars; SCORES tracks whether that "
     "timeline has been met and allows escalation when it has not.", [SCORES, SEBI], None, False),
]

SECTIONS = [
    ("fund_categories", FUND_CATEGORY_ARTICLES),
    ("key_concepts", KEY_CONCEPT_ARTICLES),
    ("fee_education", FEE_EDUCATION_ARTICLES),
    ("investor_processes", INVESTOR_PROCESS_ARTICLES),
    ("investor_rights", INVESTOR_RIGHTS_ARTICLES),
]


async def seed() -> int:
    total = 0
    async with async_session_maker() as db:
        for category, articles in SECTIONS:
            for order, (slug, title, body, citations, scheme_example_id, most_misunderstood) in enumerate(
                articles, start=1
            ):
                existing = (
                    await db.execute(select(EducationArticle).where(EducationArticle.slug == slug))
                ).scalar_one_or_none()

                if existing:
                    existing.title = title
                    existing.category = category
                    existing.section_order = order
                    existing.body_markdown = body
                    existing.source_citations_json = citations
                    existing.last_reviewed_date = TODAY
                    existing.scheme_example_id = scheme_example_id
                    existing.most_misunderstood = most_misunderstood
                    existing.is_published = True
                else:
                    db.add(
                        EducationArticle(
                            slug=slug,
                            title=title,
                            category=category,
                            section_order=order,
                            body_markdown=body,
                            source_citations_json=citations,
                            last_reviewed_date=TODAY,
                            version=1,
                            scheme_example_id=scheme_example_id,
                            most_misunderstood=most_misunderstood,
                            is_published=True,
                        )
                    )
                total += 1
        await db.commit()
    return total


if __name__ == "__main__":
    count = asyncio.run(seed())
    print(f"Seeded/updated {count} education articles.")
