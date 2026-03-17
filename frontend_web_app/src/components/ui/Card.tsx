import type { ReactNode } from "react";
import { CardSurface } from "@/components/ui/CardSurface";

/**
 * PUBLIC_INTERFACE
 * Card is a standard content container using Soft Gray theme spacing and typography.
 */
export function Card({
  title,
  description,
  right,
  children
}: {
  title: string;
  description?: string;
  right?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <CardSurface style={{ padding: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ display: "grid", gap: 6, flex: 1, minWidth: 0 }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          {description ? (
            <p className="ui-muted" style={{ margin: 0 }}>
              {description}
            </p>
          ) : null}
        </div>
        {right ? <div>{right}</div> : null}
      </div>

      {children ? <div style={{ marginTop: 12 }}>{children}</div> : null}
    </CardSurface>
  );
}
