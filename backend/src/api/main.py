from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from src.config import get_settings

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

class SummaryOutput(BaseModel):
    summarized_text: str

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Service is healthy"}

@app.post("/summarize")
def summarize(summary: Summary):
    settings = get_settings()
    client = OpenAI(api_key=settings.openai_api_key)

    content = f"Summarize the given text into 1 paragraph."
    if summary.word_limit:
        content += f" Limit the summary to {summary.word_limit} words."
    if summary.target_language:
        content += f" Translate the output to {summary.target_language}."

    response = client.responses.parse(
        model="gpt-4o-mini",
        input=[
            {
                "role": "system",
                "content": "You are a helpful medical assistant that summarizes doctor's discussion transcripts with patients, or any other textual data."
            },
            {
                "role": "user",
                "content": f"{content}\n\nText to summarize: {summary.text}"
            }
        ],
        text_format=SummaryOutput,
    )

    return response.output_parsed