import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ImageIcon, Images, FileText, BookOpen, Layers, PenLine, ShieldCheck, ScanLine, AlertCircle } from "lucide-react";
import { AppShell, PageHeader, MockBadge, EmptyState } from "@/components/AppShell";
import { CaseStatusBadge } from "@/components/GroundingBadge";
import { Button } from "@/components/ui/button";
import { listCases, isBackendConfigured } from "@/services/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — RadRAG AI" },
      { name: "description", content: "Multimodal retrieval-augmented generation for evidence-grounded radiology draft reports." },
      { property: "og:title", content: "RadRAG AI — Multimodal RAG for Radiology" },
      { property: "og:description", content: "Research prototype grounding draft radiology reports in retrieved images, reports and guidelines." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const STEPS = [
  { icon: ImageIcon, label: "Medical Image" },
  { icon: Images, label: "Visual Retrieval" },
  { icon: FileText, label: "Report Retrieval" },
  { icon: BookOpen, label: "Clinical Reference Retrieval" },
  { icon: Layers, label: "Evidence Integration" },
  { icon: PenLine, label: "Draft Report Generation" },
  { icon: ShieldCheck, label: "Evidence Verification" },
];

function Dashboard() {
  const { data, isLoading, error } = useQuery({ queryKey: ["cases"], queryFn: listCases });
  const mock = !isBackendConfigured();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Final-year research project"
        title="Multimodal RAG for Radiology Reports"
        description="Retrieve similar images, prior reports and clinical guidelines, then generate a draft report where every finding is checked against retrieved evidence."
        actions={
          <Button asChild>
            <Link to="/analysis/new"><ScanLine className="h-4 w-4" /> New analysis</Link>
          </Button>
        }
      />

      <div className="mb-8 rounded-lg border border-warning/30 bg-warning-soft px-4 py-3 text-sm text-foreground">
        <strong className="font-semibold">Research draft only.</strong> Generated reports require radiologist review. This is not a clinically validated diagnostic system.
      </div>

      <section className="mb-10">
        <h2 className="eyebrow mb-4">Pipeline</h2>
        <div className="panel grid grid-cols-7 divide-x">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex flex-col gap-3 p-4">
              <div className="flex items-center justify-between">
                <s.icon className="h-5 w-5 text-teal" />
                <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="text-sm font-medium leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-3 gap-6">
        <section className="col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="eyebrow">Recent cases</h2>
            <div className="flex items-center gap-3">
              {mock && <MockBadge />}
              <Link to="/cases" className="text-sm font-medium text-primary hover:underline">View all</Link>
            </div>
          </div>
          {isLoading ? (
            <div className="panel space-y-3 p-5">{[0, 1, 2].map((i) => <div key={i} className="h-10 animate-pulse rounded bg-muted" />)}</div>
          ) : error ? (
            <EmptyState icon={AlertCircle} title="Couldn't load cases" description={(error as Error).message} />
          ) : !data?.length ? (
            <EmptyState icon={ScanLine} title="No cases yet" description="Upload a medical image to create your first analysis." />
          ) : (
            <div className="panel overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left text-xs text-muted-foreground">
                  <tr><th className="px-5 py-3 font-medium">Case ID</th><th className="px-5 py-3 font-medium">Modality</th><th className="px-5 py-3 font-medium">Created</th><th className="px-5 py-3 font-medium">Status</th><th /></tr>
                </thead>
                <tbody className="divide-y">
                  {data.map((c) => (
                    <tr key={c.case_id} className="hover:bg-muted/50">
                      <td className="px-5 py-3 font-mono text-xs">{c.case_id}</td>
                      <td className="px-5 py-3">{c.modality} · {c.body_region}</td>
                      <td className="px-5 py-3 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                      <td className="px-5 py-3"><CaseStatusBadge status={c.status} /></td>
                      <td className="px-5 py-3 text-right">
                        <Link to="/results/$caseId" params={{ caseId: c.case_id }} className="inline-flex items-center gap-1 text-primary hover:underline">Open <ArrowRight className="h-3.5 w-3.5" /></Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <h2 className="eyebrow mb-4">Project status</h2>
          <div className="panel divide-y text-sm">
            {[
              ["Backend", mock ? "Not connected" : "Connected"],
              ["Retrieval index", "Awaiting backend"],
              ["Evaluation results", "No experiments yet"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between px-5 py-3.5"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>
            ))}
          </div>
          <Link to="/about" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">Read methodology <ArrowRight className="h-3.5 w-3.5" /></Link>
        </section>
      </div>
    </AppShell>
  );
}
