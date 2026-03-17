import type { CSSProperties, ReactNode } from "react";

/**
 * PUBLIC_INTERFACE
 * CardSurface is a low-level surface wrapper implementing the app's consistent
 * Soft Gray surface, border, and shadow styles.
 */
export function CardSurface({
  children,
  style
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <section className="ui-surface" style={style}>
      {children}
    </section>
  );
}
