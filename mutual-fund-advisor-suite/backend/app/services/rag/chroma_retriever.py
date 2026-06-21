from app.services.rag.chroma_store import SchemeLiveDataStore
from app.services.rag.retriever import RetrievedChunk


class ChromaRetriever:
    def __init__(self, persist_path: str = "chroma_store"):
        self.store = SchemeLiveDataStore(persist_path=persist_path)

    def retrieve(self, query: str, namespace: str, top_k: int = 5) -> list[RetrievedChunk]:
        return self._do_retrieve(query, scheme_name=None, top_k=top_k)

    def retrieve_with_scheme_filter(self, query: str, scheme_name: str, top_k: int = 5) -> list[RetrievedChunk]:
        return self._do_retrieve(query, scheme_name=scheme_name, top_k=top_k)

    def _do_retrieve(self, query: str, scheme_name: str | None, top_k: int) -> list[RetrievedChunk]:
        if self.store.count() == 0:
            return []

        try:
            result = self.store.query(query, scheme_name=scheme_name, top_k=top_k)
        except Exception as e:
            print(f"Chroma retrieval failed ({e}); returning no results.")
            return []

        documents = result.get("documents", [[]])[0]
        if not documents:
            return []

        metadatas = result.get("metadatas", [[]])[0]
        distances = result.get("distances", [[]])[0] if result.get("distances") else [0.0] * len(documents)

        chunks = []
        for text, metadata, distance in zip(documents, metadatas, distances):
            chunks.append(
                RetrievedChunk(
                    text=text,
                    score=1.0 - distance,
                    source_url=metadata.get("source_url", ""),
                    doc_type="Live Scheme Data",
                    scheme_name=metadata.get("scheme_name"),
                    page_number=None,
                )
            )
        return chunks
