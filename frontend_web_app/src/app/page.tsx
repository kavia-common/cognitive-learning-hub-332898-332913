"use client";

import Link from "next/link";
import React from "react";
import { BackendApi } from "@/lib/api/backend";
import { InlineAlert } from "@/components/InlineAlert";

export default function Home() {
  const [health, setHealth] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    BackendApi.health()
      .then((res) => {
        if (!cancelled) setHealth(res.message ?? "OK");
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? "Failed to reach backend");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-14">
        <h1 className="text-3xl font-semibold text-gray-900">
          Cognitive Learning Hub
        </h1>
        <p className="mt-2 text-gray-600">
          Exam-like scoring flow: 1 attempt, 20 minute limit, pass at 80%.
        </p>

        <div className="mt-6 grid gap-4">
          {health ? (
            <InlineAlert variant="success" title="Backend connected">
              Health: {health}
            </InlineAlert>
          ) : error ? (
            <InlineAlert variant="error" title="Backend not reachable">
              {error}. Set <code className="font-mono">NEXT_PUBLIC_BACKEND_API_BASE_URL</code>.
            </InlineAlert>
          ) : (
            <InlineAlert variant="info" title="Checking backend..." />
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/learner"
            className="rounded-lg border border-gray-200 bg-white p-5 hover:bg-gray-50"
          >
            <div className="text-sm text-gray-500">Learner</div>
            <div className="text-lg font-semibold text-gray-900">
              Go to Dashboard
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Browse modules and take exams.
            </div>
          </Link>

          <Link
            href="/admin"
            className="rounded-lg border border-gray-200 bg-white p-5 hover:bg-gray-50"
          >
            <div className="text-sm text-gray-500">Admin</div>
            <div className="text-lg font-semibold text-gray-900">
              Manage Content
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Upload/manage modules and questions (when backend supports it).
            </div>
          </Link>
        </div>

        <div className="mt-8 text-xs text-gray-500">
          Note: Backend currently only implements <code className="font-mono">GET /</code>.
          The UI is ready to integrate once endpoints are added.
        </div>
      </div>
    </main>
  );
}
