from app.services.rag.scheme_data_scraper import build_parameter_sentences


def test_build_parameter_sentences_all_fields_present():
    parsed = {
        "nav_value": 85.32,
        "nav_date": "2026-06-20",
        "aum_value": "Rs. 12,345 Cr",
        "exit_load_text": "1% if redeemed within 365 days, nil thereafter.",
    }

    sentences = build_parameter_sentences("Parag Parikh Flexi Cap Fund", parsed)

    by_param = {s["parameter"]: s["text"] for s in sentences}
    assert "nav" in by_param
    assert "85.32" in by_param["nav"]
    assert "2026-06-20" in by_param["nav"]
    assert "Parag Parikh Flexi Cap Fund" in by_param["nav"]
    assert "aum" in by_param
    assert "Rs. 12,345 Cr" in by_param["aum"]
    assert "exit_load" in by_param
    assert "1% if redeemed within 365 days" in by_param["exit_load"]
    assert len(sentences) == 3


def test_build_parameter_sentences_skips_null_fields():
    parsed = {"nav_value": 85.32, "nav_date": "2026-06-20", "aum_value": None, "exit_load_text": None}

    sentences = build_parameter_sentences("Parag Parikh Flexi Cap Fund", parsed)

    assert len(sentences) == 1
    assert sentences[0]["parameter"] == "nav"


def test_build_parameter_sentences_all_null_returns_empty():
    parsed = {"nav_value": None, "nav_date": None, "aum_value": None, "exit_load_text": None}

    sentences = build_parameter_sentences("Parag Parikh Flexi Cap Fund", parsed)

    assert sentences == []
