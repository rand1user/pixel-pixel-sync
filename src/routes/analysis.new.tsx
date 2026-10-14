import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { UploadCloud, X, Loader2, AlertCircle } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { submitAnalysis, isBackendConfigured } from "@/services/api";

export const Route = createFileRoute("/analysis/new")({
  head: () => ({
    meta: [
      { title: "New Analysis — RadRAG AI" },
      { name: "description", content: "Upload a medical image to start evidence-grounded draft report generation." },
      { property: "og:title", content: "New Analysis — RadRAG AI" },
      { property: "og:description", content: "Upload a medical image with optional clinical context." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NewAnalysis,
});

const ACCEPT = ["image/png", "image/jpeg", "image/dicom", "application/dicom"];

function NewAnalysis() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caseId, setCaseId] = useState("");
  const [context, setContext] = useState("");
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCaseId(`CASE-${Date.now().toString(36).toUpperCase()}`);
  }, []);

  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const pick = (f?: File | null) => {
    setError(null);
    if (!f) return;
    if (!ACCEPT.includes(f.type) && !f.name.toLowerCase().endsWith(".dcm")) return setError("Unsupported file type. Use PNG, JPEG or DICOM.");
    if (f.size === 0) return setError("The selected file is empty.");
    if (f.size > 50 * 1024 * 1024) return setError("File exceeds the 50 MB limit.");
    setFile(f);
  };

  const submit = async () => {
    if (!file || !caseId.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await submitAnalysis({ case_id: caseId.trim(), image: file, clinical_context: context.trim() || undefined });
      navigate({ to: "/results/$caseId", params: { caseId: res.case_id } });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <PageHeader eyebrow="Step 1" title="New analysis" description="Upload a single medical image. The backend will retrieve evidence and generate a draft report for review." />

      {!isBackendConfigured() && (
        <div className="mb-6 flex gap-3 rounded-lg border bg-muted px-4 py-3 text-sm">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <span>The analysis backend is not connected, so submissions will not run. No analysis is simulated.</span>
        </div>
      )}

      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-3">
          <label className="eyebrow mb-3 block">Medical image</label>
          {file ? (
            <div className="panel overflow-hidden">
              <div className="flex aspect-[4/3] items-center justify-center bg-foreground">
                {preview ? <img src={preview} alt="Uploaded scan preview" className="max-h-full max-w-full object-contain" /> : <span className="text-sm text-muted-foreground">Preview unavailable for DICOM</span>}
              </div>
              <div className="flex items-center justify-between border-t px-4 py-3 text-sm">
                <div className="min-w-0">
                  <div className="truncate font-medium">{file.name}</div>
                  <div className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB · {file.type || "DICOM"}</div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setFile(null)}><X className="h-4 w-4" /> Remove</Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files[0]); }}
              className={`flex aspect-[4/3] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${dragging ? "border-teal bg-teal-soft" : "border-border bg-muted hover:border-teal"}`}
            >
              <UploadCloud className="h-9 w-9 text-teal" />
              <div className="mt-3 font-medium">Drop an image or click to browse</div>
              <div className="mt-1 text-xs text-muted-foreground">PNG, JPEG or DICOM · up to 50 MB</div>
            </button>
          )}
          <input ref={inputRef} type="file" accept=".png,.jpg,.jpeg,.dcm" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
        </div>

        <div className="col-span-2 space-y-6">
          <div>
            <label htmlFor="caseId" className="eyebrow mb-2 block">Case ID</label>
            <input id="caseId" value={caseId} onChange={(e) => setCaseId(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label htmlFor="ctx" className="eyebrow mb-2 block">Clinical context <span className="normal-case tracking-normal text-muted-foreground">(optional)</span></label>
            <textarea id="ctx" rows={6} value={context} onChange={(e) => setContext(e.target.value)} placeholder="e.g. indication, relevant history. Do not include identifiable patient information." className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          {error && <div className="flex gap-2 rounded-md bg-danger-soft px-3 py-2 text-sm text-destructive"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
          <Button className="w-full" size="lg" disabled={!file || !caseId.trim() || submitting} onClick={submit}>
            {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Run analysis"}
          </Button>
          <p className="text-xs leading-relaxed text-muted-foreground">Output is a research draft requiring radiologist review.</p>
        </div>
      </div>
    </AppShell>
  );
}
