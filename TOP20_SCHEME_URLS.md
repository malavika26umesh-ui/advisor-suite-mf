# Top 20 Schemes — URL Collection Sheet

Paste the URLs you have for each scheme below. You don't need all 3 columns filled for every scheme — even one good "scheme details" page per scheme is useful; I'll extract whatever factual data (expense ratio, exit load, lock-in, NAV, benchmark, riskometer, fund manager) is on it and note in the manifest if the full SID/KIM wasn't sourced.

If a URL points straight at a downloadable `.pdf` file rather than a webpage, flag it — I may need you to save it locally and hand it to me a different way (I'll let you know which ones, if any).

| # | Scheme Name | AMC | Category | SID / Scheme Details URL | KIM URL | Factsheet URL |
|---|---|---|---|---|---|---|
| 1 | Parag Parikh Flexi Cap Fund | PPFAS Mutual Fund | Flexi Cap | | | |
| 2 | SBI Bluechip Fund | SBI Mutual Fund | Large Cap | | | |
| 3 | ICICI Prudential Bluechip Fund | ICICI Prudential | Large Cap | | | |
| 4 | HDFC Flexi Cap Fund | HDFC Mutual Fund | Flexi Cap | | | |
| 5 | ICICI Prudential Value Discovery Fund | ICICI Prudential | Value / Flexi Cap | | | |
| 6 | Nippon India Large Cap Fund | Nippon India | Large Cap | | | |
| 7 | Nippon India Small Cap Fund | Nippon India | Small Cap | | | |
| 8 | SBI Small Cap Fund | SBI Mutual Fund | Small Cap | | | |
| 9 | HDFC Mid-Cap Opportunities Fund | HDFC Mutual Fund | Mid Cap | | | |
| 10 | Kotak Emerging Equity Fund | Kotak Mahindra | Mid Cap | | | |
| 11 | Axis Bluechip Fund | Axis Mutual Fund | Large Cap | | | |
| 12 | Mirae Asset Large Cap Fund | Mirae Asset | Large Cap | | | |
| 13 | Aditya Birla Sun Life Flexi Cap Fund | Aditya Birla Sun Life | Flexi Cap | | | |
| 14 | UTI Nifty 50 Index Fund | UTI Mutual Fund | Index Fund | | | |
| 15 | HDFC Nifty 50 Index Fund | HDFC Mutual Fund | Index Fund | | | |
| 16 | Axis Long Term Equity Fund | Axis Mutual Fund | ELSS | | | |
| 17 | Mirae Asset Tax Saver Fund | Mirae Asset | ELSS | | | |
| 18 | DSP Flexi Cap Fund | DSP Mutual Fund | Flexi Cap | | | |
| 19 | Quant Small Cap Fund | Quant Mutual Fund | Small Cap | | | |
| 20 | Motilal Oswal Midcap Fund | Motilal Oswal | Mid Cap | | | |

## What I'll do once you've pasted URLs

For each scheme with at least one URL: fetch the page, extract the facts that exist in our schema (expense ratio/TER, exit load structure, lock-in period, benchmark index, riskometer category, fund manager, AUM, NAV if shown), record the exact URL + today's date as `source_url` / `last_verified` in `source_manifest.json`, and flag anything that's a `.pdf` link instead of a webpage so we handle it separately.

If a scheme ends up with zero usable URLs, I'll mark it `PENDING` in the manifest rather than guessing or leaving stale placeholder data in place.
