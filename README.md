# RadRAG AI — Frontend

Research prototype UI for Multimodal RAG for Radiology Reports. Not for clinical use.

## Setup
```
bun install
bun run dev
```
## Connecting the FastAPI backend
Create `.env` with `VITE_API_BASE_URL=http://localhost:8000`. All calls live in `src/services/api.ts`:
- `POST /api/analyze` (multipart: case_id, image, clinical_context)
- `GET /api/cases`
- `GET /api/cases/{id}/result`
- planned: `GET /api/retrieval/{id}`, `GET /api/evaluation`

Response shapes: `src/services/types.ts`. Without a backend the app shows only data labeled "Mock data".
