import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ImageIcon, FileText, BookOpen, ShieldCheck, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { AppShell, PageHeader, MockBadge, EmptyState } from "@/components/AppShell";
import { GroundingBadge, CaseStatusBadge } from "@/components/GroundingBadge";
import { Button } from "@/components/ui/button";
import { getAnalysisResult } from "@/services/api";
import type { Finding, GroundingStatus } from "@/services/types";

export const Route = createFileRoute("/results/$caseId")({
  head: ({ params }) => ({
    meta: [
      { title: `Results ${params.caseId} — RadRAG AI` },
      { name: "description", content: "Evidence-grounded draft radiology report with retrieved images, reports and references." },
      { property: "og:title", content: `Analysis results — RadRAG AI` },
      { property: "og:description", content: "Draft report with per-finding grounding status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Results,
});

function Section({ title, icon: Icon, children, aside }: { title: string; icon: React.ComponentType<{ className?: string }>; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="panel">
      <div className="flex items-center justify-between border-b px-5 py-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold"><Icon className="h-4 w-4 text-teal" />{title}</h2>
        {aside}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function FindingList({ items }: { items: Finding[] }) {
  if (!items.length) return <p className="text-sm text-muted-foreground">None reported.</p>;
  return (
    <ul className="divide-y">
      {items.map((f) => (
        <li key={f.id} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
          <div>
            <p className="text-sm leading-relaxed">{f.text}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {f.source_ids.length ? f.source_ids.map((s) => <span key={s} className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[11px] text-secondary-foreground">{s}</span>) : <span className="text-xs text-muted-foreground">No linked sources</span>}
            </div>
          </div>
          <GroundingBadge status={f.grounding_status} />
        </li>
      ))}
    </ul>
  );
}

function Results() {
  const { caseId } = Route.useParams();
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ["result", caseId], queryFn: () => getAnalysisResult(caseId), retry: false });

  if (isLoading)
    return <AppShell><div className="flex items-center gap-3 py-20 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /> Loading results for {caseId}…</div></AppShell>;

  if (error || !data)
    return (
      <AppShell>
        <PageHeader eyebrow="Analysis results" title={caseId} />
        <EmptyState icon={AlertCircle} title="Results unavailable" description={(error as Error)?.message ?? "No result returned."}>
          <div className="flex gap-2"><Button variant="outline" onClick={() => refetch()}>Retry</Button><Button asChild><Link to="/analysis/new">New analysis</Link></Button></div>
        </EmptyState>
      </AppShell>
    );

  const r = data.draft_report;
  const all = r ? [...r.findings, ...r.impression, ...r.uncertain_findings] : [];
  const count = (s: GroundingStatus) => all.filter((f) => f.grounding_status === s).length;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Analysis results"
        title={data.case_id}
        actions={<div className="flex items-center gap-3">{data.is_mock && <MockBadge />}<CaseStatusBadge status={data.status} /></div>}
      />
      {data.is_mock && (
        <div className="mb-6 rounded-lg border border-warning/30 bg-warning-soft px-4 py-3 text-sm">
          Layout preview using placeholder content. No AI analysis was performed; statuses shown are illustrative only.
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4 space-y-6">
          <Section title="Uploaded image" icon={ImageIcon}>
            <div className="flex aspect-square items-center justify-center rounded-md bg-foreground">
              {data.image_url ? <img src={data.image_url} alt={`Case ${data.case_id}`} className="max-h-full object-contain" /> : <span className="text-xs text-muted-foreground">No image</span>}
            </div>
            {data.clinical_context && <p className="mt-3 text-xs text-muted-foreground">{data.clinical_context}</p>}
          </Section>

          <Section title="Similar images" icon={ImageIcon}>
            {data.similar_images.length ? (
              <div className="grid grid-cols-2 gap-3">
                {data.similar_images.map((im) => (
                  <div key={im.id}>
                    <div className="flex aspect-square items-center justify-center rounded bg-muted">
                      {im.thumbnail_url ? <img src={im.thumbnail_url} alt={im.id} className="h-full w-full rounded object-cover" /> : <ImageIcon className="h-5 w-5 text-muted-foreground" />}
                    </div>
                    <div className="mt-1 flex justify-between font-mono text-[11px] text-muted-foreground"><span>{im.id}</span><span>{im.similarity != null ? im.similarity.toFixed(3) : "—"}</span></div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground">No similar images retrieved.</p>}
          </Section>
        </div>

        <div className="col-span-5 space-y-6">
          <Section title="Draft report" icon={FileText} aside={<span className="text-[11px] text-muted-foreground">Requires radiologist review</span>}>
            {!r ? <p className="text-sm text-muted-foreground">Report not yet generated.</p> : (
              <div className="space-y-6">
                <div><h3 className="eyebrow mb-2">Examination</h3><p className="text-sm">{r.examination}</p></div>
                <div><h3 className="eyebrow mb-2">Findings</h3><FindingList items={r.findings} /></div>
                <div><h3 className="eyebrow mb-2">Impression</h3><FindingList items={r.impression} /></div>
                <div>
                  <h3 className="eyebrow mb-2">Supporting evidence</h3>
                  <div className="flex flex-wrap gap-1.5">{r.supporting_evidence.map((s) => <span key={s} className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[11px]">{s}</span>)}</div>
                </div>
                <div className="rounded-md border border-destructive/20 bg-danger-soft/50 p-4"><h3 className="eyebrow mb-2">Uncertain or unverified findings</h3><FindingList items={r.uncertain_findings} /></div>
              </div>
            )}
          </Section>
        </div>

        <div className="col-span-3 space-y-6">
          <Section title="Evidence grounding" icon={ShieldCheck}>
            {all.length ? (
              <div className="space-y-2.5 text-sm">
                {(["supported", "partially_supported", "unsupported", "not_assessed"] as GroundingStatus[]).map((s) => (
                  <div key={s} className="flex items-center justify-between"><GroundingBadge status={s} /><span className="font-mono">{count(s)}</span></div>
                ))}
                <p className="pt-2 text-xs text-muted-foreground">Statuses are produced by backend verification.</p>
              </div>
            ) : <p className="text-sm text-muted-foreground">No verified statements.</p>}
          </Section>

          <Section title="Retrieved reports" icon={FileText}>
            <div className="space-y-4">
              {data.retrieved_reports.length ? data.retrieved_reports.map((rp) => (
                <div key={rp.id}><div className="mb-1 flex justify-between font-mono text-[11px] text-muted-foreground"><span>{rp.id}</span><span>{rp.source_dataset}</span></div><p className="text-xs leading-relaxed">{rp.excerpt}</p></div>
              )) : <p className="text-sm text-muted-foreground">None retrieved.</p>}
            </div>
          </Section>

          <Section title="Clinical references" icon={BookOpen}>
            <div className="space-y-4">
              {data.clinical_references.length ? data.clinical_references.map((c) => (
                <div key={c.id}><div className="font-mono text-[11px] text-muted-foreground">{c.id}</div><div className="text-sm font-medium">{c.title}</div><div className="text-xs text-muted-foreground">{c.source}</div><p className="mt-1 text-xs leading-relaxed">{c.excerpt}</p></div>
              )) : <p className="text-sm text-muted-foreground">None retrieved.</p>}
            </div>
          </Section>
        </div>
      </div>
    </AppShell>
  );
}
