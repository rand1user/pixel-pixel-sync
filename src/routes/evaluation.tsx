import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/evaluation")({
  head: () => ({
    meta: [
      { title: "Research Evaluation — RadRAG AI" },
      { name: "description", content: "Retrieval and report-quality metrics across baseline, text-only, image-only and multimodal RAG." },
      { property: "og:title", content: "Research Evaluation — RadRAG AI" },
      { property: "og:description", content: "Retrieval and report-quality metrics across baseline, text-only, image-only and multimodal RAG." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <ComingSoon title="Research Evaluation" description="Retrieval and report-quality metrics across baseline, text-only, image-only and multimodal RAG." />,
});
