"use client";

import React from "react";
import { AppShell } from "@/components/AppShell";

export default function AdminHome() {
  return (
    <AppShell role="admin">
      <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
      <p className="mt-2 text-gray-600">
        Manage modules, questions, and learner progress.
      </p>

      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="text-sm font-semibold text-gray-900">Backend integration status</div>
        <p className="mt-2 text-sm text-gray-700">
          The backend currently exposes only <code className="font-mono">GET /</code>. This Admin UI
          is scaffolded and ready to connect to content-management endpoints once implemented.
        </p>
      </div>
    </AppShell>
  );
}
