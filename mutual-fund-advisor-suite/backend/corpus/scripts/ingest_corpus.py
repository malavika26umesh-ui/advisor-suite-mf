import argparse
import json
import os
from pinecone import Pinecone
from dotenv import load_dotenv

load_dotenv("../.env")

from corpus.ingestion.pdf_extractor import PDFExtractor
from corpus.ingestion.chunker import DocumentChunker
from corpus.ingestion.embedder import ChunkEmbedder

def ingest_scheme_docs():
    manifest_path = os.path.join("corpus", "sources", "source_manifest.json")
    with open(manifest_path, "r") as f:
        manifest = json.load(f)
    
    extractor = PDFExtractor()
    chunker = DocumentChunker()
    embedder = ChunkEmbedder()
    
    all_chunks = []
    
    for scheme in manifest.get("scheme_documents", []):
        scheme_name = scheme["scheme_name"]
        for doc in scheme.get("documents", []):
            filepath = os.path.join("corpus", "sources", doc["filename"])
            pages = extractor.extract(filepath, doc["type"], scheme_name)
            chunks = chunker.chunk(pages, scheme_name, doc["type"], doc["source_url"])
            all_chunks.extend(chunks)
            
    print(f"Extracted {len(all_chunks)} chunks for scheme_docs.")
    
    embedded_chunks = embedder.embed(all_chunks)
    upload_to_pinecone(embedded_chunks, namespace="scheme_docs")

def ingest_regulatory():
    manifest_path = os.path.join("corpus", "sources", "source_manifest.json")
    with open(manifest_path, "r") as f:
        manifest = json.load(f)
    
    extractor = PDFExtractor()
    chunker = DocumentChunker()
    embedder = ChunkEmbedder()
    
    all_chunks = []
    
    for doc in manifest.get("regulatory_documents", []):
        if "filename" not in doc:
            continue
        filepath = os.path.join("corpus", "sources", doc["filename"])
        pages = extractor.extract(filepath, doc["type"])
        chunks = chunker.chunk(pages, None, doc["type"], doc["url"])
        all_chunks.extend(chunks)
        
    print(f"Extracted {len(all_chunks)} chunks for regulatory_documents.")
    
    embedded_chunks = embedder.embed(all_chunks)
    upload_to_pinecone(embedded_chunks, namespace="regulatory")

def ingest_education():
    manifest_path = os.path.join("corpus", "sources", "source_manifest.json")
    with open(manifest_path, "r") as f:
        manifest = json.load(f)
    
    extractor = PDFExtractor()
    chunker = DocumentChunker()
    embedder = ChunkEmbedder()
    
    all_chunks = []
    
    for doc in manifest.get("education_documents", []):
        if "filename" not in doc:
            continue
        filepath = os.path.join("corpus", "sources", doc["filename"])
        pages = extractor.extract(filepath, doc["type"])
        chunks = chunker.chunk(pages, None, doc["type"], doc.get("url", ""))
        all_chunks.extend(chunks)
        
    print(f"Extracted {len(all_chunks)} chunks for education_documents.")
    
    embedded_chunks = embedder.embed(all_chunks)
    upload_to_pinecone(embedded_chunks, namespace="education")

def upload_to_pinecone(embedded_chunks, namespace):
    api_key = os.environ.get("PINECONE_API_KEY")
    if not api_key:
        print("WARNING: PINECONE_API_KEY not set. Skipping Pinecone upload.")
        return
        
    pc = Pinecone(api_key=api_key)
    index_name = "mf-advisor-suite"
    
    if index_name not in pc.list_indexes().names():
        print(f"Index {index_name} not found in Pinecone. Please create it manually.")
        return
        
    index = pc.Index(index_name)
    
    batch_size = 100
    for i in range(0, len(embedded_chunks), batch_size):
        batch = embedded_chunks[i:i + batch_size]
        vectors = []
        for chunk in batch:
            metadata = chunk.metadata
            # pinecone doesn't support nested dicts or None well
            clean_metadata = {k: v if v is not None else "" for k, v in metadata.items()}
            vectors.append({"id": chunk.id, "values": chunk.vector, "metadata": clean_metadata})
            
        index.upsert(vectors=vectors, namespace=namespace)
        
    print(f"Uploaded {len(embedded_chunks)} vectors to namespace {namespace}.")

def verify_pinecone():
    api_key = os.environ.get("PINECONE_API_KEY")
    if not api_key:
        print("WARNING: PINECONE_API_KEY not set. Cannot verify Pinecone.")
        return
        
    pc = Pinecone(api_key=api_key)
    index_name = "mf-advisor-suite"
    
    if index_name not in pc.list_indexes().names():
        print(f"Index {index_name} not found in Pinecone.")
        return
        
    index = pc.Index(index_name)
    stats = index.describe_index_stats()
    print("Pinecone Index Stats:")
    print(f"Dimension: {stats.dimension}")
    print(f"Total vector count: {stats.total_vector_count}")
    print("Namespaces:")
    for ns, info in stats.namespaces.items():
        print(f"  - {ns}: {info.vector_count} vectors")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", choices=["scheme_docs", "regulatory", "education"])
    parser.add_argument("--verify", action="store_true")
    args = parser.parse_args()
    
    if args.verify:
        verify_pinecone()
    elif args.source == "scheme_docs":
        ingest_scheme_docs()
    elif args.source == "regulatory":
        ingest_regulatory()
    elif args.source == "education":
        ingest_education()
    else:
        parser.print_help()
