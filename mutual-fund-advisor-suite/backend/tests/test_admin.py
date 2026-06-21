from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.core.config import settings

client = TestClient(app)


def test_refresh_endpoint_rejects_missing_token():
    res = client.post("/api/admin/refresh-scheme-data")
    assert res.status_code == 403


def test_refresh_endpoint_rejects_wrong_token(monkeypatch):
    monkeypatch.setattr(settings, "ADMIN_REFRESH_TOKEN", "correct-token")
    res = client.post("/api/admin/refresh-scheme-data", headers={"X-Admin-Token": "wrong-token"})
    assert res.status_code == 403


def test_refresh_endpoint_rejects_when_unconfigured(monkeypatch):
    monkeypatch.setattr(settings, "ADMIN_REFRESH_TOKEN", "")
    res = client.post("/api/admin/refresh-scheme-data", headers={"X-Admin-Token": "anything"})
    assert res.status_code == 403


def test_refresh_endpoint_runs_job_with_correct_token(monkeypatch):
    monkeypatch.setattr(settings, "ADMIN_REFRESH_TOKEN", "correct-token")
    with patch("app.api.routes.admin.run_daily_scheme_data_refresh", new=AsyncMock()) as mock_run, \
         patch("app.api.routes.admin.SchemeLiveDataStore") as mock_store_cls:
        mock_store_cls.return_value.count.return_value = 27
        res = client.post("/api/admin/refresh-scheme-data", headers={"X-Admin-Token": "correct-token"})

        assert res.status_code == 200
        assert res.json() == {"status": "completed", "document_count": 27}
        mock_run.assert_awaited_once()
