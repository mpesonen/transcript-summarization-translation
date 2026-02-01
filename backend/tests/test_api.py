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

doctor_patient_conversation = """
D: What brought you in today?

P: Sure, I'm I'm just having a lot of chest pain and and so I thought I should get it checked out.

D: OK, before we start, could you remind me of your gender and age? 

P: Sure 39, I'm a male.

D: OK, and so when did this chest pain start?

P: It started last night, but it's becoming sharper.

D: OK, and where is this pain located? 

P: It's located on the left side of my chest.

D: OK, and, so how long has it been going on for then if it started last night?

P: So I guess it would be a couple of hours now, maybe like 8.

D: OK. Has it been constant throughout that time, or uh, or changing? 

P: I would say it's been pretty constant, yeah.

D: OK, and how would you describe the pain? People will use words sometimes like sharp, burning, achy. 

P: I'd say it's pretty sharp, yeah.

D: Sharp OK. Uh, anything that you have done tried since last night that's made the pain better?

P: Um not laying down helps.

D: OK, so do you find laying down makes the pain worse?
"""

class TestSummarizeEndpoint:
    def test_summarize(self):
        """Test summarization endpoint with sample data."""
        from fastapi.testclient import TestClient

        from src.api.main import app
        with TestClient(app) as client:
            payload = {
                "text": doctor_patient_conversation,
                "word_limit": 200,
                "target_language": "Finnish"
            }
            response = client.post("/summarize", json=payload)
            assert response.status_code == 200