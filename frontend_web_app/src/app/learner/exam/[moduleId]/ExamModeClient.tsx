"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { InlineAlert } from "@/components/InlineAlert";
import { ExamAttemptFlow, ExamAttemptFlowError } from "@/lib/flows/examAttemptFlow";
import type { ExamConfig, Question } from "@/lib/domain/types";
import { BackendApi } from "@/lib/api/backend";
import { computeExamResult } from "@/lib/domain/scoring";
import { ApiError } from "@/lib/api/errors";

const demoQuestions: Question[] = [
  {
    id: "q1",
    prompt: "Which is a cognitive bias?",
    allowMultiple: false,
    choices: [
      { id: "a", text: "Confirmation bias" },
      { id: "b", text: "TCP handshake" },
      { id: "c", text: "Git rebase" },
      { id: "d", text: "DNS record" },
    ],
  },
  {
    id: "q2",
    prompt: "Select all that are good critical thinking practices.",
    allowMultiple: true,
    choices: [
      { id: "a", text: "Seek disconfirming evidence" },
      { id: "b", text: "Assume first idea is best" },
      { id: "c", text: "Define terms and constraints" },
      { id: "d", text: "Ignore base rates" },
    ],
  },
];

const demoAnswerKey: Record<string, string[]> = {
  q1: ["a"],
  q2: ["a", "c"],
};

function formatMMSS(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * PUBLIC_INTERFACE
 * Client-side Exam Mode UI (interactive).
 *
 * Contract:
 * - Input: moduleId param (URL-encoded)
 * - Output: exam UI with countdown, answer persistence, and submission
 * - Side effects: localStorage via ExamAttemptFlow; optional backend calls via BackendApi
 */
export default function ExamModeClient({ moduleId }: { moduleId: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const decodedModuleId = decodeURIComponent(moduleId);
  const startRequested = searchParams.get("start") === "1";

  const [config, setConfig] = React.useState<ExamConfig | null>(null);
  const [questions, setQuestions] = React.useState<Question[] | null>(null);
  const [activeIdx, setActiveIdx] = React.useState(0);

  const [error, setError] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [attemptStatus, setAttemptStatus] = React.useState<
    ReturnType<typeof ExamAttemptFlow.getAttempt> | null
  >(null);

  const [remainingSeconds, setRemainingSeconds] =
    React.useState<number>(20 * 60);

  // Load config + questions
  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const cfg = await BackendApi.getModuleExamConfig(decodedModuleId);
        let qs: Question[];
        try {
          qs = await BackendApi.getExamQuestions(decodedModuleId);
        } catch {
          // Demo fallback if backend not implemented.
          qs = demoQuestions;
        }

        if (!cancelled) {
          setConfig(cfg);
          setQuestions(qs);
        }
      } catch (e: unknown) {
        const msg =
          e instanceof Error
            ? e.message
            : typeof e === "string"
              ? e
              : "Failed to load exam";
        if (!cancelled) setError(msg);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [decodedModuleId]);

  // Start/resume attempt when ready
  React.useEffect(() => {
    if (!config || !questions) return;

    try {
      const existing = ExamAttemptFlow.getAttempt(decodedModuleId);

      if (existing?.status === "submitted" || existing?.status === "expired") {
        setAttemptStatus(existing);
        router.replace(
          `/learner/modules/${encodeURIComponent(decodedModuleId)}`
        );
        return;
      }

      const shouldStart = startRequested || existing?.status === "in_progress";
      if (!shouldStart) {
        router.replace(
          `/learner/modules/${encodeURIComponent(decodedModuleId)}`
        );
        return;
      }

      const created = ExamAttemptFlow.createAttempt({ config, questions });
      setAttemptStatus(created);
      setRemainingSeconds(ExamAttemptFlow.getRemainingSeconds(created));
    } catch (e: unknown) {
      if (e instanceof ExamAttemptFlowError) {
        setError(e.message);
      } else {
        setError("Unable to start exam.");
      }
    }
  }, [config, questions, decodedModuleId, startRequested, router]);

  // Timer tick
  React.useEffect(() => {
    if (!attemptStatus || attemptStatus.status !== "in_progress") return;

    const id = window.setInterval(() => {
      const refreshed = ExamAttemptFlow.getAttempt(decodedModuleId);
      if (!refreshed) return;
      setAttemptStatus(refreshed);
      setRemainingSeconds(ExamAttemptFlow.getRemainingSeconds(refreshed));
      if (refreshed.status !== "in_progress") {
        // Expired
        router.replace(
          `/learner/modules/${encodeURIComponent(decodedModuleId)}`
        );
      }
    }, 1000);

    return () => window.clearInterval(id);
  }, [attemptStatus, decodedModuleId, router]);

  const attempt = attemptStatus;
  const selectedByQid = attempt?.answersByQuestionId ?? {};
  const currentQuestion = questions?.[activeIdx] ?? null;

  function onToggleChoice(choiceId: string) {
    if (!attempt || attempt.status !== "in_progress" || !currentQuestion) return;

    const existing = selectedByQid[currentQuestion.id] ?? [];
    const next = currentQuestion.allowMultiple
      ? existing.includes(choiceId)
        ? existing.filter((c) => c !== choiceId)
        : [...existing, choiceId]
      : [choiceId];

    const updated = ExamAttemptFlow.updateAnswer(
      decodedModuleId,
      currentQuestion.id,
      next
    );
    setAttemptStatus(updated);
  }

  async function onSubmit() {
    if (!attempt || !questions || !config) return;
    setSubmitError(null);

    const refreshed = ExamAttemptFlow.getAttempt(decodedModuleId);
    if (!refreshed || refreshed.status !== "in_progress") {
      setSubmitError("Attempt is no longer active.");
      return;
    }

    // Try backend submission first; if not implemented, compute demo score locally.
    try {
      const submission = await BackendApi.submitExamAttempt({
        moduleId: decodedModuleId,
        attemptId: refreshed.attemptId,
        answersByQuestionId: refreshed.answersByQuestionId,
      });

      const result = computeExamResult({
        attemptId: refreshed.attemptId,
        moduleId: decodedModuleId,
        submittedAtMs: Date.now(),
        passThresholdPct: config.passThresholdPct,
        questions,
        answersByQuestionId: refreshed.answersByQuestionId,
        correctChoiceIdsByQuestionId: submission.correctChoiceIdsByQuestionId,
      });

      ExamAttemptFlow.submitAttempt(decodedModuleId, result);
      router.replace(`/learner/modules/${encodeURIComponent(decodedModuleId)}`);
    } catch (e: unknown) {
      if (e instanceof ApiError && e.code === "NOT_IMPLEMENTED") {
        const result = computeExamResult({
          attemptId: refreshed.attemptId,
          moduleId: decodedModuleId,
          submittedAtMs: Date.now(),
          passThresholdPct: config.passThresholdPct,
          questions,
          answersByQuestionId: refreshed.answersByQuestionId,
          correctChoiceIdsByQuestionId: demoAnswerKey,
        });
        ExamAttemptFlow.submitAttempt(decodedModuleId, result);
        router.replace(`/learner/modules/${encodeURIComponent(decodedModuleId)}`);
        return;
      }
      const msg =
        e instanceof Error ? e.message : typeof e === "string" ? e : "Failed to submit.";
      setSubmitError(msg);
    }
  }

  return (
    <AppShell role="learner">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Exam Mode</h2>
          <p className="mt-1 text-sm text-gray-600">
            Module: <code className="font-mono">{decodedModuleId}</code>
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-right">
          <div className="text-xs text-gray-500">Time remaining</div>
          <div className="text-lg font-semibold text-gray-900 tabular-nums">
            {formatMMSS(remainingSeconds)}
          </div>
        </div>
      </div>

      {error ? (
        <div className="mt-4">
          <InlineAlert variant="error" title="Cannot start exam">
            {error}
          </InlineAlert>
        </div>
      ) : null}

      {submitError ? (
        <div className="mt-4">
          <InlineAlert variant="error" title="Submission failed">
            {submitError}
          </InlineAlert>
        </div>
      ) : null}

      {!attempt || !questions || !currentQuestion ? (
        <div className="mt-6">
          <InlineAlert variant="info" title="Loading exam..." />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
          <aside className="rounded-lg border border-gray-200 bg-white p-3">
            <div className="text-xs font-semibold text-gray-500 px-2 py-2">
              Questions
            </div>
            <div className="grid grid-cols-5 lg:grid-cols-2 gap-2">
              {questions.map((q, idx) => {
                const answered =
                  (attempt.answersByQuestionId[q.id] ?? []).length > 0;
                const active = idx === activeIdx;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    className={[
                      "rounded-md border px-2 py-2 text-xs font-medium",
                      active
                        ? "border-gray-700 bg-gray-700 text-white"
                        : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50",
                      answered ? "" : "opacity-80",
                    ].join(" ")}
                    aria-current={active ? "true" : "false"}
                  >
                    Q{idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Attempt limit: 1
              <br />
              Pass: {config?.passThresholdPct ?? 80}%
            </div>
          </aside>

          <section>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="text-sm text-gray-500">
                Question {activeIdx + 1} of {questions.length}
              </div>
              <div className="mt-2 text-base font-semibold text-gray-900">
                {currentQuestion.prompt}
              </div>

              <div className="mt-4 space-y-2">
                {currentQuestion.choices.map((c) => {
                  const selected = (
                    selectedByQid[currentQuestion.id] ?? []
                  ).includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onToggleChoice(c.id)}
                      className={[
                        "w-full text-left rounded-md border px-3 py-3 text-sm",
                        selected
                          ? "border-green-300 bg-green-50 text-green-900"
                          : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50",
                      ].join(" ")}
                      aria-pressed={selected}
                    >
                      {c.text}
                      {selected ? (
                        <span className="sr-only"> (selected)</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
                    className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    disabled={activeIdx === 0}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveIdx((i) => Math.min(questions.length - 1, i + 1))
                    }
                    className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    disabled={activeIdx === questions.length - 1}
                  >
                    Next
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onSubmit}
                  className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                >
                  Submit Exam
                </button>
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-500">
              Note: In demo mode, scoring uses a local answer key. When backend
              endpoints are added, the same flow will submit answers and compute
              score from server-provided keys.
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
}
