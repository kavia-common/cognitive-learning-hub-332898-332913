"use client";

import React from "react";
import { AppShell } from "@/components/AppShell";
import { InlineAlert } from "@/components/InlineAlert";
import { BackendApi } from "@/lib/api/backend";

export default function AdminModules() {
  const [status, setStatus] = React.useState<string | null>(null);

  async function onRefresh() {
    setStatus(null);
    try {
      await BackendApi.listModules();
      setStatus("Loaded modules (unexpected: backend endpoint exists).");
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : typeof e === "string"
            ? e
            : "Not available yet.";
      setStatus(msg);
    }
  }

  return (
    <AppShell role="admin">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Manage Modules</h2>
          <p className="mt-1 text-sm text-gray-600">
            Create/edit modules and questions (pending backend endpoints).
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Refresh
        </button>
      </div>

      {status ? (
        <div className="mt-4">
          <InlineAlert variant="info" title="Status">
            {status}
          </InlineAlert>
        </div>
      ) : (
        <div className="mt-4">
          <InlineAlert variant="info" title="No backend endpoints yet">
            Implement admin content endpoints in backend to enable this screen.
          </InlineAlert>
        </div>
      )}

      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="text-sm font-semibold text-gray-900">Planned endpoints</div>
        <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>List/create/update modules</li>
          <li>Generate/import questions from PDFs</li>
          <li>Publish module exams (question sets, pass threshold)</li>
        </ul>
      </div>
    </AppShell>
  );
}
