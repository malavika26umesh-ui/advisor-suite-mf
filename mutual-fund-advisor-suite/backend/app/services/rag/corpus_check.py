import os
import json
import re
from typing import Tuple, Optional

class CorpusChecker:
    def __init__(self):
        file_path = os.path.join(os.path.dirname(__file__), '../../../corpus/sources/top20_schemes.json')
        with open(file_path, 'r') as f:
            data = json.load(f)
            self.schemes = data.get("schemes", [])

    def is_in_scope(self, query: str) -> Tuple[bool, Optional[str]]:
        query_lower = query.lower()
        
        # Check if an in-scope scheme is mentioned
        for scheme in self.schemes:
            if scheme['name'].lower() in query_lower:
                return True, None
            for alias in scheme.get('aliases', []):
                if alias.lower() in query_lower:
                    return True, None

        # Check for a generic (non-Top-20) scheme name by looking for a run of
        # Title-Case words ending in "Fund"/"Scheme" in the ORIGINAL (not
        # lowercased) query. This both (a) captures the full scheme name instead
        # of just the last two words before "fund" — the previous regex truncated
        # "Franklin India Bluechip Fund" down to "India Bluechip Fund" — and
        # (b) avoids a real false-positive the old substring-based generic-term
        # filter had: "a fund" matches as a literal substring of "...ia fund"
        # (e.g. "India Fund"), which silently misclassified schemes like "Tata
        # Digital India Fund" as a generic phrase and let them through as
        # in-scope. Genuinely generic phrasing ("the fund", "my fund", "a fund")
        # is lowercase and simply won't match a Title-Case pattern, so no
        # explicit generic-term denylist is needed at all.
        match = re.search(r'((?:[A-Z][a-zA-Z&]*\s+){1,5}(?:Fund|Scheme))\b', query)
        if match:
            extracted = match.group(1).strip()
            return False, extracted

        return True, None
