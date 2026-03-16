"use client";

import React from "react";

type Variant = "info" | "success" | "error";

const styles: Record<Variant, string> = {
  info: "border-gray-200 bg-gray-50 text-gray-800",
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800",
};

/**
 * PUBLIC_INTERFACE
 * InlineAlert for status/error messages.
 */
export function InlineAlert({
  variant,
  title,
  children,
}: {
  variant: Variant;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={`rounded-md border p-3 ${styles[variant]}`} role="status">
      <div className="font-semibold text-sm">{title}</div>
      {children ? <div className="mt-1 text-sm opacity-90">{children}</div> : null}
    </section>
  );
}
