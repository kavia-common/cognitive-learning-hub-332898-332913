"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ExamAttemptFlow } from "@/lib/flows/examAttemptFlow";
import { InlineAlert } from "@/components/InlineAlert";

/**
 * PUBLIC_INTERFACE
 * Client-side learner module detail UI.
 *
 * Contract:
 * - Input: moduleId param (URL-encoded in route)
 * - Output: rendered module detail + exam start/resume/locked actions
 * - Side effects: reads localStorage via ExamAttemptFlow
 */
export default function LearnerModuleDetailClient({
  moduleId,
}: {
  moduleId: string;
}) {
  const decodedModuleId = decodeURIComponent(moduleId);

  const attempt = React.useMemo(
    () => ExamAttemptFlow.getAttempt(decodedModuleId),
    [decodedModuleId]
  );
  const result = React.useMemo(
    () => ExamAttemptFlow.getResult(decodedModuleId),
    [decodedModuleId]
  );

  return (
    <AppShell role="learner">
      <h2 className="text-xl font-semibold text-gray-900">Module</h2>
      <p className="mt-1 text-sm text-gray-600">
        Module ID: <code className="font-mono">{decodedModuleId}</code>
      </p>

      {result ? (
        <div className="mt-4">
          <InlineAlert
            variant={result.passed ? "success" : "error"}
            title={result.passed ? "Passed" : "Not Passed"}
          >
            Score: {result.scorePct}% ({result.correctCount}/{result.totalCount})
          </InlineAlert>
        </div>
      ) : attempt?.status === "expired" ? (
        <div className="mt-4">
          <InlineAlert variant="error" title="Attempt expired">
            Your 20 minutes elapsed. This exam allows only 1 attempt.
          </InlineAlert>
        </div>
      ) : attempt?.status === "submitted" ? (
        <div className="mt-4">
          <InlineAlert variant="info" title="Attempt submitted">
            Your attempt is completed. This exam allows only 1 attempt.
          </InlineAlert>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {attempt && attempt.status === "in_progress" ? (
          <Link
            href={`/learner/exam/${encodeURIComponent(decodedModuleId)}`}
            className="rounded-md bg-[var(--color-accent)] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Resume Exam
          </Link>
        ) : result ||
          attempt?.status === "submitted" ||
          attempt?.status === "expired" ? (
          <button
            type="button"
            className="rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-500 cursor-not-allowed"
            disabled
          >
            Start Exam (Locked)
          </button>
        ) : (
          <Link
            href={`/learner/exam/${encodeURIComponent(decodedModuleId)}?start=1`}
            className="rounded-md bg-[var(--color-accent)] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Start Exam
          </Link>
        )}

        <Link
          href="/learner/modules"
          className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back to Modules
        </Link>
      </div>

      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="text-sm font-semibold text-gray-900">
          How Exam Mode works
        </div>
        <p className="mt-2 text-sm text-gray-700">
          When you start, a 20 minute timer begins. Your selections are saved
          locally so refreshes won’t lose progress. Submission is final and
          counts as your single attempt.
        </p>
      </div>
    </AppShell>
  );
}
