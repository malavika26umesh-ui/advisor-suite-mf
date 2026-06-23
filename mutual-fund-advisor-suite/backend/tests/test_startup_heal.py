from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.main import heal_scheme_data_if_empty


@pytest.mark.asyncio
async def test_heal_triggers_refresh_when_collection_empty():
    with patch("app.services.rag.chroma_store.SchemeLiveDataStore") as mock_store_cls, \
         patch("app.services.scheduler.scheme_data_refresh.run_daily_scheme_data_refresh", new=AsyncMock()) as mock_refresh, \
         patch("asyncio.create_task") as mock_create_task:
        mock_store_cls.return_value.count.return_value = 0
        await heal_scheme_data_if_empty()
        mock_create_task.assert_called_once()


@pytest.mark.asyncio
async def test_heal_does_nothing_when_collection_populated():
    with patch("app.services.rag.chroma_store.SchemeLiveDataStore") as mock_store_cls, \
         patch("asyncio.create_task") as mock_create_task:
        mock_store_cls.return_value.count.return_value = 26
        await heal_scheme_data_if_empty()
        mock_create_task.assert_not_called()
