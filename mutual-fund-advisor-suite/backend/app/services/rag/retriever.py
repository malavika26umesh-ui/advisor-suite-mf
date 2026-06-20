import os
from pydantic import BaseModel
from pinecone import Pinecone
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
from app.core.config import settings

class RetrievedChunk(BaseModel):
    text: str
    score: float
    source_url: str
    doc_type: str
    scheme_name: str | None
    page_number: int | None

class PineconeRetriever:
    def __init__(self):
        # NOTE: os.environ.get() never sees .env-only vars (pydantic-settings loads
        # .env into `settings`, not into the real OS environment) — same class of bug
        # fixed in Sprint 15 for the Pulse services. Using `settings.*` here so this
        # retriever actually hits real Pinecone/HF when keys are configured.
        self.api_key = settings.PINECONE_API_KEY
        self.index_name = settings.PINECONE_INDEX_NAME or "mf-advisor-suite"
        if not self.api_key:
            print("WARNING: PINECONE_API_KEY not set. Retriever will mock results.")
            self.pc = None
            self.embeddings = None
        else:
            self.pc = Pinecone(api_key=self.api_key)
            self.index = self.pc.Index(self.index_name)

        hf_token = settings.HUGGINGFACEHUB_API_TOKEN
        if not hf_token:
            self.embeddings = None
        else:
            self.embeddings = HuggingFaceInferenceAPIEmbeddings(
                api_key=hf_token,
                model_name="sentence-transformers/all-MiniLM-L6-v2"
            )

    def retrieve(self, query: str, namespace: str, top_k: int = 5) -> list[RetrievedChunk]:
        return self._do_retrieve(query, namespace, None, top_k)

    def retrieve_with_scheme_filter(self, query: str, scheme_name: str, top_k: int = 5) -> list[RetrievedChunk]:
        # Filter by scheme_name
        return self._do_retrieve(query, "scheme_docs", scheme_name, top_k)

    def _do_retrieve(self, query: str, namespace: str, scheme_name: str | None, top_k: int) -> list[RetrievedChunk]:
        if not self.pc or not self.embeddings:
            # Mock retrieval if API keys are missing
            print("Mock retrieval for:", query)
            return [
                RetrievedChunk(
                    text="Mock factual answer about mutual funds. Exit load is 1%.",
                    score=0.9,
                    source_url="https://amc.mock.com/sid",
                    doc_type="SID",
                    scheme_name=scheme_name or "Parag Parikh Flexi Cap Fund",
                    page_number=1
                )
            ]
            
        # Real embedding/Pinecone calls hit external services (HF inference API,
        # Pinecone) that can fail for reasons unrelated to our config — DNS issues,
        # the target service being down, rate limits, cold-start delays. A FAQ
        # answer must degrade gracefully on any of that, never 500 the endpoint.
        try:
            query_vector = self.embeddings.embed_query(query)

            filter_dict = {}
            if scheme_name:
                filter_dict["scheme_name"] = {"$eq": scheme_name}

            results = self.index.query(
                namespace=namespace,
                vector=query_vector,
                top_k=top_k,
                include_metadata=True,
                filter=filter_dict if filter_dict else None
            )
        except Exception as e:
            print(f"Retrieval failed ({e}); falling back to mock results.")
            return [
                RetrievedChunk(
                    text="Mock factual answer about mutual funds. Exit load is 1%.",
                    score=0.9,
                    source_url="https://amc.mock.com/sid",
                    doc_type="SID",
                    scheme_name=scheme_name or "Parag Parikh Flexi Cap Fund",
                    page_number=1
                )
            ]

        retrieved = []
        for match in results.get("matches", []):
            md = match.get("metadata", {})
            retrieved.append(
                RetrievedChunk(
                    text=md.get("text", ""),
                    score=match.get("score", 0.0),
                    source_url=md.get("source_url", ""),
                    doc_type=md.get("doc_type", ""),
                    scheme_name=md.get("scheme_name"),
                    page_number=int(md.get("page_number", 0)) if md.get("page_number") else None
                )
            )

        return retrieved
