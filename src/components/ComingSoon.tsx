import { Construction } from "lucide-react";
import { AppShell, PageHeader, EmptyState } from "./AppShell";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <AppShell>
      <PageHeader title={title} description={description} />
      <EmptyState icon={Construction} title="Scheduled for the next phase" description="The core workflow is built first. This page will be implemented once the dashboard, upload and results pages are reviewed." />
    </AppShell>
  );
}
