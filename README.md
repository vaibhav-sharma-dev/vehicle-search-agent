# AI Vehicle Search

A small full-stack assignment project that turns natural-language vehicle requests into safe database filters.

- `frontend`: React + Vite
- `backend`: Node.js + Express, layered into routes, controllers, services, and repositories
- `database`: PostgreSQL + Sequelize
- `AI`: OpenAI Responses API with Structured Outputs

The AI extracts filters only. It never writes SQL. The repository converts the validated filters into a Sequelize query.

## Run locally

### 1. Start PostgreSQL

If you have Docker:

```bash
docker compose up -d
```

Otherwise, create a local PostgreSQL database named `vehicle_search` and update `DATABASE_URL` in `backend/.env`.

### 2. Start the backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Add your key to `backend/.env` before using AI search:

```env
OPENAI_API_KEY=your_key_here
```

The backend creates the table and inserts the sample catalogue automatically when it starts. It runs at `http://localhost:4000`.

### 3. Start the frontend

In a second terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`.

## API

### Search vehicles

```http
POST /api/v1/vehicles/search
Content-Type: application/json

{
  "query": "diesel automatic SUVs under 15 lakh and below 80k km"
}
```

### Get the complete catalogue

```http
GET /api/v1/vehicles
```

### Health check

```http
GET /api/v1/health
```

All successful responses use `{ success, message, data, meta? }`. All errors use `{ success: false, message, details? }`.

## Backend flow

```text
HTTP route -> controller -> vehicle service -> AI service
                                  |
                                  -> vehicle repository -> Sequelize -> PostgreSQL
```

`OPENAI_MODEL` is configurable in `backend/.env`; the default is `gpt-5-nano`. The implementation uses strict Zod Structured Outputs so the repository receives a known filter shape.

## Checks

```bash
cd backend && npm test
cd frontend && npm run lint && npm run build
```
