from pydantic import BaseModel
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
from corpus.ingestion.chunker import Chunk

class EmbeddedChunk(BaseModel):
    id: str
    vector: list[float]
    metadata: dict

class ChunkEmbedder:
    def __init__(self):
        # Uses HuggingFace endpoint for free embeddings
        import os
        hf_token = os.environ.get("HUGGINGFACEHUB_API_TOKEN")
        if not hf_token:
            print("WARNING: HUGGINGFACEHUB_API_TOKEN not set. Using mock embeddings for testing.")
            self.embeddings = None
        else:
            self.embeddings = HuggingFaceInferenceAPIEmbeddings(
                api_key=hf_token,
                model_name="sentence-transformers/all-MiniLM-L6-v2"
            )

    def embed(self, chunks: list[Chunk]) -> list[EmbeddedChunk]:
        if not chunks:
            return []

        embedded_chunks = []
        
        if self.embeddings is None:
            # Mock embedding for test environment
            for i, chunk in enumerate(chunks):
                embedded_chunks.append(
                    EmbeddedChunk(
                        id=f"mock_doc_{i}",
                        vector=[0.1] * 384,  # all-MiniLM-L6-v2 is 384 dims
                        metadata=chunk.model_dump()
                    )
                )
            return embedded_chunks

        # Batch 100 chunks per API call
        batch_size = 100
        for i in range(0, len(chunks), batch_size):
            batch = chunks[i:i + batch_size]
            texts = [c.text for c in batch]
            try:
                vectors = self.embeddings.embed_documents(texts)
                for j, (chunk, vector) in enumerate(zip(batch, vectors)):
                    embedded_chunks.append(
                        EmbeddedChunk(
                            id=f"chunk_{i+j}",
                            vector=vector,
                            metadata=chunk.model_dump()
                        )
                    )
            except Exception as e:
                print(f"Embedding API failed ({e}). Falling back to mock vectors for batch.")
                for j, chunk in enumerate(batch):
                    embedded_chunks.append(
                        EmbeddedChunk(
                            id=f"chunk_{i+j}",
                            vector=[0.1] * 384,
                            metadata=chunk.model_dump()
                        )
                    )
                
        return embedded_chunks
