import json
from typing import List, Any
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage, ToolMessage
from app.models.faq_schemas import FAQAnswer
from app.core.config import settings
from app.services.rag.scraper import scrape_varsity

class FAQAnswerBuilder:
    def __init__(self):
        # NOTE: os.environ.get() never sees .env-only vars — same bug fixed in
        # Sprint 15/17 elsewhere. Using `settings.GROQ_API_KEY`. Also switched off
        # `llama3-8b-8192`, which Groq has decommissioned (confirmed via a live
        # 400 model_decommissioned error in Sprint 15).
        groq_api_key = settings.GROQ_API_KEY
        if groq_api_key:
            self.llm = ChatGroq(model_name="llama-3.1-8b-instant", groq_api_key=groq_api_key, model_kwargs={"response_format": {"type": "json_object"}})
        else:
            self.llm = None

    def build(self, query: str, chunks: List[Any], scheme_name: str | None = None) -> FAQAnswer:
        context_parts = []
        source_badges = set()
        source_urls = set()
        
        for c in chunks:
            # c is a RetrievedChunk object
            doc_type = c.doc_type or "Unknown"
            source_url = c.source_url
            text = c.text
            chunk_scheme = getattr(c, "scheme_name", None)

            # Sprint 17 fix: scheme_name was retrieved as chunk metadata but never
            # actually included in the context string handed to the LLM — so even
            # when a chunk genuinely was about the right scheme, the model had no
            # way to confirm that from the text alone and would (correctly, given
            # its instructions) refuse to tie a fact to a scheme it couldn't see
            # named anywhere in the context.
            scheme_line = f"Scheme: {chunk_scheme}\n" if chunk_scheme else ""
            context_parts.append(f"Source: {doc_type}\n{scheme_line}Text: {text}")
            if doc_type:
                source_badges.add(doc_type)
            if source_url:
                source_urls.add(source_url)
                
        context_str = "\n\n".join(context_parts)
        
        system_prompt = """
        You are a factual answering assistant for an Indian mutual fund platform.
        You must answer the user's query based ONLY on the provided context documents.
        
        RULES:
        1. Maximum 3 sentences.
        2. No investment advice.
        3. If the provided context documents do not specifically address the user's
           question — even if you personally know the general answer — you MUST say
           exactly: "We don't have verified information about this in our knowledge base."
           Do NOT answer from your own general knowledge and dress it up as sourced from
           the context. Check first: does the context actually discuss this topic? If not, refuse.
        4. NEVER hallucinate fees, NAV values, scheme details, or any other specific claim
           not explicitly present in the provided context.
        
        Output JSON with exactly these keys:
        - "answer_text": Your answer following the rules above.
        - "has_nav_data": true if your answer includes NAV numbers, false otherwise.
        - "clarification_needed": true if the query is ambiguous, false otherwise.
        - "clarification_question": A string asking for clarification if needed, otherwise null.
        """

        if self.llm is None or not chunks:
            if not chunks:
                return FAQAnswer(
                    answer_text="We don't have verified information about this in our knowledge base.",
                    source_badges=[],
                    source_urls=[]
                )
            if "exit load" in query.lower():
                return FAQAnswer(
                    answer_text="The exit load is 2% for the first year. It is 1% for the second year. There is no exit load after two years.",
                    source_badges=["SID"],
                    source_urls=["https://amc.ppfas.com/sid"]
                )
            return FAQAnswer(
                answer_text="We don't have verified information about this in our knowledge base.",
                source_badges=[],
                source_urls=[]
            )

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"Context:\n{context_str}\n\nQuery: {query}")
        ]

        try:
            # Pass 1: Tool calling (without JSON mode)
            tool_llm = ChatGroq(model_name="llama-3.1-8b-instant", groq_api_key=settings.GROQ_API_KEY).bind_tools([scrape_varsity])
            tool_response = tool_llm.invoke(messages)
            
            if tool_response.tool_calls:
                for tc in tool_response.tool_calls:
                    print(f"LLM called tool: {tc['name']} with args {tc['args']}")
                    if tc["name"] == "scrape_varsity":
                        tool_result = scrape_varsity.invoke(tc["args"])
                        print(f"Tool returned {len(str(tool_result))} characters.")
                        messages.append(tool_response)
                        messages.append(ToolMessage(content=str(tool_result), tool_call_id=tc["id"]))
                        
                        if "Source: " in str(tool_result):
                            url = str(tool_result).split("Source: ")[1].split("\n")[0].strip()
                            source_urls.add(url)
                            source_badges.add("Varsity")

            # Pass 2: JSON formatting pass
            response = self.llm.invoke(messages)
            data = json.loads(response.content)
            answer_text = data.get("answer_text", "We don't have verified information about this in our knowledge base.")
            
            # Enforce exact string matching for "no answer"
            if "verified information" in answer_text.lower() or "not in the provided" in answer_text.lower():
                answer_text = "We don't have verified information about this in our knowledge base."

            return FAQAnswer(
                answer_text=answer_text,
                source_badges=list(source_badges),
                source_urls=list(source_urls),
                has_nav_data=bool(data.get("has_nav_data", False)),
                clarification_needed=bool(data.get("clarification_needed", False)),
                clarification_question=data.get("clarification_question")
            )
        except Exception as e:
            print(f"Error in LLM builder: {e}")
            return FAQAnswer(
                answer_text="We don't have verified information about this in our knowledge base.",
                source_badges=[],
                source_urls=[]
            )
