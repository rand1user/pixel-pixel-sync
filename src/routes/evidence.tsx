import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/evidence")({
  head: () => ({
    meta: [
      { title: "Evidence Explorer — RadRAG AI" },
      { name: "description", content: "Browse retrieved images, reports and clinical references." },
      { property: "og:title", content: "Evidence Explorer — RadRAG AI" },
      { property: "og:description", content: "Browse retrieved images, reports and clinical references." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <ComingSoon title="Evidence Explorer" description="Browse retrieved images, reports and clinical references." />,
});
