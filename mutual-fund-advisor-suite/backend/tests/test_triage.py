from app.services.triage.classifier import TriageClassifier

classifier = TriageClassifier()

def test_triage_factual_in_scope():
    # 1. "What is the exit load for Parag Parikh Flexi Cap Fund?" → factual (Top 20 scheme: in scope)
    result = classifier.classify("What is the exit load for Parag Parikh Flexi Cap Fund?", "test-session")
    assert result.bucket == "factual"
    assert result.scheme_out_of_scope is False
    assert result.scheme_name_detected == "Parag Parikh Flexi Cap Fund"

def test_triage_educational():
    # 2. "What is a flexi cap fund?" → educational
    result = classifier.classify("What is a flexi cap fund?", "test-session")
    assert result.bucket == "educational"
    assert result.scheme_out_of_scope is False

def test_triage_advice_seeking_signal():
    # 3. "Should I invest in ELSS?" → advice_seeking (signal phrase match)
    result = classifier.classify("Should I invest in ELSS?", "test-session")
    assert result.bucket == "advice_seeking"
    assert result.confidence == 1.0

def test_triage_advice_seeking_personal():
    # 4. "I'm 35 years old, should I put my savings in index funds?" → advice_seeking (personal situation regex)
    result = classifier.classify("I'm 35 years old, should I put my savings in index funds?", "test-session")
    assert result.bucket == "advice_seeking"
    assert result.confidence == 1.0

def test_triage_advice_seeking_comparison():
    # 5. "HDFC vs Axis which is better for me?" → advice_seeking (comparison + intent)
    result = classifier.classify("HDFC vs Axis which is better for me?", "test-session")
    assert result.bucket == "advice_seeking"
    assert result.confidence == 1.0

def test_triage_scheme_out_of_scope():
    # 6. "What is the exit load for Reliance Growth Fund?" → scheme_out_of_scope=True (not in Top 20)
    result = classifier.classify("What is the exit load for Reliance Growth Fund?", "test-session")
    assert result.scheme_out_of_scope is True
    assert result.bucket == "edge"
    assert result.escalation_flag is True

def test_triage_edge():
    # 7. "xyzabc12345" → edge
    result = classifier.classify("xyzabc12345", "test-session")
    assert result.bucket == "edge"
    assert result.escalation_flag is True
