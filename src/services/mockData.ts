// MOCK DATA — for UI development only. Not real patients, not real model output,
// not real references. Every object is flagged with is_mock: true and rendered
// with a visible "Mock data" label.
import type { AnalysisResult, CaseSummary } from "./types";

export const MOCK_CASES: CaseSummary[] = [
  { case_id: "MOCK-0001", modality: "Chest X-ray", body_region: "Chest", created_at: "2026-10-12T09:20:00Z", status: "completed", is_mock: true },
  { case_id: "MOCK-0002", modality: "Chest X-ray", body_region: "Chest", created_at: "2026-10-11T14:05:00Z", status: "processing", is_mock: true },
  { case_id: "MOCK-0003", modality: "CT", body_region: "Head", created_at: "2026-10-10T11:42:00Z", status: "failed", is_mock: true },
];

export const MOCK_RESULT: AnalysisResult = {
  case_id: "MOCK-0001",
  status: "completed",
  image_url: null,
  clinical_context: "[Mock] Placeholder clinical context for layout testing.",
  is_mock: true,
  similar_images: [1, 2, 3, 4].map((n) => ({
    id: `MOCK-IMG-${n}`,
    thumbnail_url: null,
    similarity: null,
    source_dataset: "Mock dataset",
  })),
  retrieved_reports: [1, 2].map((n) => ({
    id: `MOCK-RPT-${n}`,
    source_dataset: "Mock dataset",
    excerpt: "[Mock] Placeholder report excerpt. Real retrieved reports will appear here from the backend.",
    score: null,
  })),
  clinical_references: [
    {
      id: "MOCK-REF-1",
      title: "[Mock] Placeholder guideline entry",
      source: "Not a real source",
      excerpt: "Clinical references will be retrieved from a curated guideline corpus by the backend.",
    },
  ],
  draft_report: {
    examination: "[Mock] Examination line placeholder.",
    findings: [
      { id: "F1", text: "[Mock] Example finding linked to evidence.", grounding_status: "supported", source_ids: ["MOCK-RPT-1", "MOCK-IMG-2"] },
      { id: "F2", text: "[Mock] Example finding with partial evidence.", grounding_status: "partially_supported", source_ids: ["MOCK-RPT-2"] },
      { id: "F3", text: "[Mock] Example finding with no linked evidence.", grounding_status: "unsupported", source_ids: [] },
    ],
    impression: [
      { id: "I1", text: "[Mock] Example impression statement.", grounding_status: "not_assessed", source_ids: [] },
    ],
    supporting_evidence: ["MOCK-RPT-1", "MOCK-IMG-2", "MOCK-REF-1"],
    uncertain_findings: [
      { id: "U1", text: "[Mock] Example uncertain finding flagged for review.", grounding_status: "unsupported", source_ids: [] },
    ],
  },
};
