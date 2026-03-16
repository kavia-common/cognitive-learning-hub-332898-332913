import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-xl px-4 py-16">
        <section className="rounded-lg border border-gray-200 bg-white p-6" role="alert" aria-live="assertive">
          <header>
            <h1 className="text-2xl font-semibold text-gray-900">404 – Page Not Found</h1>
            <p className="mt-2 text-gray-600">The page you’re looking for doesn’t exist.</p>
          </header>

          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Go Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
