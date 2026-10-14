import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Project — RadRAG AI" },
      { name: "description", content: "Problem, objectives, methodology, architecture and limitations." },
      { property: "og:title", content: "About the Project — RadRAG AI" },
      { property: "og:description", content: "Problem, objectives, methodology, architecture and limitations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <ComingSoon title="About the Project" description="Problem, objectives, methodology, architecture and limitations." />,
});
