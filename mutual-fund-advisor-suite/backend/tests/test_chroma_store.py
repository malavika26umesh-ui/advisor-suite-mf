import shutil
import tempfile
import pytest
from app.services.rag.chroma_store import SchemeLiveDataStore


@pytest.fixture
def store():
    tmp_dir = tempfile.mkdtemp()
    s = SchemeLiveDataStore(persist_path=tmp_dir)
    yield s
    shutil.rmtree(tmp_dir, ignore_errors=True)


def test_upsert_and_query_by_scheme(store):
    store.upsert_parameter(
        scheme_id=1,
        scheme_name="Parag Parikh Flexi Cap Fund",
        parameter="exit_load",
        text="Exit load for Parag Parikh Flexi Cap Fund: 1% if redeemed within 365 days.",
        source_url="https://example.com/ppfas",
        fetched_at="2026-06-21T10:00:00Z",
    )

    result = store.query("exit load", scheme_name="Parag Parikh Flexi Cap Fund", top_k=5)

    assert len(result["documents"][0]) == 1
    assert "Exit load" in result["documents"][0][0]
    assert result["metadatas"][0][0]["scheme_name"] == "Parag Parikh Flexi Cap Fund"
    assert result["metadatas"][0][0]["parameter"] == "exit_load"
    assert result["metadatas"][0][0]["source_url"] == "https://example.com/ppfas"


def test_upsert_overwrites_same_id(store):
    store.upsert_parameter(1, "Scheme A", "nav", "old nav text", "https://a.com", "2026-06-20T10:00:00Z")
    store.upsert_parameter(1, "Scheme A", "nav", "new nav text", "https://a.com", "2026-06-21T10:00:00Z")

    assert store.count() == 1
    result = store.query("nav", scheme_name="Scheme A", top_k=5)
    assert result["documents"][0][0] == "new nav text"


def test_query_no_results_for_unknown_scheme(store):
    result = store.query("anything", scheme_name="Nonexistent Fund", top_k=5)
    assert result["documents"][0] == []
