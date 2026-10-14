import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/cases")({
  head: () => ({
    meta: [
      { title: "Case History — RadRAG AI" },
      { name: "description", content: "Search and filter previous analyses." },
      { property: "og:title", content: "Case History — RadRAG AI" },
      { property: "og:description", content: "Search and filter previous analyses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <ComingSoon title="Case History" description="Search and filter previous analyses." />,
});
