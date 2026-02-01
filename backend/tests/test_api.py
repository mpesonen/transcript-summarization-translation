import pytest

class TestHealthEndpoint:
    def test_health_check(self):
        """Test health endpoint returns ok status."""
        from fastapi.testclient import TestClient

        from src.api.main import app
        with TestClient(app) as client:
            response = client.get("/health")
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "ok"
            assert "message" in data

class TestSummarizeEndpoint:
    def test_summarize(self):
        """Test summarization endpoint with sample data."""
        from fastapi.testclient import TestClient

        from src.api.main import app
        with TestClient(app) as client:
            payload = {
                "text": "This is a long text that needs to be summarized.",
                "word_limit": 10,
                "target_language": "es"
            }
            response = client.post("/summarize", json=payload)
            assert response.status_code == 200