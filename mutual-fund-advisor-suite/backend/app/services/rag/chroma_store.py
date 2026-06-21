import chromadb

COLLECTION_NAME = "scheme_live_data"


class SchemeLiveDataStore:
    def __init__(self, persist_path: str = "chroma_store"):
        self.client = chromadb.PersistentClient(path=persist_path)
        self.collection = self.client.get_or_create_collection(name=COLLECTION_NAME)

    def upsert_parameter(
        self,
        scheme_id: int,
        scheme_name: str,
        parameter: str,
        text: str,
        source_url: str,
        fetched_at: str,
    ) -> None:
        doc_id = f"{scheme_id}_{parameter}"
        self.collection.upsert(
            ids=[doc_id],
            documents=[text],
            metadatas=[
                {
                    "scheme_id": scheme_id,
                    "scheme_name": scheme_name,
                    "parameter": parameter,
                    "source_url": source_url,
                    "fetched_at": fetched_at,
                }
            ],
        )

    def query(self, query_text: str, scheme_name: str | None = None, top_k: int = 5) -> dict:
        where = {"scheme_name": scheme_name} if scheme_name else None
        return self.collection.query(
            query_texts=[query_text],
            n_results=top_k,
            where=where,
        )

    def count(self) -> int:
        return self.collection.count()
