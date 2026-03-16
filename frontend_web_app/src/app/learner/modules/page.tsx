"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { BackendApi } from "@/lib/api/backend";
import { InlineAlert } from "@/components/InlineAlert";
import type { ModuleSummary } from "@/lib/domain/types";

const demoModules: ModuleSummary[] = [
  {
    id: "demo-critical-thinking",
    title: "Critical Thinking Fundamentals (Demo)",
    description: "Practice reasoning, bias spotting, and structured analysis.",
    questionCount: 10,
  },
];

export default function LearnerModules() {
  const [modules, setModules] = React.useState<ModuleSummary[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    BackendApi.listModules()
      .then((m) => {
        if (!cancelled) setModules(m);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e?.message ?? "Failed to load modules");
          setModules(demoModules);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppShell role="learner">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Modules</h2>
          <p className="mt-1 text-sm text-gray-600">
            Choose a module to start Exam Mode.
          </p>
        </div>
      </div>

      {error ? (
        <div className="mt-4">
          <InlineAlert variant="info" title="Backend modules not available yet">
            Showing demo module. ({error})
          </InlineAlert>
        </div>
      ) : null}

      <div className="mt-6 grid gap-3">
        {(modules ?? []).map((m) => (
          <div key={m.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-base font-semibold text-gray-900">{m.title}</div>
                {m.description ? (
                  <div className="mt-1 text-sm text-gray-600">{m.description}</div>
                ) : null}
                <div className="mt-2 text-xs text-gray-500">
                  Questions: {m.questionCount}
                </div>
              </div>
              <Link
                href={`/learner/modules/${encodeURIComponent(m.id)}`}
                className="shrink-0 rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
