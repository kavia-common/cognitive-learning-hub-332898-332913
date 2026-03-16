"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function NavItem({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={[
        "block rounded-md px-3 py-2 text-sm",
        active
          ? "bg-gray-200 text-gray-900 font-medium"
          : "text-gray-700 hover:bg-gray-100",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

/**
 * PUBLIC_INTERFACE
 * AppShell layout wrapper for authenticated areas (learner/admin).
 *
 * Contract:
 * - Inputs: role + children
 * - Outputs: consistent UI chrome with sidebar navigation
 * - Side effects: none
 */
export function AppShell({
  role,
  children,
}: {
  role: "learner" | "admin";
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-gray-700" aria-hidden="true" />
            <div>
              <div className="text-sm text-gray-500">Cognitive Learning Hub</div>
              <div className="text-base font-semibold text-gray-900">
                {role === "admin" ? "Admin Console" : "Learner Dashboard"}
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-2 text-sm">
            <Link className="text-gray-700 hover:text-gray-900" href="/">
              Home
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        <aside className="rounded-lg border border-[var(--color-border)] bg-white p-3">
          <div className="text-xs font-semibold text-gray-500 px-3 py-2">
            Navigation
          </div>
          {role === "learner" ? (
            <div className="space-y-1">
              <NavItem href="/learner" label="Overview" />
              <NavItem href="/learner/modules" label="Modules" />
            </div>
          ) : (
            <div className="space-y-1">
              <NavItem href="/admin" label="Overview" />
              <NavItem href="/admin/modules" label="Manage Modules" />
            </div>
          )}
          <div className="mt-4 text-xs text-gray-500 px-3">
            Exam rules: 1 attempt, 20 minutes, pass at 80%.
          </div>
        </aside>

        <main className="rounded-lg border border-[var(--color-border)] bg-white p-5">
          {children}
        </main>
      </div>
    </div>
  );
}
