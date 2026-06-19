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

        # Check for generic out of scope scheme names.
        # specifically if it says "fund" but we didn't match an in-scope scheme.
        match = re.search(r'([a-z]+\s+[a-z]+\s+(?:fund|scheme))', query_lower)
        if match:
            extracted = match.group(1).strip()
            generic_terms = [
                "mutual fund", "flexi cap fund", "index fund", "elss fund", 
                "liquid fund", "debt fund", "equity fund", "the fund", "a fund", 
                "this fund", "that fund", "best fund", "good fund", "any fund", 
                "which fund", "my fund"
            ]
            
            is_generic = False
            for term in generic_terms:
                if term in extracted:
                    is_generic = True
                    break
                    
            if not is_generic:
                return False, extracted.title()
                
        return True, None
