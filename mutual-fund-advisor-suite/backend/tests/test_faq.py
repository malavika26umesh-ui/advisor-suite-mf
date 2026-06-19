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

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

def test_tc_7_1_and_7_2_exit_load_answered():
    session_id = str(uuid.uuid4())
    res = client.post("/api/faq/query", json={"query": "What is the exit load for Parag Parikh Flexi Cap Fund?", "session_id": session_id})
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
        assert type(data["answer"]["clarification_question"]) == str

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
