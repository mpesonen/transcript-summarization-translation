import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from src.config import get_settings

app = FastAPI()
settings = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins_list(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Summary(BaseModel):
    text: str
    target_language: str | None = None
    tonality: str | None = None
    styling: str | None = None
    model: str | None = None


class SummaryOutput(BaseModel):
    summarized_text: str


@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "Backend is running. Frontend is served through the nginx container on http://localhost:8080.",
    }


@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Service is healthy"}


@app.post("/summarize")
def summarize(summary: Summary):
    settings = get_settings()
    model_provider = summary.model if summary.model else "openai"
    model = ""

    if model_provider == "openai":
        client = OpenAI(api_key=settings.openai_api_key)
        model = settings.llm_model_openai
    else:
        client = OpenAI(
            api_key=settings.google_api_key,
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
        )  # Google can be called via OpenAI SDK (=effective model abstraction up to a point)
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

    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "system",
                "content": "You are a helpful medical assistant that summarizes doctor's discussion transcripts with patients, or any other textual data. You summarize the given text into 1 paragraph, unless broken into multiple bullet points.",
            },
            {
                "role": "user",
                "content": f"{content}\n\nText to summarize: {summary.text}",
            },
        ],
    )

    summarized = response.choices[0].message.content or ""
    return SummaryOutput(summarized_text=summarized)


# Static file serving for production (frontend)
# This must be after API routes to avoid conflicts
static_dir = os.path.join(os.path.dirname(__file__), "..", "..", "static")
if os.path.exists(static_dir):
    app.mount(
        "/assets",
        StaticFiles(directory=os.path.join(static_dir, "assets")),
        name="assets",
    )

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """Serve the SPA for all non-API routes."""
        return FileResponse(os.path.join(static_dir, "index.html"))
