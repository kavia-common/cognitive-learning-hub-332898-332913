import LearnerModuleDetailClient from "./LearnerModuleDetailClient";

export function generateStaticParams() {
  // Static export requires known params at build time.
  // We include the demo module; update to real module IDs once backend provides them.
  return [{ moduleId: "demo-critical-thinking" }];
}

export default async function LearnerModuleDetailPage(props: {
  params: Promise<{ moduleId: string }>;
}) {
  const params = await props.params;
  return <LearnerModuleDetailClient moduleId={params.moduleId} />;
}
