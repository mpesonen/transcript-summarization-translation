# Transcript Summarization & Translation

A web application for summarizing and translating medical transcripts using LLMs (OpenAI or Gemini).  
Frontend built with React + MUI, backend with FastAPI.

Also runs on AWS EC2, and is accessible via: http://13.49.229.238/

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
├── docker-compose.yml          # Local/production orchestration (frontend + backend)
├── backend/Dockerfile          # FastAPI image definition
├── frontend/Dockerfile         # React + Nginx image definition
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

Create a `.env` file in `backend/` (you can start from `backend/.env.example`):

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

## Docker Compose Deployment

Run the frontend (Nginx) and backend (FastAPI) as separate services with Docker Compose:

```sh
cp backend/.env.example backend/.env   # then update the keys
# Optional: echo "FRONTEND_PORT=80" >> .env   # host port for the frontend container
docker compose up --build
```

- Frontend: [http://localhost:8080](http://localhost:8080) (set `FRONTEND_PORT=80` in `.env` to expose port 80 instead)
- Backend API (optional direct access): [http://localhost:8000/health](http://localhost:8000/health)

The frontend container serves the compiled React app and proxies `/api/*` requests to the backend service, so the browser never needs to reach port 8000 directly.

> ℹ️ The root-level `.env` file is used only by Docker Compose (e.g., `FRONTEND_PORT=80`). Application secrets stay in `backend/.env`.

---

## AWS EC2 Deployment

You can run the same Docker Compose stack on a small EC2 instance instead of App Runner:

1. **Provision EC2**
   - Recommended: Amazon Linux 2023 or Ubuntu 22.04, t3.small or larger
   - Open inbound ports `80` (HTTP) and `443` (if you plan to terminate TLS with a reverse proxy) plus `8080/8000` temporarily for testing
2. **Install Docker & Compose Plugin**
   ```sh
   sudo yum update -y
   sudo yum install -y docker
   sudo systemctl enable --now docker
   sudo usermod -aG docker ec2-user
   sudo mkdir -p /usr/local/lib/docker/cli-plugins
   sudo curl -SL https://github.com/docker/compose/releases/download/v2.27.1/docker-compose-linux-x86_64 \
        -o /usr/local/lib/docker/cli-plugins/docker-compose
   sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
   ```
   (Adjust package commands if using Ubuntu.)
3. **Deploy the stack**
   ```sh
   git clone https://github.com/yourusername/transcript-summarization-translation.git
   cd transcript-summarization-translation
   cp backend/.env.example backend/.env   # add your production secrets
   echo "FRONTEND_PORT=80" > .env        # optional: front container listens on host port 80
   docker compose up --build -d
   ```
4. **Expose traffic**
   - Option A: Create an EC2 security-group rule for port 80 and point DNS directly at the instance.
   - Option B: Place the instance behind an Application Load Balancer or CloudFront + ACM for TLS.

For rolling updates, pull latest changes (`git pull`), rebuild the images with `docker compose build`, and restart using `docker compose up -d`.

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
