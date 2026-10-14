import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LayoutDashboard, ScanLine, History, Library, BarChart3, Info, Activity } from "lucide-react";
import { isBackendConfigured } from "@/services/api";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analysis/new", label: "New Analysis", icon: ScanLine },
  { to: "/cases", label: "Case History", icon: History },
  { to: "/evidence", label: "Evidence Explorer", icon: Library },
  { to: "/evaluation", label: "Research Evaluation", icon: BarChart3 },
  { to: "/about", label: "About the Project", icon: Info },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const connected = isBackendConfigured();
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-2.5 border-b border-sidebar-border px-6 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-teal">
            <Activity className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <div className="font-display text-lg font-semibold leading-none">RadRAG AI</div>
            <div className="mt-1 text-[11px] text-sidebar-muted">Multimodal RAG research</div>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
              activeProps={{ className: "bg-sidebar-accent !text-sidebar-foreground font-medium" }}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-sidebar-border px-6 py-4 text-xs">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${connected ? "bg-success" : "bg-warning"}`} />
            <span className="text-sidebar-muted">{connected ? "Backend connected" : "UI development mode"}</span>
          </div>
          <p className="mt-2 leading-relaxed text-sidebar-muted">Research prototype. Not for clinical use.</p>
        </div>
      </aside>
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-7xl px-10 py-10">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6 border-b pb-6">
      <div>
        {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
        <h1 className="font-display text-3xl font-semibold text-foreground">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

export function MockBadge() {
  return (
    <span className="inline-flex items-center rounded border border-warning/40 bg-warning-soft px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-warning">
      Mock data
    </span>
  );
}

export function EmptyState({ icon: Icon, title, description, children }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string; children?: ReactNode }) {
  return (
    <div className="panel flex flex-col items-center px-6 py-14 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-soft">
        <Icon className="h-5 w-5 text-teal" />
      </div>
      <h3 className="mt-4 font-medium text-foreground">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
