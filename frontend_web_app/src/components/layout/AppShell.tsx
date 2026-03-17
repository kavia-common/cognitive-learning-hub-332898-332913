import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";

/**
 * PUBLIC_INTERFACE
 * AppShell provides the global application layout: sidebar + main content area.
 * This ensures consistent use of Soft Gray theme surfaces, spacing, and typography.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "280px 1fr"
      }}
    >
      <Sidebar />
      <main
        style={{
          minWidth: 0,
          background: "var(--bg)"
        }}
      >
        {children}
      </main>
    </div>
  );
}
