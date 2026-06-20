import re
from typing import Tuple

class PIIGuard:
    PII_PATTERNS = {
        "PAN": r'\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b',
        "Aadhaar": r'\b\d{12}\b',
        "Folio": r'folio\s*(number|no\.?|#)?\s*\d+',
        "Account": r'account\s*(number|no\.?|#)?\s*[\d-]+',
        "Generic Account": r'\b\d{9,18}\b'
    }

    def detect_pii(self, text: str) -> Tuple[bool, str | None]:
        for pii_type, pattern in self.PII_PATTERNS.items():
            if re.search(pattern, text, re.IGNORECASE):
                return True, pii_type
        return False, None

    def get_deflection_message(self) -> str:
        return "For security, please don't share account or identity details here. Your advisor will have a secure channel for that during your call."
