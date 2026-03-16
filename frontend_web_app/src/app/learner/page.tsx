"use client";

import React from "react";
import { AppShell } from "@/components/AppShell";

export default function LearnerHome() {
  return (
    <AppShell role="learner">
      <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
      <p className="mt-2 text-gray-600">
        Select a module to study and take the exam when ready.
      </p>

      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="text-sm font-semibold text-gray-900">Exam Mode Rules</div>
        <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>1 attempt only per module</li>
          <li>20 minute countdown timer starts when you begin</li>
          <li>Pass threshold is 80%</li>
        </ul>
      </div>
    </AppShell>
  );
}
