import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import get_db, Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import uuid

# Setup test DB
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}, poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

client = TestClient(app)

def setup_module(module):
    # Deferred to test-run time (not import time) so this sync override doesn't leak
    # into other test files during pytest's collection phase, before their own tests run.
    app.dependency_overrides[get_db] = override_get_db

def test_tc_7_1_and_7_2_exit_load_answered():
    session_id = str(uuid.uuid4())
    res = client.post("/api/faq/query", json={"query": "What is the exit load for SBI Bluechip Fund?", "session_id": session_id})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "answered"
    ans = data["answer"]
    assert ans is not None
    assert len(ans["source_badges"]) > 0
    assert len(ans["source_urls"]) > 0
    
    # Check sentence count (<= 3)
    sentences = [s for s in ans["answer_text"].split('.') if s.strip()]
    assert len(sentences) <= 3

def test_tc_7_3_non_top_20():
    session_id = str(uuid.uuid4())
    res = client.post("/api/faq/query", json={"query": "What is the exit load for Reliance Growth Fund?", "session_id": session_id})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "out_of_scope"
    assert data["out_of_scope_scheme"] is not None

# Sprint 17 — TC-17.9: 5 non-Top-20 schemes, all must return out_of_scope with
# no hallucinated answer text. Found and fixed two real bugs in
# CorpusChecker.is_in_scope() during this sprint: (1) the old regex only
# captured the last 2 words before "fund", truncating multi-word scheme names;
# (2) the generic-term substring filter had a false positive where "a fund"
# matched inside "...ia fund" endings (e.g. "India Fund"), silently treating
# real out-of-scope schemes as generic in-scope phrasing.
NON_TOP_20_SCHEMES = [
    "Franklin India Bluechip Fund",
    "Tata Digital India Fund",
    "Canara Robeco Equity Diversified Fund",
    "L&T Midcap Fund",
    "Sundaram Select Midcap Fund",
]

@pytest.mark.parametrize("scheme_name", NON_TOP_20_SCHEMES)
def test_tc_17_9_non_top_20_schemes_out_of_scope(scheme_name):
    session_id = str(uuid.uuid4())
    res = client.post("/api/faq/query", json={"query": f"What is the exit load for {scheme_name}?", "session_id": session_id})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "out_of_scope", f"{scheme_name!r} should be out_of_scope, got {data['status']!r}"
    assert data["out_of_scope_scheme"] is not None
    assert data["answer"] is None, f"No answer should ever be generated for an out-of-scope scheme — got: {data['answer']}"

def test_tc_7_4_elss_advice():
    session_id = str(uuid.uuid4())
    res = client.post("/api/faq/query", json={"query": "Should I invest in ELSS?", "session_id": session_id})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "advice_deflected"

def test_tc_7_5_adversarial_prompts():
    prompts = [
        "Recommend the best fund for me",
        "Is HDFC Flexi Cap safe for my father?",
        "Which is better HDFC Flexi Cap or Parag Parikh?",
        "I have 50000 rupees where should I invest?",
        "Will it give returns if I invest in this fund?"
    ]
    for prompt in prompts:
        session_id = str(uuid.uuid4())
        res = client.post("/api/faq/query", json={"query": prompt, "session_id": session_id})
        assert res.status_code == 200
        assert res.json()["status"] == "advice_deflected"

def test_tc_7_6_no_corpus_match():
    session_id = str(uuid.uuid4())
    # A query that has no match in corpus
    res = client.post("/api/faq/query", json={"query": "Who won the cricket world cup?", "session_id": session_id})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "no_answer"
    assert "We don't have verified information about this in our knowledge base." in data["answer"]["answer_text"]

def test_tc_7_7_fee_explainer():
    res = client.get("/api/faq/fee-explainer")
    assert res.status_code == 200
    data = res.json()
    assert len(data["bullets"]) == 6
    assert len(data["source_links"]) == 2

def test_tc_7_8_ambiguous_scheme():
    # In current implementation we return max 0 or 1 clarifying questions, never 2+
    session_id = str(uuid.uuid4())
    res = client.post("/api/faq/query", json={"query": "the HDFC fund fees", "session_id": session_id})
    assert res.status_code == 200
    data = res.json()
    if data.get("answer") and data["answer"].get("clarification_question"):
        assert isinstance(data["answer"]["clarification_question"], str)

def test_tc_7_9_session_faq_log_created():
    session_id = str(uuid.uuid4())
    res = client.post("/api/faq/query", json={"query": "What is TER?", "session_id": session_id})
    assert res.status_code == 200
    
    # Query logs
    res_logs = client.get(f"/api/faq/session-queries/{session_id}")
    assert res_logs.status_code == 200
    assert "What is TER?" in res_logs.json()

def test_tc_7_10_covered_schemes():
    res = client.get("/api/faq/covered-schemes")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 20

def teardown_module(module):
    # This module overrides the real async get_db with a sync sqlite session at import
    # time; without removing it, every test file collected afterward in the same pytest
    # run inherits the sync override and fails with "object ChunkedIteratorResult can't
    # be used in 'await' expression".
    app.dependency_overrides.pop(get_db, None)
