# Aetheris AI/ML Portfolio Backend (FastAPI + MongoDB)

High-performance asynchronous Python backend providing RESTful APIs for the portfolio application.

## Tech Stack
- **FastAPI**: Modern, high-performance web framework for Python.
- **Uvicorn**: ASGI web server implementation.
- **PyMongo (AsyncMongoClient)**: Native asynchronous MongoDB Atlas client.
- **Pydantic v2**: High-speed data validation and settings management.

## Project Structure
```
backend/
├── app/
│   ├── core/
│   │   ├── config.py       # Pydantic BaseSettings environment loader
│   │   └── database.py     # AsyncMongoClient connection & lifecycle
│   ├── models/
│   │   └── contact.py      # MongoDB document model
│   ├── schemas/
│   │   ├── contact.py      # Pydantic request/response validation
│   │   └── portfolio.py    # Portfolio data transfer schemas
│   ├── routes/
│   │   ├── health.py       # GET /api/health
│   │   ├── portfolio.py    # GET /api/portfolio
│   │   └── contact.py      # POST /api/contact
│   ├── services/
│   │   ├── contact_service.py   # Business logic for contact persistence
│   │   └── portfolio_service.py # Portfolio fetching with fallback
│   └── main.py             # FastAPI app initialization, CORS, lifespan
├── .env.example
├── requirements.txt
├── .gitignore
└── README.md
```

## Setup & Running

### 1. Create and Activate Virtual Environment
```bash
python -m venv .venv

# On Windows (PowerShell):
.venv\Scripts\Activate.ps1

# On macOS/Linux:
source .venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your MongoDB Atlas connection string:
```bash
cp .env.example .env
```
Example `.env`:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=portfolio_db
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development
CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000","http://localhost:5173","http://127.0.0.1:5173"]
```
*Note: If `MONGODB_URI` is omitted or offline, the server gracefully runs in development fallback mode with mock data and in-memory contact logging.*

### 4. Run Development Server
```bash
uvicorn app.main:app --reload --port 8000
```

### 5. API Documentation
Once running, open your browser to:
- Interactive Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- Interactive ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)
