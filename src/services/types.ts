// Shared contract between the frontend and the future FastAPI backend.

export type GroundingStatus = "supported" | "partially_supported" | "unsupported" | "not_assessed";
export type CaseStatus = "pending" | "processing" | "completed" | "failed";

export interface CaseSummary {
  case_id: string;
  modality: string;
  body_region: string;
  created_at: string;
  status: CaseStatus;
  is_mock?: boolean;
}

export interface SimilarImage {
  id: string;
  thumbnail_url: string | null;
  similarity: number | null;
  source_dataset: string;
}

export interface RetrievedReport {
  id: string;
  source_dataset: string;
  excerpt: string;
  score: number | null;
}

export interface ClinicalReference {
  id: string;
  title: string;
  source: string;
  excerpt: string;
  url?: string;
}

export interface Finding {
  id: string;
  text: string;
  grounding_status: GroundingStatus;
  source_ids: string[];
}

export interface DraftReport {
  examination: string;
  findings: Finding[];
  impression: Finding[];
  supporting_evidence: string[];
  uncertain_findings: Finding[];
}

export interface AnalysisResult {
  case_id: string;
  status: CaseStatus;
  image_url: string | null;
  clinical_context?: string;
  similar_images: SimilarImage[];
  retrieved_reports: RetrievedReport[];
  clinical_references: ClinicalReference[];
  draft_report: DraftReport | null;
  is_mock?: boolean;
}

export interface AnalysisRequest {
  case_id: string;
  image: File;
  clinical_context?: string | undefined;
}
