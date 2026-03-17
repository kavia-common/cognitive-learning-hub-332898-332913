import { CardSurface } from "@/components/ui/CardSurface";

/**
 * PUBLIC_INTERFACE
 * Topbar provides a consistent page header area (title/subtitle) styled with theme tokens.
 */
export function Topbar({
  title,
  subtitle
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <CardSurface
      style={{
        padding: 16,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12
      }}
    >
      <div style={{ display: "grid", gap: 4 }}>
        <h1 style={{ margin: 0 }}>{title}</h1>
        {subtitle ? (
          <p className="ui-muted" style={{ margin: 0 }}>
            {subtitle}
          </p>
        ) : null}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span className="ui-pill">v0.1</span>
      </div>
    </CardSurface>
  );
}
