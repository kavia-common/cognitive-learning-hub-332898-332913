import { Card } from "@/components/ui/Card";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="ui-page">
      <div className="ui-container ui-grid">
        <Topbar
          title="Dashboard"
          subtitle="Soft Gray theme applied globally (typography, spacing, and surfaces)."
        />

        <div className="ui-grid" style={{ gridTemplateColumns: "1fr" }}>
          <Card
            title="Welcome"
            description="This is a minimal scaffold. Your existing pages/components (once added) should use the shared tokens and UI primitives for consistent styling."
            right={
              <span className="ui-pill" aria-label="Theme badge">
                Soft Gray
              </span>
            }
          >
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Button variant="primary">Primary action</Button>
              <Button variant="secondary">Secondary</Button>
            </div>
          </Card>

          <div
            className="ui-grid"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))"
            }}
          >
            <Card
              title="Typography"
              description="Improved heading weights, line-height, and readable default body text."
            />
            <Card
              title="Spacing Scale"
              description="Consistent padding and grid gaps (mobile-first, responsive)."
            />
            <Card
              title="Surfaces"
              description="Soft borders + subtle shadows for a modern minimalist look."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
