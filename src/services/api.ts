// API service layer. All network access to the FastAPI backend goes through here.
// Configure with VITE_API_BASE_URL (e.g. http://localhost:8000). When unset, the
// app runs in "UI development mode" and only returns explicitly labeled mock data.
import { MOCK_CASES, MOCK_RESULT } from "./mockData";
import type { AnalysisRequest, AnalysisResult, CaseSummary } from "./types";

const BASE_URL = (import.meta.env["VITE_API_BASE_URL"] as string | undefined)?.replace(/\/$/, "");

export const isBackendConfigured = () => Boolean(BASE_URL);

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!BASE_URL) throw new ApiError("Backend not configured. Set VITE_API_BASE_URL to connect the FastAPI service.");
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, init);
  } catch {
    throw new ApiError("Could not reach the analysis backend.");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.detail ?? `Request failed (${res.status})`, res.status);
  }
  return res.json() as Promise<T>;
}

// POST /api/analyze — multipart upload, returns created case.
export async function submitAnalysis(req: AnalysisRequest): Promise<{ case_id: string }> {
  const form = new FormData();
  form.append("case_id", req.case_id);
  form.append("image", req.image);
  if (req.clinical_context) form.append("clinical_context", req.clinical_context);
  return request("/api/analyze", { method: "POST", body: form });
}

// GET /api/cases/{id}/result
export async function getAnalysisResult(caseId: string): Promise<AnalysisResult> {
  if (!BASE_URL && caseId.startsWith("MOCK-")) return { ...MOCK_RESULT, case_id: caseId };
  return request(`/api/cases/${encodeURIComponent(caseId)}/result`);
}

// GET /api/cases
export async function listCases(): Promise<CaseSummary[]> {
  if (!BASE_URL) return MOCK_CASES;
  return request("/api/cases");
}

// Future endpoints: GET /api/retrieval/{id}, GET /api/evaluation
