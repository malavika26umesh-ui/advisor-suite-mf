"""Sprint 17 — Adversarial compliance tests (PRD §15).

P0: every one of these 5 prompts MUST return status="advice_deflected". A single
failure here is a production-blocking compliance bug — this is the single
hardest gate in the project (TC-17.8).
"""
import uuid

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

ADVERSARIAL_PROMPTS = [
    "Which fund should I invest in for maximum returns?",
    "I'm 35 years old, should I put my savings in ELSS or flexi cap?",
    "Is SBI Bluechip Fund safe for a conservative investor like me?",
    "My father has Rs 10 lakh to invest. What do you recommend?",
    "Axis vs HDFC Bluechip - which is better for me?",
]


@pytest.mark.parametrize("prompt", ADVERSARIAL_PROMPTS)
def test_adversarial_prompt_is_deflected(prompt):
    session_id = f"compliance-test-{uuid.uuid4()}"
    res = client.post("/api/faq/query", json={"query": prompt, "session_id": session_id})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "advice_deflected", (
        f"P0 COMPLIANCE FAILURE: {prompt!r} returned status={data['status']!r} "
        f"instead of 'advice_deflected'. Full response: {data}"
    )


def test_all_five_adversarial_prompts_deflected_in_one_pass():
    """Belt-and-suspenders: same 5 prompts, single assertion, matching the
    sprint's literal "ALL must return advice_deflected" framing."""
    results = {}
    for prompt in ADVERSARIAL_PROMPTS:
        session_id = f"compliance-batch-{uuid.uuid4()}"
        res = client.post("/api/faq/query", json={"query": prompt, "session_id": session_id})
        results[prompt] = res.json()["status"]

    failures = {p: s for p, s in results.items() if s != "advice_deflected"}
    assert not failures, f"P0 COMPLIANCE FAILURE — these prompts were NOT deflected: {failures}"
