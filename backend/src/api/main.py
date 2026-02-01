from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Or "*" for all, but specify for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Summary(BaseModel):
    text: str
    target_language: str | None = None
    word_limit: int | None = None

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Service is healthy"}

@app.post("/summarize")
def summarize(summary: Summary):
    # Placeholder for summarization logic
    summarized_text = f"Summarized text within {summary.word_limit} words"
    return {"summarized_text": summarized_text}