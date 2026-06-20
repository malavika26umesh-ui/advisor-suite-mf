import re

ADVICE_PHRASE_SIGNALS = [
    "should i", "is it good", "recommend", "best for me",
    "what should i do", "will it give returns", "is this safe for me",
    "is this good", "which is better for me", "what do you suggest",
    "safe for",  # catches "safe for a conservative investor like me" and similar
    # suitability phrasing the exact-phrase list above doesn't cover verbatim
]

PERSONAL_SITUATION_PATTERNS = [
    r"i have ₹[\d,]+",
    r"i'm \d+ years old",
    r"i am \d+ years old",
    r"saving for (retirement|house|education|marriage|car)",
    r"my (father|mother|husband|wife|parents|brother|sister|child|son|daughter)",
    r"my portfolio",
    r"my sip",
    r"my investment"
]

COMPARISON_WITH_INTENT_PATTERNS = [
    r"(hdfc|sbi|icici|axis|mirae|nippon|kotak|parag parikh|uti|dsp|quant|motilal).+vs.+(hdfc|sbi|icici|axis|mirae|nippon|kotak|parag parikh|uti|dsp|quant|motilal)",
    r"which (is|one is|fund is) (better|best|good|safer|safer)",
    # "Is X better than Y" — same comparison intent as "X vs Y", different word
    # order. Sprint 17 found this phrasing wasn't caught (TC-17 triage accuracy
    # check), falling through to the LLM, which never classifies as
    # advice_seeking by design — so a genuine fund-comparison question silently
    # got answered as "educational" instead of deflected.
    r"(is|are) .+ (better|safer|best) than"
]

def check_hard_coded_signals(query: str) -> bool:
    query_lower = query.lower()
    
    # Check exact phrases
    for phrase in ADVICE_PHRASE_SIGNALS:
        if phrase in query_lower:
            return True
            
    # Check personal situation patterns
    for pattern in PERSONAL_SITUATION_PATTERNS:
        if re.search(pattern, query_lower):
            return True
            
    # Check comparison with intent patterns
    for pattern in COMPARISON_WITH_INTENT_PATTERNS:
        if re.search(pattern, query_lower):
            return True
            
    return False
