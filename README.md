# Transcript Summarization & Translation

A web application for summarizing and translating medical transcripts using LLMs (OpenAI or Gemini).  
Frontend built with React + MUI, backend with FastAPI.

---

## Features

- Paste or drop transcript text files for summarization
- Choose summary tonality, styling, and target language
- Select LLM provider: OpenAI or Google Gemini
- Caches input and theme preference in local storage
- Responsive UI with dark/light mode

---

## Project Structure

```
transcript-summarization-translation/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   └── main.py         # FastAPI app & endpoints
│   │   └── config.py           # Pydantic settings
│   └── tests/
│       └── test_api.py         # API tests
├── frontend/
│   ├── src/
│   │   ├── App.tsx             # Main React app
│   │   └── services/api.ts     # API call helpers
│   └── public/
│       └── ...                 # Static assets
├── .env                        # API keys & config (not committed)
├── README.md
└── ...
```

---

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/yourusername/transcript-summarization-translation.git
cd transcript-summarization-translation
```

### 2. Backend Setup

- Python 3.10+ recommended
- Create and activate a virtual environment:

```sh
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

- Create a `.env` file in `backend/`:

```
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
LLM_MODEL_OPENAI=gpt-3.5-turbo
LLM_MODEL_GOOGLE=gemini-pro
CORS_ORIGINS=http://localhost:5173
```

- Start the FastAPI server:

```sh
uvicorn src.api.main:app --reload
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

## Note

Finnish SSNs are checked for in the input.

---

## Testing

- Backend:  
  Run API tests with pytest:
  ```sh
  cd backend
  pytest
  ```

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

