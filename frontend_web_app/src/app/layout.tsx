import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cognitive Learning Hub",
  description:
    "Interactive learning platform with exam-style scoring flows (1 attempt, 20 minutes, pass at 80%).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-[var(--color-background)]">
        {children}
      </body>
    </html>
  );
}
