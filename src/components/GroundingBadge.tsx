import type { CaseStatus, GroundingStatus } from "@/services/types";

const G: Record<GroundingStatus, { label: string; cls: string }> = {
  supported: { label: "Supported", cls: "bg-success-soft text-success border-success/30" },
  partially_supported: { label: "Partially Supported", cls: "bg-warning-soft text-warning border-warning/30" },
  unsupported: { label: "Unsupported", cls: "bg-danger-soft text-destructive border-destructive/30" },
  not_assessed: { label: "Not Assessed", cls: "bg-muted text-muted-foreground border-border" },
};

export function GroundingBadge({ status }: { status: GroundingStatus }) {
  const s = G[status];
  return <span className={`inline-flex shrink-0 items-center rounded border px-2 py-0.5 text-[11px] font-medium ${s.cls}`}>{s.label}</span>;
}

const C: Record<CaseStatus, string> = {
  completed: "bg-success-soft text-success",
  processing: "bg-teal-soft text-teal",
  pending: "bg-muted text-muted-foreground",
  failed: "bg-danger-soft text-destructive",
};

export function CaseStatusBadge({ status }: { status: CaseStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${C[status]}`}>{status}</span>;
}
