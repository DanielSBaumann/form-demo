# Form Demo

End-to-end test of the agents pipeline with a full-stack CRUD application.

**Frontend:** Static HTML + Vanilla JS (Cloudflare Pages)  
**Backend:** AWS Lambda + API Gateway  
**Database:** DynamoDB  
**IaC:** Terraform

---

## Quick Start

### Prerequisites

```bash
# Set up credentials
cp .env.example .env
# Edit .env with your values
```

### Development (Local)

```bash
# Frontend (static files, no build step)
cd frontend
python3 -m http.server 8000
# Open http://localhost:8000

# Backend (Lambda mock)
cd ../backend
npm install
npm run dev
```

### Deploy to Sandbox

```bash
bash ../../scripts/deploy.sh sandbox form-demo
```

### Deploy to Production

```bash
bash ../../scripts/deploy.sh prod form-demo
```

---

## Project Structure

```
.
├── frontend/          ← HTML + CSS + JS for Cloudflare Pages
├── backend/           ← Lambda handler (Node.js)
├── infra/             ← Terraform (Lambda + API Gateway + DynamoDB)
├── tests/             ← Integration tests
└── docs/              ← PROJECT_STATE.md, architecture notes
```

---

## API Endpoints

### POST /submit

Submit a new form entry.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello world"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello world",
  "createdAt": "2026-10-13T20:30:00Z"
}
```

### GET /submissions

Retrieve all submissions.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello world",
    "createdAt": "2026-10-13T20:30:00Z"
  }
]
```

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js 20, TypeScript |
| Database | DynamoDB (on-demand) |
| Infrastructure | Terraform, AWS |
| Hosting | Cloudflare Pages (frontend) + AWS Lambda (backend) |
| CI/CD | GitHub Actions |

---

## Status

**Current Phase:** POC (Phase 2)  
**Expected Completion:** 2–3 days  
**Cost:** $0 (free tier)

See `docs/PROJECT_STATE.md` for detailed status.
