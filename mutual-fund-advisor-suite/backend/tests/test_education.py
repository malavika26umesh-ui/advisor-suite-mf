import json
import sqlite3
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

BACKEND_ROOT = Path(__file__).resolve().parents[1]
DB_PATH = BACKEND_ROOT / "dev.db"
TOP20_PATH = BACKEND_ROOT / "corpus" / "sources" / "top20_schemes.json"

MIN_COUNTS = {
    "fund_categories": 19,
    "key_concepts": 6,
    "fee_education": 5,
    "investor_processes": 5,
    "investor_rights": 4,
}


def _all_articles():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute("SELECT * FROM education_articles")
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return rows


def test_tc_9_1_sections_endpoint():
    r = client.get("/api/education/sections")
    assert r.status_code == 200
    sections = r.json()
    assert len(sections) == 5
    for section in sections:
        assert section["article_count"] > 0


def test_tc_9_2_minimum_article_counts():
    articles = _all_articles()
    counts = {}
    for a in articles:
        counts[a["category"]] = counts.get(a["category"], 0) + 1
    for category, minimum in MIN_COUNTS.items():
        assert counts.get(category, 0) >= minimum, f"{category}: {counts.get(category, 0)} < {minimum}"


def test_tc_9_3_every_article_has_citation_with_url():
    for a in _all_articles():
        citations = json.loads(a["source_citations_json"])
        assert len(citations) >= 1, f"{a['slug']} has no citations"
        assert all(c.get("url") for c in citations), f"{a['slug']} has a citation with empty url"


def test_tc_9_4_every_article_has_last_reviewed_date():
    for a in _all_articles():
        assert a["last_reviewed_date"], f"{a['slug']} missing last_reviewed_date"


def test_tc_9_5_article_detail_endpoint():
    r = client.get("/api/education/articles/what-is-ter")
    assert r.status_code == 200
    data = r.json()
    assert data["body_markdown"]
    assert len(data["body_markdown"]) > 0
    assert data["most_misunderstood"] is True


def test_tc_9_6_search_returns_relevant_top_result():
    r = client.get("/api/education/search", params={"q": "exit load"})
    assert r.status_code == 200
    results = r.json()
    assert len(results) >= 1
    assert results[0]["slug"] == "what-is-exit-load"


def test_tc_9_7_scheme_example_id_references_valid_top20_scheme():
    with open(TOP20_PATH) as f:
        valid_ids = {s["id"] for s in json.load(f)["schemes"]}

    for a in _all_articles():
        if a["category"] == "fund_categories" and a["scheme_example_id"] is not None:
            assert a["scheme_example_id"] in valid_ids, f"{a['slug']} references unknown scheme id {a['scheme_example_id']}"
