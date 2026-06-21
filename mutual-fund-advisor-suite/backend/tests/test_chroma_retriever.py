import shutil
import tempfile
import pytest
from app.services.rag.chroma_retriever import ChromaRetriever
from app.services.rag.retriever import RetrievedChunk


@pytest.fixture
def retriever():
    tmp_dir = tempfile.mkdtemp()
    r = ChromaRetriever(persist_path=tmp_dir)
    yield r
    shutil.rmtree(tmp_dir, ignore_errors=True)


def test_retrieve_with_scheme_filter_returns_seeded_chunk(retriever):
    retriever.store.upsert_parameter(
        scheme_id=1,
        scheme_name="Parag Parikh Flexi Cap Fund",
        parameter="exit_load",
        text="Exit load for Parag Parikh Flexi Cap Fund: 1% if redeemed within 365 days.",
        source_url="https://example.com/ppfas",
        fetched_at="2026-06-21T10:00:00Z",
    )

    chunks = retriever.retrieve_with_scheme_filter("exit load", "Parag Parikh Flexi Cap Fund", top_k=5)

    assert len(chunks) == 1
    assert isinstance(chunks[0], RetrievedChunk)
    assert chunks[0].scheme_name == "Parag Parikh Flexi Cap Fund"
    assert chunks[0].doc_type == "Live Scheme Data"
    assert chunks[0].source_url == "https://example.com/ppfas"
    assert chunks[0].page_number is None


def test_retrieve_with_scheme_filter_returns_empty_when_no_match(retriever):
    chunks = retriever.retrieve_with_scheme_filter("exit load", "Some Fund", top_k=5)

    assert chunks == []


def test_retrieve_general_returns_empty_when_no_match(retriever):
    chunks = retriever.retrieve("Who won the cricket world cup?", namespace="regulatory", top_k=5)

    assert chunks == []
