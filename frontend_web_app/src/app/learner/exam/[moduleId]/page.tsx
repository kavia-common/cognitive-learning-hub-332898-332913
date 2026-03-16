import React, { Suspense } from "react";
import ExamModeClient from "./ExamModeClient";

export function generateStaticParams() {
  // Static export requires known params at build time.
  // We include the demo module; update to real module IDs once backend-driven routing exists.
  return [{ moduleId: "demo-critical-thinking" }];
}

export default async function ExamModePage(props: {
  params: Promise<{ moduleId: string }>;
}) {
  const params = await props.params;
  return (
    <Suspense fallback={<div className="p-4 text-sm text-gray-600">Loading exam…</div>}>
      <ExamModeClient moduleId={params.moduleId} />
    </Suspense>
  );
}
