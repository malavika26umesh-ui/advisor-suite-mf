"""RAG evaluation suite — Sprint 17.

Runs each Golden Dataset query through the live FAQ Centre API, then scores the
real response with an LLM judge for faithfulness and relevance.

NOTE on LLM judge provider: the spec calls for "Claude Sonnet" as the judge, but
this project has no ANTHROPIC_API_KEY anywhere (confirmed repeatedly across
Sprints 9-17) — Groq is the LLM provider actually configured and used throughout
the codebase (triage classifier, FAQ answer_builder, Pulse report generator all
use Groq). Using Groq here too rather than introducing a brand-new provider
dependency this project has never had a key for.

NOTE on faithfulness: the FAQ API is evaluated as a black box (its real
HTTP response), which doesn't expose the raw retrieved chunks externally. So
"faithfulness" here is judged as: does the answer avoid fabricating specific
claims (numbers, dates, named figures) beyond what's generic/attributable to its
cited sources? This is the practical proxy available from outside the API
boundary. For "no_answer" responses, faithfulness is trivially 1.0 — a refusal
makes no claims at all, so nothing can be unfaithful.

Usage:
    python rag_evaluator.py --dataset golden_dataset.json
"""
import argparse
import json
import os
import sys
import time
from pathlib import Path

import requests

BACKEND_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(BACKEND_ROOT))

from app.core.config import settings  # noqa: E402

API_BASE = "http://localhost:8000"
FAITHFULNESS_TARGET = 0.80
RELEVANCE_TARGET = 0.80

JUDGE_SYSTEM_PROMPT = """You are an evaluation judge for a SEBI-compliant mutual fund FAQ system.

You will be given: a user query, the system's actual answer, its status, and its cited sources.

Score two metrics from 0.0 to 1.0:

FAITHFULNESS — does the answer avoid fabricating specific claims (numbers, dates, named
facts) that aren't generic and aren't attributable to the cited sources? A refusal like
"We don't have verified information about this in our knowledge base" is automatically
faithfulness=1.0 (a refusal makes no claims, so nothing can be unfaithful).

RELEVANCE — is the answer a relevant, on-topic, complete response to the query? A correct,
honest refusal to answer (when the system genuinely lacks verified information) should
still score reasonably high on relevance if refusing was the contextually appropriate thing
to do — relevance penalizes answers that are off-topic, incomplete, or evasive without
reason, not honest "I don't know" responses to under-resourced queries.

Respond with JSON only: {"faithfulness": <float 0.0-1.0>, "relevance": <float 0.0-1.0>, "reasoning": "<one sentence>"}
"""


def get_judge():
    from langchain_groq import ChatGroq

    if not settings.GROQ_API_KEY:
        return None
    return ChatGroq(
        model_name="llama-3.1-8b-instant",
        groq_api_key=settings.GROQ_API_KEY,
        model_kwargs={"response_format": {"type": "json_object"}},
    )


def query_faq(query: str, session_id: str) -> dict:
    resp = requests.post(
        f"{API_BASE}/api/faq/query",
        json={"query": query, "session_id": session_id},
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()


def judge_response(llm, query: str, faq_response: dict) -> dict:
    status = faq_response.get("status")
    answer = faq_response.get("answer") or {}
    answer_text = answer.get("answer_text", "")
    sources = answer.get("source_badges", [])

    if llm is None:
        # No judge available — can't score, but don't crash the run.
        return {"faithfulness": None, "relevance": None, "reasoning": "No GROQ_API_KEY configured for judge"}

    from langchain_core.messages import HumanMessage, SystemMessage

    prompt = (
        f"Query: {query}\n"
        f"Status: {status}\n"
        f"Answer: {answer_text}\n"
        f"Cited sources: {sources}\n"
    )
    try:
        response = llm.invoke([SystemMessage(content=JUDGE_SYSTEM_PROMPT), HumanMessage(content=prompt)])
        data = json.loads(response.content)
        return {
            "faithfulness": float(data.get("faithfulness", 0.0)),
            "relevance": float(data.get("relevance", 0.0)),
            "reasoning": data.get("reasoning", ""),
        }
    except Exception as e:
        return {"faithfulness": 0.0, "relevance": 0.0, "reasoning": f"Judge error: {e}"}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", default="golden_dataset.json")
    args = parser.parse_args()

    dataset_path = Path(__file__).parent / args.dataset
    with open(dataset_path) as f:
        dataset = json.load(f)

    llm = get_judge()
    if llm is None:
        print("WARNING: GROQ_API_KEY not configured — cannot run LLM judge scoring.")

    results = []
    for i, item in enumerate(dataset):
        session_id = f"rag-eval-{i}-{int(time.time())}"
        try:
            faq_response = query_faq(item["query"], session_id)
        except Exception as e:
            print(f"[{i+1}/{len(dataset)}] {item['query'][:60]!r} -> REQUEST FAILED: {e}")
            results.append({"query": item["query"], "category": item.get("category"), "faithfulness": 0.0, "relevance": 0.0, "status": "request_failed"})
            continue

        scores = judge_response(llm, item["query"], faq_response)
        status = faq_response.get("status")
        cited = bool((faq_response.get("answer") or {}).get("source_badges"))

        print(
            f"[{i+1}/{len(dataset)}] [{item.get('category', '?'):14s}] status={status:10s} "
            f"faithfulness={scores['faithfulness']} relevance={scores['relevance']} "
            f"cited={cited} | {item['query'][:55]}"
        )

        results.append({
            "query": item["query"],
            "category": item.get("category"),
            "status": status,
            "cited_source": cited,
            "faithfulness": scores["faithfulness"],
            "relevance": scores["relevance"],
            "reasoning": scores["reasoning"],
        })

    valid_faithfulness = [r["faithfulness"] for r in results if r["faithfulness"] is not None]
    valid_relevance = [r["relevance"] for r in results if r["relevance"] is not None]

    avg_faithfulness = sum(valid_faithfulness) / len(valid_faithfulness) if valid_faithfulness else 0.0
    avg_relevance = sum(valid_relevance) / len(valid_relevance) if valid_relevance else 0.0

    print("\n" + "=" * 70)
    print(f"AVERAGE FAITHFULNESS: {avg_faithfulness:.3f} (target >= {FAITHFULNESS_TARGET})")
    print(f"AVERAGE RELEVANCE:    {avg_relevance:.3f} (target >= {RELEVANCE_TARGET})")
    print("=" * 70)

    # Per-category breakdown
    categories = sorted(set(r["category"] for r in results if r.get("category")))
    for cat in categories:
        cat_results = [r for r in results if r["category"] == cat]
        cat_f = [r["faithfulness"] for r in cat_results if r["faithfulness"] is not None]
        cat_r = [r["relevance"] for r in cat_results if r["relevance"] is not None]
        answered = sum(1 for r in cat_results if r["status"] == "answered")
        print(
            f"  {cat:14s} faithfulness={sum(cat_f)/len(cat_f) if cat_f else 0:.2f} "
            f"relevance={sum(cat_r)/len(cat_r) if cat_r else 0:.2f} "
            f"answered={answered}/{len(cat_results)}"
        )

    output_path = Path(__file__).parent / "rag_eval_results.json"
    with open(output_path, "w") as f:
        json.dump({"results": results, "avg_faithfulness": avg_faithfulness, "avg_relevance": avg_relevance}, f, indent=2)
    print(f"\nFull results written to {output_path}")

    passed = avg_faithfulness >= FAITHFULNESS_TARGET and avg_relevance >= RELEVANCE_TARGET
    sys.exit(0 if passed else 1)


if __name__ == "__main__":
    main()
