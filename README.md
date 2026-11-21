# Aetheris AI/ML Portfolio — Full-Stack Monorepo

A high-performance full-stack Computer Science & Artificial Intelligence engineering portfolio. Features a futuristic dark-mode React 19 frontend paired with an asynchronous Python FastAPI backend and MongoDB Atlas persistence.

---

## Architecture Overview

```
portfolio/
├── frontend/                     # React 19 + TypeScript + Vite + Tailwind CSS v4
│   ├── src/
│   │   ├── assets/images/        # High-res project & portrait media
│   │   ├── components/           # Core portfolio views, 3D Canvas visual, tilt cards, modals
│   │   ├── data/                 # Portfolio static data & typed models
│   │   ├── services/             # Axios API client & endpoints
│   │   ├── hooks/                # Custom React hooks
│   │   ├── types/                # TypeScript interfaces & API contracts
│   │   ├── App.tsx               # Viewport controller & responsive frames
│   │   ├── index.css             # Tailwind v4 theme, fonts, animations
│   │   └── main.tsx              # React entry root
│   ├── .env.example              # Frontend environment template
│   ├── package.json              # Bun/Node package configuration
│   ├── tsconfig.json             # TypeScript configuration
│   └── vite.config.ts            # Vite configuration with Tailwind v4 plugin
│
├── backend/                      # Python 3.11+ FastAPI + MongoDB Async Architecture
│   ├── app/
│   │   ├── core/                 # Settings (pydantic-settings) & AsyncMongoClient lifecycle
│   │   ├── models/               # MongoDB document models
│   │   ├── schemas/              # Pydantic v2 request/response schemas
│   │   ├── routes/               # API route endpoints (/health, /portfolio, /contact)
│   │   ├── services/             # Asynchronous business logic & fallback handlers
│   │   └── main.py               # FastAPI entry, CORS middleware, lifespan
│   ├── .env.example              # Backend environment template
│   ├── requirements.txt          # Python dependencies
│   └── README.md                 # Backend documentation
│
├── .gitignore                    # Root ignore rules for node_modules, .venv, .env
└── README.md                     # Monorepo documentation
```

---

## Quick Start & Development Commands

### 1. Frontend Setup (React 19 + Vite)
```bash
cd frontend

# Install dependencies using Bun
bun install

# Configure environment
cp .env.example .env

# Run development server (http://localhost:3000)
bun run dev

# Run production build
bun run build
```

### 2. Backend Setup (FastAPI + Python 3.11)
```bash
cd backend

# Create and activate Python virtual environment
python -m venv .venv

# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Configure environment
cp .env.example .env

# Start FastAPI development server (http://localhost:8000)
uvicorn app.main:app --reload --port 8000
```

---

## Environment Variables

### Frontend (`frontend/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base URL for FastAPI backend endpoints | `http://localhost:8000/api` |

### Backend (`backend/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `MONGODB_URI` | MongoDB Atlas asynchronous connection URI | `""` (runs in dev fallback if omitted) |
| `DATABASE_NAME` | Target MongoDB database name | `portfolio_db` |
| `HOST` | Backend server listen address | `0.0.0.0` |
| `PORT` | Backend server port | `8000` |
| `ENVIRONMENT` | Runtime environment (`development`/`production`) | `development` |
| `CORS_ORIGINS` | JSON list of allowed origins | `["http://localhost:3000", "http://127.0.0.1:3000"]` |

---

## MongoDB Atlas Configuration
The backend connects to MongoDB using PyMongo's official `AsyncMongoClient`.

Collections:
1. `portfolio`: Stores profile data, skills, experience, projects, achievements, and education.
2. `contacts`: Stores incoming messages from the contact form (`name`, `email`, `subject`, `message`, `created_at`).

> **Development Mode**: If `MONGODB_URI` is not provided or the network is offline, the backend automatically operates in safe fallback mode. Requests to `/api/portfolio` return structured mock content, and `/api/contact` logs messages in an in-memory buffer without crashing.

---

## API Endpoints

All endpoints are prefixed with `/api` and documented interactively at `http://localhost:8000/docs`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Server status and non-sensitive database connection state |
| `GET` | `/api/portfolio` | Full portfolio content with safe development fallback |
| `POST` | `/api/contact` | Validates contact form submission and persists to MongoDB |

---

## Design System & Motion Fidelity
- **Palette**: Obsidian canvas (`#080B12`), hairline architectural borders (`#263244`), neon lime accent (`#B6FF5C`), and deep violet accent (`#8B5CF6`).
- **Typography**: Space Grotesk (headings), Inter (body), JetBrains Mono (code & metrics).
- **Interactions**:
  - Pure HTML5 Canvas 2.5D/3D orbital icosahedron with pointer tracking.
  - Perspective card tilt with dynamic radial specular lighting (`TiltCard`).
  - Fluid spring modals with keyboard `Escape` dismissals and backdrop blur.
