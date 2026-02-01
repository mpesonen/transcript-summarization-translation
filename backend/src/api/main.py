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
    tonality: str | None = None
    styling: str | None = None

class SummaryOutput(BaseModel):
    summarized_text: str

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Service is healthy"}

@app.post("/summarize")
def summarize(summary: Summary):
    settings = get_settings()
    model_provider = "openai"
    model = ""
    # model_provider = "google"  # Future use

    if model_provider == "openai":
        client = OpenAI(api_key=settings.openai_api_key)
        model = settings.llm_model_openai
    else:
        client = OpenAI(api_key=settings.google_api_key)  # Placeholder for Google client
        model = settings.llm_model_google

    content = ""
    if summary.target_language is not None:
        content += f" Translate the output to {summary.target_language} and return only the translated text."
    if summary.tonality is not None:
        content += f" Make sure the summary has a {summary.tonality} tonality."
    if summary.styling is not None:
        if summary.styling.lower() == "bullet points":
            content += " Format the summary using bullet points styling. For each point use a new line starting with a hyphen (-)."
        else:
            content += f" Format the summary using text paragraph styling."

    response = client.responses.parse(
        model=model,
        input=[
            {
                "role": "system",
                "content": "You are a helpful medical assistant that summarizes doctor's discussion transcripts with patients, or any other textual data. You summarize the given text into 1 paragraph, unless broken into multiple bullet points."
            },
            {
                "role": "user",
                "content": f"{content}\n\nText to summarize: {summary.text}"
            }
        ],
        text_format=SummaryOutput,
    )

    return response.output_parsed