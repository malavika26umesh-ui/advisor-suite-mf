from pydantic import BaseModel
from langchain_text_splitters import RecursiveCharacterTextSplitter
from corpus.ingestion.pdf_extractor import ExtractedPage

class Chunk(BaseModel):
    text: str
    scheme_name: str | None
    doc_type: str
    source_url: str
    page_number: int
    section_heading: str | None

class DocumentChunker:
    def __init__(self):
        # The prompt says: Chunk size: 500 tokens (~375 words), overlap: 100 tokens
        # We can use RecursiveCharacterTextSplitter for this. 
        # Using characters: 500 tokens * 4 chars/token approx = 2000 chars, overlap 400
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=2000,
            chunk_overlap=400,
            separators=["\n\n", "\n", " ", ""]
        )

    def chunk(self, pages: list[ExtractedPage], scheme_name: str | None, doc_type: str, source_url: str) -> list[Chunk]:
        chunks = []
        for page in pages:
            split_texts = self.text_splitter.split_text(page.text)
            for text in split_texts:
                # Basic section heading extraction (just the first line if it's short and uppercase)
                lines = text.strip().split("\n")
                heading = None
                if lines and len(lines[0]) < 100 and lines[0].isupper():
                    heading = lines[0]
                    
                chunks.append(
                    Chunk(
                        text=text,
                        scheme_name=scheme_name,
                        doc_type=doc_type,
                        source_url=source_url,
                        page_number=page.page_number,
                        section_heading=heading
                    )
                )
        return chunks
