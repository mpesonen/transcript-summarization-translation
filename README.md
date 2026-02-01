# Transcript Summarization & Translation

A web application for summarizing and translating medical transcripts using LLMs (OpenAI or Gemini).  
Frontend built with React + MUI, backend with FastAPI.

---

## Features

- Paste or drop transcript text files for summarization
- Choose summary tonality, styling, and target language
- Select LLM provider: OpenAI or Google Gemini
- Caches input and theme preference in local storage (not on server for cybersecurity reasons)
- Responsive UI with dark/light mode
- Finnish SSNs are checked for in the input and disallowed (naive PHI/PII validation)

---

## Project Structure

```
transcript-summarization-translation/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   └── main.py         # FastAPI app & endpoints
│   │   └── config.py           # Pydantic settings
│   ├── tests/
│   │   └── test_api.py         # API tests
│   ├── pyproject.toml          # Python dependencies (uv)
│   └── .env                    # API keys (not committed)
├── frontend/
│   ├── src/
│   │   ├── App.tsx             # Main React app
│   │   └── services/api.ts     # API call helpers
│   └── package.json            # Node dependencies
├── Dockerfile                  # Multi-stage build for deployment
└── README.md
```

---

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/yourusername/transcript-summarization-translation.git
cd transcript-summarization-translation
```

### 2. Backend Setup

**Prerequisites:** Python 3.13+ and [uv](https://docs.astral.sh/uv/) installed.

```sh
cd backend
uv sync
```

Create a `.env` file in `backend/`:

```
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
```

Start the FastAPI server:

```sh
uv run uvicorn src.api.main:app --reload
```

### 3. Frontend Setup

- Node.js 18+ recommended
- Install dependencies:

```sh
cd frontend
npm install
```

- Start the React development server:

```sh
npm run dev
```

- Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Usage

1. Paste or drop a transcript into the input field.
2. Select summary options (language, tonality, styling, provider).
3. Click **Submit** to get a summarized/translated output.
4. Switch between dark/light mode as preferred.


---

## Testing

Run backend tests with pytest:

```sh
cd backend
uv run pytest
```

---

## Docker Deployment

Build and run the application in a single container:

```sh
docker build -t transcript-summarizer .
docker run -p 8000:8000 \
  -e OPENAI_API_KEY=your-key \
  -e GOOGLE_API_KEY=your-key \
  transcript-summarizer
```

Open [http://localhost:8000](http://localhost:8000) - both frontend and API are served from the same container.

For AWS App Runner deployment, see the [deployment plan](.claude/plans/quizzical-stargazing-thompson.md).

---

## Environment Variables

- `OPENAI_API_KEY` – Your OpenAI API key
- `GOOGLE_API_KEY` – Your Google Gemini API key
- `LLM_MODEL_OPENAI` – OpenAI model name (e.g., `gpt-5-mini`)
- `LLM_MODEL_GOOGLE` – Gemini model name (e.g., `gemini-3-flash-preview`)
- `CORS_ORIGINS` – Allowed frontend origins (comma-separated)

---

## License

MIT License

