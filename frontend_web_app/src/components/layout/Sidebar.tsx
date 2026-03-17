import Link from "next/link";

/**
 * PUBLIC_INTERFACE
 * Sidebar renders a consistent navigation surface using Soft Gray theme tokens.
 * This is a styling/layout component and does not implement product-specific navigation logic.
 */
export function Sidebar() {
  return (
    <aside
      className="ui-surface"
      style={{
        borderRadius: 0,
        borderLeft: "none",
        borderTop: "none",
        borderBottom: "none",
        height: "100vh",
        position: "sticky",
        top: 0,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 16
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontWeight: 750, letterSpacing: "-0.02em" }}>
          Cognitive Learning Hub
        </div>
        <div className="ui-muted" style={{ fontSize: 13 }}>
          Soft Gray UI
        </div>
      </div>

      <nav aria-label="Primary" style={{ display: "grid", gap: 8 }}>
        <SidebarLink href="/" label="Dashboard" />
        <SidebarLink href="/modules" label="Modules" disabled />
        <SidebarLink href="/progress" label="Progress" disabled />
        <SidebarLink href="/admin" label="Admin" disabled />
      </nav>

      <div style={{ marginTop: "auto" }} className="ui-muted">
        <div style={{ fontSize: 12 }}>
          Styling upgrade: tokens, spacing, and typography.
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  label,
  disabled
}: {
  href: string;
  label: string;
  disabled?: boolean;
}) {
  const styles: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    borderRadius: 12,
    padding: "10px 12px",
    border: "1px solid var(--border)",
    background: disabled ? "rgba(17, 24, 39, 0.02)" : "var(--surface)",
    color: disabled ? "rgba(17, 24, 39, 0.35)" : "var(--text)",
    pointerEvents: disabled ? "none" : "auto"
  };

  return (
    <Link href={href} style={styles} className="ui-focus-ring">
      <span style={{ fontWeight: 600 }}>{label}</span>
      {disabled ? (
        <span style={{ marginLeft: "auto" }} className="ui-pill">
          soon
        </span>
      ) : null}
    </Link>
  );
}
